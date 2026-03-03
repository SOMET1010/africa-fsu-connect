create table public.role_permissions (
  role public.user_role not null,
  permission text[] DEFAULT ARRAY['public'] NOT NULL,
  updated_at timestamp with time zone not null default now(),
  constraint role_permissions_pkey primary key (role, permission)
);

alter table public.role_permissions enable row level security;