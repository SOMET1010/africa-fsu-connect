-- migration: create focal_points table with rls
-- purpose: replicate the focal_points definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for focal_points operations

-- create the focal_points table with the canonical columns and constraints
create table public.focal_points (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  country_code text not null,
  designation_type text not null check (designation_type = any (array['primary'::text, 'secondary'::text])),
  designated_by text,
  designation_document_url text,
  designation_date date default current_date,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  whatsapp_number text,
  organization text,
  job_title text,
  status text not null default 'pending'::text check (status = any (array['pending'::text, 'invited'::text, 'active'::text, 'suspended'::text, 'revoked'::text])),
  invitation_token uuid default gen_random_uuid() unique,
  invitation_sent_at timestamp with time zone,
  invitation_expires_at timestamp with time zone,
  activated_at timestamp with time zone,
  expires_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  created_by uuid,
  constraint focal_points_pkey primary key (id),
  constraint focal_points_user_id_fkey foreign key (user_id) references public.profiles(id),
  constraint focal_points_created_by_fkey foreign key (created_by) references public.profiles(id)
);

-- enable row level security so downstream policies are enforced
alter table public.focal_points enable row level security;

-- allow anonymous read access.
create policy "anon select focal_points" on public.focal_points
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert focal_points" on public.focal_points
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update focal_points" on public.focal_points
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete focal_points" on public.focal_points
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select focal_points" on public.focal_points
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert focal_points" on public.focal_points
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update focal_points" on public.focal_points
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete focal_points" on public.focal_points
  for delete
  to authenticated
  using (true);
