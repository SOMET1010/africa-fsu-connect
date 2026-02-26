create table public.role_permissions (
  role user_role not null,
  permission text not null,
  primary key (role, permission)
);