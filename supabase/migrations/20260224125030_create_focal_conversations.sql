-- migration: create focal_conversations table with rls
-- purpose: replicate the focal_conversations definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for focal_conversations operations

-- create the focal_conversations table with the canonical columns and constraints
create table public.focal_conversations (
  id uuid not null default gen_random_uuid(),
  type text not null check (type = any (array['country_team'::text, 'direct'::text, 'group'::text])),
  country_code text,
  name text,
  created_at timestamp with time zone default now(),
  created_by uuid,
  updated_at timestamp with time zone default now(),
  constraint focal_conversations_pkey primary key (id),
  constraint focal_conversations_created_by_fkey foreign key (created_by) references public.profiles(id)
);

-- enable row level security so downstream policies are enforced
alter table public.focal_conversations enable row level security;

-- allow anonymous read access.
create policy "anon select focal_conversations" on public.focal_conversations
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert focal_conversations" on public.focal_conversations
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update focal_conversations" on public.focal_conversations
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete focal_conversations" on public.focal_conversations
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select focal_conversations" on public.focal_conversations
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert focal_conversations" on public.focal_conversations
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update focal_conversations" on public.focal_conversations
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete focal_conversations" on public.focal_conversations
  for delete
  to authenticated
  using (true);
