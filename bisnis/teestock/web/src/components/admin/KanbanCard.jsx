import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  User, 
  Phone, 
  MessageSquare, 
  Printer, 
  TrendingUp, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { generateCustomerWhatsAppText, getWhatsAppUrl } from '../../utils/whatsappTemplates';
import { PrintWorkSlipModal } from './PrintWorkSlipModal';

export function KanbanCard({ order, onMove, currentStatusIdx, totalStatuses }) {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const isPress = order.status === 'press';

  const channelBadges = {
    shopee: "bg-[#EE4D2D]/20 text-[#FF6E4E] border-[#EE4D2D]/40",
    tiktok: "bg-white/10 text-white border-white/20",
    whatsapp: "bg-[#25D366]/20 text-[#4EFA8A] border-[#25D366]/40",
    web: "bg-ts-terracotta/20 text-[#E2885E] border-ts-terracotta/40",
    custom: "bg-ts-mustard/20 text-[#ECC369] border-ts-mustard/40"
  };

  // CFO Financial Calculation
  const isMarketplace = order.channel === 'shopee' || order.channel === 'tiktok';
  const platformFee = order.fee !== undefined ? order.fee : (isMarketplace ? Math.round((order.price || 0) * 0.085) : 0);
  const estimatedHpp = (order.hpp || 64250) * (order.qty || 1);
  const netProfit = (order.price || 0) - platformFee - estimatedHpp;

  // WhatsApp template triggers
  const waMessage = generateCustomerWhatsAppText(order);
  const waUrl = getWhatsAppUrl(order.phone, waMessage);

  const reviewMessage = generateCustomerWhatsAppText(order, 'review');
  const reviewWaUrl = getWhatsAppUrl(order.phone, reviewMessage);

  return (
    <>
      <div className="bg-ts-hitam/80 border border-ts-border rounded-xl p-3.5 space-y-3 shadow-md hover:border-ts-muted/60 transition-all">
        {/* Header: ID & Channel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-ts-krem bg-ts-surface px-2 py-0.5 rounded border border-ts-border">
              {order.id}
            </span>
            {order.trackingNo && (
              <span className="font-mono text-[10px] text-ts-muted bg-ts-surface/40 px-1.5 py-0.5 rounded truncate max-w-[90px]" title={`No. Resi: ${order.trackingNo}`}>
                {order.trackingNo}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="p-1 rounded bg-ts-surface hover:bg-ts-surfaceHover text-ts-muted hover:text-white border border-ts-border transition-colors"
              title="Cetak Tiket Kerja / Slip Packing"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${channelBadges[order.channel] || 'bg-ts-surface text-ts-muted'}`}>
              {(order.channel || 'DIRECT').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Customer Info & WhatsApp Trigger */}
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-ts-krem flex items-center gap-1.5 truncate">
              <User className="w-3 h-3 text-ts-terracotta shrink-0" /> {order.customer}
            </div>

            {/* Quick WhatsApp Action */}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#4EFA8A] px-2 py-0.5 rounded-full border border-[#25D366]/40 transition-colors shrink-0"
                title="Kirim Update Status via WhatsApp"
              >
                <MessageSquare className="w-2.5 h-2.5" />
                <span>Kirim WA</span>
              </a>
            )}
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
              <Flame className="w-3.5 h-3.5 text-ts-terracotta" /> SOP Heat Press Mandiri:
            </div>
            <div className="text-[10px] text-ts-krem/80">
              Suhu 155°C • Tekan 15 dtk • Kupas Dingin • Press ke-2 (5 dtk)
            </div>
          </div>
        )}

        {/* Shipped Stage: Review Booster Button */}
        {order.status === 'shipped' && reviewWaUrl && (
          <a
            href={reviewWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-1 text-[10px] font-bold text-ts-mustard bg-ts-mustard/10 hover:bg-ts-mustard/20 border border-ts-mustard/30 rounded-lg transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            <span>Minta Ulasan Bintang 5 via WA</span>
          </a>
        )}

        {/* CFO Financial Badge */}
        <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 bg-ts-hitam/50 rounded border border-ts-borderDim text-ts-muted">
          <span>Fee: <strong className="text-rose-400">-{formatRupiah(platformFee)}</strong></span>
          <span>Net Est: <strong className={netProfit >= 0 ? "text-ts-green font-bold" : "text-rose-400 font-bold"}>+{formatRupiah(netProfit)}</strong></span>
        </div>

        {/* Footer: Price & Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-ts-borderDim">
          <div className="font-mono text-xs font-extrabold text-ts-green">
            {formatRupiah(order.price)}
          </div>

          <div className="flex items-center gap-1">
            {currentStatusIdx > 0 && (
              <button
                type="button"
                onClick={() => onMove(order.id, -1)}
                className="p-1 rounded bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border transition-colors"
                title="Kembalikan ke status sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {currentStatusIdx < totalStatuses - 1 && (
              <button
                type="button"
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

      {/* Printable Work Slip Modal */}
      <PrintWorkSlipModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={order}
      />
    </>
  );
}
