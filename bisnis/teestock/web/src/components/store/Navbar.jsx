import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, ShieldCheck, Sparkles, User, Package, Zap, LogOut, ChevronDown, Users, Menu, X, Palette, HeartHandshake, Truck, HelpCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { TeeStockLogo } from '../common/TeeStockLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function Navbar() {
  const { totalCartItems, storeSettings } = useStore();
  const { isAuthenticated, user, profile, role, isAdmin, openAuthModal, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const isBlankActive = location.pathname === '/polos' || (location.pathname === '/katalog' && location.search.includes('series=blank'));
  const isGraphicActive = location.pathname === '/katalog' && !location.search.includes('series=blank');

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  // Auto close drawer when route changes
  useEffect(() => {
    setMobileDrawerOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [userMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Ticker Notice Bar */}
      <div className="bg-ts-surface text-[10px] font-mono tracking-wider text-ts-kremMuted py-1.5 px-4 text-center border-b border-ts-border flex items-center justify-center gap-3 sm:gap-6 overflow-hidden uppercase transition-colors">
        <span className="flex items-center gap-1.5 text-ts-krem font-medium truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-ts-green shrink-0" />
          <span>100% Garmen Asli New States Apparel (NSA) <span className="hidden sm:inline">• Softstyle 30s &amp; Heavyweight 24s</span></span>
        </span>
        <span className="hidden sm:inline text-ts-borderHover">•</span>
        <span className="hidden sm:flex items-center gap-1.5 text-ts-kremMuted">
          <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
          <span>Sablon DTF Double-Press 155°C</span>
        </span>
        <span className="hidden md:inline text-ts-borderHover">•</span>
        <span className="hidden md:flex items-center gap-1.5 text-ts-kremMuted">
          <Zap className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>SLA Produksi Cepat H+0 / H+1</span>
        </span>
      </div>

      {/* Main Floating Navbar Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        <div className="h-14 sm:h-16 px-3 sm:px-5 rounded-2xl bg-ts-surfaceCard backdrop-blur-xl border border-ts-border flex items-center justify-between shadow-elevation transition-all">
          {/* Official Brand Logo */}
          <Link to="/" className="group focus:outline-none" aria-label="TeeStock Apparel Beranda">
            <TeeStockLogo size="md" badge="APPAREL HOUSE" />
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-ts-surface p-1 rounded-xl border border-ts-border">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-ts-surfaceHover text-ts-krem shadow-sm border border-ts-borderHover'
                    : 'text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover/50'
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
                    ? 'bg-ts-surfaceHover text-ts-krem shadow-sm border border-ts-borderHover'
                    : 'text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover/50'
                }`
              }
            >
              Katalog Grafis
            </NavLink>
            <NavLink
              to="/polos"
              className={() =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isBlankActive
                    ? 'bg-ts-teal/20 text-ts-teal dark:text-white shadow-sm border border-ts-teal/30'
                    : 'text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover/50'
                }`
              }
            >
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-ts-teal/30 text-teal-700 dark:text-teal-300 border border-ts-teal/40">
                NSA
              </span>
              <span>Kaos Polos</span>
            </NavLink>
            <NavLink
              to="/custom-order"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-ts-surfaceHover text-ts-krem shadow-sm border border-ts-borderHover'
                    : 'text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover/50'
                }`
              }
            >
              Custom Sablon
            </NavLink>
            <NavLink
              to="/tracking"
              className={({ isActive }) =>
                `px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-ts-surfaceHover text-ts-krem shadow-sm border border-ts-borderHover'
                    : 'text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover/50'
                }`
              }
            >
              Lacak Pesanan
            </NavLink>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:flex items-center">
              <ThemeToggle compact={true} />
            </div>

            <Link
              to="/katalog"
              className="p-2 rounded-xl text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-transparent hover:border-ts-border transition-all"
              title="Cari Desain / Polos"
              aria-label="Cari desain katalog atau kaos polos"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>

            <Link
              to="/keranjang"
              className="relative p-2 rounded-xl text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-transparent hover:border-ts-border transition-all"
              title="Keranjang Belanja"
              aria-label={`Keranjang belanja, ${totalCartItems} item`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-ts-terracotta text-white text-[10px] font-bold font-mono flex items-center justify-center border border-white/20 animate-in zoom-in">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  aria-label="Buka menu akun pengguna"
                  className="inline-flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-ts-krem transition-all shadow-glass-inset cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-ts-terracotta/30 text-ts-terracotta flex items-center justify-center text-[10px] font-mono">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[100px] truncate hidden sm:inline">
                    {profile?.full_name || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-ts-muted transition-transform duration-150 hidden sm:inline ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div 
                    role="menu"
                    aria-label="Menu pengguna"
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-ts-terracotta/50 text-ts-krem transition-all shadow-glass-inset"
              >
                <User className="w-3.5 h-3.5 text-ts-terracotta" />
                <span>Masuk</span>
              </button>
            )}

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl text-ts-kremMuted hover:text-white hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
              title="Buka Menu"
              aria-label="Buka Menu Navigasi"
              aria-expanded={mobileDrawerOpen}
            >
              <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-ts-krem" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu Navigasi Mobile"
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-ts-surface text-ts-krem border-l border-ts-border p-5 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-in slide-in-from-right duration-300 transition-colors"
          >
            <div className="space-y-6">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-ts-border">
                <TeeStockLogo size="sm" badge="APPAREL HOUSE" />
                <div className="flex items-center gap-2">
                  <ThemeToggle compact={true} />
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-xl text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover transition-colors cursor-pointer"
                    aria-label="Tutup Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Navigation Links Group */}
              <div className="space-y-4 text-xs">
                {/* Section 1: Belanja Ritel */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ts-muted font-bold block mb-1.5 px-1">
                    Koleksi Apparel
                  </span>
                  <div className="space-y-1">
                    <NavLink
                      to="/"
                      end
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-ts-terracotta/20 text-white font-bold border border-ts-terracotta/30'
                            : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span>Beranda Utama</span>
                      <ChevronDown className="-rotate-90 w-3.5 h-3.5 opacity-50" />
                    </NavLink>

                    <NavLink
                      to="/katalog"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={() =>
                        `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isGraphicActive
                            ? 'bg-ts-terracotta/20 text-white font-bold border border-ts-terracotta/30'
                            : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                        <span>Katalog Desain Grafis</span>
                      </span>
                      <span className="text-[9px] font-mono font-bold text-ts-mustard bg-ts-mustard/15 px-1.5 py-0.5 rounded">
                        Curated
                      </span>
                    </NavLink>

                    <NavLink
                      to="/polos"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={() =>
                        `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isBlankActive
                            ? 'bg-ts-teal/20 text-white font-bold border border-ts-teal/30'
                            : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-ts-teal" />
                        <span>Kaos Polos NSA Original</span>
                      </span>
                      <span className="text-[9px] font-mono font-bold text-teal-300 bg-ts-teal/20 px-1.5 py-0.5 rounded">
                        12 Model
                      </span>
                    </NavLink>
                  </div>
                </div>

                {/* Section 2: Layanan Studio & Kemitraan */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ts-muted font-bold block mb-1.5 px-1">
                    Layanan Studio &amp; B2B
                  </span>
                  <div className="space-y-1">
                    <NavLink
                      to="/custom-order"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-ts-terracotta/20 text-white font-bold border border-ts-terracotta/30'
                            : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Palette className="w-3.5 h-3.5 text-ts-terracotta" />
                        <span>TeeStock Atelier (Custom Kaos)</span>
                      </span>
                      <span className="text-[9px] font-mono font-bold text-ts-terracotta bg-ts-terracotta/20 px-1.5 py-0.5 rounded">
                        Satuan / Komunitas
                      </span>
                    </NavLink>

                    <NavLink
                      to="/garansi"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-white/[0.1] text-white font-bold border border-white/20'
                            : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
                        <span>Garansi &amp; Panduan Perawatan</span>
                      </span>
                      <span className="text-[9px] font-mono font-bold text-ts-green bg-ts-green/20 px-1.5 py-0.5 rounded">
                        100% Retur
                      </span>
                    </NavLink>
                  </div>
                </div>

                {/* Section 3: Bantuan & Lacak */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ts-muted font-bold block mb-1.5 px-1">
                    Bantuan &amp; Transparansi
                  </span>
                  <div className="space-y-1">
                    <NavLink
                      to="/tracking"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-white/[0.1] text-white font-bold border border-white/20'
                            : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-ts-terracotta" />
                        <span>Lacak Pesanan &amp; Resi</span>
                      </span>
                    </NavLink>

                    <NavLink
                      to="/care"
                      onClick={() => setMobileDrawerOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isActive
                            ? 'bg-white/[0.1] text-white font-bold border border-white/20'
                            : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
                        <span>Garansi &amp; Size Guide NSA</span>
                      </span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-white/[0.08] space-y-2.5">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Halo TeeStock! Mau konsultasi pemesanan apparel NSA.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>WhatsApp Customer Support</span>
              </a>

              {isAuthenticated ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-ts-terracotta/30 text-ts-terracotta font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{profile?.full_name || 'Member'}</p>
                      <span className="text-[10px] text-ts-muted font-mono">{role}</span>
                    </div>
                  </div>
                  <Link
                    to="/akun"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-xs text-ts-terracotta font-bold hover:underline px-2"
                  >
                    Profil &rarr;
                  </Link>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    openAuthModal();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-ts-krem font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-ts-terracotta" />
                  <span>Masuk ke Akun Saya</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


