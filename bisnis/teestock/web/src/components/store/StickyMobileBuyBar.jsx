import React from 'react';
import { ShoppingBag, MessageSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatRupiah } from '../../utils/formatters';

export function StickyMobileBuyBar({
  product,
  selectedColor,
  selectedSize,
  price,
  onAddToCart,
  onBuyWhatsapp,
  isVisible
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 right-3 z-40 md:hidden animate-in slide-in-from-bottom-5 duration-300 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto bg-ts-surface/95 backdrop-blur-2xl border border-white/[0.14] rounded-2xl p-3 shadow-glass-card shadow-glass-inset flex items-center justify-between gap-3">
        {/* Thumbnail & Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={product.filePath || product.file_path}
            alt={product.name}
            className="w-11 h-11 rounded-xl object-cover border border-white/10 bg-ts-hitam shrink-0"
          />
          <div className="min-w-0">
            <div className="font-mono text-xs font-extrabold text-ts-green">
              {formatRupiah(price)}
            </div>
            <div className="text-[10px] text-ts-kremMuted truncate">
              {selectedColor} • {selectedSize}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onAddToCart}
            className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-ts-krem active:scale-95 transition-all"
            title="Tambah ke Keranjang"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <Button
            size="sm"
            variant="primary"
            icon={MessageSquare}
            onClick={onBuyWhatsapp}
            className="text-xs px-3 py-2 font-bold"
          >
            Beli
          </Button>
        </div>
      </div>
    </div>
  );
}
