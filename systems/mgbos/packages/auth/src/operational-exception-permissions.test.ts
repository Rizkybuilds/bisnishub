import { describe, it, expect } from 'vitest';
import type { SessionContext } from '@mgbos/domain';
import {
  hasPermission,
  checkPermission,
  assertPermission,
  type MgbosPermission,
} from './permissions';

const OPERATIONAL_EXCEPTION_PERMISSIONS: readonly MgbosPermission[] = [
  'operational_exceptions:read',
  'operational_exceptions:history_read',
  'operational_exceptions:open',
  'operational_exceptions:acknowledge',
  'operational_exceptions:assign',
  'operational_exceptions:reassign',
  'operational_exceptions:change_severity',
  'operational_exceptions:resolve',
  'operational_exceptions:dismiss',
  'operational_exceptions:reopen',
] as const;

function createMockSession(roleCode?: string | null): SessionContext {
  return {
    user: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      authUserId: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Test Actor',
      email: 'actor@multigraph.id',
    },
    organization: {
      id: '123e4567-e89b-12d3-a456-426614174003',
      code: 'multigraph-group',
      displayName: 'MultiGraph Group',
    },
    role: roleCode
      ? {
          code: roleCode,
          name: `${roleCode} Role`,
        }
      : (undefined as unknown as { code: string; name: string }),
    activeBrand: {
      code: 'TS',
      name: 'TeeStock',
    },
  };
}

describe('Operational Exception Permissions Matrix (P2-A / WP02)', () => {
  describe('hasPermission evaluation', () => {
    it('allows all 10 operational exception permissions for OWNER', () => {
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        expect(hasPermission('OWNER', permission)).toBe(true);
      }
    });

    it('allows all 10 operational exception permissions for ADMIN', () => {
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        expect(hasPermission('ADMIN', permission)).toBe(true);
      }
    });

    it('denies all 10 operational exception permissions for SALES', () => {
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        expect(hasPermission('SALES', permission)).toBe(false);
      }
    });

    it('denies all 10 operational exception permissions for OPERATIONS', () => {
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        expect(hasPermission('OPERATIONS', permission)).toBe(false);
      }
    });

    it('denies all 10 operational exception permissions for FINANCE', () => {
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        expect(hasPermission('FINANCE', permission)).toBe(false);
      }
    });

    it('denies all 10 operational exception permissions for QC', () => {
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        expect(hasPermission('QC', permission)).toBe(false);
      }
    });

    it('denies all 10 operational exception permissions for null, undefined, or unknown roles', () => {
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        expect(hasPermission(null, permission)).toBe(false);
        expect(hasPermission(undefined, permission)).toBe(false);
        expect(hasPermission('', permission)).toBe(false);
        expect(hasPermission('UNKNOWN_ROLE', permission)).toBe(false);
        expect(hasPermission('GUEST', permission)).toBe(false);
      }
    });
  });

  describe('checkPermission evaluation with SessionContext', () => {
    it('returns { allowed: true } for OWNER session across all 10 permissions', () => {
      const session = createMockSession('OWNER');
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        const result = checkPermission(session, permission);
        expect(result.allowed).toBe(true);
      }
    });

    it('returns { allowed: true } for ADMIN session across all 10 permissions', () => {
      const session = createMockSession('ADMIN');
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        const result = checkPermission(session, permission);
        expect(result.allowed).toBe(true);
      }
    });

    it('returns { allowed: false, error: ... } for SALES session across all 10 permissions', () => {
      const session = createMockSession('SALES');
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        const result = checkPermission(session, permission);
        expect(result.allowed).toBe(false);
        if (!result.allowed) {
          expect(result.error).toContain("peran 'SALES' tidak memiliki izin");
          expect(result.error).toContain(permission);
        }
      }
    });

    it('returns { allowed: false, error: ... } for OPERATIONS session across all 10 permissions', () => {
      const session = createMockSession('OPERATIONS');
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        const result = checkPermission(session, permission);
        expect(result.allowed).toBe(false);
        if (!result.allowed) {
          expect(result.error).toContain(
            "peran 'OPERATIONS' tidak memiliki izin",
          );
          expect(result.error).toContain(permission);
        }
      }
    });

    it('returns { allowed: false, error: ... } for FINANCE session across all 10 permissions', () => {
      const session = createMockSession('FINANCE');
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        const result = checkPermission(session, permission);
        expect(result.allowed).toBe(false);
        if (!result.allowed) {
          expect(result.error).toContain("peran 'FINANCE' tidak memiliki izin");
          expect(result.error).toContain(permission);
        }
      }
    });

    it('returns { allowed: false, error: ... } for QC session across all 10 permissions', () => {
      const session = createMockSession('QC');
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        const result = checkPermission(session, permission);
        expect(result.allowed).toBe(false);
        if (!result.allowed) {
          expect(result.error).toContain("peran 'QC' tidak memiliki izin");
          expect(result.error).toContain(permission);
        }
      }
    });

    it('returns { allowed: false, error: ... } for session with missing or undefined role', () => {
      const sessionNoRole = createMockSession(undefined);
      for (const permission of OPERATIONAL_EXCEPTION_PERMISSIONS) {
        const result = checkPermission(sessionNoRole, permission);
        expect(result.allowed).toBe(false);
        if (!result.allowed) {
          expect(result.error).toContain("peran 'UNKNOWN' tidak memiliki izin");
        }
      }
    });

    it('assertPermission throws Error for unauthorized session and passes for authorized session', () => {
      const ownerSession = createMockSession('OWNER');
      const salesSession = createMockSession('SALES');

      expect(() => {
        assertPermission(ownerSession, 'operational_exceptions:open');
      }).not.toThrow();

      expect(() => {
        assertPermission(salesSession, 'operational_exceptions:open');
      }).toThrow(
        /Akses ditolak: peran 'SALES' tidak memiliki izin 'operational_exceptions:open'/,
      );
    });
  });
});
