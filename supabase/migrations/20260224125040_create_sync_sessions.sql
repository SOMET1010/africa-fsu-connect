-- migration: create sync_sessions table with rls
-- purpose: replicate the sync_sessions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for sync_sessions operations

-- create the sync_sessions table with the canonical columns and constraints
create table public.sync_sessions (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  connector_id uuid not null,
  session_type text not null default 'bidirectional'::text,
  status text not null default 'active'::text,
  started_at timestamp with time zone not null default now(),
  ended_at timestamp with time zone,
  records_processed integer default 0,
  conflicts_detected integer default 0,
  websocket_id text,
  metadata jsonb default '{}'::jsonb,
  constraint sync_sessions_pkey primary key (id),
  constraint sync_sessions_agency_id_fkey foreign key (agency_id) references public.agencies(id),
  constraint sync_sessions_connector_id_fkey foreign key (connector_id) references public.agency_connectors(id)
);

-- enable row level security so downstream policies are enforced
alter table public.sync_sessions enable row level security;

-- allow anonymous read access.
create policy "anon select sync_sessions" on public.sync_sessions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert sync_sessions" on public.sync_sessions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update sync_sessions" on public.sync_sessions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete sync_sessions" on public.sync_sessions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select sync_sessions" on public.sync_sessions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert sync_sessions" on public.sync_sessions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update sync_sessions" on public.sync_sessions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete sync_sessions" on public.sync_sessions
  for delete
  to authenticated
  using (true);
