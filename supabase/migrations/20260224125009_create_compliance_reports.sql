-- migration: create compliance_reports table with rls
-- purpose: replicate the compliance_reports definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for compliance_reports operations

-- create the compliance_reports table with the canonical columns and constraints
create table public.compliance_reports (
  id uuid not null default gen_random_uuid(),
  user_id uuid,
  report_type text not null check (report_type = any (array['gdpr'::text, 'hipaa'::text, 'sox'::text, 'iso27001'::text, 'custom'::text])),
  title text not null,
  description text,
  status text default 'pending'::text check (status = any (array['pending'::text, 'in_progress'::text, 'completed'::text, 'failed'::text])),
  report_data jsonb,
  file_url text,
  created_at timestamp with time zone not null default now(),
  completed_at timestamp with time zone,
  scheduled_for timestamp with time zone,
  constraint compliance_reports_pkey primary key (id),
  constraint compliance_reports_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.compliance_reports enable row level security;

-- allow anonymous read access.
create policy "anon select compliance_reports" on public.compliance_reports
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert compliance_reports" on public.compliance_reports
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update compliance_reports" on public.compliance_reports
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete compliance_reports" on public.compliance_reports
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select compliance_reports" on public.compliance_reports
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert compliance_reports" on public.compliance_reports
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update compliance_reports" on public.compliance_reports
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete compliance_reports" on public.compliance_reports
  for delete
  to authenticated
  using (true);
