import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Copy, 
  Check, 
  Package, 
  MessageSquare
} from 'lucide-react';
import { Modal } from '@bisnishub/shared/components/ui/Modal';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { aggregateVendorPickupList } from '@bisnishub/shared/utils/garmentStockRouting';

export function VendorPickupModal({ isOpen, onClose, orders = [] }) {
  const [copied, setCopied] = useState(false);

  const { totalPcs, items, activeOrdersCount, waMessage } = useMemo(() => {
    return aggregateVendorPickupList(orders);
  }, [orders]);

  const handleCopyWA = () => {
    if (!waMessage) return;
    navigator.clipboard.writeText(waMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(err => {
      console.error("Gagal menyalin pesan:", err);
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daftar Tarik Garmen Supplier NSA (JIT)"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Intro Context Banner */}
        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-start gap-3 text-xs">
          <Building2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold text-white text-sm">
              Sistem JIT (Just-In-Time) Supplier NSA
            </strong>
            <p className="text-ts-kremMuted leading-relaxed">
              Daftar ini secara otomatis merangkum garmen polos varian <em>slow-moving</em> / warna khusus dari pesanan aktif yang tidak distok di studio. Ambil sekaligus saat jadwal pickup harian atau sekalian mengambil cetakan roll DTF.
            </p>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-ts-surface border border-ts-borderDim text-center space-y-1">
            <span className="text-[10px] text-ts-muted font-mono uppercase">Total Perlu Ditarik</span>
            <div className="font-mono text-2xl font-black text-sky-400">
              {totalPcs} <span className="text-xs font-normal text-ts-kremMuted">pcs</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-ts-surface border border-ts-borderDim text-center space-y-1">
            <span className="text-[10px] text-ts-muted font-mono uppercase">Varian Kaos</span>
            <div className="font-mono text-2xl font-black text-ts-krem">
              {items.length} <span className="text-xs font-normal text-ts-kremMuted">jenis</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-ts-surface border border-ts-borderDim text-center space-y-1">
            <span className="text-[10px] text-ts-muted font-mono uppercase">Pesanan Terkait</span>
            <div className="font-mono text-2xl font-black text-ts-mustard">
              {activeOrdersCount} <span className="text-xs font-normal text-ts-kremMuted">antrean</span>
            </div>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-ts-krem px-1">
            <span>Rincian Garmen yang Harus Diambil:</span>
            <span className="text-[11px] font-mono text-ts-muted">{items.length} Item</span>
          </div>

          {items.length === 0 ? (
            <div className="py-8 text-center rounded-2xl bg-ts-surface/40 border border-ts-borderDim space-y-2">
              <Package className="w-8 h-8 text-ts-muted mx-auto" />
              <p className="text-xs text-ts-muted">
                Semua pesanan aktif saat ini menggunakan stok buffer studio. Tidak ada garmen yang perlu ditarik dari distributor/supplier!
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((it, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-ts-surface/80 border border-ts-borderDim hover:border-sky-500/40 transition-colors text-xs"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="font-bold text-white truncate">{it.garment}</div>
                    <div className="flex items-center gap-2 text-[11px] text-ts-kremMuted">
                      <span className="font-mono text-ts-terracotta bg-ts-terracotta/10 px-1.5 py-0.5 rounded">
                        Warna: {it.color}
                      </span>
                      <span className="font-mono text-ts-mustard bg-ts-mustard/10 px-1.5 py-0.5 rounded">
                        Size: {it.size}
                      </span>
                      <span className="text-[10px] text-ts-muted truncate">
                        Ref: {it.orderIds.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-base font-black text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                      {it.qty} pcs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WhatsApp Order Preview Box */}
        {items.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-ts-krem px-1">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Format Pesan Kilat ke Sales Supplier NSA:</span>
              </span>
              <button
                type="button"
                onClick={handleCopyWA}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-ts-terracotta hover:underline cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-ts-green" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-2xl bg-ts-hitam border border-ts-borderDim text-[11px] font-mono text-ts-kremMuted whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto select-all">
              {waMessage}
            </pre>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-ts-borderDim">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Tutup
          </Button>

          {items.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleCopyWA}
              className="gap-2 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Format WhatsApp Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Format WA ke Supplier ({totalPcs} pcs)</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
