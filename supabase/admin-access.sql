-- SUDF administrator identity and audit foundation.
-- Only trusted server-side service-role code can access these tables.
create table if not exists public.sudf_admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('super_admin', 'content_editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sudf_admin_users_role_idx on public.sudf_admin_users(role, is_active);
alter table public.sudf_admin_users enable row level security;
revoke all on table public.sudf_admin_users from anon, authenticated;
grant all on table public.sudf_admin_users to service_role;

create table if not exists public.sudf_admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_auth_user_id uuid references auth.users(id) on delete set null,
  actor_email text,
  actor_role text check (actor_role is null or actor_role in ('super_admin', 'content_editor')),
  action text not null,
  resource_type text not null,
  resource_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists sudf_admin_audit_logs_created_at_idx on public.sudf_admin_audit_logs(created_at desc);
create index if not exists sudf_admin_audit_logs_actor_idx on public.sudf_admin_audit_logs(actor_auth_user_id, created_at desc);
alter table public.sudf_admin_audit_logs enable row level security;
revoke all on table public.sudf_admin_audit_logs from anon, authenticated;
grant all on table public.sudf_admin_audit_logs to service_role;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
