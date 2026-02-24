-- migration: create events table with rls
-- purpose: replicate the events definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for events operations

-- create the events table with the canonical columns and constraints
create table public.events (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  start_date timestamp with time zone not null,
  end_date timestamp with time zone not null,
  location text,
  is_virtual boolean not null default false,
  virtual_link text,
  max_attendees integer,
  current_attendees integer not null default 0,
  created_by uuid not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint events_pkey primary key (id),
  constraint events_created_by_fkey foreign key (created_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.events enable row level security;

-- allow anonymous read access.
create policy "anon select events" on public.events
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert events" on public.events
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update events" on public.events
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete events" on public.events
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select events" on public.events
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert events" on public.events
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update events" on public.events
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete events" on public.events
  for delete
  to authenticated
  using (true);
