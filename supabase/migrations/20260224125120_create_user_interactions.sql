-- migration: create user_interactions table with rls
-- purpose: record UI interactions that were previously mocked locally so analytics can be centralized
-- notes: this supports the PerformanceAnalytics hook mentioned in the mock audit

create table public.user_interactions (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  action_type text not null,
  element_type text not null,
  element_id text,
  page_url text,
  duration numeric,
  metadata jsonb,
  created_at timestamp with time zone not null default now(),
  constraint user_interactions_pkey primary key (id),
  constraint user_interactions_user_id_fkey foreign key (user_id) references auth.users(id)
);

alter table public.user_interactions enable row level security;

create policy "anon select user_interactions" on public.user_interactions
  for select
  to anon
  using (false);
create policy "anon insert user_interactions" on public.user_interactions
  for insert
  to anon
  with check (false);
create policy "anon update user_interactions" on public.user_interactions
  for update
  to anon
  using (false);
create policy "anon delete user_interactions" on public.user_interactions
  for delete
  to anon
  using (false);

create policy "authenticated select user_interactions" on public.user_interactions
  for select
  to authenticated
  using (true);
create policy "authenticated insert user_interactions" on public.user_interactions
  for insert
  to authenticated
  with check (true);
create policy "authenticated update user_interactions" on public.user_interactions
  for update
  to authenticated
  using (true)
  with check (true);
create policy "authenticated delete user_interactions" on public.user_interactions
  for delete
  to authenticated
  using (true);
