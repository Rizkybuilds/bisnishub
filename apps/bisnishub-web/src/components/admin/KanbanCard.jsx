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
  Sparkles, 
  Building2,
  Copy,
  Check,
  Tag,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';
import { generateCustomerWhatsAppText, generateUnpaidFollowUpWhatsAppText, getWhatsAppUrl } from '../../utils/whatsappTemplates';
import { PrintWorkSlipModal } from './PrintWorkSlipModal';
import { ShippingLabelModal } from './ShippingLabelModal';
import { Modal } from '../ui/Modal';
import { isFastMovingBuffer } from '../../utils/garmentStockRouting';
import { useAdmin } from '../../context/AdminContext';

export function KanbanCard({ order, onMove, currentStatusIdx, totalStatuses }) {
  const { getDtfFilmStatus, updateOrderTracking, cancelOrder } = useAdmin();
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Tracking Form State
  const [courierInput, setCourierInput] = useState(order.courier || 'J&T Express');
  const [trackingInput, setTrackingInput] = useState(order.trackingNo || '');
  const [copiedResi, setCopiedResi] = useState(false);

  const isPress = order.status === 'press';
  const isStudioReady = isFastMovingBuffer(order.garment, order.color, order.size);
  const dtfStatus = getDtfFilmStatus ? getDtfFilmStatus(order.sku) : null;

  const channelBadges = {
    shopee: "bg-[#EE4D2D]/15 text-[#FF6E4E] border-[#EE4D2D]/30",
    tiktok: "bg-white/10 text-white border-white/20",
    whatsapp: "bg-[#25D366]/15 text-[#4EFA8A] border-[#25D366]/30",
    web: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    custom: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
  };

  // CFO Financial Calculation (Strict Pass-through Courier Isolation)
  const isMarketplace = order.channel === 'shopee' || order.channel === 'tiktok';
  const shippingFee = Number(order.shipping_fee || 0);
  const uniqueCode = Number(order.unique_code || order.uniqueCode || 0);
  const totalAmount = Number(order.price || order.total_amount || 0);
  const productRevenue = Number(order.subtotal) > 0 
    ? (Number(order.subtotal) - Number(order.discount || order.discount_amount || 0)) 
    : Math.max(0, totalAmount - shippingFee - uniqueCode);

  const platformFee = order.fee !== undefined ? order.fee : (isMarketplace ? Math.round(productRevenue * 0.085) : 0);
  const estimatedHpp = (order.hpp || 64250) * (order.qty || 1);
  const netProfit = productRevenue - platformFee - estimatedHpp;

  // WhatsApp template triggers
  const isPending = order.status === 'pending' || order.status === 'pending_payment';
  const waMessage = isPending
    ? generateUnpaidFollowUpWhatsAppText(order)
    : generateCustomerWhatsAppText(order);
  const waUrl = getWhatsAppUrl(order.phone, waMessage);

  const reviewMessage = generateCustomerWhatsAppText(order, 'review');
  const reviewWaUrl = getWhatsAppUrl(order.phone, reviewMessage);

  // Copy Resi
  const handleCopyResi = (e) => {
    e.stopPropagation();
    if (!order.trackingNo) return;
    navigator.clipboard.writeText(order.trackingNo).then(() => {
      setCopiedResi(true);
      setTimeout(() => setCopiedResi(false), 2000);
    });
  };

  // Save Tracking
  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (updateOrderTracking) {
      await updateOrderTracking(order.id, trackingInput, courierInput);
    }
    setIsTrackingModalOpen(false);
  };

  // Cancel Order
  const handleCancelOrder = async () => {
    if (confirm(`Batalkan pesanan ${order.id} (${order.customer})?`)) {
      if (cancelOrder) {
        await cancelOrder(order.id, 'Dibatalkan oleh admin');
      }
    }
  };

  // Contextual forward button label
  const forwardLabels = {
    pending: 'Verifikasi Lunas',
    pending_payment: 'Verifikasi Lunas',
    dtf: 'Siap Press',
    press: 'Lolos QC & Pack',
    pack: 'Serahkan Kurir'
  };

  return (
    <>
      <div className="bg-[#141312] border border-white/[0.08] rounded-2xl p-4 space-y-3.5 shadow-xl hover:border-white/20 transition-all duration-200 group">
        {/* Header: ID, Unique Code, Tracking & Action Buttons */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs font-bold text-white bg-white/[0.04] px-2 py-0.5 rounded border border-white/10">
              {order.id}
            </span>
            {order.status === 'pending_payment' && (
              <span 
                className="font-mono text-[9px] font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1"
                title="Pesanan baru: Menunggu verifikasi pembayaran QRIS / transfer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Menunggu Verifikasi
              </span>
            )}
            {(order.unique_code || order.uniqueCode) && (
              <span 
                className="font-mono text-[10px] font-extrabold text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30"
                title={`Kode Unik Verifikasi Pembayaran: +${order.unique_code || order.uniqueCode}`}
              >
                +{order.unique_code || order.uniqueCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsTrackingModalOpen(true)}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
              title="Input / Update Nomor Resi Kurir"
            >
              <Tag className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
              title="Cetak Tiket Kerja / Slip Packing"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsShippingModalOpen(true)}
              className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-amber-400 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
              title="Cetak Label Pengiriman Thermal 100x150 mm"
            >
              <Truck className="w-3.5 h-3.5" />
            </button>
            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${channelBadges[order.channel] || 'bg-white/[0.05] text-zinc-400 border-white/10'}`}>
              {order.channel || 'DIRECT'}
            </span>
          </div>
        </div>

        {/* Courier Tracking Ribbon (if available or empty prompt) */}
        {order.trackingNo ? (
          <div className="flex items-center justify-between bg-white/[0.02] border border-white/[0.06] rounded-xl px-2.5 py-1 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 truncate text-zinc-300">
              <Truck className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="font-semibold text-white">{order.courier || 'Ekspedisi'}:</span>
              <span className="truncate text-amber-300 font-bold">{order.trackingNo}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyResi}
              className="inline-flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white ml-2 shrink-0 cursor-pointer"
              title="Salin No. Resi"
            >
              {copiedResi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedResi ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsTrackingModalOpen(true)}
            className="w-full text-left py-1 px-2 rounded-lg border border-dashed border-white/[0.08] hover:border-white/20 text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>+ Belum ada nomor resi</span>
            <span className="text-[9px] underline">Input Resi</span>
          </button>
        )}

        {/* Customer Info & WhatsApp Trigger */}
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white flex items-center gap-1.5 truncate">
              <User className="w-3 h-3 text-amber-400 shrink-0" /> {order.customer}
            </div>

            {/* Quick WhatsApp Action */}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all shrink-0 cursor-pointer ${
                  isPending
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40'
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
                <span>{isPending ? 'Follow-Up WA' : order.status === 'shipped' ? 'Resi WA' : 'Kirim WA'}</span>
              </a>
            )}
          </div>

          {order.phone && (
            <div className="text-zinc-400 text-[11px] flex items-center gap-1.5 font-mono">
              <Phone className="w-3 h-3 text-zinc-500" /> {order.phone}
            </div>
          )}
        </div>

        {/* Product & Garment Spec */}
        <div className="bg-[#09090B] rounded-xl p-2.5 border border-white/[0.06] text-xs space-y-1.5">
          {order.items && order.items.length > 1 ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-white">{order.items.length} Macam Item Pesanan:</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                  {order.qty} pcs total
                </span>
              </div>
              <div className="space-y-1 divide-y divide-white/[0.06] max-h-28 overflow-y-auto pr-1 custom-scrollbar">
                {order.items.map((it, idx) => (
                  <div key={idx} className="pt-1 first:pt-0">
                    <div className="font-semibold text-zinc-200 text-[11px] truncate">{it.name || it.product_name}</div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span className="truncate max-w-[120px]">{it.garment}</span>
                      <span className="font-mono text-amber-300">{it.color} ({it.size}) x{it.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="font-bold text-white truncate">{order.productName || order.sku}</div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="text-zinc-300 font-medium truncate max-w-[140px]">{order.garment}</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded shrink-0">
                  {order.color} ({order.size}) x{order.qty}
                </span>
              </div>
            </>
          )}
          
          {/* Fulfillment Origin Tag (Garment & DTF Film) */}
          <div className="space-y-1.5 pt-1.5 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-500 font-mono text-[9px] uppercase">Garmen:</span>
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
                <span className="text-zinc-500 font-mono text-[9px] uppercase">Film DTF:</span>
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
              <span className="text-zinc-500 font-mono text-[9px] uppercase">Sentra:</span>
              <span className={`inline-flex items-center gap-1 font-mono font-bold px-1.5 py-0.5 rounded text-[9px] ${
                order.origin_hub_id === 'bogor_express'
                  ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                  : 'text-amber-400 bg-amber-500/15 border border-amber-500/30'
              }`} title={order.fulfillment_origin || 'TeeStock Central Studio (Depok)'}>
                {order.origin_hub_id === 'bogor_express' ? '⚡ HUB BOGOR' : '🏭 STUDIO DEPOK'}
              </span>
            </div>
          </div>
        </div>

        {/* Embedded SOP for Heat Press */}
        {isPress && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> SOP Heat Press 155°C:
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-200 underline flex items-center gap-0.5 cursor-pointer"
                title="Buka panduan posisi sablon & foto mockup garmen"
              >
                <span>Lihat Posisi & Mockup</span>
              </button>
            </div>
            <div className="text-[10px] text-zinc-300">
              Tekan 15 dtk • Wajib Kupas Dingin • Press ke-2 (5 dtk Teflon)
            </div>
          </div>
        )}

        {/* Shipped Stage: Review Booster Button */}
        {order.status === 'shipped' && reviewWaUrl && (
          <a
            href={reviewWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full py-1.5 text-[10px] font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Minta Ulasan Bintang 5 via WA</span>
          </a>
        )}

        {/* QRIS Verification Notice for Pending Orders */}
        {(order.status === 'pending' || order.status === 'pending_payment') && (order.unique_code || order.uniqueCode) && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[11px] space-y-1">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Cek Mutasi Rekening / QRIS:
              </span>
              <span className="font-mono text-[10px] text-zinc-950 font-black bg-amber-400 px-1.5 py-0.2 rounded">
                +{order.unique_code || order.uniqueCode}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 flex justify-between">
              <span>Nominal Masuk:</span>
              <span className="font-mono text-white font-bold">{formatRupiah(order.total_payment || order.price)}</span>
            </div>
          </div>
        )}

        {/* CFO Financial Badge */}
        <div className="flex items-center justify-between text-[10px] font-mono px-2.5 py-1 bg-[#09090B] rounded-lg border border-white/[0.06] text-zinc-400">
          <span>Fee: <strong className="text-rose-400">-{formatRupiah(platformFee)}</strong></span>
          {shippingFee > 0 && (
            <span title="Dana titipan ongkir kurir (pass-through Rp 0 margin)">
              Kurir: <strong className="text-amber-400 font-medium">{formatRupiah(shippingFee)}</strong>
            </span>
          )}
          <span title="Laba bersih murni produk (setelah dipotong HPP & Fee, tanpa ongkir)">
            Net: <strong className={netProfit >= 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>+{formatRupiah(netProfit)}</strong>
          </span>
        </div>

        {/* Footer: Price & Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.08]">
          <div>
            <div className="font-mono text-xs font-black text-emerald-400">
              {formatRupiah(totalAmount)}
            </div>
            {shippingFee > 0 && (
              <div className="font-mono text-[9px] text-zinc-500">
                Produk: {formatRupiah(productRevenue)} + Ongkir: {formatRupiah(shippingFee)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Cancel Button */}
            {order.status !== 'shipped' && order.status !== 'cancelled' && (
              <button
                type="button"
                onClick={handleCancelOrder}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                title="Batalkan Pesanan"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Move Back */}
            {currentStatusIdx > 0 && (
              <button
                type="button"
                onClick={() => onMove(order.id, -1)}
                className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] transition-colors cursor-pointer min-h-[32px]"
                title="Kembalikan ke status sebelumnya"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Move Forward */}
            {currentStatusIdx < totalStatuses - 1 && (
              <button
                type="button"
                onClick={() => onMove(order.id, 1)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md transition-all cursor-pointer min-h-[32px] ${
                  (order.status === 'pending' || order.status === 'pending_payment')
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black shadow-amber-500/20'
                }`}
                title={
                  (order.status === 'pending' || order.status === 'pending_payment')
                    ? `Verifikasi mutasi QRIS (+${order.unique_code || order.uniqueCode || 0}) & mulai produksi`
                    : 'Lanjutkan status produksi'
                }
              >
                <span>{forwardLabels[order.status] || 'Lanjut'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal Input / Update Resi */}
      <Modal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        title={`Input / Update Nomor Resi — ${order.id}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSaveTracking} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Kurir Ekspedisi</label>
            <select
              value={courierInput}
              onChange={(e) => setCourierInput(e.target.value)}
              className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-amber-400 min-h-[44px]"
            >
              <option value="J&T Express">J&T Express</option>
              <option value="JNE Express">JNE Express</option>
              <option value="SiCepat Ekspres">SiCepat Ekspres</option>
              <option value="Shopee Xpress">Shopee Xpress</option>
              <option value="GoSend">GoSend (Instant/SameDay)</option>
              <option value="GrabExpress">GrabExpress</option>
              <option value="Anteraja">Anteraja</option>
              <option value="Pos Indonesia">Pos Indonesia</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">Nomor Resi / AWB *</label>
            <input
              type="text"
              placeholder="cth: JP8921829102"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="w-full bg-[#09090B] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 font-mono outline-none focus:border-amber-400 min-h-[44px]"
              required
            />
          </div>

          <p className="text-[11px] text-zinc-400">
            Nomor resi ini akan otomatis tercantum di pesan WhatsApp ke pelanggan dan label pengiriman thermal A6.
          </p>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setIsTrackingModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Simpan Resi
            </button>
          </div>
        </form>
      </Modal>

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
