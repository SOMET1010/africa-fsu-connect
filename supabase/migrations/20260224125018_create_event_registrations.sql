-- migration: create event_registrations table with rls
-- purpose: replicate the event_registrations definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for event_registrations operations

-- create the event_registrations table with the canonical columns and constraints
create table public.event_registrations (
  id uuid not null default gen_random_uuid(),
  event_id uuid not null,
  user_id uuid not null,
  registered_at timestamp with time zone not null default now(),
  constraint event_registrations_pkey primary key (id),
  constraint event_registrations_event_id_fkey foreign key (event_id) references public.events(id),
  constraint event_registrations_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.event_registrations enable row level security;

-- allow anonymous read access.
create policy "anon select event_registrations" on public.event_registrations
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert event_registrations" on public.event_registrations
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update event_registrations" on public.event_registrations
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete event_registrations" on public.event_registrations
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select event_registrations" on public.event_registrations
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert event_registrations" on public.event_registrations
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update event_registrations" on public.event_registrations
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete event_registrations" on public.event_registrations
  for delete
  to authenticated
  using (true);
