import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Inbox, 
  Printer, 
  Flame, 
  PackageCheck, 
  Truck,
  Filter,
  Search,
  ScrollText,
  Layers,
  Sparkles,
  Building2,
  X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { KanbanColumn } from '../../components/admin/KanbanColumn';
import { VendorPickupModal } from '../../components/admin/VendorPickupModal';
import { aggregateVendorPickupList } from '../../utils/garmentStockRouting';
import { PrintCareCardModal } from '../../components/admin/PrintCareCardModal';

export function KanbanPage() {
  const { openNewOrderModal } = useOutletContext();
  const { orders, advanceOrderStatus } = useAdmin();

  // Filters & Batch Grouping
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [batchPreset, setBatchPreset] = useState('all'); // 'all', 'unpaid_followup', 'dtf_queue', 'dark_batch', 'light_batch'
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isCareCardModalOpen, setIsCareCardModalOpen] = useState(false);

  // Unpaid / Pending Follow-Up Count
  const pendingCount = useMemo(() => {
    return orders.filter(o => o.status === 'pending').length;
  }, [orders]);

  // Vendor JIT Summary Count
  const vendorPickupSummary = useMemo(() => {
    return aggregateVendorPickupList(orders);
  }, [orders]);

  const columns = [
    { id: 'pending', title: 'Order Masuk', icon: Inbox, colorClass: 'text-ts-mustard' },
    { id: 'dtf', title: 'Cetak DTF', icon: Printer, colorClass: 'text-ts-teal' },
    { id: 'press', title: 'Siap Press', icon: Flame, colorClass: 'text-ts-terracotta' },
    { id: 'pack', title: 'Packing & QC', icon: PackageCheck, colorClass: 'text-ts-olive' },
    { id: 'shipped', title: 'Selesai / Kirim', icon: Truck, colorClass: 'text-ts-green' }
  ];

  // Filtered orders based on search, channel, and batch preset
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = (order.id || '').toLowerCase().includes(query);
        const matchCustomer = (order.customer || '').toLowerCase().includes(query);
        const matchProduct = (order.productName || order.sku || '').toLowerCase().includes(query);
        if (!matchId && !matchCustomer && !matchProduct) return false;
      }

      // 2. Channel Filter
      if (selectedChannel !== 'all') {
        if (order.channel !== selectedChannel) return false;
      }

      // 3. Batch Preset Filter
      if (batchPreset === 'unpaid_followup') {
        if (order.status !== 'pending') return false;
      } else if (batchPreset === 'dtf_queue') {
        // Priority DTF queue (needs printing or pending)
        if (order.status !== 'pending' && order.status !== 'dtf') return false;
      } else if (batchPreset === 'dark_batch') {
        const color = (order.color || '').toLowerCase();
        const isDark = color.includes('hitam') || color.includes('black') || color.includes('navy') || color.includes('charcoal');
        if (!isDark) return false;
      } else if (batchPreset === 'light_batch') {
        const color = (order.color || '').toLowerCase();
        const isLight = color.includes('putih') || color.includes('white') || color.includes('krem') || color.includes('misty');
        if (!isLight) return false;
      }

      return true;
    });
  }, [orders, searchQuery, selectedChannel, batchPreset]);

  return (
    <div className="flex flex-col h-full min-w-0">
      <AdminTopbar
        title="Antrean Order & Produksi Kanban"
        subtitle="Lacak alur pesanan dari Shopee, TikTok, WA, dan Toko Web sampai siap kirim"
        onNewOrder={openNewOrderModal}
      />

      {/* Production Batch & Filter Toolbar */}
      <div className="px-8 py-3.5 bg-ts-surface/60 border-b border-ts-borderDim flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Search & Channel Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-ts-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID, Pelanggan, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1.5 bg-ts-hitam/60 border border-ts-border rounded-lg text-xs text-ts-krem placeholder-ts-muted focus:border-ts-terracotta focus:outline-none w-48 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ts-muted hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Channel Filters */}
          <div className="flex items-center gap-1 bg-ts-hitam/40 p-1 rounded-lg border border-ts-borderDim">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'shopee', label: 'Shopee' },
              { id: 'tiktok', label: 'TikTok' },
              { id: 'whatsapp', label: 'WA' },
              { id: 'web', label: 'Web' },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  selectedChannel === ch.id
                    ? 'bg-ts-terracotta text-white font-bold shadow-sm'
                    : 'text-ts-muted hover:text-white'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Batch Grouping Presets & Gang Sheet Quick Action */}
        <div className="flex items-center gap-2">
          {/* Batch Grouping Selector */}
          <div className="flex items-center gap-1 bg-ts-hitam/40 p-1 rounded-lg border border-ts-borderDim">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ts-muted px-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-ts-mustard" /> Batch:
            </span>
            <button
              onClick={() => setBatchPreset('all')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                batchPreset === 'all'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-ts-muted hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setBatchPreset('unpaid_followup')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                batchPreset === 'unpaid_followup'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-ts-muted hover:text-white'
              }`}
              title="Filter pesanan yang belum bayar & butuh difollow-up via WhatsApp"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span>Follow-Up WA</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-amber-500/30 text-amber-300 font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setBatchPreset('dtf_queue')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                batchPreset === 'dtf_queue'
                  ? 'bg-ts-teal/20 text-teal-300 font-bold border border-ts-teal/40'
                  : 'text-ts-muted hover:text-white'
              }`}
              title="Filter pesanan yang butuh cetak DTF"
            >
              <Printer className="w-3 h-3" />
              <span>Queue DTF</span>
            </button>
            <button
              onClick={() => setBatchPreset('dark_batch')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                batchPreset === 'dark_batch'
                  ? 'bg-neutral-800 text-white font-bold border border-white/20'
                  : 'text-ts-muted hover:text-white'
              }`}
              title="Batch kaos hitam/gelap untuk efisiensi press"
            >
              ⬛ Gelap
            </button>
            <button
              onClick={() => setBatchPreset('light_batch')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                batchPreset === 'light_batch'
                  ? 'bg-neutral-200 text-neutral-900 font-bold'
                  : 'text-ts-muted hover:text-white'
              }`}
              title="Batch kaos putih/terang untuk efisiensi press"
            >
              ⬜ Terang
            </button>
          </div>

          {/* Quick link to Gang Sheet Roll */}
          <Link
            to="/admin/gangsheet"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ts-teal/15 hover:bg-ts-teal/25 border border-ts-teal/30 text-teal-300 rounded-lg text-[11px] font-bold transition-colors"
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Kirim Roll DTF</span>
          </Link>

          {/* Quick Trigger: Cetak Care Card A6 Unboxing Insert */}
          <button
            type="button"
            onClick={() => setIsCareCardModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ts-terracotta/15 hover:bg-ts-terracotta/25 border border-ts-terracotta/30 text-ts-terracotta rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
            title="Cetak Kartu Petunjuk Cuci & Thank You Insert A6 untuk diselipkan di polymailer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Care Card A6</span>
          </button>

          {/* Quick Trigger: Vendor JIT NSA Garment Pickup Manifest */}
          <button
            type="button"
            onClick={() => setIsPickupModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
              vendorPickupSummary.totalPcs > 0
                ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/40 shadow-sm'
                : 'bg-ts-hitam/60 text-ts-muted border-ts-borderDim hover:text-white'
            }`}
            title="Lihat rekap garmen yang perlu ditarik dari distributor/supplier NSA hari ini"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Tarik Garmen NSA</span>
            {vendorPickupSummary.totalPcs > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-sky-500 text-neutral-950 font-black">
                {vendorPickupSummary.totalPcs}
              </span>
            )}
          </button>

          {/* Total badge */}
          <span className="font-mono text-xs text-ts-muted px-2 py-1 bg-ts-hitam/60 rounded border border-ts-border">
            {filteredOrders.length} / {orders.length}
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="p-8 overflow-x-auto flex-1 flex gap-5 items-start">
        {columns.map((col, idx) => {
          const colOrders = filteredOrders.filter(o => o.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              title={col.title}
              icon={col.icon}
              status={col.id}
              statusIndex={idx}
              totalStatuses={columns.length}
              colorClass={col.colorClass}
              orders={colOrders}
              onMove={advanceOrderStatus}
            />
          );
        })}
      </div>

      {/* NSA Garment JIT Pickup Manifest Modal */}
      <VendorPickupModal
        isOpen={isPickupModalOpen}
        onClose={() => setIsPickupModalOpen(false)}
        orders={orders}
      />

      {/* Unboxing Care Card & Thank You Insert Printable Modal */}
      <PrintCareCardModal
        isOpen={isCareCardModalOpen}
        onClose={() => setIsCareCardModalOpen(false)}
      />
    </div>
  );
}
