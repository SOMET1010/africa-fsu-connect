-- migration: create forum_categories table with rls
-- purpose: replicate the forum_categories definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for forum_categories operations

-- create the forum_categories table with the canonical columns and constraints
create table public.forum_categories (
  id uuid not null default gen_random_uuid(),
  name text not null,
  description text,
  color text default '#3b82f6'::text,
  created_by uuid not null,
  created_at timestamp with time zone not null default now(),
  constraint forum_categories_pkey primary key (id),
  constraint forum_categories_created_by_fkey foreign key (created_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.forum_categories enable row level security;

-- allow anonymous read access.
create policy "anon select forum_categories" on public.forum_categories
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert forum_categories" on public.forum_categories
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update forum_categories" on public.forum_categories
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete forum_categories" on public.forum_categories
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select forum_categories" on public.forum_categories
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert forum_categories" on public.forum_categories
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update forum_categories" on public.forum_categories
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete forum_categories" on public.forum_categories
  for delete
  to authenticated
  using (true);
