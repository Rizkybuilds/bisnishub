import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle2, Truck, Flame, Printer, AlertCircle } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';

export function OrderTrackingPage() {
  const { orders } = useAdmin();
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);

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
    { id: 'pending', label: 'Order Diterima', desc: 'Pesanan masuk ke sistem antrean' },
    { id: 'dtf', label: 'Cetak Film DTF', desc: 'Artwork dipersiapkan di mesin cetak' },
    { id: 'press', label: 'Proses Heat Press', desc: 'Di-press suhu 160°C pada kaos NSA' },
    { id: 'pack', label: 'QC & Packing', desc: 'Pengecekan kualitas & kemasan polymailer' },
    { id: 'shipped', label: 'Terkirim', desc: 'Paket diserahkan ke pihak ekspedisi' }
  ];

  const getStepIndex = (status) => {
    return steps.findIndex(s => s.id === status);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-ts-krem tracking-tight">Lacak Status Pesanan</h1>
        <p className="text-xs sm:text-sm text-ts-muted">
          Ketahui posisi pesanan kaos kamu secara transparan mulai dari antrean cetak sampai pengiriman.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
        <Input
          placeholder="Masukkan No. Pesanan (cth: SHP-2609-001) atau No. HP..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
          required
        />
        <Button type="submit" variant="primary" icon={Search}>
          Lacak
        </Button>
      </form>

      {/* Results */}
      {searched && (
        <div>
          {searchResult ? (
            <Card className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ts-borderDim">
                <div>
                  <div className="text-[11px] text-ts-muted">Nomor Pesanan:</div>
                  <div className="font-mono text-lg font-bold text-ts-terracotta">{searchResult.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-ts-muted">Penerima:</div>
                  <div className="font-bold text-ts-krem text-sm">{searchResult.customer}</div>
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
                            idx < currentIdx ? 'bg-ts-green' : 'bg-ts-border'
                          }`}
                        />
                      )}

                      {/* Step Circle Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors z-10 ${
                          isDone
                            ? 'bg-ts-green text-ts-hitam shadow-lg shadow-ts-green/20'
                            : 'bg-ts-surface border border-ts-border text-ts-muted'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-ts-terracotta' : isDone ? 'text-ts-krem' : 'text-ts-muted'}`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30 animate-pulse">
                              Sedang Dikerjakan
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-ts-muted mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Items Recap */}
              <div className="p-4 bg-ts-hitam/60 border border-ts-borderDim rounded-xl text-xs space-y-2">
                <div className="font-bold text-ts-krem">Rincian Produk:</div>
                <div className="flex justify-between text-ts-muted">
                  <span>{searchResult.productName || searchResult.sku}</span>
                  <span className="text-ts-krem font-mono font-bold">
                    {searchResult.garment} ({searchResult.color} {searchResult.size}) x{searchResult.qty}
                  </span>
                </div>
                <div className="flex justify-between text-ts-green font-bold pt-2 border-t border-ts-borderDim">
                  <span>Total Tagihan:</span>
                  <span className="font-mono">{formatRupiah(searchResult.price)}</span>
                </div>
              </div>
            </Card>
          ) : (
            <div className="py-12 text-center space-y-2 bg-ts-surface border border-ts-border rounded-2xl">
              <AlertCircle className="w-8 h-8 text-ts-muted mx-auto" />
              <p className="text-sm font-bold text-ts-krem">Pesanan Tidak Ditemukan</p>
              <p className="text-xs text-ts-muted">Pastikan nomor pesanan atau nomor telepon yang kamu masukkan sudah benar.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
