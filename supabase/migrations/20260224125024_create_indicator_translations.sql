-- migration: create indicator_translations table with rls
-- purpose: replicate the indicator_translations definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for indicator_translations operations

-- create the indicator_translations table with the canonical columns and constraints
create table public.indicator_translations (
  id uuid not null default gen_random_uuid(),
  indicator_code text not null,
  language_code text not null,
  display_name text not null,
  description text,
  category_name text,
  unit_display text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint indicator_translations_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.indicator_translations enable row level security;

-- allow anonymous read access.
create policy "anon select indicator_translations" on public.indicator_translations
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert indicator_translations" on public.indicator_translations
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update indicator_translations" on public.indicator_translations
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete indicator_translations" on public.indicator_translations
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select indicator_translations" on public.indicator_translations
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert indicator_translations" on public.indicator_translations
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update indicator_translations" on public.indicator_translations
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete indicator_translations" on public.indicator_translations
  for delete
  to authenticated
  using (true);
