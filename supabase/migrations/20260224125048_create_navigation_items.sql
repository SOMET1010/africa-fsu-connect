-- migration: create navigation_items table with rls
-- purpose: store header/footer navigation entries that the ui consumes
-- notes: enables admin-driven CMS updates without redeploying frontend

-- create the navigation_items table with canonical columns
create table public.navigation_items (
  id uuid not null default gen_random_uuid(),
  href text not null,
  location text not null,
  label jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  is_external boolean not null default false,
  icon text,
  updated_at timestamp with time zone not null default now(),
  constraint navigation_items_pkey primary key (id)
);

-- enable row level security so policies can govern access
alter table public.navigation_items enable row level security;

-- allow anonymous reads for the navigation tree
create policy "anon select navigation_items" on public.navigation_items
  for select
  to anon
  using (true);

-- prevent anonymous inserts
create policy "anon insert navigation_items" on public.navigation_items
  for insert
  to anon
  with check (false);

-- prevent anonymous updates
create policy "anon update navigation_items" on public.navigation_items
  for update
  to anon
  using (false);

-- prevent anonymous deletes
create policy "anon delete navigation_items" on public.navigation_items
  for delete
  to anon
  using (false);

-- allow authenticated reads to power dashboards
create policy "authenticated select navigation_items" on public.navigation_items
  for select
  to authenticated
  using (true);

-- allow authenticated inserts for CMS editors
create policy "authenticated insert navigation_items" on public.navigation_items
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates when authorized
create policy "authenticated update navigation_items" on public.navigation_items
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes when workflow permits
create policy "authenticated delete navigation_items" on public.navigation_items
  for delete
  to authenticated
  using (true);
