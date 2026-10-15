import type { MgbosPermission, MgbosRole } from '@mgbos/auth';
import { hasPermission } from '@mgbos/auth';

export interface NavItemDef {
  id: string;
  label: string;
  href: string;
  requiredPermission?: MgbosPermission;
  brandOnly?: string;
}

export interface NavGroupDef {
  id: string;
  title: string;
  items: NavItemDef[];
}

export const NAVIGATION_GROUPS: readonly NavGroupDef[] = [
  {
    id: 'summary',
    title: 'Ringkasan',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/dashboard' },
      {
        id: 'designs',
        label: 'Library Desain',
        href: '/designs',
        brandOnly: 'TS',
        requiredPermission: 'designs:read',
      },
    ],
  },
  {
    id: 'sales',
    title: 'Penjualan',
    items: [
      {
        id: 'leads',
        label: 'Leads',
        href: '/leads',
        requiredPermission: 'leads:read',
      },
      {
        id: 'customers',
        label: 'Pelanggan',
        href: '/customers',
        requiredPermission: 'customers:read',
      },
      {
        id: 'requirements',
        label: 'Kebutuhan',
        href: '/requirements',
        requiredPermission: 'requirements:read',
      },
      {
        id: 'quotes',
        label: 'Penawaran',
        href: '/quotes',
        requiredPermission: 'quotes:read',
      },
      {
        id: 'orders',
        label: 'Pesanan',
        href: '/orders',
        requiredPermission: 'orders:read',
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operasional',
    items: [
      {
        id: 'production',
        label: 'Produksi & QC',
        href: '/production',
        requiredPermission: 'production:read',
      },
      {
        id: 'vendors',
        label: 'Vendor',
        href: '/vendors',
        requiredPermission: 'vendors:read',
      },
      {
        id: 'shipments',
        label: 'Pengiriman',
        href: '/shipments',
        requiredPermission: 'shipments:read',
      },
      {
        id: 'inventory',
        label: 'Persediaan',
        href: '/inventory',
        requiredPermission: 'inventory:read',
      },
      {
        id: 'procurement',
        label: 'Pengadaan',
        href: '/procurement',
        requiredPermission: 'procurement:read',
      },
      {
        id: 'exceptions',
        label: 'Exception Operasional',
        href: '/exceptions',
        requiredPermission: 'operational_exceptions:read',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Keuangan',
    items: [
      {
        id: 'invoices',
        label: 'Invoice',
        href: '/invoices',
        requiredPermission: 'invoices:read',
      },
      {
        id: 'payments',
        label: 'Pembayaran',
        href: '/payments',
        requiredPermission: 'payments:read',
      },
      {
        id: 'ledger',
        label: 'Buku Kas / Margin',
        href: '/ledger',
        requiredPermission: 'ledger:read',
      },
    ],
  },
  {
    id: 'system',
    title: 'Sistem',
    items: [{ id: 'settings', label: 'Pengaturan', href: '/settings' }],
  },
];

export function filterNavGroupsForSession(
  groups: readonly NavGroupDef[],
  roleCode: MgbosRole,
  activeBrandCode: string,
): NavGroupDef[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.brandOnly && item.brandOnly !== activeBrandCode) {
          return false;
        }
        if (
          item.requiredPermission &&
          !hasPermission(roleCode, item.requiredPermission)
        ) {
          return false;
        }
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
}
