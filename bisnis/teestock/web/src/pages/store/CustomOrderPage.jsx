import React, { useState } from 'react';
import { Send, Upload, Sparkles, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight, ArrowLeft, Check, Layers, Printer, User } from 'lucide-react';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { DTF_PRINT_SIZES } from '../../constants/pricing';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { SEOHead } from '../../components/common/SEOHead';

export function CustomOrderPage() {
  const { addOrder } = useAdmin();
  const { storeSettings } = useStore();

  const [currentStep, setCurrentStep] = useState(1);
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

  // Dynamic Price Calculation
  const baseCost = selectedGarment.baseCost + selectedPrint.cost + 8500;
  let multiplier = 1.65;
  if (qty >= 12) multiplier = 1.45;
  if (qty >= 24) multiplier = 1.35;
  const estPricePerPcs = Math.ceil((baseCost * multiplier) / 1000) * 1000;
  const estTotal = estPricePerPcs * qty;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Mohon lengkapi nama dan nomor WhatsApp Anda");
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
    const targetPhone = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
      `Halo TeeStock! Saya ingin konfirmasi pesanan custom:\nNo. Order: CST-${Date.now().toString().slice(-6)}\nNama: ${name}\nModel: ${selectedGarment.name} (${color} - Size ${size})\nJumlah: ${qty} pcs\nUkuran Sablon: ${selectedPrint.name}\nArtwork: ${artworkLink || 'Kirim file via WA'}\nCatatan: ${notes}\nTotal Estimasi: ${formatRupiah(estTotal)}`
    )}`;

    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30 shadow-glow-teal">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Permintaan Custom Diterima!</h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md mx-auto leading-relaxed">
            Pesanan Anda telah dicatat di antrean workshop. Tim kami akan segera meninjau artwork dan mengirimkan mockup digital sebelum cetak.
          </p>
        </div>

        <div className="p-6 bg-ts-surface/80 backdrop-blur-xl border border-white/[0.1] rounded-3xl text-left space-y-2.5 text-xs shadow-glass-card shadow-glass-inset">
          <div className="flex justify-between"><span className="text-ts-muted">Pemesan:</span> <strong className="text-white">{name}</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Model &amp; Varian:</span> <strong className="text-white">{selectedGarment.name} • {color} ({size})</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Area Sablon:</span> <strong className="text-white">{selectedPrint.name}</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Jumlah:</span> <strong className="text-white">{qty} pcs</strong></div>
          <div className="flex justify-between text-ts-green font-bold text-sm pt-3 border-t border-white/[0.08]">
            <span>Estimasi Biaya:</span> <span className="font-mono text-base">{formatRupiah(estTotal)}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={waUrl} target="_blank" rel="noreferrer">
            <Button size="lg" variant="whatsapp" icon={MessageSquare} className="w-full sm:w-auto">
              Lanjutkan Konfirmasi ke WhatsApp Tim Desain
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEOHead
        title="Custom Sablon DTF Satuan & Komunitas — Bahan NSA Original | TeeStock"
        description="Jasa bikin kaos custom sablon DTF satuan, komunitas, merchandise band, dan event. Menggunakan garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s. Dapatkan estimasi harga instan!"
        keywords={["custom kaos satuan", "sablon dtf satuan", "bikin merch komunitas", "kaos custom nsa 24s", "sablon kaos bandung"]}
        canonicalPath="/custom-order"
      />
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-ts-krem">
          <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
          <span>CUSTOM PRINT STUDIO • 0% MINIMUM ORDER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Konfigurator Sablon Kaos Custom
        </h1>
        <p className="text-xs sm:text-sm text-ts-kremMuted">
          Cetak desain brand, komunitas, atau merchandise kamu dengan sablon DTF HD di atas bahan garmen New States Apparel original.
        </p>
      </div>

      {/* 3-Step Wizard Indicator */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
        {[
          { step: 1, label: 'Kaos NSA' },
          { step: 2, label: 'Area Sablon' },
          { step: 3, label: 'Artwork & Data' },
        ].map((s) => (
          <div key={s.step} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentStep(s.step)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentStep === s.step
                  ? 'bg-ts-terracotta text-white shadow-glow-terracotta border border-white/20'
                  : currentStep > s.step
                  ? 'bg-white/[0.1] text-white border border-white/10'
                  : 'bg-white/[0.03] text-ts-muted border border-white/[0.06]'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span>{s.label}</span>
            </button>
            {s.step < 3 && <div className="w-4 h-[1px] bg-white/20 hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Configuration Form (7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-ts-surface/80 backdrop-blur-xl border border-white/[0.09] rounded-3xl p-6 sm:p-8 space-y-6 shadow-glass-card shadow-glass-inset">
          
          {/* STEP 1: KAOS & WARNA */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-ts-terracotta" />
                  <span>1. Pilih Model Garmen Kaos NSA</span>
                </h3>
                <span className="text-xs text-ts-muted">Langkah 1 dari 3</span>
              </div>

              {/* Garment Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').slice(0, 4).map(([k, g]) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setGarmentKey(k);
                      if (g.colors?.[0]) setColor(g.colors[0].name);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      garmentKey === k
                        ? 'bg-ts-terracotta/20 border-ts-terracotta text-white shadow-glow-terracotta ring-1 ring-ts-terracotta'
                        : 'bg-white/[0.03] border-white/[0.08] text-ts-kremMuted hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{g.name}</div>
                    <div className="text-[11px] text-ts-muted mt-0.5">{g.desc || 'Ring spun katun adem'}</div>
                  </button>
                ))}
              </div>

              {/* Color & Size Selector */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Select
                  label="Warna Kaos"
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
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">Jumlah Pesanan (Pcs):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-24 bg-ts-hitam/80 border border-white/[0.1] rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-ts-terracotta"
                  />
                  <span className="text-xs text-ts-kremMuted">
                    {qty >= 12 ? '🔥 Diskon grosir lusinan aktif!' : 'Beli &ge;12 pcs untuk dapat harga lusinan'}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  onClick={() => setCurrentStep(2)}
                >
                  Lanjut ke Area Sablon
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: AREA SABLON DTF */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-ts-mustard" />
                  <span>2. Pilih Ukuran Bidang Sablon DTF</span>
                </h3>
                <span className="text-xs text-ts-muted">Langkah 2 dari 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DTF_PRINT_SIZES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPrintSizeId(p.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      printSizeId === p.id
                        ? 'bg-ts-mustard/20 border-ts-mustard text-white shadow-glow-mustard ring-1 ring-ts-mustard'
                        : 'bg-white/[0.03] border-white/[0.08] text-ts-kremMuted hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-white">{p.name}</div>
                    <div className="text-xs text-ts-muted mt-0.5">{p.desc || 'Bidang sablon standar'}</div>
                    <div className="text-xs font-mono font-bold text-ts-mustard mt-2">
                      Estimasi Sablon: {formatRupiah(p.cost)}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  icon={ArrowLeft}
                  onClick={() => setCurrentStep(1)}
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  onClick={() => setCurrentStep(3)}
                >
                  Lanjut ke Data &amp; Artwork
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: DATA PEMESAN & ARTWORK */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-ts-teal" />
                  <span>3. Kontak Pemesan &amp; File Desain</span>
                </h3>
                <span className="text-xs text-ts-muted">Langkah 3 dari 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Nama Lengkap"
                  placeholder="Nama pemesan"
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
                label="Kota / Kabupaten Pengiriman"
                placeholder="Contoh: Jakarta Selatan, Surabaya, Medan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <Input
                label="Link File Desain (Google Drive / Dropbox / Cloud)"
                placeholder="https://drive.google.com/... (Bisa juga dikirim nanti via WA)"
                value={artworkLink}
                onChange={(e) => setArtworkLink(e.target.value)}
              />

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">Catatan Tambahan (Opsional):</label>
                <textarea
                  placeholder="Contoh: Rincian ukuran bila pesan banyak (M: 4, L: 6, XL: 2), posisi sablon di dada kiri atau punggung belakang..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-ts-hitam/80 border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-ts-terracotta h-20"
                />
              </div>

              <div className="pt-3 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  icon={ArrowLeft}
                  onClick={() => setCurrentStep(2)}
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  variant="glow"
                  size="lg"
                  icon={Send}
                >
                  Kirim Pesanan Custom Sablon
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Live Estimation Summary Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-ts-surface/80 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 space-y-5 shadow-glass-card shadow-glass-inset sticky top-24">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <Sparkles className="w-4 h-4 text-ts-mustard" />
              <span>Kalkulasi Biaya Transparan</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-ts-kremMuted">
                <span>Model Bahan:</span>
                <strong className="text-white">{selectedGarment.name}</strong>
              </div>
              <div className="flex justify-between text-ts-kremMuted">
                <span>Varian:</span>
                <strong className="text-white">{color} • {size}</strong>
              </div>
              <div className="flex justify-between text-ts-kremMuted">
                <span>Area Sablon:</span>
                <strong className="text-white">{selectedPrint.name}</strong>
              </div>
              <div className="flex justify-between text-ts-kremMuted">
                <span>Jumlah:</span>
                <strong className="font-mono text-white font-bold">{qty} pcs</strong>
              </div>
              <div className="flex justify-between text-ts-kremMuted">
                <span>Estimasi per Pcs:</span>
                <strong className="font-mono text-ts-terracotta">{formatRupiah(estPricePerPcs)}</strong>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex justify-between items-baseline">
                <span className="font-bold text-white">Total Estimasi:</span>
                <span className="font-mono text-2xl font-black text-ts-green">{formatRupiah(estTotal)}</span>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-[11px] text-ts-kremMuted space-y-1.5">
              <div className="text-white font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-teal" />
                <span>Standar Pengerjaan TeeStock:</span>
              </div>
              <p>• Pengerjaan cepat 2-3 hari kerja.</p>
              <p>• Bebas cetak mulai 1 pcs tanpa minimum order.</p>
              <p>• Digital mockup preview sebelum proses cetak.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
