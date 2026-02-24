-- migration: create anomaly_settings table with rls
-- purpose: replicate the anomaly_settings definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for anomaly_settings operations

-- create the anomaly_settings table with the canonical columns and constraints
create table public.anomaly_settings (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null unique,
  location_monitoring boolean default true,
  device_monitoring boolean default true,
  time_pattern_monitoring boolean default true,
  failed_login_threshold integer default 5 check (failed_login_threshold > 0),
  auto_block_enabled boolean default false,
  sensitivity_level text default 'medium'::text check (sensitivity_level = any (array['low'::text, 'medium'::text, 'high'::text])),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint anomaly_settings_pkey primary key (id),
  constraint anomaly_settings_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.anomaly_settings enable row level security;

-- allow anonymous read access.
create policy "anon select anomaly_settings" on public.anomaly_settings
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert anomaly_settings" on public.anomaly_settings
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update anomaly_settings" on public.anomaly_settings
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete anomaly_settings" on public.anomaly_settings
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select anomaly_settings" on public.anomaly_settings
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert anomaly_settings" on public.anomaly_settings
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update anomaly_settings" on public.anomaly_settings
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete anomaly_settings" on public.anomaly_settings
  for delete
  to authenticated
  using (true);
