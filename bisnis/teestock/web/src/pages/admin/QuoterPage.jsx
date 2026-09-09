import React, { useState } from 'react';
import { Calculator, Copy, Check, MessageSquare, Send } from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { GARMENT_TYPES } from '../../constants/garments';
import { DTF_PRINT_SIZES, PRODUCTION_COSTS } from '../../constants/pricing';
import { formatRupiah } from '../../utils/formatters';
import { useAdmin } from '../../context/AdminContext';

export function QuoterPage() {
  const { showToast } = useAdmin();
  const [garmentId, setGarmentId] = useState('nsa_softstyle_30s');
  const [printSizeId, setPrintSizeId] = useState('a3');
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);

  const selectedGarment = GARMENT_TYPES[garmentId] || GARMENT_TYPES.nsa_softstyle_30s;
  const selectedPrint = DTF_PRINT_SIZES.find(p => p.id === printSizeId) || DTF_PRINT_SIZES[2];

  // Calculation
  const costBlank = selectedGarment.baseCost || 38000;
  const costDtf = selectedPrint.cost;
  const hppPcs = costBlank + costDtf + PRODUCTION_COSTS.pressLabor + PRODUCTION_COSTS.packaging + PRODUCTION_COSTS.overhead;

  // Tier pricing multiplier
  let marginMultiplier = 1.65; // Satuan 35-40% margin
  if (qty >= 12 && qty < 24) marginMultiplier = 1.45;
  else if (qty >= 24 && qty < 50) marginMultiplier = 1.35;
  else if (qty >= 50) marginMultiplier = 1.28;

  const rawRetail = Math.ceil((hppPcs * marginMultiplier) / 1000) * 1000;
  const totalPayment = rawRetail * qty;
  const netProfitTotal = (totalPayment - (hppPcs * qty));

  // WhatsApp formatted text
  const waText = `Halo kak! Terima kasih sudah menghubungi *TeeStock Apparel* 😊

Berikut rincian penawaran resmi untuk kaos custom kamu:
• Model Kaos: *${selectedGarment.name}* (100% Cotton Original NSA)
• Sablon: *DTF HD Raster (${selectedPrint.name})*
• Jumlah Pesanan: *${qty} pcs*
• Harga Satuan: *${formatRupiah(rawRetail)}*
• Total Pembayaran: *${formatRupiah(totalPayment)}*

*Keunggulan Sablon TeeStock:*
✅ Bahan kaos original New State Apparel, adem dan tidak menyusut
✅ Sablon DTF resolusi tinggi, warna cerah, dan lentur tahan cuci
✅ Quality Control ketat & kemasan distro rapi polymailer tebal
✅ Estimasi pengerjaan: 2-3 hari kerja

Apakah desain artwork-nya sudah siap untuk kami buatkan preview mockup digitalnya kak?`;

  const handleCopy = () => {
    navigator.clipboard.writeText(waText);
    setCopied(true);
    showToast("✅ Format balasan WhatsApp disalin!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <AdminTopbar
        title="Custom Order WhatsApp Quoter"
        subtitle="Hitung HPP cepat dan buat draf penawaran harga custom untuk dikirim ke chat calon pembeli"
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls & Calculator */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
              <Calculator className="w-4 h-4 text-ts-terracotta" />
              Parameter Custom Order
            </h3>

            <Select
              label="Pilih Model Bahan Kaos NSA"
              value={garmentId}
              onChange={(e) => setGarmentId(e.target.value)}
            >
              {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([k, g]) => (
                <option key={k} value={k}>{g.name} (HPP Bahan: {formatRupiah(g.baseCost)})</option>
              ))}
            </Select>

            <Select
              label="Ukuran Area Sablon DTF"
              value={printSizeId}
              onChange={(e) => setPrintSizeId(e.target.value)}
            >
              {DTF_PRINT_SIZES.map(p => (
                <option key={p.id} value={p.id}>{p.name} (HPP Sablon: {formatRupiah(p.cost)})</option>
              ))}
            </Select>

            <Input
              label="Jumlah Pesanan (Pcs)"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              helperText={qty >= 12 ? "🎉 Mendapatkan diskon tier lusinan!" : "Harga standar pesanan satuan"}
            />

            {/* Calculations Breakdown */}
            <div className="bg-ts-hitam/60 border border-ts-border rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-ts-muted">
                <span>HPP Pokok per Pcs:</span>
                <span className="font-mono font-bold text-ts-krem">{formatRupiah(hppPcs)}</span>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Rekomendasi Harga Satuan:</span>
                <span className="font-mono font-bold text-ts-terracotta">{formatRupiah(rawRetail)}</span>
              </div>
              <div className="flex justify-between text-ts-krem font-bold pt-2 border-t border-ts-borderDim text-sm">
                <span>Total Ditagihkan ke Pelanggan:</span>
                <span className="font-mono text-ts-green">{formatRupiah(totalPayment)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-ts-green font-semibold">
                <span>Estimasi Laba Bersih Total:</span>
                <span className="font-mono">{formatRupiah(netProfitTotal)}</span>
              </div>
            </div>
          </Card>

          {/* Generated Customer Message */}
          <Card className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-ts-mustard" />
                  Format Balasan Chat Pelanggan
                </h3>
                <p className="text-xs text-ts-muted">Teks ramah, meyakinkan, dan siap kirim ke WhatsApp.</p>
              </div>

              <Button
                size="sm"
                variant={copied ? "cream" : "primary"}
                icon={copied ? Check : Copy}
                onClick={handleCopy}
              >
                {copied ? "Tersalin!" : "Salin Chat"}
              </Button>
            </div>

            <textarea
              readOnly
              value={waText}
              className="w-full flex-1 min-h-[300px] bg-ts-hitam border border-ts-border rounded-xl p-4 font-sans text-xs text-ts-krem leading-relaxed focus:outline-none resize-none"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
