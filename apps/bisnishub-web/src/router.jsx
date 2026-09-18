import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout
import { AdminLayout } from './layouts/AdminLayout';

// Admin Core Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProcurementsPage } from './pages/admin/ProcurementsPage';
import { LedgerPage } from './pages/admin/LedgerPage';
import { AssetsPage } from './pages/admin/AssetsPage';
import { KanbanPage } from './pages/admin/KanbanPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { CatalogPage } from './pages/admin/CatalogPage';
import { GangSheetPage } from './pages/admin/GangSheetPage';
import { DefectsPage } from './pages/admin/DefectsPage';
import { QuoterPage } from './pages/admin/QuoterPage';
import { CustomersPage } from './pages/admin/CustomersPage';
import { VendorsPage } from './pages/admin/VendorsPage';
import { MarketingPage } from './pages/admin/MarketingPage';
import { StoragePage } from './pages/admin/StoragePage';
import { SettingsPage } from './pages/admin/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'pengadaan', element: <ProcurementsPage /> },
      { path: 'buku-kas', element: <LedgerPage /> },
      { path: 'aset', element: <AssetsPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'katalog', element: <CatalogPage /> },
      { path: 'gangsheet', element: <GangSheetPage /> },
      { path: 'gang-sheet', element: <Navigate to="/gangsheet" replace /> },
      { path: 'defects', element: <DefectsPage /> },
      { path: 'quoter', element: <QuoterPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'pelanggan', element: <Navigate to="/customers" replace /> },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'mitra', element: <Navigate to="/vendors" replace /> },
      { path: 'marketing', element: <MarketingPage /> },
      { path: 'storage', element: <StoragePage /> },
      { path: 'settings', element: <SettingsPage /> },

      // Legacy /admin/* support for internal redirects
      { path: 'admin', element: <Navigate to="/" replace /> },
      { path: 'admin/pengadaan', element: <Navigate to="/pengadaan" replace /> },
      { path: 'admin/buku-kas', element: <Navigate to="/buku-kas" replace /> },
      { path: 'admin/aset', element: <Navigate to="/aset" replace /> },
      { path: 'admin/kanban', element: <Navigate to="/kanban" replace /> },
      { path: 'admin/inventory', element: <Navigate to="/inventory" replace /> },
      { path: 'admin/katalog', element: <Navigate to="/katalog" replace /> },
      { path: 'admin/gangsheet', element: <Navigate to="/gangsheet" replace /> },
      { path: 'admin/defects', element: <Navigate to="/defects" replace /> },
      { path: 'admin/quoter', element: <Navigate to="/quoter" replace /> },
      { path: 'admin/customers', element: <Navigate to="/customers" replace /> },
      { path: 'admin/pelanggan', element: <Navigate to="/customers" replace /> },
      { path: 'admin/vendors', element: <Navigate to="/vendors" replace /> },
      { path: 'admin/marketing', element: <Navigate to="/marketing" replace /> },
      { path: 'admin/storage', element: <Navigate to="/storage" replace /> },
      { path: 'admin/settings', element: <Navigate to="/settings" replace /> },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
