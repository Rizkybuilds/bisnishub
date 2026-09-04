import React, { useState } from 'react';
import { Printer, Copy, Check, ExternalLink, ScrollText } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { calculateGangSheet, generateVendorWhatsAppText } from '../../utils/dtfPlanner';
import { formatRupiah } from '../../utils/formatters';

export function GangSheetPage() {
  const { orders, showToast } = useAdmin();
  const [copied, setCopied] = useState(false);

  // Orders that need DTF printing
  const dtfOrders = orders.filter(o => o.status === 'dtf' || o.status === 'pending');
  const gangSheet = calculateGangSheet(dtfOrders);
  const waText = generateVendorWhatsAppText(gangSheet);

  const handleCopyText = () => {
    navigator.clipboard.writeText(waText);
    setCopied(true);
    showToast("✅ Format pemesanan DTF disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <AdminTopbar
        title="Gang Sheet DTF Planner"
        subtitle="Kalkulasi layout cetak roll DTF lebar 60 cm untuk dikirim ke MultiGraph / vendor sablon"
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-teal/20 text-ts-teal flex items-center justify-center font-bold">
              PCS
            </div>
            <div>
              <div className="text-xs text-ts-muted">Total Kaos Siap Cetak</div>
              <div className="font-mono text-xl font-bold text-ts-krem">{gangSheet.totalQty} pcs</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center font-bold">
              MTR
            </div>
            <div>
              <div className="text-xs text-ts-muted">Panjang Roll DTF</div>
              <div className="font-mono text-xl font-bold text-ts-mustard">{gangSheet.meters} Meter</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-green/20 text-ts-green flex items-center justify-center font-bold">
              RP
            </div>
            <div>
              <div className="text-xs text-ts-muted">Estimasi Biaya Vendor</div>
              <div className="font-mono text-xl font-bold text-ts-green">{formatRupiah(gangSheet.totalCost)}</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center font-bold">
              HPP
            </div>
            <div>
              <div className="text-xs text-ts-muted">Biaya Sablon Rata-rata</div>
              <div className="font-mono text-xl font-bold text-ts-terracotta">{formatRupiah(gangSheet.costPerPcs)} / pcs</div>
            </div>
          </Card>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Roll Simulation */}
          <Card>
            <h3 className="text-sm font-bold text-ts-krem mb-2 flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-ts-teal" />
              Simulasi Roll Bahan 60 cm (Area Efektif 58 cm)
            </h3>
            <p className="text-xs text-ts-muted mb-4">
              Susunan artwork otomatis disusun 2 kolom berurutan untuk memaksimalkan efisiensi film DTF.
            </p>

            <div className="bg-ts-hitam border border-ts-border rounded-xl p-4 min-h-[260px] flex flex-col items-center justify-center border-dashed">
              {dtfOrders.length === 0 ? (
                <div className="text-center text-xs text-ts-muted">
                  Belum ada pesanan yang mengantre di status Cetak DTF.
                </div>
              ) : (
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[11px] text-ts-muted font-mono pb-2 border-b border-ts-borderDim">
                    <span>&larr; Lebar Roll: 60 cm &rarr;</span>
                    <span>Panjang: {gangSheet.meters} Meter</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {dtfOrders.map((o, idx) => (
                      <div
                        key={idx}
                        className="bg-ts-surface border border-ts-teal/40 rounded-lg p-2.5 text-xs space-y-1"
                      >
                        <div className="font-mono text-[10px] text-ts-teal font-bold">{o.id}</div>
                        <div className="font-bold text-ts-krem truncate">{o.productName}</div>
                        <div className="text-[10px] text-ts-muted">{o.garment} ({o.color} {o.size})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* WhatsApp Vendor Message Output */}
          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                  <Printer className="w-4 h-4 text-ts-mustard" />
                  Format Teks Order Vendor (MultiGraph)
                </h3>
                <p className="text-xs text-ts-muted">Salin pesan ini dan kirimkan langsung via WhatsApp vendor.</p>
              </div>

              <Button
                size="sm"
                variant={copied ? "cream" : "primary"}
                icon={copied ? Check : Copy}
                onClick={handleCopyText}
              >
                {copied ? "Tersalin!" : "Salin Format"}
              </Button>
            </div>

            <textarea
              readOnly
              value={waText}
              className="w-full flex-1 min-h-[220px] bg-ts-hitam border border-ts-border rounded-xl p-3 font-mono text-xs text-ts-krem leading-relaxed focus:outline-none resize-none"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
