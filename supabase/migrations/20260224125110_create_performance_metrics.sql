-- migration: create performance_metrics table with rls
-- purpose: persist frontend performance/usage metrics for observability as requested in the mock audit
-- notes: this table stores the events previously kept in localStorage so they can be aggregated server-side

create table public.performance_metrics (
  id uuid not null default gen_random_uuid(),
  metric_name text not null,
  metric_value numeric not null,
  metric_type text not null check (metric_type = any (array['timing'::text, 'counter'::text, 'gauge'::text])),
  user_id uuid,
  page_url text,
  user_agent text,
  metadata jsonb,
  created_at timestamp with time zone not null default now(),
  constraint performance_metrics_pkey primary key (id),
  constraint performance_metrics_user_id_fkey foreign key (user_id) references auth.users(id)
);

alter table public.performance_metrics enable row level security;

create policy "anon select performance_metrics" on public.performance_metrics
  for select
  to anon
  using (false);
create policy "anon insert performance_metrics" on public.performance_metrics
  for insert
  to anon
  with check (false);
create policy "anon update performance_metrics" on public.performance_metrics
  for update
  to anon
  using (false);
create policy "anon delete performance_metrics" on public.performance_metrics
  for delete
  to anon
  using (false);

create policy "authenticated select performance_metrics" on public.performance_metrics
  for select
  to authenticated
  using (true);
create policy "authenticated insert performance_metrics" on public.performance_metrics
  for insert
  to authenticated
  with check (true);
create policy "authenticated update performance_metrics" on public.performance_metrics
  for update
  to authenticated
  using (true)
  with check (true);
create policy "authenticated delete performance_metrics" on public.performance_metrics
  for delete
  to authenticated
  using (true);
