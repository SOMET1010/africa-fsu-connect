-- migration: create sync_workflows table with rls
-- purpose: replicate the sync_workflows definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for sync_workflows operations

-- create the sync_workflows table with the canonical columns and constraints
create table public.sync_workflows (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  workflow_name text not null,
  description text,
  steps jsonb not null default '[]'::jsonb,
  conditions jsonb default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid,
  constraint sync_workflows_pkey primary key (id),
  constraint sync_workflows_agency_id_fkey foreign key (agency_id) references public.agencies(id),
  constraint sync_workflows_created_by_fkey foreign key (created_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.sync_workflows enable row level security;

-- allow anonymous read access.
create policy "anon select sync_workflows" on public.sync_workflows
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert sync_workflows" on public.sync_workflows
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update sync_workflows" on public.sync_workflows
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete sync_workflows" on public.sync_workflows
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select sync_workflows" on public.sync_workflows
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert sync_workflows" on public.sync_workflows
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update sync_workflows" on public.sync_workflows
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete sync_workflows" on public.sync_workflows
  for delete
  to authenticated
  using (true);
