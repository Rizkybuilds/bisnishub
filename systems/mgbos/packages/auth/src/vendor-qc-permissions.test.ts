import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';

describe('Vendor and QC Role-Based Permissions', () => {
  it('grants full vendor and QC management to OWNER and OPERATIONS', () => {
    expect(hasPermission('OWNER', 'vendors:create')).toBe(true);
    expect(hasPermission('OWNER', 'qc:create')).toBe(true);

    expect(hasPermission('OPERATIONS', 'vendors:create')).toBe(true);
    expect(hasPermission('OPERATIONS', 'qc:create')).toBe(true);
  });

  it('allows QC role to inspect and view vendors, but forbids creating vendors', () => {
    expect(hasPermission('QC', 'qc:create')).toBe(true);
    expect(hasPermission('QC', 'qc:read')).toBe(true);
    expect(hasPermission('QC', 'vendors:read')).toBe(true);

    expect(hasPermission('QC', 'vendors:create')).toBe(false);
    expect(hasPermission('QC', 'vendors:update')).toBe(false);
  });

  it('allows SALES and FINANCE to view vendors and QC records', () => {
    expect(hasPermission('SALES', 'vendors:read')).toBe(true);
    expect(hasPermission('SALES', 'qc:read')).toBe(true);
    expect(hasPermission('SALES', 'qc:create')).toBe(false);

    expect(hasPermission('FINANCE', 'vendors:read')).toBe(true);
    expect(hasPermission('FINANCE', 'qc:read')).toBe(true);
    expect(hasPermission('FINANCE', 'vendors:create')).toBe(false);
  });
});
