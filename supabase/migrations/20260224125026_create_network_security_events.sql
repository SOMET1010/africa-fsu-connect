-- migration: create network_security_events table with rls
-- purpose: replicate the network_security_events definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for network_security_events operations

-- create the network_security_events table with the canonical columns and constraints
create table public.network_security_events (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  event_type text not null check (event_type = any (array['intrusion_attempt'::text, 'ddos_attack'::text, 'malware_detected'::text, 'suspicious_traffic'::text, 'firewall_breach'::text])),
  severity text not null check (severity = any (array['low'::text, 'medium'::text, 'high'::text, 'critical'::text])),
  source_ip inet,
  target_ip inet,
  description text not null,
  details jsonb,
  blocked boolean default false,
  created_at timestamp with time zone not null default now(),
  resolved boolean default false,
  resolved_at timestamp with time zone,
  constraint network_security_events_pkey primary key (id),
  constraint network_security_events_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.network_security_events enable row level security;

-- allow anonymous read access.
create policy "anon select network_security_events" on public.network_security_events
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert network_security_events" on public.network_security_events
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update network_security_events" on public.network_security_events
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete network_security_events" on public.network_security_events
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select network_security_events" on public.network_security_events
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert network_security_events" on public.network_security_events
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update network_security_events" on public.network_security_events
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete network_security_events" on public.network_security_events
  for delete
  to authenticated
  using (true);
