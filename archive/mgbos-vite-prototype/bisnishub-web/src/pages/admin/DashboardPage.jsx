import React, { useState } from 'react';
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
  ScrollText,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '@bisnishub/shared/components/ui/Card';
import { Badge } from '@bisnishub/shared/components/ui/Badge';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { Modal } from '@bisnishub/shared/components/ui/Modal';
import { Input, Select } from '@bisnishub/shared/components/ui/Input';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { SIZES } from '@bisnishub/shared/constants/garments';
import { FounderBepSimulator } from '../../components/admin/FounderBepSimulator';
import { DailyStudioRoutine } from '../../components/admin/DailyStudioRoutine';
import { isProductBlank, getBlankPricing } from '@bisnishub/shared/constants/pricing';

export function DashboardPage() {
  const { openNewOrderModal } = useOutletContext();
  const { 
    catalog, 
    orders, 
    inventory, 
    founderWealth, 
    procurements, 
    businessValuation, 
    multiUnitBalances,
    recordCashTransaction,
    showToast
  } = useAdmin();

  const [channelTab, setChannelTab] = useState('all');

  // Modal State for Capital Injection / Prive
  const [isCapitalModalOpen, setIsCapitalModalOpen] = useState(false);
  const [capitalMode, setCapitalMode] = useState('injection'); // 'injection' | 'prive'
  const [capitalAmount, setCapitalAmount] = useState(1000000);
  const [capitalWallet, setCapitalWallet] = useState('wallet_teestock');
  const [capitalNotes, setCapitalNotes] = useState('');
  const [isRoutineOpen, setIsRoutineOpen] = useState(false);

  const handleOpenCapitalModal = (mode = 'injection') => {
    setCapitalMode(mode);
    setCapitalAmount(mode === 'injection' ? 1000000 : 500000);
    setCapitalWallet('wallet_teestock');
    setCapitalNotes(mode === 'injection' ? 'Suntik modal kerja operasional studio' : 'Penarikan prive founder');
    setIsCapitalModalOpen(true);
  };

  const handleSaveCapital = async (e) => {
    e.preventDefault();
    const amt = Number(capitalAmount);
    if (amt <= 0) {
      showToast("Nominal modal harus lebih dari 0", "error");
      return;
    }

    const isInjection = capitalMode === 'injection';
    const targetUnit = capitalWallet.replace('wallet_', '') || 'teestock';

    await recordCashTransaction({
      transactionNo: `TX-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().slice(0, 10),
      businessUnit: targetUnit,
      type: isInjection ? 'CAPITAL_INJECTION' : 'FOUNDER_PRIVE',
      category: isInjection ? 'capital_injection' : 'owner_prive',
      amount: amt,
      sourceWallet: isInjection ? 'wallet_founder' : capitalWallet,
      destinationWallet: isInjection ? capitalWallet : 'wallet_founder',
      description: capitalNotes.trim() || (isInjection ? 'Suntik modal kerja founder ke rekening bisnis' : 'Penarikan prive founder'),
      proofRef: `FOUNDER-${Date.now().toString().slice(-4)}`,
      settlementStatus: 'cleared'
    });

    showToast(
      isInjection
        ? `🎉 Modal ${formatRupiah(amt)} berhasil disuntikkan ke ${capitalWallet === 'wallet_teestock' ? 'Rekening TeeStock' : capitalWallet === 'wallet_multigraph' ? 'Rekening MultiGraph' : 'Kas Holding'}! Kas & Bank langsung bertambah.`
        : `💸 Prive ${formatRupiah(amt)} berhasil dicatat keluar ke rekening pribadi founder.`
    );
    setIsCapitalModalOpen(false);
  };

  // Helper: Dapatkan HPP per unit yang akurat untuk kaos grafis vs kaos polos
  const getOrderUnitHpp = (order) => {
    if (order.hpp !== undefined && order.hpp !== null && Number(order.hpp) > 0) {
      return Number(order.hpp);
    }
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      const itemsHpp = order.items.reduce((sum, it) => {
        const isBlank = isProductBlank(it);
        const itHpp = isBlank 
          ? getBlankPricing(it, it.color, order.tier || 'retail', it.size, it.qty).vendorCost
          : 64250;
        return sum + (itHpp * (Number(it.qty) || 1));
      }, 0);
      if (itemsHpp > 0) return Math.round(itemsHpp / Math.max(1, order.qty || 1));
    }
    const isBlank = isProductBlank(order);
    if (isBlank) {
      return getBlankPricing(order, order.color, order.tier || 'retail', order.size, order.qty).vendorCost;
    }
    return 64250;
  };

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
      "Total Bayar (Rp)",
      "Ongkir Kurir (Rp)",
      "Omset Produk (Rp)",
      "Fee Platform (Rp)",
      "HPP Bahan (Rp)",
      "Laba Bersih Produk (Rp)",
      "Status"
    ];

    const rows = orders.map(o => {
      const isMarketplace = o.channel === 'shopee' || o.channel === 'tiktok';
      const shipping = Number(o.shipping_fee || 0);
      const unique = Number(o.unique_code || o.uniqueCode || 0);
      const totalAmount = Number(o.price || o.total_amount || 0);
      const productRevenue = Number(o.subtotal) > 0 
        ? (Number(o.subtotal) - Number(o.discount || o.discount_amount || 0)) 
        : Math.max(0, totalAmount - shipping - unique);

      const fee = o.fee !== undefined ? o.fee : (isMarketplace ? Math.round(productRevenue * 0.085) : 0);
      const unitHpp = getOrderUnitHpp(o);
      const hpp = unitHpp * (o.qty || 1);
      const net = productRevenue - fee - hpp;

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
        totalAmount,
        shipping,
        productRevenue,
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

  // CFO Dynamic Financial Calculations (Strict Courier Pass-Through Isolation)
  const totalShippingCollected = orders.reduce((sum, o) => sum + Number(o.shipping_fee || 0), 0);
  const totalGrossCollected = orders.reduce((sum, o) => sum + Number(o.price || o.total_amount || 0), 0);

  // Omset Penjualan Bersih Produk Murni (Tanpa Ongkir Kurir & Kode Unik)
  const totalProductRevenue = orders.reduce((sum, o) => {
    const shipping = Number(o.shipping_fee || 0);
    const unique = Number(o.unique_code || o.uniqueCode || 0);
    const totalAmount = Number(o.price || o.total_amount || 0);
    const prodRev = Number(o.subtotal) > 0 
      ? (Number(o.subtotal) - Number(o.discount || o.discount_amount || 0)) 
      : Math.max(0, totalAmount - shipping - unique);
    return sum + prodRev;
  }, 0);

  const totalPlatformFees = orders.reduce((sum, o) => {
    if (o.fee !== undefined) return sum + o.fee;
    const isMarketplace = o.channel === 'shopee' || o.channel === 'tiktok';
    const shipping = Number(o.shipping_fee || 0);
    const unique = Number(o.unique_code || o.uniqueCode || 0);
    const totalAmount = Number(o.price || o.total_amount || 0);
    const prodRev = Number(o.subtotal) > 0 
      ? (Number(o.subtotal) - Number(o.discount || o.discount_amount || 0)) 
      : Math.max(0, totalAmount - shipping - unique);
    return sum + (isMarketplace ? Math.round(prodRev * 0.085) : 0);
  }, 0);

  const totalCogs = orders.reduce((sum, o) => {
    const unitHpp = getOrderUnitHpp(o);
    return sum + (unitHpp * (o.qty || 1));
  }, 0);

  // Laba Bersih Murni Produk (Eksklusif Ongkir Kurir)
  const totalNetProfit = totalProductRevenue - totalPlatformFees - totalCogs;
  const realizedMarginPct = totalProductRevenue > 0 
    ? ((totalNetProfit / totalProductRevenue) * 100).toFixed(1) 
    : 0;

  return (
    <div>
      <AdminTopbar
        title="Founder Command Center"
        subtitle="Visibilitas eksekutif neraca kekayaan bisnis, alokasi modal, dan operasional produksi"
        onNewOrder={openNewOrderModal}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* ⚡ EXECUTIVE QUICK ACTIONS RIBBON */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={openNewOrderModal}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white text-zinc-950 font-black hover:bg-zinc-200 transition-all flex items-center gap-2 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Order</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenCapitalModal('injection')}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-2 shrink-0 font-bold"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>+ Suntik Modal (Cash In)</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenCapitalModal('prive')}
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-2 shrink-0 font-medium"
          >
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            <span>Tarik Prive (Cash Out)</span>
          </button>
          <Link
            to="/pengadaan"
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-2 shrink-0 font-medium"
          >
            <Boxes className="w-4 h-4 text-zinc-400" />
            <span>PO Bahan (BOM)</span>
          </Link>
          <Link
            to="/kanban"
            className="px-4 py-2.5 min-h-[44px] rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-2 shrink-0 font-medium"
          >
            <Flame className="w-4 h-4 text-zinc-400" />
            <span>Antrean Press ({pressOrders.length})</span>
          </Link>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('bisnishub_open_cmd_palette'))}
            className="px-3.5 py-2.5 min-h-[44px] rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-dashed border-white/15 transition-all flex items-center gap-2 shrink-0 ml-auto"
          >
            <kbd className="text-[10px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-zinc-300">Ctrl+K</kbd>
            <span>Spotlight</span>
          </button>
        </div>

        {/* 🏛️ TIER 1: TIGA PILAR NERACA EKSEKUTIF (HERO BENTO) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 1. Kas & Likuiditas Bisnis */}
          <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-zinc-300" /> Likuiditas Kas Konsolidasi
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SIAP PAKAI
              </span>
            </div>

            <div>
              <div className="text-[11px] text-zinc-400">Total Kas &amp; Saldo Bank</div>
              <div className="font-mono font-black text-3xl text-white tracking-tight mt-0.5">
                {formatRupiah(founderWealth.netCashLiquidity)}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1.5 flex items-center gap-2 flex-wrap">
                <span>TeeStock: <strong className="text-white">{formatRupiah(multiUnitBalances.teestock?.balance || 0)}</strong></span>
                <span>•</span>
                <span>Holding: <strong className="text-white">{formatRupiah(multiUnitBalances.holding?.balance || 0)}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenCapitalModal('injection')}
                className="flex-1 py-2 px-3 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Suntik Modal</span>
              </button>
              <Link
                to="/buku-kas"
                className="py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs text-zinc-300 hover:text-white border border-white/10 transition-all text-center"
              >
                Buku Kas &rarr;
              </Link>
            </div>
          </div>

          {/* 2. Total Harta Bersih Bisnis (NAV Floor) */}
          <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-zinc-300" /> Nilai Buku Harta Fisik (NAV)
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                LANTAI DASAR
              </span>
            </div>

            <div>
              <div className="text-[11px] text-zinc-400">Total Harta Kasat Mata (Kas + Stok + Mesin)</div>
              <div className="font-mono font-black text-3xl text-white tracking-tight mt-0.5">
                {formatRupiah(founderWealth.totalBusinessWealth)}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1.5 flex items-center justify-between">
                <span>Modal Disetor: {formatRupiah(founderWealth.totalInjected)}</span>
                <span className="text-white font-bold">
                  Net Tambah: +{formatRupiah(founderWealth.netWealthGrowth)} ({founderWealth.growthPercentage}%)
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Prive Ditarik: -{formatRupiah(founderWealth.totalPrive)}</span>
              <span className="text-zinc-300">Ekuitas Net: {formatRupiah(founderWealth.netFounderEquity)}</span>
            </div>
          </div>

          {/* 3. Valuasi Wajar Holding (Fair Enterprise Value) */}
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/20 hover:border-white/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xl relative overflow-hidden transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-white" /> Valuasi Wajar Holding
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white text-zinc-950 shadow-sm">
                TERBOBOT
              </span>
            </div>

            <div>
              <div className="text-[11px] text-zinc-300">Estimasi Nilai Perusahaan (40% NAV + 40% SDE + 20% Omset)</div>
              <div className="font-mono font-black text-3xl text-white tracking-tight mt-0.5">
                {formatRupiah(businessValuation?.fairEnterpriseValuation || founderWealth.totalBusinessWealth)}
              </div>
              <div className="text-[10px] text-zinc-300 font-mono mt-1.5 flex items-center justify-between">
                <span>Multiple Nilai:</span>
                <span className="bg-white/10 px-2 py-0.5 rounded font-bold text-white border border-white/20">
                  +{businessValuation?.wealthGrowthRatio || '1.0'}x Modal
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-zinc-400">
              <span className="text-[11px]">Metode: Multiplier 2.8x Laba</span>
              <Link to="/buku-kas" className="text-white hover:underline text-xs font-bold inline-flex items-center gap-1">
                Detail Valuasi &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* 📦 TIER 2: 4 WUJUD HARTA KASAT MATA (BALANCE SHEET ASSETS) */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span>Alokasi 4 Wujud Harta Bisnis</span>
              <span className="text-[10px] text-zinc-500 font-normal">Real Balance Sheet</span>
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              Total: <strong className="text-white">{formatRupiah(founderWealth.totalBusinessWealth)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* 1. Kas & Bank */}
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/15 transition-all space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" /> 1. Kas &amp; Bank
                </span>
              </div>
              <div className="font-mono font-black text-lg text-white">
                {formatRupiah(founderWealth.netCashLiquidity)}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Saldo likuid di rekening</p>
            </div>

            {/* 2. Kaos Polos NSA */}
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/15 transition-all space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Shirt className="w-3.5 h-3.5 text-zinc-400" /> 2. Kaos Polos NSA
                </span>
                <span className="font-mono text-zinc-500">{totalStock} pcs</span>
              </div>
              <div className="font-mono font-black text-lg text-white">
                {formatRupiah(founderWealth.blankStockValue)}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Stok buffer garmen studio</p>
            </div>

            {/* 3. Sablon & Kemasan (BOM) */}
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/15 transition-all space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <ScrollText className="w-3.5 h-3.5 text-zinc-400" /> 3. DTF &amp; Kemasan
                </span>
                <span className="font-mono text-zinc-500">{totalDtfSheets} DTF</span>
              </div>
              <div className="font-mono font-black text-lg text-white">
                {formatRupiah(founderWealth.dtfStockValue + founderWealth.packagingStockValue)}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Film DTF + Polymailer + Stiker</p>
            </div>

            {/* 4. Mesin & Alat Kerja (CAPEX) */}
            <div className="bg-black/40 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/15 transition-all space-y-1">
              <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Flame className="w-3.5 h-3.5 text-zinc-400" /> 4. Mesin (CAPEX)
                </span>
                <span className="font-mono text-zinc-500">In-House</span>
              </div>
              <div className="font-mono font-black text-lg text-white">
                {formatRupiah(founderWealth.fixedAssetsValue)}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Mesin Heat Press 155°C</p>
            </div>
          </div>
        </div>

        {/* ⚙️ TIER 3: BALANCED OPERATIONAL & PERFORMANCE BENTO (2 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT: P&L REALISTIS & PROFIT METER (7 Cols) */}
          <div className="lg:col-span-7 bg-[#121215] border border-white/[0.08] rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight uppercase flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-white" />
                  <span>Kinerja Keuangan Riil (Multi-Channel P&amp;L)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Omset produk murni (eksklusif ongkir kurir) dikurangi potongan fee dan modal HPP bahan.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-zinc-400 shrink-0">
                {orders.length} Order
              </span>
            </div>

            {/* 4 P&L Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-black/40 p-3 rounded-xl border border-white/[0.06] space-y-0.5">
                <div className="text-[10px] text-zinc-400 font-mono">Omset Produk</div>
                <div className="font-mono font-black text-base text-white truncate">{formatRupiah(totalProductRevenue)}</div>
                {totalShippingCollected > 0 && (
                  <div className="text-[9px] text-amber-400/90 font-mono">+Ongkir {formatRupiah(totalShippingCollected)}</div>
                )}
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/[0.06] space-y-0.5">
                <div className="text-[10px] text-zinc-400 font-mono">Fee Platform</div>
                <div className="font-mono font-black text-base text-zinc-300 truncate">-{formatRupiah(totalPlatformFees)}</div>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/[0.06] space-y-0.5">
                <div className="text-[10px] text-zinc-400 font-mono">Modal COGS</div>
                <div className="font-mono font-black text-base text-zinc-300 truncate">-{formatRupiah(totalCogs)}</div>
              </div>
              <div className="bg-white/[0.06] p-3 rounded-xl border border-white/20 space-y-0.5">
                <div className="text-[10px] text-white font-mono font-bold">Laba Bersih Produk</div>
                <div className="font-mono font-black text-base text-white truncate">+{formatRupiah(totalNetProfit)}</div>
              </div>
            </div>

            {/* Profit Margin Meter Gauge */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Realized Net Margin:</span>
                <span className="font-mono font-black text-white text-sm">
                  {realizedMarginPct}% <span className="text-[10px] text-zinc-400 font-normal">(Batas Aman CFO &ge; 35%)</span>
                </span>
              </div>
              <div className="h-2.5 w-full bg-zinc-900 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-white transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.max(5, realizedMarginPct))}%` }} 
                  title={`Net Profit: ${realizedMarginPct}%`}
                />
              </div>
            </div>

            {/* Operational Bottlenecks Ribbon */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-1">
              <Link
                to="/kanban"
                className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">Antrean Press</div>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">{pressOrders.length} Order</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/inventory"
                className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">Stok Menipis</div>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">{lowStockItems.length} SKU</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/gangsheet"
                className="p-2.5 rounded-xl bg-black/30 border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-[10px] text-zinc-400 font-medium">Film DTF Ready</div>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">{totalDtfSheets} Film</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* RIGHT: TARGET GAJI FOUNDER & ACCORDION ROUTINE (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Target Gaji Simulator (1 - 10 Jt) */}
            <FounderBepSimulator orders={orders} />

            {/* Collapsible Studio Routine */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
              <button
                type="button"
                onClick={() => setIsRoutineOpen(!isRoutineOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-zinc-300" />
                  <div>
                    <h4 className="font-bold text-xs text-white">SOP Rutinitas Harian Studio (COO)</h4>
                    <p className="text-[10px] text-zinc-400">Batch 1: Pagi (Pre-flight), Batch 2: Siang (Press), Batch 3: Sore (Kirim)</p>
                  </div>
                </div>
                {isRoutineOpen ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </button>

              {isRoutineOpen && (
                <div className="p-4 border-t border-white/[0.08] bg-black/40 animate-in fade-in duration-200">
                  <DailyStudioRoutine />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 📋 TIER 4: PESANAN TERBARU & TRANSPARANSI FINANSIAL */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Pesanan Terbaru &amp; Margin Bersih</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Daftar transaksi multi-channel beserta net fee dan estimasi laba</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Unduh CSV</span>
              </button>
              <button
                type="button"
                onClick={openNewOrderModal}
                className="px-3.5 py-1.5 min-h-[36px] rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>+ Order Manual</span>
              </button>
            </div>
          </div>

          {/* Channel Filter Tabs */}
          <div className="px-4 sm:px-5 py-2.5 bg-black/40 border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Semua', count: orders.length },
              { id: 'shopee', label: 'Shopee', count: orders.filter(o => o.channel === 'shopee').length },
              { id: 'tiktok', label: 'TikTok', count: orders.filter(o => o.channel === 'tiktok').length },
              { id: 'direct', label: 'Direct WA', count: orders.filter(o => !o.channel || o.channel === 'direct' || o.channel === 'wa' || o.channel === 'manual').length },
              { id: 'web', label: 'Web Store', count: orders.filter(o => o.channel === 'web').length },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setChannelTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                  channelTab === tab.id
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  channelTab === tab.id ? 'bg-zinc-950/10 text-zinc-950 font-bold' : 'bg-white/10 text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
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
                {orders
                  .filter(o => {
                    if (channelTab === 'all') return true;
                    if (channelTab === 'direct') return !o.channel || o.channel === 'direct' || o.channel === 'wa' || o.channel === 'manual';
                    return o.channel === channelTab;
                  })
                  .slice(0, 10)
                  .map(order => {
                    const isMarketplace = order.channel === 'shopee' || order.channel === 'tiktok';
                    const shipping = Number(order.shipping_fee || 0);
                    const unique = Number(order.unique_code || order.uniqueCode || 0);
                    const totalAmount = Number(order.price || order.total_amount || 0);
                    const productRevenue = Number(order.subtotal) > 0 
                      ? (Number(order.subtotal) - Number(order.discount || order.discount_amount || 0)) 
                      : Math.max(0, totalAmount - shipping - unique);

                    const fee = order.fee !== undefined ? order.fee : (isMarketplace ? Math.round(productRevenue * 0.085) : 0);
                    const unitHpp = getOrderUnitHpp(order);
                    const hpp = unitHpp * (order.qty || 1);
                    const net = productRevenue - fee - hpp;

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
                          <div>{formatRupiah(totalAmount)}</div>
                          {shipping > 0 && (
                            <div className="text-[9px] text-amber-400 font-normal font-mono">
                              +Ongkir {formatRupiah(shipping)}
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-bold ${net >= 0 ? 'text-white' : 'text-rose-400'}`}>
                          <div>{net >= 0 ? `+${formatRupiah(net)}` : formatRupiah(net)}</div>
                          <div className="text-[9px] text-zinc-500 font-normal font-mono">
                            ({productRevenue > 0 ? ((net / productRevenue) * 100).toFixed(0) : 0}% Margin)
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 💵 MODAL SUNTIK MODAL / PRIVE FOUNDER */}
      <Modal
        isOpen={isCapitalModalOpen}
        onClose={() => setIsCapitalModalOpen(false)}
        title={capitalMode === 'injection' ? "Suntik Modal Pribadi (Capital Injection)" : "Tarik Prive Pribadi (Owner Prive)"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveCapital} className="space-y-4">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/50 border border-white/10">
            <button
              type="button"
              onClick={() => setCapitalMode('injection')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                capitalMode === 'injection'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              + Suntik Modal (Cash In)
            </button>
            <button
              type="button"
              onClick={() => setCapitalMode('prive')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                capitalMode === 'prive'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              - Tarik Prive (Cash Out)
            </button>
          </div>

          {/* Amount Input with Quick Presets */}
          <div className="space-y-2">
            <Input
              label="Nominal Transaksi (Rp)"
              type="number"
              min="10000"
              value={capitalAmount}
              onChange={(e) => setCapitalAmount(Number(e.target.value))}
              required
            />
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
              {[500000, 1000000, 2500000, 5000000, 10000000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCapitalAmount(val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 ${
                    capitalAmount === val
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
                  }`}
                >
                  {val >= 1000000 ? `${val / 1000000} Jt` : `${val / 1000}k`}
                </button>
              ))}
            </div>
          </div>

          {/* Destination / Source Wallet */}
          <Select
            label={capitalMode === 'injection' ? "Masuk ke Rekening Bisnis:" : "Ditarik dari Rekening Bisnis:"}
            value={capitalWallet}
            onChange={(e) => setCapitalWallet(e.target.value)}
          >
            <option value="wallet_teestock">TeeStock (BCA / Mandiri Bisnis)</option>
            <option value="wallet_multigraph">MultiGraph Holding B2B</option>
            <option value="wallet_holding">Kas Holding / Induk</option>
          </Select>

          {/* Notes */}
          <Input
            label="Catatan / Keterangan"
            placeholder="Contoh: Tambahan modal belanja bahan kaos NSA"
            value={capitalNotes}
            onChange={(e) => setCapitalNotes(e.target.value)}
          />

          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400 space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-300">Dampak Langsung ke Neraca:</div>
            <div>
              • {capitalMode === 'injection' ? 'Kas & Bank bertambah' : 'Kas & Bank berkurang'} sebesar <strong className="text-white font-mono">{formatRupiah(capitalAmount)}</strong>
            </div>
            <div>
              • {capitalMode === 'injection' ? 'Total Modal Disetor bertambah' : 'Total Prive Founder bertambah'} di buku kas.
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
            <Button type="button" variant="secondary" onClick={() => setIsCapitalModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="bg-white text-zinc-950 font-bold hover:bg-zinc-200">
              {capitalMode === 'injection' ? "Simpan Suntikan Modal" : "Simpan Penarikan Prive"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
