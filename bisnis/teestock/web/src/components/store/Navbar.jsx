import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ShieldCheck, Sparkles, User, Package, Zap, LogOut, ChevronDown, Users } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { totalCartItems } = useStore();
  const { isAuthenticated, user, profile, role, isAdmin, openAuthModal, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const isBlankActive = location.pathname === '/katalog' && location.search.includes('series=blank');
  const isGraphicActive = location.pathname === '/katalog' && !location.search.includes('series=blank');

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Ticker Notice Bar */}
      <div className="bg-[#121110]/90 backdrop-blur-md text-[11px] font-medium text-ts-kremMuted py-1.5 px-4 text-center border-b border-white/[0.06] flex items-center justify-center gap-3 sm:gap-6 overflow-hidden">
        <span className="flex items-center gap-1.5 text-ts-krem">
          <ShieldCheck className="w-3.5 h-3.5 text-ts-green animate-pulse" />
          <span>100% Garmen Asli New States Apparel (NSA) Softstyle 30s</span>
        </span>
        <span className="hidden sm:inline text-white/20">•</span>
        <span className="hidden sm:flex items-center gap-1.5 text-ts-kremMuted">
          <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
          <span>Sablon DTF HD Raster Suhu 155°C Anti-Pecah</span>
        </span>
        <span className="hidden md:inline text-white/20">•</span>
        <span className="hidden md:flex items-center gap-1.5 text-ts-kremMuted">
          <Zap className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>Produksi &amp; Kirim Cepat H+1</span>
        </span>
      </div>

      {/* Main Floating Navbar Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="h-14 sm:h-16 px-3 sm:px-5 rounded-2xl bg-ts-surface/80 backdrop-blur-xl border border-white/[0.09] shadow-glass-card shadow-glass-inset flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-ts-terracotta to-[#9E4620] flex items-center justify-center font-extrabold text-white tracking-wider text-sm sm:text-base shadow-glow-terracotta border border-white/25 transition-transform group-hover:scale-105">
              <span>TS</span>
              <div className="absolute -inset-0.5 rounded-xl bg-ts-terracotta/30 blur-sm -z-10 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-extrabold tracking-tight text-ts-krem group-hover:text-white transition-colors">
                TeeStock
              </span>
              <span className="text-[9px] sm:text-[10px] block -mt-1 font-bold text-ts-terracotta tracking-widest uppercase font-mono">
                Apparel
              </span>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white/[0.1] text-white shadow-sm border border-white/10'
                    : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              Beranda
            </NavLink>
            <NavLink
              to="/katalog"
              className={() =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isGraphicActive
                    ? 'bg-white/[0.1] text-white shadow-sm border border-white/10'
                    : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              Katalog Grafis
            </NavLink>
            <NavLink
              to="/katalog?series=blank"
              className={() =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isBlankActive
                    ? 'bg-ts-teal/20 text-white shadow-sm border border-ts-teal/30'
                    : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-ts-teal/30 text-teal-300 border border-ts-teal/40">
                NSA
              </span>
              <span>Kaos Polos</span>
            </NavLink>
            <NavLink
              to="/custom-order"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white/[0.1] text-white shadow-sm border border-white/10'
                    : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              Custom Sablon
            </NavLink>
            <NavLink
              to="/partner"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-ts-terracotta/20 text-ts-terracotta shadow-sm border border-ts-terracotta/30'
                    : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-ts-mustard/20 text-ts-mustard border border-ts-mustard/30">
                Mitra
              </span>
              <span>Dropship</span>
            </NavLink>
            <NavLink
              to="/tracking"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white/[0.1] text-white shadow-sm border border-white/10'
                    : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                }`
              }
            >
              Lacak Pesanan
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              to="/katalog"
              className="p-2 rounded-xl text-ts-kremMuted hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
              title="Cari Desain / Polos"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>

            <Link
              to="/keranjang"
              className="relative p-2 rounded-xl text-ts-kremMuted hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ts-terracotta text-white text-[10px] font-bold font-mono flex items-center justify-center shadow-glow-terracotta animate-in zoom-in border border-white/20">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-ts-krem transition-all shadow-glass-inset"
                >
                  <div className="w-5 h-5 rounded-full bg-ts-terracotta/30 text-ts-terracotta flex items-center justify-center text-[10px] font-mono">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-ts-muted" />
                </button>

                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-52 rounded-2xl bg-ts-surface border border-white/[0.12] p-2 shadow-xl z-50 text-xs space-y-1 animate-in fade-in zoom-in-95"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-white/[0.06] mb-1">
                      <p className="font-bold text-white truncate">{profile?.full_name || 'Member'}</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30">
                        Role: {role}
                      </span>
                    </div>

                    <Link
                      to="/akun"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-ts-kremMuted hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-ts-terracotta" />
                      <span>Akun &amp; Profil</span>
                    </Link>

                    <Link
                      to="/akun?tab=orders"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-ts-kremMuted hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Package className="w-3.5 h-3.5 text-ts-mustard" />
                      <span>Pesanan Saya</span>
                    </Link>

                    <Link
                      to="/partner"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-ts-kremMuted hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      <Users className="w-3.5 h-3.5 text-ts-teal" />
                      <span>Portal Kemitraan</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-ts-kremMuted hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-ts-terracotta" />
                        <span>Admin Hub</span>
                      </Link>
                    )}

                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-ts-terracotta/50 text-ts-krem transition-all shadow-glass-inset"
              >
                <User className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


