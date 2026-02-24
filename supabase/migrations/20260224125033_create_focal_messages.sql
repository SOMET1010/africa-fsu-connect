-- migration: create focal_messages table with rls
-- purpose: replicate the focal_messages definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for focal_messages operations

-- create the focal_messages table with the canonical columns and constraints
create table public.focal_messages (
  id uuid not null default gen_random_uuid(),
  conversation_id uuid,
  sender_id uuid,
  sender_user_id uuid,
  content text not null,
  attachment_url text,
  attachment_type text,
  indicator_reference text,
  is_system_message boolean default false,
  created_at timestamp with time zone default now(),
  edited_at timestamp with time zone,
  constraint focal_messages_pkey primary key (id),
  constraint focal_messages_conversation_id_fkey foreign key (conversation_id) references public.focal_conversations(id),
  constraint focal_messages_sender_id_fkey foreign key (sender_id) references public.focal_points(id),
  constraint focal_messages_sender_user_id_fkey foreign key (sender_user_id) references public.profiles(id)
);

-- enable row level security so downstream policies are enforced
alter table public.focal_messages enable row level security;

-- allow anonymous read access.
create policy "anon select focal_messages" on public.focal_messages
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert focal_messages" on public.focal_messages
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update focal_messages" on public.focal_messages
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete focal_messages" on public.focal_messages
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select focal_messages" on public.focal_messages
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert focal_messages" on public.focal_messages
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update focal_messages" on public.focal_messages
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete focal_messages" on public.focal_messages
  for delete
  to authenticated
  using (true);
