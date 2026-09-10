import React from 'react';
import { ShoppingBag, MessageSquare, ArrowRight, Check } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export function StickyMobileBuyBar({
  product,
  selectedColor,
  selectedSize,
  price,
  previewImg,
  onAddToCart,
  onBuyNow,
  onBuyWhatsapp,
  isAdded,
  isVisible
}) {
  if (!isVisible || !product) return null;

  const displayImage = previewImg || product.filePath || product.file_path;

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 md:hidden animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto bg-ts-surface/95 backdrop-blur-2xl border border-white/[0.14] rounded-2xl p-2.5 sm:p-3 shadow-glass-card shadow-glass-inset flex items-center justify-between gap-2.5">
        {/* Thumbnail & Info Ringkas */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={displayImage}
            alt={product.name}
            className={`w-10 h-10 rounded-xl border border-white/10 bg-ts-hitam shrink-0 ${
              product.series === 'blank' || product.sku?.startsWith('TS-BLK') ? 'object-contain p-0.5' : 'object-cover'
            }`}
          />
          <div className="min-w-0">
            <div className="font-mono text-xs font-black text-ts-green leading-tight">
              {formatRupiah(price)}
            </div>
            <div className="text-[10px] text-ts-kremMuted truncate mt-0.5">
              {selectedColor} • {selectedSize}
            </div>
          </div>
        </div>

        {/* Action Buttons: WhatsApp, Tambah Troli, & Checkout Cepat */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onBuyWhatsapp && (
            <button
              onClick={onBuyWhatsapp}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-emerald-400 active:scale-95 transition-all"
              title="Konsultasi WhatsApp"
              aria-label="Konsultasi WhatsApp"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onAddToCart}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
              isAdded
                ? 'bg-ts-green/20 border-ts-green text-ts-green'
                : 'bg-white/[0.06] border-white/10 text-white hover:bg-white/[0.1]'
            }`}
            title="Tambah ke Keranjang"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Masuk!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>+ Troli</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBuyNow}
            className="px-3.5 py-2 rounded-xl bg-ts-terracotta hover:bg-ts-terracotta/90 text-white border border-ts-terracotta/50 text-xs font-black shadow-glow-terracotta flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
          >
            <span>Beli</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
