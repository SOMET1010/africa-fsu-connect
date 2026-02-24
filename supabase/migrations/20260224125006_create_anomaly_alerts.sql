-- migration: create anomaly_alerts table with rls
-- purpose: replicate the anomaly_alerts definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for anomaly_alerts operations

-- create the anomaly_alerts table with the canonical columns and constraints
create table public.anomaly_alerts (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  type text not null check (type = any (array['suspicious_login'::text, 'unusual_location'::text, 'multiple_failures'::text, 'device_change'::text, 'time_anomaly'::text])),
  severity text not null default 'medium'::text check (severity = any (array['low'::text, 'medium'::text, 'high'::text, 'critical'::text])),
  message text not null,
  details jsonb,
  created_at timestamp with time zone not null default now(),
  resolved boolean default false,
  auto_blocked boolean default false,
  resolved_at timestamp with time zone,
  resolved_by uuid,
  constraint anomaly_alerts_pkey primary key (id),
  constraint anomaly_alerts_user_id_fkey foreign key (user_id) references auth.users(id),
  constraint anomaly_alerts_resolved_by_fkey foreign key (resolved_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.anomaly_alerts enable row level security;

-- allow anonymous read access.
create policy "anon select anomaly_alerts" on public.anomaly_alerts
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert anomaly_alerts" on public.anomaly_alerts
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update anomaly_alerts" on public.anomaly_alerts
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete anomaly_alerts" on public.anomaly_alerts
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select anomaly_alerts" on public.anomaly_alerts
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert anomaly_alerts" on public.anomaly_alerts
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update anomaly_alerts" on public.anomaly_alerts
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete anomaly_alerts" on public.anomaly_alerts
  for delete
  to authenticated
  using (true);
