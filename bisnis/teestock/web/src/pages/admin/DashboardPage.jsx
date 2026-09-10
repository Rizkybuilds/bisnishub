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
  DollarSign,
  Wallet,
  Coins,
  Download,
  Boxes,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatRupiah } from '../../utils/formatters';
import { SIZES } from '../../constants/garments';

export function DashboardPage() {
  const { openNewOrderModal } = useOutletContext();
  const { catalog, orders, inventory, founderWealth, procurements } = useAdmin();

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
        <div className="bg-gradient-to-br from-ts-surface via-ts-surface to-ts-surfaceHover border-2 border-ts-mustard/40 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ts-mustard/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ts-borderDim pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-ts-mustard/20 text-ts-mustard border border-ts-mustard/40">
                  EXECUTIVE BALANCE SHEET
                </span>
                <span className="text-[10px] font-mono text-ts-muted">Live Valuation</span>
              </div>
              <h2 className="text-xl font-extrabold text-ts-krem tracking-wide mt-1">
                Neraca Harta &amp; Pertumbuhan Modal Founder
              </h2>
              <p className="text-xs text-ts-muted">
                Transparansi total: di mana uang modal Anda berada saat ini dan berapa pertumbuhan nilai bersih usaha.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to="/admin/buku-kas">
                <Button variant="secondary" size="sm">
                  <Wallet className="w-3.5 h-3.5 mr-1" /> Kelola Kas &amp; Modal
                </Button>
              </Link>
              <Link to="/admin/pengadaan">
                <Button variant="primary" size="sm">
                  <Boxes className="w-3.5 h-3.5 mr-1" /> + Belanja Bahan (BOM)
                </Button>
              </Link>
            </div>
          </div>

          {/* Main Equity & Total Wealth Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-ts-hitam/70 p-4 rounded-xl border border-ts-borderDim">
              <span className="text-[11px] text-ts-muted font-medium block">Total Modal Disetor Founder</span>
              <div className="font-mono font-extrabold text-2xl text-amber-400 mt-1">
                {formatRupiah(founderWealth.totalInjected)}
              </div>
              <div className="flex items-center justify-between text-[10px] text-ts-muted mt-1.5 pt-1.5 border-t border-ts-borderDim/40 font-mono">
                <span>Prive Ditarik: -{formatRupiah(founderWealth.totalPrive)}</span>
                <span className="text-ts-krem font-bold">Net: {formatRupiah(founderWealth.netFounderEquity)}</span>
              </div>
            </div>

            <div className="bg-ts-hitam/70 p-4 rounded-xl border border-ts-mustard/30 relative">
              <span className="text-[11px] text-ts-mustard font-bold uppercase tracking-wider block">Total Nilai Harta TeeStock</span>
              <div className="font-mono font-extrabold text-2xl text-ts-krem mt-1">
                {formatRupiah(founderWealth.totalBusinessWealth)}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1.5 pt-1.5 border-t border-ts-borderDim/40 font-mono flex items-center justify-between">
                <span>Pertumbuhan Modal (ROI):</span>
                <span className="font-bold text-xs">+{founderWealth.growthPercentage}% 🚀</span>
              </div>
            </div>

            <div className="bg-ts-hitam/70 p-4 rounded-xl border border-ts-borderDim">
              <span className="text-[11px] text-ts-muted font-medium block">Nilai Tambah Bersih (Net Growth)</span>
              <div className="font-mono font-extrabold text-2xl text-emerald-400 mt-1">
                +{formatRupiah(founderWealth.netWealthGrowth)}
              </div>
              <div className="text-[10px] text-ts-muted mt-1.5 pt-1.5 border-t border-ts-borderDim/40 font-mono">
                Total Aset dikurangi Modal Bersih
              </div>
            </div>
          </div>

          {/* Breakdown Wujud Harta (Where is the money right now?) */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-ts-muted uppercase tracking-wider flex items-center justify-between">
              <span>Di Mana Saja Uang Tersebut Berada Saat Ini? (Asset Allocation)</span>
              <span className="text-[10px] text-ts-teal font-mono">100% Kasat Mata</span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* 1. Kas Tunai & Bank */}
              <div className="bg-ts-surface p-3.5 rounded-xl border border-ts-borderDim space-y-1">
                <div className="flex items-center justify-between text-ts-muted text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-ts-teal">
                    <Building2 className="w-3.5 h-3.5" /> 1. Kas &amp; Bank
                  </span>
                  <span className="font-mono">{formatRupiah(founderWealth.netCashLiquidity)}</span>
                </div>
                <div className="font-mono font-bold text-base text-ts-krem">
                  {formatRupiah(founderWealth.netCashLiquidity)}
                </div>
                <p className="text-[10px] text-ts-muted font-mono">Saldo siap belanja bahan</p>
              </div>

              {/* 2. Kaos Polos NSA */}
              <div className="bg-ts-surface p-3.5 rounded-xl border border-ts-borderDim space-y-1">
                <div className="flex items-center justify-between text-ts-muted text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-ts-mustard">
                    <Shirt className="w-3.5 h-3.5" /> 2. Kaos Polos NSA
                  </span>
                  <span className="font-mono">{totalStock} pcs</span>
                </div>
                <div className="font-mono font-bold text-base text-ts-krem">
                  {formatRupiah(founderWealth.blankStockValue)}
                </div>
                <p className="text-[10px] text-ts-muted font-mono">Nilai aset Moving Average</p>
              </div>

              {/* 3. Sablon & Kemasan (BOM) */}
              <div className="bg-ts-surface p-3.5 rounded-xl border border-ts-borderDim space-y-1">
                <div className="flex items-center justify-between text-ts-muted text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-sky-400">
                    <ScrollText className="w-3.5 h-3.5" /> 3. DTF &amp; Kemasan
                  </span>
                  <span className="font-mono">{totalDtfSheets} DTF</span>
                </div>
                <div className="font-mono font-bold text-base text-ts-krem">
                  {formatRupiah(founderWealth.dtfStockValue + founderWealth.packagingStockValue)}
                </div>
                <p className="text-[10px] text-ts-muted font-mono">Film DTF + Polymailer + Stiker</p>
              </div>

              {/* 4. Mesin & Alat Kerja (CAPEX) */}
              <div className="bg-ts-surface p-3.5 rounded-xl border border-ts-borderDim space-y-1">
                <div className="flex items-center justify-between text-ts-muted text-[11px]">
                  <span className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <Flame className="w-3.5 h-3.5" /> 4. Mesin Press (CAPEX)
                  </span>
                  <span className="font-mono">In-House</span>
                </div>
                <div className="font-mono font-bold text-base text-ts-krem">
                  {formatRupiah(founderWealth.fixedAssetsValue)}
                </div>
                <p className="text-[10px] text-ts-muted font-mono">Heat Press High-Pressure</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center shrink-0">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Total SKU Aktif</div>
              <div className="font-mono text-2xl font-extrabold text-ts-krem mt-0.5">{catalog.length}</div>
              <div className="text-[10px] text-ts-green font-semibold">9 Series Desain</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Pesanan Diproses</div>
              <div className="font-mono text-2xl font-extrabold text-ts-krem mt-0.5">{activeOrders.length}</div>
              <div className="text-[10px] text-ts-mustard font-semibold">{pressOrders.length} Siap Press Heat</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-olive/20 text-ts-olive flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Stok Kaos NSA (Blanks)</div>
              <div className="font-mono text-2xl font-extrabold text-ts-krem mt-0.5">{totalStock} <span className="text-sm font-normal text-ts-muted">pcs</span></div>
              <div className="text-[10px] text-ts-teal font-semibold">⚡ {totalDtfSheets} Lembar Film DTF Ready</div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ts-green/20 text-ts-green flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-ts-muted font-bold">Realized Net Margin</div>
              <div className="font-mono text-2xl font-extrabold text-ts-green mt-0.5">{realizedMarginPct}%</div>
              <div className="text-[10px] text-ts-muted font-semibold">Setelah Biaya Fee & COGS</div>
            </div>
          </Card>
        </div>

        {/* CFO Financial Health Breakdown Panel */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ts-borderDim pb-3">
            <div>
              <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                <Wallet className="w-4 h-4 text-ts-green" />
                <span>Ringkasan Keuangan Riil (P&amp;L Multi-Channel)</span>
              </h3>
              <p className="text-xs text-ts-muted mt-0.5">
                Kalkulasi otomatis pendapatan kotor, potongan komisi platform, dan modal HPP bahan
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-ts-hitam border border-ts-borderDim text-ts-muted">
                Basis Data: <strong>{orders.length} Pesanan</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-ts-hitam/60 border border-ts-borderDim p-4 rounded-xl space-y-1">
              <div className="text-xs text-ts-muted font-bold">Total Omset Kotor</div>
              <div className="font-mono text-xl font-extrabold text-ts-krem">
                {formatRupiah(totalGrossRevenue)}
              </div>
              <div className="text-[10px] text-ts-muted">Nilai transaksi belanja pembeli</div>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-borderDim p-4 rounded-xl space-y-1">
              <div className="text-xs text-ts-muted font-bold">Potongan Fee E-Commerce</div>
              <div className="font-mono text-xl font-extrabold text-rose-400">
                -{formatRupiah(totalPlatformFees)}
              </div>
              <div className="text-[10px] text-rose-400/80">Shopee &amp; TikTok (Avg 8.5%)</div>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-borderDim p-4 rounded-xl space-y-1">
              <div className="text-xs text-ts-muted font-bold">Total COGS / Modal Bahan</div>
              <div className="font-mono text-xl font-extrabold text-amber-400">
                -{formatRupiah(totalCogs)}
              </div>
              <div className="text-[10px] text-amber-400/80">Kaos NSA + DTF + Packaging</div>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-green/40 p-4 rounded-xl space-y-1 bg-gradient-to-b from-ts-green/5 to-transparent">
              <div className="text-xs text-ts-green font-bold">Laba Bersih Realistis (Kas)</div>
              <div className="font-mono text-xl font-extrabold text-ts-green">
                +{formatRupiah(totalNetProfit)}
              </div>
              <div className="text-[10px] text-ts-green/80 font-bold">Margin Bersih: {realizedMarginPct}%</div>
            </div>
          </div>

          {/* Persediaan Lancar DTF Asset Valuation */}
          <div className="mt-4 pt-3 border-t border-ts-borderDim flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-ts-hitam/40 px-3.5 py-2.5 rounded-xl">
            <div className="flex items-center gap-2 text-ts-muted">
              <span className="w-2 h-2 rounded-full bg-ts-mustard inline-block"></span>
              <span><strong>Persediaan Film DTF Studio:</strong> {totalDtfSheets} lembar film siap press</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-mono text-ts-krem">
                Nilai Aset Stok Film: <strong className="text-ts-mustard font-bold">{formatRupiah(totalDtfAssetValue)}</strong>
              </div>
              <Link 
                to="/admin/inventory" 
                className="text-ts-teal hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
              >
                Cek Tab Film DTF &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Operations Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/kanban"
            className="p-5 bg-gradient-to-r from-ts-surface to-ts-surfaceHover border border-ts-border rounded-2xl flex items-center justify-between hover:border-ts-terracotta transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ts-krem group-hover:text-ts-terracotta transition-colors">
                  Antrean Heat Press ({pressOrders.length} Pesanan)
                </h4>
                <p className="text-xs text-ts-muted mt-0.5">SOP 155°C, 15 detik, kupas dingin, second press.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-ts-muted group-hover:text-ts-terracotta group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/gangsheet"
            className="p-5 bg-gradient-to-r from-ts-surface to-ts-surfaceHover border border-ts-border rounded-2xl flex items-center justify-between hover:border-ts-mustard transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-ts-krem group-hover:text-ts-mustard transition-colors">
                  Gang Sheet DTF Planner ({dtfOrders.length} Siap Cetak Roll)
                </h4>
                <p className="text-xs text-ts-muted mt-0.5">Kalkulasi meteran roll 60 cm untuk kirim ke vendor.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-ts-muted group-hover:text-ts-mustard group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-ts-mustard" /> Peringatan Stok Kaos Menipis (Threshold &le; 2 pcs)
            </h3>
            <Link to="/admin/inventory" className="text-xs text-ts-terracotta hover:underline font-semibold">
              Buka Matriks Stok &rarr;
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {lowStockItems.length === 0 ? (
              <span className="text-xs text-ts-green font-semibold">
                ✅ Seluruh kombinasi warna &amp; ukuran kaos polos NSA berada di atas batas aman.
              </span>
            ) : (
              lowStockItems.slice(0, 8).map((item, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-ts-hitam border border-ts-red/40 text-xs flex items-center gap-2"
                >
                  <span className="text-ts-krem/90 font-medium">
                    {item.col} ({item.sz})
                  </span>
                  <span className="font-mono font-bold text-ts-red">
                    {item.count} pcs
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock DTF Film Alerts */}
        {lowStockDtfFilms.length > 0 && (
          <div className="bg-ts-surface border border-ts-mustard/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                <Printer className="w-4 h-4 text-ts-mustard" /> Peringatan Stok Film DTF Menipis (&le; Batas Buffer Minimum)
              </h3>
              <Link to="/admin/gangsheet" className="text-xs text-ts-mustard hover:underline font-semibold">
                Buka Gang Sheet Planner &rarr;
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {lowStockDtfFilms.map((film, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-ts-hitam border border-ts-mustard/40 text-xs flex items-center gap-2"
                >
                  <span className="text-ts-krem/90 font-medium">
                    [{film.sku}] {film.name}
                  </span>
                  <span className="font-mono font-bold text-ts-mustard">
                    {film.ready} lembar (Min: {film.min})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders Table with Financial Visibility */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-ts-borderDim flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ts-krem">Pesanan Terbaru &amp; Margin Bersih</h3>
              <p className="text-xs text-ts-muted">Daftar transaksi multi-channel beserta net fee dan estimasi laba</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" icon={Download} onClick={handleExportCsv}>
                Unduh CSV (.csv)
              </Button>
              <Button size="sm" variant="primary" onClick={openNewOrderModal}>
                + Order Manual
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ts-hitam/60 border-b border-ts-border text-ts-muted font-bold tracking-wider uppercase">
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
              <tbody className="divide-y divide-ts-borderDim">
                {orders.slice(0, 8).map(order => {
                  const isMarketplace = order.channel === 'shopee' || order.channel === 'tiktok';
                  const fee = order.fee !== undefined ? order.fee : (isMarketplace ? Math.round((order.price || 0) * 0.085) : 0);
                  const hpp = (order.hpp || 64250) * (order.qty || 1);
                  const net = (order.price || 0) - fee - hpp;

                  return (
                    <tr key={order.id} className="hover:bg-ts-surfaceHover/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-ts-krem">
                        {order.id}
                        {order.trackingNo && (
                          <div className="text-[10px] text-ts-muted font-normal font-mono truncate max-w-[100px]">
                            {order.trackingNo}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={order.channel}>{(order.channel || 'DIRECT').toUpperCase()}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-ts-krem">{order.customer}</div>
                        <div className="text-[11px] text-ts-muted font-mono">{order.phone || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-ts-krem truncate max-w-[160px]">
                        {order.productName || order.sku}
                      </td>
                      <td className="py-3 px-4 text-ts-muted">
                        {order.garment} • {order.color} ({order.size}) x{order.qty}
                      </td>
                      <td className="py-3 px-4 font-bold text-ts-terracotta capitalize">
                        {order.status}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-rose-400">
                        -{formatRupiah(fee)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-ts-krem">
                        {formatRupiah(order.price)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-ts-green">
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
