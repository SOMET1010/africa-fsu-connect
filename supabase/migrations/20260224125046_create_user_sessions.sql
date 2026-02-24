-- migration: create user_sessions table with rls
-- purpose: replicate the user_sessions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for user_sessions operations

-- create the user_sessions table with the canonical columns and constraints
create table public.user_sessions (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  session_token text not null unique,
  ip_address inet,
  user_agent text,
  location text,
  is_active boolean default true,
  last_activity timestamp with time zone default now(),
  expires_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint user_sessions_pkey primary key (id),
  constraint user_sessions_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.user_sessions enable row level security;

-- allow anonymous read access.
create policy "anon select user_sessions" on public.user_sessions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert user_sessions" on public.user_sessions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update user_sessions" on public.user_sessions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete user_sessions" on public.user_sessions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select user_sessions" on public.user_sessions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert user_sessions" on public.user_sessions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update user_sessions" on public.user_sessions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete user_sessions" on public.user_sessions
  for delete
  to authenticated
  using (true);
