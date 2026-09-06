import React, { useState } from 'react';
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
  ArrowRight, 
  Zap, 
  RotateCcw,
  CheckCircle2,
  Box,
  Layers,
  Flame
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { calculateGangSheet, generateVendorWhatsAppText } from '../../utils/dtfPlanner';
import { formatRupiah } from '../../utils/formatters';

export function GangSheetPage() {
  const { 
    orders, 
    inventory, 
    restockDtfBatchAction, 
    advanceOrderStatus, 
    showToast, 
    getDtfFilmStatus 
  } = useAdmin();

  const [copied, setCopied] = useState(false);
  const [copiedPackaging, setCopiedPackaging] = useState(false);
  const [bufferItems, setBufferItems] = useState([]);

  // Packaging request state for MultiGraph
  const [stickerQty, setStickerQty] = useState(100);
  const [thankYouQty, setThankYouQty] = useState(100);
  const [hangtagQty, setHangtagQty] = useState(100);

  // Filter orders that need DTF printing:
  // (Either in 'dtf' status, or in 'pending' where studio film is NOT yet ready, excluding plain blanks)
  const dtfOrders = orders.filter(o => 
    (o.status === 'dtf' || (o.status === 'pending' && !getDtfFilmStatus(o.sku)?.isReady)) &&
    !o.sku?.startsWith("TS-BLK") &&
    o.garment !== "blank"
  );

  const gangSheet = calculateGangSheet(dtfOrders, bufferItems);
  const waText = generateVendorWhatsAppText(gangSheet);

  const totalBufferQty = bufferItems.reduce((sum, it) => sum + (Number(it.qty) || 1), 0);
  const bufferAssetValue = bufferItems.reduce((sum, it) => sum + ((it.unitCost || 12000) * (Number(it.qty) || 1)), 0);

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
    let targetMeters = Math.max(1.0, calculateGangSheet(dtfOrders, currentBuffer).meters);
    let iterations = 0;

    while (iterations < 25) {
      iterations++;
      const sim = calculateGangSheet(dtfOrders, currentBuffer);
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
        const testSim = calculateGangSheet(dtfOrders, testBuffer);
        if (testSim.meters <= targetMeters) {
          currentBuffer = testBuffer;
          continue;
        }
      }

      // Try adding neck labels (6 pcs takes ~8 cm)
      if (sim.remainingCm >= 8) {
        const testBuffer = [...currentBuffer];
        const existingIdx = testBuffer.findIndex(it => it.sku === accCandidate[0]);
        if (existingIdx >= 0) {
          testBuffer[existingIdx] = { ...testBuffer[existingIdx], qty: testBuffer[existingIdx].qty + 6 };
        } else {
          testBuffer.push({
            sku: accCandidate[0],
            name: accCandidate[1].name,
            size: accCandidate[1].size || 'Kecil (6x3 cm)',
            unitCost: accCandidate[1].unitCost || 1000,
            qty: 6,
            category: 'accessory'
          });
        }
        const testSim = calculateGangSheet(dtfOrders, testBuffer);
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

  const usedPct = gangSheet.rollCapacityCm > 0 
    ? Math.min(100, Math.round((gangSheet.usedCm / gangSheet.rollCapacityCm) * 100))
    : 0;

  return (
    <div>
      <AdminTopbar
        title="Gang Sheet DTF &amp; MultiGraph Bridge"
        subtitle="Kalkulasi layout cetak roll DTF lebar 60 cm, alokasi buffer stock 1 meter, dan pengadaan kemasan"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-teal/20 text-ts-teal flex items-center justify-center font-bold">
              PCS
            </div>
            <div>
              <div className="text-xs text-ts-muted">Total Cetak Film</div>
              <div className="font-mono text-xl font-bold text-ts-krem">{gangSheet.totalQty} pcs</div>
              <div className="text-[10px] text-ts-muted">{dtfOrders.length} order + {totalBufferQty} buffer</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center font-bold">
              MTR
            </div>
            <div>
              <div className="text-xs text-ts-muted">Panjang Roll DTF</div>
              <div className="font-mono text-xl font-bold text-ts-mustard">{gangSheet.meters} Meter</div>
              <div className="text-[10px] text-ts-muted">{gangSheet.usedCm} cm / {gangSheet.rollCapacityCm} cm</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-green/20 text-ts-green flex items-center justify-center font-bold">
              RP
            </div>
            <div>
              <div className="text-xs text-ts-muted">Estimasi Biaya Vendor</div>
              <div className="font-mono text-xl font-bold text-ts-green">{formatRupiah(gangSheet.totalCost)}</div>
              <div className="text-[10px] text-ts-muted">Tarif @Rp 30.000 / meter</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center font-bold">
              HPP
            </div>
            <div>
              <div className="text-xs text-ts-muted">Biaya Sablon Rata-rata</div>
              <div className="font-mono text-xl font-bold text-ts-terracotta">{formatRupiah(gangSheet.costPerPcs)} / pcs</div>
              <div className="text-[10px] text-ts-muted">Makin padat makin hemat</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3 bg-ts-surface border-ts-teal/30">
            <div className="w-10 h-10 rounded-xl bg-ts-teal/20 text-ts-teal flex items-center justify-center font-bold">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-ts-muted">Nilai Aset Buffer Baru</div>
              <div className="font-mono text-xl font-bold text-ts-teal">{formatRupiah(bufferAssetValue)}</div>
              <div className="text-[10px] text-ts-teal font-semibold">+{totalBufferQty} lembar sisa cetak</div>
            </div>
          </Card>
        </div>

        {/* Roll Meter Capacity & Utilization Progress Bar */}
        <div className="bg-ts-surface border border-ts-border rounded-2xl p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-ts-krem">
                  Kapasitas Roll {gangSheet.meters} Meter ({gangSheet.rollCapacityCm} cm)
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-ts-hitam text-ts-mustard font-bold">
                  {usedPct}% Terisi
                </span>
              </div>
              <p className="text-xs text-ts-muted mt-0.5">
                {gangSheet.remainingCm > 0 ? (
                  <span>
                    Masih tersisa <strong className="text-ts-mustard">{gangSheet.remainingCm} cm ruang kosong</strong> di meteran berjalan. Isi dengan buffer desain agar biaya cetak maksimal!
                  </span>
                ) : (
                  <span className="text-ts-green font-semibold">
                    🎯 Roll terisi optimal! Tidak ada ruang bahan yang terbuang sia-sia.
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
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
            </div>
          </div>

          <div className="w-full bg-ts-hitam rounded-full h-3.5 border border-ts-borderDim overflow-hidden flex">
            <div 
              className="bg-gradient-to-r from-ts-teal to-ts-green h-full transition-all duration-300"
              style={{ width: `${usedPct}%` }}
            />
          </div>
        </div>

        {/* Two Columns: Buffer Builder & Roll Layout Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Order Requirements & Buffer Selector */}
          <div className="lg:col-span-7 space-y-6">
            {/* A. Active Orders */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-ts-borderDim pb-3">
                <div>
                  <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                    <Printer className="w-4 h-4 text-ts-mustard" />
                    <span>A. Kebutuhan Pesanan Konsumen Aktif</span>
                  </h3>
                  <p className="text-xs text-ts-muted">Pesanan masuk yang belum memiliki stok cetak DTF siap pakai</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-ts-hitam text-ts-teal">
                  {dtfOrders.length} Pesanan
                </span>
              </div>

              {dtfOrders.length === 0 ? (
                <div className="p-4 bg-ts-hitam/50 border border-ts-borderDim rounded-xl text-center text-xs text-ts-muted">
                  Semua pesanan aktif sudah memiliki lembar DTF ready di studio atau belum ada order baru.
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {dtfOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-ts-teal font-bold">{order.id}</span>
                          <span className="font-bold text-ts-krem truncate max-w-[200px]">{order.productName}</span>
                        </div>
                        <div className="text-[11px] text-ts-muted mt-0.5">
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
            </Card>

            {/* B. Buffer Designs Selector */}
            <Card className="space-y-4">
              <div className="flex items-center justify-between border-b border-ts-borderDim pb-3">
                <div>
                  <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                    <Box className="w-4 h-4 text-ts-teal" />
                    <span>B. Desain Pengisi Roll 1 Meter (Buffer Stok Studio)</span>
                  </h3>
                  <p className="text-xs text-ts-muted">
                    Sisa ruang roll 1 meter dicetak dengan desain terlaris &amp; disimpan sebagai aset persediaan
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-ts-hitam text-ts-mustard">
                  {totalBufferQty} Lembar Dipilih
                </span>
              </div>

              {/* Quick Add Grid */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-ts-muted uppercase tracking-wider">
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
                            ? 'bg-ts-teal/10 border-ts-teal/40' 
                            : 'bg-ts-hitam/60 border-ts-borderDim hover:border-ts-border'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-xs text-ts-krem truncate">{film.name}</div>
                          <div className="text-[10px] text-ts-muted flex items-center gap-2">
                            <span>{film.size}</span>
                            <span>&bull;</span>
                            <span className="font-mono text-ts-krem/70">Stok: {film.ready} lbr</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {added > 0 && (
                            <>
                              <button
                                onClick={() => handleAddBuffer(sku, isAcc ? -6 : -1)}
                                className="w-7 h-7 rounded-lg bg-ts-surface border border-ts-border hover:bg-ts-border flex items-center justify-center text-ts-krem"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-mono font-bold text-xs text-ts-krem">
                                {added}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => handleAddBuffer(sku, isAcc ? 6 : 1)}
                            className="px-2 py-1 rounded-lg bg-ts-teal text-ts-hitam font-bold text-xs hover:bg-ts-tealHover flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>{isAcc ? "+6" : "+1"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected Buffer Items Summary Table */}
              {bufferItems.length > 0 && (
                <div className="pt-3 border-t border-ts-borderDim space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-ts-krem">
                    <span>Rincian Buffer yang Akan Dicatat ke Stok Studio:</span>
                    <span className="text-ts-teal font-mono">Total Aset: {formatRupiah(bufferAssetValue)}</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {bufferItems.map(item => (
                      <div 
                        key={item.sku}
                        className="p-2 bg-ts-hitam rounded-lg border border-ts-borderDim flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[10px] text-ts-teal font-bold">{item.sku}</span>
                          <span className="text-ts-krem truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-ts-krem">{item.qty} lbr</span>
                          <span className="font-mono text-ts-muted text-[11px]">
                            {formatRupiah((item.unitCost || 12000) * item.qty)}
                          </span>
                          <button
                            onClick={() => handleRemoveBuffer(item.sku)}
                            className="text-ts-muted hover:text-rose-400 p-1"
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
                      📥 Catat Sisa Cetakan ke Stok Film DTF (+{totalBufferQty} lbr)
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
            </Card>
          </div>

          {/* Right Column (5 cols): Roll Layout Simulation & WhatsApp Text */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Roll Simulation */}
            <Card>
              <h3 className="text-sm font-bold text-ts-krem mb-1 flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-ts-teal" />
                Simulasi Roll 60 cm (Panjang {gangSheet.meters} Meter)
              </h3>
              <p className="text-xs text-ts-muted mb-4">
                Layout 2 kolom berurutan untuk memaksimalkan area cetak lebar 58 cm.
              </p>

              <div className="bg-ts-hitam border border-ts-border rounded-xl p-3 min-h-[220px] max-h-[340px] overflow-y-auto border-dashed space-y-2">
                <div className="flex justify-between text-[10px] text-ts-muted font-mono pb-2 border-b border-ts-borderDim">
                  <span>&larr; Lebar Roll 60 cm &rarr;</span>
                  <span>Panjang: {gangSheet.meters} Meter</span>
                </div>

                {gangSheet.items.length === 0 ? (
                  <div className="py-12 text-center text-xs text-ts-muted">
                    Roll masih kosong. Tambahkan order atau pilih desain buffer pengisi.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {gangSheet.orderItems.map((o, idx) => (
                      <div
                        key={`order-${idx}`}
                        className="bg-ts-surface border border-ts-teal/50 rounded-lg p-2 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-ts-teal font-bold">{o.id}</span>
                          <span className="px-1 rounded bg-ts-teal/20 text-ts-teal font-semibold text-[9px]">ORDER</span>
                        </div>
                        <div className="font-bold text-ts-krem truncate">{o.productName}</div>
                        <div className="text-[10px] text-ts-muted">{o.garment} ({o.color} {o.size})</div>
                      </div>
                    ))}

                    {gangSheet.bufferItems.map((b, idx) => (
                      <div
                        key={`buffer-${idx}`}
                        className="bg-ts-hitam/80 border border-ts-mustard/50 rounded-lg p-2 text-xs space-y-1"
                      >
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-mono text-ts-mustard font-bold">{b.sku}</span>
                          <span className="px-1 rounded bg-ts-mustard/20 text-ts-mustard font-semibold text-[9px]">BUFFER</span>
                        </div>
                        <div className="font-bold text-ts-krem truncate">{b.name}</div>
                        <div className="text-[10px] text-ts-muted">{b.size} &bull; Qty: {b.qty} lbr</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* WhatsApp Vendor Message Output */}
            <Card className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                    <Printer className="w-4 h-4 text-ts-mustard" />
                    Format Teks Order Vendor DTF Meteran
                  </h3>
                  <p className="text-xs text-ts-muted">Otomatis memisahkan pesanan aktif dan buffer stok</p>
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
                className="w-full flex-1 min-h-[220px] bg-ts-hitam border border-ts-border rounded-xl p-3 font-mono text-xs text-ts-krem leading-relaxed focus:outline-none resize-none"
              />
            </Card>
          </div>
        </div>

        {/* MultiGraph Synergy: Packaging & Brand Assets Procurement */}
        <Card className="space-y-4 border-ts-mustard/30 bg-gradient-to-r from-ts-surface to-ts-hitam">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ts-borderDim pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-ts-mustard bg-ts-mustard/15 px-2 py-0.5 rounded uppercase font-mono mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Sinergi Bisnis #2 MultiGraph</span>
              </div>
              <h3 className="text-base font-bold text-ts-krem flex items-center gap-2">
                <Package className="w-5 h-5 text-ts-terracotta" />
                <span>Pengadaan Kemasan &amp; Material Cetak via MultiGraph</span>
              </h3>
              <p className="text-xs text-ts-muted mt-0.5">
                Hemat hingga 40% biaya kemasan dengan mencetak stiker polymailer, hangtag, dan kartu ucapan melalui lini bisnis percetakanmu sendiri.
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
            <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-ts-krem">Stiker Logo Polymailer</strong>
                <span className="text-[10px] text-ts-muted">Vinyl 5x5 cm</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={stickerQty}
                  onChange={(e) => setStickerQty(Number(e.target.value))}
                  className="w-24 bg-ts-surface border border-ts-border rounded-lg px-2.5 py-1 text-xs font-mono text-ts-krem focus:outline-none"
                />
                <span className="text-ts-muted">pcs</span>
              </div>
              <p className="text-[10px] text-ts-muted">Ditempel pada plastik kemasan luar pengiriman</p>
            </div>

            <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-ts-krem">Thank You &amp; Care Card</strong>
                <span className="text-[10px] text-ts-muted">A6 Art Paper 260g</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={thankYouQty}
                  onChange={(e) => setThankYouQty(Number(e.target.value))}
                  className="w-24 bg-ts-surface border border-ts-border rounded-lg px-2.5 py-1 text-xs font-mono text-ts-krem focus:outline-none"
                />
                <span className="text-ts-muted">pcs</span>
              </div>
              <p className="text-[10px] text-ts-muted">Petunjuk cara cuci dan kupon diskon repeat order</p>
            </div>

            <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-ts-krem">Hangtag Pakaian</strong>
                <span className="text-[10px] text-ts-muted">Art Carton 310g</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={hangtagQty}
                  onChange={(e) => setHangtagQty(Number(e.target.value))}
                  className="w-24 bg-ts-surface border border-ts-border rounded-lg px-2.5 py-1 text-xs font-mono text-ts-krem focus:outline-none"
                />
                <span className="text-ts-muted">pcs</span>
              </div>
              <p className="text-[10px] text-ts-muted">Label gantung berlogo siluet tumpukan kaos TeeStock</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

