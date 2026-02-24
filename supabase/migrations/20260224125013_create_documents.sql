-- migration: create documents table with rls
-- purpose: replicate the documents definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for documents operations

-- create the documents table with the canonical columns and constraints
create table public.documents (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  file_url text,
  file_name text,
  file_size bigint,
  mime_type text,
  document_type public.document_type not null default 'autre'::public.document_type,
  country text,
  tags text[],
  uploaded_by uuid not null,
  is_public boolean not null default true,
  download_count integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  view_count integer default 0,
  featured boolean default false,
  access_level text not null default 'public'::text,
  allowed_roles text[] default '{}'::text[],
  constraint documents_pkey primary key (id),
  constraint documents_uploaded_by_fkey foreign key (uploaded_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.documents enable row level security;

-- allow anonymous read access.
create policy "anon select documents" on public.documents
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert documents" on public.documents
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update documents" on public.documents
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete documents" on public.documents
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select documents" on public.documents
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert documents" on public.documents
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update documents" on public.documents
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete documents" on public.documents
  for delete
  to authenticated
  using (true);
