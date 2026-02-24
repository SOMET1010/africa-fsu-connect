-- migration: create agency_resource_comments table with rls
-- purpose: replicate the agency_resource_comments definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for agency_resource_comments operations

-- create the agency_resource_comments table with the canonical columns and constraints
create table public.agency_resource_comments (
  id uuid not null default gen_random_uuid(),
  resource_id uuid not null,
  user_id uuid not null,
  user_name text not null,
  comment text not null,
  created_at timestamp with time zone not null default now(),
  constraint agency_resource_comments_pkey primary key (id),
  constraint agency_resource_comments_resource_id_fkey foreign key (resource_id) references public.agency_resources(id),
  constraint agency_resource_comments_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.agency_resource_comments enable row level security;

-- allow anonymous read access.
create policy "anon select agency_resource_comments" on public.agency_resource_comments
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert agency_resource_comments" on public.agency_resource_comments
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update agency_resource_comments" on public.agency_resource_comments
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete agency_resource_comments" on public.agency_resource_comments
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select agency_resource_comments" on public.agency_resource_comments
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert agency_resource_comments" on public.agency_resource_comments
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update agency_resource_comments" on public.agency_resource_comments
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete agency_resource_comments" on public.agency_resource_comments
  for delete
  to authenticated
  using (true);
