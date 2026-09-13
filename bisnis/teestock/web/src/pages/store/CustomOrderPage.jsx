import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Upload, Sparkles, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight, ArrowLeft, Check, Layers, Printer, User, FileText, X, Loader2 } from 'lucide-react';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { DTF_PRINT_SIZES, PRODUCTION_COSTS, getSizeSurcharge } from '../../constants/pricing';
import { useStore } from '../../context/StoreContext';
import { createPublicOrder } from '../../services/ordersApi';
import { uploadToCloudinary } from '../../services/cloudinary';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { SEOHead } from '../../components/common/SEOHead';

const BLANK_SKU_TO_GARMENT = {
  'TS-BLK-3600': 'nsa_softstyle_30s',
  'TS-BLK-7200': 'nsa_heavyweight_24s',
  'TS-BLK-5400': 'nsa_heavyweight_20s',
  'TS-BLK-7280': 'nsa_longsleeve',
  'TS-BLK-5480': 'nsa_heavy_longsleeve',
  'TS-BLK-7250': 'nsa_ringer',
  'TS-BLK-7260': 'nsa_raglan',
  'TS-BLK-8100': 'nsa_polo',
  'TS-BLK-9500': 'nsa_hoodie',
  'TS-BLK-9000': 'nsa_crewneck',
  'TS-BLK-2700': 'nsa_drifit',
  'TS-BLK-72Y00': 'nsa_youth',
};

export function CustomOrderPage() {
  const { storeSettings } = useStore();
  const [searchParams] = useSearchParams();

  const blankParam = searchParams.get('blank');
  const blankName = searchParams.get('name');
  const initialGarmentKey = (blankParam && BLANK_SKU_TO_GARMENT[blankParam]) || 'nsa_softstyle_30s';

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [garmentKey, setGarmentKey] = useState(initialGarmentKey);
  const [color, setColor] = useState('Hitam');
  const [size, setSize] = useState('L');
  const [printSizeId, setPrintSizeId] = useState('a3');
  const [qty, setQty] = useState(1);
  const [artworkLink, setArtworkLink] = useState('');
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkPreview, setArtworkPreview] = useState(null);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const selectedGarment = GARMENT_TYPES[garmentKey] || GARMENT_TYPES.nsa_softstyle_30s;
  const selectedPrint = DTF_PRINT_SIZES.find(p => p.id === printSizeId) || DTF_PRINT_SIZES[2];

  // Cleanup ObjectURL on unmount or change to prevent memory leaks
  useEffect(() => {
    return () => {
      if (artworkPreview) {
        URL.revokeObjectURL(artworkPreview);
      }
    };
  }, [artworkPreview]);

  // File Upload Handlers
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
    }

    setArtworkFile(file);
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setArtworkPreview(previewUrl);
    } else {
      setArtworkPreview(null);
    }

    // Auto-upload ke Cloudinary jika file adalah gambar
    if (file.type.startsWith('image/')) {
      setUploadingArtwork(true);
      try {
        const uploadRes = await uploadToCloudinary(file);
        if (uploadRes && uploadRes.secure_url) {
          setArtworkLink(uploadRes.secure_url);
        }
      } catch (err) {
        console.warn('Gagal auto-upload ke Cloudinary:', err);
      } finally {
        setUploadingArtwork(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setArtworkFile(null);
    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
      setArtworkPreview(null);
    }
    setArtworkLink('');
  };

  // Dynamic Price Calculation
  const sizeSurcharge = getSizeSurcharge(size);
  const baseLaborAndPack = PRODUCTION_COSTS.pressLabor + PRODUCTION_COSTS.packaging + PRODUCTION_COSTS.overhead;
  const baseCost = selectedGarment.baseCost + selectedPrint.cost + baseLaborAndPack;

  let multiplier = 1.65;
  if (qty >= 12 && qty < 24) multiplier = 1.45;
  else if (qty >= 24 && qty < 50) multiplier = 1.35;
  else if (qty >= 50) multiplier = 1.28;

  const estPricePerPcs = Math.ceil(((baseCost * multiplier) + sizeSurcharge) / 1000) * 1000;
  const estTotal = estPricePerPcs * qty;

  const handleSubmitOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Nama lengkap pemesan wajib diisi.';
    }
    if (!phone.trim()) {
      errors.phone = 'Nomor WhatsApp wajib diisi.';
    } else if (phone.trim().replace(/\D/g, '').length < 8) {
      errors.phone = 'Nomor WhatsApp minimal 8 digit.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstField = Object.keys(errors)[0];
      const targetEl = document.getElementById(firstField === 'name' ? 'customName' : 'customPhone');
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.focus?.();
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const orderNumber = `CST-${Date.now().toString().slice(-6)}`;
      const artworkInfo = artworkLink || (artworkFile ? `File: ${artworkFile.name} (${(artworkFile.size / 1024).toFixed(0)} KB)` : 'Kirim via WA');
      
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
        date: new Date().toISOString(),
        notes: notes ? `${notes} | Artwork: ${artworkInfo}` : `Artwork: ${artworkInfo}`
      };

      // 🛡️ P0: Wajib diawait agar order tersimpan di Supabase
      await createPublicOrder(newOrder);
      setSubmittedOrder(newOrder);
    } catch (err) {
      console.error("Gagal mengirim job order custom:", err);
      alert("Terjadi kendala jaringan saat mengirim pesanan. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedOrder) {
    const targetPhone = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
    const artworkDesc = artworkLink 
      ? artworkLink 
      : (artworkFile ? `File: ${artworkFile.name} (siap dikirim di chat ini)` : 'Kirim file via WA');

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
      `Halo TeeStock! Saya ingin konfirmasi pesanan custom:\nNo. Order: ${submittedOrder.id}\nNama: ${submittedOrder.customer}\nModel: ${submittedOrder.garment} (${submittedOrder.color} - Size ${submittedOrder.size})\nJumlah: ${submittedOrder.qty} pcs\nUkuran Sablon: ${selectedPrint.name}\nArtwork: ${artworkDesc}\nCatatan: ${notes || '-'}\nTotal Estimasi: ${formatRupiah(submittedOrder.price)}`
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

        <div className="p-6 bg-ts-surface border border-ts-border rounded-2xl text-left space-y-2.5 text-xs">
          <div className="flex justify-between"><span className="text-ts-muted font-mono">No. Order:</span> <strong className="font-mono text-ts-terracotta">{submittedOrder.id}</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Pemesan:</span> <strong className="text-ts-krem">{submittedOrder.customer}</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Model &amp; Varian:</span> <strong className="text-ts-krem">{submittedOrder.garment} • {submittedOrder.color} ({submittedOrder.size})</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Area Sablon:</span> <strong className="text-ts-krem">{selectedPrint.name}</strong></div>
          <div className="flex justify-between"><span className="text-ts-muted">Jumlah:</span> <strong className="text-ts-krem">{submittedOrder.qty} pcs</strong></div>
          <div className="flex justify-between text-ts-green font-bold text-sm pt-3 border-t border-ts-border">
            <span>Estimasi Biaya:</span> <span className="font-mono text-base">{formatRupiah(submittedOrder.price)}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={waUrl} target="_blank" rel="noreferrer">
            <Button size="lg" variant="whatsapp" icon={MessageSquare} className="w-full sm:w-auto font-mono text-xs font-bold">
              Konfirmasi Order ke WhatsApp Studio
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
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-ts-surface border border-ts-border text-[10px] font-mono font-bold tracking-wider text-ts-krem uppercase">
          <Layers className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>TEESTOCK ATELIER // CUSTOM JOB ORDER</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-ts-krem tracking-tight uppercase">
          Studio Custom Kaos &amp; Merch
        </h1>
        <p className="text-xs sm:text-sm text-ts-muted">
          Cetak desain personal, merchandise komunitas, atau project brand dengan sablon DTF presisi di atas katun New States Apparel (NSA) original.
        </p>
      </div>

      {/* Blank Referrer Context Pill */}
      {blankParam && (
        <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-ts-surface border border-ts-border flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-ts-krem min-w-0">
            <span className="w-2 h-2 rounded-full bg-ts-teal shrink-0" />
            <span className="truncate">
              Garmen otomatis dipilih dari katalog: <strong className="text-ts-krem">{selectedGarment.name}</strong>
            </span>
          </div>
          <span className="text-[10px] font-mono text-ts-teal uppercase font-bold px-2 py-0.5 rounded bg-ts-teal/15 border border-ts-teal/30 shrink-0">
            Katalog Blank
          </span>
        </div>
      )}

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
              aria-current={currentStep === s.step ? 'step' : undefined}
              aria-label={`Langkah ${s.step}: ${s.label}`}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                currentStep === s.step
                  ? 'bg-ts-terracotta text-white border border-ts-terracotta'
                  : currentStep > s.step
                  ? 'bg-ts-surface text-ts-krem border border-ts-border'
                  : 'bg-ts-surface/40 text-ts-muted border border-ts-border'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-ts-hitam/10 dark:bg-white/20 text-[10px] flex items-center justify-center font-mono">
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span>{s.label}</span>
            </button>
            {s.step < 3 && <div className="w-4 h-[1px] bg-ts-border hidden sm:block" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Configuration Form (7 Cols) */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 bg-ts-surface border border-ts-border rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: KAOS & WARNA */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-ts-border">
                <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
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
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      garmentKey === k
                        ? 'bg-ts-terracotta/20 border-ts-terracotta text-ts-krem'
                        : 'bg-ts-hitam/20 border-ts-border text-ts-muted hover:bg-ts-hitam/40'
                    }`}
                  >
                    <div className="font-bold text-xs text-ts-krem">{g.name}</div>
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
                <label className="block text-xs font-bold text-ts-krem">Jumlah Pesanan (Pcs):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-24 bg-ts-hitam border border-ts-border rounded-xl px-3 py-2 text-sm font-mono font-bold text-ts-krem focus:outline-none focus:border-ts-terracotta"
                  />
                  <span className="text-xs text-ts-muted">
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
              <div className="flex items-center justify-between pb-3 border-b border-ts-border">
                <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
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
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      printSizeId === p.id
                        ? 'bg-ts-mustard/20 border-ts-mustard text-ts-krem'
                        : 'bg-ts-hitam/20 border-ts-border text-ts-muted hover:bg-ts-hitam/40'
                    }`}
                  >
                    <div className="font-extrabold text-sm text-ts-krem">{p.name}</div>
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
              <div className="flex items-center justify-between pb-3 border-b border-ts-border">
                <h3 className="text-sm font-bold text-ts-krem flex items-center gap-2">
                  <User className="w-4 h-4 text-ts-teal" />
                  <span>3. Kontak Pemesan &amp; File Desain</span>
                </h3>
                <span className="text-xs text-ts-muted">Langkah 3 dari 3</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  id="customName"
                  label="Nama Lengkap"
                  placeholder="Nama pemesan"
                  value={name}
                  error={formErrors.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                  }}
                  required
                />
                <Input
                  id="customPhone"
                  label="Nomor WhatsApp"
                  placeholder="0812-xxxx-xxxx"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  error={formErrors.phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                  }}
                  required
                />
              </div>

              <Input
                label="Kota / Kabupaten Pengiriman"
                placeholder="Contoh: Jakarta Selatan, Surabaya, Medan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              {/* Artwork File Upload & Link */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-ts-krem flex items-center justify-between">
                  <span>File Desain / Artwork:</span>
                  <span className="text-[10px] text-ts-mustard font-mono font-normal">PNG, PDF, AI, PSD, JPG (300 DPI)</span>
                </label>

                {/* Upload Zone */}
                <div className="border-2 border-dashed border-ts-border hover:border-ts-terracotta/50 rounded-2xl p-4 transition-all bg-ts-hitam/10">
                  {artworkPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 border border-ts-border shrink-0 relative flex items-center justify-center">
                        <img src={artworkPreview} alt="Preview Artwork" className="max-w-full max-h-full object-contain p-1" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-ts-green shrink-0" />
                          <span className="text-xs font-bold text-ts-krem truncate">{artworkFile?.name}</span>
                        </div>
                        <p className="text-[11px] text-ts-muted">
                          {(artworkFile?.size / 1024).toFixed(0)} KB • Siap diproses
                          {uploadingArtwork && <span className="text-ts-mustard ml-2 animate-pulse">Mengunggah ke Cloud...</span>}
                          {artworkLink && !uploadingArtwork && <span className="text-ts-teal ml-2">✓ Tersimpan di Cloud</span>}
                        </p>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <X className="w-3.5 h-3.5" /> Ganti File
                        </button>
                      </div>
                    </div>
                  ) : artworkFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-ts-hitam/20 border border-ts-border flex items-center justify-center text-ts-mustard">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-ts-krem truncate max-w-[200px] sm:max-w-xs">{artworkFile.name}</p>
                          <p className="text-[10px] text-ts-muted">{(artworkFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs text-red-400 hover:text-red-300 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-4 cursor-pointer group">
                      <div className="w-12 h-12 rounded-2xl bg-ts-surface group-hover:bg-ts-terracotta/20 text-ts-muted group-hover:text-ts-terracotta flex items-center justify-center border border-ts-border group-hover:border-ts-terracotta/40 transition-all mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-ts-krem group-hover:text-ts-terracotta transition-colors">
                        Klik untuk Unggah Gambar Desain / Logo
                      </span>
                      <span className="text-[10px] text-ts-muted mt-0.5">
                        Maksimal 25MB • PNG transparan direkomendasikan
                      </span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.ai,.psd,.eps"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                {/* Cloud Link Fallback */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[11px] font-medium text-ts-muted">
                    Atau Cantumkan Link Cloud (Google Drive / Dropbox / WeTransfer):
                  </label>
                  <Input
                    placeholder="https://drive.google.com/... (opsional bila sudah upload file di atas)"
                    value={artworkLink}
                    onChange={(e) => setArtworkLink(e.target.value)}
                  />
                </div>

                <div className="p-3 rounded-xl bg-ts-hitam/10 border border-ts-border text-[11px] text-ts-muted flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-ts-mustard shrink-0 mt-0.5" />
                  <span>
                    <strong>Standar Pre-Flight DTF:</strong> Tim workshop kami akan memeriksa resolusi dan rasio warna sebelum naik cetak. Anda akan menerima preview mockup digital via WhatsApp sebelum produksi dimulai.
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-ts-krem">Catatan Tambahan (Opsional):</label>
                <textarea
                  placeholder="Contoh: Rincian ukuran bila pesan banyak (M: 4, L: 6, XL: 2), posisi sablon di dada kiri atau punggung belakang..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-ts-hitam border border-ts-border rounded-xl p-3 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta h-20"
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
                  variant="primary"
                  size="lg"
                  icon={isSubmitting ? Loader2 : Send}
                  disabled={isSubmitting || uploadingArtwork}
                  className="font-mono text-xs font-bold"
                >
                  {isSubmitting ? 'MENGIRIM PESANAN...' : 'KIRIM JOB ORDER CUSTOM'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Live Estimation Summary Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 space-y-5 sticky top-24">
            <h3 className="text-sm font-bold text-ts-krem flex items-center justify-between pb-3 border-b border-ts-border">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-ts-terracotta" />
                <span>Rincian Job Order</span>
              </span>
              <span className="text-[10px] font-mono text-ts-mustard font-bold uppercase">Estimasi HPP</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-ts-muted">
                <span>Model Bahan:</span>
                <strong className="text-ts-krem">{selectedGarment.name}</strong>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Varian:</span>
                <strong className="text-ts-krem">{color} • {size}</strong>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Area Sablon:</span>
                <strong className="text-ts-krem">{selectedPrint.name}</strong>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Jumlah:</span>
                <strong className="font-mono text-ts-krem font-bold">{qty} pcs</strong>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Estimasi per Pcs:</span>
                <strong className="font-mono text-ts-terracotta">{formatRupiah(estPricePerPcs)}</strong>
              </div>

              <div className="pt-4 border-t border-ts-border flex justify-between items-baseline">
                <span className="font-bold text-ts-krem">Total Estimasi:</span>
                <span className="font-mono text-2xl font-black text-ts-green">{formatRupiah(estTotal)}</span>
              </div>
            </div>

            <div className="p-4 bg-ts-hitam/10 border border-ts-border rounded-2xl text-[11px] text-ts-muted space-y-1.5">
              <div className="text-ts-krem font-bold flex items-center gap-1.5">
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
