import React from 'react';
import { NavLink } from 'react-router-dom';
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
  AlertTriangle,
  Boxes,
  Wallet,
  Flame,
  Truck,
  Megaphone,
  HardDrive,
  Lock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export function AdminSidebar() {
  const { orders, catalog, procurements } = useAdmin();
  const activeOrdersCount = orders ? orders.filter(o => o.status !== 'shipped').length : 0;

  const founderNavItems = [
    { to: '/', label: 'Neraca & Ekuitas', icon: LayoutDashboard, end: true },
    { to: '/pengadaan', label: 'Pengadaan Bahan (BOM)', icon: Boxes, badge: procurements?.length ? `${procurements.length} PO` : undefined },
    { to: '/buku-kas', label: 'Buku Kas & Modal', icon: Wallet, highlight: true },
    { to: '/aset', label: 'Aset Mesin (CAPEX)', icon: Flame },
    { to: '/vendors', label: 'Mitra Vendor & Maklon', icon: Truck },
  ];

  const opsNavItems = [
    { to: '/kanban', label: 'Antrean & Kanban', icon: Kanban, badge: `${activeOrdersCount} Order`, highlight: true },
    { to: '/inventory', label: 'Stok NSA & Bahan', icon: Layers },
    { to: '/katalog', label: 'Master Katalog (PIM)', icon: Shirt, badge: catalog?.length || 0 },
    { to: '/gangsheet', label: 'Gang Sheet DTF 58cm', icon: ScrollText },
    { to: '/defects', label: 'QC & Defect Tracker', icon: AlertTriangle },
    { to: '/quoter', label: 'Custom Quoter WA', icon: Calculator },
  ];

  const growthNavItems = [
    { to: '/marketing', label: 'Marketing & Swipe File', icon: Megaphone, highlight: true },
    { to: '/storage', label: 'External SSD 1TB (D:\\)', icon: HardDrive },
    { to: '/settings', label: 'Pengaturan Cloud', icon: Settings },
  ];

  const renderNavSection = (items) => (
    items.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-white text-zinc-950 font-bold shadow-sm shadow-white/5'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-white'}`} />
                <span className="tracking-tight">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold transition-colors ${
                    isActive
                      ? 'bg-zinc-950/10 text-zinc-950 border border-zinc-950/20'
                      : item.highlight
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'bg-white/5 text-zinc-400 border border-white/[0.08]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </NavLink>
      );
    })
  );

  return (
    <aside className="w-64 bg-[#09090B] border-r border-white/[0.08] flex flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-950 font-black text-xs tracking-tighter shadow-sm">
              BH
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-tight uppercase">BisnisHub OS</h2>
              <p className="text-[10px] text-zinc-500 font-mono">MultiGraph Holding</p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/5 text-zinc-300 border border-white/10">
            C-SUITE
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase flex items-center justify-between">
          <span>Keuangan &amp; Modal</span>
          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">CFO</span>
        </div>
        {renderNavSection(founderNavItems)}

        <div className="pt-3 px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase flex items-center justify-between">
          <span>Operasional Studio</span>
          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">COO</span>
        </div>
        {renderNavSection(opsNavItems)}

        <div className="pt-3 px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase flex items-center justify-between">
          <span>Pertumbuhan &amp; Aset</span>
          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">CMO/CTO</span>
        </div>
        {renderNavSection(growthNavItems)}

        <div className="pt-4 px-3 py-2 text-[9px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
          Toko Ritel TeeStock
        </div>
        <a
          href="https://teestockapparel.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all border border-dashed border-white/10 hover:border-white/20"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white" />
            <span>TeeStock Storefront</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono group-hover:text-zinc-300">Live ↗</span>
        </a>
      </nav>

      {/* Cloud Status Footer & Screen Lock */}
      <div className="p-3 border-t border-white/[0.08] bg-black/40 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-500 flex items-center gap-1.5 text-[10px] font-mono">
            <Cloud className="w-3 h-3 text-zinc-400" /> Supabase SG:
          </span>
          <span className="text-white font-mono font-bold flex items-center gap-1.5 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>Live Active</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('bisnishub_lock_os'))}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-zinc-400 hover:text-rose-300 hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/20 transition-all group"
          title="Kunci layar BisnisHub OS sekarang"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400" />
            <span>Kunci Layar OS</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-500 group-hover:text-rose-400 font-bold">Lock 🔒</span>
        </button>
      </div>
    </aside>
  );
}
