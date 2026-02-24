-- migration: create universal_service_indicators table with rls
-- purpose: replicate the universal_service_indicators definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for universal_service_indicators operations

-- create the universal_service_indicators table with the canonical columns and constraints
create table public.universal_service_indicators (
  id uuid not null default gen_random_uuid(),
  indicator_code text not null,
  indicator_name text not null,
  value numeric,
  unit text,
  country_code text,
  region text,
  year integer not null,
  quarter integer,
  data_source text not null,
  source_url text,
  last_updated_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  metadata jsonb default '{}'::jsonb,
  constraint universal_service_indicators_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.universal_service_indicators enable row level security;

-- allow anonymous read access.
create policy "anon select universal_service_indicators" on public.universal_service_indicators
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert universal_service_indicators" on public.universal_service_indicators
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update universal_service_indicators" on public.universal_service_indicators
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete universal_service_indicators" on public.universal_service_indicators
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select universal_service_indicators" on public.universal_service_indicators
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert universal_service_indicators" on public.universal_service_indicators
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update universal_service_indicators" on public.universal_service_indicators
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete universal_service_indicators" on public.universal_service_indicators
  for delete
  to authenticated
  using (true);
