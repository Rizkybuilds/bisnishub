import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';

describe('Invoice Role-Based Permissions', () => {
  it('grants full invoice management to OWNER, ADMIN, and FINANCE', () => {
    for (const role of ['OWNER', 'ADMIN', 'FINANCE'] as const) {
      expect(hasPermission(role, 'invoices:read')).toBe(true);
      expect(hasPermission(role, 'invoices:create')).toBe(true);
      expect(hasPermission(role, 'invoices:issue')).toBe(true);
      expect(hasPermission(role, 'invoices:void')).toBe(true);
    }
  });

  it('allows SALES to read and draft invoices, but forbids official issue and void', () => {
    expect(hasPermission('SALES', 'invoices:read')).toBe(true);
    expect(hasPermission('SALES', 'invoices:create')).toBe(true);

    expect(hasPermission('SALES', 'invoices:issue')).toBe(false);
    expect(hasPermission('SALES', 'invoices:void')).toBe(false);
  });

  it('restricts OPERATIONS and QC to read-only visibility for invoices', () => {
    expect(hasPermission('OPERATIONS', 'invoices:read')).toBe(true);
    expect(hasPermission('OPERATIONS', 'invoices:create')).toBe(false);
    expect(hasPermission('OPERATIONS', 'invoices:issue')).toBe(false);

    expect(hasPermission('QC', 'invoices:read')).toBe(true);
    expect(hasPermission('QC', 'invoices:create')).toBe(false);
  });
});
