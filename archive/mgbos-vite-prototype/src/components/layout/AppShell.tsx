import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  Layers,
  Factory,
  Receipt,
  CreditCard,
  CheckSquare,
  Settings,
  ChevronDown,
  Building2,
  Bell,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { BRAND_DEFINITIONS } from '@bisnishub/shared/domain/context/systemContext';

export const AppShell: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<string>('teestock');
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);

  const brandInfo = BRAND_DEFINITIONS[selectedBrand] || BRAND_DEFINITIONS.teestock;

  const navGroups = [
    {
      title: 'Command',
      items: [
        { label: 'Home / Overview', to: '/', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Sales Pipeline',
      items: [
        { label: 'Leads', to: '/sales/leads', icon: Users },
        { label: 'Customers', to: '/sales/customers', icon: Building2 },
        { label: 'Quotes', to: '/sales/quotes', icon: FileText },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Orders', to: '/ops/orders', icon: Package },
        { label: 'Production Jobs', to: '/ops/production', icon: Layers },
        { label: 'Vendors Network', to: '/ops/vendors', icon: Factory },
      ],
    },
    {
      title: 'Finance & Treasury',
      items: [
        { label: 'Invoices', to: '/finance/invoices', icon: Receipt },
        { label: 'Payments', to: '/finance/payments', icon: CreditCard },
      ],
    },
    {
      title: 'Action & Control',
      items: [
        { label: 'Tasks & Approvals', to: '/work/tasks', icon: CheckSquare },
        { label: 'Settings', to: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-slate-800 bg-slate-900/60 backdrop-blur-md">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                MG
              </div>
              <span className="font-bold text-sm tracking-wide text-slate-100">MGBOS <span className="text-[10px] text-emerald-400 font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">v0.5.4</span></span>
            </div>
          </div>

          {/* Active Brand Selector */}
          <div className="relative">
            <button
              onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-left hover:border-slate-600 transition-colors"
            >
              <div className="truncate">
                <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Active Brand</div>
                <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
                  {brandInfo.name}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {brandDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
                {Object.entries(BRAND_DEFINITIONS).map(([id, info]) => (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedBrand(id);
                      setBrandDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 ${
                      selectedBrand === id ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'
                    }`}
                  >
                    <span>{info.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{info.prefix}]</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer / Dual Running Info */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 py-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Admin Legacy
            </span>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
            >
              Port 3000 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-slate-200">
              MultiGraph Business OS
            </h1>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-emerald-400 font-medium px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {brandInfo.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/80">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilot: Custom Atelier v0.1</span>
            </div>

            <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-xs text-slate-950">
                R
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-200">Rizky</div>
                <div className="text-[10px] text-slate-500">Sole Founder</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
