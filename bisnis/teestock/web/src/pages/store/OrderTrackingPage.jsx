import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Clock, CheckCircle2, Truck, Flame, Printer, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';

export function OrderTrackingPage() {
  const { orders } = useAdmin();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);

  // Auto-search from ?order= query param
  useEffect(() => {
    const orderParam = searchParams.get('order');
    if (orderParam && orders.length > 0) {
      setQuery(orderParam);
      const trimmed = orderParam.trim().toLowerCase();
      const found = orders.find(o => 
        o.id.toLowerCase() === trimmed || 
        (o.trackingNo && o.trackingNo.toLowerCase() === trimmed) ||
        (o.phone && o.phone.toLowerCase().includes(trimmed))
      );
      setSearchResult(found || null);
      setSearched(true);
    }
  }, [searchParams, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const trimmed = query.trim().toLowerCase();
    const found = orders.find(o => 
      o.id.toLowerCase() === trimmed || 
      (o.phone && o.phone.toLowerCase().includes(trimmed))
    );

    setSearchResult(found || null);
    setSearched(true);
  };

  const steps = [
    { id: 'pending', label: 'Order Diterima', desc: 'Pesanan masuk ke sistem antrean workshop' },
    { id: 'dtf', label: 'Cetak Film DTF', desc: 'Artwork diproses di mesin cetak DTF HD Raster' },
    { id: 'press', label: 'Proses Heat Press', desc: 'Di-press suhu 155°C pada kaos garmen NSA' },
    { id: 'pack', label: 'QC & Kemasan Polymailer', desc: 'Pengecekan kualitas sablon & stiker hologram' },
    { id: 'shipped', label: 'Terkirim / Di Kurir', desc: 'Paket diserahkan ke kurir ekspedisi' }
  ];

  const getStepIndex = (status) => {
    return steps.findIndex(s => s.id === status);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
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
          {searchResult ? (
            <div className="bg-ts-surface/80 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 sm:p-8 space-y-6 shadow-glass-card shadow-glass-inset">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <div className="text-[11px] text-ts-muted">Nomor Pesanan:</div>
                  <div className="font-mono text-lg font-bold text-ts-terracotta">{searchResult.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-ts-muted">Penerima:</div>
                  <div className="font-bold text-white text-sm">{searchResult.customer}</div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-6 py-4">
                {steps.map((step, idx) => {
                  const currentIdx = getStepIndex(searchResult.status);
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
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl text-xs space-y-2 shadow-glass-inset">
                <div className="font-bold text-white">Rincian Produk:</div>
                <div className="flex justify-between text-ts-kremMuted">
                  <span>{searchResult.productName || searchResult.sku}</span>
                  <span className="text-white font-mono font-bold">
                    {searchResult.garment} ({searchResult.color} {searchResult.size}) x{searchResult.qty}
                  </span>
                </div>
                <div className="flex justify-between text-ts-green font-bold pt-2 border-t border-white/[0.06]">
                  <span>Total Tagihan:</span>
                  <span className="font-mono">{formatRupiah(searchResult.price)}</span>
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
