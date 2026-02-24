-- migration: create notifications table with rls
-- purpose: replicate the notifications definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for notifications operations

-- create the notifications table with the canonical columns and constraints
create table public.notifications (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  message text not null,
  type text not null default 'info'::text,
  is_read boolean not null default false,
  action_url text,
  created_at timestamp with time zone not null default now(),
  constraint notifications_pkey primary key (id),
  constraint notifications_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.notifications enable row level security;

-- allow anonymous read access.
create policy "anon select notifications" on public.notifications
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert notifications" on public.notifications
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update notifications" on public.notifications
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete notifications" on public.notifications
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select notifications" on public.notifications
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert notifications" on public.notifications
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update notifications" on public.notifications
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete notifications" on public.notifications
  for delete
  to authenticated
  using (true);
