import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Phone, 
  MapPin, 
  CreditCard, 
  Star, 
  ExternalLink, 
  Plus, 
  Copy, 
  Check, 
  Search, 
  Download, 
  Sparkles, 
  Boxes, 
  Edit3, 
  Trash2, 
  X, 
  Building2, 
  Layers, 
  Receipt, 
  Clock, 
  ShieldCheck, 
  LayoutGrid, 
  Table, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '@bisnishub/shared/components/ui/Card';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { ProcurementIntakeModal } from '../../components/admin/ProcurementIntakeModal';
import { 
  getVendors, 
  saveVendor, 
  deleteVendor, 
  calculateVendorSpend, 
  calculateVendorKpis, 
  exportVendorsCsv, 
  formatRupiah, 
  VENDOR_CATEGORIES 
} from '../../services/vendorsApi';
import { normalizePhoneNumber } from '../../services/customersApi';

export function VendorsPage() {
  const { procurements = [], addProcurement, showToast } = useAdmin();

  // Vendor Data State
  const [vendors, setVendors] = useState(() => getVendors());
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Copied Account State
  const [copiedId, setCopiedId] = useState(null);

  // Modal State: Add/Edit Vendor
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'garment',
    pic: '',
    phone: '',
    address: '',
    pricingNotes: '',
    bankAccount: '',
    rating: 5,
    status: 'active'
  });

  // Modal State: Procurement PO Bridge
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);
  const [procurementInitialTab, setProcurementInitialTab] = useState('wholesale_tshirt');

  // Executive KPI ribbon cards
  const kpis = useMemo(() => {
    return calculateVendorKpis(vendors, procurements);
  }, [vendors, procurements]);

  // Filtered vendor list
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (v.name || '').toLowerCase().includes(q);
        const matchPic = (v.pic || '').toLowerCase().includes(q);
        const matchPhone = (v.phone || '').includes(q);
        const matchBank = (v.bankAccount || '').toLowerCase().includes(q);
        const matchAddress = (v.address || '').toLowerCase().includes(q);
        if (!matchName && !matchPic && !matchPhone && !matchBank && !matchAddress) {
          return false;
        }
      }

      // 2. Category filter
      if (filterCategory !== 'all' && v.category !== filterCategory) {
        return false;
      }

      return true;
    });
  }, [vendors, searchQuery, filterCategory]);

  // Copy bank account
  const handleCopyBank = (id, accountText) => {
    if (!accountText) return;
    navigator.clipboard.writeText(accountText);
    setCopiedId(id);
    if (showToast) showToast('Nomor rekening vendor berhasil disalin!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open modal for new vendor
  const handleOpenAddModal = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      category: 'garment',
      pic: '',
      phone: '',
      address: '',
      pricingNotes: '',
      bankAccount: '',
      rating: 5,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  // Open modal for editing vendor
  const handleOpenEditModal = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name || '',
      category: vendor.category || 'garment',
      pic: vendor.pic || '',
      phone: vendor.phone || '',
      address: vendor.address || '',
      pricingNotes: vendor.pricingNotes || '',
      bankAccount: vendor.bankAccount || '',
      rating: vendor.rating || 5,
      status: vendor.status || 'active'
    });
    setIsModalOpen(true);
  };

  // Save vendor submit
  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      if (showToast) showToast('Nama vendor wajib diisi', 'warning');
      return;
    }

    const payload = {
      ...formData,
      id: editingVendor?.id || undefined
    };

    const updated = saveVendor(payload);
    setVendors(updated);
    setIsModalOpen(false);
    if (showToast) {
      showToast(editingVendor ? 'Data vendor berhasil diperbarui!' : 'Vendor baru berhasil ditambahkan!', 'success');
    }
  };

  // Delete vendor
  const handleDeleteVendor = (vendorId, vendorName) => {
    if (window.confirm(`Yakin ingin menghapus mitra vendor "${vendorName}"?`)) {
      const updated = deleteVendor(vendorId);
      setVendors(updated);
      if (showToast) showToast('Mitra vendor berhasil dihapus', 'info');
    }
  };

  // Trigger Procurement PO Bridge
  const handleTriggerProcurement = (vendor) => {
    // Map vendor category to procurement tab
    let targetTab = 'wholesale_tshirt';
    if (vendor.category === 'dtf_print') targetTab = 'dtf_roll';
    else if (vendor.category === 'packaging') targetTab = 'packaging_supplies';
    else if (vendor.category === 'expedition') targetTab = 'wholesale_tshirt';

    setProcurementInitialTab(targetTab);
    setIsProcurementModalOpen(true);
  };

  // Export CSV
  const handleExportCsv = () => {
    exportVendorsCsv(filteredVendors, procurements);
    if (showToast) showToast(`Berhasil mengekspor ${filteredVendors.length} mitra vendor`, 'success');
  };

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
              <span className="text-zinc-200 font-medium">Rantai Pasok & Pengadaan</span>
              <span>/</span>
              <span className="text-emerald-400 font-medium">Mitra Vendor & Maklon</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Truck className="w-7 h-7 text-emerald-400" />
              Database Vendor & Mitra Maklon
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Direktori mitra rantai pasok terverifikasi untuk TeeStock & MultiGraph: Distributor Kaos NSA Cititex, 
              Jasa Cetak Roll DTF Senen, Pabrik Polymailer & Kardus Box, serta Kurir Logistik.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handleExportCsv}
              variant="outline"
              className="bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white text-xs flex items-center gap-2 h-10 px-3.5 rounded-xl transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Ekspor CSV
            </Button>
            <Button
              onClick={handleOpenAddModal}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 h-10 px-4 rounded-xl shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Plus className="w-4 h-4" />
              + Tambah Vendor
            </Button>
          </div>
        </div>

        {/* 4 EXECUTIVE KPI RIBBON CARDS (Bento Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Mitra Vendor Aktif */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Total Mitra Vendor</span>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Truck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                {kpis.activeVendors} <span className="text-xs font-normal text-zinc-400">/ {kpis.totalVendors} Mitra</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {kpis.categoryCounts.garment} NSA
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {kpis.categoryCounts.dtf_print} DTF
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {kpis.categoryCounts.packaging} Pack
                </span>
              </div>
            </div>
          </Card>

          {/* Card 2: Akumulasi Belanja YTD */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Akumulasi Belanja (YTD)</span>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Receipt className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-amber-300">
                {formatRupiah(kpis.totalYtdSpend)}
              </div>
              <div className="mt-2 text-[11px] text-zinc-400">
                Dari <span className="text-zinc-200 font-semibold">{procurements.length} Faktur PO</span> terbit
              </div>
            </div>
          </Card>

          {/* Card 3: Skor Performa Rata-Rata */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Skor Performa Rata-Rata</span>
              <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-yellow-300 flex items-center gap-2">
                <span>{kpis.averageRating}</span>
                <span className="text-sm font-normal text-zinc-400">/ 5.0</span>
              </div>
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SLA Lead Time Terverifikasi</span>
              </div>
            </div>
          </Card>

          {/* Card 4: Kategori Utama Rantai Pasok */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Kategori Utama Pasokan</span>
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                <Building2 className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight text-sky-300 truncate">
                {kpis.topCategoryLabel}
              </div>
              <div className="mt-2 text-[11px] text-zinc-400">
                Pilar Rantai Pasok Utama Studio
              </div>
            </div>
          </Card>

        </div>

        {/* Filter Bar & View Mode Toggle */}
        <Card className="p-4 bg-[#121215] border-white/[0.08] rounded-2xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari vendor, PIC, nomor WA, bank, atau alamat..."
                className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/50 transition-colors"
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

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-black/40 border border-white/[0.08] p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Kartu</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Tampilan Tabel"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Tabel</span>
              </button>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-zinc-500 text-[11px] font-medium mr-1 shrink-0">Filter Rantai Pasok:</span>
            
            {[
              { id: 'all', label: 'Semua Mitra', count: vendors.length },
              { id: 'garment', label: 'Kaos Polos NSA', count: kpis.categoryCounts.garment },
              { id: 'dtf_print', label: 'DTF Roll 58cm', count: kpis.categoryCounts.dtf_print },
              { id: 'packaging', label: 'Kemasan & Stiker', count: kpis.categoryCounts.packaging },
              { id: 'expedition', label: 'Logistik & Kurir', count: kpis.categoryCounts.expedition }
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterCategory(pill.id)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1.5 ${
                  filterCategory === pill.id
                    ? 'bg-emerald-400 text-zinc-950 font-bold shadow-sm shadow-emerald-400/20'
                    : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                <span>{pill.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  filterCategory === pill.id ? 'bg-zinc-950/20 text-zinc-950 font-mono' : 'bg-white/10 text-zinc-400'
                }`}>
                  {pill.count}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* VENDORS PRESENTATION: CARDS VIEW OR TABLE VIEW */}
        {filteredVendors.length === 0 ? (
          <Card className="py-16 px-4 text-center space-y-3 bg-[#121215] border-white/[0.08] rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-500">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-sm font-semibold text-zinc-300">Tidak ada vendor yang cocok</div>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Coba gunakan kata kunci lain atau pilih kategori rantai pasok yang berbeda.
            </p>
          </Card>
        ) : viewMode === 'cards' ? (
          /* GRID CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVendors.map((vendor) => {
              const spend = calculateVendorSpend(vendor, procurements);
              const catConfig = VENDOR_CATEGORIES[vendor.category] || VENDOR_CATEGORIES.garment;

              return (
                <Card 
                  key={vendor.id}
                  className="p-5 bg-[#121215] border-white/[0.08] rounded-2xl space-y-4 hover:border-white/20 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Card Header: Title & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {vendor.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${catConfig.badgeColor}`}>
                            {catConfig.label}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                          <span>PIC:</span>
                          <strong className="text-zinc-200 font-semibold">{vendor.pic}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-400/20">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{vendor.rating || 5}</span>
                        </div>
                        <button
                          onClick={() => handleOpenEditModal(vendor)}
                          className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                          title="Edit Vendor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Hapus Vendor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pricing & Terms Notes */}
                    <div className="p-3 bg-black/40 border border-white/[0.06] rounded-xl text-xs space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                        Tarif & Ketentuan Maklon:
                      </span>
                      <p className="text-zinc-300 leading-relaxed text-[11px]">
                        {vendor.pricingNotes || 'Belum ada catatan harga resmi.'}
                      </p>
                    </div>

                    {/* Bank & Address Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2 text-zinc-400">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-snug">{vendor.address}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-black/30 border border-white/[0.04] rounded-xl">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="font-mono text-xs text-white font-medium">
                            {vendor.bankAccount || 'Rekening belum diatur'}
                          </span>
                        </div>
                        {vendor.bankAccount && (
                          <button
                            onClick={() => handleCopyBank(vendor.id, vendor.bankAccount)}
                            className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-white/[0.06] transition-all"
                          >
                            {copiedId === vendor.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Disalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin Rek</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Real Procurement Spend Metrics */}
                    <div className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Belanja PO (YTD):</span>
                        <span className="font-bold text-emerald-400">{formatRupiah(spend.totalSpend)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block">Total PO Terbit:</span>
                        <span className="font-medium text-zinc-300">{spend.totalPoCount} Transaksi</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions (WhatsApp & PO Bridge) */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center gap-2">
                    <a
                      href={`https://wa.me/${vendor.phone}?text=Halo%20${encodeURIComponent(vendor.pic)}%20(${encodeURIComponent(vendor.name)})%20saya%20Rizky%20dari%20TeeStock%20Apparel%20Studio`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 py-2.5 text-xs font-bold text-emerald-400 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Chat WhatsApp</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>

                    <Button
                      onClick={() => handleTriggerProcurement(vendor)}
                      className="bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 text-xs py-2.5 px-3 rounded-xl flex items-center gap-1.5 transition-all"
                      title="Buat Nota PO ke Vendor Ini"
                    >
                      <Boxes className="w-3.5 h-3.5 text-amber-400" />
                      <span>PO Bahan</span>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <Card className="bg-[#121215] border-white/[0.08] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Nama Vendor</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Kontak PIC</th>
                    <th className="py-3 px-4">Rekening Bank</th>
                    <th className="py-3 px-4 text-right">Belanja PO YTD</th>
                    <th className="py-3 px-4 text-center">Rating</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredVendors.map((vendor) => {
                    const spend = calculateVendorSpend(vendor, procurements);
                    const catConfig = VENDOR_CATEGORIES[vendor.category] || VENDOR_CATEGORIES.garment;

                    return (
                      <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4 font-semibold text-white">
                          <div>{vendor.name}</div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-xs">{vendor.address}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${catConfig.badgeColor}`}>
                            {catConfig.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-zinc-200">{vendor.pic}</div>
                          <a
                            href={`https://wa.me/${vendor.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-400 font-mono hover:underline"
                          >
                            +{vendor.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-zinc-300">
                          {vendor.bankAccount}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-emerald-400 font-semibold">
                          {formatRupiah(spend.totalSpend)}
                          <div className="text-[10px] text-zinc-500 font-normal">{spend.totalPoCount} PO</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 text-amber-400 text-[11px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{vendor.rating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              onClick={() => handleTriggerProcurement(vendor)}
                              variant="outline"
                              className="h-8 px-2.5 text-[11px]"
                            >
                              PO
                            </Button>
                            <button
                              onClick={() => handleOpenEditModal(vendor)}
                              className="p-1.5 text-zinc-400 hover:text-white"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

      </main>

      {/* MODAL: TAMBAH / EDIT VENDOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-[#121215] border border-white/[0.12] w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl my-auto">
            
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Truck className="w-5 h-5 text-emerald-400" />
                <span>{editingVendor ? 'Edit Data Mitra Vendor' : 'Tambah Mitra Vendor Baru'}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Nama Vendor / Badan Usaha *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: PT Cititex Jaya / Cahaya Digital"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-400/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Kategori Rantai Pasok *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-400/50"
                  >
                    <option value="garment">Kaos Polos NSA</option>
                    <option value="dtf_print">DTF Roll 58cm</option>
                    <option value="packaging">Kemasan & Stiker</option>
                    <option value="expedition">Logistik & Kurir</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Rating Skor (1 - 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 5 })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Nama PIC Sales / Operator</label>
                  <input
                    type="text"
                    value={formData.pic}
                    onChange={(e) => setFormData({ ...formData, pic: e.target.value })}
                    placeholder="Contoh: Mas Hendra"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-semibold">Nomor WhatsApp (08xxx) *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Nomor Rekening Pembayaran</label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="BCA 123-456-7890 a.n PT Vendor"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Alamat Kantor / Gudang / Drop Point</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Balai Pustaka / Kawasan Percetakan Senen..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-400/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Catatan Tarif, Ketentuan & SLA Maklon</label>
                <textarea
                  rows={3}
                  value={formData.pricingNotes}
                  onChange={(e) => setFormData({ ...formData, pricingNotes: e.target.value })}
                  placeholder="Harga per meter, minimal order, waktu pengerjaan..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400/50 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/[0.08]">
                <Button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="h-10 text-xs px-4"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="h-10 text-xs px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Simpan Mitra Vendor
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: PROCUREMENT INTAKE BRIDGE */}
      {isProcurementModalOpen && (
        <ProcurementIntakeModal
          isOpen={isProcurementModalOpen}
          onClose={() => setIsProcurementModalOpen(false)}
          onSave={async (newProcurement) => {
            if (addProcurement) {
              await addProcurement(newProcurement);
              // Refresh vendor spend calculations
              setVendors([...getVendors()]);
            }
            setIsProcurementModalOpen(false);
          }}
          initialTab={procurementInitialTab}
        />
      )}

    </div>
  );
}
