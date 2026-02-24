-- migration: create audit_logs table with rls
-- purpose: replicate the audit_logs definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for audit_logs operations

-- create the audit_logs table with the canonical columns and constraints
create table public.audit_logs (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  action_type text not null,
  resource_type text,
  resource_id text,
  details jsonb,
  ip_address inet,
  user_agent text,
  success boolean default true,
  created_at timestamp with time zone not null default now(),
  constraint audit_logs_pkey primary key (id),
  constraint audit_logs_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.audit_logs enable row level security;

-- allow anonymous read access.
create policy "anon select audit_logs" on public.audit_logs
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert audit_logs" on public.audit_logs
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update audit_logs" on public.audit_logs
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete audit_logs" on public.audit_logs
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select audit_logs" on public.audit_logs
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert audit_logs" on public.audit_logs
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update audit_logs" on public.audit_logs
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete audit_logs" on public.audit_logs
  for delete
  to authenticated
  using (true);
