import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Copy, 
  Check, 
  ScrollText, 
  Package, 
  Sparkles, 
  Plus, 
  Minus, 
  Trash2, 
  Zap, 
  RotateCcw,
  CheckCircle2,
  Box,
  Flame,
  Download,
  ShieldCheck,
  Thermometer,
  Layers,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  calculateAccurateGangSheet, 
  getGangSheetKpis, 
  exportGangSheetCutListCsv, 
  generateVendorWhatsAppText 
} from '../../services/gangSheetApi';
import { formatRupiah } from '../../utils/formatters';
import { ProcurementIntakeModal } from '../../components/admin/ProcurementIntakeModal';

export function GangSheetPage() {
  const { 
    orders, 
    inventory, 
    restockDtfBatchAction, 
    advanceOrderStatus, 
    showToast, 
    getDtfFilmStatus,
    addProcurement
  } = useAdmin();

  const [copied, setCopied] = useState(false);
  const [copiedPackaging, setCopiedPackaging] = useState(false);
  const [bufferItems, setBufferItems] = useState([]);
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);

  // Packaging request state for MultiGraph
  const [stickerQty, setStickerQty] = useState(100);
  const [thankYouQty, setThankYouQty] = useState(100);
  const [hangtagQty, setHangtagQty] = useState(100);

  // Filter orders that need DTF printing:
  // (Either in 'dtf' status, or in 'pending'/'pending_payment' where studio film is NOT yet ready, excluding plain blanks)
  const dtfOrders = orders.filter(o => 
    (o.status === 'dtf' || ((o.status === 'pending' || o.status === 'pending_payment') && !getDtfFilmStatus(o.sku)?.isReady)) &&
    !o.sku?.startsWith("TS-BLK") &&
    o.garment !== "blank"
  );

  const gangSheet = useMemo(() => {
    return calculateAccurateGangSheet(dtfOrders, bufferItems);
  }, [dtfOrders, bufferItems]);

  const kpis = useMemo(() => {
    return getGangSheetKpis(gangSheet);
  }, [gangSheet]);

  const waText = useMemo(() => {
    return generateVendorWhatsAppText(gangSheet);
  }, [gangSheet]);

  // Available buffer designs from inventory.dtf_films
  const availableFilms = inventory?.dtf_films || {};

  // Add / modify buffer item
  const handleAddBuffer = (sku, delta = 1) => {
    const film = availableFilms[sku];
    if (!film) return;

    setBufferItems(prev => {
      const existingIdx = prev.findIndex(it => it.sku === sku);
      if (existingIdx >= 0) {
        const next = [...prev];
        const newQty = next[existingIdx].qty + delta;
        if (newQty <= 0) {
          return next.filter((_, idx) => idx !== existingIdx);
        }
        next[existingIdx] = { ...next[existingIdx], qty: newQty };
        return next;
      } else {
        if (delta <= 0) return prev;
        return [
          ...prev,
          {
            sku,
            name: film.name,
            size: film.size || 'A3 (30x40 cm)',
            unitCost: film.unitCost || 12000,
            qty: delta,
            category: film.category || 'graphic'
          }
        ];
      }
    });
  };

  const handleRemoveBuffer = (sku) => {
    setBufferItems(prev => prev.filter(it => it.sku !== sku));
  };

  // Smart Auto-Fill to perfectly maximize the 1-meter (or current meter) mark
  const handleAutoFillMeter = () => {
    const candidates = Object.entries(availableFilms)
      .filter(([sku]) => !sku.startsWith('ACC-'))
      .sort((a, b) => (a[1].ready || 0) - (b[1].ready || 0));

    const accCandidate = Object.entries(availableFilms)
      .find(([sku]) => sku === 'ACC-LABEL-NECK') || [
        'ACC-LABEL-NECK', 
        { name: 'Label Kerah Dalam TeeStock', size: 'Kecil (6x3 cm)', unitCost: 1000, category: 'accessory' }
      ];

    let currentBuffer = [...bufferItems];
    let targetMeters = Math.max(1.0, calculateAccurateGangSheet(dtfOrders, currentBuffer).meters);
    let iterations = 0;

    while (iterations < 25) {
      iterations++;
      const sim = calculateAccurateGangSheet(dtfOrders, currentBuffer);
      if (sim.remainingCm < 8) break; // no room even for small accessory

      // Try adding an A3 candidate design
      const nextCandidate = candidates[(iterations - 1) % candidates.length];
      if (nextCandidate && sim.remainingCm >= 30) {
        const testBuffer = [...currentBuffer];
        const existingIdx = testBuffer.findIndex(it => it.sku === nextCandidate[0]);
        if (existingIdx >= 0) {
          testBuffer[existingIdx] = { ...testBuffer[existingIdx], qty: testBuffer[existingIdx].qty + 1 };
        } else {
          testBuffer.push({
            sku: nextCandidate[0],
            name: nextCandidate[1].name,
            size: nextCandidate[1].size || 'A3 (30x40 cm)',
            unitCost: nextCandidate[1].unitCost || 12000,
            qty: 1,
            category: 'graphic'
          });
        }
        const testSim = calculateAccurateGangSheet(dtfOrders, testBuffer);
        if (testSim.meters <= targetMeters) {
          currentBuffer = testBuffer;
          continue;
        }
      }

      // Try adding neck labels (8 pcs takes ~5 cm)
      if (sim.remainingCm >= 5) {
        const testBuffer = [...currentBuffer];
        const existingIdx = testBuffer.findIndex(it => it.sku === accCandidate[0]);
        if (existingIdx >= 0) {
          testBuffer[existingIdx] = { ...testBuffer[existingIdx], qty: testBuffer[existingIdx].qty + 8 };
        } else {
          testBuffer.push({
            sku: accCandidate[0],
            name: accCandidate[1].name,
            size: accCandidate[1].size || 'Kecil (6x3 cm)',
            unitCost: accCandidate[1].unitCost || 1000,
            qty: 8,
            category: 'accessory'
          });
        }
        const testSim = calculateAccurateGangSheet(dtfOrders, testBuffer);
        if (testSim.meters <= targetMeters) {
          currentBuffer = testBuffer;
          continue;
        }
      }

      break;
    }

    setBufferItems(currentBuffer);
    showToast("⚡ Roll otomatis diisi maksimal dengan desain buffer terpopuler!");
  };

  // Restock buffer items into inventory
  const handleRecordBufferToStock = () => {
    if (bufferItems.length === 0) {
      showToast("⚠️ Belum ada item buffer yang dipilih untuk dicatat ke stok studio!", "warning");
      return;
    }

    restockDtfBatchAction(bufferItems);
    setBufferItems([]);
  };

  // Advance all active 'dtf' orders to 'press'
  const handleAdvanceActiveOrdersToPress = () => {
    const ordersToAdvance = dtfOrders.filter(o => o.status === 'dtf');
    if (ordersToAdvance.length === 0) {
      showToast("Tidak ada pesanan aktif berstatus antrean Cetak DTF", "info");
      return;
    }
    ordersToAdvance.forEach(o => {
      advanceOrderStatus(o.id, 'press');
    });
    showToast(`✅ ${ordersToAdvance.length} pesanan aktif dipindahkan ke Antrean Heat Press!`);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(waText);
    setCopied(true);
    showToast("✅ Format pemesanan DTF disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  // MultiGraph Packaging Order Text
  const packagingText = `Halo MultiGraph! Mau buat pesanan internal percetakan kemasan untuk TeeStock:

📦 *Rincian Kebutuhan Cetak Packaging:*
1. Stiker Logo Polymailer (Vinyl Matte 5x5 cm Kiss-Cut): *${stickerQty} pcs*
2. Thank You Card & Care Guide (Art Paper 260gsm A6 2 Sisi): *${thankYouQty} pcs*
3. Hangtag Pakaian TeeStock (Art Carton 310gsm + Lubang 4x9 cm): *${hangtagQty} pcs*
4. Cetak Film DTF Roll 60 cm: *${gangSheet.meters} Meter* (${gangSheet.totalQty} Kaos)

Mohon dijadwalkan ke antrean mesin cetak MultiGraph. Terima kasih!`;

  const handleCopyPackagingText = () => {
    navigator.clipboard.writeText(packagingText);
    setCopiedPackaging(true);
    showToast("✅ Format pesanan kemasan MultiGraph disalin!");
    setTimeout(() => setCopiedPackaging(false), 2500);
  };

  return (
    <div>
      <AdminTopbar
        title="Gang Sheet DTF 58 cm &amp; Pre-Press"
        subtitle="Kalkulasi layout cetak roll DTF meteran lebar 58 cm, safe margin 1.5 cm, alokasi buffer stock, dan kemasan MultiGraph"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* 4 Executive KPI Ribbon Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Kebutuhan Lembar */}
          <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Total Cetak Film</span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {kpis.totalQty} <span className="text-xs font-normal text-zinc-400">Lembar</span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                <span className="text-zinc-300 font-medium">{kpis.orderQty} Order Aktif</span>
                <span>•</span>
                <span className="text-indigo-400 font-medium">{kpis.bufferQty} Buffer</span>
              </div>
            </div>
          </div>

          {/* Card 2: Panjang Roll & Utilisasi */}
          <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Panjang Roll DTF</span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ScrollText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-extrabold font-mono flex items-center gap-2 text-white">
                <span>{kpis.meters} Meter</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {kpis.usedPct}% Padat
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                {gangSheet.usedCm} cm dari {gangSheet.rollCapacityCm} cm kapasitas
              </div>
            </div>
          </div>

          {/* Card 3: Estimasi Biaya Vendor */}
          <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Estimasi Tagihan Vendor</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Printer className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {formatRupiah(kpis.totalCost)}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                @Rp 30.000/m • ~{formatRupiah(kpis.costPerPcs)} / pcs jadi
              </div>
            </div>
          </div>

          {/* Card 4: Nilai Persediaan Buffer */}
          <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400">Nilai Aset Buffer Baru</span>
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Box className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {formatRupiah(kpis.bufferAssetValue)}
              </div>
              <div className="text-[11px] text-zinc-400 mt-1">
                +{kpis.bufferQty} lembar siap menambah persediaan studio
              </div>
            </div>
          </div>
        </div>

        {/* Roll Meter Capacity & Utilization Progress Bar */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Kapasitas Roll {gangSheet.meters} Meter ({gangSheet.rollCapacityCm} cm)
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/60 border border-white/10 text-amber-400 font-bold">
                  {kpis.usedPct}% Terisi
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {gangSheet.remainingCm > 0 ? (
                  <span>
                    Masih tersisa <strong className="text-amber-400">{gangSheet.remainingCm} cm ruang kosong</strong> di meteran berjalan. Isi dengan buffer desain agar biaya cetak optimal!
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    🎯 Roll terisi optimal! Tidak ada ruang bahan yang terbuang sia-sia.
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {gangSheet.remainingCm > 0 && (
                <Button 
                  size="sm" 
                  variant="primary" 
                  icon={Zap} 
                  onClick={handleAutoFillMeter}
                >
                  ⚡ Auto-Fill Pas {gangSheet.meters} Meter
                </Button>
              )}
              {bufferItems.length > 0 && (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  icon={RotateCcw} 
                  onClick={() => setBufferItems([])}
                >
                  Reset Buffer
                </Button>
              )}
              <button
                type="button"
                onClick={() => exportGangSheetCutListCsv(gangSheet)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Unduh rekap daftar potong (Cut List) ke CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Cut List CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setIsProcurementModalOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Terbitkan nota PO pengadaan roll DTF ke buku kas"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Terbitkan Nota PO DTF</span>
              </button>
            </div>
          </div>

          <div className="w-full bg-[#09090B] rounded-full h-3.5 border border-white/10 overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${kpis.usedPct}%` }}
            />
          </div>
        </div>

        {/* COO Guardrail & Pre-Flight Checklist Banner */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 text-xs font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Standar Operasional COO: Pre-Flight DTF &amp; Heat Press In-House</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="font-bold text-sky-400 block flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5" /> Suhu &amp; Durasi Press
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                <strong>155°C – 160°C</strong> selama <strong>15 detik</strong> dengan tekanan kuat (4–5 bar).
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="font-bold text-amber-400 block flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Metode Cold Peel Wajib
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Wajib tunggu film <strong>dingin total</strong> (30–60 dtk) sebelum dikelupas di sudut 45°.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="font-bold text-emerald-400 block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pre-Flight Resolusi 300 DPI
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Skala 1:1, background transparan 100%, batas garis minimum 0.5 mm (1.5 pt).
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="font-bold text-purple-400 block flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Finishing Curing 5 Detik
              </span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Press ulang 5 detik beralas sheet teflon untuk mematangkan tinta ke serat kaos.
              </p>
            </div>
          </div>
        </div>

        {/* Two Columns: Buffer Builder & Roll Layout Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Order Requirements & Buffer Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* A. Active Orders */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>A. Kebutuhan Pesanan Konsumen Aktif</span>
                  </h3>
                  <p className="text-xs text-zinc-400">Pesanan masuk yang belum memiliki stok cetak DTF siap pakai</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/60 border border-white/10 text-sky-400">
                  {dtfOrders.length} Pesanan
                </span>
              </div>

              {dtfOrders.length === 0 ? (
                <div className="p-6 bg-[#09090B] border border-white/[0.06] rounded-xl text-center text-xs text-zinc-400">
                  Semua pesanan aktif sudah memiliki lembar DTF ready di studio atau belum ada order baru.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {dtfOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="p-3 bg-[#09090B] border border-white/[0.06] rounded-xl flex items-center justify-between text-xs hover:border-white/20 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sky-400 font-bold">{order.id}</span>
                          <span className="font-bold text-white truncate max-w-[200px]">{order.productName}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {order.garment} &bull; {order.color} &bull; Size {order.size} (Qty: {order.qty || 1} pcs)
                        </div>
                      </div>
                      <Badge variant={order.status === 'dtf' ? 'warning' : 'info'}>
                        {order.status === 'dtf' ? 'Antrean DTF' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* B. Buffer Designs Selector */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Box className="w-4 h-4 text-sky-400" />
                    <span>B. Desain Pengisi Roll 1 Meter (Buffer Stok Studio)</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Sisa ruang roll 1 meter dicetak dengan desain terlaris &amp; disimpan sebagai aset persediaan
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/60 border border-white/10 text-amber-400">
                  {kpis.bufferQty} Lembar Dipilih
                </span>
              </div>

              {/* Quick Add Grid */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Pilih Desain &amp; Aksesori Pengisi:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(availableFilms).map(([sku, film]) => {
                    const isAcc = sku.startsWith('ACC-');
                    const added = bufferItems.find(it => it.sku === sku)?.qty || 0;

                    return (
                      <div 
                        key={sku}
                        className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                          added > 0 
                            ? 'bg-sky-500/10 border-sky-500/40' 
                            : 'bg-[#09090B] border-white/[0.06] hover:border-white/20'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-xs text-white truncate">{film.name}</div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-2">
                            <span>{film.size || 'A3 (28x40 cm)'}</span>
                            <span>&bull;</span>
                            <span className="font-mono text-zinc-300">Stok: {film.ready || 0} lbr</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {added > 0 && (
                            <>
                              <button
                                onClick={() => handleAddBuffer(sku, isAcc ? -8 : -1)}
                                className="w-7 h-7 rounded-lg bg-[#121215] border border-white/10 hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-white">
                                {added}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => handleAddBuffer(sku, isAcc ? 8 : 1)}
                            className="px-2 py-1 rounded-lg bg-sky-500 text-zinc-950 font-bold text-xs hover:bg-sky-400 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isAcc ? "+8" : "+1"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Buffer Items Summary Table */}
              {bufferItems.length > 0 && (
                <div className="pt-3 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white">
                    <span>Rincian Buffer yang Akan Dicatat ke Stok Studio:</span>
                    <span className="text-sky-400 font-mono">Total Aset: {formatRupiah(kpis.bufferAssetValue)}</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {bufferItems.map(item => (
                      <div 
                        key={item.sku}
                        className="p-2 bg-[#09090B] rounded-lg border border-white/[0.06] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[10px] text-sky-400 font-bold">{item.sku}</span>
                          <span className="text-zinc-200 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-white">{item.qty} lbr</span>
                          <span className="font-mono text-zinc-400 text-[11px]">
                            {formatRupiah((item.unitCost || 12000) * item.qty)}
                          </span>
                          <button
                            onClick={() => handleRemoveBuffer(item.sku)}
                            className="text-zinc-500 hover:text-rose-400 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Primary Restock Action Button */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <Button
                      className="flex-1"
                      variant="primary"
                      icon={CheckCircle2}
                      onClick={handleRecordBufferToStock}
                    >
                      📥 Catat Sisa Cetakan ke Stok Film DTF (+{kpis.bufferQty} lbr)
                    </Button>

                    {dtfOrders.some(o => o.status === 'dtf') && (
                      <Button
                        variant="secondary"
                        icon={Flame}
                        onClick={handleAdvanceActiveOrdersToPress}
                        title="Pindahkan semua order berstatus antrean DTF ke siap press"
                      >
                        🚀 Pindahkan Order ke Siap Press
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Roll Layout Simulation & WhatsApp Text */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Roll Simulation */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-sky-400" />
                Simulasi Roll 60 cm (Panjang {gangSheet.meters} Meter)
              </h3>
              <p className="text-xs text-zinc-400 mb-2">
                Layout nesting untuk memaksimalkan area cetak efektif 58 cm.
              </p>

              <div className="bg-[#09090B] border border-white/10 rounded-xl p-3 min-h-[220px] max-h-[340px] overflow-y-auto border-dashed space-y-2">
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono pb-2 border-b border-white/10">
                  <span>&larr; Lebar Roll 58 cm &rarr;</span>
                  <span>Panjang: {gangSheet.meters} Meter</span>
                </div>

                {gangSheet.items.length === 0 ? (
                  <div className="py-12 text-center text-xs text-zinc-500">
                    Roll masih kosong. Tambahkan order atau pilih desain buffer pengisi.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {gangSheet.orderItems.map((o, idx) => (
                      <div
                        key={`order-${idx}`}
                        className="bg-[#121215] border border-sky-500/40 rounded-lg p-2 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-sky-400 font-bold">{o.id}</span>
                          <span className="px-1 rounded bg-sky-500/20 text-sky-300 font-semibold text-[9px]">ORDER</span>
                        </div>
                        <div className="font-bold text-white truncate">{o.productName}</div>
                        <div className="text-[10px] text-zinc-400">{o.garment} ({o.color} {o.size})</div>
                      </div>
                    ))}

                    {gangSheet.bufferItems.map((b, idx) => (
                      <div
                        key={`buffer-${idx}`}
                        className="bg-[#121215] border border-amber-500/40 rounded-lg p-2 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-amber-400 font-bold">{b.sku}</span>
                          <span className="px-1 rounded bg-amber-500/20 text-amber-300 font-semibold text-[9px]">BUFFER</span>
                        </div>
                        <div className="font-bold text-white truncate">{b.name}</div>
                        <div className="text-[10px] text-zinc-400">{b.size} &bull; Qty: {b.qty} lbr</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Vendor Message Output */}
            <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 flex flex-col space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Printer className="w-4 h-4 text-amber-400" />
                    Format Teks Order Vendor DTF Meteran
                  </h3>
                  <p className="text-xs text-zinc-400">Otomatis memisahkan pesanan aktif dan buffer stok</p>
                </div>

                <Button
                  size="sm"
                  variant={copied ? "cream" : "primary"}
                  icon={copied ? Check : Copy}
                  onClick={handleCopyText}
                >
                  {copied ? "Tersalin!" : "Salin Format"}
                </Button>
              </div>

              <textarea
                readOnly
                value={waText}
                className="w-full flex-1 min-h-[220px] bg-[#09090B] border border-white/10 rounded-xl p-3 font-mono text-xs text-zinc-200 leading-relaxed focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* MultiGraph Synergy: Packaging & Brand Assets Procurement */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase font-mono mb-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Sinergi Bisnis MultiGraph</span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <span>Pengadaan Kemasan &amp; Material Cetak via MultiGraph</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Hemat hingga 40% biaya kemasan dengan mencetak stiker polymailer, hangtag, dan kartu ucapan melalui unit percetakan sendiri.
              </p>
            </div>

            <Button
              size="sm"
              variant="primary"
              icon={copiedPackaging ? Check : Copy}
              onClick={handleCopyPackagingText}
            >
              {copiedPackaging ? "Berhasil Disalin!" : "Salin Order ke MultiGraph"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-[#09090B] border border-white/[0.06] rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-white">Stiker Logo Polymailer</strong>
                <span className="text-[10px] text-zinc-400">Vinyl 5x5 cm</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={stickerQty}
                  onChange={(e) => setStickerQty(Number(e.target.value))}
                  className="w-24 bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
                />
                <span className="text-zinc-400">pcs</span>
              </div>
              <p className="text-[10px] text-zinc-400">Ditempel pada plastik kemasan luar pengiriman</p>
            </div>

            <div className="p-3.5 bg-[#09090B] border border-white/[0.06] rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-white">Thank You &amp; Care Card</strong>
                <span className="text-[10px] text-zinc-400">A6 Art Paper 260g</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={thankYouQty}
                  onChange={(e) => setThankYouQty(Number(e.target.value))}
                  className="w-24 bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
                />
                <span className="text-zinc-400">pcs</span>
              </div>
              <p className="text-[10px] text-zinc-400">Petunjuk cara cuci dan kupon diskon repeat order</p>
            </div>

            <div className="p-3.5 bg-[#09090B] border border-white/[0.06] rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-white">Hangtag Pakaian</strong>
                <span className="text-[10px] text-zinc-400">Art Carton 310g</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={hangtagQty}
                  onChange={(e) => setHangtagQty(Number(e.target.value))}
                  className="w-24 bg-[#121215] border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
                />
                <span className="text-zinc-400">pcs</span>
              </div>
              <p className="text-[10px] text-zinc-400">Label gantung berlogo siluet tumpukan kaos TeeStock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Procurement Intake Modal (Direct Bridge from Gang Sheet) */}
      <ProcurementIntakeModal
        isOpen={isProcurementModalOpen}
        onClose={() => setIsProcurementModalOpen(false)}
        onSave={addProcurement}
        initialTab="dtf_roll"
      />
    </div>
  );
}
