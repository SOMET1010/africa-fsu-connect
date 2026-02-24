-- migration: create webauthn_credentials table with rls
-- purpose: replicate the webauthn_credentials definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for webauthn_credentials operations

-- create the webauthn_credentials table with the canonical columns and constraints
create table public.webauthn_credentials (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  credential_id text not null unique,
  public_key text not null,
  name text not null,
  device_type text default 'security_key'::text check (device_type = any (array['biometric'::text, 'security_key'::text, 'platform'::text])),
  created_at timestamp with time zone not null default now(),
  last_used timestamp with time zone,
  is_active boolean default true,
  constraint webauthn_credentials_pkey primary key (id),
  constraint webauthn_credentials_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.webauthn_credentials enable row level security;

-- allow anonymous read access.
create policy "anon select webauthn_credentials" on public.webauthn_credentials
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert webauthn_credentials" on public.webauthn_credentials
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update webauthn_credentials" on public.webauthn_credentials
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete webauthn_credentials" on public.webauthn_credentials
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select webauthn_credentials" on public.webauthn_credentials
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert webauthn_credentials" on public.webauthn_credentials
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update webauthn_credentials" on public.webauthn_credentials
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete webauthn_credentials" on public.webauthn_credentials
  for delete
  to authenticated
  using (true);
