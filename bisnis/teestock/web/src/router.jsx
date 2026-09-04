import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { StoreLayout } from './layouts/StoreLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Store Pages
import { HomePage } from './pages/store/HomePage';
import { CatalogPage as StoreCatalogPage } from './pages/store/CatalogPage';
import { ProductDetailPage } from './pages/store/ProductDetailPage';
import { CustomOrderPage } from './pages/store/CustomOrderPage';
import { CartPage } from './pages/store/CartPage';
import { OrderTrackingPage } from './pages/store/OrderTrackingPage';

// Admin Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { CatalogPage as AdminCatalogPage } from './pages/admin/CatalogPage';
import { InventoryPage } from './pages/admin/InventoryPage';
import { KanbanPage } from './pages/admin/KanbanPage';
import { GangSheetPage } from './pages/admin/GangSheetPage';
import { QuoterPage } from './pages/admin/QuoterPage';
import { SettingsPage } from './pages/admin/SettingsPage';

export const router = createBrowserRouter([
  // Storefront Public Routes
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'katalog', element: <StoreCatalogPage /> },
      { path: 'produk/:sku', element: <ProductDetailPage /> },
      { path: 'custom-order', element: <CustomOrderPage /> },
      { path: 'keranjang', element: <CartPage /> },
      { path: 'tracking', element: <OrderTrackingPage /> },
    ],
  },

  // Admin Internal Hub Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'katalog', element: <AdminCatalogPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'gangsheet', element: <GangSheetPage /> },
      { path: 'quoter', element: <QuoterPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Fallback 404
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);
