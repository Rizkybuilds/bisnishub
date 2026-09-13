import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Package, Sparkles, Truck, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function MobileBottomNav() {
  const { totalCartItems } = useStore();
  const location = useLocation();

  const isBlankActive = location.pathname === '/polos' || (location.pathname === '/katalog' && location.search.includes('series=blank'));
  const isCatalogActive = location.pathname === '/katalog' && !location.search.includes('series=blank');

  // Sembunyikan Bottom Nav di halaman detail produk (/produk/:sku) agar StickyMobileBuyBar leluasa dan tidak menumpuk layar
  if (location.pathname.startsWith('/produk/')) {
    return null;
  }

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 md:hidden pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto bg-ts-surfaceCard backdrop-blur-2xl border border-ts-border rounded-2xl shadow-elevation px-2 py-1.5 transition-colors">
        <div className="grid grid-cols-5 items-center">
          {/* Beranda */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1.5 gap-0.5 text-[10px] font-semibold transition-all ${
                isActive ? 'text-ts-krem font-bold' : 'text-ts-muted hover:text-ts-krem'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Home className={`w-4.5 h-4.5 transition-transform ${isActive ? 'scale-110 text-ts-terracotta' : ''}`} />
                <span>Beranda</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-ts-terracotta mt-0.5 shadow-glow-terracotta" />}
              </>
            )}
          </NavLink>

          {/* Kaos Polos NSA */}
          <NavLink
            to="/polos"
            className={() =>
              `relative flex flex-col items-center justify-center py-1.5 gap-0.5 text-[10px] font-semibold transition-all ${
                isBlankActive ? 'text-ts-krem font-bold' : 'text-ts-muted hover:text-ts-krem'
              }`
            }
          >
            <Package className={`w-4.5 h-4.5 transition-transform ${isBlankActive ? 'scale-110 text-ts-teal' : ''}`} />
            <span>Polos NSA</span>
            {isBlankActive && <div className="w-1 h-1 rounded-full bg-ts-teal mt-0.5 shadow-glow-teal" />}
          </NavLink>

          {/* Desain Grafis */}
          <NavLink
            to="/katalog"
            className={() =>
              `relative flex flex-col items-center justify-center py-1.5 gap-0.5 text-[10px] font-semibold transition-all ${
                isCatalogActive ? 'text-ts-krem font-bold' : 'text-ts-muted hover:text-ts-krem'
              }`
            }
          >
            <Sparkles className={`w-4.5 h-4.5 transition-transform ${isCatalogActive ? 'scale-110 text-ts-mustard' : ''}`} />
            <span>Katalog</span>
            {isCatalogActive && <div className="w-1 h-1 rounded-full bg-ts-mustard mt-0.5 shadow-glow-mustard" />}
          </NavLink>

          {/* Lacak Pesanan */}
          <NavLink
            to="/tracking"
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1.5 gap-0.5 text-[10px] font-semibold transition-all ${
                isActive ? 'text-ts-krem font-bold' : 'text-ts-muted hover:text-ts-krem'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Truck className={`w-4.5 h-4.5 transition-transform ${isActive ? 'scale-110 text-ts-terracotta' : ''}`} />
                <span>Lacak</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-ts-terracotta mt-0.5 shadow-glow-terracotta" />}
              </>
            )}
          </NavLink>

          {/* Keranjang Belanja */}
          <NavLink
            to="/keranjang"
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1.5 gap-0.5 text-[10px] font-semibold transition-all ${
                isActive ? 'text-ts-krem font-bold' : 'text-ts-muted hover:text-ts-krem'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <ShoppingBag className={`w-4.5 h-4.5 transition-transform ${isActive ? 'scale-110 text-ts-terracotta' : ''}`} />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-ts-terracotta text-white text-[9px] font-bold font-mono flex items-center justify-center border border-white/20">
                      {totalCartItems}
                    </span>
                  )}
                </div>
                <span>Troli</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-ts-terracotta mt-0.5 shadow-glow-terracotta" />}
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

