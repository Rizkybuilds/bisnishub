import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  X,
  FileCheck,
  UserCheck
} from 'lucide-react';

export function StockOpnameModal({ isOpen, onClose, itemData, onSaveOpname }) {
  const [actualQty, setActualQty] = useState('');
  const [reason, setReason] = useState('');
  const [adminName, setAdminName] = useState('Rizky (Executive Founder)');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (itemData) {
      setActualQty(itemData.currentStock ?? 0);
      setReason('Opname Rutin Fisik Studio');
    }
  }, [itemData]);

  if (!isOpen || !itemData) return null;

  const currentStock = Number(itemData.currentStock) || 0;
  const targetQty = actualQty === '' ? currentStock : Math.max(0, Number(actualQty) || 0);
  const diffQty = targetQty - currentStock;
  const unitHpp = Number(itemData.hpp) || 37000;
  const financialImpact = diffQty * unitHpp;

  const handleQuickReason = (preset) => {
    setReason(preset);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actualQty === '' || isNaN(Number(actualQty))) {
      alert('Masukkan jumlah fisik aktual yang valid.');
      return;
    }
    if (!reason.trim()) {
      alert('Alasan / Berita Acara Opname wajib diisi demi kepatuhan audit zero-leakage.');
      return;
    }

    setSubmitting(true);
    try {
      onSaveOpname({
        itemType: itemData.type,
        sku: itemData.sku,
        garmentKey: itemData.garmentKey,
        color: itemData.color,
        size: itemData.size,
        supplyId: itemData.supplyId,
        actualQty: targetQty,
        reason: reason.trim(),
        adminName: adminName.trim()
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan penyesuaian opname: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#0E0E11] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Stock Opname Fisik Terotorisasi
              </h3>
              <p className="text-[11px] text-zinc-400">
                Pencatatan selisih fisik gudang dengan berita acara audit resmi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Item Card */}
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-white/[0.08] space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Item Terpilih
                </span>
                <strong className="text-sm text-white font-bold block mt-0.5">
                  {itemData.title}
                </strong>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {itemData.sku}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06] text-xs">
              <div>
                <span className="text-zinc-400 block text-[11px]">Stok Sistem Saat Ini:</span>
                <span className="font-mono font-bold text-white text-base">
                  {currentStock} <span className="text-xs font-normal text-zinc-400">{itemData.unit}</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-zinc-400 block text-[11px]">Estimasi HPP Satuan:</span>
                <span className="font-mono font-semibold text-zinc-200">
                  Rp {unitHpp.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Actual Physical Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
              <span>Hasil Hitung Fisik Gudang Aktual:</span>
              <span className="text-[11px] font-normal text-zinc-400">Satuan: {itemData.unit}</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="1"
                required
                value={actualQty}
                onChange={(e) => setActualQty(e.target.value)}
                placeholder="Masukkan jumlah fisik di rak"
                className="w-full px-4 py-2.5 bg-zinc-950 border border-white/[0.12] rounded-xl text-lg font-mono font-bold text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 transition-colors"
                autoFocus
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                {itemData.unit}
              </span>
            </div>
          </div>

          {/* Real-Time Discrepancy & Financial Impact Strip */}
          <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            diffQty === 0 
              ? 'bg-zinc-900/60 border-white/[0.08] text-zinc-400' 
              : diffQty < 0 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {diffQty === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-zinc-400" />
              ) : diffQty < 0 ? (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              )}
              <div>
                <span className="font-bold block">
                  {diffQty === 0 
                    ? 'Stok Cocok Sempurna' 
                    : diffQty < 0 
                      ? `Selisih Kurang: ${diffQty} ${itemData.unit}` 
                      : `Temuan Lebih: +${diffQty} ${itemData.unit}`}
                </span>
                <span className="text-[11px] opacity-80">
                  {diffQty === 0 
                    ? 'Tidak ada perubahan jumlah fisik' 
                    : diffQty < 0 
                      ? 'Tercatat sebagai susut/kerugian fisik gudang' 
                      : 'Tercatat sebagai temuan stok tambahan'}
                </span>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] block opacity-75 uppercase tracking-wider">Dampak Nilai Aset</span>
              <span className={`text-sm font-bold ${diffQty < 0 ? 'text-rose-400' : diffQty > 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {financialImpact >= 0 ? `+Rp ${financialImpact.toLocaleString('id-ID')}` : `-Rp ${Math.abs(financialImpact).toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>

          {/* Quick Preset Buttons for Reason */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Berita Acara / Alasan Penyesuaian (Wajib Audit):</span>
            </label>
            <div className="flex flex-wrap gap-1.5 pb-1">
              {[
                'Opname Rutin Fisik Studio',
                'Cacat / Rusak Saat Display',
                'Sample Foto & Endorsement',
                'Koreksi Salah Hitung Masuk'
              ].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => handleQuickReason(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                    reason === preset
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-zinc-900 text-zinc-400 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Jelaskan alasan penyesuaian untuk catatan audit trail..."
              className="w-full px-3.5 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 transition-colors"
            />
          </div>

          {/* Otorisasi PIC */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
              <span>Otorisasi Penanggung Jawab (PIC):</span>
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full px-3 py-1.5 bg-zinc-950 border border-white/[0.08] rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auto-sync ke tabel PostgreSQL Cloud</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-white/[0.08] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting || actualQty === ''}
                className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Penyesuaian Opname'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
