import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Package, Sparkles, Truck, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function MobileBottomNav() {
  const { totalCartItems } = useStore();
  const location = useLocation();

  const isBlankActive = location.pathname === '/katalog' && location.search.includes('series=blank');
  const isCatalogActive = location.pathname === '/katalog' && !location.search.includes('series=blank');

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-ts-surface/95 backdrop-blur-md border-t border-ts-border md:hidden safe-area-pb">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* Beranda */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-ts-terracotta font-bold' : 'text-ts-muted hover:text-ts-krem'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Beranda</span>
        </NavLink>

        {/* Kaos Polos NSA */}
        <NavLink
          to="/katalog?series=blank"
          className={() =>
            `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors ${
              isBlankActive ? 'text-ts-terracotta font-bold' : 'text-ts-muted hover:text-ts-krem'
            }`
          }
        >
          <Package className="w-5 h-5" />
          <span>Kaos Polos</span>
        </NavLink>

        {/* Desain Grafis */}
        <NavLink
          to="/katalog"
          className={() =>
            `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors ${
              isCatalogActive ? 'text-ts-terracotta font-bold' : 'text-ts-muted hover:text-ts-krem'
            }`
          }
        >
          <Sparkles className="w-5 h-5" />
          <span>Desain</span>
        </NavLink>

        {/* Lacak Pesanan */}
        <NavLink
          to="/tracking"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-ts-terracotta font-bold' : 'text-ts-muted hover:text-ts-krem'
            }`
          }
        >
          <Truck className="w-5 h-5" />
          <span>Lacak</span>
        </NavLink>

        {/* Keranjang Belanja */}
        <NavLink
          to="/keranjang"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 gap-1 text-[10px] font-semibold transition-colors ${
              isActive ? 'text-ts-terracotta font-bold' : 'text-ts-muted hover:text-ts-krem'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-ts-terracotta text-white text-[9px] font-bold font-mono flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </div>
          <span>Keranjang</span>
        </NavLink>
      </div>
    </nav>
  );
}
