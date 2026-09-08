import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, Flame, Printer, AlertCircle, ExternalLink, QrCode, Loader2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { trackSingleOrder } from '../../services/ordersApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { SEOHead } from '../../components/common/SEOHead';

export function OrderTrackingPage() {
  const { storeSettings } = useStore();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  const executeSearch = async (term) => {
    const trimmed = (term || '').trim();
    if (!trimmed) return;
    setSearching(true);
    try {
      const results = await trackSingleOrder(trimmed);
      setSearchResults(results);
      setSelectedOrderIndex(0);
      setSearched(true);
    } catch (err) {
      console.warn("Tracking search error:", err);
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
    if (orderParam) {
      setQuery(orderParam);
      executeSearch(orderParam);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const steps = [
    { id: 'pending', label: 'Order Diterima', icon: Clock, desc: 'Pesanan masuk & verifikasi artwork/pembayaran' },
    { id: 'dtf', label: 'Cetak Film DTF', icon: Printer, desc: 'Dicetak di roll DTF HD raster' },
    { id: 'press', label: 'Heat Press 155°C', icon: Flame, desc: 'Proses press garmen NSA & finishing' },
    { id: 'pack', label: 'Quality Control', icon: Package, desc: 'Pengecekan kualitas & polymailer pack' },
    { id: 'shipped', label: 'Paket Dikirim', icon: Truck, desc: 'Diserahkan ke kurir & nomor resi aktif' }
  ];

  const getCurrentStepIndex = (status) => {
    const idx = steps.findIndex(s => s.id === status);
    return idx >= 0 ? idx : 0;
  };

  const primaryOrder = searchResults[selectedOrderIndex] || searchResults[0] || null;
  const itemsToDisplay = (primaryOrder?.items && primaryOrder.items.length > 0)
    ? primaryOrder.items
    : searchResults;
  const grandTotal = primaryOrder?.total_amount || primaryOrder?.price || searchResults.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const displayOrderId = primaryOrder?.order_number || primaryOrder?.parentOrderId || primaryOrder?.id;
  const uniqueCode = primaryOrder?.unique_code || primaryOrder?.uniqueCode;
  const adminWa = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEOHead
        title="Lacak Status Pesanan & Resi Pengiriman | TeeStock"
        description="Lacak proses sablon dan pengiriman pesanan kaos TeeStock kamu secara transparan dari antrean DTF hingga kurir."
        canonicalPath="/tracking"
      />
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Lacak Status Pesanan</h1>
        <p className="text-xs sm:text-sm text-ts-kremMuted">
          Ketahui posisi pesanan kaos kamu secara transparan mulai dari antrean cetak sampai pengiriman.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <Input
          placeholder="Masukkan No. Pesanan (cth: WEB-123456) atau No. HP..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" variant="glow" icon={searching ? Loader2 : Search} disabled={searching} className="px-5">
          {searching ? 'Mencari...' : 'Lacak'}
        </Button>
      </form>

      {/* Results */}
      {searched && (
        <div className="animate-in fade-in duration-300 space-y-4">
          {/* Multi-Order Tabs jika pencarian mengembalikan lebih dari 1 order */}
          {searchResults.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] max-w-lg mx-auto">
              <span className="text-xs text-ts-muted">Ditemukan {searchResults.length} pesanan:</span>
              {searchResults.map((ord, idx) => (
                <button
                  key={ord.id || ord.order_number || idx}
                  type="button"
                  onClick={() => setSelectedOrderIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    selectedOrderIndex === idx
                      ? 'bg-ts-terracotta text-white shadow-glow-terracotta'
                      : 'bg-white/[0.06] hover:bg-white/[0.12] text-ts-kremMuted'
                  }`}
                >
                  {ord.order_number || ord.id}
                </button>
              ))}
            </div>
          )}

          {searchResults.length > 0 ? (
            <div className="bg-ts-surface/80 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-glass-card shadow-glass-inset">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="text-[11px] text-ts-muted">Nomor Pesanan:</div>
                  <div className="font-mono text-lg font-bold text-ts-terracotta">{displayOrderId}</div>
                  {primaryOrder.trackingNo && (
                    <div className="text-[11px] text-ts-kremMuted mt-0.5">
                      No. Resi Kurir: <span className="font-mono text-white font-semibold">{primaryOrder.trackingNo}</span>
                    </div>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-ts-muted">Penerima:</div>
                  <div className="font-bold text-white text-sm">{primaryOrder.customer}</div>
                  <div className="text-[11px] text-ts-kremMuted">{searchResults.length} Item Pesanan</div>
                </div>
              </div>

              {/* Payment Verification Status (QRIS Manual) */}
              {(uniqueCode || primaryOrder.payment_method === 'qris_manual') && (
                <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  primaryOrder.status === 'pending'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {primaryOrder.status === 'pending' ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                          <span className="font-bold text-xs text-amber-300 uppercase tracking-wider">
                            Menunggu Verifikasi Pembayaran QRIS
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                            Pembayaran QRIS Lunas &amp; Terverifikasi
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-ts-kremMuted">
                      {primaryOrder.status === 'pending' ? (
                        <>
                          Nominal transfer wajib persis: <strong className="text-white font-mono">{formatRupiah(primaryOrder.total_payment || grandTotal)}</strong> (termasuk kode unik <span className="text-ts-mustard font-bold font-mono">+{uniqueCode}</span>).
                        </>
                      ) : (
                        'Pesanan telah lunas terverifikasi dan masuk antrean produksi sablon.'
                      )}
                    </p>
                  </div>

                  {primaryOrder.status === 'pending' && (
                    <a
                      href={`https://wa.me/${adminWa}?text=${encodeURIComponent(
                        `Halo Admin TeeStock, saya ingin konfirmasi transfer QRIS untuk Pesanan #${displayOrderId} sebesar ${formatRupiah(primaryOrder.total_payment || grandTotal)} (Kode unik: +${uniqueCode}). Terima kasih!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-all"
                    >
                      <span>Konfirmasi via WA</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Status Timeline */}
              <div className="space-y-6 py-4">
                {steps.map((step, idx) => {
                  const currentIdx = getCurrentStepIndex(primaryOrder.status);
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={step.id} className="flex items-start gap-4 relative">
                      {/* Vertical line connecting steps */}
                      {idx < steps.length - 1 && (
                        <div
                          className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${
                            idx < currentIdx ? 'bg-ts-green shadow-glow-teal' : 'bg-white/[0.08]'
                          }`}
                        />
                      )}

                      {/* Step Circle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-all z-10 ${
                          isDone
                            ? 'bg-ts-green text-zinc-950 shadow-glow-teal'
                            : 'bg-white/[0.04] border border-white/[0.1] text-ts-muted'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-ts-terracotta' : isDone ? 'text-white' : 'text-ts-muted'}`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-ts-terracotta/20 text-[#E2885E] border border-ts-terracotta/40 animate-pulse">
                              Sedang Diproses
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
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl text-xs space-y-3 shadow-glass-inset">
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Rincian Item ({itemsToDisplay.length}):</span>
                  <span className="text-[11px] text-ts-muted">Channel: {(primaryOrder.channel || 'web').toUpperCase()}</span>
                </div>
                <div className="divide-y divide-white/[0.06] space-y-2">
                  {itemsToDisplay.map((item, i) => (
                    <div key={item.id || i} className="pt-2 first:pt-0 flex justify-between items-center text-ts-kremMuted">
                      <div>
                        <div className="text-white font-medium">{item.name || item.product_name || item.productName || item.sku}</div>
                        <div className="text-[11px] text-ts-muted">
                          {item.garment} ({item.color || 'Hitam'} {item.size || 'L'}) • x{item.qty || 1} pcs
                        </div>
                      </div>
                      <div className="font-mono text-white font-bold text-right">
                        {formatRupiah(item.subtotal || item.price || item.unit_price)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-ts-green font-bold pt-3 border-t border-white/[0.08] text-sm">
                  <span>Total Tagihan:</span>
                  <span className="font-mono text-base">{formatRupiah(grandTotal)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2 bg-ts-surface/60 border border-white/[0.08] rounded-3xl backdrop-blur-md">
              <AlertCircle className="w-8 h-8 text-ts-muted mx-auto" />
              <p className="text-sm font-bold text-white">Pesanan Tidak Ditemukan</p>
              <p className="text-xs text-ts-kremMuted">Pastikan nomor pesanan atau nomor telepon yang kamu masukkan sudah benar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
