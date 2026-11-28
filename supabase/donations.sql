-- SUDF donation management foundation.
-- Apply this migration in the Supabase SQL Editor before enabling donation submissions.
-- Payment credentials and raw card/bank details must never be stored in these tables.

create extension if not exists "pgcrypto";

create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text,
  organisation text,
  contact_consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.donors(id) on delete restrict,
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'NGN' check (currency = 'NGN'),
  purpose text not null default 'General support',
  message text,
  source text not null check (source in ('support_form','quick_donate')),
  status text not null default 'pending'
    check (status in ('pending','paid','failed','cancelled','pledged','manual_review')),
  idempotency_key uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donation_payments (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations(id) on delete restrict,
  provider text not null default 'unselected'
    check (provider in ('unselected','paystack','flutterwave','manual_bank')),
  payment_method text
    check (payment_method is null or payment_method in ('card','bank_transfer','ussd','manual_bank')),
  provider_reference text unique,
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'NGN' check (currency = 'NGN'),
  status text not null default 'pending'
    check (status in ('pending','successful','failed','abandoned','under_review')),
  verified_at timestamptz,
  provider_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donation_receipts (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null unique references public.donations(id) on delete restrict,
  receipt_number text not null unique,
  issued_at timestamptz not null default now(),
  issued_by uuid
);

create index if not exists donors_email_idx on public.donors (email);
create index if not exists donations_donor_id_idx on public.donations (donor_id);
create index if not exists donations_status_created_idx on public.donations (status, created_at desc);
create index if not exists donation_payments_donation_id_idx on public.donation_payments (donation_id);
create index if not exists donation_payments_status_idx on public.donation_payments (status, created_at desc);

alter table public.donors enable row level security;
alter table public.donations enable row level security;
alter table public.donation_payments enable row level security;
alter table public.donation_receipts enable row level security;

-- Public writes are deliberately routed through validated server endpoints.
-- No anonymous or authenticated policies are created for donor/payment data.
revoke all on table public.donors from anon, authenticated;
revoke all on table public.donations from anon, authenticated;
revoke all on table public.donation_payments from anon, authenticated;
revoke all on table public.donation_receipts from anon, authenticated;

grant select, insert, update on table public.donors to service_role;
grant select, insert, update on table public.donations to service_role;
grant select, insert, update on table public.donation_payments to service_role;
grant select, insert on table public.donation_receipts to service_role;
