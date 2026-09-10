import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { StoreLayout } from './layouts/StoreLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminProvider } from './context/AdminContext';

// Auth Guard
import { AuthGuard } from './components/admin/AuthGuard';

// Eager Store Pages (Above-the-fold critical routes)
import { HomePage } from './pages/store/HomePage';
import { BioLinkPage } from './pages/store/BioLinkPage';

// Lazy-loaded Store Pages (Code Splitting for Core Web Vitals)
const StoreCatalogPage = lazy(() => import('./pages/store/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('./pages/store/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CustomOrderPage = lazy(() => import('./pages/store/CustomOrderPage').then(m => ({ default: m.CustomOrderPage })));
const CartPage = lazy(() => import('./pages/store/CartPage').then(m => ({ default: m.CartPage })));
const OrderTrackingPage = lazy(() => import('./pages/store/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const AccountPage = lazy(() => import('./pages/store/AccountPage').then(m => ({ default: m.AccountPage })));
const PartnerPage = lazy(() => import('./pages/store/PartnerPage').then(m => ({ default: m.PartnerPage })));
const GaransiPage = lazy(() => import('./pages/store/GaransiPage').then(m => ({ default: m.GaransiPage })));

// Lazy-loaded Admin Pages (Zero Admin Code in Initial Public Bundle)
const LoginPage = lazy(() => import('./pages/admin/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AdminCatalogPage = lazy(() => import('./pages/admin/CatalogPage').then(m => ({ default: m.CatalogPage })));
const InventoryPage = lazy(() => import('./pages/admin/InventoryPage').then(m => ({ default: m.InventoryPage })));
const KanbanPage = lazy(() => import('./pages/admin/KanbanPage').then(m => ({ default: m.KanbanPage })));
const GangSheetPage = lazy(() => import('./pages/admin/GangSheetPage').then(m => ({ default: m.GangSheetPage })));
const QuoterPage = lazy(() => import('./pages/admin/QuoterPage').then(m => ({ default: m.QuoterPage })));
const DefectsPage = lazy(() => import('./pages/admin/DefectsPage').then(m => ({ default: m.DefectsPage })));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage').then(m => ({ default: m.SettingsPage })));
const ProcurementsPage = lazy(() => import('./pages/admin/ProcurementsPage').then(m => ({ default: m.ProcurementsPage })));
const LedgerPage = lazy(() => import('./pages/admin/LedgerPage').then(m => ({ default: m.LedgerPage })));
const AssetsPage = lazy(() => import('./pages/admin/AssetsPage').then(m => ({ default: m.AssetsPage })));

/**
 * Loading fallback component for Storefront routes
 */
function StoreSuspense({ children, message = 'Memuat...' }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-ts-terracotta border-t-transparent" />
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-ts-kremMuted">{message}</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

/**
 * Loading fallback component for Admin Hub routes
 */
function AdminSuspense({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-12 text-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-ts-teal border-t-transparent" />
          <p className="mt-3 font-mono text-xs uppercase tracking-wider text-ts-muted">Memuat Modul Admin...</p>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  // Bio Link — standalone micro landing page (no StoreLayout wrapper)
  {
    path: '/bio',
    element: <BioLinkPage />,
  },

  // Storefront Public Routes
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { 
        path: 'katalog', 
        element: <StoreSuspense message="Memuat Katalog Grafis..."><StoreCatalogPage defaultSegment="graphics" /></StoreSuspense> 
      },
      { 
        path: 'polos', 
        element: <StoreSuspense message="Memuat Katalog NSA Blanks..."><StoreCatalogPage defaultSegment="blank" /></StoreSuspense> 
      },
      { 
        path: 'produk/:sku', 
        element: <StoreSuspense message="Memuat Detail Produk..."><ProductDetailPage /></StoreSuspense> 
      },
      { 
        path: 'custom-order', 
        element: <StoreSuspense message="Memuat Studio Custom..."><CustomOrderPage /></StoreSuspense> 
      },
      { 
        path: 'keranjang', 
        element: <StoreSuspense message="Memuat Keranjang..."><CartPage /></StoreSuspense> 
      },
      { 
        path: 'tracking', 
        element: <StoreSuspense message="Memuat Pelacakan..."><OrderTrackingPage /></StoreSuspense> 
      },
      { 
        path: 'akun', 
        element: <StoreSuspense message="Memuat Akun..."><AccountPage /></StoreSuspense> 
      },
      { 
        path: 'partner', 
        element: <StoreSuspense message="Memuat Info Kemitraan..."><PartnerPage /></StoreSuspense> 
      },
      { 
        path: 'care', 
        element: <StoreSuspense message="Memuat Garansi & Panduan Perawatan..."><GaransiPage /></StoreSuspense> 
      },
      { 
        path: 'garansi', 
        element: <StoreSuspense message="Memuat Garansi..."><GaransiPage /></StoreSuspense> 
      },
    ],
  },

  // Admin Login (publik — di luar AuthGuard)
  {
    path: '/admin/login',
    element: <AdminSuspense><LoginPage /></AdminSuspense>,
  },

  // Admin Internal Hub Routes (dilindungi AuthGuard & AdminProvider)
  {
    path: '/admin',
    element: (
      <AuthGuard>
        <AdminProvider>
          <AdminLayout />
        </AdminProvider>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <AdminSuspense><DashboardPage /></AdminSuspense> },
      { path: 'pengadaan', element: <AdminSuspense><ProcurementsPage /></AdminSuspense> },
      { path: 'buku-kas', element: <AdminSuspense><LedgerPage /></AdminSuspense> },
      { path: 'aset', element: <AdminSuspense><AssetsPage /></AdminSuspense> },
      { path: 'katalog', element: <AdminSuspense><AdminCatalogPage /></AdminSuspense> },
      { path: 'inventory', element: <AdminSuspense><InventoryPage /></AdminSuspense> },
      { path: 'kanban', element: <AdminSuspense><KanbanPage /></AdminSuspense> },
      { path: 'gangsheet', element: <AdminSuspense><GangSheetPage /></AdminSuspense> },
      { path: 'quoter', element: <AdminSuspense><QuoterPage /></AdminSuspense> },
      { path: 'defects', element: <AdminSuspense><DefectsPage /></AdminSuspense> },
      { path: 'settings', element: <AdminSuspense><SettingsPage /></AdminSuspense> },
    ],
  },

  // Fallback 404
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
