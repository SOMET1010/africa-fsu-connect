-- migration: create forum_replies table with rls
-- purpose: replicate the forum_replies definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for forum_replies operations

-- create the forum_replies table with the canonical columns and constraints
create table public.forum_replies (
  id uuid not null default gen_random_uuid(),
  content text not null,
  post_id uuid not null,
  author_id uuid not null,
  parent_reply_id uuid,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint forum_replies_pkey primary key (id),
  constraint forum_replies_post_id_fkey foreign key (post_id) references public.forum_posts(id),
  constraint forum_replies_author_id_fkey foreign key (author_id) references auth.users(id),
  constraint forum_replies_parent_reply_id_fkey foreign key (parent_reply_id) references public.forum_replies(id)
);

-- enable row level security so downstream policies are enforced
alter table public.forum_replies enable row level security;

-- allow anonymous read access.
create policy "anon select forum_replies" on public.forum_replies
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert forum_replies" on public.forum_replies
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update forum_replies" on public.forum_replies
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete forum_replies" on public.forum_replies
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select forum_replies" on public.forum_replies
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert forum_replies" on public.forum_replies
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update forum_replies" on public.forum_replies
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete forum_replies" on public.forum_replies
  for delete
  to authenticated
  using (true);
