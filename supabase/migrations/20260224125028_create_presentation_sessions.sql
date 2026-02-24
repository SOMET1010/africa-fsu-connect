-- migration: create presentation_sessions table with rls
-- purpose: replicate the presentation_sessions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for presentation_sessions operations

-- create the presentation_sessions table with the canonical columns and constraints
create table public.presentation_sessions (
  id uuid not null default gen_random_uuid(),
  session_id text not null unique,
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone,
  total_duration integer,
  user_agent text,
  country text,
  sections_visited text[],
  section_durations jsonb,
  interactions jsonb,
  completed boolean default false,
  completion_rate numeric,
  device_type text,
  screen_resolution text,
  created_at timestamp with time zone default now(),
  constraint presentation_sessions_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.presentation_sessions enable row level security;

-- allow anonymous read access.
create policy "anon select presentation_sessions" on public.presentation_sessions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert presentation_sessions" on public.presentation_sessions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update presentation_sessions" on public.presentation_sessions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete presentation_sessions" on public.presentation_sessions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select presentation_sessions" on public.presentation_sessions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert presentation_sessions" on public.presentation_sessions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update presentation_sessions" on public.presentation_sessions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete presentation_sessions" on public.presentation_sessions
  for delete
  to authenticated
  using (true);
