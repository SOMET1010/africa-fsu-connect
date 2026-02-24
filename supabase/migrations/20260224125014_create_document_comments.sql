-- migration: create document_comments table with rls
-- purpose: replicate the document_comments definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for document_comments operations

-- create the document_comments table with the canonical columns and constraints
create table public.document_comments (
  id uuid not null default gen_random_uuid(),
  document_id uuid not null,
  user_id uuid not null,
  user_name text not null,
  comment text not null,
  section text,
  created_at timestamp with time zone not null default now(),
  constraint document_comments_pkey primary key (id),
  constraint document_comments_document_id_fkey foreign key (document_id) references public.documents(id)
);

-- enable row level security so downstream policies are enforced
alter table public.document_comments enable row level security;

-- allow anonymous read access.
create policy "anon select document_comments" on public.document_comments
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert document_comments" on public.document_comments
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update document_comments" on public.document_comments
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete document_comments" on public.document_comments
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select document_comments" on public.document_comments
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert document_comments" on public.document_comments
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update document_comments" on public.document_comments
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete document_comments" on public.document_comments
  for delete
  to authenticated
  using (true);
