import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Copy, 
  Check, 
  MessageSquare, 
  Send, 
  Printer, 
  Download, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  Plus, 
  Minus, 
  RotateCcw, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Wallet, 
  Building2, 
  TrendingUp, 
  FileSpreadsheet,
  Shirt,
  Phone,
  User,
  MapPin,
  ExternalLink,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '@bisnishub/shared/components/ui/Card';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { GARMENT_TYPES, SIZES, NSA_34_COLORS } from '@bisnishub/shared/constants/garments';
import { useAdmin } from '../../context/AdminContext';
import { 
  PRINT_POSITIONS, 
  PACKAGING_OPTIONS, 
  VOLUME_TIERS, 
  calculateCustomQuote, 
  generateQuoteWhatsAppText, 
  getQuoteWhatsAppUrl, 
  createKanbanOrderFromQuote, 
  exportQuotationCsv, 
  formatRupiah 
} from '../../services/quoterApi';
import { normalizePhoneNumber } from '../../services/customersApi';

export function QuoterPage() {
  const navigate = useNavigate();
  const { addOrder, showToast } = useAdmin();

  // 1. Order Parameters State
  const [garmentKey, setGarmentKey] = useState('nsa_softstyle_30s');
  const [garmentColor, setGarmentColor] = useState('Hitam');
  const [sizeQuantities, setSizeQuantities] = useState({
    S: 0,
    M: 6,
    L: 6,
    XL: 0,
    '2XL': 0,
    '3XL': 0
  });
  const [selectedPlacements, setSelectedPlacements] = useState(['front_a3']);
  const [packagingId, setPackagingId] = useState('standard_poly');

  // 2. Customer Info State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');

  // 3. WhatsApp Proposal Engine State
  const [activeWaTemplate, setActiveWaTemplate] = useState('detailed_quote');
  const [customWaMessage, setCustomWaMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState(null);

  // Calculate live quote economics
  const quote = useMemo(() => {
    return calculateCustomQuote({
      garmentKey,
      garmentColor,
      sizeQuantities,
      selectedPlacements,
      packagingId
    });
  }, [garmentKey, garmentColor, sizeQuantities, selectedPlacements, packagingId]);

  // Keep WhatsApp text updated when quote or template changes, unless user edited it
  const defaultWaText = useMemo(() => {
    return generateQuoteWhatsAppText(
      quote, 
      { name: customerName, phone: customerPhone }, 
      activeWaTemplate
    );
  }, [quote, customerName, customerPhone, activeWaTemplate]);

  // Sync custom message initially or on template switch
  const [userHasEditedText, setUserHasEditedText] = useState(false);
  const displayWaText = userHasEditedText ? customWaMessage : defaultWaText;

  const handleTemplateSwitch = (tmplId) => {
    setActiveWaTemplate(tmplId);
    setUserHasEditedText(false);
    setCustomWaMessage('');
  };

  const handleTextChange = (e) => {
    setUserHasEditedText(true);
    setCustomWaMessage(e.target.value);
  };

  const handleResetText = () => {
    setUserHasEditedText(false);
    setCustomWaMessage('');
    if (showToast) showToast('Format teks penawaran direset ke template bawaan', 'info');
  };

  // Size quantity adjustments
  const handleSizeChange = (size, delta) => {
    setSizeQuantities(prev => {
      const current = prev[size] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [size]: next };
    });
  };

  const handleSetPresetQty = (targetTotal) => {
    // Distribute evenly across M and L
    const half = Math.floor(targetTotal / 2);
    const remainder = targetTotal - (half * 2);
    setSizeQuantities({
      S: 0,
      M: half,
      L: half + remainder,
      XL: 0,
      '2XL': 0,
      '3XL': 0
    });
  };

  // Toggle print placement checkbox
  const handleTogglePlacement = (placementId) => {
    setSelectedPlacements(prev => {
      if (prev.includes(placementId)) {
        if (prev.length === 1) {
          if (showToast) showToast('Minimal harus ada 1 titik sablon DTF', 'warning');
          return prev;
        }
        return prev.filter(id => id !== placementId);
      } else {
        return [...prev, placementId];
      }
    });
  };

  // Copy proposal text
  const handleCopyChat = () => {
    navigator.clipboard.writeText(displayWaText);
    setCopied(true);
    if (showToast) showToast('Teks penawaran berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  // Send via WhatsApp (wa.me)
  const handleSendWhatsApp = () => {
    const cleanPhone = normalizePhoneNumber(customerPhone);
    const textToSend = displayWaText;
    const url = cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`
      : `https://wa.me/?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Bridge to Kanban production queue
  const handlePushToKanban = async () => {
    setIsSubmittingOrder(true);
    try {
      const customerInfo = {
        name: customerName || 'Pelanggan Custom WA',
        phone: customerPhone,
        city: customerCity
      };
      const orderPayload = createKanbanOrderFromQuote(quote, customerInfo);
      
      if (addOrder) {
        const result = await addOrder(orderPayload);
        const orderId = result?.[0]?.id || orderPayload.id || 'ORDER-BARU';
        setCreatedOrderNumber(orderId);
        if (showToast) {
          showToast(`⚡ Pesanan custom ${quote.totalQty} pcs berhasil masuk antrean Kanban!`, 'success');
        }
      }
    } catch (err) {
      console.error('Failed to create order from quote:', err);
      if (showToast) showToast('Gagal menerbitkan pesanan ke antrean', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    exportQuotationCsv(quote, { name: customerName, phone: customerPhone });
    if (showToast) showToast('Dokumen CSV penawaran berhasil diunduh!', 'success');
  };

  // Trigger Print Slip
  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col font-sans pb-16 selection:bg-amber-500/20 selection:text-amber-200">
      
      {/* Topbar (Hidden during print) */}
      <div className="print:hidden">
        <AdminTopbar />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Page Header (Hidden during print) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.08] pb-6 print:hidden">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Admin</span>
              <span>/</span>
              <span className="text-zinc-200 font-medium">Operasional Percetakan</span>
              <span>/</span>
              <span className="text-amber-400 font-medium">Custom Order Quoter WA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Calculator className="w-7 h-7 text-amber-400" />
              Custom Order Quoter & WhatsApp Engine
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
              Kalkulator HPP pesanan custom komunitas/B2B secara instan. Hitung multi-posisi sablon DTF, surcharge ukuran jumbo, 
              pastikan margin CFO $\ge 35\%$, buat draf penawaran WhatsApp resmi, dan terbitkan langsung ke antrean produksi Kanban.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={handlePrintSlip}
              variant="outline"
              className="bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-zinc-200 text-xs flex items-center gap-2 h-10 px-3.5 rounded-xl transition-all"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              Cetak Slip Penawaran
            </Button>
            <Button
              onClick={handleExportCsv}
              variant="outline"
              className="bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-zinc-200 text-xs flex items-center gap-2 h-10 px-3.5 rounded-xl transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Ekspor CSV
            </Button>
          </div>
        </div>

        {/* 4 EXECUTIVE KPI RIBBON CARDS (Bento Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
          
          {/* Card 1: HPP Produksi Satuan (BOM Riil) */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">HPP Produksi Satuan</span>
              <div className="p-2 bg-sky-500/10 border border-sky-500/20 rounded-xl">
                <Shirt className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-sky-300">
                {formatRupiah(quote.unitHpp)}
              </div>
              <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5 flex-wrap">
                <span>Kain: {formatRupiah(quote.baseBlankCost)}</span>
                <span>•</span>
                <span>DTF: {formatRupiah(quote.totalDtfPerPcs)}</span>
              </div>
            </div>
          </Card>

          {/* Card 2: Harga Jual Satuan Rekomendasi */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Harga Satuan Rekomendasi</span>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <Calculator className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-amber-300">
                {formatRupiah(quote.recommendedUnitPrice)}
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {quote.tier?.label}
                </span>
                <span className="text-[11px] text-zinc-400">
                  ({quote.totalQty} pcs)
                </span>
              </div>
            </div>
          </Card>

          {/* Card 3: Total Tagihan & Syarat DP 50% */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Total Tagihan & DP 50%</span>
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-emerald-300">
                {formatRupiah(quote.totalPrice)}
              </div>
              <div className="mt-2 text-[11px] text-zinc-400">
                Uang Muka (DP 50%): <span className="text-emerald-400 font-semibold font-mono">{formatRupiah(quote.downPayment)}</span>
              </div>
            </div>
          </Card>

          {/* Card 4: Estimasi Laba Bersih & Margin CFO */}
          <Card className="p-4 sm:p-5 bg-[#121215] border-white/[0.08] rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">Estimasi Laba Bersih Proyek</span>
              <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight text-purple-300">
                {formatRupiah(quote.totalNetProfit)}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${quote.cfoBadgeColor}`}>
                  {quote.netMarginPercent}% Margin
                </span>
                <span className="text-[10px] text-zinc-500">
                  {quote.cfoStatus === 'healthy' ? 'Lolos Batas CFO' : 'Evaluasi Diskon'}
                </span>
              </div>
            </div>
          </Card>

        </div>

        {/* MAIN WORKBENCH GRID: CONTROLS & PROPOSAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
          
          {/* LEFT COLUMN: PARAMETER ORDER (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* PARAM 1: MODEL GARMEN & WARNA */}
            <Card className="p-5 bg-[#121215] border-white/[0.08] rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Shirt className="w-4 h-4 text-amber-400" />
                  <span>1. Model Garmen & Warna Bahan</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  HPP Bahan: <strong className="text-white">{formatRupiah(quote.baseBlankCost)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Model Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Model Kaos NSA</label>
                  <select
                    value={garmentKey}
                    onChange={(e) => setGarmentKey(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  >
                    {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([k, g]) => (
                      <option key={k} value={k}>
                        {g.name} ({formatRupiah(g.baseCost)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Warna Kain</label>
                  <select
                    value={garmentColor}
                    onChange={(e) => setGarmentColor(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  >
                    {NSA_34_COLORS.slice(0, 16).map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Packaging Selector */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-zinc-300">Pilihan Kemasan & Finishing</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {PACKAGING_OPTIONS.map((pkg) => (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setPackagingId(pkg.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                        packagingId === pkg.id
                          ? 'bg-amber-400/10 border-amber-400/40 text-white font-semibold'
                          : 'bg-black/30 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="line-clamp-2 leading-tight">{pkg.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono mt-1">+{formatRupiah(pkg.cost)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* PARAM 2: POSISI SABLON DTF MULTI-TITIK */}
            <Card className="p-5 bg-[#121215] border-white/[0.08] rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>2. Posisi & Ukuran Sablon DTF (Multi-Titik)</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  Total DTF/pcs: <strong className="text-sky-300">{formatRupiah(quote.totalDtfPerPcs)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRINT_POSITIONS.map((pos) => {
                  const isChecked = selectedPlacements.includes(pos.id);
                  return (
                    <div
                      key={pos.id}
                      onClick={() => handleTogglePlacement(pos.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-sky-500/10 border-sky-500/30 text-white'
                          : 'bg-black/30 border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          isChecked ? 'bg-sky-500 border-sky-500 text-zinc-950 font-bold' : 'border-white/20'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{pos.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 shrink-0">
                        {formatRupiah(pos.cost)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* PARAM 3: PEMBAGIAN UKURAN & TOTAL PCS */}
            <Card className="p-5 bg-[#121215] border-white/[0.08] rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>3. Matriks Ukuran & Total Jumlah (Pcs)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-300">
                    Total: {quote.totalQty} pcs
                  </span>
                  {quote.totalJumboSurcharge > 0 && (
                    <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      Jumbo +{formatRupiah(quote.totalJumboSurcharge)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] text-zinc-500 mr-1">Preset Cepat:</span>
                <button
                  type="button"
                  onClick={() => handleSetPresetQty(12)}
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-zinc-300 text-[11px] transition-all"
                >
                  +12 Lusin
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPresetQty(24)}
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-zinc-300 text-[11px] transition-all"
                >
                  +24 Grosir
                </button>
                <button
                  type="button"
                  onClick={() => handleSetPresetQty(50)}
                  className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-lg text-zinc-300 text-[11px] transition-all"
                >
                  +50 Partai
                </button>
                <button
                  type="button"
                  onClick={() => setSizeQuantities({ S: 0, M: 0, L: 1, XL: 0, '2XL': 0, '3XL': 0 })}
                  className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg text-rose-300 text-[11px] transition-all"
                >
                  Reset
                </button>
              </div>

              {/* Size Steppers Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
                {SIZES.map((size) => {
                  const qty = sizeQuantities[size] || 0;
                  const isJumbo = size === '2XL' || size === '3XL';

                  return (
                    <div
                      key={size}
                      className={`p-2.5 rounded-xl border text-center flex flex-col justify-between space-y-2 ${
                        qty > 0 
                          ? 'bg-emerald-500/5 border-emerald-500/30' 
                          : 'bg-black/30 border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-white">{size}</span>
                        {isJumbo && (
                          <span className="text-[9px] text-amber-400 font-mono">
                            {size === '2XL' ? '+5k' : '+10k'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSizeChange(size, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 flex items-center justify-center text-zinc-300 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-sm text-white w-6 text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSizeChange(size, 1)}
                          className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-zinc-300 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* PARAM 4: IDENTITAS CALON PEMESAN */}
            <Card className="p-5 bg-[#121215] border-white/[0.08] rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>4. Data Calon Pemesan (Untuk Follow-up WA)</span>
                </div>
                <span className="text-[11px] text-zinc-500">Opsional tapi disarankan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Nama Lengkap / Komunitas</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Dimas Agency"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Nomor WhatsApp (08xxx)</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-400">Kota / Wilayah Kirim</label>
                  <input
                    type="text"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Contoh: Bandung"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400/50"
                  />
                </div>
              </div>
            </Card>

          </div>

          {/* RIGHT COLUMN: WHATSAPP PROPOSAL & KANBAN BRIDGE (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            <Card className="p-5 bg-[#121215] border-white/[0.08] rounded-2xl flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-sm">WhatsApp Sales Proposal</span>
                  </div>
                  {userHasEditedText && (
                    <button
                      onClick={handleResetText}
                      className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  )}
                </div>

                {/* Template Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/40 border border-white/[0.06] rounded-xl">
                  <button
                    type="button"
                    onClick={() => handleTemplateSwitch('detailed_quote')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                      activeWaTemplate === 'detailed_quote'
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Penawaran
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateSwitch('dp_invoice')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                      activeWaTemplate === 'dp_invoice'
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Tagihan DP 50%
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTemplateSwitch('final_balance')}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                      activeWaTemplate === 'final_balance'
                        ? 'bg-amber-400 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Pelunasan
                  </button>
                </div>

                {/* Live Editable Textarea */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>Draf Pesan Siap Kirim (Bisa diedit manual):</span>
                    <span>{displayWaText.length} karakter</span>
                  </div>
                  <textarea
                    rows={12}
                    value={displayWaText}
                    onChange={handleTextChange}
                    className="w-full p-3 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-zinc-200 focus:outline-none focus:border-emerald-400/60 leading-relaxed resize-y"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
                
                {/* Send via WA */}
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Kirim ke WhatsApp (wa.me)
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleCopyChat}
                    variant="outline"
                    className="h-10 bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Tersalin!' : 'Salin Teks'}
                  </Button>

                  <Button
                    onClick={handlePrintSlip}
                    variant="outline"
                    className="h-10 bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-zinc-300 hover:text-white text-xs rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-sky-400" />
                    Cetak Slip
                  </Button>
                </div>

                {/* Direct Kanban Bridge Button */}
                <div className="pt-2">
                  <Button
                    onClick={handlePushToKanban}
                    disabled={isSubmittingOrder}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold h-11 text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isSubmittingOrder ? 'Memproses Pesanan...' : '⚡ Masukkan ke Antrean Kanban'}
                  </Button>

                  {createdOrderNumber && (
                    <div className="mt-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Order #{createdOrderNumber} aktif!</span>
                      </div>
                      <button
                        onClick={() => navigate('/kanban')}
                        className="text-[11px] font-semibold text-white hover:underline flex items-center gap-1"
                      >
                        Buka Kanban <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

              </div>

            </Card>

            {/* Financial Summary Card (CFO Audit) */}
            <Card className="p-4 bg-black/40 border border-white/[0.08] rounded-2xl space-y-2 text-xs">
              <div className="font-semibold text-zinc-300 flex items-center justify-between">
                <span>Rincian Struktur Biaya Proyek</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${quote.cfoBadgeColor}`}>
                  {quote.cfoStatusLabel}
                </span>
              </div>
              <div className="divide-y divide-white/[0.04] pt-1 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between py-1 text-zinc-400">
                  <span>Biaya Bahan Kaos ({quote.totalQty} pcs):</span>
                  <span>{formatRupiah(quote.totalBlankCost)}</span>
                </div>
                <div className="flex justify-between py-1 text-zinc-400">
                  <span>Biaya Cetak DTF ({quote.activePlacements.length} titik):</span>
                  <span>{formatRupiah(quote.totalDtfCost)}</span>
                </div>
                <div className="flex justify-between py-1 text-zinc-400">
                  <span>Ongkos Press & Listrik:</span>
                  <span>{formatRupiah(quote.totalPressAndOverhead)}</span>
                </div>
                <div className="flex justify-between py-1 text-zinc-400">
                  <span>Kemasan ({quote.selectedPackaging.name.split(' (')[0]}):</span>
                  <span>{formatRupiah(quote.totalPackagingCost)}</span>
                </div>
                <div className="flex justify-between py-1 text-white font-bold">
                  <span>Total HPP Riil Pokok:</span>
                  <span>{formatRupiah(quote.totalProductionCost)}</span>
                </div>
              </div>
            </Card>

          </div>

        </div>

        {/* PRINT-ONLY DIGITAL QUOTATION SLIP LAYOUT */}
        <div className="hidden print:block p-8 bg-white text-black space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-start border-b-2 border-black pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight">TEESTOCK APPAREL x MULTIGRAPH</h1>
              <p className="text-xs text-gray-600">Holding Percetakan & Curated Merch House</p>
              <p className="text-xs text-gray-600">Jl. Balai Pustaka / Kawasan Percetakan Senen, Jakarta</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono">SURAT PENAWARAN RESMI</span>
              <p className="text-xs text-gray-600">Tanggal: {new Date().toLocaleDateString('id-ID')}</p>
              <p className="text-xs text-gray-600">Ref: TS-QUO-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-300 pb-4">
            <div>
              <p className="font-bold text-gray-700">DITUJUKAN KEPADA:</p>
              <p className="text-sm font-bold">{customerName || 'Pelanggan Terhormat'}</p>
              <p>Kontak: {customerPhone || '-'}</p>
              <p>Kota: {customerCity || '-'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-700">SPESIFIKASI PESANAN:</p>
              <p>Garmen: <strong>{quote.garment?.name}</strong></p>
              <p>Warna: <strong>{quote.garmentColor}</strong></p>
              <p>Kemasan: <strong>{quote.selectedPackaging?.name}</strong></p>
            </div>
          </div>

          <table className="w-full text-xs text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="p-2 border border-gray-300">Rincian Item</th>
                <th className="p-2 border border-gray-300">Titik Sablon</th>
                <th className="p-2 border border-gray-300 text-center">Jumlah (Qty)</th>
                <th className="p-2 border border-gray-300 text-right">Harga Satuan</th>
                <th className="p-2 border border-gray-300 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-gray-300">
                  <div className="font-bold">{quote.garment?.name} ({quote.garmentColor})</div>
                  <div className="text-[10px] text-gray-500">
                    Rincian Ukuran: {Object.entries(quote.sizeQuantities).filter(([_, q]) => q > 0).map(([s, q]) => `${s}:${q}`).join(', ')}
                  </div>
                </td>
                <td className="p-2 border border-gray-300">
                  {quote.activePlacements.map(p => p.name).join(', ')}
                </td>
                <td className="p-2 border border-gray-300 text-center font-bold">
                  {quote.totalQty} pcs
                </td>
                <td className="p-2 border border-gray-300 text-right font-mono">
                  {formatRupiah(quote.recommendedUnitPrice)}
                </td>
                <td className="p-2 border border-gray-300 text-right font-mono font-bold">
                  {formatRupiah(quote.totalPrice)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-black font-bold">
                <td colSpan={4} className="p-2 text-right">TOTAL TAGIHAN PROYEK:</td>
                <td className="p-2 text-right font-mono">{formatRupiah(quote.totalPrice)}</td>
              </tr>
              <tr className="text-gray-700">
                <td colSpan={4} className="p-2 text-right">Uang Muka Wajib (DP 50% Produksi):</td>
                <td className="p-2 text-right font-mono font-bold">{formatRupiah(quote.downPayment)}</td>
              </tr>
              <tr className="text-gray-700">
                <td colSpan={4} className="p-2 text-right">Sisa Pelunasan Sebelum Pengiriman:</td>
                <td className="p-2 text-right font-mono">{formatRupiah(quote.remainingPayment)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="border border-gray-300 p-4 rounded text-xs space-y-1">
            <p className="font-bold">Ketentuan Pembayaran & Garansi:</p>
            <p>1. Produksi dimulai setelah DP 50% terverifikasi di rekening BCA Bisnis 522-033-4421 a.n TeeStock Studio.</p>
            <p>2. Estimasi pengerjaan: 2-3 hari kerja sejak persetujuan proofing desain dan DP.</p>
            <p>3. Garansi 100% ganti baru jika terdapat cacat jahitan atau sablon luntur saat pencucian pertama (wajib video unboxing).</p>
          </div>

          <div className="flex justify-between pt-8 text-xs text-center">
            <div className="w-48">
              <p>Disetujui oleh Pemesan,</p>
              <div className="h-16 border-b border-black mt-2"></div>
              <p className="mt-1">({customerName || 'Nama Pemesan'})</p>
            </div>
            <div className="w-48">
              <p>Hormat kami,</p>
              <div className="h-16 border-b border-black mt-2"></div>
              <p className="mt-1">(TeeStock Production Studio)</p>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
