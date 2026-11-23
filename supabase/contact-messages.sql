-- Contact form submissions are written by the server using the service-role key.
-- Public users must not insert or read messages directly.
alter table public.contact_messages enable row level security;
revoke all on table public.contact_messages from anon, authenticated;
grant select, insert, update on table public.contact_messages to service_role;
