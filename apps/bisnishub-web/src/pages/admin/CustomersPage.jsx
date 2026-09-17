import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  Search, 
  Download, 
  MessageSquare, 
  ExternalLink, 
  Calendar, 
  Package, 
  ArrowUpDown, 
  ChevronRight, 
  X, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  Filter, 
  ShoppingBag, 
  ShieldCheck,
  Crown,
  Send,
  AlertCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  aggregateCustomersFromOrders, 
  calculateCustomerKpis, 
  WHATSAPP_TEMPLATES, 
  generateCustomerWhatsAppText, 
  getCustomerWhatsAppUrl, 
  exportCustomersCsv, 
  formatRupiah 
} from '../../services/customersApi';

export function CustomersPage() {
  const { orders = [], showToast } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all'); // 'all', 'vip', 'reseller', 'new', 'churn_risk', 'regular'
  const [sortBy, setSortBy] = useState('ltv-desc'); // 'ltv-desc', 'orders-desc', 'date-desc', 'aov-desc'
  
  // Selected Customer Modal / Drawer State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeWaTemplate, setActiveWaTemplate] = useState('unboxing_care');
  const [customWaMessage, setCustomWaMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Aggregate all customers from live orders
  const allCustomers = useMemo(() => {
    return aggregateCustomersFromOrders(orders);
  }, [orders]);

  // Executive KPI summary metrics
  const kpis = useMemo(() => {
    return calculateCustomerKpis(allCustomers);
  }, [allCustomers]);

  // Filtered & Sorted Customer List
  const filteredCustomers = useMemo(() => {
    return allCustomers.filter((c) => {
      // 1. Search Query (Name, Phone, City, or Preferred Garment)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (c.name || '').toLowerCase().includes(q);
        const matchPhone = (c.phone || c.rawPhone || '').includes(q);
        const matchCity = (c.city || '').toLowerCase().includes(q);
        const matchGarment = (c.preferredGarment || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchCity && !matchGarment) {
          return false;
        }
      }

      // 2. Tier Filter
      if (tierFilter !== 'all') {
        if (c.tier !== tierFilter) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'ltv-desc') return b.ltv - a.ltv;
      if (sortBy === 'orders-desc') return b.completedOrders - a.completedOrders;
      if (sortBy === 'aov-desc') return b.aov - a.aov;
      if (sortBy === 'date-desc') return new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
      return 0;
    });
  }, [allCustomers, searchQuery, tierFilter, sortBy]);

  // Open WhatsApp composer modal for a customer
  const handleOpenWaModal = (customer, templateId = 'unboxing_care') => {
    setSelectedCustomer(customer);
    setActiveWaTemplate(templateId);
    const initialMsg = generateCustomerWhatsAppText(customer, templateId);
    setCustomWaMessage(initialMsg);
  };

  // Switch template inside modal
  const handleSelectTemplate = (templateId) => {
    if (!selectedCustomer) return;
    setActiveWaTemplate(templateId);
    const text = generateCustomerWhatsAppText(selectedCustomer, templateId);
    setCustomWaMessage(text);
  };

  // Copy message to clipboard
  const handleCopyMessage = () => {
    if (!customWaMessage) return;
    navigator.clipboard.writeText(customWaMessage);
    setCopied(true);
    if (showToast) showToast('Teks WhatsApp berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Launch WhatsApp directly
  const handleSendWhatsApp = () => {
    if (!selectedCustomer?.phone) {
      if (showToast) showToast('Nomor WhatsApp pelanggan belum tercatat', 'warning');
      return;
    }
    const url = `https://wa.me/${selectedCustomer.phone}?text=${encodeURIComponent(customWaMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Trigger CSV export
  const handleExportCsv = () => {
    if (filteredCustomers.length === 0) {
      if (showToast) showToast('Tidak ada data pelanggan untuk diekspor', 'warning');
      return;
    }
    exportCustomersCsv(filteredCustomers);
    if (showToast) showToast(`Berhasil mengekspor ${filteredCustomers.length} data pelanggan`, 'success');
  };

  // Average LTV per customer for KPI card
  const avgLtvPerCustomer = kpis.totalCustomers > 0 
    ? Math.round(kpis.totalLtv / kpis.totalCustomers) 
    : 0;

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans pb-16 selection:bg-amber-500/20 selection:text-amber-200">
      <AdminTopbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Admin</span>
              <span>/</span>
              <span className="text-zinc-200 font-medium">Growth & Retention</span>
              <span>/</span>
              <span className="text-amber-400 font-medium">CRM Pelanggan & VIP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-amber-400" />
              CRM Pelanggan, VIP & Reseller
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Pusat database pelanggan terintegrasi dari antrean pesanan. Pantau akumulasi Lifetime Value (LTV), 
              Average Order Value (AOV), segmentasi mitra otomatis, dan kirim pesan retensi WhatsApp berpenjualan tinggi.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleExportCsv}
              variant="outline"
              className="bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white text-xs flex items-center gap-2 h-10 px-4 rounded-xl transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Ekspor CSV Database
            </Button>
          </div>
        </div>

        {/* 4 Executive KPI Ribbon Cards (Bento Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Pelanggan Unik */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Total Pelanggan Unik</span>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                {kpis.totalCustomers.toLocaleString('id-ID')}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {kpis.repeatCustomerRate}% Repeat Buyer
                </span>
                <span className="text-[11px] text-zinc-500">
                  ({kpis.newCustomerCount} pelanggan baru)
                </span>
              </div>
            </div>
          </Card>

          {/* Card 2: Total Akumulasi LTV */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Total Akumulasi LTV</span>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Wallet className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-amber-300">
                {formatRupiah(kpis.totalLtv)}
              </div>
              <div className="mt-2 text-[11px] text-zinc-400">
                Rata-rata <span className="text-zinc-200 font-semibold">{formatRupiah(avgLtvPerCustomer)}</span> per akun
              </div>
            </div>
          </Card>

          {/* Card 3: Mitra VIP & Reseller */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Mitra VIP & Reseller</span>
              <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <Crown className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                {kpis.vipAndResellerCount} <span className="text-sm font-normal text-zinc-400">Akun</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {kpis.vipCount} VIP Ritel
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {kpis.resellerCount} Reseller B2B
                </span>
              </div>
            </div>
          </Card>

          {/* Card 4: Rata-Rata Belanja (AOV) */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Rata-Rata Belanja (AOV)</span>
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-sky-300">
                {formatRupiah(kpis.overallAov)}
              </div>
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Per checkout sukses</span>
                {kpis.churnRiskCount > 0 && (
                  <span className="text-rose-400 font-medium">
                    {kpis.churnRiskCount} Churn Risk
                  </span>
                )}
              </div>
            </div>
          </Card>

        </div>

        {/* Filter Bar & Search */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, WhatsApp, kota, atau garmen favorit..."
                className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-xs text-zinc-400 hidden sm:inline">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/40 border border-white/[0.08] text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400/50"
              >
                <option value="ltv-desc">LTV Tertinggi</option>
                <option value="orders-desc">Pesanan Terbanyak</option>
                <option value="date-desc">Transaksi Terbaru</option>
                <option value="aov-desc">AOV Tertinggi</option>
              </select>
            </div>

          </div>

          {/* Tier Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-zinc-500 text-[11px] font-medium mr-1 shrink-0">Filter Tier:</span>
            
            {[
              { id: 'all', label: 'Semua', count: allCustomers.length },
              { id: 'vip', label: 'VIP Ritel', count: kpis.vipCount },
              { id: 'reseller', label: 'Mitra Reseller', count: kpis.resellerCount },
              { id: 'new', label: 'Pelanggan Baru', count: kpis.newCustomerCount },
              { id: 'churn_risk', label: 'Churn Risk (>60h)', count: kpis.churnRiskCount },
              { id: 'regular', label: 'Reguler', count: allCustomers.filter(c => c.tier === 'regular').length }
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setTierFilter(pill.id)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                  tierFilter === pill.id
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm shadow-amber-400/20'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                <span>{pill.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  tierFilter === pill.id ? 'bg-zinc-950/20 text-zinc-950 font-mono' : 'bg-white/10 text-zinc-400'
                }`}>
                  {pill.count}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Customer Database Table */}
        <Card className="bg-[#121215] border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Daftar Pelanggan</span>
              <span className="text-xs text-zinc-500 font-mono">({filteredCustomers.length} dari {allCustomers.length})</span>
            </div>
            <div className="text-[11px] text-zinc-400 hidden sm:block">
              Klik nama atau tombol WA untuk aksi follow-up langsung
            </div>
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-500">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-sm font-semibold text-zinc-300">Tidak ada pelanggan yang cocok</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {searchQuery || tierFilter !== 'all'
                  ? 'Coba bersihkan kata kunci pencarian atau ubah filter status tier pelanggan.'
                  : 'Data pelanggan akan otomatis teragregasi begitu ada pesanan masuk di sistem antrean.'}
              </p>
              {(searchQuery || tierFilter !== 'all') && (
                <Button
                  onClick={() => { setSearchQuery(''); setTierFilter('all'); }}
                  variant="outline"
                  className="text-xs mt-2"
                >
                  Reset Filter
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Kontak WhatsApp</th>
                    <th className="py-3 px-4">Tier Status</th>
                    <th className="py-3 px-4 text-right">Pesanan & Qty</th>
                    <th className="py-3 px-4 text-right">Akumulasi LTV</th>
                    <th className="py-3 px-4 text-right">AOV Riil</th>
                    <th className="py-3 px-4">Order Terakhir</th>
                    <th className="py-3 px-4 text-center">Aksi Cepat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {filteredCustomers.map((c) => {
                    const initials = c.name
                      ? c.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                      : 'PL';

                    return (
                      <tr 
                        key={c.id}
                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        onClick={() => handleOpenWaModal(c, 'unboxing_care')}
                      >
                        {/* Pelanggan */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center font-bold text-xs text-amber-300 shrink-0">
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5 truncate">
                                <span>{c.name}</span>
                                {c.tier === 'vip' && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                              </div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5 truncate">
                                <MapPin className="w-3 h-3 text-zinc-500 shrink-0" />
                                <span>{c.city}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Kontak WhatsApp */}
                        <td className="py-3 px-4">
                          {c.phone ? (
                            <a
                              href={`https://wa.me/${c.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-emerald-400 font-mono text-[11px] bg-white/[0.04] hover:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-white/[0.06] hover:border-emerald-500/30 transition-all"
                            >
                              <Phone className="w-3 h-3 text-emerald-400" />
                              <span>+{c.phone}</span>
                            </a>
                          ) : (
                            <span className="text-zinc-600 text-[11px] italic">Tanpa WA</span>
                          )}
                        </td>

                        {/* Tier Status Badge */}
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${c.badgeColor}`}>
                            {c.tierLabel}
                          </span>
                        </td>

                        {/* Pesanan & Qty */}
                        <td className="py-3 px-4 text-right font-mono">
                          <div className="text-white font-medium">
                            {c.completedOrders} <span className="text-[10px] text-zinc-400">Order</span>
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {c.totalPcs} pcs
                          </div>
                        </td>

                        {/* Akumulasi LTV */}
                        <td className="py-3 px-4 text-right font-mono">
                          <div className="font-semibold text-amber-300">
                            {formatRupiah(c.ltv)}
                          </div>
                        </td>

                        {/* AOV */}
                        <td className="py-3 px-4 text-right font-mono">
                          <div className="text-zinc-300">
                            {formatRupiah(c.aov)}
                          </div>
                        </td>

                        {/* Order Terakhir */}
                        <td className="py-3 px-4">
                          <div className="text-zinc-300 text-[11px]">
                            {c.lastOrderDate ? c.lastOrderDate.slice(0, 10) : '-'}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">
                            {c.daysSinceLastOrder === 0 
                              ? 'Hari ini' 
                              : `${c.daysSinceLastOrder} hari lalu`}
                          </div>
                        </td>

                        {/* Aksi Cepat */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleOpenWaModal(c, c.tier === 'reseller' ? 'reseller_restock' : 'unboxing_care')}
                              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all hover:scale-105 min-w-[36px] min-h-[36px] flex items-center justify-center"
                              title="Buka Generator WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenWaModal(c, 'unboxing_care')}
                              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
                              title="Lihat Detail Riwayat"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </main>

      {/* CUSTOMER DETAIL & WHATSAPP ACTION MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-white/[0.12] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-start justify-between bg-gradient-to-r from-amber-500/5 via-transparent to-transparent">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${selectedCustomer.badgeColor}`}>
                    {selectedCustomer.tierLabel}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    ID: {selectedCustomer.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  {selectedCustomer.name}
                  {selectedCustomer.tier === 'vip' && <Crown className="w-5 h-5 text-amber-400" />}
                </h2>
                <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                  <span className="flex items-center gap-1 text-zinc-300">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {selectedCustomer.city}
                  </span>
                  {selectedCustomer.phone && (
                    <span className="flex items-center gap-1 text-emerald-400 font-mono">
                      <Phone className="w-3.5 h-3.5" />
                      +{selectedCustomer.phone}
                    </span>
                  )}
                  <span className="text-zinc-500">
                    Terakhir order: {selectedCustomer.lastOrderDate?.slice(0, 10)} ({selectedCustomer.daysSinceLastOrder} hari lalu)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* 4 Mini Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-black/40 border border-white/[0.08] rounded-2xl">
                  <div className="text-[10px] text-zinc-400">Total Akumulasi LTV</div>
                  <div className="text-base sm:text-lg font-bold text-amber-300 font-mono mt-1">
                    {formatRupiah(selectedCustomer.ltv)}
                  </div>
                </div>
                <div className="p-3 bg-black/40 border border-white/[0.08] rounded-2xl">
                  <div className="text-[10px] text-zinc-400">Rata-Rata Order (AOV)</div>
                  <div className="text-base sm:text-lg font-bold text-sky-300 font-mono mt-1">
                    {formatRupiah(selectedCustomer.aov)}
                  </div>
                </div>
                <div className="p-3 bg-black/40 border border-white/[0.08] rounded-2xl">
                  <div className="text-[10px] text-zinc-400">Total Transaksi</div>
                  <div className="text-base sm:text-lg font-bold text-white font-mono mt-1">
                    {selectedCustomer.completedOrders} <span className="text-xs font-normal text-zinc-500">Order</span>
                  </div>
                </div>
                <div className="p-3 bg-black/40 border border-white/[0.08] rounded-2xl">
                  <div className="text-[10px] text-zinc-400">Total Kaos (Pcs)</div>
                  <div className="text-base sm:text-lg font-bold text-white font-mono mt-1">
                    {selectedCustomer.totalPcs} <span className="text-xs font-normal text-zinc-500">Pcs</span>
                  </div>
                </div>
              </div>

              {/* WHATSAPP RETENTION GENERATOR */}
              <div className="p-4 sm:p-5 bg-gradient-to-b from-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs sm:text-sm">WhatsApp Retention Engine</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Pilih skrip pesan langsung</span>
                </div>

                {/* Template Selector Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WHATSAPP_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => handleSelectTemplate(tmpl.id)}
                      className={`p-2.5 text-left rounded-xl border transition-all text-xs flex flex-col justify-between min-h-[58px] ${
                        activeWaTemplate === tmpl.id
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white font-semibold'
                          : 'bg-black/30 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="font-semibold leading-tight line-clamp-1">{tmpl.title}</span>
                      <span className="text-[9px] text-emerald-400/80 font-mono mt-1">{tmpl.badge}</span>
                    </button>
                  ))}
                </div>

                {/* Text Area Live Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span>Draft Pesan (Dapat diedit sebelum kirim):</span>
                    <button
                      onClick={() => handleSelectTemplate(activeWaTemplate)}
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[10px]"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset Template
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={customWaMessage}
                    onChange={(e) => setCustomWaMessage(e.target.value)}
                    className="w-full p-3 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-400/60 leading-relaxed resize-y"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                  <Button
                    onClick={handleSendWhatsApp}
                    disabled={!selectedCustomer.phone}
                    className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Kirim via WhatsApp (wa.me)
                  </Button>
                  
                  <Button
                    onClick={handleCopyMessage}
                    variant="outline"
                    className="w-full sm:w-auto h-11 px-4 bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Tersalin!' : 'Salin Pesan'}
                  </Button>
                </div>
              </div>

              {/* RIWAYAT PESANAN PELANGGAN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    Riwayat Pesanan Pelanggan ({selectedCustomer.orders?.length || 0})
                  </span>
                  <span className="text-[11px] text-zinc-500">Urut dari pesanan terbaru</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedCustomer.orders?.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-black/40 border border-white/[0.06] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-white">#{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                            ord.status === 'shipped' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            ord.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {ord.status}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {ord.date?.slice(0, 10)}
                          </span>
                        </div>
                        <div className="text-zinc-300 text-[11px]">
                          {ord.productName} ({ord.qty} pcs)
                        </div>
                        {ord.trackingNo && (
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                            <Truck className="w-3 h-3" /> Resi: {ord.trackingNo}
                          </div>
                        )}
                      </div>

                      <div className="text-right sm:self-center">
                        <div className="font-mono font-bold text-white">
                          {formatRupiah(ord.amount)}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase">
                          Channel: {ord.channel}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/[0.08] bg-black/40 flex justify-end">
              <Button
                onClick={() => setSelectedCustomer(null)}
                variant="outline"
                className="text-xs h-9 px-4 rounded-xl"
              >
                Tutup
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
