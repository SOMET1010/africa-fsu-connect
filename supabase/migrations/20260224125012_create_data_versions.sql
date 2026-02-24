-- migration: create data_versions table with rls
-- purpose: replicate the data_versions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for data_versions operations

-- create the data_versions table with the canonical columns and constraints
create table public.data_versions (
  id uuid not null default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  version_number integer not null,
  data_snapshot jsonb not null,
  created_at timestamp with time zone not null default now(),
  created_by uuid,
  sync_id uuid,
  change_type text not null default 'update'::text,
  constraint data_versions_pkey primary key (id),
  constraint data_versions_created_by_fkey foreign key (created_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.data_versions enable row level security;

-- allow anonymous read access.
create policy "anon select data_versions" on public.data_versions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert data_versions" on public.data_versions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update data_versions" on public.data_versions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete data_versions" on public.data_versions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select data_versions" on public.data_versions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert data_versions" on public.data_versions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update data_versions" on public.data_versions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete data_versions" on public.data_versions
  for delete
  to authenticated
  using (true);
