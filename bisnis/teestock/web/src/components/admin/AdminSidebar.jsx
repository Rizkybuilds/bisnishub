import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shirt, 
  Layers, 
  Kanban, 
  ScrollText, 
  Calculator, 
  Settings, 
  ExternalLink,
  Cloud,
  CheckCircle2,
  LogOut,
  User,
  AlertTriangle,
  Boxes,
  Wallet,
  Flame
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { TeeStockLogo } from '../common/TeeStockLogo';

export function AdminSidebar() {
  const { orders, catalog, procurements, supabaseStatus } = useAdmin();
  const { user, signOut } = useAuth();
  const activeOrdersCount = orders.filter(o => o.status !== 'shipped').length;

  const founderNavItems = [
    { to: '/admin', label: 'Neraca & Ekuitas', icon: LayoutDashboard, end: true },
    { to: '/admin/pengadaan', label: 'Pengadaan Bahan (BOM)', icon: Boxes, badge: procurements?.length ? `${procurements.length} PO` : undefined },
    { to: '/admin/buku-kas', label: 'Buku Kas & Modal', icon: Wallet, highlight: true },
    { to: '/admin/aset', label: 'Aset Mesin (CAPEX)', icon: Flame },
  ];

  const opsNavItems = [
    { to: '/admin/kanban', label: 'Antrean & Kanban', icon: Kanban, badge: `${activeOrdersCount} Order`, highlight: true },
    { to: '/admin/inventory', label: 'Stok NSA & Bahan', icon: Layers },
    { to: '/admin/katalog', label: 'Master Katalog (PIM)', icon: Shirt, badge: catalog.length },
    { to: '/admin/gangsheet', label: 'Gang Sheet DTF', icon: ScrollText },
    { to: '/admin/defects', label: 'QC & Defect Tracker', icon: AlertTriangle },
    { to: '/admin/quoter', label: 'Custom Quoter WA', icon: Calculator },
    { to: '/admin/settings', label: 'Pengaturan Cloud', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-ts-surface border-r border-ts-border flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-ts-borderDim">
        <div className="flex items-center justify-between">
          <TeeStockLogo size="sm" badge="FOUNDER" />
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/40">
            HUB
          </span>
        </div>
        <div className="text-[10px] text-ts-muted mt-1.5 font-mono">Solopreneur Command Center</div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-ts-mustard uppercase flex items-center justify-between">
          <span>Keuangan &amp; Modal</span>
          <span className="text-[9px] font-mono px-1 rounded bg-ts-mustard/10 text-ts-mustard">FOUNDER</span>
        </div>
        {founderNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-ts-terracotta text-white font-bold shadow-sm'
                    : 'text-ts-krem/80 hover:text-white hover:bg-ts-surfaceHover'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    item.highlight
                      ? 'bg-ts-mustard/20 text-ts-mustard border border-ts-mustard/30'
                      : 'bg-ts-hitam/60 text-ts-krem/70 border border-ts-border'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-3 px-3 py-1.5 text-[10px] font-bold tracking-wider text-ts-muted uppercase">
          Operasional Studio
        </div>
        {opsNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-ts-terracotta text-white font-bold shadow-sm'
                    : 'text-ts-krem/80 hover:text-white hover:bg-ts-surfaceHover'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                    item.highlight
                      ? 'bg-ts-mustard/20 text-ts-mustard border border-ts-mustard/30'
                      : 'bg-ts-hitam/60 text-ts-krem/70 border border-ts-border'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 px-3 py-2 text-[10px] font-bold tracking-wider text-ts-muted uppercase">
          Kanal Toko
        </div>
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-ts-krem/70 hover:text-ts-terracotta hover:bg-ts-surfaceHover transition-colors border border-dashed border-ts-border"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Toko Publik</span>
          </div>
          <span className="text-[10px] text-ts-muted">↗</span>
        </Link>
      </nav>

      {/* Admin User Profile & Sign Out */}
      <div className="p-3 border-t border-ts-borderDim bg-ts-surfaceHover/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-ts-mustard/20 text-ts-mustard flex items-center justify-center text-xs shrink-0">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-ts-krem truncate">
                {user?.email || 'Admin'}
              </p>
              <p className="text-[10px] text-ts-muted">Authenticated</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            title="Keluar (Logout)"
            className="p-1.5 rounded-lg text-ts-muted hover:text-ts-red hover:bg-ts-red/10 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cloud Status Footer */}
      <div className="p-3 border-t border-ts-borderDim bg-ts-hitam/40 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-ts-muted flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-ts-teal" /> Supabase:
          </span>
          <span className="text-ts-green font-mono font-bold flex items-center gap-1 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Live
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-ts-muted flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-ts-mustard" /> Cloudinary:
          </span>
          <span className="text-ts-krem/80 font-mono text-[10px]">
            {import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'Active'}
          </span>
        </div>
      </div>
    </aside>
  );
}
