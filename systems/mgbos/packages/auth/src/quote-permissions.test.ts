import { it, expect } from 'vitest';
import { hasPermission } from './permissions';
it('limits pricing approval to owner and internal quote access to commercial roles', () => {
  expect(hasPermission('OWNER', 'quotes:approve')).toBe(true);
  for (const role of ['ADMIN', 'SALES', 'FINANCE', 'OPERATIONS', 'QC'])
    expect(hasPermission(role, 'quotes:approve')).toBe(false);
  for (const role of ['OWNER', 'ADMIN', 'SALES'])
    expect(hasPermission(role, 'quotes:create')).toBe(true);
  expect(hasPermission('FINANCE', 'quotes:read')).toBe(true);
  expect(hasPermission('FINANCE', 'quotes:create')).toBe(false);
  for (const role of ['OPERATIONS', 'QC'])
    expect(hasPermission(role, 'quotes:read')).toBe(false);
});
