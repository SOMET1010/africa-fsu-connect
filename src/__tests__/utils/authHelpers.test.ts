import { describe, it, expect } from 'vitest';

// Auth helper pure functions extracted for testing
// These mirror the logic in AuthContext and LiferayAuthContext

type UserRole = 'super_admin' | 'admin_pays' | 'editeur' | 'contributeur' | 'lecteur';

interface MockProfile {
  role: UserRole;
}

/**
 * Check if user has admin privileges
 * Mirrors logic from AuthContext.isAdmin()
 */
function isAdmin(profile: MockProfile | null): boolean {
  if (!profile) return false;
  return ['super_admin', 'admin_pays', 'editeur'].includes(profile.role);
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

    it('should return true for admin_pays', () => {
      expect(isAdmin({ role: 'admin_pays' })).toBe(true);
    });

    it('should return true for editeur', () => {
      expect(isAdmin({ role: 'editeur' })).toBe(true);
    });

    it('should return false for contributeur', () => {
      expect(isAdmin({ role: 'contributeur' })).toBe(false);
    });

    it('should return false for lecteur', () => {
      expect(isAdmin({ role: 'lecteur' })).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return false for null profile', () => {
      expect(hasRole(null, ['super_admin'])).toBe(false);
    });

    it('should return true when user has matching role', () => {
      const profile: MockProfile = { role: 'editeur' };
      expect(hasRole(profile, ['editeur', 'super_admin'])).toBe(true);
    });

    it('should return false when user does not have matching role', () => {
      const profile: MockProfile = { role: 'lecteur' };
      expect(hasRole(profile, ['super_admin', 'admin_pays'])).toBe(false);
    });

    it('should work with single role check', () => {
      const profile: MockProfile = { role: 'contributeur' };
      expect(hasRole(profile, ['contributeur'])).toBe(true);
    });

    it('should work with all roles', () => {
      const allRoles: UserRole[] = ['super_admin', 'admin_pays', 'editeur', 'contributeur', 'lecteur'];
      
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
      { role: 'admin_pays', canEdit: true, canModerate: true, canAdmin: true },
      { role: 'editeur', canEdit: true, canModerate: true, canAdmin: true },
      { role: 'contributeur', canEdit: true, canModerate: false, canAdmin: false },
      { role: 'lecteur', canEdit: false, canModerate: false, canAdmin: false },
    ];

    scenarios.forEach(({ role, canEdit, canModerate, canAdmin }) => {
      describe(`${role} role`, () => {
        const profile: MockProfile = { role };
        const editRoles: UserRole[] = ['super_admin', 'admin_pays', 'editeur', 'contributeur'];
        const moderatorRoles: UserRole[] = ['super_admin', 'admin_pays', 'editeur'];

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
