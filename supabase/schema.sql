-- SUDF initial public-content schema.
-- Do not add individual patient/health records to these public tables.
-- Health screening records, if needed later, should live in a separately
-- restricted system with strict RLS, minimal data collection and audit logging.

create extension if not exists "pgcrypto";

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  summary text,
  description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  registration_url text,
  status text not null default 'draft' check (status in ('draft','published','cancelled','completed')),
  created_at timestamptz not null default now()
);

create table if not exists impact_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null,
  metric_value numeric,
  unit text,
  period_start date,
  period_end date,
  source_note text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','read','resolved')),
  created_at timestamptz not null default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table programs enable row level security;
alter table events enable row level security;
alter table impact_metrics enable row level security;
alter table news enable row level security;
alter table contact_messages enable row level security;
alter table newsletter_subscribers enable row level security;

create policy "public can read published programs"
on programs for select using (status = 'published');

create policy "public can read published events"
on events for select using (status in ('published','completed'));

create policy "public can read verified impact metrics"
on impact_metrics for select using (verified = true);

create policy "public can read published news"
on news for select using (status = 'published');

-- Contact/newsletter writes should be handled through secure server-side
-- endpoints or Edge Functions with validation/rate limiting. Do not expose
-- broad anonymous insert policies in production without abuse protection.
