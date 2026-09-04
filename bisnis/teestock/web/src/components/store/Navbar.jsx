import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Search, ShieldCheck, Sparkles, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function Navbar() {
  const { totalCartItems } = useStore();

  return (
    <div className="sticky top-0 z-40 bg-ts-hitam/95 backdrop-blur border-b border-ts-border">
      {/* Top Notice Bar */}
      <div className="bg-ts-surface text-[11px] font-semibold text-ts-krem/90 py-1.5 px-4 text-center border-b border-ts-borderDim flex items-center justify-center gap-4">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-ts-green" /> 100% Kaos Polos New State Apparel (NSA) Original
        </span>
        <span className="hidden md:inline text-ts-muted">•</span>
        <span className="hidden md:flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-ts-mustard" /> Sablon DTF HD Raster Tahan Cuci
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-ts-terracotta flex items-center justify-center font-bold text-white tracking-wider text-base shadow-lg shadow-ts-terracotta/20">
            TS
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-ts-krem">TeeStock</span>
            <span className="text-[10px] block -mt-1 font-semibold text-ts-terracotta tracking-widest uppercase">Apparel</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive ? 'text-ts-terracotta font-bold' : 'text-ts-krem/80 hover:text-white'
              }`
            }
          >
            Beranda
          </NavLink>
          <NavLink
            to="/katalog"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive ? 'text-ts-terracotta font-bold' : 'text-ts-krem/80 hover:text-white'
              }`
            }
          >
            Katalog Series
          </NavLink>
          <NavLink
            to="/custom-order"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive ? 'text-ts-terracotta font-bold' : 'text-ts-krem/80 hover:text-white'
              }`
            }
          >
            Custom Sablon
          </NavLink>
          <NavLink
            to="/tracking"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive ? 'text-ts-terracotta font-bold' : 'text-ts-krem/80 hover:text-white'
              }`
            }
          >
            Lacak Pesanan
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/katalog"
            className="p-2 rounded-lg text-ts-krem/80 hover:text-white hover:bg-ts-surface transition-colors"
            title="Cari Desain"
          >
            <Search className="w-5 h-5" />
          </Link>

          <Link
            to="/keranjang"
            className="relative p-2 rounded-lg text-ts-krem/80 hover:text-white hover:bg-ts-surface transition-colors"
            title="Keranjang Belanja"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ts-terracotta text-white text-[10px] font-bold flex items-center justify-center font-mono animate-in zoom-in">
                {totalCartItems}
              </span>
            )}
          </Link>

          <Link
            to="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-ts-surface border border-ts-border hover:border-ts-terracotta text-ts-krem/90 transition-all"
          >
            <User className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>Portal Internal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
