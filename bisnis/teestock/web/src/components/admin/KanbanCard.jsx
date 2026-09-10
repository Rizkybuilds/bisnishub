import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  User, 
  Phone, 
  MessageSquare, 
  Printer, 
  Truck,
  TrendingUp, 
  ExternalLink,
  Sparkles,
  Building2
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { generateCustomerWhatsAppText, generateUnpaidFollowUpWhatsAppText, getWhatsAppUrl } from '../../utils/whatsappTemplates';
import { PrintWorkSlipModal } from './PrintWorkSlipModal';
import { ShippingLabelModal } from './ShippingLabelModal';
import { isFastMovingBuffer } from '../../utils/garmentStockRouting';
import { useAdmin } from '../../context/AdminContext';

export function KanbanCard({ order, onMove, currentStatusIdx, totalStatuses }) {
  const { getDtfFilmStatus } = useAdmin();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const isPress = order.status === 'press';
  const isStudioReady = isFastMovingBuffer(order.garment, order.color, order.size);
  const dtfStatus = getDtfFilmStatus ? getDtfFilmStatus(order.sku) : null;

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
  const isPending = order.status === 'pending';
  const waMessage = isPending
    ? generateUnpaidFollowUpWhatsAppText(order)
    : generateCustomerWhatsAppText(order);
  const waUrl = getWhatsAppUrl(order.phone, waMessage);

  const reviewMessage = generateCustomerWhatsAppText(order, 'review');
  const reviewWaUrl = getWhatsAppUrl(order.phone, reviewMessage);

  return (
    <>
      <div className="bg-[#141312] border border-white/[0.08] rounded-2xl p-3.5 space-y-3 shadow-glass-card hover:border-white/20 transition-all duration-200">
        {/* Header: ID & Channel */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-ts-krem bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
              {order.id}
            </span>
            {(order.unique_code || order.uniqueCode) && (
              <span 
                className="font-mono text-[10px] font-extrabold text-ts-mustard bg-ts-mustard/20 px-1.5 py-0.5 rounded border border-ts-mustard/30"
                title={`Kode Unik Verifikasi Pembayaran: +${order.unique_code || order.uniqueCode}`}
              >
                +{order.unique_code || order.uniqueCode}
              </span>
            )}
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
              className="p-1 rounded bg-ts-surface hover:bg-ts-surfaceHover text-ts-muted hover:text-white border border-ts-border transition-colors cursor-pointer"
              title="Cetak Tiket Kerja / Slip Packing"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsShippingModalOpen(true)}
              className="p-1 rounded bg-ts-surface hover:bg-ts-surfaceHover text-ts-terracotta hover:text-white border border-ts-border transition-colors cursor-pointer"
              title="Cetak Label Pengiriman Thermal 100x150 mm"
            >
              <Truck className="w-3.5 h-3.5" />
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
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors shrink-0 ${
                  isPending
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#4EFA8A] border-[#25D366]/40'
                }`}
                title={isPending ? 'Kirim Follow-Up Pembayaran via WhatsApp' : 'Kirim Update Status via WhatsApp'}
              >
                {isPending && (
                  <span className="relative flex h-1.5 w-1.5 mr-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                  </span>
                )}
                <MessageSquare className="w-2.5 h-2.5" />
                <span>{isPending ? 'Follow-Up WA' : 'Kirim WA'}</span>
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
        <div className="bg-ts-surface/60 rounded-lg p-2.5 border border-ts-borderDim text-xs space-y-1.5">
          {order.items && order.items.length > 1 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-ts-krem">{order.items.length} Macam Item Pesanan:</span>
                <span className="font-mono font-bold text-ts-terracotta bg-ts-terracotta/10 px-1.5 py-0.5 rounded">
                  {order.qty} pcs total
                </span>
              </div>
              <div className="space-y-1 divide-y divide-ts-borderDim/50 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                {order.items.map((it, idx) => (
                  <div key={idx} className="pt-1 first:pt-0">
                    <div className="font-semibold text-ts-krem/90 text-[11px] truncate">{it.name || it.product_name}</div>
                    <div className="flex items-center justify-between text-[10px] text-ts-muted">
                      <span className="truncate max-w-[120px]">{it.garment}</span>
                      <span className="font-mono text-ts-terracotta">{it.color} ({it.size}) x{it.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="font-bold text-ts-krem truncate">{order.productName || order.sku}</div>
              <div className="flex items-center justify-between text-[11px] text-ts-muted">
                <span className="text-ts-krem/90 font-medium truncate max-w-[140px]">{order.garment}</span>
                <span className="font-mono font-bold text-ts-terracotta bg-ts-terracotta/10 px-1.5 py-0.2 rounded shrink-0">
                  {order.color} ({order.size}) x{order.qty}
                </span>
              </div>
            </>
          )}
          
          {/* Fulfillment Origin Tag (Garment & DTF Film) */}
          <div className="space-y-1.5 pt-1.5 border-t border-ts-borderDim/50">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-ts-muted font-mono text-[9px] uppercase">Garmen:</span>
              {isStudioReady ? (
                <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[10px]" title="Tersedia di buffer stok studio (Siap Press/Pack)">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  STOK STUDIO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-mono font-bold text-sky-400 bg-sky-500/10 border border-sky-500/25 px-1.5 py-0.5 rounded text-[10px]" title="Perlu ditarik dari distributor vendor NSA (JIT)">
                  <Building2 className="w-2.5 h-2.5" />
                  TARIK GARMEN NSA
                </span>
              )}
            </div>

            {dtfStatus && (
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-ts-muted font-mono text-[9px] uppercase">Film DTF:</span>
                {dtfStatus.isReady ? (
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-teal-400 bg-teal-500/10 border border-teal-500/25 px-1.5 py-0.5 rounded text-[10px]" title={`Film DTF siap di studio: ${dtfStatus.ready} lembar ready`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    DTF READY ({dtfStatus.ready} lbr)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded text-[10px]" title="Stok film DTF kosong, perlu dicetak di Gang Sheet">
                    <Printer className="w-2.5 h-2.5" />
                    PERLU CETAK DTF
                  </span>
                )}
              </div>
            )}
            {/* Sentra Hub Dispatch */}
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-ts-muted font-mono text-[9px] uppercase">Sentra:</span>
              <span className={`inline-flex items-center gap-1 font-mono font-bold px-1.5 py-0.5 rounded text-[9px] ${
                order.origin_hub_id === 'bogor_express'
                  ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                  : 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
              }`} title={order.fulfillment_origin || 'TeeStock Studio & Print Lab (Citayam Hub)'}>
                {order.origin_hub_id === 'bogor_express' ? '⚡ HUB BOGOR' : '🏭 STUDIO CITAYAM'}
              </span>
            </div>
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

        {/* QRIS Verification Notice for Pending Orders */}
        {order.status === 'pending' && (order.unique_code || order.uniqueCode) && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-[11px] space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Cek Mutasi QRIS:
              </span>
              <span className="font-mono text-[10px] text-zinc-950 font-black bg-amber-400 px-1.5 py-0.2 rounded">
                +{order.unique_code || order.uniqueCode}
              </span>
            </div>
            <div className="text-[10px] text-ts-kremMuted flex justify-between">
              <span>Wajib Masuk:</span>
              <span className="font-mono text-white font-bold">{formatRupiah(order.total_payment || order.price)}</span>
            </div>
          </div>
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
                className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all ${
                  order.status === 'pending' && (order.unique_code || order.uniqueCode)
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-teal px-2.5'
                    : 'bg-ts-terracotta hover:bg-ts-terracotta/90 text-white'
                }`}
                title={
                  order.status === 'pending' && (order.unique_code || order.uniqueCode)
                    ? `Verifikasi mutasi QRIS (+${order.unique_code || order.uniqueCode}) & mulai produksi`
                    : 'Lanjutkan status produksi'
                }
              >
                <span>
                  {order.status === 'pending' && (order.unique_code || order.uniqueCode)
                    ? 'Verifikasi Lunas'
                    : 'Lanjut'}
                </span>
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

      {/* Printable Thermal Shipping Label Modal (100x150 mm) */}
      <ShippingLabelModal
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        order={order}
      />
    </>
  );
}
