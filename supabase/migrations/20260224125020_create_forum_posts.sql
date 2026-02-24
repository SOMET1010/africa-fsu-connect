-- migration: create forum_posts table with rls
-- purpose: replicate the forum_posts definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for forum_posts operations

-- create the forum_posts table with the canonical columns and constraints
create table public.forum_posts (
  id uuid not null default gen_random_uuid(),
  title text not null,
  content text not null,
  category_id uuid not null,
  author_id uuid not null,
  is_pinned boolean not null default false,
  is_locked boolean not null default false,
  view_count integer not null default 0,
  reply_count integer not null default 0,
  last_reply_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint forum_posts_pkey primary key (id),
  constraint forum_posts_category_id_fkey foreign key (category_id) references public.forum_categories(id),
  constraint forum_posts_author_id_fkey foreign key (author_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.forum_posts enable row level security;

-- allow anonymous read access.
create policy "anon select forum_posts" on public.forum_posts
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert forum_posts" on public.forum_posts
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update forum_posts" on public.forum_posts
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete forum_posts" on public.forum_posts
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select forum_posts" on public.forum_posts
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert forum_posts" on public.forum_posts
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update forum_posts" on public.forum_posts
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete forum_posts" on public.forum_posts
  for delete
  to authenticated
  using (true);
