-- migration: create indicator_submissions table with rls
-- purpose: replicate the indicator_submissions definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for indicator_submissions operations

-- create the indicator_submissions table with the canonical columns and constraints
create table public.indicator_submissions (
  id uuid not null default gen_random_uuid(),
  country_code text not null,
  indicator_code text not null,
  year integer not null,
  quarter integer check (quarter = any (array[1, 2, 3, 4])),
  submitted_value numeric,
  value_text text,
  unit text,
  data_source text,
  methodology_notes text,
  submitted_by uuid not null,
  status text not null default 'draft'::text check (status = any (array['draft'::text, 'submitted'::text, 'validated'::text, 'rejected'::text, 'published'::text])),
  validated_by uuid,
  validation_date timestamp with time zone,
  validation_notes text,
  rejected_reason text,
  published_at timestamp with time zone,
  published_by uuid,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint indicator_submissions_pkey primary key (id),
  constraint indicator_submissions_submitted_by_fkey foreign key (submitted_by) references public.profiles(id),
  constraint indicator_submissions_validated_by_fkey foreign key (validated_by) references public.profiles(id),
  constraint indicator_submissions_published_by_fkey foreign key (published_by) references public.profiles(id)
);

-- enable row level security so downstream policies are enforced
alter table public.indicator_submissions enable row level security;

-- allow anonymous read access.
create policy "anon select indicator_submissions" on public.indicator_submissions
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert indicator_submissions" on public.indicator_submissions
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update indicator_submissions" on public.indicator_submissions
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete indicator_submissions" on public.indicator_submissions
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select indicator_submissions" on public.indicator_submissions
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert indicator_submissions" on public.indicator_submissions
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update indicator_submissions" on public.indicator_submissions
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete indicator_submissions" on public.indicator_submissions
  for delete
  to authenticated
  using (true);
