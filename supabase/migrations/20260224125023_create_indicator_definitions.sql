-- migration: create indicator_definitions table with rls
-- purpose: replicate the indicator_definitions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for indicator_definitions operations

-- create the indicator_definitions table with the canonical columns and constraints
create table public.indicator_definitions (
  id uuid not null default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  unit text,
  category text,
  data_type text default 'numeric'::text,
  calculation_method text,
  source_organization text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint indicator_definitions_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.indicator_definitions enable row level security;

-- allow anonymous read access.
create policy "anon select indicator_definitions" on public.indicator_definitions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert indicator_definitions" on public.indicator_definitions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update indicator_definitions" on public.indicator_definitions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete indicator_definitions" on public.indicator_definitions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select indicator_definitions" on public.indicator_definitions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert indicator_definitions" on public.indicator_definitions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update indicator_definitions" on public.indicator_definitions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete indicator_definitions" on public.indicator_definitions
  for delete
  to authenticated
  using (true);
