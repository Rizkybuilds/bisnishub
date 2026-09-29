import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';

describe('Production Permissions Matrix (MGBOS-012)', () => {
  it('allows OWNER, ADMIN, and OPERATIONS full production management', () => {
    for (const role of ['OWNER', 'ADMIN', 'OPERATIONS'] as const) {
      expect(hasPermission(role, 'production:create')).toBe(true);
      expect(hasPermission(role, 'production:update')).toBe(true);
      expect(hasPermission(role, 'production:assign')).toBe(true);
      expect(hasPermission(role, 'production:read')).toBe(true);
    }
  });

  it('allows SALES, FINANCE, and QC read-only access to production', () => {
    for (const role of ['SALES', 'FINANCE', 'QC'] as const) {
      expect(hasPermission(role, 'production:read')).toBe(true);
      expect(hasPermission(role, 'production:create')).toBe(false);
      expect(hasPermission(role, 'production:update')).toBe(false);
      expect(hasPermission(role, 'production:assign')).toBe(false);
    }
  });
});
