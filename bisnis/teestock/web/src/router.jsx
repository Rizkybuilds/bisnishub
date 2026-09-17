import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import { StoreLayout } from './layouts/StoreLayout';

// Eager Store Pages (Above-the-fold critical routes)
import { HomePage } from './pages/store/HomePage';
import { BioLinkPage } from './pages/store/BioLinkPage';

/**
 * Safe lazy loader with auto-retry on new Vercel deployment chunk mismatches
 */
function safeLazy(importFn) {
  return lazy(async () => {
    try {
      const module = await importFn();
      try {
        sessionStorage.removeItem('chunk_reload_' + window.location.pathname);
      } catch (_) {}
      return module;
    } catch (error) {
      console.warn('Chunk load error, auto-reloading page with new deployment:', error);
      const isChunkError = 
        error?.message?.includes('dynamically imported module') || 
        error?.message?.includes('Loading chunk') ||
        error?.name === 'TypeError';

      if (isChunkError && typeof window !== 'undefined') {
        const reloadKey = 'chunk_reload_' + window.location.pathname;
        const attempts = Number(sessionStorage.getItem(reloadKey) || 0);
        if (attempts < 2) {
          sessionStorage.setItem(reloadKey, String(attempts + 1));
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw error;
    }
  });
}

// Lazy-loaded Store Pages (Code Splitting for Core Web Vitals)
const StoreCatalogPage = safeLazy(() => import('./pages/store/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductDetailPage = safeLazy(() => import('./pages/store/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CustomOrderPage = safeLazy(() => import('./pages/store/CustomOrderPage').then(m => ({ default: m.CustomOrderPage })));
const CartPage = safeLazy(() => import('./pages/store/CartPage').then(m => ({ default: m.CartPage })));
const OrderTrackingPage = safeLazy(() => import('./pages/store/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const AccountPage = safeLazy(() => import('./pages/store/AccountPage').then(m => ({ default: m.AccountPage })));
const PartnerPage = safeLazy(() => import('./pages/store/PartnerPage').then(m => ({ default: m.PartnerPage })));
const GaransiPage = safeLazy(() => import('./pages/store/GaransiPage').then(m => ({ default: m.GaransiPage })));
const CreatorPage = safeLazy(() => import('./pages/store/CreatorPage').then(m => ({ default: m.CreatorPage })));
const NotFoundPage = safeLazy(() => import('./pages/store/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

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
        path: 'mitra', 
        element: <StoreSuspense message="Memuat Portal Kemitraan B2B..."><PartnerPage /></StoreSuspense> 
      },
      { 
        path: 'care', 
        element: <StoreSuspense message="Memuat Garansi & Panduan Perawatan..."><GaransiPage /></StoreSuspense> 
      },
      { 
        path: 'garansi', 
        element: <StoreSuspense message="Memuat Garansi..."><GaransiPage /></StoreSuspense> 
      },
      { 
        path: 'creator', 
        element: <StoreSuspense message="Memuat Panggung Kreator..."><CreatorPage /></StoreSuspense> 
      },
      { 
        path: 'kreator', 
        element: <StoreSuspense message="Memuat Panggung Kreator..."><CreatorPage /></StoreSuspense> 
      },
      {
        path: '*',
        element: <StoreSuspense message="Mencari Halaman..."><NotFoundPage /></StoreSuspense>
      },
    ],
  },

  // Fallback 404 Root
  {
    path: '*',
    element: <StoreLayout><StoreSuspense message="Mencari Halaman..."><NotFoundPage /></StoreSuspense></StoreLayout>
  }
]);
