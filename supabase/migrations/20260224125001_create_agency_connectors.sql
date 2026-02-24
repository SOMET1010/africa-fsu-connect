-- migration: create agency_connectors table with rls
-- purpose: replicate the agency_connectors definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for agency_connectors operations

-- create the agency_connectors table with the canonical columns and constraints
create table public.agency_connectors (
  id uuid not null default gen_random_uuid(),
  agency_id uuid not null,
  connector_type text not null check (connector_type = any (array['api'::text, 'scraper'::text, 'rss'::text, 'manual'::text])),
  endpoint_url text,
  auth_method text check (auth_method = any (array['none'::text, 'api_key'::text, 'oauth'::text, 'basic'::text])),
  auth_config jsonb default '{}'::jsonb,
  sync_frequency integer default 3600,
  last_sync_at timestamp with time zone,
  sync_status text default 'inactive'::text check (sync_status = any (array['active'::text, 'error'::text, 'inactive'::text])),
  error_message text,
  is_active boolean default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint agency_connectors_pkey primary key (id),
  constraint agency_connectors_agency_id_fkey foreign key (agency_id) references public.agencies(id)
);

-- enable row level security so downstream policies are enforced
alter table public.agency_connectors enable row level security;

-- allow anonymous read access.
create policy "anon select agency_connectors" on public.agency_connectors
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert agency_connectors" on public.agency_connectors
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update agency_connectors" on public.agency_connectors
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete agency_connectors" on public.agency_connectors
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select agency_connectors" on public.agency_connectors
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert agency_connectors" on public.agency_connectors
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update agency_connectors" on public.agency_connectors
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete agency_connectors" on public.agency_connectors
  for delete
  to authenticated
  using (true);
