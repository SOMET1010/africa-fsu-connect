-- migration: create agencies table with rls
-- purpose: replicate the agencies definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for agencies operations

-- create the agencies table with the canonical columns and constraints
create table public.agencies (
  id uuid not null default gen_random_uuid(),
  name text not null,
  acronym text not null unique,
  country text not null,
  region text not null check (region = any (array['cedeao'::text, 'sadc'::text, 'eaco'::text, 'eccas'::text, 'uma'::text])),
  website_url text not null,
  api_endpoint text,
  logo_url text,
  description text,
  contact_email text,
  phone text,
  address text,
  established_date date,
  is_active boolean default true,
  last_sync_at timestamp with time zone,
  sync_status text default 'pending'::text check (sync_status = any (array['pending'::text, 'active'::text, 'error'::text, 'inactive'::text])),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint agencies_pkey primary key (id)
);

-- enable row level security so downstream policies are enforced
alter table public.agencies enable row level security;

-- allow anonymous read access.
create policy "anon select agencies" on public.agencies
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert agencies" on public.agencies
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update agencies" on public.agencies
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete agencies" on public.agencies
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select agencies" on public.agencies
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert agencies" on public.agencies
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update agencies" on public.agencies
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete agencies" on public.agencies
  for delete
  to authenticated
  using (true);
