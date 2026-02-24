-- migration: create agency_members table with rls
-- purpose: track which users belong to each agency (required for permissions and network analytics)
-- notes: this table mirrors the membership relationships from the mock data but stores them in postgres so the frontend can source real values

create table public.agency_members (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  user_id uuid not null,
  role text not null default 'member'::text check (role = any (array['member'::text, 'focal_point'::text, 'lead'::text, 'observer'::text])),
  active boolean not null default true,
  joined_at timestamp with time zone not null default now(),
  left_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint agency_members_pkey primary key (id),
  constraint agency_members_agency_id_fkey foreign key (agency_id) references public.agencies(id),
  constraint agency_members_user_id_fkey foreign key (user_id) references auth.users(id)
);

alter table public.agency_members enable row level security;

create policy "anon select agency_members" on public.agency_members
  for select
  to anon
  using (true);
create policy "anon insert agency_members" on public.agency_members
  for insert
  to anon
  with check (false);
create policy "anon update agency_members" on public.agency_members
  for update
  to anon
  using (false);
create policy "anon delete agency_members" on public.agency_members
  for delete
  to anon
  using (false);

create policy "authenticated select agency_members" on public.agency_members
  for select
  to authenticated
  using (true);
create policy "authenticated insert agency_members" on public.agency_members
  for insert
  to authenticated
  with check ((role = 'member'::text and active) or (role in ('focal_point'::text, 'lead'::text, 'observer'::text)));
create policy "authenticated update agency_members" on public.agency_members
  for update
  to authenticated
  using (true)
  with check (true);
create policy "authenticated delete agency_members" on public.agency_members
  for delete
  to authenticated
  using (true);
