import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Inbox, 
  Printer, 
  Flame, 
  PackageCheck, 
  Truck, 
  Search,
  ScrollText,
  Layers,
  Sparkles,
  Building2,
  X,
  Download,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { KanbanColumn } from '../../components/admin/KanbanColumn';
import { VendorPickupModal } from '../../components/admin/VendorPickupModal';
import { aggregateVendorPickupList } from '../../utils/garmentStockRouting';
import { PrintCareCardModal } from '../../components/admin/PrintCareCardModal';
import { exportOrdersCsv } from '../../services/ordersApi';

export function KanbanPage() {
  const { openNewOrderModal } = useOutletContext();
  const { orders, advanceOrderStatus } = useAdmin();

  // Filters & Batch Grouping
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [batchPreset, setBatchPreset] = useState('all'); // 'all', 'unpaid_followup', 'dtf_queue', 'dark_batch', 'light_batch'
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [isCareCardModalOpen, setIsCareCardModalOpen] = useState(false);

  // Vendor JIT Summary Count
  const vendorPickupSummary = useMemo(() => {
    return aggregateVendorPickupList(orders);
  }, [orders]);

  const columns = [
    { id: 'pending', title: 'Order Masuk', icon: Inbox, colorClass: 'text-amber-400' },
    { id: 'dtf', title: 'Cetak DTF', icon: Printer, colorClass: 'text-sky-400' },
    { id: 'press', title: 'Siap Press', icon: Flame, colorClass: 'text-orange-400' },
    { id: 'pack', title: 'Packing & QC', icon: PackageCheck, colorClass: 'text-purple-400' },
    { id: 'shipped', title: 'Selesai / Kirim', icon: Truck, colorClass: 'text-emerald-400' }
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
        const matchTracking = (order.trackingNumber || '').toLowerCase().includes(query);
        if (!matchId && !matchCustomer && !matchProduct && !matchTracking) return false;
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

  // Executive KPI ribbon calculations
  const kpiStats = useMemo(() => {
    // 1. WIP Active (pending + dtf + press + pack)
    const wipOrders = orders.filter(o => ['pending', 'dtf', 'press', 'pack'].includes(o.status));
    const wipCount = wipOrders.length;
    const wipTotalVal = wipOrders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);
    const wipPcs = wipOrders.reduce((sum, o) => sum + (o.qty || 1), 0);

    // 2. Pending QRIS / Bayar
    const pendingOrders = orders.filter(o => o.status === 'pending');
    const pendingCount = pendingOrders.length;
    const pendingVal = pendingOrders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);

    // 3. In Production Studio (dtf + press)
    const studioOrders = orders.filter(o => ['dtf', 'press'].includes(o.status));
    const studioCount = studioOrders.length;
    const studioPcs = studioOrders.reduce((sum, o) => sum + (o.qty || 1), 0);

    // 4. Shipped / Selesai (pack + shipped)
    const shippedOrders = orders.filter(o => ['pack', 'shipped'].includes(o.status));
    const shippedCount = shippedOrders.length;
    const shippedVal = shippedOrders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);

    return {
      wipCount,
      wipTotalVal,
      wipPcs,
      pendingCount,
      pendingVal,
      studioCount,
      studioPcs,
      shippedCount,
      shippedVal
    };
  }, [orders]);

  const handleExportCsv = () => {
    exportOrdersCsv(filteredOrders);
  };

  return (
    <div className="flex flex-col h-full min-w-0 bg-[#09090B] text-zinc-100">
      <AdminTopbar
        title="Antrean Order & Produksi Kanban"
        subtitle="Lacak alur pesanan dari Shopee, TikTok, WA, dan Toko Web sampai siap kirim"
        onNewOrder={openNewOrderModal}
      />

      {/* 4 Executive KPI Ribbon Cards */}
      <div className="px-6 lg:px-8 pt-5 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: WIP Active Orders */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> WIP Produksi
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {kpiStats.wipPcs} Pcs
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-mono font-black text-white">
                {kpiStats.wipCount} <span className="text-xs font-normal text-zinc-400 font-sans">antrean</span>
              </div>
              <div className="text-xs font-mono font-semibold text-zinc-300">
                Rp {kpiStats.wipTotalVal.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Card 2: Menunggu Verifikasi QRIS / Bayar */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Pending QRIS / Bayar
              </span>
              {kpiStats.pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                  Butuh Follow-Up
                </span>
              )}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-mono font-black text-amber-300">
                {kpiStats.pendingCount} <span className="text-xs font-normal text-zinc-400 font-sans">order</span>
              </div>
              <div className="text-xs font-mono font-semibold text-zinc-400">
                Rp {kpiStats.pendingVal.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Card 3: Sedang Dipress & Cetak (Studio) */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Studio DTF & Press
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                In-Progress
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-mono font-black text-orange-400">
                {kpiStats.studioCount} <span className="text-xs font-normal text-zinc-400 font-sans">antrean</span>
              </div>
              <div className="text-xs font-mono font-semibold text-zinc-300">
                {kpiStats.studioPcs} Pcs Kaos
              </div>
            </div>
          </div>

          {/* Card 4: Selesai Packing & Dikirim */}
          <div className="p-3.5 rounded-xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Pack & Dikirim
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Fulfillment
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-xl font-mono font-black text-emerald-400">
                {kpiStats.shippedCount} <span className="text-xs font-normal text-zinc-400 font-sans">pesanan</span>
              </div>
              <div className="text-xs font-mono font-semibold text-emerald-300">
                Rp {kpiStats.shippedVal.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Batch & Filter Toolbar */}
      <div className="px-6 lg:px-8 py-3 bg-zinc-900/60 border-y border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Search & Channel Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari ID, Pelanggan, Resi, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1.5 bg-zinc-950 border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500/60 focus:outline-none w-48 sm:w-60 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Channel Filters */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-white/[0.08]">
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
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Batch Grouping Presets, Gang Sheet Quick Action, Export CSV */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Batch Grouping Selector */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-white/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-2 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" /> Batch:
            </span>
            <button
              onClick={() => setBatchPreset('all')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                batchPreset === 'all'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setBatchPreset('unpaid_followup')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                batchPreset === 'unpaid_followup'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Filter pesanan yang belum bayar & butuh difollow-up via WhatsApp"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
              </span>
              <span>Follow-Up WA</span>
              {kpiStats.pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-amber-500/30 text-amber-300 font-bold">
                  {kpiStats.pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setBatchPreset('dtf_queue')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors flex items-center gap-1 ${
                batchPreset === 'dtf_queue'
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40'
                  : 'text-zinc-400 hover:text-white'
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
                  ? 'bg-zinc-800 text-white font-bold border border-white/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Batch kaos hitam/gelap untuk efisiensi press"
            >
              ⬛ Gelap
            </button>
            <button
              onClick={() => setBatchPreset('light_batch')}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                batchPreset === 'light_batch'
                  ? 'bg-zinc-200 text-neutral-950 font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Batch kaos putih/terang untuk efisiensi press"
            >
              ⬜ Terang
            </button>
          </div>

          {/* Quick link to Gang Sheet Roll */}
          <Link
            to="/admin/gangsheet"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 rounded-lg text-[11px] font-bold transition-colors"
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Kirim Roll DTF</span>
          </Link>

          {/* Quick Trigger: Cetak Care Card A6 Unboxing Insert */}
          <button
            type="button"
            onClick={() => setIsCareCardModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
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
                : 'bg-zinc-950 text-zinc-500 border-white/[0.08] hover:text-white'
            }`}
            title="Lihat rekap garmen yang perlu ditarik dari distributor/supplier NSA hari ini"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Tarik NSA</span>
            {vendorPickupSummary.totalPcs > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-sky-500 text-neutral-950 font-black">
                {vendorPickupSummary.totalPcs}
              </span>
            )}
          </button>

          {/* Ekspor CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
            title="Download database antrean pesanan dalam format CSV"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ekspor CSV</span>
          </button>

          {/* Total Filtered Badge */}
          <span className="font-mono text-xs text-zinc-400 px-2.5 py-1 bg-zinc-950 rounded-lg border border-white/[0.08]">
            {filteredOrders.length} / {orders.length}
          </span>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="p-6 lg:p-8 overflow-x-auto flex-1 flex gap-5 items-start">
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

