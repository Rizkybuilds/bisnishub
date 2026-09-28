import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  UploadCloud, 
  Send,
  ShieldCheck,
  Palette,
  FileCheck,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { Input } from '@bisnishub/shared/components/ui/Input';
import { Card } from '@bisnishub/shared/components/ui/Card';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { sanitizePhoneNumber } from '@bisnishub/shared/utils/whatsappTemplates';
import { supabase } from '@bisnishub/shared/services/supabase';
import { useStore } from '@bisnishub/shared/context/StoreContext';
import { SEOHead } from '@bisnishub/shared/components/common/SEOHead';

export const CREATOR_ROYALTY_CONFIG = {
  royaltyPerPcs: 25000,
  minPayoutThreshold: 100000,
  payoutScheduleDay: 5,
  garmentBase: 'NSA Heavyweight 7200 (24s) & Softstyle 3600 (30s)',
  printSpec: 'DTF 155°C Cold Peel, finishing Teflon 5s'
};

export const CREATOR_NICHE_CATEGORIES = [
  { id: 'kopi_kafe', label: '☕ Kopi & Kafe' },
  { id: 'tech_dev', label: '💻 Tech, Coding & Developer' },
  { id: 'anak_bulu', label: '🐱 Anak Bulu (Kucing/Anjing)' },
  { id: 'humor_santai', label: '😂 Humor & Sarkasme Santai' },
  { id: 'tipografi', label: '🖋️ Tipografi & Statement' },
  { id: 'outdoor', label: '🏔️ Outdoor & Nature' },
  { id: 'urban_indie', label: '🛹 Urban & Musik Indie' },
  { id: 'seni_abstrak', label: '🎨 Seni Ilustrasi Abstrak' }
];

export const CREATOR_FAQS = [
  {
    question: 'Apakah hak cipta karya saya tetap milik saya 100%?',
    answer: 'Ya, mutlak 100%! Hak cipta moral dan hak kekayaan intelektual atas karya tetap milik Anda sepenuhnya. TeeStock hanya memegang hak lisensi non-eksklusif untuk mencetak dan mendistribusikan karya di media pakaian selama Anda mengizinkannya tampil di katalog kami.'
  },
  {
    question: 'Kapan dan bagaimana royalti dicairkan?',
    answer: 'Royalti dicatat secara transparan dan ditransfer otomatis setiap tanggal 5 awal bulan melalui transfer bank (BCA, Mandiri, BRI, BNI) atau e-wallet (GoPay, OVO, Dana) ke rekening Anda dengan batas penarikan minimum Rp 100.000.'
  },
  {
    question: 'Apakah ada biaya pendaftaran, biaya admin, atau deposit awal?',
    answer: 'Sama sekali tidak ada biaya (Rp 0). Menjadi partner kreator TeeStock 100% gratis tanpa risiko modal stok kaos atau mesin cetak.'
  },
  {
    question: 'Bagaimana spesifikasi file master desain yang wajib dipenuhi?',
    answer: 'File master wajib berformat PNG dengan latar belakang transparan (resolusi 300 DPI skala 1:1, profil warna sRGB/RGB). Pastikan tidak ada sisa artefak putih (white fringing) di tepi garis ilustrasi. Garis tertipis minimal 0.5 mm agar lem bubuk DTF menempel kuat.'
  },
  {
    question: 'Bagaimana jika pesanan pelanggan cacat atau rusak dalam pengiriman?',
    answer: 'TeeStock menanggung 100% biaya garansi penggantian barang baru untuk pelanggan kami. Royalti Anda tidak akan dipotong atau dibatalkan akibat kesalahan teknis produksi studio maupun ekspedisi kurir.'
  }
];

/**
 * Pure helper calculating monthly and annual creator royalty projection
 */
export function calculateCreatorRoyalty({ monthlySalesQty = 40, royaltyPerPcs = 25000 } = {}) {
  const qty = Math.max(0, Math.round(Number(monthlySalesQty) || 0));
  const rPerPcs = Math.max(0, Number(royaltyPerPcs) || 25000);
  const monthlyRoyalty = qty * rPerPcs;
  const annualRoyalty = monthlyRoyalty * 12;
  const dailyEquivalent = (qty / 30).toFixed(1);

  return {
    monthlySalesQty: qty,
    royaltyPerPcs: rPerPcs,
    monthlyRoyalty,
    annualRoyalty,
    dailyEquivalent
  };
}

/**
 * Pure validator for creator submission form
 */
export function validateCreatorSubmission({
  creatorName = '',
  creatorWhatsapp = '',
  creatorEmail = '',
  designTitle = '',
  driveLink = '',
  agreedTerms = false
} = {}) {
  const errors = {};

  if (!creatorName || !creatorName.trim()) {
    errors.creatorName = 'Nama kreator atau moniker wajib diisi.';
  }

  const cleanPhone = (creatorWhatsapp || '').trim().replace(/[\s-]/g, '');
  const phoneRegex = /^(08|\+628|628)[0-9]{8,12}$/;
  if (!cleanPhone) {
    errors.creatorWhatsapp = 'Nomor WhatsApp wajib diisi.';
  } else if (!phoneRegex.test(cleanPhone)) {
    errors.creatorWhatsapp = 'Format WhatsApp tidak valid (Gunakan format 08xx atau 628xx, 10-14 digit).';
  }

  if (creatorEmail && creatorEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(creatorEmail.trim())) {
      errors.creatorEmail = 'Format email tidak valid.';
    }
  }

  if (!designTitle || !designTitle.trim()) {
    errors.designTitle = 'Judul karya desain wajib diisi.';
  }

  if (!driveLink || !driveLink.trim()) {
    errors.driveLink = 'Tautan Google Drive file master wajib diisi.';
  } else if (!/^https?:\/\//i.test(driveLink.trim())) {
    errors.driveLink = 'Tautan file master harus diawali dengan http:// atau https://';
  }

  if (!agreedTerms) {
    errors.agreedTerms = 'Anda wajib menyetujui pernyataan keaslian karya dan hak cipta.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Pure helper generating formatted WhatsApp text for creator submissions
 */
export function generateCreatorSubmissionWaText({
  creatorName = '',
  creatorWhatsapp = '',
  socialHandle = '',
  designTitle = '',
  nicheCategory = '',
  driveLink = ''
} = {}) {
  return [
    `Halo Kurator TeeStock! Saya baru saja mengirimkan proposal submission karya grafis:`,
    ``,
    `🎨 *Nama Kreator:* ${creatorName || '-'}`,
    `📱 *WhatsApp:* ${creatorWhatsapp || '-'}`,
    socialHandle ? `🌐 *Portofolio / Sosmed:* ${socialHandle}` : null,
    `📌 *Judul Karya:* ${designTitle || '-'}`,
    `📂 *Kategori Niche:* ${nicheCategory || '-'}`,
    `🔗 *Link File Master (300 DPI):* ${driveLink || '-'}`,
    ``,
    `Karya ini 100% orisinal ciptaan saya dan siap diproduksi di atas kaos New States Apparel (NSA). Mohon dibantu kurasi katalog ya! Terima kasih.`
  ].filter(Boolean).join('\n');
}

/**
 * Generates direct wa.me link for creator submissions
 */
export function generateCreatorSubmissionWaUrl(storePhone = '085220274968', submissionData = {}) {
  const cleanWhatsapp = sanitizePhoneNumber(storePhone);
  const text = generateCreatorSubmissionWaText(submissionData);
  return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`;
}

export function CreatorPage() {
  const { storeSettings } = useStore();
  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  // Interactive Royalty Estimator
  const [estimatedSales, setEstimatedSales] = useState(40);
  const royaltyConfig = calculateCreatorRoyalty({
    monthlySalesQty: estimatedSales,
    royaltyPerPcs: CREATOR_ROYALTY_CONFIG.royaltyPerPcs
  });

  // Form Submission State
  const [creatorName, setCreatorName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');
  const [creatorWhatsapp, setCreatorWhatsapp] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [designTitle, setDesignTitle] = useState('');
  const [nicheCategory, setNicheCategory] = useState(CREATOR_NICHE_CATEGORIES[0].label);
  const [driveLink, setDriveLink] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(0);

  const quickVolumePresets = [20, 40, 80, 150, 300];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const validation = validateCreatorSubmission({
      creatorName,
      creatorWhatsapp,
      creatorEmail,
      designTitle,
      driveLink,
      agreedTerms
    });

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setSubmitting(true);

    try {
      // Try saving to Supabase ts_creator_submissions
      const { error } = await supabase
        .from('ts_creator_submissions')
        .insert([
          {
            creator_name: creatorName.trim(),
            creator_email: creatorEmail.trim(),
            creator_whatsapp: creatorWhatsapp.trim(),
            design_title: designTitle.trim(),
            niche_category: nicheCategory,
            master_drive_link: driveLink.trim(),
            agreed_to_terms: agreedTerms,
            status: 'pending'
          }
        ]);

      if (error) {
        console.warn('Supabase submission insert warning:', error);
      }

      setSubmittedSuccess(true);
    } catch (err) {
      console.warn('Submission caught error:', err);
      setSubmittedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const waSubmissionUrl = generateCreatorSubmissionWaUrl(cleanWhatsapp, {
    creatorName,
    creatorWhatsapp,
    socialHandle,
    designTitle,
    nicheCategory,
    driveLink
  });

  return (
    <div className="min-h-screen bg-ts-bg text-ts-krem py-8 sm:py-16">
      <SEOHead
        title="Panggung Kreator // TeeStock Curated Apparel House"
        description="Panggung bagi ilustrator dan kreator lokal. Jual karya desainmu di atas katun New States Apparel tanpa modal, dapat royalti Rp 25.000 per kaos."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-20">
        
        {/* Hero Section: Value Proposition */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ts-surface border border-ts-border text-xs text-ts-terracotta font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CREATOR LAUNCHPAD // ZERO RISK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ts-krem tracking-tight leading-tight">
            Panggung untuk Karyamu. <br className="hidden sm:inline" />
            <span className="text-ts-terracotta">Tanpa Modal &amp; Bebas Ribet.</span>
          </h1>

          <p className="text-sm sm:text-base text-ts-kremMuted max-w-2xl mx-auto leading-relaxed">
            Kamu fokus menggambar dan bercerita. Biar TeeStock yang mengurus belanja kain New States Apparel (NSA), cetak DTF 155°C, packing rapi, hingga kirim ke tangan pendukungmu.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-mono text-ts-kremMuted">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Royalti Bersih Rp 25.000/pcs</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hak Cipta 100% Milikmu</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Dicetak di Katun NSA 24s</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Payout Tiap Tanggal 5</span>
          </div>
        </div>

        {/* 3 Steps Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="p-6 bg-ts-surface border-ts-border space-y-3 shadow-elevation">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center font-black font-mono">
              01
            </div>
            <h3 className="font-bold text-base text-ts-krem">Submit Karyamu</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Kirimkan tautan Google Drive file PNG transparan 300 DPI melalui formulir kurasi di bawah ini. Tim kurator mereview kelayakan cetak dalam 1x24 jam.
            </p>
          </Card>

          <Card className="p-6 bg-ts-surface border-ts-border space-y-3 shadow-elevation">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black font-mono">
              02
            </div>
            <h3 className="font-bold text-base text-ts-krem">Kami Produksi &amp; Kirim</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Tiap ada pesanan masuk di etalase, studio mencetak garmen menggunakan film DTF premium dan press 155°C, lalu dikemas rapi dan dikirim langsung dari Depok.
            </p>
          </Card>

          <Card className="p-6 bg-ts-surface border-ts-border space-y-3 shadow-elevation">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black font-mono">
              03
            </div>
            <h3 className="font-bold text-base text-ts-krem">Terima Royalti Bulanan</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Dapatkan royalti bersih Rp 25.000 per kaos terjual yang ditransfer otomatis ke rekening bank atau e-wallet kamu setiap tanggal 5 awal bulan.
            </p>
          </Card>
        </div>

        {/* Interactive Royalty Simulator */}
        <Card className="p-6 sm:p-8 bg-ts-surface border-ts-border shadow-elevation space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ts-border pb-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-500">
                <Coins className="w-4 h-4" />
                <span>SIMULATOR ROYALTI KREATOR</span>
              </div>
              <h2 className="text-xl font-bold text-ts-krem mt-1">Berapa Potensi Penghasilan Karyamu?</h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-mono text-ts-kremMuted block">Estimasi Royalti Bulanan</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-500 font-mono">
                {formatRupiah(royaltyConfig.monthlyRoyalty)}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-ts-kremMuted">
              <span>Target Penjualan Kaos: <strong className="text-ts-krem text-sm">{estimatedSales} pcs / bulan</strong> (~{royaltyConfig.dailyEquivalent} pcs / hari)</span>
              <span>Royalti Tetap: <strong className="text-emerald-400">Rp 25.000 / pcs</strong></span>
            </div>

            {/* Slider with Min/Max */}
            <input
              type="range"
              min="10"
              max="300"
              step="5"
              value={estimatedSales}
              onChange={(e) => setEstimatedSales(Number(e.target.value))}
              aria-label="Target penjualan kaos per bulan"
              className="w-full h-2.5 bg-ts-surfaceHover rounded-lg appearance-none cursor-pointer accent-ts-terracotta"
            />

            {/* Quick Volume Chips (Mobile Friendly >= 44x44px touch targets) */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-ts-kremMuted block mb-2">Preset Cepat Target Penjualan:</span>
              <div className="flex flex-wrap gap-2">
                {quickVolumePresets.map((preset) => {
                  const isSelected = estimatedSales === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setEstimatedSales(preset)}
                      className={`min-h-[44px] min-w-[70px] px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? 'bg-ts-terracotta text-white shadow-sm ring-1 ring-ts-terracotta'
                          : 'bg-ts-bg border border-ts-border text-ts-kremMuted hover:text-ts-krem hover:border-ts-borderHover'
                      }`}
                    >
                      {preset} pcs
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Earning Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-ts-border/60">
              <div className="p-3 bg-ts-bg rounded-xl border border-ts-border">
                <span className="text-[10px] font-mono text-ts-kremMuted block">Proyeksi 1 Tahun</span>
                <span className="text-sm sm:text-base font-bold text-ts-krem font-mono">
                  {formatRupiah(royaltyConfig.annualRoyalty)}
                </span>
              </div>
              <div className="p-3 bg-ts-bg rounded-xl border border-ts-border">
                <span className="text-[10px] font-mono text-ts-kremMuted block">Pencairan Minimum</span>
                <span className="text-sm sm:text-base font-bold text-ts-krem font-mono">
                  {formatRupiah(CREATOR_ROYALTY_CONFIG.minPayoutThreshold)}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-3 bg-ts-bg rounded-xl border border-ts-border">
                <span className="text-[10px] font-mono text-ts-kremMuted block">Jadwal Transfer</span>
                <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                  Tgl 5 Tiap Bulan
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Technical Pre-Flight Guidelines */}
        <Card className="p-6 sm:p-8 bg-ts-surface border-ts-border shadow-elevation space-y-4">
          <div className="flex items-center gap-2.5 text-ts-krem font-bold text-base sm:text-lg">
            <Palette className="w-5 h-5 text-ts-terracotta" />
            <h3>Standar Kesiapan File Desain (Pre-Flight 300 DPI)</h3>
          </div>
          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            Agar hasil sablon DTF tajam, pekat, dan lem menempel sempurna tanpa cacat rontok, pastikan file karya memenuhi standar teknis berikut:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-ts-bg border border-ts-border space-y-1">
              <span className="text-[11px] font-mono font-bold text-ts-terracotta block">RESOLUSI &amp; SKALA</span>
              <span className="text-xs font-bold text-ts-krem block">300 DPI Skala 1:1</span>
              <p className="text-[11px] text-ts-kremMuted">Jangan lakukan upscaling gambar kecil agar tidak pecah/blur saat dicetak.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-ts-bg border border-ts-border space-y-1">
              <span className="text-[11px] font-mono font-bold text-emerald-400 block">FORMAT MASTER</span>
              <span className="text-xs font-bold text-ts-krem block">PNG Transparan</span>
              <p className="text-[11px] text-ts-kremMuted">Latar belakang wajib transparan tanpa white fringing (pixel putih di tepi garis).</p>
            </div>
            <div className="p-3.5 rounded-xl bg-ts-bg border border-ts-border space-y-1">
              <span className="text-[11px] font-mono font-bold text-amber-400 block">PROFIL WARNA</span>
              <span className="text-xs font-bold text-ts-krem block">RGB / sRGB</span>
              <p className="text-[11px] text-ts-kremMuted">RIP software DTF kami optimal mengonversi profil warna sRGB ke tinta pigment.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-ts-bg border border-ts-border space-y-1">
              <span className="text-[11px] font-mono font-bold text-sky-400 block">KETEBALAN GARIS</span>
              <span className="text-xs font-bold text-ts-krem block">Minimal 0.5 mm</span>
              <p className="text-[11px] text-ts-kremMuted">Garis terlalu halus (&lt; 0.5 mm) berisiko tidak terlapisi lem bubuk panas.</p>
            </div>
          </div>
        </Card>

        {/* Submission Form Section */}
        <div id="submit-form" className="max-w-2xl mx-auto space-y-6 scroll-mt-20">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-ts-krem">Formulir Kirim Desain</h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted">
              Isi data karyamu di bawah ini. Tim kurator kami akan mereview kelayakan cetak dalam 1x24 jam.
            </p>
          </div>

          {submittedSuccess ? (
            <Card className="p-8 bg-ts-surface border-emerald-500/40 text-center space-y-4 shadow-elevation">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-ts-krem">Karya Berhasil Dikirimkan!</h3>
              <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed max-w-md mx-auto">
                Terima kasih telah mempercayakan karyamu kepada TeeStock. Kami akan melakukan pre-flight check (300 DPI &amp; komposisi) dalam 1x24 jam kerja.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <a href={waSubmissionUrl} target="_blank" rel="noopener noreferrer" className="min-h-[44px]">
                  <Button variant="primary" icon={Send} className="w-full sm:w-auto min-h-[44px]">
                    Konfirmasi via WhatsApp
                  </Button>
                </a>
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setDesignTitle('');
                    setDriveLink('');
                    setAgreedTerms(false);
                  }} 
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  Kirim Desain Lain
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8 bg-ts-surface border-ts-border shadow-elevation">
              <form noValidate onSubmit={handleSubmit} className="space-y-4 text-left">
                {Object.keys(formErrors).length > 0 && (
                  <div role="alert" className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Mohon periksa dan lengkapi formulir pendaftaran karya di bawah ini.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Kreator / Moniker *"
                    placeholder="Contoh: Budi Studio / SenimanKucing"
                    value={creatorName}
                    error={formErrors.creatorName}
                    onChange={(e) => {
                      setCreatorName(e.target.value);
                      if (formErrors.creatorName) setFormErrors(prev => ({ ...prev, creatorName: null }));
                    }}
                  />

                  <Input
                    label="Nomor WhatsApp *"
                    type="tel"
                    placeholder="Contoh: 08123456789"
                    value={creatorWhatsapp}
                    error={formErrors.creatorWhatsapp}
                    onChange={(e) => {
                      setCreatorWhatsapp(e.target.value);
                      if (formErrors.creatorWhatsapp) setFormErrors(prev => ({ ...prev, creatorWhatsapp: null }));
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email (Opsional)"
                    type="email"
                    placeholder="nama@gmail.com"
                    value={creatorEmail}
                    error={formErrors.creatorEmail}
                    onChange={(e) => {
                      setCreatorEmail(e.target.value);
                      if (formErrors.creatorEmail) setFormErrors(prev => ({ ...prev, creatorEmail: null }));
                    }}
                  />

                  <Input
                    label="Akun Instagram / X / Portofolio"
                    placeholder="@senimankeren"
                    value={socialHandle}
                    onChange={(e) => setSocialHandle(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ts-kremMuted block">Kategori Niche Karya *</label>
                  <select
                    value={nicheCategory}
                    onChange={(e) => setNicheCategory(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-ts-bg border border-ts-border text-ts-krem text-xs focus:outline-none focus:border-ts-terracotta transition-all"
                  >
                    {CREATOR_NICHE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.label}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Judul Desain Karya *"
                  placeholder="Contoh: Kopi Tubruk & Filosofi Lembur"
                  value={designTitle}
                  error={formErrors.designTitle}
                  onChange={(e) => {
                    setDesignTitle(e.target.value);
                    if (formErrors.designTitle) setFormErrors(prev => ({ ...prev, designTitle: null }));
                  }}
                />

                <div className="space-y-1.5">
                  <Input
                    label="Link Google Drive File Master (PNG 300 DPI Transparan) *"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveLink}
                    error={formErrors.driveLink}
                    onChange={(e) => {
                      setDriveLink(e.target.value);
                      if (formErrors.driveLink) setFormErrors(prev => ({ ...prev, driveLink: null }));
                    }}
                  />
                  <span className="text-[11px] text-ts-kremMuted block">
                    Pastikan perizinan link diatur ke <em>"Anyone with the link can view"</em> agar tim kurator dapat mengunduh aset.
                  </span>
                </div>

                {/* S&K Box */}
                <div className="p-3.5 rounded-xl bg-ts-bg border border-ts-border space-y-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-ts-krem leading-relaxed">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => {
                        setAgreedTerms(e.target.checked);
                        if (formErrors.agreedTerms) setFormErrors(prev => ({ ...prev, agreedTerms: null }));
                      }}
                      className="mt-0.5 w-4 h-4 rounded border-ts-border text-ts-terracotta focus:ring-0 cursor-pointer"
                    />
                    <span>
                      Saya menjamin bahwa karya ini adalah <strong>100% orisinal ciptaan saya sendiri</strong>, bukan hasil plagiasi, comotan internet, atau pelanggaran HAKI. Saya setuju menerima royalti bersih Rp 25.000 per pcs terjual.
                    </span>
                  </label>
                  {formErrors.agreedTerms && (
                    <span className="text-[11px] text-red-400 font-mono block">
                      {formErrors.agreedTerms}
                    </span>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={UploadCloud}
                  disabled={submitting}
                  className="w-full min-h-[48px] justify-center text-xs sm:text-sm font-bold mt-2"
                >
                  {submitting ? 'Mengirim Karya...' : 'Kirim Karya untuk Dikurasi'}
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto space-y-4 border-t border-ts-border pt-10">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-ts-krem">Pertanyaan yang Sering Diajukan Kreator</h3>
            <p className="text-xs text-ts-kremMuted">Semua hal yang perlu kamu ketahui seputar hak cipta, royalti, dan proses kurasi.</p>
          </div>

          <div className="space-y-3 text-xs">
            {CREATOR_FAQS.map((faq, idx) => {
              const isOpen = expandedFaqIndex === idx;
              return (
                <Card key={idx} className="bg-ts-surface border-ts-border overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setExpandedFaqIndex(isOpen ? -1 : idx)}
                    className="w-full min-h-[48px] p-4 text-left flex items-center justify-between gap-3 font-bold text-ts-krem hover:text-ts-terracotta transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-ts-terracotta flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-ts-kremMuted flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-ts-kremMuted leading-relaxed border-t border-ts-border/40 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
