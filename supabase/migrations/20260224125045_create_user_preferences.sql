-- migration: create user_preferences table with rls
-- purpose: replicate the user_preferences definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for user_preferences operations

-- create the user_preferences table with the canonical columns and constraints
create table public.user_preferences (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null unique,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint user_preferences_pkey primary key (id),
  constraint user_preferences_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.user_preferences enable row level security;

-- allow anonymous read access.
create policy "anon select user_preferences" on public.user_preferences
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert user_preferences" on public.user_preferences
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update user_preferences" on public.user_preferences
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete user_preferences" on public.user_preferences
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select user_preferences" on public.user_preferences
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert user_preferences" on public.user_preferences
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update user_preferences" on public.user_preferences
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete user_preferences" on public.user_preferences
  for delete
  to authenticated
  using (true);
