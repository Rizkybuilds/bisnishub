import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, Flame, Printer, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { SEOHead } from '../../components/common/SEOHead';

export function OrderTrackingPage() {
  const { orders } = useAdmin();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const findMatchingOrders = (term) => {
    const trimmed = term.trim().toLowerCase();
    if (!trimmed) return [];
    return orders.filter(o => 
      o.id.toLowerCase() === trimmed || 
      (o.parentOrderId && o.parentOrderId.toLowerCase() === trimmed) ||
      o.id.toLowerCase().startsWith(trimmed + '-') ||
      (o.trackingNo && o.trackingNo.toLowerCase() === trimmed) ||
      (o.phone && o.phone.toLowerCase().includes(trimmed))
    );
  };

  // Auto-search from ?order= query param
  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam && orders.length > 0) {
      setQuery(orderParam);
      const matched = findMatchingOrders(orderParam);
      setSearchResults(matched);
      setSearched(true);
    }
  }, [searchParams, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const matched = findMatchingOrders(query);
    setSearchResults(matched);
    setSearched(true);
  };

  const steps = [
    { id: 'pending', label: 'Order Diterima', icon: Clock, desc: 'Pesanan masuk & verifikasi artwork' },
    { id: 'dtf', label: 'Cetak Film DTF', icon: Printer, desc: 'Dicetak di roll DTF HD raster' },
    { id: 'press', label: 'Heat Press 155°C', icon: Flame, desc: 'Proses press garmen NSA & finishing' },
    { id: 'pack', label: 'Quality Control', icon: Package, desc: 'Pengecekan kualitas & polymailer pack' },
    { id: 'shipped', label: 'Paket Dikirim', icon: Truck, desc: 'Diserahkan ke kurir & nomor resi aktif' }
  ];

  const getCurrentStepIndex = (status) => {
    const idx = steps.findIndex(s => s.id === status);
    return idx >= 0 ? idx : 0;
  };

  const primaryOrder = searchResults[0] || null;
  const grandTotal = searchResults.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const displayOrderId = primaryOrder?.parentOrderId || primaryOrder?.id;

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
        <Button type="submit" variant="glow" icon={Search} className="px-5">
          Lacak
        </Button>
      </form>

      {/* Results */}
      {searched && (
        <div className="animate-in fade-in duration-300">
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
                  <span>Rincian Item ({searchResults.length}):</span>
                  <span className="text-[11px] text-ts-muted">Channel: {(primaryOrder.channel || 'web').toUpperCase()}</span>
                </div>
                <div className="divide-y divide-white/[0.06] space-y-2">
                  {searchResults.map((item, i) => (
                    <div key={item.id || i} className="pt-2 first:pt-0 flex justify-between items-center text-ts-kremMuted">
                      <div>
                        <div className="text-white font-medium">{item.productName || item.sku}</div>
                        <div className="text-[11px] text-ts-muted">
                          {item.garment} ({item.color || 'Hitam'} {item.size || 'L'}) • x{item.qty || 1} pcs
                        </div>
                      </div>
                      <div className="font-mono text-white font-bold text-right">
                        {formatRupiah(item.price)}
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
