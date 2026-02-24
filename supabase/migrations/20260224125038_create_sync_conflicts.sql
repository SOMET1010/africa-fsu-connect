-- migration: create sync_conflicts table with rls
-- purpose: replicate the sync_conflicts definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for sync_conflicts operations

-- create the sync_conflicts table with the canonical columns and constraints
create table public.sync_conflicts (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  table_name text not null,
  record_id uuid not null,
  source_data jsonb not null,
  target_data jsonb not null,
  conflict_type text not null,
  resolution_strategy text,
  resolved_data jsonb,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  created_at timestamp with time zone not null default now(),
  is_resolved boolean not null default false,
  constraint sync_conflicts_pkey primary key (id),
  constraint sync_conflicts_agency_id_fkey foreign key (agency_id) references public.agencies(id),
  constraint sync_conflicts_resolved_by_fkey foreign key (resolved_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.sync_conflicts enable row level security;

-- allow anonymous read access.
create policy "anon select sync_conflicts" on public.sync_conflicts
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert sync_conflicts" on public.sync_conflicts
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update sync_conflicts" on public.sync_conflicts
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete sync_conflicts" on public.sync_conflicts
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select sync_conflicts" on public.sync_conflicts
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert sync_conflicts" on public.sync_conflicts
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update sync_conflicts" on public.sync_conflicts
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete sync_conflicts" on public.sync_conflicts
  for delete
  to authenticated
  using (true);
