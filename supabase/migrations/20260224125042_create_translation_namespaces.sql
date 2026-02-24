-- migration: create translation_namespaces table with rls
-- purpose: replicate the translation_namespaces definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for translation_namespaces operations

-- create the translation_namespaces table with the canonical columns and constraints
create table public.translation_namespaces (
  id uuid not null default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint translation_namespaces_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.translation_namespaces enable row level security;

-- allow anonymous read access.
create policy "anon select translation_namespaces" on public.translation_namespaces
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert translation_namespaces" on public.translation_namespaces
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update translation_namespaces" on public.translation_namespaces
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete translation_namespaces" on public.translation_namespaces
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select translation_namespaces" on public.translation_namespaces
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert translation_namespaces" on public.translation_namespaces
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update translation_namespaces" on public.translation_namespaces
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete translation_namespaces" on public.translation_namespaces
  for delete
  to authenticated
  using (true);
