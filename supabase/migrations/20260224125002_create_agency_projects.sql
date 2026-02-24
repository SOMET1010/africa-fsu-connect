-- migration: create agency_projects table with rls
-- purpose: replicate the agency_projects definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for agency_projects operations

-- create the agency_projects table with the canonical columns and constraints
create table public.agency_projects (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  external_id text,
  title text not null,
  description text,
  status text not null,
  budget numeric,
  beneficiaries integer,
  start_date date,
  end_date date,
  completion_percentage integer default 0 check (completion_percentage >= 0 and completion_percentage <= 100),
  tags text[],
  location text,
  coordinates point,
  source_url text,
  last_updated_at timestamp with time zone,
  sync_status text default 'synced'::text check (sync_status = any (array['synced'::text, 'modified'::text, 'conflict'::text])),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint agency_projects_pkey primary key (id),
  constraint agency_projects_agency_id_fkey foreign key (agency_id) references public.agencies(id)
);

-- enable row level security so downstream policies are enforced
alter table public.agency_projects enable row level security;

-- allow anonymous read access.
create policy "anon select agency_projects" on public.agency_projects
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert agency_projects" on public.agency_projects
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update agency_projects" on public.agency_projects
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete agency_projects" on public.agency_projects
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select agency_projects" on public.agency_projects
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert agency_projects" on public.agency_projects
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update agency_projects" on public.agency_projects
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete agency_projects" on public.agency_projects
  for delete
  to authenticated
  using (true);
