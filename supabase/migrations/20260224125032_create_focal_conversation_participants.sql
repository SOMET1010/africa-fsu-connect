-- migration: create focal_conversation_participants table with rls
-- purpose: replicate the focal_conversation_participants definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for focal_conversation_participants operations

-- create the focal_conversation_participants table with the canonical columns and constraints
create table public.focal_conversation_participants (
  id uuid not null default gen_random_uuid(),
  conversation_id uuid,
  focal_point_id uuid,
  user_id uuid,
  joined_at timestamp with time zone default now(),
  last_read_at timestamp with time zone,
  is_muted boolean default false,
  constraint focal_conversation_participants_pkey primary key (id),
  constraint focal_conversation_participants_conversation_id_fkey foreign key (conversation_id) references public.focal_conversations(id),
  constraint focal_conversation_participants_focal_point_id_fkey foreign key (focal_point_id) references public.focal_points(id),
  constraint focal_conversation_participants_user_id_fkey foreign key (user_id) references public.profiles(id)
);

-- enable row level security so downstream policies are enforced
alter table public.focal_conversation_participants enable row level security;

-- allow anonymous read access.
create policy "anon select focal_conversation_participants" on public.focal_conversation_participants
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert focal_conversation_participants" on public.focal_conversation_participants
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update focal_conversation_participants" on public.focal_conversation_participants
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete focal_conversation_participants" on public.focal_conversation_participants
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select focal_conversation_participants" on public.focal_conversation_participants
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert focal_conversation_participants" on public.focal_conversation_participants
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update focal_conversation_participants" on public.focal_conversation_participants
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete focal_conversation_participants" on public.focal_conversation_participants
  for delete
  to authenticated
  using (true);
