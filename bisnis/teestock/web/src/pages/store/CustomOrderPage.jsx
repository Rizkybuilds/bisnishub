import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Send,
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Layers,
  Printer,
  User,
  FileText,
  X,
  Loader2,
  Plus,
  Minus,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { GARMENT_TYPES, SIZES, NSA_3600_COLORS } from '../../constants/garments';
import { DTF_PRINT_SIZES, PRODUCTION_COSTS, getSizeSurcharge } from '../../constants/pricing';
import { useStore } from '../../context/StoreContext';
import { createPublicOrder } from '../../services/ordersApi';
import { uploadToCloudinary } from '../../services/cloudinary';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { SEOHead } from '../../components/common/SEOHead';

export const BLANK_SKU_TO_GARMENT = {
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

/**
 * Tiered volume discount matrix for custom apparel orders
 * Adheres to CFO Guardrail: maximum promo/wholesale discount <= 25%
 */
export function getCustomTierDiscount(qty = 1) {
  const safeQty = Math.max(1, Number(qty) || 1);
  if (safeQty >= 50) {
    return {
      tierKey: 'tier50',
      label: 'Partai Besar (50+ pcs)',
      discountPct: 22,
      multiplier: 1.28,
      badge: '🔥 Diskon Partai 50+ Pcs'
    };
  }
  if (safeQty >= 24) {
    return {
      tierKey: 'tier24',
      label: 'Grosir 2 Lusin (24-49 pcs)',
      discountPct: 18,
      multiplier: 1.35,
      badge: '🔥 Diskon Grosir 2 Lusin'
    };
  }
  if (safeQty >= 12) {
    return {
      tierKey: 'tier12',
      label: 'Grosir Lusinan (12-23 pcs)',
      discountPct: 12,
      multiplier: 1.45,
      badge: '🔥 Diskon Grosir Lusinan'
    };
  }
  if (safeQty >= 6) {
    return {
      tierKey: 'tier6',
      label: 'Grup Kecil (6-11 pcs)',
      discountPct: 6,
      multiplier: 1.55,
      badge: '✨ Hemat Grup Kecil'
    };
  }
  return {
    tierKey: 'retail',
    label: 'Satuan (1-5 pcs)',
    discountPct: 0,
    multiplier: 1.65,
    badge: 'Cetak Satuan Tanpa Min. Order'
  };
}

/**
 * Pure Quotation Engine for Custom DTF Orders
 * Encapsulates blank garment, DTF print area, press labor, packaging, and size surcharge
 */
export function calculateCustomOrderPrice({ garmentKey = 'nsa_softstyle_30s', printSizeId = 'a3', size = 'L', qty = 1 } = {}) {
  const safeQty = Math.max(1, Number(qty) || 1);
  const garment = GARMENT_TYPES[garmentKey] || GARMENT_TYPES.nsa_softstyle_30s || {
    name: 'NSA Softstyle 3600 (30s)',
    baseCost: 37000
  };
  const print = DTF_PRINT_SIZES.find(p => p.id === printSizeId) || DTF_PRINT_SIZES[2] || {
    name: 'Studio Standard (A3 - 28x40 cm)',
    cost: 12500
  };

  const isLongSleeve = String(garmentKey).toLowerCase().includes('longsleeve');
  const sizeSurcharge = getSizeSurcharge(size, isLongSleeve);

  const baseLaborAndPack = (PRODUCTION_COSTS.pressLabor || 5000) +
                           (PRODUCTION_COSTS.packaging || 2000) +
                           (PRODUCTION_COSTS.overhead || 1000);

  const baseGarmentCost = Number(garment.baseCost) || 37000;
  const basePrintCost = Number(print.cost) || 12500;
  const baseCost = baseGarmentCost + basePrintCost + baseLaborAndPack;

  const tier = getCustomTierDiscount(safeQty);

  // Price calculation rounded up to nearest 1,000 IDR
  const estPricePerPcs = Math.ceil(((baseCost * tier.multiplier) + sizeSurcharge) / 1000) * 1000;
  const estTotal = estPricePerPcs * safeQty;

  // Single unit benchmark price without bulk multiplier discount
  const regularRetailPerPcs = Math.ceil(((baseCost * 1.65) + sizeSurcharge) / 1000) * 1000;
  const regularTotal = regularRetailPerPcs * safeQty;
  const totalSavings = Math.max(0, regularTotal - estTotal);

  return {
    garment,
    print,
    qty: safeQty,
    size,
    sizeSurcharge,
    baseLaborAndPack,
    baseCost,
    multiplier: tier.multiplier,
    tierDiscountPct: tier.discountPct,
    tierLabel: tier.label,
    tierBadge: tier.badge,
    estPricePerPcs,
    estTotal,
    regularRetailPerPcs,
    totalSavings
  };
}

/**
 * Validates preflight artwork specifications (file size <= 25MB, supported formats, transparency)
 */
export function validateArtworkPreflight(file) {
  if (!file) {
    return { valid: false, error: 'Silakan pilih file desain / artwork.' };
  }

  const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
  if (file.size > MAX_BYTES) {
    return {
      valid: false,
      error: `Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas 25 MB. Gunakan link Google Drive atau WeTransfer.`
    };
  }

  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  const validExtensions = ['.png', '.pdf', '.ai', '.psd', '.eps', '.jpg', '.jpeg', '.tif', '.tiff'];
  const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));
  const isImageMime = fileType.startsWith('image/');
  const isPdfMime = fileType === 'application/pdf';

  if (!hasValidExt && !isImageMime && !isPdfMime) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Harap gunakan file PNG, PDF, AI, PSD, EPS, atau JPG (300 DPI).'
    };
  }

  let warning = null;
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileType.includes('jpeg')) {
    warning = 'Format JPG memiliki background padat. Pastikan grafis tidak memiliki kotak putih yang tidak diinginkan, atau gunakan PNG transparan.';
  }

  return {
    valid: true,
    fileName: file.name,
    fileSizeKB: Math.round(file.size / 1024),
    isImage: isImageMime,
    warning
  };
}

/**
 * Structured WhatsApp order confirmation generator
 */
export function generateCustomOrderWaText({
  orderNumber,
  customer,
  city,
  garmentName,
  color,
  size,
  qty,
  printName,
  artworkDesc,
  notes,
  estPricePerPcs,
  estTotal
}) {
  return [
    `Halo TeeStock! Saya ingin konfirmasi pesanan Custom Sablon Satuan:`,
    ``,
    `📋 *NO. ORDER:* ${orderNumber}`,
    `👤 *Nama:* ${customer}${city ? ` (${city})` : ''}`,
    `👕 *Model Garmen:* ${garmentName}`,
    `🎨 *Varian:* ${color} • Size ${size}`,
    `📐 *Area Sablon:* ${printName}`,
    `📦 *Jumlah:* ${qty} pcs`,
    `💰 *Estimasi:* ${formatRupiah(estPricePerPcs)}/pcs (Total: ${formatRupiah(estTotal)})`,
    `🖼️ *Artwork:* ${artworkDesc || 'Akan dikirim via chat ini'}`,
    notes ? `📝 *Catatan Khusus:* ${notes}` : null,
    ``,
    `Mohon kirimkan preview digital mockup dan petunjuk pembayaran sebelum naik cetak. Terima kasih!`
  ].filter(line => line !== null).join('\n');
}

/**
 * Generates direct wa.me link with encoded custom order brief
 */
export function generateCustomOrderWaUrl(phone = '085220274968', orderData = {}) {
  const targetPhone = sanitizePhoneNumber(phone || '085220274968');
  const text = generateCustomOrderWaText(orderData);
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
}

export function CustomOrderPage() {
  const { storeSettings } = useStore();
  const [searchParams] = useSearchParams();

  const blankParam = searchParams.get('blank');
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
  const [preflightWarning, setPreflightWarning] = useState(null);
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const selectedGarment = GARMENT_TYPES[garmentKey] || GARMENT_TYPES.nsa_softstyle_30s;
  const selectedPrint = DTF_PRINT_SIZES.find(p => p.id === printSizeId) || DTF_PRINT_SIZES[2];

  // Dynamic Calculation via pure Quotation Engine
  const quotation = calculateCustomOrderPrice({
    garmentKey,
    printSizeId,
    size,
    qty
  });

  // Cleanup ObjectURL on unmount or change to prevent memory leaks
  useEffect(() => {
    return () => {
      if (artworkPreview) {
        URL.revokeObjectURL(artworkPreview);
      }
    };
  }, [artworkPreview]);

  // File Upload Handlers with Preflight Check
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
    }

    const preflight = validateArtworkPreflight(file);
    if (!preflight.valid) {
      alert(preflight.error);
      e.target.value = '';
      return;
    }

    setPreflightWarning(preflight.warning);
    setArtworkFile(file);

    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setArtworkPreview(previewUrl);
    } else {
      setArtworkPreview(null);
    }

    // Auto-upload to Cloudinary in the background
    if (file.type.startsWith('image/')) {
      setUploadingArtwork(true);
      try {
        const uploadRes = await uploadToCloudinary(file);
        if (uploadRes && uploadRes.secure_url) {
          setArtworkLink(uploadRes.secure_url);
        }
      } catch (err) {
        console.warn('Auto-upload Cloudinary gagal (bisa lanjut via WA):', err);
      } finally {
        setUploadingArtwork(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setArtworkFile(null);
    setPreflightWarning(null);
    if (artworkPreview) {
      URL.revokeObjectURL(artworkPreview);
      setArtworkPreview(null);
    }
    setArtworkLink('');
  };

  const handleQtyChange = (newQty) => {
    const safe = Math.max(1, parseInt(newQty, 10) || 1);
    setQty(safe);
  };

  const handleSubmitOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const errors = {};

    if (!name.trim()) {
      errors.name = 'Nama lengkap pemesan wajib diisi.';
    } else if (name.trim().length < 3) {
      errors.name = 'Nama lengkap minimal 3 karakter.';
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!phone.trim()) {
      errors.phone = 'Nomor WhatsApp wajib diisi.';
    } else if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      errors.phone = 'Nomor WhatsApp tidak valid (format: 08xxxxxxxxxx).';
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
      const orderNumber = `TS-CST-${Date.now().toString().slice(-6)}`;
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
        price: quotation.estTotal,
        fee: 0,
        status: 'pending',
        date: new Date().toISOString(),
        notes: notes ? `${notes} | Artwork: ${artworkInfo}` : `Artwork: ${artworkInfo}`
      };

      await createPublicOrder(newOrder);
      setSubmittedOrder(newOrder);
    } catch (err) {
      console.error("Gagal mengirim job order custom:", err);
      alert("Terjadi kendala saat mengirim pesanan. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SUBMISSION SCREEN
  if (submittedOrder) {
    const targetPhone = storeSettings?.storeWhatsapp || '085220274968';
    const artworkDesc = artworkLink
      ? artworkLink
      : (artworkFile ? `File: ${artworkFile.name} (siap dikirim di chat ini)` : 'Kirim file via WA');

    const waUrl = generateCustomOrderWaUrl(targetPhone, {
      orderNumber: submittedOrder.id,
      customer: submittedOrder.customer,
      city: city.trim(),
      garmentName: submittedOrder.garment,
      color: submittedOrder.color,
      size: submittedOrder.size,
      qty: submittedOrder.qty,
      printName: selectedPrint.name,
      artworkDesc,
      notes,
      estPricePerPcs: quotation.estPricePerPcs,
      estTotal: submittedOrder.price
    });

    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30 shadow-glow-teal">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ts-krem tracking-tight">Permintaan Custom Diterima!</h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md mx-auto leading-relaxed">
            Pesanan Anda telah dicatat di antrean workshop. Tim kami akan segera meninjau artwork dan mengirimkan mockup digital sebelum cetak.
          </p>
        </div>

        <div className="p-6 bg-ts-surface border border-ts-border rounded-2xl text-left space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-ts-border">
            <span className="text-ts-muted font-mono">No. Order:</span>
            <strong className="font-mono text-ts-terracotta text-sm">{submittedOrder.id}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ts-muted">Pemesan:</span>
            <strong className="text-ts-krem">{submittedOrder.customer}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ts-muted">Model &amp; Varian:</span>
            <strong className="text-ts-krem">{submittedOrder.garment} • {submittedOrder.color} ({submittedOrder.size})</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ts-muted">Area Sablon:</span>
            <strong className="text-ts-krem">{selectedPrint.name}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-ts-muted">Jumlah Pesanan:</span>
            <strong className="text-ts-krem font-mono">{submittedOrder.qty} pcs ({quotation.tierLabel})</strong>
          </div>
          <div className="flex justify-between items-baseline text-ts-green font-bold text-sm pt-3 border-t border-ts-border">
            <span>Estimasi Biaya:</span>
            <span className="font-mono text-lg">{formatRupiah(submittedOrder.price)}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex"
          >
            <Button
              size="lg"
              variant="whatsapp"
              icon={MessageSquare}
              className="w-full sm:w-auto font-mono text-xs font-bold min-h-[48px] justify-center"
            >
              Konfirmasi Order ke WhatsApp Studio
            </Button>
          </a>
          <button
            type="button"
            onClick={() => {
              setSubmittedOrder(null);
              setCurrentStep(1);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-ts-border bg-ts-surface text-ts-krem hover:bg-ts-hitam/50 text-xs font-bold min-h-[48px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-ts-muted" />
            <span>Buat Order Lain</span>
          </button>
        </div>
      </div>
    );
  }

  // WIZARD CONFIGURATION STEPS
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEOHead
        title="Custom Sablon DTF Satuan & Komunitas — Bahan NSA Original | TeeStock"
        description="Jasa bikin kaos custom sablon DTF satuan, komunitas, merchandise band, dan event. Menggunakan garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s. Dapatkan estimasi harga instan!"
        keywords={["custom kaos satuan", "sablon dtf satuan", "bikin merch komunitas", "kaos custom nsa 24s", "sablon dtf depok"]}
        canonicalPath="/custom-order"
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ts-surface border border-ts-border text-[10px] font-mono font-bold tracking-wider text-ts-krem uppercase">
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

      {/* 3-Step Wizard Indicator (Mobile Touch Targets >= 44px) */}
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
              className={`min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                currentStep === s.step
                  ? 'bg-ts-terracotta text-white border border-ts-terracotta shadow-glow-terracotta'
                  : currentStep > s.step
                  ? 'bg-ts-surface text-ts-krem border border-ts-border hover:border-ts-terracotta/40'
                  : 'bg-ts-surface/40 text-ts-muted border border-ts-border'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-ts-hitam/20 dark:bg-white/20 text-[11px] flex items-center justify-center font-mono">
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

              {/* Garment Cards with Mobile-First Touch Targets >= 44px */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(GARMENT_TYPES)
                  .filter(([k]) => k !== 'supplies')
                  .slice(0, 6)
                  .map(([k, g]) => {
                    const isSelected = garmentKey === k;
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => {
                          setGarmentKey(k);
                          if (g.colors?.[0]) setColor(g.colors[0].name);
                          if (g.sizes?.[0] && !g.sizes.includes(size)) setSize(g.sizes[0]);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] flex flex-col justify-between ${
                          isSelected
                            ? 'bg-ts-terracotta/20 border-ts-terracotta text-ts-krem ring-1 ring-ts-terracotta'
                            : 'bg-ts-hitam/20 border-ts-border text-ts-muted hover:bg-ts-hitam/40 hover:text-ts-krem'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-ts-krem">{g.name}</span>
                            {k === 'nsa_heavyweight_24s' && (
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-ts-terracotta/20 text-ts-terracotta font-bold">
                                Distro Fav
                              </span>
                            )}
                            {k === 'nsa_softstyle_30s' && (
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-ts-teal/20 text-ts-teal font-bold">
                                Adem Tropis
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-ts-muted mt-1 line-clamp-2">
                            {g.description || g.weight || 'Katun ring-spun premium'}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-ts-muted mt-2">
                          Modal Garmen: <strong className="text-ts-krem">{formatRupiah(g.baseCost || 37000)}</strong>
                        </div>
                      </button>
                    );
                  })}
              </div>

              {/* Color & Size Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Select
                  id="customGarmentColor"
                  label="Warna Kaos"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {(selectedGarment.colors || NSA_3600_COLORS).map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </Select>

                <Select
                  id="customGarmentSize"
                  label="Ukuran Dominan"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  {(selectedGarment.sizes || SIZES).map(s => (
                    <option key={s} value={s}>
                      {s} {getSizeSurcharge(s, garmentKey.includes('longsleeve')) > 0 ? `(+${formatRupiah(getSizeSurcharge(s, garmentKey.includes('longsleeve')))})` : ''}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Quantity Stepper & Quick Presets */}
              <div className="space-y-2 pt-2">
                <label htmlFor="customOrderQty" className="block text-xs font-bold text-ts-krem">
                  Jumlah Pesanan (Pcs):
                </label>

                {/* Touch Stepper >= 44px */}
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-ts-border rounded-xl bg-ts-hitam/30 overflow-hidden">
                    <button
                      type="button"
                      aria-label="Kurangi jumlah"
                      onClick={() => handleQtyChange(qty - 1)}
                      disabled={qty <= 1}
                      className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-ts-krem hover:bg-ts-hitam/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      id="customOrderQty"
                      type="number"
                      min="1"
                      value={qty}
                      onChange={(e) => handleQtyChange(e.target.value)}
                      className="w-16 h-11 bg-transparent text-center text-sm font-mono font-bold text-ts-krem focus:outline-none"
                    />
                    <button
                      type="button"
                      aria-label="Tambah jumlah"
                      onClick={() => handleQtyChange(qty + 1)}
                      className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-ts-krem hover:bg-ts-hitam/60 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs font-mono font-bold text-ts-teal">
                    {quotation.tierBadge}
                  </span>
                </div>

                {/* Quick Volume Preset Chips (Touch Targets >= 44px) */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[1, 6, 12, 24, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQtyChange(preset)}
                      className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                        qty === preset
                          ? 'bg-ts-terracotta text-white border-ts-terracotta shadow-glow-terracotta'
                          : 'bg-ts-hitam/20 text-ts-muted border-ts-border hover:bg-ts-hitam/40 hover:text-ts-krem'
                      }`}
                    >
                      {preset} pcs {preset >= 12 ? '🔥' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end border-t border-ts-border">
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  onClick={() => setCurrentStep(2)}
                  className="min-h-[44px] font-mono text-xs font-bold"
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
                {DTF_PRINT_SIZES.map((p) => {
                  const isSelected = printSizeId === p.id;
                  const isDoubleSide = p.id.includes('plus') || p.id.includes('double');
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPrintSizeId(p.id)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer min-h-[64px] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-ts-mustard/20 border-ts-mustard text-ts-krem ring-1 ring-ts-mustard'
                          : 'bg-ts-hitam/20 border-ts-border text-ts-muted hover:bg-ts-hitam/40 hover:text-ts-krem'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-sm text-ts-krem">{p.name}</span>
                          {isDoubleSide && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-ts-mustard/20 text-ts-mustard font-bold">
                              2 Sisi
                            </span>
                          )}
                          {p.id === 'a3' && (
                            <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-ts-teal/20 text-ts-teal font-bold">
                              Paling Diminati
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-ts-muted mt-1">{p.desc || 'Bidang sablon standar presisi'}</div>
                      </div>
                      <div className="text-xs font-mono font-bold text-ts-mustard mt-3 pt-2 border-t border-ts-border/50">
                        Biaya Sablon: {formatRupiah(p.cost)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-ts-border">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  icon={ArrowLeft}
                  onClick={() => setCurrentStep(1)}
                  className="min-h-[44px] text-xs font-bold"
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  onClick={() => setCurrentStep(3)}
                  className="min-h-[44px] font-mono text-xs font-bold"
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
                id="customCity"
                label="Kota / Kabupaten Pengiriman"
                placeholder="Contoh: Jakarta Selatan, Surabaya, Medan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              {/* Artwork File Upload & Preflight */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="customArtworkInput" className="block text-xs font-bold text-ts-krem">
                    File Desain / Artwork:
                  </label>
                  <span className="text-[10px] text-ts-mustard font-mono">
                    PNG, PDF, AI, PSD (Maks 25MB, 300 DPI)
                  </span>
                </div>

                {/* Upload Dropzone */}
                <div className="border-2 border-dashed border-ts-border hover:border-ts-terracotta/50 rounded-2xl p-4 transition-all bg-ts-hitam/10">
                  {artworkPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/30 border border-ts-border shrink-0 relative flex items-center justify-center">
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
                          className="min-h-[44px] text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer pt-1"
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
                        aria-label="Hapus file"
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xs text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="customArtworkInput"
                      className="flex flex-col items-center justify-center py-5 cursor-pointer group min-h-[100px]"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-ts-surface group-hover:bg-ts-terracotta/20 text-ts-muted group-hover:text-ts-terracotta flex items-center justify-center border border-ts-border group-hover:border-ts-terracotta/40 transition-all mb-2">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-ts-krem group-hover:text-ts-terracotta transition-colors text-center">
                        Klik untuk Unggah Gambar Desain / Logo
                      </span>
                      <span className="text-[10px] text-ts-muted mt-0.5 text-center">
                        Maksimal 25MB • Format PNG transparan direkomendasikan
                      </span>
                      <input
                        id="customArtworkInput"
                        type="file"
                        accept="image/*,.pdf,.ai,.psd,.eps,.tif,.tiff"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>

                {/* Preflight Warning Box */}
                {preflightWarning && (
                  <div className="p-3 rounded-xl bg-ts-mustard/15 border border-ts-mustard/30 text-xs text-ts-krem flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-ts-mustard shrink-0 mt-0.5" />
                    <span>{preflightWarning}</span>
                  </div>
                )}

                {/* Cloud Link Input Fallback */}
                <div className="space-y-1 pt-1">
                  <label htmlFor="customArtworkLink" className="block text-[11px] font-medium text-ts-muted">
                    Atau Cantumkan Link Cloud (Google Drive / Dropbox / WeTransfer):
                  </label>
                  <Input
                    id="customArtworkLink"
                    placeholder="https://drive.google.com/... (opsional bila sudah upload file)"
                    value={artworkLink}
                    onChange={(e) => setArtworkLink(e.target.value)}
                  />
                </div>

                {/* Pre-Flight DTF Quality Standard Card */}
                <div className="p-3.5 rounded-xl bg-ts-hitam/20 border border-ts-border text-xs text-ts-muted space-y-1.5">
                  <div className="flex items-center gap-1.5 text-ts-teal font-bold">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Standar Pre-Flight Studio DTF:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    <li>File resolusi minimal 300 DPI skala 1:1 agar hasil sablon tidak pecah.</li>
                    <li>Wajib background transparan (format PNG/PDF/AI) tanpa kotak putih solid.</li>
                    <li>Digital mockup approval akan dikirimkan via WhatsApp sebelum proses cetak.</li>
                  </ul>
                </div>
              </div>

              {/* Special Order Notes */}
              <div className="space-y-1">
                <label htmlFor="customNotes" className="block text-xs font-bold text-ts-krem">
                  Catatan Tambahan (Opsional):
                </label>
                <textarea
                  id="customNotes"
                  placeholder="Contoh: Rincian ukuran bila pesan banyak (M: 4, L: 6, XL: 2), posisi sablon di dada kiri atau punggung belakang..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-ts-hitam border border-ts-border rounded-xl p-3 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta h-20"
                />
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-ts-border">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  icon={ArrowLeft}
                  onClick={() => setCurrentStep(2)}
                  className="min-h-[44px] text-xs font-bold"
                >
                  Kembali
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={isSubmitting ? Loader2 : Send}
                  disabled={isSubmitting || uploadingArtwork}
                  className="font-mono text-xs font-bold min-h-[48px]"
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
              <span className="text-[10px] font-mono text-ts-mustard font-bold uppercase">
                Estimasi HPP
              </span>
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
                <span>Tingkat Harga:</span>
                <span className="font-mono text-ts-teal font-bold">{quotation.tierLabel}</span>
              </div>
              <div className="flex justify-between text-ts-muted">
                <span>Estimasi per Pcs:</span>
                <strong className="font-mono text-ts-terracotta">{formatRupiah(quotation.estPricePerPcs)}</strong>
              </div>

              {quotation.totalSavings > 0 && (
                <div className="flex justify-between text-ts-green font-bold">
                  <span>Hemat Grosir:</span>
                  <span className="font-mono">-{formatRupiah(quotation.totalSavings)}</span>
                </div>
              )}

              <div className="pt-4 border-t border-ts-border flex justify-between items-baseline">
                <span className="font-bold text-ts-krem">Total Estimasi:</span>
                <span className="font-mono text-2xl font-black text-ts-green">{formatRupiah(quotation.estTotal)}</span>
              </div>
            </div>

            <div className="p-4 bg-ts-hitam/10 border border-ts-border rounded-2xl text-[11px] text-ts-muted space-y-1.5">
              <div className="text-ts-krem font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-teal" />
                <span>Standar Pengerjaan TeeStock:</span>
              </div>
              <p>• Pengerjaan cepat 2-3 hari kerja.</p>
              <p>• Bebas cetak mulai 1 pcs tanpa minimum order.</p>
              <p>• Heat Press 155°C &amp; Cold Peel dengan daya rekat sablon tinggi.</p>
              <p>• Digital mockup preview sebelum proses cetak.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
