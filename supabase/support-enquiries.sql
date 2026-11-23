-- SUDF support and donation enquiries.
-- Run this migration in the Supabase SQL Editor before enabling the public form.
-- Do not store payment card/bank credentials or patient health information here.

create table if not exists public.support_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  organisation text,
  support_type text not null,
  support_area text not null,
  indicative_amount text,
  message text,
  status text not null default 'new' check (status in ('new','read','responded','closed')),
  created_at timestamptz not null default now()
);

alter table public.support_enquiries enable row level security;

-- No anonymous policies are intentionally created.
-- Public submissions are inserted only by the server using the service-role key.
-- Restrict table access to trusted server/admin roles.
revoke all on table public.support_enquiries from anon, authenticated;
grant select, insert, update on table public.support_enquiries to service_role;
