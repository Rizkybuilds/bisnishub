import React from 'react';
import { Tag, Sparkles, X, Loader2, ShieldCheck, Truck, ArrowRight, Zap, QrCode } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';
import { PAYMENT_PROVIDERS } from '../../../services/paymentAdapter';

export function CartSummaryCard({
  totalCartAmount,
  effectiveProductDiscount,
  activeDiscountLabel,
  shippingFee,
  rawShippingFee,
  shippingDiscount,
  uniqueCode,
  grandTotal,
  appliedVoucher,
  voucherInput,
  setVoucherInput,
  handleApplyVoucher,
  handleRemoveVoucher,
  voucherLoading,
  voucherMsg,
  isSubmitting,
  onTriggerSubmit,
  weightInfo = null,
  selectedPaymentMethod = PAYMENT_PROVIDERS.MANUAL_QRIS
}) {
  const isInstantPayment = selectedPaymentMethod === PAYMENT_PROVIDERS.MIDTRANS_SNAP;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
          <Sparkles className="w-4 h-4 text-ts-terracotta" />
          Ringkasan Pesanan
        </h3>

        {/* Voucher Input Box */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-ts-kremMuted flex items-center justify-between">
            <span>Punya Kode Voucher?</span>
            {appliedVoucher && (
              <span className="text-[10px] font-mono text-ts-teal font-bold">
                AKTIF: {appliedVoucher.code}
              </span>
            )}
          </label>

          {appliedVoucher ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-ts-teal/10 border border-ts-teal/30 text-xs">
              <div className="flex items-center gap-2 text-ts-teal">
                <Tag className="w-4 h-4 shrink-0" />
                <div>
                  <p className="font-mono font-bold uppercase">{appliedVoucher.code}</p>
                  <p className="text-[11px] text-ts-kremMuted">{appliedVoucher.title}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveVoucher}
                className="p-1.5 hover:bg-white/10 rounded-lg text-ts-kremMuted hover:text-white transition-colors cursor-pointer"
                title="Hapus voucher"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contoh: WELCOME10"
                value={voucherInput}
                onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleApplyVoucher())}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-xs font-mono uppercase text-white placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta transition-colors"
              />
              <button
                type="button"
                onClick={() => handleApplyVoucher()}
                disabled={voucherLoading || !voucherInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-bold text-white border border-white/[0.1] transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {voucherLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Klaim'
                )}
              </button>
            </div>
          )}

          {voucherMsg && (
            <p className={`text-[11px] ${voucherMsg.type === 'success' ? 'text-ts-teal font-medium' : 'text-rose-400'}`}>
              {voucherMsg.text}
            </p>
          )}
        </div>

        {/* Calculation Lines */}
        <div className="space-y-2.5 pt-3 border-t border-white/[0.06] text-xs">
          <div className="flex justify-between text-ts-kremMuted">
            <span>Subtotal Produk</span>
            <span className="font-mono text-white">{formatRupiah(totalCartAmount)}</span>
          </div>

          {effectiveProductDiscount > 0 && (
            <div className="flex justify-between text-ts-teal font-medium">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Diskon {activeDiscountLabel.includes('bundle') ? 'Bundling Paket' : 'Voucher'}
              </span>
              <span className="font-mono">-{formatRupiah(effectiveProductDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-ts-kremMuted">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-ts-muted" />
              Ongkos Kirim {weightInfo?.billableWeightKg ? `(${weightInfo.billableWeightKg} kg)` : ''}
            </span>
            <div className="text-right font-mono">
              {shippingDiscount > 0 ? (
                <span>
                  <span className="line-through text-ts-muted mr-1.5">{formatRupiah(rawShippingFee)}</span>
                  <span className="text-ts-teal font-bold">{formatRupiah(shippingFee)}</span>
                </span>
              ) : (
                <span className="text-white">{formatRupiah(shippingFee)}</span>
              )}
            </div>
          </div>

          {/* Unique code only for manual bank/qris verification */}
          {!isInstantPayment && uniqueCode > 0 && (
            <div className="flex justify-between text-ts-kremMuted">
              <span className="flex items-center gap-1 text-[11px]">
                Kode Unik Transfer
                <span className="px-1.5 py-0.2 rounded bg-white/[0.06] font-mono text-[10px]">Otomatis</span>
              </span>
              <span className="font-mono text-ts-mustard font-semibold">+{uniqueCode}</span>
            </div>
          )}
        </div>

        {/* Grand Total */}
        <div className="pt-4 border-t border-white/[0.1] flex items-baseline justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ts-kremMuted">Total Pembayaran</p>
            <p className="text-[11px] text-ts-muted">
              {isInstantPayment ? 'Sesuai nominal pas' : 'Sudah termasuk kode unik'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-black font-mono text-white text-ts-terracotta">
              {formatRupiah(grandTotal)}
            </p>
          </div>
        </div>

        {/* Action Button Trigger */}
        <button
          type="button"
          onClick={onTriggerSubmit}
          disabled={isSubmitting || totalCartAmount === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            isInstantPayment
              ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
              : 'bg-ts-terracotta hover:bg-ts-terracottaDark text-white shadow-ts-terracotta/20'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses Transaksi...</span>
            </>
          ) : isInstantPayment ? (
            <>
              <Zap className="w-4 h-4" />
              <span>Bayar Instan Sekarang (Midtrans)</span>
            </>
          ) : (
            <>
              <span>Lanjut ke Pembayaran QRIS</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[10px] text-center text-ts-muted">
          {isInstantPayment
            ? '⚡ Instan 24 Jam via GoPay, ShopeePay, QRIS, & Virtual Account'
            : '📱 Scan QRIS atau transfer BCA manual + konfirmasi instan WhatsApp'}
        </p>
      </div>

      {/* 🎁 Exclusive Unboxing Perks Included */}
      <div className="p-4 rounded-2xl bg-ts-surface/90 border border-ts-terracotta/30 shadow-glow-terracotta-sm space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
            Paket Unboxing Eksklusif
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-ts-mustard/20 text-ts-mustard font-bold">
            GRATIS
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-ts-kremMuted pt-1">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span>🎁</span>
            <span className="truncate">Sticker Pack Vol. #01</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span>🏷️</span>
            <span className="truncate">Founder Care Card</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span>📦</span>
            <span className="truncate">Polymailer Doff Distro</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span>🛡️</span>
            <span className="truncate">Garansi 100% Anti-Pecah</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2.5 text-xs text-ts-kremMuted">
        <div className="flex items-center gap-2 text-white font-semibold text-xs">
          <ShieldCheck className="w-4 h-4 text-ts-teal" />
          <span>Jaminan Belanja TeeStock Apparel</span>
        </div>
        <ul className="space-y-1.5 text-[11px] pl-6 list-disc text-ts-kremMuted leading-relaxed">
          <li>100% garmen New States Apparel (NSA) original bebas bahan tiruan.</li>
          <li>Sablon DTF double-heat press 155°C lentur tahan mesin cuci.</li>
          <li>Garansi ganti baru 100% jika produk cacat jahit atau sablon retak.</li>
        </ul>
      </div>
    </div>
  );
}
