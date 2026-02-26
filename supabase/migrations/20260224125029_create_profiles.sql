-- migration: create profiles table with rls
-- purpose: replicate the profiles definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for profiles operations

-- create the profiles table with the canonical columns and constraints
create table public.profiles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null unique,
  first_name text,
  last_name text,
  email text,
  role public.user_role not null default 'reader'::public.user_role,
  country text,
  organization text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.profiles enable row level security;

-- allow anonymous read access.
create policy "anon select profiles" on public.profiles
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert profiles" on public.profiles
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update profiles" on public.profiles
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete profiles" on public.profiles
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select profiles" on public.profiles
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert profiles" on public.profiles
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update profiles" on public.profiles
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete profiles" on public.profiles
  for delete
  to authenticated
  using (true);
