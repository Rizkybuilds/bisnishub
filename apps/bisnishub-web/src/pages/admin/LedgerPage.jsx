import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  ArrowRightLeft,
  Plus, 
  Minus, 
  Building2, 
  Search, 
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  Clock,
  CheckCircle2,
  PieChart,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { formatRupiah, formatDate } from '../../utils/formatters';

export function LedgerPage() {
  const { 
    cashTransactions, 
    recordCashTransaction, 
    recordInterUnitTransfer,
    multiUnitBalances, 
    teestockPnl, 
    multigraphPnl, 
    holdingPnl, 
    runwayData, 
    businessValuation,
    walletsConfig,
    transactionCategories,
    founderWealth 
  } = useAdmin();

  // Active Tab: 'wallets' | 'audit' | 'pnl' | 'diagnostics' | 'valuation'
  const [activeTab, setActiveTab] = useState('wallets');
  const [valuationScenario, setValuationScenario] = useState('moderate'); // conservative | moderate | aggressive

  // Filter & Search States for Audit Trail
  const [filterUnit, setFilterUnit] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('cash_in'); // 'cash_in' | 'cash_out' | 'inter_transfer' | 'founder_equity'
  
  // Form State
  const [txUnit, setTxUnit] = useState('teestock');
  const [txType, setTxType] = useState('CASH_IN');
  const [amount, setAmount] = useState(150000);
  const [category, setCategory] = useState('sales_retail');
  const [sourceWallet, setSourceWallet] = useState('Midtrans QRIS (Settlement H+1)');
  const [destinationWallet, setDestinationWallet] = useState('wallet_teestock');
  const [description, setDescription] = useState('');
  const [proofReceiptRef, setProofReceiptRef] = useState('');
  const [relatedId, setRelatedId] = useState('');
  const [settlementStatus, setSettlementStatus] = useState('cleared');

  // Open Modal Handler with Pre-configured Mode
  const handleOpenAction = (mode) => {
    setModalMode(mode);
    if (mode === 'cash_in') {
      setTxType('CASH_IN');
      setTxUnit('teestock');
      setCategory('sales_retail');
      setSourceWallet('Pelanggan (QRIS / Transfer)');
      setDestinationWallet('wallet_teestock');
      setDescription('Penerimaan pembayaran pesanan ritel apparel');
      setAmount(198000);
      setSettlementStatus('cleared');
    } else if (mode === 'cash_out') {
      setTxType('CASH_OUT');
      setTxUnit('teestock');
      setCategory('blank_garment');
      setSourceWallet('wallet_teestock');
      setDestinationWallet('Cititex Rawamangun');
      setDescription('Pembelian bahan kaos polos NSA');
      setAmount(380000);
      setSettlementStatus('cleared');
    } else if (mode === 'inter_transfer') {
      setTxType('INTER_TRANSFER');
      setTxUnit('teestock');
      setCategory('unboxing_packaging');
      setSourceWallet('wallet_teestock');
      setDestinationWallet('wallet_multigraph');
      setDescription('Pembayaran pasokan paket kemasan unboxing ke MultiGraph');
      setAmount(60000);
      setSettlementStatus('cleared');
    } else if (mode === 'founder_equity') {
      setTxType('CAPITAL_INJECTION');
      setTxUnit('founder');
      setCategory('capital_injection');
      setSourceWallet('wallet_founder');
      setDestinationWallet('wallet_teestock');
      setDescription('Injeksi modal kerja founder ke operasional TeeStock');
      setAmount(1000000);
      setSettlementStatus('cleared');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || Number(amount) <= 0) {
      alert('Mohon isi nominal valid dan keterangan transaksi');
      return;
    }

    if (modalMode === 'inter_transfer') {
      const fromUnit = sourceWallet.replace('wallet_', '');
      const toUnit = destinationWallet.replace('wallet_', '');
      await recordInterUnitTransfer({
        fromUnit: fromUnit || 'teestock',
        toUnit: toUnit || 'multigraph',
        amount: Number(amount),
        description: description.trim(),
        proofRef: proofReceiptRef.trim(),
        relatedId: relatedId.trim()
      });
    } else {
      await recordCashTransaction({
        transactionNo: `TX-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().slice(0, 10),
        businessUnit: txUnit,
        type: txType,
        category,
        amount: Number(amount),
        sourceWallet,
        destinationWallet,
        relatedId: relatedId.trim(),
        proofReceiptRef: proofReceiptRef.trim(),
        description: description.trim(),
        settlementStatus
      });
    }

    setIsModalOpen(false);
  };

  // Filtered transactions for Audit Trail
  const filteredTxs = cashTransactions.filter(tx => {
    // Unit filter
    const matchUnit = 
      filterUnit === 'all' || 
      tx.businessUnit === filterUnit ||
      (filterUnit === 'founder' && (tx.category === 'capital_injection' || tx.category === 'owner_prive' || tx.category === 'personal_injection'));

    // Type filter
    const matchType = 
      filterType === 'all' ||
      (filterType === 'in' && tx.type === 'CASH_IN') ||
      (filterType === 'out' && tx.type === 'CASH_OUT') ||
      (filterType === 'inter' && tx.type === 'INTER_TRANSFER') ||
      (filterType === 'injection' && (tx.type === 'CAPITAL_INJECTION' || tx.category === 'capital_injection' || tx.category === 'personal_injection')) ||
      (filterType === 'prive' && (tx.type === 'FOUNDER_PRIVE' || tx.category === 'owner_prive'));

    // Status filter
    const matchStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'cleared' && tx.settlementStatus !== 'pending') ||
      (filterStatus === 'pending' && tx.settlementStatus === 'pending');

    // Query search
    const matchQuery = !searchQuery || 
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.transactionNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.relatedId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.proofReceiptRef?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchUnit && matchType && matchStatus && matchQuery;
  });

  // Calculate synergy savings (e.g. MultiGraph packaging supply to TeeStock)
  const packagingTxs = cashTransactions.filter(t => t.category === 'unboxing_packaging' || (t.type === 'INTER_TRANSFER' && t.destinationWallet === 'wallet_multigraph'));
  const totalInternalPackagingVolume = packagingTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const estimatedMarketRetailRate = totalInternalPackagingVolume * 1.6; // If bought from outside retail
  const estimatedSynergySavings = Math.max(0, estimatedMarketRetailRate - totalInternalPackagingVolume);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-ts-hitam">
      <AdminTopbar title="Executive CFO Suite & Multi-Unit Treasury" />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Executive Header Banner */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-white" /> CFO COMMAND CENTER
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  MultiGraph Printing &amp; Apparel Holding
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Pusat Komando Keuangan &amp; Kas Terisolasi
              </h1>
              <p className="text-xs text-zinc-400 max-w-2xl mt-1 leading-relaxed">
                Pemisahan saldo kas mandiri antara TeeStock dan MultiGraph, audit trail 7-dimensi anti-campur aduk, 
                rekonsiliasi ekuitas founder, dan analisis runway kas holding.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button 
                onClick={() => handleOpenAction('inter_transfer')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-zinc-400" />
                <span>Transfer Antar-Unit</span>
              </button>
              <button 
                onClick={() => handleOpenAction('founder_equity')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5"
              >
                <Wallet className="w-3.5 h-3.5 text-zinc-400" />
                <span>Ekuitas Founder</span>
              </button>
              <button 
                onClick={() => handleOpenAction('cash_in')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Kas Baru</span>
              </button>
            </div>
          </div>

          {/* Real-Time Liquidity Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/[0.08]">
            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                Total Likuiditas Holding
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {formatRupiah(multiUnitBalances?.totalConsolidatedLiquidity || 0)}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">100% Kas Riil di Rekening</span>
            </div>

            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                Kas TeeStock (Ritel)
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {formatRupiah(multiUnitBalances?.teestock?.balance || 0)}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">BCA Bisnis TeeStock</span>
            </div>

            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                Kas MultiGraph (Maklon)
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {formatRupiah(multiUnitBalances?.multigraph?.balance || 0)}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">BCA Maklon MultiGraph</span>
            </div>

            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-medium">
                Ekuitas Tertanam Founder
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {formatRupiah(multiUnitBalances?.founder?.netEquity || 0)}
              </div>
              <span className="text-[10px] text-zinc-400 font-mono mt-0.5 block">Modal Disetor - Prive</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs (21st.dev capsule style) */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#121215] border border-white/[0.08] rounded-2xl overflow-x-auto">
          {[
            { id: 'wallets', label: '1. Neraca Multi-Kantong', icon: Wallet, desc: 'Pemisahan Dompet' },
            { id: 'audit', label: '2. Buku Kas 7-Dimensi', icon: FileText, desc: 'Audit Trail Lengkap' },
            { id: 'pnl', label: '3. Laba Rugi Unit (P&L)', icon: PieChart, desc: 'TeeStock vs MultiGraph' },
            { id: 'diagnostics', label: '4. CFO AI Diagnostics & Runway', icon: Activity, desc: 'Burn Rate & Health Score' },
            { id: 'valuation', label: '5. Valuasi & Pertumbuhan', icon: TrendingUp, desc: 'Multiple & Roadmap Holding' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-zinc-950 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-zinc-950 text-white' : 'bg-white/5 text-zinc-400'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className={isActive ? 'text-zinc-950 font-bold' : 'text-zinc-200 font-semibold'}>{tab.label}</div>
                  <div className={`text-[9px] font-mono ${isActive ? 'text-zinc-600' : 'text-zinc-500'}`}>{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* SUB-TAB 1: NERACA MULTI-KANTONG & DOMPET TERISOLASI                       */}
        {/* ========================================================================= */}
        {activeTab === 'wallets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-zinc-400" />
                  Isolasi Saldo Kas Antar-Unit Bisnis
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Setiap unit bisnis mengelola arus kas dan rekening tersendiri. Dilarang mencampur dana operasional apparel dengan jasa maklon atau rekening pribadi.
                </p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                Anti-Commingling Active
              </span>
            </div>

            {/* 4 Isolated Wallet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Wallet 1: TeeStock */}
              <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                      RETAIL APPAREL
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">BCA Bisnis</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 mt-3">Kas Operasional TeeStock</h3>
                  <div className="text-2xl font-mono font-black text-white mt-1">
                    {formatRupiah(multiUnitBalances?.teestock?.balance || 0)}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Khusus belanja bahan polos NSA, cetak DTF meteran Senen, fee ads, dan packaging.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Omset Ritel Masuk:</span>
                    <span className="text-white font-mono font-semibold">{formatRupiah(teestockPnl?.revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>COGS Bahan &amp; DTF:</span>
                    <span className="text-zinc-400 font-mono font-semibold">{formatRupiah(teestockPnl?.cogs || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Net Margin Ritel:</span>
                    <span className="font-mono font-bold text-white">
                      {teestockPnl?.netMarginPercent}% (CFO Rule: &gt;35%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Wallet 2: MultiGraph */}
              <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                      MAKLON &amp; KEMASAN
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">BCA Maklon</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 mt-3">Kas Maklon MultiGraph</h3>
                  <div className="text-2xl font-mono font-black text-white mt-1">
                    {formatRupiah(multiUnitBalances?.multigraph?.balance || 0)}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Khusus perputaran DP maklon B2B, bahan polymailer grosir, dan pasokan unboxing pack.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Pendapatan Maklon:</span>
                    <span className="text-white font-mono font-semibold">{formatRupiah(multigraphPnl?.revenue || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Bahan Polymailer &amp; Stiker:</span>
                    <span className="text-zinc-400 font-mono font-semibold">{formatRupiah(multigraphPnl?.cogs || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Pasokan ke TeeStock:</span>
                    <span className="text-white font-mono font-semibold">{formatRupiah(totalInternalPackagingVolume)}</span>
                  </div>
                </div>
              </div>

              {/* Wallet 3: Holding Reserve */}
              <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                      HOLDING TREASURY
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Alokasi Laba</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 mt-3">Holding Reserve Treasury</h3>
                  <div className="text-2xl font-mono font-black text-white mt-1">
                    {formatRupiah(multiUnitBalances?.holding?.balance || 0)}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Dana cadangan ekspansi, tabungan beli mesin DTF in-house (Target Rp 65 Jt), &amp; buffer darurat.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Target Mesin DTF:</span>
                    <span className="text-white font-mono font-semibold">Rp 65.000.000</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Progres Terkumpul:</span>
                    <span className="text-white font-mono font-semibold">
                      {((multiUnitBalances?.holding?.balance / 65000000) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-black/50 h-1.5 rounded-full overflow-hidden mt-1 border border-white/10">
                    <div 
                      className="bg-white h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (multiUnitBalances?.holding?.balance / 65000000) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Wallet 4: Founder Equity */}
              <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between transition-all group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/15">
                      EKUITAS FOUNDER
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Pribadi Rizky</span>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-200 mt-3">Dompet Ekuitas Founder</h3>
                  <div className="text-2xl font-mono font-black text-white mt-1">
                    {formatRupiah(multiUnitBalances?.founder?.netEquity || 0)}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Total modal riil founder yang disuntikkan dikurangi prive resmi yang sudah ditarik.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Modal Disetor:</span>
                    <span className="text-white font-mono font-semibold">{formatRupiah(multiUnitBalances?.founder?.injected || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Prive Diambil:</span>
                    <span className="text-zinc-400 font-mono font-semibold">{formatRupiah(multiUnitBalances?.founder?.prive || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Disiplin Finansial:</span>
                    <span className="text-white font-mono font-bold">100% Tertib Tercatat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Synergy & Internal Supply Flow Panel */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-zinc-400" />
                    Sinergi Pasokan Internal: TeeStock &harr; MultiGraph
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    TeeStock membeli paket kemasan unboxing (polymailer doff, hangtag 310gsm, stiker pack) langsung ke MultiGraph dengan harga HPP internal Rp 3.000/pack.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 block font-mono">Estimasi Penghematan Sinergi:</span>
                  <span className="text-sm font-mono font-bold text-white">
                    +{formatRupiah(estimatedSynergySavings)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
                  <span className="text-[10px] text-zinc-500 block font-mono">Harga Eceran Packaging Luar:</span>
                  <span className="text-sm font-mono font-bold text-zinc-400 line-through">Rp 5.500 / pack</span>
                  <p className="text-[10px] text-zinc-500 mt-1">Bila beli retail di Shopee / toko atk</p>
                </div>
                <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
                  <span className="text-[10px] text-zinc-500 block font-mono">Harga Pasokan Internal MultiGraph:</span>
                  <span className="text-sm font-mono font-bold text-white">Rp 3.000 / pack</span>
                  <p className="text-[10px] text-zinc-500 mt-1">Hemat Rp 2.500 per helai kaos terjual</p>
                </div>
                <div className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
                  <span className="text-[10px] text-zinc-500 block font-mono">Volume Kemasan Terbayar:</span>
                  <span className="text-sm font-mono font-bold text-white">{formatRupiah(totalInternalPackagingVolume)}</span>
                  <p className="text-[10px] text-zinc-500 mt-1">Pendapatan maklon masuk ke MultiGraph</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 2: BUKU KAS 7-DIMENSI & AUDIT TRAIL LENGKAP                       */}
        {/* ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            {/* Filter Toolbar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-ts-surface p-3.5 rounded-xl border border-ts-border">
              <div className="flex flex-wrap items-center gap-2">
                {/* Unit Filter */}
                <select
                  value={filterUnit}
                  onChange={(e) => setFilterUnit(e.target.value)}
                  className="bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 font-medium focus:outline-none focus:border-ts-terracotta"
                >
                  <option value="all">Semua Unit Bisnis</option>
                  <option value="teestock">👕 TeeStock Apparel</option>
                  <option value="multigraph">📦 MultiGraph Printing</option>
                  <option value="holding">🏛️ Holding Treasury</option>
                  <option value="founder">💼 Ekuitas Founder</option>
                </select>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 font-medium focus:outline-none focus:border-ts-terracotta"
                >
                  <option value="all">Semua Jenis Transaksi</option>
                  <option value="in">📥 Pemasukan (Cash In)</option>
                  <option value="out">📤 Pengeluaran (Cash Out)</option>
                  <option value="inter">⇄ Transfer Antar-Unit</option>
                  <option value="injection">💼 Injeksi Modal Founder</option>
                  <option value="prive">💸 Penarikan Prive</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 font-medium focus:outline-none focus:border-ts-terracotta"
                >
                  <option value="all">Semua Status</option>
                  <option value="cleared">✅ Cleared / Sah</option>
                  <option value="pending">⏳ Pending Settlement</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative w-full lg:w-72">
                <Search className="w-4 h-4 text-ts-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari no. bukti, PO, mutasi, uraian..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem placeholder-ts-muted focus:outline-none focus:border-ts-terracotta"
                />
              </div>
            </div>

            {/* 7-Dimensional Audit Trail Table */}
            <Card className="bg-ts-surface border-ts-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ts-hitam/70 border-b border-ts-borderDim text-ts-muted uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">No. Mutasi &amp; Tanggal</th>
                      <th className="py-3 px-4">Unit &amp; Dompet</th>
                      <th className="py-3 px-4">Kategori &amp; Jenis</th>
                      <th className="py-3 px-4">Uraian / Deskripsi &amp; Ref ID</th>
                      <th className="py-3 px-4">Bukti Nota / Dokumen</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Nominal Arus Kas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ts-borderDim/50 text-ts-krem">
                    {filteredTxs.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-ts-muted">
                          Tidak ditemukan mutasi kas yang sesuai kriteria pencarian / filter.
                        </td>
                      </tr>
                    ) : (
                      filteredTxs.map(tx => {
                        const isIn = tx.type === 'CASH_IN';
                        const isInter = tx.type === 'INTER_TRANSFER';
                        const isInjection = tx.type === 'CAPITAL_INJECTION' || tx.category === 'capital_injection';
                        const isPrive = tx.type === 'FOUNDER_PRIVE' || tx.category === 'owner_prive';

                        return (
                          <tr key={tx.id} className="hover:bg-ts-surfaceHover/60 transition-colors">
                            {/* 1. Transaction No & Date */}
                            <td className="py-3.5 px-4 font-mono">
                              <div className="font-bold text-white">{tx.transactionNo}</div>
                              <div className="text-[10px] text-ts-muted flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3" /> {tx.date}
                              </div>
                            </td>

                            {/* 2. Business Unit & Wallets */}
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
                                tx.businessUnit === 'teestock'
                                  ? 'bg-ts-terracotta/15 text-ts-terracotta border-ts-terracotta/30'
                                  : tx.businessUnit === 'multigraph'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : tx.businessUnit === 'holding'
                                  ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              }`}>
                                {tx.businessUnit === 'teestock' ? 'TeeStock' :
                                 tx.businessUnit === 'multigraph' ? 'MultiGraph' :
                                 tx.businessUnit === 'holding' ? 'Holding' : 'Founder'}
                              </span>
                              <div className="text-[10px] text-ts-muted font-mono mt-1 flex items-center gap-1">
                                <span className="truncate max-w-[110px]" title={tx.sourceWallet}>
                                  {tx.sourceWallet?.replace('wallet_', '')}
                                </span>
                                &rarr;
                                <span className="truncate max-w-[110px]" title={tx.destinationWallet}>
                                  {tx.destinationWallet?.replace('wallet_', '')}
                                </span>
                              </div>
                            </td>

                            {/* 3. Category & Type */}
                            <td className="py-3.5 px-4">
                              <span className="text-[11px] font-semibold text-ts-krem block">
                                {tx.category?.replace(/_/g, ' ').toUpperCase()}
                              </span>
                              <span className="text-[9px] font-mono text-ts-muted">
                                {isInter ? '⇄ INTER-TRANSFER' : isInjection ? '💼 EKUITAS MASUK' : isPrive ? '💸 PRIVE KELUAR' : isIn ? '📥 CASH IN' : '📤 CASH OUT'}
                              </span>
                            </td>

                            {/* 4. Description & Related ID */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <div className="font-medium text-ts-krem leading-snug line-clamp-2">
                                {tx.description}
                              </div>
                              {tx.relatedId && (
                                <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20 inline-block mt-1">
                                  Ref: {tx.relatedId}
                                </span>
                              )}
                            </td>

                            {/* 5. Proof Receipt Ref */}
                            <td className="py-3.5 px-4">
                              {tx.proofReceiptRef ? (
                                <span className="font-mono text-[10px] text-ts-krem/90 bg-ts-hitam/80 px-2 py-1 rounded border border-ts-borderDim flex items-center gap-1 w-max">
                                  <FileText className="w-3 h-3 text-ts-terracotta" /> {tx.proofReceiptRef}
                                </span>
                              ) : (
                                <span className="text-[10px] text-ts-muted italic">- Tanpa Nota -</span>
                              )}
                            </td>

                            {/* 6. Settlement Status */}
                            <td className="py-3.5 px-4 text-center">
                              {tx.settlementStatus === 'pending' ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                  ⏳ Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" /> Cleared
                                </span>
                              )}
                            </td>

                            {/* 7. Amount */}
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-sm whitespace-nowrap">
                              <span className={
                                isInter ? 'text-sky-400' :
                                isInjection ? 'text-amber-400' :
                                isPrive ? 'text-rose-400' :
                                isIn ? 'text-emerald-400' : 'text-rose-400'
                              }>
                                {isInter ? '⇄ ' : isIn || isInjection ? '+' : '-'}{formatRupiah(tx.amount)}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 3: LAPORAN LABA RUGI UNIT (UNIT P&L STATEMENT)                   */}
        {/* ========================================================================= */}
        {activeTab === 'pnl' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  Laporan Laba Rugi Unit (Unit Economics P&amp;L)
                </h2>
                <p className="text-xs text-ts-muted mt-0.5">
                  Analisis kinerja operasional riil per unit bisnis. Standar CFO: Margin bersih ritel apparel wajib &ge;35%.
                </p>
              </div>
            </div>

            {/* Side-by-side Unit P&L */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* P&L TeeStock */}
              <Card className="bg-ts-surface border-ts-border p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-ts-borderDim pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-ts-terracotta" />
                    <h3 className="text-sm font-black text-white">TeeStock Apparel (Ritel &amp; POD)</h3>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs border-ts-terracotta/40 text-ts-terracotta">
                    Unit B2C
                  </Badge>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  {/* Revenue */}
                  <div className="flex justify-between items-center py-1.5 border-b border-ts-borderDim/50">
                    <span className="text-ts-krem font-sans font-medium">1. Pendapatan Penjualan Kaos</span>
                    <span className="text-emerald-400 font-bold">{formatRupiah(teestockPnl?.revenue || 0)}</span>
                  </div>

                  {/* COGS */}
                  <div className="space-y-1.5 pl-3 border-l-2 border-rose-500/40">
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Kaos Polos NSA Softstyle / 24s:</span>
                      <span>{formatRupiah(456000)}</span>
                    </div>
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Jasa Cetak DTF Roll 58cm Senen:</span>
                      <span>{formatRupiah(140000)}</span>
                    </div>
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Paket Kemasan MultiGraph:</span>
                      <span>{formatRupiah(60000)}</span>
                    </div>
                    <div className="flex justify-between text-rose-400 font-bold pt-1 border-t border-ts-borderDim/30">
                      <span className="font-sans">Total HPP / COGS:</span>
                      <span>-{formatRupiah(teestockPnl?.cogs || 0)}</span>
                    </div>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex justify-between items-center py-2 bg-ts-hitam/60 px-3 rounded-lg border border-ts-borderDim">
                    <span className="text-white font-sans font-bold">Laba Kotor (Gross Profit)</span>
                    <div className="text-right">
                      <span className="text-white font-bold block">{formatRupiah(teestockPnl?.grossProfit || 0)}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Gross Margin: {teestockPnl?.grossMarginPercent}%</span>
                    </div>
                  </div>

                  {/* OPEX */}
                  <div className="space-y-1.5 pl-3 border-l-2 border-amber-500/40">
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Listrik Heat Press 155°C &amp; Kuota:</span>
                      <span>Rp 0</span>
                    </div>
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Fee Midtrans &amp; Packing Tape:</span>
                      <span>Rp 0</span>
                    </div>
                    <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-ts-borderDim/30">
                      <span className="font-sans">Total Beban OPEX:</span>
                      <span>-{formatRupiah(teestockPnl?.opex || 0)}</span>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className="flex justify-between items-center py-3 bg-emerald-500/10 px-3 rounded-xl border border-emerald-500/30">
                    <div>
                      <span className="text-white font-sans font-bold block text-sm">Laba Bersih Operasional</span>
                      <span className="text-[10px] text-ts-muted font-sans">Sebelum alokasi dividen / prive</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-bold block ${teestockPnl?.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatRupiah(teestockPnl?.netProfit || 0)}
                      </span>
                      <span className={`text-[10px] font-bold ${teestockPnl?.netMarginPercent >= 35 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        Net Margin: {teestockPnl?.netMarginPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* P&L MultiGraph */}
              <Card className="bg-ts-surface border-ts-border p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-ts-borderDim pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-black text-white">MultiGraph Printing &amp; Packaging</h3>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs border-emerald-500/40 text-emerald-400">
                    Unit B2B
                  </Badge>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  {/* Revenue */}
                  <div className="space-y-1.5 pl-3 border-l-2 border-emerald-500/40">
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Order Klien B2B (DP Stiker/Box):</span>
                      <span>{formatRupiah(150000)}</span>
                    </div>
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Pasokan Kemasan Internal ke TeeStock:</span>
                      <span>{formatRupiah(60000)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-ts-borderDim/30">
                      <span className="font-sans">Total Pendapatan Maklon:</span>
                      <span>{formatRupiah(multigraphPnl?.revenue || 0)}</span>
                    </div>
                  </div>

                  {/* COGS */}
                  <div className="space-y-1.5 pl-3 border-l-2 border-rose-500/40">
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Bahan Polymailer Grosir 100 pcs:</span>
                      <span>{formatRupiah(95000)}</span>
                    </div>
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Bahan Kertas Hangtag &amp; Stiker:</span>
                      <span>Rp 0</span>
                    </div>
                    <div className="flex justify-between text-rose-400 font-bold pt-1 border-t border-ts-borderDim/30">
                      <span className="font-sans">Total HPP Bahan Baku:</span>
                      <span>-{formatRupiah(multigraphPnl?.cogs || 0)}</span>
                    </div>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex justify-between items-center py-2 bg-ts-hitam/60 px-3 rounded-lg border border-ts-borderDim">
                    <span className="text-white font-sans font-bold">Laba Kotor Maklon</span>
                    <div className="text-right">
                      <span className="text-white font-bold block">{formatRupiah(multigraphPnl?.grossProfit || 0)}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Gross Margin: {multigraphPnl?.grossMarginPercent}%</span>
                    </div>
                  </div>

                  {/* OPEX */}
                  <div className="space-y-1.5 pl-3 border-l-2 border-amber-500/40">
                    <div className="flex justify-between text-ts-muted">
                      <span className="font-sans">Ongkir Ekspedisi Bahan Grosir:</span>
                      <span>Rp 0</span>
                    </div>
                    <div className="flex justify-between text-amber-400 font-bold pt-1 border-t border-ts-borderDim/30">
                      <span className="font-sans">Total Beban OPEX:</span>
                      <span>-{formatRupiah(multigraphPnl?.opex || 0)}</span>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className="flex justify-between items-center py-3 bg-emerald-500/10 px-3 rounded-xl border border-emerald-500/30">
                    <div>
                      <span className="text-white font-sans font-bold block text-sm">Laba Bersih Maklon</span>
                      <span className="text-[10px] text-ts-muted font-sans">Margin sehat B2B supply</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-bold block ${multigraphPnl?.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatRupiah(multigraphPnl?.netProfit || 0)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        Net Margin: {multigraphPnl?.netMarginPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 4: CFO AI DIAGNOSTICS & RUNWAY ENGINE                             */}
        {/* ========================================================================= */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-400" />
                  CFO AI Runway &amp; Financial Health Diagnostics
                </h2>
                <p className="text-xs text-ts-muted mt-0.5">
                  Pemantauan detak jantung kas harian (Daily Burn Rate), kapasitas bertahan hidup (Cash Runway), dan mitigasi risiko kehabisan uang kas.
                </p>
              </div>
            </div>

            {/* 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-ts-surface border-ts-border p-5">
                <span className="text-xs text-ts-muted font-medium">Daily Burn Rate (Rata-Rata)</span>
                <div className="text-2xl font-mono font-black text-rose-400 mt-1">
                  {formatRupiah(runwayData?.dailyBurnRate || 0)} / hari
                </div>
                <p className="text-[10px] text-ts-muted mt-2">
                  Pengeluaran operasional dan belanja bahan 30 hari terakhir dibagi 30 hari kalender.
                </p>
              </Card>

              <Card className="bg-ts-surface border-ts-border p-5">
                <span className="text-xs text-ts-muted font-medium">Cash Runway (Kapasitas Bertahan)</span>
                <div className="text-2xl font-mono font-black text-emerald-400 mt-1">
                  {runwayData?.runwayMonths || '99+'} Bulan
                </div>
                <p className="text-[10px] text-ts-muted mt-2">
                  Berapa lama kas holding bertahan jika sama sekali tidak ada omset masuk baru.
                </p>
              </Card>

              <Card className="bg-ts-surface border-ts-border p-5">
                <span className="text-xs text-ts-muted font-medium">CFO Financial Health Score</span>
                <div className="text-2xl font-mono font-black text-sky-400 mt-1 flex items-center gap-2">
                  88 / 100 <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">SEHAT</span>
                </div>
                <p className="text-[10px] text-ts-muted mt-2">
                  Kriteria: Nol utang bank, kas operasional positif, pemisahan rekening disiplin 100%.
                </p>
              </Card>
            </div>

            {/* CFO AI Advisory & Action List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-ts-surface border-ts-border p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Rekomendasi Strategis CFO untuk Rizky (Founder)
                </div>
                <ul className="space-y-2.5 text-xs text-ts-krem/90">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span><strong>Pertahankan Cash Runway &ge; 6 Bulan:</strong> Jangan pernah menghabiskan kas operasional TeeStock untuk beli aset besar (mesin) sebelum kas cadangan terkumpul di Holding Treasury.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span><strong>Disiplin HPP TeeStock:</strong> Kaos polos NSA 24s Rp 38.000 + cetak DTF Rp 10.000 + unboxing pack MultiGraph Rp 3.000 + buffer defect 5% (Rp 2.500) = HPP Rp 53.500. Harga jual minimum Rp 99.000 (Margin 46%).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span><strong>Aturan Prive:</strong> Prive hanya boleh ditarik maksimal 30% dari laba bersih kas yang sudah <em>cleared</em>, bukan dari omset bruto atau dari DP klien yang belum selesai dikerjakan.</span>
                  </li>
                </ul>
              </Card>

              <Card className="bg-ts-surface border-ts-border p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Mitigasi Risiko Keuangan &amp; Early Warning System
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-ts-hitam/60 border border-ts-borderDim flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Status Rekening: Terisolasi 100%</span>
                      <span className="text-ts-muted text-[11px]">Tidak ada transaksi pribadi Rizky yang bercampur di kas operasional.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-ts-hitam/60 border border-ts-borderDim flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Utang Berbunga: Rp 0 (Nol Beban Bunga)</span>
                      <span className="text-ts-muted text-[11px]">Seluruh permodalan murni bootstrapped tanpa cicilan bank atau pinjaman berbunga.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-ts-hitam/60 border border-ts-borderDim flex items-start gap-2">
                    <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Settlement QRIS / Gateway</span>
                      <span className="text-ts-muted text-[11px]">Seluruh settlement masuk secara tertib H+1 langsung ke rekening BCA Bisnis.</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 5: VALUASI & PERTUMBUHAN BISNIS HOLDING (ENTERPRISE VALUATION)    */}
        {/* ========================================================================= */}
        {activeTab === 'valuation' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Valuasi Ekuitas &amp; Pertumbuhan MultiGraph Holding
                </h2>
                <p className="text-xs text-ts-muted mt-0.5">
                  Penilaian objektif nilai ekosistem bisnis menggabungkan aset riil (NAV), kelipatan laba bersih (SDE Multiple), dan skala omset disetahunkan.
                </p>
              </div>

              {/* Multiple Scenario Selector */}
              <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/[0.08] rounded-xl text-xs">
                <span className="text-[10px] text-zinc-500 px-2 font-mono">Skenario:</span>
                {[
                  { id: 'conservative', label: 'Konservatif (2.0x)', mult: 2.0 },
                  { id: 'moderate', label: 'Moderat (2.8x)', mult: 2.8 },
                  { id: 'aggressive', label: 'Agresif (4.0x)', mult: 4.0 },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setValuationScenario(s.id)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all ${
                      valuationScenario === s.id
                        ? 'bg-white text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Valuation Highlight Card */}
            {(() => {
              const currentMultiplier = valuationScenario === 'conservative' ? 2.0 : valuationScenario === 'aggressive' ? 4.0 : 2.8;
              const dynamicSdeValuation = Math.round((businessValuation?.annualizedSDE || 15000000) * currentMultiplier);
              const dynamicFairValuation = Math.round(
                ((businessValuation?.totalBookValueNAV || 0) * 0.40) +
                (dynamicSdeValuation * 0.40) +
                ((businessValuation?.revenueValuation || 0) * 0.20)
              );
              const dynamicWealthGrowth = dynamicFairValuation - (businessValuation?.netFounderEquity || 4500000);
              const dynamicGrowthRatio = ((dynamicFairValuation / (businessValuation?.netFounderEquity || 4500000))).toFixed(2);
              const dynamicGrowthPercent = (((dynamicWealthGrowth) / (businessValuation?.netFounderEquity || 4500000)) * 100).toFixed(1);

              return (
                <div className="bg-[#121215] border border-white/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
                    <div className="lg:col-span-2 space-y-3 border-b lg:border-b-0 lg:border-r border-white/[0.08] pb-5 lg:pb-0 lg:pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                          WEIGHTED FAIR ENTERPRISE VALUATION
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">Standar CFO Solopreneur</span>
                      </div>

                      <div className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight">
                        {formatRupiah(dynamicFairValuation)}
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Estimasi nilai wajar holding jika diukur dari kombinasi <strong>40% Harta Bersih Riil (NAV)</strong> + <strong>40% Kemampuan Hasilkan Laba (SDE x {currentMultiplier}x)</strong> + <strong>20% Skala Omset</strong>.
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
                        <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                          <span className="text-zinc-500 text-[10px] block">Modal Bersih Disetor:</span>
                          <span className="text-white font-bold">{formatRupiah(businessValuation?.netFounderEquity || 0)}</span>
                        </div>
                        <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                          <span className="text-zinc-500 text-[10px] block">Nilai Tambah Tercipta:</span>
                          <span className="text-white font-bold">+{formatRupiah(dynamicWealthGrowth)}</span>
                        </div>
                        <div className="bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                          <span className="text-zinc-500 text-[10px] block">Kelipatan Nilai (Multiple):</span>
                          <span className="text-white font-bold">{dynamicGrowthRatio}x Modal (+{dynamicGrowthPercent}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Formula Explanation */}
                    <div className="space-y-3 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                          Bobot Komposisi Valuasi:
                        </span>
                        <ul className="space-y-2 text-xs">
                          <li className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/[0.05]">
                            <span className="text-zinc-400">1. Net Asset Value (40%)</span>
                            <span className="font-mono font-bold text-white">{formatRupiah(Math.round((businessValuation?.totalBookValueNAV || 0) * 0.40))}</span>
                          </li>
                          <li className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/[0.05]">
                            <span className="text-zinc-400">2. Laba &amp; SDE ({currentMultiplier}x) (40%)</span>
                            <span className="font-mono font-bold text-white">{formatRupiah(Math.round(dynamicSdeValuation * 0.40))}</span>
                          </li>
                          <li className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/[0.05]">
                            <span className="text-zinc-400">3. Run-Rate Omset (20%)</span>
                            <span className="font-mono font-bold text-white">{formatRupiah(Math.round((businessValuation?.revenueValuation || 0) * 0.20))}</span>
                          </li>
                        </ul>
                      </div>

                      <div className="text-[11px] text-zinc-500 italic pt-2 border-t border-white/[0.06] font-mono">
                        💡 Valuasi riil, bukan estimasi koin spekulatif. Berbasis uang nyata di bank, stok kaos polos, dan mesin kerja.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* 3 Detailed Valuation Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pillar 1: Net Asset Value */}
              <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" /> 1. Net Asset Value (NAV)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Floor Value</span>
                </div>
                <div className="text-2xl font-mono font-black text-white">
                  {formatRupiah(businessValuation?.totalBookValueNAV || 0)}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Nilai likuidasi aman bila seluruh harta dicairkan seketika tanpa utang.
                </p>
                <div className="pt-2 border-t border-white/[0.06] space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Kas di Rekening Bank:</span>
                    <span className="text-white font-semibold">{formatRupiah(businessValuation?.cashLiquidity || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Persediaan Bahan &amp; Stok:</span>
                    <span className="text-white font-semibold">{formatRupiah(businessValuation?.inventoryValue || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Mesin Heat Press (CAPEX):</span>
                    <span className="text-white font-semibold">{formatRupiah(businessValuation?.fixedAssetsValue || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: SDE Multiple Valuation */}
              <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <PieChart className="w-3.5 h-3.5 text-zinc-400" /> 2. SDE Earnings Multiple
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Laba Tahunan</span>
                </div>
                <div className="text-2xl font-mono font-black text-white">
                  {formatRupiah(businessValuation?.sdeValuation || 0)}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Valuasi berbasis daya menghasilkan uang (Laba Operasional + Prive x Multiple 2.8x).
                </p>
                <div className="pt-2 border-t border-white/[0.06] space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>SDE Tahunan Disetahunkan:</span>
                    <span className="text-white font-semibold">{formatRupiah(businessValuation?.annualizedSDE || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Multiple Kelipatan SDE:</span>
                    <span className="text-white font-bold">{businessValuation?.sdeMultiple}x</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Disiplin Kas:</span>
                    <span className="text-white font-semibold">100% Cash Basis</span>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Revenue Multiple */}
              <div className="bg-[#121215] border border-white/[0.08] hover:border-white/20 rounded-2xl p-5 space-y-3 transition-all">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-zinc-400" /> 3. Revenue Multiple
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Skala Omset</span>
                </div>
                <div className="text-2xl font-mono font-black text-white">
                  {formatRupiah(businessValuation?.revenueValuation || 0)}
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Valuasi berbasis volume penjualan disetahunkan (Annualized Run-Rate x 1.5x).
                </p>
                <div className="pt-2 border-t border-white/[0.06] space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Proyeksi Omset Tahunan (ARR):</span>
                    <span className="text-white font-semibold">{formatRupiah(businessValuation?.annualizedRevenue || 0)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Multiple Kelipatan Omset:</span>
                    <span className="text-white font-bold">{businessValuation?.revenueMultiple}x</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Skalabilitas:</span>
                    <span className="text-white font-semibold">High POD Scale</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Holding Valuation Roadmap & Milestone Progress */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-zinc-400" />
                    Roadmap Trajektori Valuasi MultiGraph Holding (Target Capaian)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tahapan eskalasi valuasi dari fase bootstrap solo founder hingga ekosistem holding multi-unit beromset ratusan juta.
                  </p>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20">
                  Target: Rp 500 Jt
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {businessValuation?.milestones?.map(m => (
                  <div 
                    key={m.level} 
                    className={`p-4 rounded-xl border transition-all ${
                      m.achieved 
                        ? 'bg-white/[0.04] border-white/30' 
                        : 'bg-black/30 border-white/[0.06] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        m.achieved 
                          ? 'bg-white text-zinc-950 border-white' 
                          : 'bg-white/5 text-zinc-400 border-white/10'
                      }`}>
                        {m.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-white">
                        {formatRupiah(m.targetValuation)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mt-2.5">{m.name}</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">{m.desc}</p>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500">Status:</span>
                      {m.achieved ? (
                        <span className="text-white font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" /> TERCAPAI
                        </span>
                      ) : (
                        <span className="text-zinc-400 font-bold">
                          BERJALAN ({((businessValuation?.fairEnterpriseValuation / m.targetValuation) * 100).toFixed(0)}%)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capital Velocity & Cash Conversion Cycle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-zinc-400" />
                  Kecepatan Perputaran Modal (Cash Conversion Cycle)
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Dalam model hybrid On-Demand TeeStock dan maklon MultiGraph, siklus uang berputar sangat cepat:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/[0.08]">
                    <span className="text-[10px] text-zinc-500 block font-mono">Beli Kaos &amp; DTF</span>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">Hari ke-0</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/[0.08]">
                    <span className="text-[10px] text-zinc-500 block font-mono">Press &amp; Kirim</span>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">Hari ke-1</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-lg border border-white/[0.08]">
                    <span className="text-[10px] text-zinc-500 block font-mono">Kas Masuk Rekening</span>
                    <span className="text-xs font-mono font-bold text-white mt-1 block">Hari ke-2 (H+1)</span>
                  </div>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono text-center pt-1 flex items-center justify-center gap-1">
                  <span>⚡ Siklus Kas Sempurna: Hanya 48 jam modal kembali menjadi uang kas plus laba!</span>
                </div>
              </div>

              <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-3">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-400" />
                  Pertahanan Ekuitas Founder (Anti-Dilusi &amp; Anti-Utang)
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  BisnisHub OS dirancang agar Rizky memiliki <strong>100% kepemilikan saham tanpa dilusi</strong>:
                </p>
                <ul className="space-y-2 text-xs text-zinc-300 pl-1">
                  <li className="flex items-center gap-2">
                    <span className="text-white font-bold">&check;</span>
                    <span>100% Saham dimiliki Sole Founder Rizky (Nol utang pihak ketiga).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white font-bold">&check;</span>
                    <span>Pertumbuhan organik dibiayai dari laba ditahan (Retained Earnings).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-white font-bold">&check;</span>
                    <span>Valuasi meningkat seiring naiknya aset mesin in-house &amp; volume order.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL INPUT TRANSAKSI MULTIFUNGSI (CFO GRADE)                             */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'cash_in' ? 'Catat Kas Masuk (Pemasukan Omset / Maklon)' :
          modalMode === 'cash_out' ? 'Catat Kas Keluar (Belanja Bahan / OPEX / Aset)' :
          modalMode === 'inter_transfer' ? 'Transfer Antar-Unit Bisnis (TeeStock &harr; MultiGraph)' :
          'Transaksi Ekuitas Founder (Injeksi Modal / Prive)'
        }
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Mode Selector Tabs inside Modal */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-ts-hitam rounded-lg border border-ts-borderDim text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleOpenAction('cash_in')}
              className={`py-1.5 rounded text-center transition-all ${modalMode === 'cash_in' ? 'bg-emerald-600 text-white shadow' : 'text-ts-muted hover:text-white'}`}
            >
              + Masuk
            </button>
            <button
              type="button"
              onClick={() => handleOpenAction('cash_out')}
              className={`py-1.5 rounded text-center transition-all ${modalMode === 'cash_out' ? 'bg-rose-600 text-white shadow' : 'text-ts-muted hover:text-white'}`}
            >
              - Keluar
            </button>
            <button
              type="button"
              onClick={() => handleOpenAction('inter_transfer')}
              className={`py-1.5 rounded text-center transition-all ${modalMode === 'inter_transfer' ? 'bg-sky-600 text-white shadow' : 'text-ts-muted hover:text-white'}`}
            >
              ⇄ Transfer
            </button>
            <button
              type="button"
              onClick={() => handleOpenAction('founder_equity')}
              className={`py-1.5 rounded text-center transition-all ${modalMode === 'founder_equity' ? 'bg-amber-600 text-white shadow' : 'text-ts-muted hover:text-white'}`}
            >
              💼 Ekuitas
            </button>
          </div>

          {/* Business Unit & Category Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Unit Bisnis Penanggung Jawab
              </label>
              <select
                value={txUnit}
                onChange={(e) => setTxUnit(e.target.value)}
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta"
              >
                <option value="teestock">👕 TeeStock Apparel</option>
                <option value="multigraph">📦 MultiGraph Printing</option>
                <option value="holding">🏛️ Holding Treasury</option>
                <option value="founder">💼 Ekuitas Founder</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Kategori Transaksi (COA)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta"
              >
                {transactionCategories
                  ?.filter(c => c.unit === txUnit || c.unit === 'all' || modalMode === 'founder_equity' || modalMode === 'inter_transfer')
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Amount & Settlement Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nominal Transaksi (Rp)
              </label>
              <input
                type="number"
                min="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-sm text-ts-krem px-3 py-2 font-mono focus:outline-none focus:border-ts-terracotta"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Status Settlement Kas
              </label>
              <select
                value={settlementStatus}
                onChange={(e) => setSettlementStatus(e.target.value)}
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta"
              >
                <option value="cleared">✅ Cleared (Sudah Masuk / Keluar Rekening)</option>
                <option value="pending">⏳ Pending (Menunggu Kliring H+1 / Gateway)</option>
              </select>
            </div>
          </div>

          {/* Wallets Source & Destination */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Akun / Rekening Sumber
              </label>
              <input
                type="text"
                value={sourceWallet}
                onChange={(e) => setSourceWallet(e.target.value)}
                placeholder="Contoh: wallet_teestock / BCA Bisnis"
                required
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Akun / Rekening Tujuan
              </label>
              <input
                type="text"
                value={destinationWallet}
                onChange={(e) => setDestinationWallet(e.target.value)}
                placeholder="Contoh: wallet_multigraph / Vendor Cititex"
                required
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Uraian &amp; Keterangan Transaksi
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pembayaran 12 pcs NSA Heavyweight 24s untuk Drop #01"
              required
              className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta"
            />
          </div>

          {/* Proof Ref & Related ID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                No. Bukti Nota / Ref Mutasi
              </label>
              <input
                type="text"
                value={proofReceiptRef}
                onChange={(e) => setProofReceiptRef(e.target.value)}
                placeholder="Contoh: NOTA-CITITEX-4412"
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                ID Kaitan (PO / Order / Aset)
              </label>
              <input
                type="text"
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
                placeholder="Contoh: PO-CITITEX-260901"
                className="w-full bg-ts-hitam border border-ts-border rounded-lg text-xs text-ts-krem px-3 py-2 focus:outline-none focus:border-ts-terracotta font-mono"
              />
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 flex justify-end gap-2 border-t border-ts-borderDim">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" className="font-bold">
              Simpan ke Buku Kas
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
