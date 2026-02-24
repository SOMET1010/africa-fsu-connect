-- migration: create sync_logs table with rls
-- purpose: replicate the sync_logs definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for sync_logs operations

-- create the sync_logs table with the canonical columns and constraints
create table public.sync_logs (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  connector_id uuid,
  sync_type text not null check (sync_type = any (array['full'::text, 'incremental'::text, 'manual'::text])),
  status text not null check (status = any (array['started'::text, 'completed'::text, 'failed'::text, 'partial'::text])),
  records_processed integer default 0,
  records_created integer default 0,
  records_updated integer default 0,
  records_failed integer default 0,
  error_details jsonb,
  duration_ms integer,
  started_at timestamp with time zone not null default now(),
  completed_at timestamp with time zone,
  constraint sync_logs_pkey primary key (id),
  constraint sync_logs_agency_id_fkey foreign key (agency_id) references public.agencies(id),
  constraint sync_logs_connector_id_fkey foreign key (connector_id) references public.agency_connectors(id)
);

-- enable row level security so downstream policies are enforced
alter table public.sync_logs enable row level security;

-- allow anonymous read access.
create policy "anon select sync_logs" on public.sync_logs
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert sync_logs" on public.sync_logs
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update sync_logs" on public.sync_logs
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete sync_logs" on public.sync_logs
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select sync_logs" on public.sync_logs
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert sync_logs" on public.sync_logs
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update sync_logs" on public.sync_logs
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete sync_logs" on public.sync_logs
  for delete
  to authenticated
  using (true);
