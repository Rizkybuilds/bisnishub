import { describe, it, expect } from 'vitest';
import { hasPermission } from './permissions';

describe('MGBOS-016: Ledger Permissions Authority Model', () => {
  it('grants ledger:read to all active internal roles', () => {
    expect(hasPermission('OWNER', 'ledger:read')).toBe(true);
    expect(hasPermission('ADMIN', 'ledger:read')).toBe(true);
    expect(hasPermission('FINANCE', 'ledger:read')).toBe(true);
    expect(hasPermission('OPERATIONS', 'ledger:read')).toBe(true);
    expect(hasPermission('SALES', 'ledger:read')).toBe(true);
    expect(hasPermission('QC', 'ledger:read')).toBe(true);
  });

  it('restricts ledger:manage_cost to OWNER, ADMIN, FINANCE, and OPERATIONS only', () => {
    expect(hasPermission('OWNER', 'ledger:manage_cost')).toBe(true);
    expect(hasPermission('ADMIN', 'ledger:manage_cost')).toBe(true);
    expect(hasPermission('FINANCE', 'ledger:manage_cost')).toBe(true);
    expect(hasPermission('OPERATIONS', 'ledger:manage_cost')).toBe(true);
    expect(hasPermission('SALES', 'ledger:manage_cost')).toBe(false);
    expect(hasPermission('QC', 'ledger:manage_cost')).toBe(false);
  });
});
