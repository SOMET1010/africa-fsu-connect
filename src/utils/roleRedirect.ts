import type { UserRole } from '@/types/userRole';

const ROLE_HOME_PATHS: Record<UserRole, string> = {
  super_admin: '/admin/dashboard',
  country_admin: '/admin/dashboard',
  editor: '/admin/content',
  contributor: '/dashboard',
  reader: '/dashboard',
  focal_point: '/focal-dashboard',
};

import { logger } from '@/utils/logger';

export const getRoleHomePath = (role?: UserRole | null) => {
  if (!role) {
    logger.debug('getRoleHomePath: no role provided, returning default /dashboard', { role });
    return '/dashboard';
  }
  const path = ROLE_HOME_PATHS[role] ?? '/dashboard';
  logger.debug('getRoleHomePath: returning path', { role, path });
  return path;
};
