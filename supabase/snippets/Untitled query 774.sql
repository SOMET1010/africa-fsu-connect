ALTER TABLE public.navigation_items
ADD COLUMN user_role public.user_role[] NOT NULL DEFAULT '{"public","reader"}';


create table public.navigation_items (
  id uuid not null default gen_random_uuid (),
  href text not null,
  location text not null,
  label jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  is_external boolean not null default false,
  icon text null,
  updated_at timestamp with time zone not null default now(),
  user_role user_role[] not null default '{public,reader}'::user_role[],
  reference text null,
  parent text null,
  constraint navigation_items_pkey primary key (id)
) TABLESPACE pg_default;