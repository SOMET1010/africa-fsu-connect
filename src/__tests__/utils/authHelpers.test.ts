import { describe, it, expect } from 'vitest';
import type { UserRole } from '@/types/userRole';

// Auth helper pure functions extracted for testing
// These mirror the logic in AuthContext

interface MockProfile {
  role: UserRole;
}

/**
 * Check if user has admin privileges
 * Mirrors logic from AuthContext.isAdmin()
 */
function isAdmin(profile: MockProfile | null): boolean {
  if (!profile) return false;
  return ['super_admin', 'country_admin', 'editor'].includes(profile.role);
}

/**
 * Check if user has any of the specified roles
 * Mirrors logic from AuthContext.hasRole()
 */
function hasRole(profile: MockProfile | null, roles: UserRole[]): boolean {
  if (!profile) return false;
  return roles.includes(profile.role);
}

describe('Auth Helpers', () => {
  describe('isAdmin', () => {
    it('should return false for null profile', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('should return true for super_admin', () => {
      expect(isAdmin({ role: 'super_admin' })).toBe(true);
    });

    it('should return true for country_admin', () => {
      expect(isAdmin({ role: 'country_admin' })).toBe(true);
    });

    it('should return true for editor', () => {
      expect(isAdmin({ role: 'editor' })).toBe(true);
    });

    it('should return false for contributor', () => {
      expect(isAdmin({ role: 'contributor' })).toBe(false);
    });

    it('should return false for reader', () => {
      expect(isAdmin({ role: 'reader' })).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return false for null profile', () => {
      expect(hasRole(null, ['super_admin'])).toBe(false);
    });

    it('should return true when user has matching role', () => {
      const profile: MockProfile = { role: 'editor' };
      expect(hasRole(profile, ['editor', 'super_admin'])).toBe(true);
    });

    it('should return false when user does not have matching role', () => {
      const profile: MockProfile = { role: 'reader' };
      expect(hasRole(profile, ['super_admin', 'country_admin'])).toBe(false);
    });

    it('should work with single role check', () => {
      const profile: MockProfile = { role: 'contributor' };
      expect(hasRole(profile, ['contributor'])).toBe(true);
    });

    it('should work with all roles', () => {
      const allRoles: UserRole[] = ['super_admin', 'country_admin', 'editor', 'contributor', 'reader', 'focal_point'];
      
      allRoles.forEach(role => {
        const profile: MockProfile = { role };
        expect(hasRole(profile, [role])).toBe(true);
      });
    });

    it('should return false for empty roles array', () => {
      const profile: MockProfile = { role: 'super_admin' };
      expect(hasRole(profile, [])).toBe(false);
    });
  });

  describe('Role hierarchy scenarios', () => {
    const scenarios: { role: UserRole; canEdit: boolean; canModerate: boolean; canAdmin: boolean }[] = [
      { role: 'super_admin', canEdit: true, canModerate: true, canAdmin: true },
      { role: 'country_admin', canEdit: true, canModerate: true, canAdmin: true },
      { role: 'editor', canEdit: true, canModerate: true, canAdmin: true },
      { role: 'contributor', canEdit: true, canModerate: false, canAdmin: false },
      { role: 'reader', canEdit: false, canModerate: false, canAdmin: false },
      { role: 'focal_point', canEdit: false, canModerate: false, canAdmin: false },
    ];

    scenarios.forEach(({ role, canEdit, canModerate, canAdmin }) => {
      describe(`${role} role`, () => {
        const profile: MockProfile = { role };
        const editRoles: UserRole[] = ['super_admin', 'country_admin', 'editor', 'contributor'];
        const moderatorRoles: UserRole[] = ['super_admin', 'country_admin', 'editor'];

        it(`should ${canEdit ? '' : 'not '}be able to edit`, () => {
          expect(hasRole(profile, editRoles)).toBe(canEdit);
        });

        it(`should ${canModerate ? '' : 'not '}be able to moderate`, () => {
          expect(hasRole(profile, moderatorRoles)).toBe(canModerate);
        });

        it(`should ${canAdmin ? '' : 'not '}have admin privileges`, () => {
          expect(isAdmin(profile)).toBe(canAdmin);
        });
      });
    });
  });
});
