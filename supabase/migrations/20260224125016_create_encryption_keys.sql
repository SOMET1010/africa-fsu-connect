-- migration: create encryption_keys table with rls
-- purpose: replicate the encryption_keys definition from supabase/migrations/sutel_db.sql while enabling row level security
-- notes: each section documents the intent and guards for encryption_keys operations

-- create the encryption_keys table with the canonical columns and constraints
create table public.encryption_keys (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  key_id text not null unique,
  algorithm text not null default 'aes-256-gcm'::text,
  key_data text not null,
  is_active boolean default true,
  created_at timestamp with time zone not null default now(),
  expires_at timestamp with time zone,
  last_used timestamp with time zone,
  constraint encryption_keys_pkey primary key (id),
  constraint encryption_keys_user_id_fkey foreign key (user_id) references auth.users(id)
);

-- enable row level security so downstream policies are enforced
alter table public.encryption_keys enable row level security;

-- allow anonymous read access.
create policy "anon select encryption_keys" on public.encryption_keys
  for select
  to anon
  using (true);

-- prevent anonymous inserts.
create policy "anon insert encryption_keys" on public.encryption_keys
  for insert
  to anon
  with check (false);

-- prevent anonymous updates.
create policy "anon update encryption_keys" on public.encryption_keys
  for update
  to anon
  using (false);

-- prevent anonymous deletes.
create policy "anon delete encryption_keys" on public.encryption_keys
  for delete
  to anon
  using (false);

-- allow authenticated reads.
create policy "authenticated select encryption_keys" on public.encryption_keys
  for select
  to authenticated
  using (true);

-- allow authenticated inserts.
create policy "authenticated insert encryption_keys" on public.encryption_keys
  for insert
  to authenticated
  with check (true);

-- allow authenticated updates.
create policy "authenticated update encryption_keys" on public.encryption_keys
  for update
  to authenticated
  using (true)
  with check (true);

-- allow authenticated deletes.
create policy "authenticated delete encryption_keys" on public.encryption_keys
  for delete
  to authenticated
  using (true);
