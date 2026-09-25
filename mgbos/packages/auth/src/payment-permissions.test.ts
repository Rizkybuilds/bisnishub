import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';

describe('Payment Role-Based Permissions (MGBOS-015)', () => {
  it('grants full payment recording and reversal to OWNER, ADMIN, and FINANCE', () => {
    for (const role of ['OWNER', 'ADMIN', 'FINANCE'] as const) {
      expect(hasPermission(role, 'payments:read')).toBe(true);
      expect(hasPermission(role, 'payments:record')).toBe(true);
      expect(hasPermission(role, 'payments:revert')).toBe(true);
    }
  });

  it('allows SALES, OPERATIONS, and QC read-only visibility into payments', () => {
    for (const role of ['SALES', 'OPERATIONS', 'QC'] as const) {
      expect(hasPermission(role, 'payments:read')).toBe(true);
      expect(hasPermission(role, 'payments:record')).toBe(false);
      expect(hasPermission(role, 'payments:revert')).toBe(false);
    }
  });
});
