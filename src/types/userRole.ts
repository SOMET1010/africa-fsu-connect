export type UserRole =
  | 'super_admin'
  | 'country_admin'
  | 'editor'
  | 'contributor'
  | 'reader'
  | 'focal_point';

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  country_admin: 'Admin national',
  editor: 'Editeur',
  contributor: 'Contributeur',
  reader: 'Lecteur',
  focal_point: 'Point focal',
};

export const PUBLIC_SIGNUP_ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'reader', label: 'Lecteur' },
  { value: 'contributor', label: 'Contributeur' },
  { value: 'focal_point', label: 'Point focal' },
  { value: 'editor', label: 'Éditeur' },
  { value: 'country_admin', label: 'Administrateur national' },
  { value: 'super_admin', label: 'Super administrateur' },
];

export const getUserRoleLabel = (role: UserRole) => USER_ROLE_LABELS[role] ?? role;
