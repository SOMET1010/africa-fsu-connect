-- migration: create security_preferences table with rls
-- purpose: replicate the security_preferences definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for security_preferences operations

-- create the security_preferences table with the canonical columns and constraints
create table public.security_preferences (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null unique,
  two_factor_enabled boolean default false,
  two_factor_secret text,
  backup_codes text[],
  login_notifications boolean default true,
  security_alerts boolean default true,
  session_timeout integer default 7200,
  max_concurrent_sessions integer default 3,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  e2e_encryption_enabled boolean default false,
  constraint security_preferences_pkey primary key (id),
  constraint security_preferences_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.security_preferences enable row level security;

-- allow anonymous read access.
create policy "anon select security_preferences" on public.security_preferences
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert security_preferences" on public.security_preferences
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update security_preferences" on public.security_preferences
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete security_preferences" on public.security_preferences
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select security_preferences" on public.security_preferences
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert security_preferences" on public.security_preferences
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update security_preferences" on public.security_preferences
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete security_preferences" on public.security_preferences
  for delete
  to authenticated
  using (true);
