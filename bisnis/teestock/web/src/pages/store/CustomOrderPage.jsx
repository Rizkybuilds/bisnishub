import React, { useState } from 'react';
import { Send, Upload, Sparkles, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { DTF_PRINT_SIZES } from '../../constants/pricing';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function CustomOrderPage() {
  const { addOrder } = useAdmin();
  const { storeSettings } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [garmentKey, setGarmentKey] = useState('nsa_softstyle_30s');
  const [color, setColor] = useState('Hitam');
  const [size, setSize] = useState('L');
  const [printSizeId, setPrintSizeId] = useState('a3');
  const [qty, setQty] = useState(1);
  const [artworkLink, setArtworkLink] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedGarment = GARMENT_TYPES[garmentKey] || GARMENT_TYPES.nsa_softstyle_30s;
  const selectedPrint = DTF_PRINT_SIZES.find(p => p.id === printSizeId) || DTF_PRINT_SIZES[2];

  // Price Calculation
  const baseCost = selectedGarment.baseCost + selectedPrint.cost + 8500;
  let multiplier = 1.65;
  if (qty >= 12) multiplier = 1.45;
  if (qty >= 24) multiplier = 1.35;
  const estPricePerPcs = Math.ceil((baseCost * multiplier) / 1000) * 1000;
  const estTotal = estPricePerPcs * qty;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Mohon isi nama dan nomor WhatsApp kamu");
      return;
    }

    const orderNumber = `CST-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderNumber,
      customer: name.trim(),
      phone: `${phone.trim()} (${city.trim() || 'Indonesia'})`,
      channel: 'web',
      sku: 'CUSTOM-ORDER',
      productName: `Custom Sablon (${selectedPrint.name})`,
      garment: selectedGarment.name,
      color,
      size,
      qty: Number(qty),
      price: estTotal,
      fee: 0,
      status: 'pending',
      date: new Date().toISOString()
    };

    addOrder(newOrder);
    setSubmitted(true);
  };

  if (submitted) {
    const targetPhone = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '081280000581');
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
      `Halo TeeStock! Saya ingin konfirmasi pesanan custom:\nNama: ${name}\nModel: ${selectedGarment.name} (${color} ${size})\nJumlah: ${qty} pcs\nArtwork: ${artworkLink || 'Kirim via WA'}\nCatatan: ${notes}`
    )}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-ts-krem">Permintaan Custom Diterima!</h2>
          <p className="text-xs sm:text-sm text-ts-muted">
            Pesanan kamu telah masuk ke sistem antrean kami. Tim kami akan segera meninjau artwork dan mengirimkan mockup preview digital.
          </p>
        </div>

        <div className="p-6 bg-ts-surface border border-ts-border rounded-2xl text-left space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-ts-muted">Nama:</span> <strong className="text-ts-krem">{name}</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Model & Ukuran:</span> <strong className="text-ts-krem">{selectedGarment.name} • {color} ({size})</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Jumlah:</span> <strong className="text-ts-krem">{qty} pcs</strong></div>
          <div className="flex justify-between text-ts-green font-bold text-sm pt-2 border-t border-ts-borderDim">
            <span>Estimasi Biaya:</span> <span>{formatRupiah(estTotal)}</span>
          </div>
        </div>

        <div className="pt-2">
          <a href={waUrl} target="_blank" rel="noreferrer">
            <Button size="lg" variant="primary" icon={MessageSquare}>
              Lanjutkan Chat WhatsApp dengan Tim Desain
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl font-extrabold text-ts-krem tracking-tight">
          Pesan Sablon Kaos Custom
        </h1>
        <p className="text-xs sm:text-sm text-ts-muted">
          Punya desain sendiri untuk komunitas, event, atau brand distro kamu? Kami cetak dengan kualitas sablon DTF terbaik di atas bahan kaos New State Apparel impor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-ts-surface border border-ts-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-ts-krem pb-3 border-b border-ts-borderDim">
            1. Data Pemesan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Lengkap"
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Nomor WhatsApp"
              placeholder="0812-xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <Input
            label="Kota / Kecamatan Pengiriman"
            placeholder="Contoh: Jakarta Selatan / Bandung"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <h3 className="text-sm font-bold text-ts-krem pt-4 pb-3 border-b border-ts-borderDim">
            2. Spesifikasi Kaos & Sablon
          </h3>

          <Select
            label="Pilih Model Bahan Kaos NSA"
            value={garmentKey}
            onChange={(e) => {
              setGarmentKey(e.target.value);
              const g = GARMENT_TYPES[e.target.value];
              if (g?.colors?.[0]) setColor(g.colors[0].name);
            }}
          >
            {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([k, g]) => (
              <option key={k} value={k}>{g.name}</option>
            ))}
          </Select>

          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Warna"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {selectedGarment.colors.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </Select>

            <Select
              label="Ukuran Dominan"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>

            <Input
              label="Jumlah (Pcs)"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </div>

          <Select
            label="Ukuran Area Sablon DTF"
            value={printSizeId}
            onChange={(e) => setPrintSizeId(e.target.value)}
          >
            {DTF_PRINT_SIZES.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>

          <Input
            label="Link File Artwork Desain (Google Drive / Dropbox / Cloud)"
            placeholder="https://drive.google.com/... (atau bisa dikirim via WA)"
            value={artworkLink}
            onChange={(e) => setArtworkLink(e.target.value)}
          />

          <div className="space-y-1">
            <label className="block text-xs font-bold text-ts-krem/90">Catatan Khusus</label>
            <textarea
              placeholder="Contoh: Rincian ukuran bila pesan banyak (M: 4, L: 6, XL: 2), posisi sablon di dada kiri atau punggung belakang..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-ts-hitam border border-ts-border rounded-xl p-3 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta h-24"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" icon={Send}>
            Kirim Permintaan Custom Sablon
          </Button>
        </form>

        {/* Estimation Summary Box */}
        <div className="space-y-4">
          <Card className="space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-ts-mustard" />
              Estimasi Biaya Transparan
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-ts-muted">
                <span>Model Bahan:</span>
                <span className="text-ts-krem font-medium">{selectedGarment.name}</span>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Area Sablon:</span>
                <span className="text-ts-krem font-medium">{selectedPrint.name}</span>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Jumlah:</span>
                <span className="font-mono text-ts-krem font-bold">{qty} pcs</span>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Estimasi Harga per Pcs:</span>
                <span className="font-mono text-ts-terracotta font-bold">{formatRupiah(estPricePerPcs)}</span>
              </div>

              <div className="pt-3 border-t border-ts-borderDim flex justify-between items-baseline">
                <span className="font-bold text-ts-krem">Total Estimasi:</span>
                <span className="font-mono text-lg font-extrabold text-ts-green">{formatRupiah(estTotal)}</span>
              </div>
            </div>

            <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl text-[11px] text-ts-muted space-y-1">
              <div className="text-ts-krem font-bold">Ketentuan & Garansi:</div>
              <p>• Estimasi pengerjaan: 2-3 hari kerja.</p>
              <p>• Minimum order: 1 pcs (tanpa minimum order!).</p>
              <p>• Gratis pembuatan digital mockup preview sebelum proses cetak.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
