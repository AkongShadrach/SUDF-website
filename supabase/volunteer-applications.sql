-- SUDF volunteer applications.
-- Run this migration in the Supabase SQL Editor before accepting public applications.
-- Applications contain personal information and must remain private.
-- Never store patient health records or unnecessary identity documents in this table.

create table if not exists public.volunteer_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  state text not null,
  lga text,
  volunteer_area text not null,
  profession text not null,
  specialisation text,
  qualifications text,
  registration_number text,
  experience text,
  availability text not null,
  motivation text not null,
  contact_consent boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'under_review', 'approved', 'declined', 'withdrawn')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.volunteer_applications enable row level security;

-- No public read or write policies are created.
-- The public form submits through the server using SUPABASE_SERVICE_ROLE_KEY.
revoke all on table public.volunteer_applications from anon, authenticated;
grant select, insert, update on table public.volunteer_applications to service_role;

create index if not exists volunteer_applications_created_at_idx
  on public.volunteer_applications (created_at desc);
create index if not exists volunteer_applications_status_idx
  on public.volunteer_applications (status);
