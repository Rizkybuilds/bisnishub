import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Package } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

export function CartItemList({ cart, updateCartQty, removeFromCart }) {
  if (!cart || cart.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-ts-border">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ts-krem flex items-center gap-2">
          <Package className="w-4 h-4 text-ts-terracotta" />
          Daftar Item ({cart.reduce((acc, it) => acc + (it.qty || 1), 0)} Pcs)
        </h2>
        <span className="text-xs text-ts-kremMuted">
          {cart.length} Model Berbeda
        </span>
      </div>

      <div className="space-y-3">
        {cart.map((item, index) => {
          const isBlank = item.series === 'blank' || item.sku?.startsWith('TS-BLK-');
          const itemTotal = (item.price || 0) * (item.qty || 1);

          return (
            <div
              key={`${item.sku}-${item.garment}-${item.color}-${item.size}-${index}`}
              className="p-4 rounded-2xl bg-ts-surface border border-ts-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-ts-borderHover shadow-sm"
            >
              {/* Product Info & Thumbnail */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-ts-surfaceHover/50 border border-ts-border shrink-0">
                  {item.filePath ? (
                    <img
                      src={item.filePath}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ts-muted text-xs font-mono">
                      TS
                    </div>
                  )}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ts-surfaceHover text-ts-kremMuted uppercase border border-ts-border">
                      {item.sku}
                    </span>
                    {isBlank ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ts-teal/15 text-ts-teal font-semibold border border-ts-teal/20">
                        NSA Blank
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ts-terracotta/15 text-ts-terracotta font-semibold border border-ts-terracotta/20">
                        Curated Merch
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/produk/${item.sku}`}
                    className="block text-sm font-bold text-ts-krem hover:text-ts-terracotta transition-colors truncate"
                  >
                    {item.name}
                  </Link>

                  <p className="text-xs text-ts-kremMuted truncate">
                    {item.garment} • <span className="font-semibold text-ts-krem">{item.color}</span> • Ukuran <span className="font-semibold text-ts-krem">{item.size}</span>
                  </p>

                  <p className="text-xs font-mono font-bold text-ts-terracotta">
                    {formatRupiah(item.price)} <span className="text-[10px] text-ts-muted font-normal">/ pcs</span>
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Subtotal */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-ts-border">
                {/* Stepper with accessible tap targets */}
                <div className="flex items-center border border-ts-border rounded-xl bg-ts-surfaceHover/60 p-0.5">
                  <button
                    type="button"
                    onClick={() => updateCartQty(index, -1)}
                    className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surface rounded-lg transition-colors cursor-pointer active:scale-95"
                    aria-label="Kurangi kuantitas"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-xs font-bold text-ts-krem">
                    {item.qty || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQty(index, 1)}
                    className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surface rounded-lg transition-colors cursor-pointer active:scale-95"
                    aria-label="Tambah kuantitas"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal & Delete */}
                <div className="text-right min-w-[100px]">
                  <p className="text-sm font-mono font-extrabold text-ts-krem">
                    {formatRupiah(itemTotal)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(index)}
                    className="inline-flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-600 mt-1 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
