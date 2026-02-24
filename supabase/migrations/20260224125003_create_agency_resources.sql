-- migration: create agency_resources table with rls
-- purpose: replicate the agency_resources definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for agency_resources operations

-- create the agency_resources table with the canonical columns and constraints
create table public.agency_resources (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  external_id text,
  title text not null,
  description text,
  resource_type text not null check (resource_type = any (array['document'::text, 'guide'::text, 'report'::text, 'template'::text, 'tool'::text, 'other'::text])),
  file_url text,
  file_size bigint,
  mime_type text,
  tags text[],
  download_count integer default 0,
  source_url text,
  last_updated_at timestamp with time zone,
  sync_status text default 'synced'::text check (sync_status = any (array['synced'::text, 'modified'::text, 'conflict'::text])),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  access_level text not null default 'public'::text,
  allowed_roles text[] default '{}'::text[],
  shared_with_agencies uuid[] default '{}'::uuid[],
  uploaded_by uuid,
  is_public boolean not null default true,
  current_version text default '1.0'::text,
  constraint agency_resources_pkey primary key (id),
  constraint agency_resources_agency_id_fkey foreign key (agency_id) references public.agencies(id),
  constraint agency_resources_uploaded_by_fkey foreign key (uploaded_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.agency_resources enable row level security;

-- allow anonymous read access.
create policy "anon select agency_resources" on public.agency_resources
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert agency_resources" on public.agency_resources
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update agency_resources" on public.agency_resources
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete agency_resources" on public.agency_resources
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select agency_resources" on public.agency_resources
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert agency_resources" on public.agency_resources
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update agency_resources" on public.agency_resources
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete agency_resources" on public.agency_resources
  for delete
  to authenticated
  using (true);
