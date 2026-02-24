-- migration: create languages table with rls
-- purpose: replicate the languages definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for languages operations

-- create the languages table with the canonical columns and constraints
create table public.languages (
  id uuid not null default gen_random_uuid(),
  code text not null unique,
  name text not null,
  native_name text not null,
  is_active boolean not null default true,
  is_default boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint languages_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.languages enable row level security;

-- allow anonymous read access.
create policy "anon select languages" on public.languages
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert languages" on public.languages
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update languages" on public.languages
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete languages" on public.languages
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select languages" on public.languages
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert languages" on public.languages
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update languages" on public.languages
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete languages" on public.languages
  for delete
  to authenticated
  using (true);
