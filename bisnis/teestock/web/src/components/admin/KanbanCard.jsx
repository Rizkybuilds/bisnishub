import React from 'react';
import { ChevronLeft, ChevronRight, Flame, User, Phone, MapPin } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export function KanbanCard({ order, onMove, currentStatusIdx, totalStatuses }) {
  const isPress = order.status === 'press';

  const channelBadges = {
    shopee: "bg-[#EE4D2D]/20 text-[#FF6E4E] border-[#EE4D2D]/40",
    tiktok: "bg-white/10 text-white border-white/20",
    whatsapp: "bg-[#25D366]/20 text-[#4EFA8A] border-[#25D366]/40",
    web: "bg-ts-terracotta/20 text-[#E2885E] border-ts-terracotta/40",
    custom: "bg-ts-mustard/20 text-[#ECC369] border-ts-mustard/40"
  };

  return (
    <div className="bg-ts-hitam/80 border border-ts-border rounded-xl p-3.5 space-y-3 shadow-md hover:border-ts-muted/60 transition-all">
      {/* Header: ID & Channel */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-ts-krem bg-ts-surface px-2 py-0.5 rounded border border-ts-border">
          {order.id}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${channelBadges[order.channel] || 'bg-ts-surface text-ts-muted'}`}>
          {order.channel.toUpperCase()}
        </span>
      </div>

      {/* Customer Info */}
      <div className="text-xs space-y-0.5">
        <div className="font-bold text-ts-krem flex items-center gap-1.5">
          <User className="w-3 h-3 text-ts-terracotta" /> {order.customer}
        </div>
        {order.phone && (
          <div className="text-ts-muted text-[11px] flex items-center gap-1.5 font-mono">
            <Phone className="w-3 h-3 text-ts-muted" /> {order.phone}
          </div>
        )}
      </div>

      {/* Product & Garment Spec */}
      <div className="bg-ts-surface/60 rounded-lg p-2.5 border border-ts-borderDim text-xs space-y-1">
        <div className="font-bold text-ts-krem truncate">{order.productName || order.sku}</div>
        <div className="flex items-center justify-between text-[11px] text-ts-muted">
          <span className="text-ts-krem/90 font-medium">{order.garment}</span>
          <span className="font-mono font-bold text-ts-terracotta bg-ts-terracotta/10 px-1.5 py-0.2 rounded">
            {order.color} ({order.size}) x{order.qty}
          </span>
        </div>
      </div>

      {/* Embedded SOP for Heat Press */}
      {isPress && (
        <div className="bg-ts-terracotta/15 border border-ts-terracotta/40 rounded-lg p-2 text-[11px] text-[#E2885E] space-y-1">
          <div className="font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-ts-terracotta" /> SOP Heat Press:
          </div>
          <div className="text-[10px] text-ts-krem/80">
            Suhu 160°C • Tekanan 15 detik • Kupas Dingin • Press ke-2 (5 dtk)
          </div>
        </div>
      )}

      {/* Footer: Price & Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-ts-borderDim">
        <div className="font-mono text-xs font-extrabold text-ts-green">
          {formatRupiah(order.price)}
        </div>

        <div className="flex items-center gap-1">
          {currentStatusIdx > 0 && (
            <button
              onClick={() => onMove(order.id, -1)}
              className="p-1 rounded bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border transition-colors"
              title="Kembalikan ke status sebelumnya"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {currentStatusIdx < totalStatuses - 1 && (
            <button
              onClick={() => onMove(order.id, 1)}
              className="px-2 py-1 rounded bg-ts-terracotta hover:bg-ts-terracotta/90 text-white text-[11px] font-bold flex items-center gap-0.5 shadow-sm transition-all"
              title="Lanjutkan status produksi"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
