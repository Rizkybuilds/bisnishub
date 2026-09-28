import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  Package, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  Download, 
  MessageSquare, 
  Send, 
  Check,
  ChevronDown,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@bisnishub/shared/context/AuthContext';
import { useStore } from '@bisnishub/shared/context/StoreContext';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { Input } from '@bisnishub/shared/components/ui/Input';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { sanitizePhoneNumber } from '@bisnishub/shared/utils/whatsappTemplates';
import { supabase } from '@bisnishub/shared/services/supabase';
import { SEOHead } from '@bisnishub/shared/components/common/SEOHead';

export const PARTNER_TIERS = {
  dropship: {
    id: 'dropship',
    name: 'Mitra Dropshipper',
    badge: 'Modal Rp 0',
    costPerPcs: 75000,
    desc: 'Tanpa deposit awal, kirim white-label atas nama tokomu',
    minOrder: '1 pcs (Tanpa Min. Order)',
    features: [
      'Harga modal Rp 75.000 / pcs kaos grafis',
      'Bebas biaya pendaftaran & tanpa modal stok',
      'Packing polymailer polos white-label (nama tokomu)',
      'Akses folder Google Drive media kit foto resolusi tinggi',
      'Dukungan retur 100% jika cacat produksi'
    ]
  },
  reseller: {
    id: 'reseller',
    name: 'Mitra Reseller VIP',
    badge: 'Margin Tertinggi',
    costPerPcs: 65000,
    desc: 'Grosir & volume >= 12 pcs / bulan',
    minOrder: '12 pcs / bulan',
    features: [
      'Harga modal super grosir Rp 65.000 / pcs',
      'Prioritas antrean cetak studio DTF H+0 / H+1',
      'Custom insert thank you card & hangtag brand tokomu',
      'Akses preview katalog drop 3 hari lebih awal',
      'Dukungan dedicated WhatsApp VIP account manager'
    ]
  }
};

export const PARTNER_FAQS = [
  {
    q: 'Apakah ada biaya pendaftaran atau deposit saldo awal?',
    a: 'Tidak ada sama sekali (100% Gratis). Anda bisa langsung mulai berjualan sebagai dropshipper tanpa perlu deposit uang muka atau membeli paket kemitraan berbayar.'
  },
  {
    q: 'Apakah pengiriman benar-benar anonim tanpa identitas TeeStock?',
    a: 'Ya, 100% White-Label. Pada resi dan kemasan polymailer, pengirim yang tercantum adalah nama toko dan nomor WhatsApp Anda sendiri. Pelanggan Anda tidak akan mengetahui bahwa kaos diproduksi oleh TeeStock Studio.'
  },
  {
    q: 'Berapa lama waktu proses pengerjaan pesanan dropship?',
    a: 'Pesanan kaos polos dikirim di hari yang sama (H+0) jika order masuk sebelum jam 14.00 WIB. Untuk kaos grafis sablon DTF, proses pengerjaan heat press membutuhkan waktu 1-2 hari kerja.'
  },
  {
    q: 'Bagaimana jika pesanan yang diterima pembeli salah ukuran atau cacat?',
    a: 'TeeStock memberikan garansi retur ganti baru 100% gratis jika terjadi cacat produksi sablon atau kesalahan kirim dari pihak studio kami. Pembeli cukup mengirimkan video unboxing.'
  },
  {
    q: 'Kapan status Reseller VIP diaktifkan?',
    a: 'Status Reseller VIP (harga modal Rp 65.000/pcs) otomatis aktif bagi mitra yang memiliki akumulasi penjualan minimal 12 pcs dalam 30 hari terakhir.'
  }
];

/**
 * Pure Profit Simulation Engine for TeeStock Partners
 */
export function calculatePartnerProfitSimulation({ tier = 'dropship', targetPcs = 50, sellingPrice = 99000 } = {}) {
  const safePcs = Math.max(1, Number(targetPcs) || 1);
  const safePrice = Math.max(0, Number(sellingPrice) || 0);
  const tierConfig = PARTNER_TIERS[tier] || PARTNER_TIERS.dropship;

  const costPerPcs = tierConfig.costPerPcs;
  const marginPerPcs = Math.max(0, safePrice - costPerPcs);
  const monthlyProfit = marginPerPcs * safePcs;
  const monthlyRevenue = safePrice * safePcs;
  const profitMarginPct = safePrice > 0 ? Math.round((marginPerPcs / safePrice) * 100) : 0;
  const dailyPcsEquivalent = (safePcs / 30).toFixed(1);

  return {
    tierConfig,
    costPerPcs,
    marginPerPcs,
    monthlyProfit,
    monthlyRevenue,
    profitMarginPct,
    dailyPcsEquivalent
  };
}

/**
 * Pure application form validation
 */
export function validatePartnerApplication({ fullName, phone, brandName, city }) {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Nama lengkap wajib diisi.';
  } else if (fullName.trim().length < 3) {
    errors.fullName = 'Nama lengkap minimal 3 karakter.';
  }

  const cleanPhone = (phone || '').trim().replace(/\D/g, '');
  if (!phone || !phone.trim()) {
    errors.phone = 'Nomor WhatsApp wajib diisi.';
  } else if (cleanPhone.length < 8 || cleanPhone.length > 15) {
    errors.phone = 'Nomor WhatsApp minimal 8 digit.';
  }

  if (!brandName || !brandName.trim()) {
    errors.brandName = 'Nama toko / brand wajib diisi.';
  } else if (brandName.trim().length < 2) {
    errors.brandName = 'Nama toko minimal 2 karakter.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Formats WhatsApp application text
 */
export function generatePartnerRegistrationWaText({
  fullName,
  brandName,
  phone,
  city,
  channel,
  partnerTier = 'dropship'
}) {
  const tierName = partnerTier === 'reseller' ? 'Reseller VIP (Rp 65.000)' : 'Dropshipper (Rp 75.000)';
  return [
    `Halo TeeStock! Saya ingin mendaftar sebagai Mitra ${tierName}:`,
    ``,
    `👤 *Nama:* ${fullName || 'Mitra'}`,
    `🏪 *Nama Toko/Brand:* ${brandName || '-'}`,
    `📱 *No. WhatsApp:* ${phone || '-'}`,
    `📍 *Kota:* ${city || '-'}`,
    `🛒 *Channel Penjualan:* ${channel || 'Shopee & TikTok Shop'}`,
    ``,
    `Mohon info aktivasi akun mitra dan akses media kit foto katalog polos. Terima kasih!`
  ].join('\n');
}

/**
 * Generates direct wa.me link for partner application
 */
export function generatePartnerRegistrationWaUrl(storePhone = '085220274968', partnerData = {}) {
  const cleanWhatsapp = sanitizePhoneNumber(storePhone);
  const text = generatePartnerRegistrationWaText(partnerData);
  return `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(text)}`;
}

export function PartnerPage() {
  const { user, profile } = useAuth();
  const { storeSettings } = useStore();
  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  // Interactive Margin Calculator States
  const [targetPcs, setTargetPcs] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(99000);
  const [partnerTier, setPartnerTier] = useState('dropship'); // 'dropship' or 'reseller'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Pure simulation result
  const simulation = calculatePartnerProfitSimulation({
    tier: partnerTier,
    targetPcs,
    sellingPrice
  });

  // Partner Registration Form States
  const [formFullName, setFormFullName] = useState(profile?.full_name || '');
  const [formBrandName, setFormBrandName] = useState('');
  const [formPhone, setFormPhone] = useState(profile?.phone || '');
  const [formCity, setFormCity] = useState(profile?.city || '');
  const [formChannel, setFormChannel] = useState('Shopee & TikTok Shop');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [partnerFormErrors, setPartnerFormErrors] = useState({});

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmitApplication = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    const validation = validatePartnerApplication({
      fullName: formFullName,
      phone: formPhone,
      brandName: formBrandName,
      city: formCity
    });

    if (!validation.isValid) {
      setPartnerFormErrors(validation.errors);
      const firstField = Object.keys(validation.errors)[0];
      const targetId = firstField === 'fullName' ? 'partnerFullName' : firstField === 'phone' ? 'partnerPhone' : 'partnerBrandName';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus?.();
      }
      return;
    }

    setPartnerFormErrors({});
    setSubmitting(true);

    try {
      const applicationPayload = {
        user_id: user?.id || null,
        full_name: formFullName.trim(),
        brand_name: formBrandName.trim(),
        phone: formPhone.trim(),
        city: formCity.trim(),
        sales_channel: formChannel,
        target_tier: partnerTier,
        status: 'pending',
      };

      try {
        const { error: insertErr } = await supabase
          .from('ts_partner_applications')
          .insert([applicationPayload]);

        if (insertErr) {
          console.warn('Gagal simpan ke Supabase, mengarahkan ke fallback WA:', insertErr);
        }
      } catch (err) {
        console.warn('Supabase offline or missing table, fallback to UI success & WA:', err);
      }

      if (user) {
        try {
          await supabase.from('ts_user_profiles').update({
            partner_status: 'pending',
            partner_tier: partnerTier
          }).eq('id', user.id);
        } catch (_) {}
      }

      setSubmittedSuccess(true);
    } catch (err) {
      console.warn('Partner app submit notice:', err);
      setSubmittedSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const waApplyUrl = generatePartnerRegistrationWaUrl(cleanWhatsapp, {
    fullName: formFullName,
    brandName: formBrandName,
    phone: formPhone,
    city: formCity,
    channel: formChannel,
    partnerTier
  });

  return (
    <div className="min-h-screen pb-24 space-y-20 sm:space-y-28">
      <SEOHead
        title="Peluang Kemitraan Dropship & Studio Supply White-Label | TeeStock"
        description="Mulai bisnis brand clothing kamu sendiri tanpa modal stok dan mesin. HPP mulai Rp 65.000/pcs, 100% bahan New States Apparel (NSA) 24s/30s asli, sablon DTF HD, pengiriman white-label atas nama tokomu."
        keywords={["dropship apparel brand", "reseller kaos nsa", "peluang usaha streetwear", "supplier kaos nsa", "sablon dtf satuan"]}
        canonicalPath="/partner"
      />

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Glow ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-ts-mustard/20 via-ts-terracotta/10 to-transparent blur-[120px] rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ts-mustard/15 border border-ts-mustard/30 text-xs font-semibold text-ts-mustard animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROGRAM KEMITRAAN TEESTOCK STUDIO</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-ts-krem tracking-tight max-w-4xl mx-auto leading-tight">
          Mulai Brand Apparel Independen <br />
          <span className="bg-gradient-to-r from-ts-mustard via-[#F5D77F] to-ts-terracotta bg-clip-text text-transparent">
            Tanpa Modal Stok &amp; Mesin Sablon.
          </span>
        </h1>

        <p className="text-xs sm:text-sm lg:text-base text-ts-muted max-w-2xl mx-auto leading-relaxed">
          Fokuslah membangun komunitas dan identitas brand kamu. Seluruh urusan garmen New States Apparel, sablon DTF in-house 155°C, hingga packaging pengiriman atas nama brand kamu — biarkan TeeStock Studio yang tangani.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a href="#daftar-mitra">
            <Button size="lg" variant="glow" icon={ArrowRight} className="min-h-[48px] font-bold">
              Daftar Jadi Mitra Sekarang
            </Button>
          </a>
          <a href="#kalkulator-profit">
            <Button size="lg" variant="secondary" icon={Calculator} className="min-h-[48px] font-bold">
              Hitung Simulasi Profit
            </Button>
          </a>
        </div>

        {/* 3 Quick Benefit Metrics */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-3xl bg-ts-surface border border-ts-border shadow-glass-card">
            <div className="w-10 h-10 rounded-2xl bg-ts-green/15 text-ts-green flex items-center justify-center border border-ts-green/30 mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-ts-krem">Margin Rp 24k - Rp 45k/pcs</h3>
            <p className="text-xs text-ts-muted mt-1">
              Harga modal mitra mulai Rp 75.000 (Dropshipper) hingga modal grosir VIP. Kamu bebas menentukan harga jual tokomu sendiri.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-ts-surface border border-ts-border shadow-glass-card">
            <div className="w-10 h-10 rounded-2xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center border border-ts-mustard/30 mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-ts-krem">100% Pengiriman White-Label</h3>
            <p className="text-xs text-ts-muted mt-1">
              Label pengiriman menggunakan nama toko dan no HP kamu. Bebas atribut TeeStock sehingga pembeli setia ke tokomu.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-ts-surface border border-ts-border shadow-glass-card">
            <div className="w-10 h-10 rounded-2xl bg-ts-teal/15 text-ts-teal flex items-center justify-center border border-ts-teal/30 mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-ts-krem">Tanpa Modal &amp; Minimum Order</h3>
            <p className="text-xs text-ts-muted mt-1">
              Order 1 pcs tetap kami proses cepat H+1. Tidak ada risiko menimbun stok mati yang tidak laku.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Interactive Margin Calculator ─────────────────── */}
      <section id="kalkulator-profit" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-6 sm:p-10 rounded-3xl bg-ts-surface border border-ts-border shadow-glass-card shadow-glass-inset space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ts-mustard/15 text-ts-mustard text-xs font-mono font-bold">
              <Calculator className="w-3.5 h-3.5" />
              <span>SIMULASI PENGHASILAN BULANAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ts-krem">
              Berapa Potensi Keuntungan Bersih Kamu?
            </h2>
            <p className="text-xs sm:text-sm text-ts-muted">
              Sesuaikan target penjualan dan harga jual tokomu untuk melihat potensi cash flow yang dihasilkan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tier Switcher with Touch Targets >= 44px */}
              <div>
                <label className="block text-xs font-bold text-ts-krem mb-2">Pilihan Tier Kemitraan:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPartnerTier('dropship')}
                    aria-pressed={partnerTier === 'dropship'}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px] ${
                      partnerTier === 'dropship'
                        ? 'bg-ts-mustard/20 border-ts-mustard text-ts-krem shadow-glow-mustard ring-1 ring-ts-mustard'
                        : 'bg-ts-hitam/20 border-ts-border text-ts-muted hover:border-ts-mustard/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Mitra Dropshipper</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-ts-mustard/20 text-ts-mustard font-bold">
                        Modal Rp 0
                      </span>
                    </div>
                    <div className="font-mono text-sm font-black text-ts-mustard mt-1">Rp 75.000 / pcs</div>
                    <div className="text-[11px] text-ts-muted mt-1">Tanpa deposit awal, langsung jualan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPartnerTier('reseller')}
                    aria-pressed={partnerTier === 'reseller'}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[64px] ${
                      partnerTier === 'reseller'
                        ? 'bg-ts-green/20 border-ts-green text-ts-krem shadow-glow-teal ring-1 ring-ts-green'
                        : 'bg-ts-hitam/20 border-ts-border text-ts-muted hover:border-ts-green/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Mitra Reseller VIP</span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-ts-green/20 text-ts-green font-bold">
                        Top Tier
                      </span>
                    </div>
                    <div className="font-mono text-sm font-black text-ts-green mt-1">Rp 65.000 / pcs</div>
                    <div className="text-[11px] text-ts-muted mt-1">Grosir &ge; 12 pcs / bulan</div>
                  </button>
                </div>
              </div>

              {/* Volume Slider & Presets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label htmlFor="targetPcsRange" className="text-ts-krem">Target Penjualan Bulanan:</label>
                  <span className="font-mono text-base text-ts-mustard px-3 py-1 rounded-xl bg-ts-hitam/20 border border-ts-border font-bold">
                    {targetPcs} Kaos / Bulan ({simulation.dailyPcsEquivalent} pcs/hari)
                  </span>
                </div>
                <input
                  id="targetPcsRange"
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={targetPcs}
                  onChange={(e) => setTargetPcs(Number(e.target.value))}
                  className="w-full accent-ts-mustard cursor-pointer min-h-[36px]"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {[25, 50, 100, 200].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetPcs(preset)}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                        targetPcs === preset
                          ? 'bg-ts-mustard text-zinc-950 border-ts-mustard'
                          : 'bg-ts-hitam/20 text-ts-muted border-ts-border hover:text-ts-krem'
                      }`}
                    >
                      {preset} pcs
                    </button>
                  ))}
                </div>
              </div>

              {/* Selling Price Slider & Presets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label htmlFor="sellingPriceRange" className="text-ts-krem">Harga Jual Ritel Toko Kamu:</label>
                  <span className="font-mono text-base text-ts-krem px-3 py-1 rounded-xl bg-ts-hitam/20 border border-ts-border font-bold">
                    {formatRupiah(sellingPrice)}
                  </span>
                </div>
                <input
                  id="sellingPriceRange"
                  type="range"
                  min="89000"
                  max="149000"
                  step="5000"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full accent-ts-terracotta cursor-pointer min-h-[36px]"
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  {[99000, 115000, 129000, 149000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSellingPrice(preset)}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer ${
                        sellingPrice === preset
                          ? 'bg-ts-terracotta text-white border-ts-terracotta'
                          : 'bg-ts-hitam/20 text-ts-muted border-ts-border hover:text-ts-krem'
                      }`}
                    >
                      {formatRupiah(preset)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Result Card (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-ts-surface border border-ts-border space-y-5 shadow-2xl">
              <div className="border-b border-ts-border pb-4">
                <span className="text-[11px] font-mono text-ts-muted block uppercase">Estimasi Laba Bersih</span>
                <div className="font-mono text-3xl sm:text-4xl font-black text-ts-green mt-1">
                  {formatRupiah(simulation.monthlyProfit)}
                </div>
                <span className="text-[11px] text-ts-muted mt-0.5 block">per bulan masuk ke rekening kamu</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-ts-muted">
                  <span>Margin Bersih per Kaos:</span>
                  <span className="font-mono text-ts-krem font-bold">
                    {formatRupiah(simulation.marginPerPcs)} ({simulation.profitMarginPct}%)
                  </span>
                </div>
                <div className="flex justify-between text-ts-muted">
                  <span>Estimasi Omset Toko Kamu:</span>
                  <span className="font-mono text-ts-krem font-bold">{formatRupiah(simulation.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between text-ts-muted">
                  <span>Modal Stok Dibutuhkan:</span>
                  <span className="font-mono text-ts-green font-bold">Rp 0 (Tanpa Modal)</span>
                </div>
              </div>

              <a
                href="#daftar-mitra"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ts-mustard hover:bg-ts-mustard/90 text-zinc-950 font-extrabold text-xs shadow-glow-mustard transition-all active:scale-95 cursor-pointer min-h-[48px]"
              >
                <span>Daftar &amp; Dapatkan Harga Ini</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works (Alur Dropship) ──────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-ts-krem tracking-tight">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-xs sm:text-sm text-ts-muted">
            Alur praktis 4 langkah jualan apparel brand kamu tanpa perlu pusing mikirin alat sablon dan packing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-ts-surface border border-ts-border space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-ts-krem/15">01</span>
            <h3 className="text-sm font-bold text-ts-krem">Upload Foto Produk</h3>
            <p className="text-xs text-ts-muted leading-relaxed">
              Unduh media kit mockup resolusi tinggi kami dan unggah ke tokomu di Shopee, TikTok Shop, atau IG.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface border border-ts-border space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-ts-krem/15">02</span>
            <h3 className="text-sm font-bold text-ts-krem">Terima Pesanan</h3>
            <p className="text-xs text-ts-muted leading-relaxed">
              Customer membeli dan membayar ke rekening/marketplace kamu dengan harga ritel yang kamu tentukan.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface border border-ts-border space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-ts-krem/15">03</span>
            <h3 className="text-sm font-bold text-ts-krem">Pesan ke TeeStock</h3>
            <p className="text-xs text-ts-muted leading-relaxed">
              Buka website TeeStock, masukkan pesanan pembeli dengan harga modal mitra, dan centang opsi dropship.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface border border-ts-border space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-ts-krem/15">04</span>
            <h3 className="text-sm font-bold text-ts-krem">Kami Kirim ke Customer</h3>
            <p className="text-xs text-ts-muted leading-relaxed">
              Kami cetak DTF HD, press suhu 155°C, pack polymailer rapi, dan kirim atas nama tokomu. Selesai!
            </p>
          </div>
        </div>
      </section>

      {/* ─── Media Kit & Aset Download Teaser ───────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-teal bg-ts-teal/15 px-2.5 py-0.5 rounded-full border border-ts-teal/30 mb-1">
              <Download className="w-3 h-3" />
              <span>ASET PROMOSI RESMI</span>
            </div>
            <h3 className="text-lg font-bold text-ts-krem">Media Kit &amp; Foto Katalog Polos</h3>
            <p className="text-xs text-ts-muted max-w-lg">
              Semua mitra berhak atas folder Google Drive berisi mockup apparel resolusi tinggi tanpa watermark TeeStock siap upload.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock! Saya ingin meminta link Google Drive Media Kit foto katalog polos untuk materi dropship.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl bg-ts-hitam/20 hover:bg-ts-hitam/40 text-ts-krem border border-ts-border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            <Download className="w-4 h-4 text-ts-teal" />
            <span>Minta Akses Media Kit</span>
          </a>
        </div>
      </section>

      {/* ─── FAQ Kemitraan Accordion ───────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-mustard bg-ts-mustard/15 px-3 py-1 rounded-full border border-ts-mustard/30">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>TANYA JAWAB RESMI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-ts-krem">Pertanyaan Umum Seputar Kemitraan</h2>
        </div>

        <div className="space-y-3">
          {PARTNER_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-ts-border bg-ts-surface overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 min-h-[48px] cursor-pointer hover:bg-ts-hitam/20"
                >
                  <span className="font-bold text-xs sm:text-sm text-ts-krem">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-ts-muted transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-ts-terracotta' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-ts-muted leading-relaxed border-t border-ts-border/50 pt-3 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Form Pendaftaran Mitra ─────────────────────────── */}
      <section id="daftar-mitra" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border shadow-glass-card shadow-glass-inset space-y-6">
          <div className="border-b border-ts-border pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-ts-krem">Formulir Pengajuan Akun Mitra</h3>
            </div>
            <p className="text-xs text-ts-muted mt-1">
              Pendaftaran akan dikurasi langsung oleh tim TeeStock. Akun aktif dalam 1x24 jam.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="p-6 rounded-2xl bg-ts-green/15 border border-ts-green/30 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-ts-krem">Pengajuan Berhasil Dikirim!</h4>
              <p className="text-xs text-ts-muted leading-relaxed">
                Tim admin TeeStock akan meninjau data tokomu dan mengaktifkan tier harga mitra dalam 1x24 jam.
              </p>
              <div className="pt-2">
                <a
                  href={waApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-ts-green hover:bg-ts-green/90 text-zinc-950 text-xs font-bold shadow-md transition-all cursor-pointer min-h-[48px]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konfirmasi Cepat via WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="partnerFullName"
                  label="Nama Lengkap"
                  placeholder="Contoh: Budi Santoso"
                  value={formFullName}
                  error={partnerFormErrors.fullName}
                  onChange={(e) => {
                    setFormFullName(e.target.value);
                    if (partnerFormErrors.fullName) setPartnerFormErrors(prev => ({ ...prev, fullName: null }));
                  }}
                  required
                />
                <Input
                  id="partnerPhone"
                  label="Nomor WhatsApp"
                  placeholder="0812-xxxx-xxxx"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={formPhone}
                  error={partnerFormErrors.phone}
                  onChange={(e) => {
                    setFormPhone(e.target.value);
                    if (partnerFormErrors.phone) setPartnerFormErrors(prev => ({ ...prev, phone: null }));
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="partnerBrandName"
                  label="Nama Toko / Brand Kamu"
                  placeholder="Contoh: StreetVibe Cloth"
                  value={formBrandName}
                  error={partnerFormErrors.brandName}
                  onChange={(e) => {
                    setFormBrandName(e.target.value);
                    if (partnerFormErrors.brandName) setPartnerFormErrors(prev => ({ ...prev, brandName: null }));
                  }}
                  required
                />
                <Input
                  id="partnerCity"
                  label="Kota Asal Toko"
                  placeholder="Contoh: Jakarta / Surabaya"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="partnerChannelSelect" className="block text-xs font-bold text-ts-krem mb-1.5">
                  Channel Penjualan Utama
                </label>
                <select
                  id="partnerChannelSelect"
                  value={formChannel}
                  onChange={(e) => setFormChannel(e.target.value)}
                  className="w-full bg-ts-hitam border border-ts-border rounded-xl p-3 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta min-h-[44px]"
                >
                  <option value="Shopee & TikTok Shop">Shopee &amp; TikTok Shop</option>
                  <option value="Instagram & WhatsApp">Instagram &amp; WhatsApp</option>
                  <option value="Komunitas & Relasi">Komunitas &amp; Circle Terdekat</option>
                  <option value="Toko Fisik / Offline Store">Toko Fisik / Offline Store</option>
                  <option value="Baru Mau Mulai Belajar">Baru Mau Mulai Belajar</option>
                </select>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  size="md"
                  variant="glow"
                  icon={Send}
                  disabled={submitting}
                  className="flex-1 justify-center min-h-[48px] font-bold text-xs"
                >
                  {submitting ? 'Mengirim Data...' : 'KIRIM PENGAJUAN MITRA'}
                </Button>

                <a
                  href={waApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-ts-hitam/20 hover:bg-ts-hitam/40 text-ts-krem border border-ts-border text-xs font-bold transition-all cursor-pointer min-h-[48px]"
                >
                  <MessageSquare className="w-4 h-4 text-ts-green" />
                  <span>Daftar via WA</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

