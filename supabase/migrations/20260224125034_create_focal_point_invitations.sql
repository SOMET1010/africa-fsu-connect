-- migration: create focal_point_invitations table with rls
-- purpose: replicate the focal_point_invitations definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for focal_point_invitations operations

-- create the focal_point_invitations table with the canonical columns and constraints
create table public.focal_point_invitations (
  id uuid not null default gen_random_uuid(),
  focal_point_id uuid not null,
  email text not null,
  token uuid not null default gen_random_uuid() unique,
  sent_at timestamp with time zone default now(),
  expires_at timestamp with time zone default (now() + '30 days'::interval),
  accepted_at timestamp with time zone,
  status text not null default 'pending'::text check (status = any (array['pending'::text, 'accepted'::text, 'expired'::text, 'cancelled'::text])),
  created_at timestamp with time zone not null default now(),
  constraint focal_point_invitations_pkey primary key (id),
  constraint focal_point_invitations_focal_point_id_fkey foreign key (focal_point_id) references public.focal_points(id)
);

-- enable row level security so downstream policies are enforced
alter table public.focal_point_invitations enable row level security;

-- allow anonymous read access.
create policy "anon select focal_point_invitations" on public.focal_point_invitations
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert focal_point_invitations" on public.focal_point_invitations
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update focal_point_invitations" on public.focal_point_invitations
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete focal_point_invitations" on public.focal_point_invitations
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select focal_point_invitations" on public.focal_point_invitations
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert focal_point_invitations" on public.focal_point_invitations
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update focal_point_invitations" on public.focal_point_invitations
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete focal_point_invitations" on public.focal_point_invitations
  for delete
  to authenticated
  using (true);
