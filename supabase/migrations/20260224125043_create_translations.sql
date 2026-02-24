-- migration: create translations table with rls
-- purpose: replicate the translations definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for translations operations

-- create the translations table with the canonical columns and constraints
create table public.translations (
  id uuid not null default gen_random_uuid(),
  language_id uuid not null,
  namespace_id uuid not null,
  key text not null,
  value text not null,
  context text,
  version integer not null default 1,
  is_approved boolean not null default false,
  created_by uuid,
  approved_by uuid,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint translations_pkey primary key (id),
  constraint translations_language_id_fkey foreign key (language_id) references public.languages(id),
  constraint translations_namespace_id_fkey foreign key (namespace_id) references public.translation_namespaces(id),
  constraint translations_created_by_fkey foreign key (created_by) references auth.users(id),
  constraint translations_approved_by_fkey foreign key (approved_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.translations enable row level security;

-- allow anonymous read access.
create policy "anon select translations" on public.translations
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert translations" on public.translations
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update translations" on public.translations
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete translations" on public.translations
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select translations" on public.translations
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert translations" on public.translations
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update translations" on public.translations
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete translations" on public.translations
  for delete
  to authenticated
  using (true);
