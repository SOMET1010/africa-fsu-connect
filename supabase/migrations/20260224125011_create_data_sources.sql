-- migration: create data_sources table with rls
-- purpose: replicate the data_sources definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for data_sources operations

-- create the data_sources table with the canonical columns and constraints
create table public.data_sources (
  id uuid not null default gen_random_uuid(),
  name text not null,
  acronym text not null,
  description text,
  website_url text,
  api_endpoint text,
  api_key_required boolean default false,
  update_frequency text default 'monthly'::text,
  is_active boolean default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint data_sources_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.data_sources enable row level security;

-- allow anonymous read access.
create policy "anon select data_sources" on public.data_sources
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert data_sources" on public.data_sources
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update data_sources" on public.data_sources
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete data_sources" on public.data_sources
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select data_sources" on public.data_sources
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert data_sources" on public.data_sources
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update data_sources" on public.data_sources
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete data_sources" on public.data_sources
  for delete
  to authenticated
  using (true);
