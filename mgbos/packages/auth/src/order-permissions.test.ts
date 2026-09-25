import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';

describe('Order & Acceptance Permissions Matrix (MGBOS-011)', () => {
  it('allows OWNER, ADMIN, and SALES to accept quotes and create orders', () => {
    for (const role of ['OWNER', 'ADMIN', 'SALES'] as const) {
      expect(hasPermission(role, 'quotes:accept')).toBe(true);
      expect(hasPermission(role, 'orders:create')).toBe(true);
      expect(hasPermission(role, 'orders:read')).toBe(true);
    }
  });

  it('allows OPERATIONS, FINANCE, and QC to read orders but forbids creation', () => {
    for (const role of ['OPERATIONS', 'FINANCE', 'QC'] as const) {
      expect(hasPermission(role, 'orders:read')).toBe(true);
      expect(hasPermission(role, 'orders:create')).toBe(false);
      expect(hasPermission(role, 'quotes:accept')).toBe(false);
    }
  });

  it('only allows OWNER and ADMIN to update orders', () => {
    expect(hasPermission('OWNER', 'orders:update')).toBe(true);
    expect(hasPermission('ADMIN', 'orders:update')).toBe(true);
    expect(hasPermission('SALES', 'orders:update')).toBe(false);
  });
});
