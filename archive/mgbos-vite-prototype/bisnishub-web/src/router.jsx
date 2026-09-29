import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layout
import { AuthGuard } from './components/admin/AuthGuard';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminSession } from './context/AdminSession';
import { AdminLayout } from './layouts/AdminLayout';

// Admin Core Pages
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ProcurementsPage = lazy(() => import('./pages/admin/ProcurementsPage').then(module => ({ default: module.ProcurementsPage })));
const LedgerPage = lazy(() => import('./pages/admin/LedgerPage').then(module => ({ default: module.LedgerPage })));
const AssetsPage = lazy(() => import('./pages/admin/AssetsPage').then(module => ({ default: module.AssetsPage })));
const KanbanPage = lazy(() => import('./pages/admin/KanbanPage').then(module => ({ default: module.KanbanPage })));
const InventoryPage = lazy(() => import('./pages/admin/InventoryPage').then(module => ({ default: module.InventoryPage })));
const CatalogPage = lazy(() => import('./pages/admin/CatalogPage').then(module => ({ default: module.CatalogPage })));
const GangSheetPage = lazy(() => import('./pages/admin/GangSheetPage').then(module => ({ default: module.GangSheetPage })));
const DefectsPage = lazy(() => import('./pages/admin/DefectsPage').then(module => ({ default: module.DefectsPage })));
const QuoterPage = lazy(() => import('./pages/admin/QuoterPage').then(module => ({ default: module.QuoterPage })));
const CustomersPage = lazy(() => import('./pages/admin/CustomersPage').then(module => ({ default: module.CustomersPage })));
const VendorsPage = lazy(() => import('./pages/admin/VendorsPage').then(module => ({ default: module.VendorsPage })));
const MarketingPage = lazy(() => import('./pages/admin/MarketingPage').then(module => ({ default: module.MarketingPage })));
const StoragePage = lazy(() => import('./pages/admin/StoragePage').then(module => ({ default: module.StoragePage })));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage').then(module => ({ default: module.SettingsPage })));

export const router = createBrowserRouter([
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AuthGuard><AdminSession><Suspense fallback={<p role="status" className="p-6">Memuat halaman...</p>}><AdminLayout /></Suspense></AdminSession></AuthGuard>,
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
