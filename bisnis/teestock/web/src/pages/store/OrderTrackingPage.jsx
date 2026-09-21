import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Flame, 
  Printer, 
  AlertCircle, 
  ExternalLink, 
  Loader2,
  Copy,
  Check,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '@bisnishub/shared/context/StoreContext';
import { trackSingleOrder } from '@bisnishub/shared/services/ordersApi';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { Input } from '@bisnishub/shared/components/ui/Input';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { sanitizePhoneNumber } from '@bisnishub/shared/utils/whatsappTemplates';
import { SEOHead } from '@bisnishub/shared/components/common/SEOHead';

/**
 * 5 Tahapan Resmi Siklus Produksi & Fulfillment Studio TeeStock
 */
export const TRACKING_STEPS = [
  { id: 'pending', label: 'Order Diterima', desc: 'Pesanan masuk & verifikasi artwork / pembayaran' },
  { id: 'dtf', label: 'Cetak Film DTF', desc: 'Dicetak di roll DTF HD raster premium' },
  { id: 'press', label: 'Heat Press 155°C', desc: 'Proses press garmen NSA & finishing elastis' },
  { id: 'pack', label: 'Quality Control', desc: 'Pengecekan defect kain & kemasan matte doff' },
  { id: 'shipped', label: 'Paket Dikirim', desc: 'Diserahkan ke kurir & nomor resi aktif' }
];

/**
 * Normalisasi dan resolver status pesanan ke tahapan timeline produksi (0 - 4)
 */
export function resolveTimelineStep(status) {
  if (!status || typeof status !== 'string') {
    return {
      stepIndex: 0,
      isCompleted: false,
      stepId: 'pending',
      stepLabel: 'Order Diterima',
      badgeText: 'Menunggu Verifikasi',
      badgeVariant: 'warning'
    };
  }

  const s = status.trim().toLowerCase();

  // Shipped / Completed
  if (['shipped', 'dikirim', 'completed', 'selesai', 'delivered'].includes(s)) {
    return {
      stepIndex: 4,
      isCompleted: true,
      stepId: 'shipped',
      stepLabel: 'Paket Dikirim',
      badgeText: s === 'completed' || s === 'selesai' ? 'Pesanan Selesai' : 'Dalam Pengiriman Kurir',
      badgeVariant: 'success'
    };
  }

  // Pack / QC
  if (['pack', 'packing', 'qc', 'quality_control', 'dikemas'].includes(s)) {
    return {
      stepIndex: 3,
      isCompleted: false,
      stepId: 'pack',
      stepLabel: 'Quality Control',
      badgeText: 'Pengecekan Kualitas & Packing',
      badgeVariant: 'teal'
    };
  }

  // Press / Heat Press
  if (['press', 'heat_press', 'pressing', 'sablon'].includes(s)) {
    return {
      stepIndex: 2,
      isCompleted: false,
      stepId: 'press',
      stepLabel: 'Heat Press 155°C',
      badgeText: 'Proses Press Garmen NSA 155°C',
      badgeVariant: 'terracotta'
    };
  }

  // DTF Printing
  if (['dtf', 'dtf_printing', 'printing', 'cetak'].includes(s)) {
    return {
      stepIndex: 1,
      isCompleted: false,
      stepId: 'dtf',
      stepLabel: 'Cetak Film DTF',
      badgeText: 'Cetak Film Sablon DTF Roll',
      badgeVariant: 'mustard'
    };
  }

  // Pending / Payment Verification
  return {
    stepIndex: 0,
    isCompleted: false,
    stepId: 'pending',
    stepLabel: 'Order Diterima',
    badgeText: s.includes('paid') && !s.includes('unpaid') ? 'Pembayaran Terkonfirmasi' : 'Menunggu Verifikasi Pembayaran',
    badgeVariant: 'warning'
  };
}

/**
 * Validasi 4 digit terakhir nomor HP untuk proteksi data privasi pelanggan
 */
export function verifyPhoneLast4Digits(actualPhone, inputDigits) {
  if (!actualPhone || !inputDigits) return false;
  const cleanActual = String(actualPhone).replace(/\D/g, '');
  const cleanInput = String(inputDigits).replace(/\D/g, '');
  if (cleanInput.length !== 4) return false;
  return cleanActual.endsWith(cleanInput);
}

/**
 * Masking nomor HP pelanggan untuk privasi tampilan publik (cth: 0812****7890)
 */
export function maskPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 6) return phone;
  const prefix = digits.slice(0, 4);
  const suffix = digits.slice(-4);
  return `${prefix}****${suffix}`;
}

/**
 * Direct Tracking Portal Link Generator berdasarkan kurir ekspedisi
 */
export function getTrackingCourierUrl(courier = '', trackingNo = '') {
  if (!trackingNo) return null;
  const c = String(courier || '').toLowerCase();
  const cleanResi = encodeURIComponent(String(trackingNo).trim());

  if (c.includes('j&t') || c.includes('jet')) {
    return `https://www.jet.co.id/track`;
  }
  if (c.includes('sicepat')) {
    return `https://www.sicepat.com/checkAwb`;
  }
  if (c.includes('jne')) {
    return `https://www.jne.co.id/id/tracking/trace`;
  }
  if (c.includes('anteraja')) {
    return `https://anteraja.id/tracking`;
  }
  return `https://cekresi.com/?noresi=${cleanResi}`;
}

/**
 * URL Generator untuk chat WhatsApp bantuan pesanan studio
 */
export function generateOrderTrackingWaUrl({
  orderId,
  customerName = '',
  totalTransfer = 0,
  uniqueCode = 0,
  storeWhatsapp = '085220274968'
}) {
  const targetPhone = sanitizePhoneNumber(storeWhatsapp);
  const text = `Halo Admin TeeStock, saya ingin menanyakan status Pesanan #${orderId || ''}${customerName ? ` a.n. ${customerName}` : ''}.${uniqueCode > 0 ? ` (Total transfer: ${formatRupiah(totalTransfer)}, Kode unik: +${uniqueCode})` : ''} Terima kasih!`;
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

export function OrderTrackingPage() {
  const { storeSettings } = useStore();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [phoneLast4, setPhoneLast4] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [copiedResi, setCopiedResi] = useState(false);

  const handleCopyResi = (resi) => {
    if (!resi) return;
    navigator.clipboard.writeText(String(resi).trim()).then(() => {
      setCopiedResi(true);
      setTimeout(() => setCopiedResi(false), 2500);
    });
  };

  const executeSearch = async (term, last4) => {
    const trimmed = (term || '').trim();
    const cleanLast4 = String(last4 ?? phoneLast4 ?? '').replace(/\D/g, '');
    if (!trimmed) return;

    if (cleanLast4.length !== 4) {
      setSearchError('Demi melindungi privasi pelanggan, masukkan tepat 4 digit terakhir nomor HP pemesan.');
      setSearchResults([]);
      setSearched(true);
      return;
    }

    setSearching(true);
    setSearchError(null);
    try {
      const results = await trackSingleOrder(trimmed, cleanLast4);
      setSearchResults(results);
      setSelectedOrderIndex(0);
      setSearched(true);
    } catch (err) {
      console.warn("Tracking search error:", err);
      setSearchError(err.message || 'Pesanan tidak ditemukan atau 4 digit nomor HP tidak cocok.');
      setSearchResults([]);
      setSelectedOrderIndex(0);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  };

  // Auto-search from ?order= query param
  useEffect(() => {
    const orderParam = searchParams.get('order');
    const phoneParam = searchParams.get('phone');
    if (orderParam) {
      setQuery(orderParam);
      if (phoneParam) {
        const last4 = phoneParam.replace(/\D/g, '').slice(-4);
        setPhoneLast4(last4);
        executeSearch(orderParam, last4);
      } else {
        // Cek apakah pesanan ada di riwayat lokal browser pembeli sendiri (direct checkout redirect)
        try {
          const myOrders = JSON.parse(localStorage.getItem('teestock_my_orders') || '[]');
          const matched = myOrders.filter(o => 
            (o.id && o.id.toLowerCase() === orderParam.toLowerCase()) || 
            (o.order_number && o.order_number.toLowerCase() === orderParam.toLowerCase()) ||
            (o.parentOrderId && o.parentOrderId.toLowerCase() === orderParam.toLowerCase())
          );
          if (matched && matched.length > 0) {
            const last4 = (matched[0].phone || '').replace(/\D/g, '').slice(-4);
            if (last4) setPhoneLast4(last4);
            setSearchResults(matched);
            setSelectedOrderIndex(0);
            setSearched(true);
            return;
          }
        } catch (_) {}
      }
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(query, phoneLast4);
  };

  const primaryOrder = searchResults[selectedOrderIndex] || searchResults[0] || null;
  const itemsToDisplay = (primaryOrder?.items && primaryOrder.items.length > 0)
    ? primaryOrder.items
    : searchResults;
  const grandTotal = primaryOrder?.total_amount || primaryOrder?.price || searchResults.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const displayOrderId = primaryOrder?.order_number || primaryOrder?.parentOrderId || primaryOrder?.id;
  const uniqueCode = primaryOrder?.unique_code || primaryOrder?.uniqueCode;
  const adminWa = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  // Resolve active timeline step using pure function
  const timelineInfo = primaryOrder ? resolveTimelineStep(primaryOrder.status) : resolveTimelineStep('pending');
  const currentIdx = timelineInfo.stepIndex;

  // Courier URL
  const courierUrl = primaryOrder?.trackingNo ? getTrackingCourierUrl(primaryOrder.courier, primaryOrder.trackingNo) : null;

  // WhatsApp Support URL
  const supportWaUrl = generateOrderTrackingWaUrl({
    orderId: displayOrderId,
    customerName: primaryOrder?.customer,
    totalTransfer: primaryOrder?.total_payment || grandTotal,
    uniqueCode: uniqueCode || 0,
    storeWhatsapp: adminWa
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEOHead
        title="Lacak Status Pesanan &amp; Resi Pengiriman | TeeStock"
        description="Lacak proses sablon dan pengiriman pesanan kaos TeeStock kamu secara transparan dari antrean DTF hingga kurir."
        canonicalPath="/tracking"
      />
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ts-krem tracking-tight">Lacak Status Pesanan</h1>
        <p className="text-xs sm:text-sm text-ts-kremMuted">
          Ketahui posisi pesanan kaos kamu secara transparan mulai dari antrean cetak DTF sampai pengiriman ekspedisi.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <Input
              id="tracking-order-query"
              placeholder="Nomor Pesanan (cth: TS-260914-A7FC)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full min-h-[44px]"
              aria-label="Nomor Pesanan"
              required
            />
          </div>
          <div className="w-full sm:w-44">
            <Input
              id="tracking-phone-digits"
              placeholder="4 Digit Akhir HP"
              value={phoneLast4}
              onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
              className="w-full min-h-[44px] text-center font-mono tracking-widest"
              maxLength={4}
              aria-label="4 Digit Akhir Nomor WhatsApp"
              required
            />
          </div>
          <Button 
            type="submit" 
            variant="glow" 
            icon={searching ? Loader2 : Search} 
            disabled={searching} 
            className="min-h-[44px] px-6 whitespace-nowrap active:scale-95 cursor-pointer shadow-sm"
          >
            {searching ? 'Mencari...' : 'Lacak'}
          </Button>
        </div>
        <p className="text-[11px] text-ts-kremMuted/80 text-center">
          🔒 Verifikasi 4 digit HP diperlukan untuk melindungi kerahasiaan rincian pesanan dan status resi Anda.
        </p>
      </form>

      {/* Results */}
      {searched && (
        <div className="animate-in fade-in duration-300 space-y-4" role="status" aria-live="polite">
          {/* Multi-Order Tabs jika pencarian mengembalikan lebih dari 1 order */}
          {searchResults.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-ts-surface border border-ts-border max-w-lg mx-auto">
              <span className="text-xs text-ts-muted">Ditemukan {searchResults.length} pesanan:</span>
              {searchResults.map((ord, idx) => (
                <button
                  key={ord.id || ord.order_number || idx}
                  type="button"
                  onClick={() => setSelectedOrderIndex(idx)}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedOrderIndex === idx
                      ? 'bg-ts-terracotta text-white shadow-sm'
                      : 'bg-ts-surfaceHover hover:bg-ts-border text-ts-kremMuted'
                  }`}
                  aria-label={`Lihat pesanan ${ord.order_number || ord.id}`}
                >
                  {ord.order_number || ord.id}
                </button>
              ))}
            </div>
          )}

          {searchResults.length > 0 && primaryOrder ? (
            <div className="bg-ts-surface border border-ts-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ts-border">
                <div>
                  <div className="text-[11px] text-ts-muted">Nomor Pesanan:</div>
                  <div className="font-mono text-lg font-bold text-ts-terracotta">{displayOrderId}</div>
                  <div className="text-[11px] text-ts-kremMuted mt-0.5">
                    Tanggal: <span className="font-mono text-ts-krem">{primaryOrder.date ? new Date(primaryOrder.date).toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Hari Ini'}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-ts-muted">Penerima:</div>
                  <div className="font-bold text-ts-krem text-sm">{primaryOrder.customer}</div>
                  <div className="text-[11px] text-ts-kremMuted">{itemsToDisplay.length} Item Pesanan</div>
                </div>
              </div>

              {/* 📦 Courier Tracking Number Card (One-Click Copy & Direct Courier Link) */}
              {primaryOrder.trackingNo && (
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-sky-400 shrink-0" />
                      <span className="font-bold text-sky-300 uppercase tracking-wider text-[11px]">
                        {primaryOrder.courier || 'Ekspedisi Pengiriman'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-ts-kremMuted">No. Resi Pengiriman:</span>
                      <span className="font-mono text-sm font-bold text-ts-krem bg-ts-surface px-2.5 py-0.5 rounded-lg border border-ts-border">
                        {primaryOrder.trackingNo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => handleCopyResi(primaryOrder.trackingNo)}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                      aria-label="Salin nomor resi pengiriman"
                    >
                      {copiedResi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Resi</span>
                        </>
                      )}
                    </button>

                    {courierUrl && (
                      <a
                        href={courierUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                      >
                        <span>Cek di Web Kurir</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Verification Status (QRIS Manual) */}
              {(uniqueCode || primaryOrder.payment_method === 'manual_qris' || primaryOrder.payment_method === 'qris_manual') && (
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  primaryOrder.status === 'pending' || primaryOrder.status === 'pending_payment'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {primaryOrder.status === 'pending' || primaryOrder.status === 'pending_payment' ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="font-bold text-xs text-amber-600 dark:text-amber-300 uppercase tracking-wider">
                            Menunggu Verifikasi Pembayaran QRIS
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                            Pembayaran QRIS Lunas &amp; Terverifikasi
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-ts-kremMuted">
                      {primaryOrder.status === 'pending' || primaryOrder.status === 'pending_payment' ? (
                        <>
                          Nominal transfer wajib persis: <strong className="text-ts-krem font-mono">{formatRupiah(primaryOrder.total_payment || grandTotal)}</strong> (termasuk kode unik <span className="text-ts-mustard font-bold font-mono">+{uniqueCode}</span>).
                        </>
                      ) : (
                        'Pesanan telah lunas terverifikasi dan masuk antrean produksi sablon.'
                      )}
                    </p>
                  </div>

                  {(primaryOrder.status === 'pending' || primaryOrder.status === 'pending_payment') && (
                    <a
                      href={`https://wa.me/${adminWa}?text=${encodeURIComponent(
                        `Halo Admin TeeStock, saya ingin konfirmasi transfer QRIS untuk Pesanan #${displayOrderId} sebesar ${formatRupiah(primaryOrder.total_payment || grandTotal)} (Kode unik: +${uniqueCode}). Terima kasih!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-600 dark:text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95"
                    >
                      <span>Konfirmasi via WA</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Status Timeline Progress */}
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-ts-kremMuted">
                    Progres Produksi Studio &amp; Pengiriman
                  </span>
                  <span className="text-xs font-mono font-bold text-ts-terracotta">
                    Tahap {currentIdx + 1} dari 5
                  </span>
                </div>

                {TRACKING_STEPS.map((step, idx) => {
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.id} className="flex items-start gap-4 relative">
                      {/* Vertical line connecting steps */}
                      {idx < TRACKING_STEPS.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${
                            idx < currentIdx ? 'bg-ts-green' : 'bg-ts-border'
                          }`}
                        />
                      )}

                      {/* Step Circle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-all z-10 ${
                          isDone
                            ? 'bg-ts-green text-zinc-950 shadow-sm'
                            : 'bg-ts-surfaceHover border border-ts-border text-ts-muted'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-ts-terracotta' : isDone ? 'text-ts-krem' : 'text-ts-muted'}`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/40 animate-pulse">
                              {timelineInfo.badgeText || 'Sedang Diproses'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ts-kremMuted mt-0.5 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Items Recap */}
              <div className="p-4 bg-ts-surfaceHover/40 border border-ts-border rounded-2xl text-xs space-y-3">
                <div className="font-bold text-ts-krem flex items-center justify-between">
                  <span>Rincian Item ({itemsToDisplay.length}):</span>
                  <span className="text-[11px] text-ts-muted">Channel: {(primaryOrder.channel || 'web').toUpperCase()}</span>
                </div>
                <div className="divide-y divide-ts-border space-y-2">
                  {itemsToDisplay.map((item, i) => (
                    <div key={item.id || i} className="pt-2 first:pt-0 flex justify-between items-center text-ts-kremMuted">
                      <div>
                        <div className="text-ts-krem font-medium">{item.name || item.product_name || item.productName || item.sku}</div>
                        <div className="text-[11px] text-ts-muted">
                          {item.garment || 'NSA Heavyweight 24s'} ({item.color || 'Hitam'} {item.size || 'L'}) • x{item.qty || 1} pcs
                        </div>
                      </div>
                      <div className="font-mono text-ts-krem font-bold text-right">
                        {formatRupiah(item.subtotal || item.price || item.unit_price)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-ts-green font-bold pt-3 border-t border-ts-border text-sm">
                  <span>Total Tagihan:</span>
                  <span className="font-mono text-base">{formatRupiah(grandTotal)}</span>
                </div>
              </div>

              {/* Quick WhatsApp Assistance Shortcut */}
              <div className="pt-2">
                <a
                  href={supportWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] py-3 rounded-xl bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem font-semibold text-xs border border-ts-border transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>Ada Pertanyaan atau Ingin Revisi Alamat? Hubungi CS Studio via WA</span>
                </a>
              </div>
            </div>
          ) : searchError ? (
            <div className="py-12 text-center space-y-2 bg-ts-surface border border-rose-500/30 rounded-3xl">
              <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-sm font-bold text-ts-krem">Gagal Memuat Data Pelacakan</p>
              <p className="text-xs text-ts-kremMuted">{searchError}</p>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 bg-ts-surface border border-ts-border rounded-3xl shadow-sm">
              <AlertCircle className="w-8 h-8 text-ts-muted mx-auto" />
              <p className="text-sm font-bold text-ts-krem">Pesanan Tidak Ditemukan</p>
              <p className="text-xs text-ts-kremMuted">Pastikan nomor pesanan dan 4 digit terakhir nomor WhatsApp yang kamu masukkan sudah sesuai.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

