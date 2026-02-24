-- migration: create countries table with rls
-- purpose: replicate the countries definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for countries operations

-- create the countries table with the canonical columns and constraints
create table public.countries (
  id uuid not null default gen_random_uuid(),
  code text not null unique,
  name_fr text not null,
  name_en text not null,
  region text,
  continent text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  latitude numeric,
  longitude numeric,
  capital_city text,
  official_language text default 'fr'::text,
  working_languages text[] default array['fr'::text],
  sutel_community text,
  constraint countries_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.countries enable row level security;

-- allow anonymous read access.
create policy "anon select countries" on public.countries
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert countries" on public.countries
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update countries" on public.countries
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete countries" on public.countries
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select countries" on public.countries
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert countries" on public.countries
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update countries" on public.countries
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete countries" on public.countries
  for delete
  to authenticated
  using (true);
