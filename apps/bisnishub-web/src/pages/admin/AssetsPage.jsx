import React, { useState } from 'react';
import { 
  Flame, 
  Wrench, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  MapPin,
  Download,
  Calendar,
  Layers,
  Landmark,
  Coins,
  TrendingDown,
  Zap,
  Search,
  Sliders,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Monitor,
  Package,
  Building2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Modal } from '../../components/ui/Modal';
import { formatRupiah } from '../../utils/formatters';
import { 
  calculateDepreciation, 
  getFixedAssetsSummary, 
  exportAssetsDepreciationCsv 
} from '../../services/assetsApi';

export function AssetsPage() {
  const { 
    fixedAssets, 
    addFixedAsset, 
    removeFixedAsset, 
    totalAssetsValue, 
    multiUnitBalances,
    walletsConfig 
  } = useAdmin();

  // Filter & Search State
  const [activeTab, setActiveTab] = useState('all'); // all | teestock | multigraph | holding
  const [categoryFilter, setCategoryFilter] = useState('all'); // all | machine | electronics | tools | furniture
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoiSimulator, setShowRoiSimulator] = useState(true);

  // In-House Press Payback & ROI Simulator State
  const [simMachineCapex, setSimMachineCapex] = useState(2500000);
  const [simMaklonCost, setSimMaklonCost] = useState(5000);
  const [simMonthlyVolume, setSimMonthlyVolume] = useState(100);
  const [simElectricityPerPcs, setSimElectricityPerPcs] = useState(300);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [businessUnit, setBusinessUnit] = useState('teestock');
  const [category, setCategory] = useState('machine');
  const [acquisitionDate, setAcquisitionDate] = useState(new Date().toISOString().slice(0, 10));
  const [purchaseCost, setPurchaseCost] = useState(2500000);
  const [salvageValue, setSalvageValue] = useState(0);
  const [usefulLifeMonths, setUsefulLifeMonths] = useState(48);
  const [location, setLocation] = useState('TeeStock Central Studio (Depok)');
  const [notes, setNotes] = useState('');
  const [recordCashTx, setRecordCashTx] = useState(true);
  const [paymentSource, setPaymentSource] = useState('wallet_holding');

  // Dynamic summary
  const summary = getFixedAssetsSummary(fixedAssets);

  // Open Modal Handler
  const handleOpenNew = () => {
    setAssetName('');
    setBusinessUnit('teestock');
    setCategory('machine');
    setAcquisitionDate(new Date().toISOString().slice(0, 10));
    setPurchaseCost(2500000);
    setSalvageValue(0);
    setUsefulLifeMonths(48);
    setLocation('TeeStock Central Studio (Depok)');
    setNotes('');
    setRecordCashTx(true);
    setPaymentSource('wallet_holding');
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetName.trim()) {
      alert('Mohon isi nama mesin atau alat kerja');
      return;
    }

    const costNum = Number(purchaseCost);
    if (costNum <= 0) {
      alert('Harga pembelian aset harus lebih dari Rp 0');
      return;
    }

    await addFixedAsset({
      assetName: assetName.trim(),
      businessUnit,
      category,
      acquisitionDate,
      purchaseCost: costNum,
      salvageValue: Number(salvageValue) || 0,
      usefulLifeMonths: Number(usefulLifeMonths) || 48,
      status: 'active',
      location: location.trim(),
      notes: notes.trim(),
      recordCashTx,
      paymentSource
    });

    setIsModalOpen(false);
  };

  // ROI Simulator Calculations
  const netSavingPerPcs = Math.max(0, simMaklonCost - simElectricityPerPcs);
  const monthlySavings = simMonthlyVolume * netSavingPerPcs;
  const paybackMonths = monthlySavings > 0 ? (simMachineCapex / monthlySavings).toFixed(1) : '∞';
  const annualRoi = simMachineCapex > 0 ? (((monthlySavings * 12) / simMachineCapex) * 100).toFixed(0) : 0;
  const bePcs = netSavingPerPcs > 0 ? Math.ceil(simMachineCapex / netSavingPerPcs) : 0;

  // Selected Wallet Balance for CFO Alert
  const sourceUnit = paymentSource === 'wallet_holding' 
    ? 'holding' 
    : paymentSource === 'wallet_multigraph' 
    ? 'multigraph' 
    : paymentSource === 'wallet_founder'
    ? 'founder'
    : 'teestock';
    
  const currentWalletBal = sourceUnit === 'founder'
    ? (multiUnitBalances?.founder?.netEquity || 0)
    : (multiUnitBalances?.[sourceUnit]?.balance || 0);

  const isOverdraftRisk = recordCashTx && Number(purchaseCost) > currentWalletBal;

  // Filtered Assets
  const filteredAssets = fixedAssets.filter(asset => {
    const matchUnit = activeTab === 'all' || (asset.businessUnit || 'teestock') === activeTab;
    const matchCategory = categoryFilter === 'all' || asset.category === categoryFilter;
    const matchSearch = !searchQuery.trim() || 
      asset.assetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUnit && matchCategory && matchSearch;
  });

  const teestockCount = fixedAssets.filter(a => (a.businessUnit || 'teestock') === 'teestock').length;
  const multigraphCount = fixedAssets.filter(a => a.businessUnit === 'multigraph').length;
  const holdingCount = fixedAssets.filter(a => a.businessUnit === 'holding').length;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#09090B] text-zinc-100 min-h-screen">
      <AdminTopbar title="Aset Mesin & Depresiasi CAPEX" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                CAPITAL EXPENDITURE &amp; PSAK DEPRECIATION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Metode Garis Lurus (Straight-Line)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Aset Mesin &amp; Peralatan Kerja
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Pelacak alat produksi produktif jangka panjang. Modal Anda tidak menguap, melainkan terkonversi menjadi aset fisik berwujud dengan kalkulasi penyusutan otomatis yang menjaga akurasi neraca.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => exportAssetsDepreciationCsv(fixedAssets)}
              disabled={fixedAssets.length === 0}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 bg-[#121215] border border-white/[0.1] hover:bg-white/[0.05] hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
              title="Unduh Jadwal Depresiasi CSV"
            >
              <Download className="w-4 h-4 text-zinc-400" />
              <span>Ekspor CSV Depresiasi</span>
            </button>

            <button
              onClick={handleOpenNew}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all duration-200 cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aset / Mesin</span>
            </button>
          </div>
        </div>

        {/* 4 Executive Bento KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Net Book Value */}
          <div className="bg-[#121215] border border-white/[0.08] hover:border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Nilai Buku Bersih (NBV)</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 font-mono font-black text-2xl text-amber-400 tracking-tight">
              {formatRupiah(summary.totalNetBookValue)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              Total aset produktif di neraca berjalan
            </p>
          </div>

          {/* Card 2: Total CAPEX Invested */}
          <div className="bg-[#121215] border border-white/[0.08] hover:border-sky-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Total Investasi CAPEX</span>
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Landmark className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 font-mono font-black text-2xl text-sky-400 tracking-tight">
              {formatRupiah(summary.totalAcquisitionCost)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              {fixedAssets.length} unit aset ({summary.activeMachinesCount} mesin produksi)
            </p>
          </div>

          {/* Card 3: Accumulated Depreciation */}
          <div className="bg-[#121215] border border-white/[0.08] hover:border-rose-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Akumulasi Penyusutan</span>
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 font-mono font-black text-2xl text-rose-400 tracking-tight">
              {formatRupiah(summary.totalAccumulatedDepreciation)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              Beban {formatRupiah(summary.totalMonthlyDepreciation)} / bln
            </p>
          </div>

          {/* Card 4: In-House Production Efficiency */}
          <div className="bg-[#121215] border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Efisiensi Press In-House</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 font-mono font-black text-lg text-emerald-400 tracking-tight">
              ⚡ Mandiri (In-House)
            </div>
            <p className="text-[11px] text-zinc-400 mt-1 font-mono">
              Hemat Jasa Press Rp 5.000–Rp 7.000/pcs
            </p>
          </div>
        </div>

        {/* Interactive In-House Press Payback & ROI Simulator */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div 
            onClick={() => setShowRoiSimulator(!showRoiSimulator)}
            className="flex items-center justify-between p-5 border-b border-white/[0.06] bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors select-none"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Simulator Balik Modal (Payback &amp; ROI) Mesin Press In-House</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CFO Decision Tool
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Hitung secara presisi penghematan memproduksi sendiri dibanding maklon jasa press pihak ke-3.
                </p>
              </div>
            </div>

            <button 
              type="button"
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              {showRoiSimulator ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showRoiSimulator && (
            <div className="p-5 sm:p-6 space-y-6">
              {/* Input Sliders & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Biaya Mesin */}
                <div className="space-y-2 bg-[#09090B]/60 p-4 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Harga Mesin Press (CAPEX)</span>
                    <span className="font-mono font-bold text-amber-400">{formatRupiah(simMachineCapex)}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[2500000, 3500000, 5000000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSimMachineCapex(amt)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                          simMachineCapex === amt 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold' 
                            : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]'
                        }`}
                      >
                        {formatRupiah(amt).replace(',00', '').replace('Rp ', '')}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={10000000}
                    step={100000}
                    value={simMachineCapex}
                    onChange={(e) => setSimMachineCapex(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-2"
                  />
                </div>

                {/* 2. Biaya Maklon Luar */}
                <div className="space-y-2 bg-[#09090B]/60 p-4 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Ongkos Jasa Press Maklon</span>
                    <span className="font-mono font-bold text-rose-400">{formatRupiah(simMaklonCost)} / pcs</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Biaya rata-rata jika menitipkan press DTF ke vendor luar.
                  </p>
                  <input
                    type="range"
                    min={3000}
                    max={10000}
                    step={500}
                    value={simMaklonCost}
                    onChange={(e) => setSimMaklonCost(Number(e.target.value))}
                    className="w-full accent-rose-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>Rp 3.000</span>
                    <span>Rp 5.000</span>
                    <span>Rp 10.000</span>
                  </div>
                </div>

                {/* 3. Volume Produksi per Bulan */}
                <div className="space-y-2 bg-[#09090B]/60 p-4 rounded-xl border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-medium">Volume Pesanan Kaos / Bulan</span>
                    <span className="font-mono font-bold text-emerald-400">{simMonthlyVolume} Pcs</span>
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    Estimasi ritel web + custom apparel bulanan.
                  </p>
                  <input
                    type="range"
                    min={20}
                    max={500}
                    step={10}
                    value={simMonthlyVolume}
                    onChange={(e) => setSimMonthlyVolume(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                    <span>20 pcs</span>
                    <span>100 pcs</span>
                    <span>500 pcs</span>
                  </div>
                </div>
              </div>

              {/* Real-Time Outcome Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#09090B] border border-white/[0.08] p-3.5 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Hemat Kas Bersih / Bln
                  </span>
                  <div className="mt-1 font-mono font-bold text-lg text-emerald-400">
                    {formatRupiah(monthlySavings)}
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Net: {formatRupiah(netSavingPerPcs)} / pcs
                  </span>
                </div>

                <div className="bg-[#09090B] border border-white/[0.08] p-3.5 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Payback Period
                  </span>
                  <div className="mt-1 font-mono font-bold text-lg text-amber-400">
                    {paybackMonths} Bulan
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Waktu modal kembali utuh
                  </span>
                </div>

                <div className="bg-[#09090B] border border-white/[0.08] p-3.5 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Annual ROI
                  </span>
                  <div className="mt-1 font-mono font-bold text-lg text-sky-400">
                    {annualRoi}% / Thn
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Tingkat pengembalian tahunan
                  </span>
                </div>

                <div className="bg-[#09090B] border border-white/[0.08] p-3.5 rounded-xl">
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-semibold">
                    Break-Even Volume
                  </span>
                  <div className="mt-1 font-mono font-bold text-lg text-yellow-300">
                    {bePcs} Pcs
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    Kaos untuk melunasi mesin
                  </span>
                </div>
              </div>

              {/* Strategic Insight Box */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
                <span className="text-base">💡</span>
                <div className="space-y-0.5">
                  <p className="font-semibold text-emerald-200">
                    Rekomendasi CFO: Investasi Mesin Sangat Menguntungkan
                  </p>
                  <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                    Dengan memproduksi <span className="font-bold text-white">{simMonthlyVolume} pcs</span> kaos/bulan, mesin seharga <span className="font-bold text-white">{formatRupiah(simMachineCapex)}</span> akan lunas balik modal hanya dalam <span className="font-bold text-white">{paybackMonths} bulan</span> (atau setelah memproduksi {bePcs} pcs). Setelah titik ini terlewati, seluruh penghematan kas <span className="font-bold text-emerald-200">{formatRupiah(monthlySavings)}/bulan</span> murni menambah margin laba bersih holding!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#121215] p-3 rounded-2xl border border-white/[0.08]">
          {/* Unit Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Semua Unit ({fixedAssets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('teestock')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'teestock'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-amber-300 hover:bg-amber-500/5'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              TeeStock ({teestockCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('multigraph')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'multigraph'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-emerald-300 hover:bg-emerald-500/5'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              MultiGraph ({multigraphCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('holding')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'holding'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-zinc-400 hover:text-sky-300 hover:bg-sky-500/5'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Holding ({holdingCount})
            </button>
          </div>

          {/* Search Box & Category Select */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#09090B] border border-white/[0.1] text-zinc-300 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="all">Semua Kategori</option>
              <option value="machine">Mesin Produksi</option>
              <option value="electronics">Elektronik &amp; Komputer</option>
              <option value="tools">Perkakas / Meja Kerja</option>
              <option value="furniture">Perabot &amp; Studio</option>
            </select>

            <div className="relative flex-1 md:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Cari aset..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#09090B] border border-white/[0.1] text-xs text-white pl-8 pr-3 py-2 rounded-xl outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Assets Cards Grid */}
        {filteredAssets.length === 0 ? (
          <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800/60 border border-white/[0.08] flex items-center justify-center mx-auto text-zinc-400">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Belum Ada Aset Terdaftar</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Belum ada mesin atau alat kerja yang cocok dengan filter. Catat pembelian mesin studio Anda untuk memperhitungkan penyusutan otomatis di neraca.
            </p>
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-colors mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Aset Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAssets.map(asset => {
              const dep = asset.depreciation || calculateDepreciation(asset);
              const unit = asset.businessUnit || 'teestock';
              const unitColor = unit === 'multigraph' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : unit === 'holding' ? 'text-sky-400 border-sky-500/30 bg-sky-500/10' : 'text-amber-400 border-amber-500/30 bg-amber-500/10';

              return (
                <div 
                  key={asset.id} 
                  className="bg-[#121215] border border-white/[0.08] hover:border-white/[0.18] transition-all duration-200 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${unitColor}`}>
                          {asset.category === 'electronics' ? (
                            <Monitor className="w-5 h-5" />
                          ) : asset.category === 'tools' ? (
                            <Wrench className="w-5 h-5" />
                          ) : (
                            <Flame className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${unitColor}`}>
                              {unit}
                            </span>
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                              {asset.category}
                            </span>
                            <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                              asset.status === 'active' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {asset.status === 'active' ? 'Aktif' : 'Afkir'}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm sm:text-base text-white mt-1">
                            {asset.assetName}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus aset "${asset.assetName}" dari neraca?`)) {
                            removeFixedAsset(asset.id);
                          }
                        }}
                        className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Hapus Aset"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Meta info: Location & Date */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {asset.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        Perolehan: {asset.acquisitionDate}
                      </span>
                    </div>

                    {/* Financial Figures 3-Cols */}
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
                      <div className="bg-[#09090B] p-2.5 rounded-xl border border-white/[0.06]">
                        <span className="text-[10px] text-zinc-500 block">Harga Beli (CAPEX)</span>
                        <span className="font-bold text-zinc-200 mt-0.5 block">{formatRupiah(asset.purchaseCost)}</span>
                      </div>
                      <div className="bg-[#09090B] p-2.5 rounded-xl border border-white/[0.06]">
                        <span className="text-[10px] text-zinc-500 block">Nilai Buku (NBV)</span>
                        <span className="font-bold text-amber-400 mt-0.5 block">{formatRupiah(dep.netBookValue)}</span>
                      </div>
                      <div className="bg-[#09090B] p-2.5 rounded-xl border border-white/[0.06]">
                        <span className="text-[10px] text-zinc-500 block">Depresiasi / Bln</span>
                        <span className="font-bold text-rose-300 mt-0.5 block">{formatRupiah(dep.monthlyDepreciation)}</span>
                      </div>
                    </div>

                    {/* Straight-Line Depreciation Progress Bar */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span>Penyusutan: {dep.progressPercent}% ({dep.effectiveMonths}/{dep.usefulLifeMonths} bln)</span>
                        <span>Sisa Umur: {dep.remainingMonths} bln</span>
                      </div>
                      <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden border border-white/[0.05]">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            dep.progressPercent > 80 
                              ? 'bg-rose-500' 
                              : dep.progressPercent > 40 
                              ? 'bg-amber-400' 
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${dep.progressPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span>Tersusut: {formatRupiah(dep.accumulatedDepreciation)}</span>
                        <span>Residu: {formatRupiah(asset.salvageValue || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes / Specs Box */}
                  {asset.notes && (
                    <p className="text-xs text-zinc-400 bg-[#09090B]/60 p-2.5 rounded-xl border border-white/[0.06] mt-2 leading-relaxed">
                      💬 {asset.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Tambah Aset Baru */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Aset Tetap / Mesin Kerja (CAPEX)"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Nama Aset */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Nama Mesin / Peralatan *</label>
            <input
              type="text"
              placeholder="cth: Mesin Heat Press High-Pressure 38x38 cm"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400 min-h-[44px]"
              required
            />
          </div>

          {/* 2. Unit Bisnis & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Unit Bisnis Pemilik</label>
              <select
                value={businessUnit}
                onChange={(e) => setBusinessUnit(e.target.value)}
                className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 min-h-[44px]"
              >
                <option value="teestock">TeeStock Apparel (Ritel &amp; POD)</option>
                <option value="multigraph">MultiGraph Print (Maklon Kemasan)</option>
                <option value="holding">Holding Reserve Treasury</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Kategori Aset</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 min-h-[44px]"
              >
                <option value="machine">Mesin Produksi (Heat Press, dll)</option>
                <option value="electronics">Elektronik &amp; Komputer</option>
                <option value="tools">Perkakas / Meja Kerja</option>
                <option value="furniture">Perabot / Rak Studio</option>
              </select>
            </div>
          </div>

          {/* 3. Lokasi & Tanggal Perolehan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Lokasi Penyimpanan</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Tanggal Perolehan</label>
              <input
                type="date"
                value={acquisitionDate}
                onChange={(e) => setAcquisitionDate(e.target.value)}
                className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 min-h-[44px]"
                required
              />
            </div>
          </div>

          {/* 4. Harga Pembelian (CAPEX) & Nilai Residu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Harga Perolehan / Beli (Rp) *</label>
              <input
                type="number"
                value={purchaseCost}
                onChange={(e) => setPurchaseCost(e.target.value)}
                min="0"
                step="50000"
                className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono font-bold outline-none focus:border-amber-400 min-h-[44px]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">Nilai Residu / Sisa (Rp)</label>
              <input
                type="number"
                value={salvageValue}
                onChange={(e) => setSalvageValue(e.target.value)}
                min="0"
                step="50000"
                placeholder="0 jika habis tak bernilai"
                className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 font-mono outline-none focus:border-amber-400 min-h-[44px]"
              />
            </div>
          </div>

          {/* 5. Umur Manfaat & Presets */}
          <div className="space-y-2 bg-[#09090B]/60 p-3.5 rounded-xl border border-white/[0.06]">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-300">Umur Manfaat Ekonomis</span>
              <span className="font-mono font-bold text-amber-400">{usefulLifeMonths} Bulan ({(usefulLifeMonths / 12).toFixed(1)} Tahun)</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: '36 Bln (3 Thn)', sub: 'Elektronik', val: 36 },
                { label: '48 Bln (4 Thn)', sub: 'Mesin Standar', val: 48 },
                { label: '60 Bln (5 Thn)', sub: 'Heavy Duty', val: 60 }
              ].map(preset => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setUsefulLifeMonths(preset.val)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    Number(usefulLifeMonths) === preset.val
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-[#121215] text-zinc-400 border-white/[0.06] hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="text-[11px] font-mono">{preset.label}</div>
                  <div className="text-[9px] text-zinc-500">{preset.sub}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 text-[11px] font-mono text-zinc-400 border-t border-white/[0.06]">
              <span>Beban Depresiasi Garis Lurus:</span>
              <span className="font-bold text-emerald-400">
                {formatRupiah(Math.round((Math.max(0, Number(purchaseCost) - Number(salvageValue))) / (Number(usefulLifeMonths) || 48)))} / bulan
              </span>
            </div>
          </div>

          {/* 6. Integrasi Kas Multi-Wallet (Realisasi CAPEX) */}
          <div className="space-y-3 bg-[#09090B]/80 p-3.5 rounded-xl border border-white/[0.08]">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={recordCashTx}
                onChange={(e) => setRecordCashTx(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
              <span className="text-xs font-bold text-white">
                Potong Kas Langsung dari Buku Kas (Realisasi Belanja CAPEX)
              </span>
            </label>

            {recordCashTx && (
              <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400">Pilih Dompet Sumber Pendanaan:</label>
                  <select
                    value={paymentSource}
                    onChange={(e) => setPaymentSource(e.target.value)}
                    className="w-full bg-[#121215] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 min-h-[44px]"
                  >
                    <option value="wallet_holding">
                      Holding Reserve Treasury (Kas Cadangan Investasi Mesin) - Saldo: {formatRupiah(multiUnitBalances?.holding?.balance || 0)}
                    </option>
                    <option value="wallet_teestock">
                      Kas Operasional TeeStock (BCA Bisnis) - Saldo: {formatRupiah(multiUnitBalances?.teestock?.balance || 0)}
                    </option>
                    <option value="wallet_multigraph">
                      Kas Maklon MultiGraph (BCA Maklon) - Saldo: {formatRupiah(multiUnitBalances?.multigraph?.balance || 0)}
                    </option>
                    <option value="wallet_founder">
                      Dompet Ekuitas Founder (Injeksi Modal Pribadi Rizky)
                    </option>
                  </select>
                </div>

                {/* CFO Overdraft Alert */}
                {isOverdraftRisk && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Peringatan CFO Overdraft: </span>
                      Biaya pembelian aset ({formatRupiah(purchaseCost)}) melebihi saldo dompet terpilih ({formatRupiah(currentWalletBal)}). Saldo kas akan tercatat defisit jika transaksi ini tetap dibukukan.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 7. Catatan / Spesifikasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Catatan / Spesifikasi Mesin</label>
            <textarea
              rows={2}
              placeholder="cth: Suhu operasional 155°C, teflon sheet ganda, garansi 1 tahun"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end gap-2.5 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer min-h-[44px]"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all cursor-pointer min-h-[44px]"
            >
              Simpan Aset ke Neraca
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
