-- migration: create submissions table with rls
-- purpose: replicate the submissions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for submissions operations

-- create the submissions table with the canonical columns and constraints
create table public.submissions (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text,
  content text,
  status public.submission_status not null default 'draft'::public.submission_status,
  submitted_by uuid not null,
  reviewed_by uuid,
  review_notes text,
  attachments jsonb default '[]'::jsonb,
  submitted_at timestamp with time zone,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint submissions_pkey primary key (id),
  constraint submissions_submitted_by_fkey foreign key (submitted_by) references auth.users(id),
  constraint submissions_reviewed_by_fkey foreign key (reviewed_by) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.submissions enable row level security;

-- allow anonymous read access.
create policy "anon select submissions" on public.submissions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert submissions" on public.submissions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update submissions" on public.submissions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete submissions" on public.submissions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select submissions" on public.submissions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert submissions" on public.submissions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update submissions" on public.submissions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete submissions" on public.submissions
  for delete
  to authenticated
  using (true);
