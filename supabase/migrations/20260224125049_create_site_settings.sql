-- migration: create site_settings table with rls
-- purpose: hold global site metadata (name, contact, hero copy) for CMS
-- notes: values are stored as json so editors can add multilingual fields

-- create the site_settings table with canonical columns
create table public.site_settings (
  key text not null,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone not null default now(),
  updated_by uuid,
  constraint site_settings_pkey primary key (key)
);

-- enable row level security to ensure policy coverage
alter table public.site_settings enable row level security;

-- allow anonymous reads so public pages can load settings
create policy "anon select site_settings" on public.site_settings
  for select
  to anon
  using (true);

-- prevent anonymous inserts
create policy "anon insert site_settings" on public.site_settings
  for insert
  to anon
  with check (false);

-- prevent anonymous updates
create policy "anon update site_settings" on public.site_settings
  for update
  to anon
  using (false);

-- prevent anonymous deletes
create policy "anon delete site_settings" on public.site_settings
  for delete
  to anon
  using (false);

-- allow authenticated reads for the CMS
create policy "authenticated select site_settings" on public.site_settings
  for select
  to authenticated
  using (true);

-- allow authenticated inserts for editors
create policy "authenticated insert site_settings" on public.site_settings
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates
create policy "authenticated update site_settings" on public.site_settings
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes when workflows permit
create policy "authenticated delete site_settings" on public.site_settings
  for delete
  to authenticated
  using (true);
