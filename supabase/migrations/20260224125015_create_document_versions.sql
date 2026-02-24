-- migration: create document_versions table with rls
-- purpose: replicate the document_versions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for document_versions operations

-- create the document_versions table with the canonical columns and constraints
create table public.document_versions (
  id uuid not null default gen_random_uuid(),
  document_id uuid not null,
  version text not null,
  file_url text not null,
  file_name text not null,
  file_size bigint not null,
  changes_summary text not null,
  uploaded_at timestamp with time zone not null default now(),
  uploaded_by uuid not null,
  constraint document_versions_pkey primary key (id),
  constraint document_versions_document_id_fkey foreign key (document_id) references public.documents(id)
);

-- enable row level security so downstream policies are enforced
alter table public.document_versions enable row level security;

-- allow anonymous read access.
create policy "anon select document_versions" on public.document_versions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert document_versions" on public.document_versions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update document_versions" on public.document_versions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete document_versions" on public.document_versions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select document_versions" on public.document_versions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert document_versions" on public.document_versions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update document_versions" on public.document_versions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete document_versions" on public.document_versions
  for delete
  to authenticated
  using (true);
