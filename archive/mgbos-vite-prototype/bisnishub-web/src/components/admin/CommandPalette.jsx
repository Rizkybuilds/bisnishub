import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  LayoutDashboard, 
  Boxes, 
  Wallet, 
  Flame, 
  Truck, 
  Kanban, 
  Layers, 
  Shirt, 
  ScrollText, 
  AlertTriangle, 
  Calculator, 
  Megaphone, 
  HardDrive, 
  Settings, 
  Plus, 
  Lock, 
  ExternalLink,
  Users,
  ArrowRight,
  Command,
  X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export function CommandPalette({ isOpen, onClose, onOpenNewOrder }) {
  const navigate = useNavigate();
  const { catalog } = useAdmin();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Master Command Items
  const items = useMemo(() => {
    const navItems = [
      { id: 'nav-dashboard', category: 'Navigasi Cepat', label: 'Neraca & Ekuitas Founder', shortcut: 'G D', icon: LayoutDashboard, path: '/' },
      { id: 'nav-pengadaan', category: 'Navigasi Cepat', label: 'Pengadaan Bahan & BOM', shortcut: 'G P', icon: Boxes, path: '/pengadaan' },
      { id: 'nav-buku-kas', category: 'Navigasi Cepat', label: 'Buku Kas & Multi-Wallet', shortcut: 'G B', icon: Wallet, path: '/buku-kas' },
      { id: 'nav-aset', category: 'Navigasi Cepat', label: 'Aset Mesin & CAPEX', shortcut: 'G A', icon: Flame, path: '/aset' },
      { id: 'nav-kanban', category: 'Navigasi Cepat', label: 'Antrean Produksi & Kanban', shortcut: 'G K', icon: Kanban, path: '/kanban' },
      { id: 'nav-inventory', category: 'Navigasi Cepat', label: 'Stok Kaos NSA & Bahan', shortcut: 'G I', icon: Layers, path: '/inventory' },
      { id: 'nav-katalog', category: 'Navigasi Cepat', label: 'Master Katalog Desain (PIM)', shortcut: 'G M', icon: Shirt, path: '/katalog' },
      { id: 'nav-gangsheet', category: 'Navigasi Cepat', label: 'Kalkulator Gang Sheet DTF 58cm', shortcut: 'G G', icon: ScrollText, path: '/gangsheet' },
      { id: 'nav-defects', category: 'Navigasi Cepat', label: 'QC & Defect Tracker', shortcut: 'G Q', icon: AlertTriangle, path: '/defects' },
      { id: 'nav-customers', category: 'Navigasi Cepat', label: 'CRM Pelanggan & VIP Reseller', shortcut: 'G C', icon: Users, path: '/customers' },
      { id: 'nav-quoter', category: 'Navigasi Cepat', label: 'Custom Order Quoter WA', shortcut: 'G W', icon: Calculator, path: '/quoter' },
      { id: 'nav-vendors', category: 'Navigasi Cepat', label: 'Mitra Vendor & Maklon', shortcut: 'G V', icon: Truck, path: '/vendors' },
      { id: 'nav-marketing', category: 'Navigasi Cepat', label: 'Marketing & Swipe File', shortcut: 'G S', icon: Megaphone, path: '/marketing' },
      { id: 'nav-storage', category: 'Navigasi Cepat', label: 'External SSD 1TB (D:\\)', shortcut: 'G E', icon: HardDrive, path: '/storage' },
      { id: 'nav-settings', category: 'Navigasi Cepat', label: 'Pengaturan Cloud & Auth', shortcut: 'G X', icon: Settings, path: '/settings' },
    ];

    const actionItems = [
      { 
        id: 'act-new-order', 
        category: 'Aksi Kilat Eksekutif', 
        label: 'Input Pesanan Baru (Multi-Channel)', 
        shortcut: 'N O', 
        icon: Plus, 
        action: () => {
          onClose();
          if (onOpenNewOrder) onOpenNewOrder();
        } 
      },
      { 
        id: 'act-new-procurement', 
        category: 'Aksi Kilat Eksekutif', 
        label: 'Catat Pengadaan Bahan Baru (PO)', 
        shortcut: 'N P', 
        icon: Boxes, 
        path: '/pengadaan' 
      },
      { 
        id: 'act-lock-os', 
        category: 'Aksi Kilat Eksekutif', 
        label: 'Kunci Layar BisnisHub OS', 
        shortcut: 'Ctrl+L', 
        icon: Lock, 
        action: () => {
          onClose();
          window.dispatchEvent(new CustomEvent('bisnishub_lock_os'));
        } 
      },
      { 
        id: 'act-store-live', 
        category: 'Aksi Kilat Eksekutif', 
        label: 'Buka Toko Ritel TeeStock Apparel (Live)', 
        shortcut: 'T S', 
        icon: ExternalLink, 
        action: () => {
          onClose();
          window.open('https://teestockapparel.vercel.app', '_blank');
        } 
      },
    ];

    // Optional Catalog Search matches
    const catalogItems = (catalog || []).slice(0, 10).map(p => ({
      id: `cat-${p.sku}`,
      category: 'Katalog Produk (PIM)',
      label: `[${p.sku}] ${p.name}`,
      subtitle: `${p.seriesName || p.series} • Rp ${Number(p.priceRetail || 99000).toLocaleString('id-ID')}`,
      icon: Shirt,
      path: '/katalog'
    }));

    return [...actionItems, ...navItems, ...catalogItems];
  }, [catalog, onClose, onOpenNewOrder]);

  // Filter based on search query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(it => 
      it.label.toLowerCase().includes(q) || 
      it.category.toLowerCase().includes(q) ||
      (it.subtitle && it.subtitle.toLowerCase().includes(q))
    );
  }, [items, query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle execution of selected item
  const handleSelect = (item) => {
    if (!item) return;
    if (item.action) {
      item.action();
    } else if (item.path) {
      onClose();
      navigate(item.path);
    }
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (list) {
      const activeEl = list.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Spotlight Command Modal */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="BisnisHub OS Command Palette"
        className="relative w-full max-w-2xl bg-[#0F0F12] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik perintah atau cari modul (contoh: buku kas, stok, order, katalog)..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded text-zinc-400 hover:text-white mr-2"
              title="Bersihkan"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-zinc-400 border border-white/10 shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="max-h-[380px] overflow-y-auto p-2 space-y-0.5 divide-y divide-white/[0.03]"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Tidak ditemukan perintah atau modul yang cocok dengan "<span className="text-zinc-300 font-mono">{query}</span>"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon || ArrowRight;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                    isSelected 
                      ? 'bg-white text-zinc-950 font-bold shadow-sm' 
                      : 'text-zinc-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-zinc-950 text-white' : 'bg-white/5 text-zinc-400'}`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="text-xs truncate tracking-tight">{item.label}</div>
                      <div className={`text-[10px] font-normal truncate ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {item.subtitle || item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        isSelected 
                          ? 'bg-zinc-950/10 text-zinc-900 border-zinc-950/20' 
                          : 'bg-white/5 text-zinc-400 border-white/10'
                      }`}>
                        {item.shortcut}
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-950 opacity-100' : 'opacity-0'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="px-4 py-2.5 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10 text-zinc-400">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white/10 border border-white/10 text-zinc-400">↓</kbd>
              <span>navigasi</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-zinc-400">↵</kbd>
              <span>pilih</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <Command className="w-3 h-3" />
            <span>BisnisHub OS Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
