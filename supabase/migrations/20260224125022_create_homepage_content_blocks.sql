-- migration: create homepage_content_blocks table with rls
-- purpose: replicate the homepage_content_blocks definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for homepage_content_blocks operations

-- create the homepage_content_blocks table with the canonical columns and constraints
create table public.homepage_content_blocks (
  id uuid not null default gen_random_uuid(),
  block_key text not null unique,
  content_fr jsonb default '{}'::jsonb,
  content_en jsonb default '{}'::jsonb,
  content_ar jsonb default '{}'::jsonb,
  content_pt jsonb default '{}'::jsonb,
  is_visible boolean default true,
  sort_order integer default 0,
  updated_at timestamp with time zone default now(),
  updated_by uuid,
  constraint homepage_content_blocks_pkey primary key (id),
  constraint homepage_content_blocks_updated_by_fkey foreign key (updated_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.homepage_content_blocks enable row level security;

-- allow anonymous read access.
create policy "anon select homepage_content_blocks" on public.homepage_content_blocks
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert homepage_content_blocks" on public.homepage_content_blocks
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update homepage_content_blocks" on public.homepage_content_blocks
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete homepage_content_blocks" on public.homepage_content_blocks
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select homepage_content_blocks" on public.homepage_content_blocks
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert homepage_content_blocks" on public.homepage_content_blocks
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update homepage_content_blocks" on public.homepage_content_blocks
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete homepage_content_blocks" on public.homepage_content_blocks
  for delete
  to authenticated
  using (true);
