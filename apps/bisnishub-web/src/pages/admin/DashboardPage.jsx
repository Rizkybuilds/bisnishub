import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Shirt, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRight,
  Flame, 
  Printer,
  Wallet,
  Download,
  Boxes,
  Building2,
  ScrollText
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatRupiah } from '../../utils/formatters';
import { SIZES } from '../../constants/garments';
import { FounderBepSimulator } from '../../components/admin/FounderBepSimulator';
import { DailyStudioRoutine } from '../../components/admin/DailyStudioRoutine';

export function DashboardPage() {
  const { openNewOrderModal } = useOutletContext();
  const { catalog, orders, inventory, founderWealth, procurements, businessValuation, multiUnitBalances } = useAdmin();

  // CSV Export Handler
  const handleExportCsv = () => {
    if (orders.length === 0) {
      alert("Belum ada data transaksi untuk diexport");
      return;
    }

    const headers = [
      "No. Order",
      "Tanggal",
      "Channel",
      "Nama Pembeli",
      "WhatsApp",
      "No. Resi",
      "SKU",
      "Nama Produk",
      "Model Kaos",
      "Warna",
      "Ukuran",
      "Qty",
      "Omset Kotor (Rp)",
      "Fee Platform (Rp)",
      "HPP Bahan (Rp)",
      "Laba Bersih (Rp)",
      "Status"
    ];

    const rows = orders.map(o => {
      const isMarketplace = o.channel === 'shopee' || o.channel === 'tiktok';
      const fee = o.fee !== undefined ? o.fee : (isMarketplace ? Math.round((o.price || 0) * 0.085) : 0);
      const hpp = (o.hpp || 64250) * (o.qty || 1);
      const net = (o.price || 0) - fee - hpp;

      return [
        `"${o.id || ''}"`,
        `"${o.date || ''}"`,
        `"${(o.channel || 'DIRECT').toUpperCase()}"`,
        `"${(o.customer || '').replace(/"/g, '""')}"`,
        `"${o.phone || ''}"`,
        `"${o.trackingNo || ''}"`,
        `"${o.sku || ''}"`,
        `"${(o.productName || '').replace(/"/g, '""')}"`,
        `"${o.garment || ''}"`,
        `"${o.color || ''}"`,
        `"${o.size || ''}"`,
        o.qty || 1,
        o.price || 0,
        fee,
        hpp,
        net,
        `"${o.status || ''}"`
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Transaksi_TeeStock_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeOrders = orders.filter(o => o.status !== 'shipped');
  const dtfOrders = orders.filter(o => o.status === 'dtf');
  const pressOrders = orders.filter(o => o.status === 'press');

  // Calculate total physical stock (blanks)
  let totalStock = 0;
  const lowStockItems = [];

  Object.entries(inventory).forEach(([gKey, colData]) => {
    if (gKey === 'supplies' || gKey === 'dtf_films') return;
    Object.entries(colData || {}).forEach(([col, szData]) => {
      SIZES.forEach(sz => {
        const count = szData[sz] || 0;
        totalStock += count;
        if (count <= 2) {
          lowStockItems.push({ gKey, col, sz, count });
        }
      });
    });
  });

  // Calculate DTF films stock & asset valuation
  let totalDtfSheets = 0;
  let totalDtfAssetValue = 0;
  const lowStockDtfFilms = [];

  if (inventory.dtf_films) {
    Object.entries(inventory.dtf_films).forEach(([sku, film]) => {
      const ready = Number(film.ready) || 0;
      const cost = Number(film.unitCost) || 12000;
      const min = Number(film.min) || 2;
      totalDtfSheets += ready;
      totalDtfAssetValue += ready * cost;
      if (ready <= min) {
        lowStockDtfFilms.push({ sku, ...film });
      }
    });
  }

  // CFO Dynamic Financial Calculations
  const totalGrossRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);
  const totalPlatformFees = orders.reduce((sum, o) => {
    if (o.fee !== undefined) return sum + o.fee;
    const isMarketplace = o.channel === 'shopee' || o.channel === 'tiktok';
    return sum + (isMarketplace ? Math.round((o.price || 0) * 0.085) : 0);
  }, 0);

  const totalCogs = orders.reduce((sum, o) => {
    const unitHpp = o.hpp || 64250;
    return sum + (unitHpp * (o.qty || 1));
  }, 0);

  const totalNetProfit = totalGrossRevenue - totalPlatformFees - totalCogs;
  const realizedMarginPct = totalGrossRevenue > 0 
    ? ((totalNetProfit / totalGrossRevenue) * 100).toFixed(1) 
    : 0;

  return (
    <div>
      <AdminTopbar
        title="Founder Command Center"
        subtitle="Visibilitas eksekutif neraca kekayaan bisnis, alokasi modal, dan operasional produksi"
        onNewOrder={openNewOrderModal}
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* 🏛️ FOUNDER'S REAL-TIME BALANCE SHEET (NERACA KEKAYAAN BISNIS) */}
        <div className="bg-[#0C0C0F] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Monochrome Spotlight */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/10 text-white border border-white/15">
                  HOLDING ENTERPRISE VALUATION
                </span>
                <span className="text-[10px] font-mono text-zinc-400">MultiGraph Holding</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1.5">
                Valuasi Ekuitas &amp; Pertumbuhan Bisnis Founder
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Kombinasi nilai aset kasat mata (NAV 40%), kelipatan laba bersih (SDE 2.8x 40%), dan skala omset disetahunkan (20%).
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to="/buku-kas">
                <Button variant="secondary" size="sm" className="bg-white/5 hover:bg-white/10 border-white/15 text-white font-semibold rounded-xl">
                  <TrendingUp className="w-3.5 h-3.5 mr-1 text-white" /> Analisis Valuasi &amp; Multiple
                </Button>
              </Link>
              <Link to="/pengadaan">
                <Button variant="primary" size="sm" className="bg-white text-zinc-950 hover:bg-zinc-200 font-bold shadow-sm rounded-xl">
                  <Boxes className="w-3.5 h-3.5 mr-1" /> + Belanja Bahan (BOM)
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Equity & Total Wealth Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div className="bg-[#141418] p-5 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all">
              <span className="text-[11px] text-zinc-400 font-medium block">Total Modal Disetor Founder</span>
              <div className="font-mono font-black text-2xl text-white mt-1.5">
                {formatRupiah(founderWealth.totalInjected)}
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2 pt-2 border-t border-white/[0.06] font-mono">
                <span>Prive Ditarik: -{formatRupiah(founderWealth.totalPrive)}</span>
                <span className="text-white font-bold">Net: {formatRupiah(founderWealth.netFounderEquity)}</span>
              </div>
            </div>

            <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-5 rounded-xl border border-white/30 shadow-lg shadow-white/[0.02] relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white font-mono font-bold uppercase tracking-wider block">Valuasi Wajar Holding (Fair Enterprise Value)</span>
                <span className="text-[9px] font-mono bg-white text-black font-bold px-1.5 py-0.5 rounded">TERBOBOT</span>
              </div>
              <div className="font-mono font-black text-3xl text-white mt-1.5 tracking-tight">
                {formatRupiah(businessValuation?.fairEnterpriseValuation || founderWealth.totalBusinessWealth)}
              </div>
              <div className="text-[10px] text-zinc-300 mt-2 pt-2 border-t border-white/15 font-mono flex items-center justify-between">
                <span>Multiple Ekuitas:</span>
                <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/20">+{businessValuation?.wealthGrowthRatio || '1.0'}x Modal (+{businessValuation?.wealthGrowthPercent || '0.0'}%)</span>
              </div>
            </div>

            <div className="bg-[#141418] p-5 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all">
              <span className="text-[11px] text-zinc-400 font-medium block">Nilai Buku Riil (NAV Floor Value)</span>
              <div className="font-mono font-black text-2xl text-white mt-1.5">
                {formatRupiah(businessValuation?.totalBookValueNAV || founderWealth.totalBusinessWealth)}
              </div>
              <div className="text-[10px] text-zinc-400 mt-2 pt-2 border-t border-white/[0.06] font-mono flex items-center justify-between">
                <span>Nilai Tambah Bersih:</span>
                <span className="text-white font-bold">+{formatRupiah(businessValuation?.totalWealthGrowth || founderWealth.netWealthGrowth)}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Wujud Harta (Asset Allocation) */}
          <div className="space-y-3 pt-2 relative z-10">
            <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Alokasi Modal Riil Holding (100% Kasat Mata)</span>
              <span className="text-[10px] text-zinc-500 font-mono">Real Balance Sheet</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* 1. Kas Tunai & Bank */}
              <div className="bg-[#141418] p-4 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" /> 1. Kas &amp; Bank
                  </span>
                  <span className="font-mono text-zinc-500">{formatRupiah(founderWealth.netCashLiquidity)}</span>
                </div>
                <div className="font-mono font-black text-base text-white">
                  {formatRupiah(founderWealth.netCashLiquidity)}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">Saldo likuid di rekening</p>
              </div>

              {/* 2. Kaos Polos NSA */}
              <div className="bg-[#141418] p-4 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Shirt className="w-3.5 h-3.5 text-zinc-400" /> 2. Kaos Polos NSA
                  </span>
                  <span className="font-mono text-zinc-500">{totalStock} pcs</span>
                </div>
                <div className="font-mono font-black text-base text-white">
                  {formatRupiah(founderWealth.blankStockValue)}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">Stok buffer garmen studio</p>
              </div>

              {/* 3. Sablon & Kemasan (BOM) */}
              <div className="bg-[#141418] p-4 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <ScrollText className="w-3.5 h-3.5 text-zinc-400" /> 3. DTF &amp; Kemasan
                  </span>
                  <span className="font-mono text-zinc-500">{totalDtfSheets} DTF</span>
                </div>
                <div className="font-mono font-black text-base text-white">
                  {formatRupiah(founderWealth.dtfStockValue + founderWealth.packagingStockValue)}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">Film DTF + Polymailer + Stiker</p>
              </div>

              {/* 4. Mesin & Alat Kerja (CAPEX) */}
              <div className="bg-[#141418] p-4 rounded-xl border border-white/[0.08] hover:border-white/20 transition-all space-y-1">
                <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <Flame className="w-3.5 h-3.5 text-zinc-400" /> 4. Mesin (CAPEX)
                  </span>
                  <span className="font-mono text-zinc-500">In-House</span>
                </div>
                <div className="font-mono font-black text-base text-white">
                  {formatRupiah(founderWealth.fixedAssetsValue)}
                </div>
                <p className="text-[10px] text-zinc-500 font-mono">Mesin Heat Press 155°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🎯 CFO Intelligence: Simulator Target Gaji & BEP Harian Founder */}
        <FounderBepSimulator orders={orders} />

        {/* ⚙️ COO Workflow: SOP Rutinitas Studio & Batching Time-Block */}
        <DailyStudioRoutine />

        {/* KPI Cards (Monochrome Bento Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4 bg-[#121215] border-white/[0.08] hover:border-white/20">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <div className="text-zinc-400 font-mono font-bold uppercase tracking-wider text-[10px]">Total SKU Aktif</div>
              <div className="font-mono text-2xl font-black text-white mt-0.5">{catalog.length}</div>
              <div className="text-[10px] text-zinc-400 font-mono font-medium">9 Series Desain</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-[#121215] border-white/[0.08] hover:border-white/20">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-zinc-400 font-mono font-bold uppercase tracking-wider text-[10px]">Pesanan Diproses</div>
              <div className="font-mono text-2xl font-black text-white mt-0.5">{activeOrders.length}</div>
              <div className="text-[10px] text-zinc-300 font-mono font-medium">{pressOrders.length} Siap Press Heat</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-[#121215] border-white/[0.08] hover:border-white/20">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-zinc-400 font-mono font-bold uppercase tracking-wider text-[10px]">Stok Kaos NSA</div>
              <div className="font-mono text-2xl font-black text-white mt-0.5">{totalStock} <span className="text-sm font-normal text-zinc-500">pcs</span></div>
              <div className="text-[10px] text-zinc-400 font-mono font-medium">{totalDtfSheets} Film DTF Ready</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4 bg-[#121215] border-white/[0.08] hover:border-white/20">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-zinc-400 font-mono font-bold uppercase tracking-wider text-[10px]">Realized Net Margin</div>
              <div className="font-mono text-2xl font-black text-white mt-0.5">{realizedMarginPct}%</div>
              <div className="text-[10px] text-zinc-400 font-mono font-medium">Batas Aman CFO &ge; 35%</div>
            </div>
          </Card>
        </div>

        {/* CFO Financial Health Breakdown Panel */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-white" />
                <span>Ringkasan Keuangan Riil (P&amp;L Multi-Channel)</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Kalkulasi otomatis pendapatan kotor, potongan komisi platform, dan modal HPP bahan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-zinc-400">
                Basis Data: <strong className="text-white">{orders.length} Pesanan</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black/50 border border-white/[0.08] p-4 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400 font-mono font-medium">Total Omset Kotor</div>
              <div className="font-mono text-xl font-black text-white">
                {formatRupiah(totalGrossRevenue)}
              </div>
              <div className="text-[10px] text-zinc-500">Nilai transaksi pembeli</div>
            </div>

            <div className="bg-black/50 border border-white/[0.08] p-4 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400 font-mono font-medium">Fee E-Commerce / Gateway</div>
              <div className="font-mono text-xl font-black text-zinc-300">
                -{formatRupiah(totalPlatformFees)}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">MDR QRIS / Fee Marketplace</div>
            </div>

            <div className="bg-black/50 border border-white/[0.08] p-4 rounded-xl space-y-1">
              <div className="text-xs text-zinc-400 font-mono font-medium">Total COGS / Modal Bahan</div>
              <div className="font-mono text-xl font-black text-zinc-300">
                -{formatRupiah(totalCogs)}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">Kaos NSA + DTF + Kemasan</div>
            </div>

            <div className="bg-white/[0.05] border border-white/25 p-4 rounded-xl space-y-1">
              <div className="text-xs text-white font-mono font-bold">Laba Bersih Realistis (Kas)</div>
              <div className="font-mono text-xl font-black text-white">
                +{formatRupiah(totalNetProfit)}
              </div>
              <div className="text-[10px] text-zinc-300 font-mono font-bold">Margin Bersih: {realizedMarginPct}%</div>
            </div>
          </div>

          {/* Persediaan Lancar DTF Asset Valuation */}
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-black/40 px-4 py-3 rounded-xl">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
              <span><strong>Persediaan Film DTF Studio:</strong> {totalDtfSheets} lembar film siap press</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-mono text-white">
                Nilai Aset Stok Film: <strong className="text-white font-bold">{formatRupiah(totalDtfAssetValue)}</strong>
              </div>
              <Link 
                to="/inventory" 
                className="text-white hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
              >
                Cek Tab Film DTF &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Operations Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/kanban"
            className="p-5 bg-[#121215] border border-white/[0.08] hover:border-white/30 rounded-2xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-white transition-colors">
                  Antrean Heat Press ({pressOrders.length} Pesanan)
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">SOP 155°C, 15 detik, kupas dingin, second press.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/gangsheet"
            className="p-5 bg-[#121215] border border-white/[0.08] hover:border-white/30 rounded-2xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white group-hover:text-white transition-colors">
                  Kalkulator Gang Sheet Roll 58cm
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">Tata letak meteran A3, A4, A6 &amp; hemat biaya cetak.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-zinc-400" /> Peringatan Stok Kaos Menipis (Threshold &le; 2 pcs)
            </h3>
            <Link to="/admin/inventory" className="text-xs text-zinc-400 hover:text-white transition-colors font-medium">
              Buka Matriks Stok &rarr;
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {lowStockItems.length === 0 ? (
              <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Seluruh kombinasi warna &amp; ukuran kaos polos NSA berada di atas batas aman.
              </span>
            ) : (
              lowStockItems.slice(0, 8).map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs flex items-center gap-2"
                >
                  <span className="text-zinc-300 font-medium">
                    {item.col} ({item.sz})
                  </span>
                  <span className="font-mono font-bold text-white">
                    {item.count} pcs
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock DTF Film Alerts */}
        {lowStockDtfFilms.length > 0 && (
          <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-zinc-400" /> Peringatan Stok Film DTF Menipis (&le; Batas Buffer Minimum)
              </h3>
              <Link to="/admin/gangsheet" className="text-xs text-zinc-400 hover:text-white transition-colors font-medium">
                Buka Gang Sheet Planner &rarr;
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {lowStockDtfFilms.map((film, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/15 text-xs flex items-center gap-2"
                >
                  <span className="text-zinc-300 font-medium">
                    [{film.sku}] {film.name}
                  </span>
                  <span className="font-mono font-bold text-white">
                    {film.ready} lembar (Min: {film.min})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Table with Financial Visibility */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Pesanan Terbaru &amp; Margin Bersih</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Daftar transaksi multi-channel beserta net fee dan estimasi laba</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh CSV</span>
              </button>
              <button
                onClick={openNewOrderModal}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>+ Order Manual</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 font-bold tracking-wider uppercase text-[10px]">
                  <th className="py-3 px-4">No. Order</th>
                  <th className="py-3 px-4">Kanal</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Spesifikasi</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Potongan Fee</th>
                  <th className="py-3 px-4 text-right">Total Transaksi</th>
                  <th className="py-3 px-4 text-right">Laba Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {orders.slice(0, 8).map(order => {
                  const isMarketplace = order.channel === 'shopee' || order.channel === 'tiktok';
                  const fee = order.fee !== undefined ? order.fee : (isMarketplace ? Math.round((order.price || 0) * 0.085) : 0);
                  const hpp = (order.hpp || 64250) * (order.qty || 1);
                  const net = (order.price || 0) - fee - hpp;

                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {order.id}
                        {order.trackingNo && (
                          <div className="text-[10px] text-zinc-500 font-normal font-mono truncate max-w-[100px]">
                            {order.trackingNo}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/[0.08] border border-white/10 text-zinc-200 uppercase">
                          {order.channel || 'DIRECT'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{order.customer}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{order.phone || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-200 truncate max-w-[160px]">
                        {order.productName || order.sku}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {order.garment} • {order.color} ({order.size}) x{order.qty}
                      </td>
                      <td className="py-3 px-4 font-semibold text-zinc-300 capitalize">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-zinc-400">
                        -{formatRupiah(fee)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        {formatRupiah(order.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-white">
                        +{formatRupiah(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
