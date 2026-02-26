-- migration: create user_role enum
-- purpose: enumerate the access levels supported by the profiles table
-- notes: the supabase auth roles and internal workflows rely on these values
-- reference: CDC ANSUT/DSIS Section 4.2 & 5

-- define the enum that maps directly to the frontend role labels
create type public.user_role as enum (
  'super_admin',        -- ANSUT/UAT Administrator (full access)
  'country_admin',      -- National admin per country (local management)
  'editor',             -- Editorial validation (publication workflow)
  'contributor',        -- FSU focal point, experts (can publish)
  'reader',             -- Authenticated reader (forum, download)
  'focal_point'         -- Dedicated focal point (sensory, moderation) - OPTIONAL
);

-- keep the owner aligned with the default postgres user
alter type public.user_role owner to postgres;

-- add comment for documentation
comment on type public.user_role is 'User access levels per CDC ANSUT/DSIS Section 4.2 & 5';
