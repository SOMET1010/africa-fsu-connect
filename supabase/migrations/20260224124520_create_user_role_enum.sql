-- migration: create user_role enum
-- purpose: enumerate the access levels supported by the profiles table
-- notes: the supabase auth roles and internal workflows rely on these values

-- define the enum that maps directly to the frontend role labels
create type public.user_role as enum (
  'super_admin',
  'admin_pays',
  'editeur',
  'contributeur',
  'lecteur',
  'point_focal'
);

-- keep the owner aligned with the default postgres user
alter type public.user_role owner to postgres;
