import type { SessionContext } from '@mgbos/domain';

export type MgbosRole =
  'OWNER' | 'ADMIN' | 'SALES' | 'OPERATIONS' | 'FINANCE' | 'QC';

export type MgbosPermission =
  | 'designs:read'
  | 'designs:write'
  | 'leads:create'
  | 'leads:read'
  | 'leads:qualify'
  | 'leads:disqualify'
  | 'leads:convert'
  | 'customers:create'
  | 'customers:read'
  | 'requirements:create'
  | 'requirements:read'
  | 'requirements:update'
  | 'requirements:version'
  | 'requirements:lock'
  | 'quotes:read'
  | 'quotes:create'
  | 'quotes:send'
  | 'quotes:approve'
  | 'quotes:accept'
  | 'orders:read'
  | 'orders:create'
  | 'orders:update'
  | 'production:read'
  | 'production:create'
  | 'production:update'
  | 'production:assign'
  | 'vendors:read'
  | 'vendors:create'
  | 'vendors:update'
  | 'qc:read'
  | 'qc:create'
  | 'invoices:read'
  | 'invoices:create'
  | 'invoices:issue'
  | 'invoices:void'
  | 'payments:read'
  | 'payments:record'
  | 'payments:revert'
  | 'ledger:read'
  | 'ledger:manage_cost'
  | 'shipments:read'
  | 'shipments:create'
  | 'shipments:dispatch'
  | 'shipments:cancel'
  | 'inventory:read'
  | 'inventory:create'
  | 'inventory:mutate'
  | 'inventory:opname'
  | 'procurement:read'
  | 'procurement:create'
  | 'procurement:receive'
  | 'procurement:pay';

/**
 * Authoritative role-to-permission mapping for MultiGraph Business OS.
 * Restricts mutation commands to authorized roles (OWNER, ADMIN, SALES).
 * Read-only or domain-specific access for OPERATIONS, FINANCE, and QC.
 */
export const ROLE_PERMISSIONS: Record<MgbosRole, readonly MgbosPermission[]> = {
  OWNER: [
    'designs:read',
    'designs:write',
    'quotes:approve',
    'quotes:accept',
    'leads:create',
    'leads:read',
    'leads:qualify',
    'leads:disqualify',
    'leads:convert',
    'customers:create',
    'customers:read',
    'requirements:create',
    'requirements:read',
    'requirements:update',
    'requirements:version',
    'requirements:lock',
    'quotes:read',
    'quotes:create',
    'quotes:send',
    'orders:read',
    'orders:create',
    'orders:update',
    'production:read',
    'production:create',
    'production:update',
    'production:assign',
    'vendors:read',
    'vendors:create',
    'vendors:update',
    'qc:read',
    'qc:create',
    'invoices:read',
    'invoices:create',
    'invoices:issue',
    'invoices:void',
    'payments:read',
    'payments:record',
    'payments:revert',
    'ledger:read',
    'ledger:manage_cost',
    'shipments:read',
    'shipments:create',
    'shipments:dispatch',
    'shipments:cancel',
    'inventory:read',
    'inventory:create',
    'inventory:mutate',
    'inventory:opname',
    'procurement:read',
    'procurement:create',
    'procurement:receive',
    'procurement:pay',
  ],
  ADMIN: [
    'designs:read',
    'designs:write',
    'quotes:accept',
    'leads:create',
    'leads:read',
    'leads:qualify',
    'leads:disqualify',
    'leads:convert',
    'customers:create',
    'customers:read',
    'requirements:create',
    'requirements:read',
    'requirements:update',
    'requirements:version',
    'requirements:lock',
    'quotes:read',
    'quotes:create',
    'quotes:send',
    'orders:read',
    'orders:create',
    'orders:update',
    'production:read',
    'production:create',
    'production:update',
    'production:assign',
    'vendors:read',
    'vendors:create',
    'vendors:update',
    'qc:read',
    'qc:create',
    'invoices:read',
    'invoices:create',
    'invoices:issue',
    'invoices:void',
    'payments:read',
    'payments:record',
    'payments:revert',
    'ledger:read',
    'ledger:manage_cost',
    'shipments:read',
    'shipments:create',
    'shipments:dispatch',
    'shipments:cancel',
    'inventory:read',
    'inventory:create',
    'inventory:mutate',
    'inventory:opname',
    'procurement:read',
    'procurement:create',
    'procurement:receive',
    'procurement:pay',
  ],
  SALES: [
    'quotes:accept',
    'leads:create',
    'leads:read',
    'leads:qualify',
    'leads:disqualify',
    'leads:convert',
    'customers:create',
    'customers:read',
    'requirements:create',
    'requirements:read',
    'requirements:update',
    'requirements:version',
    'requirements:lock',
    'quotes:read',
    'quotes:create',
    'quotes:send',
    'orders:read',
    'orders:create',
    'production:read',
    'vendors:read',
    'qc:read',
    'invoices:read',
    'invoices:create',
    'payments:read',
    'ledger:read',
    'shipments:read',
    'inventory:read',
    'procurement:read',
  ],
  OPERATIONS: [
    'leads:read',
    'customers:read',
    'requirements:read',
    'requirements:version',
    'orders:read',
    'production:read',
    'production:create',
    'production:update',
    'production:assign',
    'vendors:read',
    'vendors:create',
    'vendors:update',
    'qc:read',
    'qc:create',
    'invoices:read',
    'payments:read',
    'ledger:read',
    'ledger:manage_cost',
    'shipments:read',
    'shipments:create',
    'shipments:dispatch',
    'shipments:cancel',
    'inventory:read',
    'inventory:create',
    'inventory:mutate',
    'inventory:opname',
    'procurement:read',
    'procurement:create',
    'procurement:receive',
  ],
  FINANCE: [
    'leads:read',
    'customers:read',
    'requirements:read',
    'quotes:read',
    'orders:read',
    'production:read',
    'vendors:read',
    'qc:read',
    'invoices:read',
    'invoices:create',
    'invoices:issue',
    'invoices:void',
    'payments:read',
    'payments:record',
    'payments:revert',
    'ledger:read',
    'ledger:manage_cost',
    'shipments:read',
    'shipments:create',
    'shipments:dispatch',
    'inventory:read',
    'inventory:mutate',
    'inventory:opname',
    'procurement:read',
    'procurement:create',
    'procurement:pay',
  ],
  QC: [
    'leads:read',
    'customers:read',
    'requirements:read',
    'orders:read',
    'production:read',
    'vendors:read',
    'qc:read',
    'qc:create',
    'invoices:read',
    'payments:read',
    'ledger:read',
    'shipments:read',
    'inventory:read',
    'procurement:read',
    'procurement:receive',
  ],
};

/**
 * Checks whether a given role has a specific permission.
 */
export function hasPermission(
  roleCode: string | undefined | null,
  permission: MgbosPermission,
): boolean {
  if (!roleCode) return false;
  const role = roleCode.toUpperCase() as MgbosRole;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

/**
 * Evaluates session permissions, returning a structured result for server actions.
 */
export function checkPermission(
  session: SessionContext,
  permission: MgbosPermission,
): { allowed: true } | { allowed: false; error: string } {
  const roleCode = session.role?.code;
  if (!hasPermission(roleCode, permission)) {
    return {
      allowed: false,
      error: `Akses ditolak: peran '${roleCode ?? 'UNKNOWN'}' tidak memiliki izin '${permission}'`,
    };
  }
  return { allowed: true };
}

/**
 * Asserts session permissions, throwing an Error if unauthorized.
 */
export function assertPermission(
  session: SessionContext,
  permission: MgbosPermission,
): void {
  const result = checkPermission(session, permission);
  if (!result.allowed) {
    throw new Error(result.error);
  }
}
