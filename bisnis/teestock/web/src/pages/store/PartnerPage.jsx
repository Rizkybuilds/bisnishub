import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Package, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Calculator, 
  Download, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Send,
  Layers,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { supabase } from '../../services/supabase';
import { SEOHead } from '../../components/common/SEOHead';

export function PartnerPage() {
  const { user, profile, isPartner, openAuthModal } = useAuth();
  const { storeSettings } = useStore();
  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

  // Interactive Margin Calculator States
  const [targetPcs, setTargetPcs] = useState(50);
  const [sellingPrice, setSellingPrice] = useState(99000);
  const [partnerTier, setPartnerTier] = useState('dropship'); // 'dropship' (Rp 75k) or 'reseller' (Rp 65k)

  const costPerPcs = partnerTier === 'reseller' ? 65000 : 75000;
  const marginPerPcs = Math.max(0, sellingPrice - costPerPcs);
  const monthlyProfit = marginPerPcs * targetPcs;
  const monthlyRevenue = sellingPrice * targetPcs;

  // Partner Registration Form States
  const [formFullName, setFormFullName] = useState(profile?.full_name || '');
  const [formBrandName, setFormBrandName] = useState('');
  const [formPhone, setFormPhone] = useState(profile?.phone || '');
  const [formCity, setFormCity] = useState(profile?.city || '');
  const [formChannel, setFormChannel] = useState('Shopee & TikTok Shop');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!formFullName.trim() || !formPhone.trim() || !formBrandName.trim()) {
      alert("Mohon lengkapi nama, nomor WhatsApp, dan nama toko/brand.");
      return;
    }

    setSubmitting(true);

    try {
      if (user) {
        await supabase.from('ts_partner_applications').insert([
          {
            user_id: user.id,
            full_name: formFullName.trim(),
            brand_name: formBrandName.trim(),
            phone: formPhone.trim(),
            city: formCity.trim(),
            sales_channel: formChannel,
            target_tier: partnerTier,
            status: 'pending',
          }
        ]);

        await supabase.from('ts_user_profiles').update({
          partner_status: 'pending',
          partner_tier: partnerTier
        }).eq('id', user.id);
      }
    } catch (err) {
      console.warn('Partner app submit notice:', err);
    }

    setSubmitting(false);
    setSubmittedSuccess(true);
  };

  const getWaApplyUrl = () => {
    const text = encodeURIComponent(
      `Halo TeeStock! Saya ingin mendaftar sebagai Mitra ${partnerTier === 'reseller' ? 'Reseller' : 'Dropshipper'}:\nNama: ${formFullName || 'Mitra'}\nNama Toko/Brand: ${formBrandName || '-'}\nNo. WhatsApp: ${formPhone || '-'}\nKota: ${formCity || '-'}\nChannel Penjualan: ${formChannel}\nMohon info aktivasi akun mitra dan akses media kit. Terima kasih!`
    );
    return `https://wa.me/${cleanWhatsapp}?text=${text}`;
  };

  return (
    <div className="min-h-screen pb-24 space-y-20 sm:space-y-28">
      <SEOHead
        title="Peluang Usaha Dropship & Reseller Kaos Distro White-Label | TeeStock"
        description="Mulai bisnis brand clothing kamu sendiri tanpa modal stok dan mesin. HPP mulai Rp 65.000/pcs, 100% bahan New States Apparel (NSA) 24s/30s asli, sablon DTF HD, pengiriman white-label atas nama tokomu."
        keywords={["dropship kaos distro", "reseller kaos distro", "peluang usaha apparel", "supplier kaos nsa", "sablon dtf satuan"]}
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

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Mulai Bisnis Apparel Distro <br />
          <span className="bg-gradient-to-r from-ts-mustard via-[#F5D77F] to-ts-terracotta bg-clip-text text-transparent">
            Tanpa Modal Stok &amp; Mesin Sablon.
          </span>
        </h1>

        <p className="text-xs sm:text-sm lg:text-base text-ts-kremMuted max-w-2xl mx-auto leading-relaxed">
          Fokuslah membangun toko dan menjaring pembeli di Shopee, TikTok, atau Instagram. Seluruh urusan garmen New States Apparel, sablon DTF HD 155°C, hingga packing polymailer atas nama brand kamu — biarkan TeeStock yang tangani.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a href="#daftar-mitra">
            <Button size="lg" variant="glow" icon={ArrowRight}>
              Daftar Jadi Mitra Sekarang
            </Button>
          </a>
          <a href="#kalkulator-profit">
            <Button size="lg" variant="secondary" icon={Calculator}>
              Hitung Simulasi Profit
            </Button>
          </a>
        </div>

        {/* 3 Quick Benefit Metrics */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-left">
          <div className="p-5 rounded-3xl bg-ts-surface/75 border border-white/[0.08] shadow-glass-card">
            <div className="w-10 h-10 rounded-2xl bg-ts-green/15 text-ts-green flex items-center justify-center border border-ts-green/30 mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Margin Rp 20k - Rp 45k/pcs</h3>
            <p className="text-xs text-ts-kremMuted mt-1">
              Harga modal mitra mulai Rp 74.000. Kamu bebas menentukan harga jual eceran tokomu sendiri.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-ts-surface/75 border border-white/[0.08] shadow-glass-card">
            <div className="w-10 h-10 rounded-2xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center border border-ts-mustard/30 mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">100% Pengiriman White-Label</h3>
            <p className="text-xs text-ts-kremMuted mt-1">
              Label pengiriman menggunakan nama toko dan no HP kamu. Bebas atribut TeeStock sehingga customer tetap setia ke kamu.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-ts-surface/75 border border-white/[0.08] shadow-glass-card">
            <div className="w-10 h-10 rounded-2xl bg-ts-teal/15 text-ts-teal flex items-center justify-center border border-ts-teal/30 mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Tanpa Modal &amp; Minimum Order</h3>
            <p className="text-xs text-ts-kremMuted mt-1">
              Order 1 pcs tetap kami proses cepat H+1. Tidak ada risiko menimbun stok mati yang tidak laku.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Interactive Margin Calculator ─────────────────── */}
      <section id="kalkulator-profit" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-ts-surface/90 via-[#1D1A17] to-ts-surface border border-ts-mustard/30 shadow-glass-card shadow-glass-inset space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ts-mustard/15 text-ts-mustard text-xs font-mono font-bold">
              <Calculator className="w-3.5 h-3.5" />
              <span>SIMULASI PENGHASILAN BULANAN</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Berapa Potensi Keuntungan Bersih Kamu?
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted">
              Sesuaikan target penjualan dan harga jual tokomu untuk melihat potensi cash flow yang dihasilkan.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tier Switcher */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">Pilihan Tier Kemitraan:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPartnerTier('dropship')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      partnerTier === 'dropship'
                        ? 'bg-ts-mustard/20 border-ts-mustard text-white shadow-glow-mustard'
                        : 'bg-white/[0.03] border-white/[0.08] text-ts-kremMuted hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">Mitra Dropshipper</div>
                    <div className="font-mono text-sm font-black text-ts-mustard mt-0.5">Rp 75.000 / pcs</div>
                    <div className="text-[10px] text-ts-muted mt-1">Tanpa deposit awal, langsung jualan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPartnerTier('reseller')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      partnerTier === 'reseller'
                        ? 'bg-ts-green/20 border-ts-green text-white shadow-glow-teal'
                        : 'bg-white/[0.03] border-white/[0.08] text-ts-kremMuted hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">Mitra Reseller VIP</div>
                    <div className="font-mono text-sm font-black text-ts-green mt-0.5">Rp 65.000 / pcs</div>
                    <div className="text-[10px] text-ts-muted mt-1">Grosir &ge; 12 pcs / bulan</div>
                  </button>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white">Target Penjualan Bulanan:</span>
                  <span className="font-mono text-base text-ts-mustard px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10">
                    {targetPcs} Kaos / Bulan
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={targetPcs}
                  onChange={(e) => setTargetPcs(Number(e.target.value))}
                  className="w-full accent-ts-mustard cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ts-muted font-mono">
                  <span>10 pcs</span>
                  <span>150 pcs</span>
                  <span>300 pcs</span>
                </div>
              </div>

              {/* Selling Price Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white">Harga Jual Ritel Toko Kamu:</span>
                  <span className="font-mono text-base text-white px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10">
                    {formatRupiah(sellingPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="99000"
                  max="149000"
                  step="5000"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full accent-ts-terracotta cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-ts-muted font-mono">
                  <span>Rp 99.000</span>
                  <span>Rp 125.000</span>
                  <span>Rp 149.000</span>
                </div>
              </div>
            </div>

            {/* Live Result Card (5 Cols) */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-ts-surface border border-white/[0.12] space-y-5 shadow-2xl">
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-[11px] font-mono text-ts-muted block uppercase">Estimasi Laba Bersih</span>
                <div className="font-mono text-3xl sm:text-4xl font-black text-ts-green mt-1">
                  {formatRupiah(monthlyProfit)}
                </div>
                <span className="text-[11px] text-ts-kremMuted mt-0.5 block">per bulan masuk ke kantong kamu</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-ts-kremMuted">
                  <span>Margin Bersih per Kaos:</span>
                  <span className="font-mono text-white font-bold">{formatRupiah(marginPerPcs)}</span>
                </div>
                <div className="flex justify-between text-ts-kremMuted">
                  <span>Estimasi Omset Toko Kamu:</span>
                  <span className="font-mono text-white font-bold">{formatRupiah(monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between text-ts-kremMuted">
                  <span>Modal Stok Dibutuhkan:</span>
                  <span className="font-mono text-ts-green font-bold">Rp 0 (Tanpa Modal)</span>
                </div>
              </div>

              <a
                href="#daftar-mitra"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ts-mustard hover:bg-ts-mustard/90 text-zinc-950 font-extrabold text-xs shadow-glow-mustard transition-all active:scale-95"
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
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bagaimana Cara Kerjanya?
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted">
            Alur praktis 4 langkah jualan apparel distro tanpa perlu pusing mikirin alat sablon dan packing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-3xl bg-ts-surface/75 border border-white/[0.08] space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-white/15">01</span>
            <h3 className="text-sm font-bold text-white">Upload Foto Produk</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Unduh media kit mockup resolusi tinggi kami dan unggah ke tokomu di Shopee, TikTok Shop, atau IG.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface/75 border border-white/[0.08] space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-white/15">02</span>
            <h3 className="text-sm font-bold text-white">Terima Pesanan</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Customer membeli dan membayar ke rekening/marketplace kamu dengan harga ritel yang kamu tentukan.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface/75 border border-white/[0.08] space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-white/15">03</span>
            <h3 className="text-sm font-bold text-white">Pesan ke TeeStock</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Buka website TeeStock, masukkan pesanan pembeli dengan harga modal mitra, dan centang opsi dropship.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface/75 border border-white/[0.08] space-y-3 relative shadow-glass-card">
            <span className="font-mono text-3xl font-black text-white/15">04</span>
            <h3 className="text-sm font-bold text-white">Kami Kirim ke Customer</h3>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Kami cetak DTF HD, press suhu 155°C, pack polymailer rapi, dan kirim atas nama tokomu. Selesai!
            </p>
          </div>
        </div>
      </section>

      {/* ─── Media Kit & Aset Download Teaser ───────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-teal bg-ts-teal/15 px-2.5 py-0.5 rounded-full border border-ts-teal/30 mb-1">
              <Download className="w-3 h-3" />
              <span>ASET PROMOSI RESMI</span>
            </div>
            <h3 className="text-lg font-bold text-white">Media Kit &amp; Foto Katalog Polos</h3>
            <p className="text-xs text-ts-kremMuted max-w-lg">
              Semua mitra berhak atas folder Google Drive berisi mockup apparel resolusi tinggi tanpa watermark TeeStock siap upload.
            </p>
          </div>

          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock! Saya ingin meminta link Google Drive Media Kit foto katalog polos untuk materi dropship.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-ts-teal" />
            <span>Minta Akses Media Kit</span>
          </a>
        </div>
      </section>

      {/* ─── Form Pendaftaran Mitra ─────────────────────────── */}
      <section id="daftar-mitra" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="p-6 sm:p-8 rounded-3xl bg-ts-surface/85 backdrop-blur-xl border border-white/[0.1] shadow-glass-card shadow-glass-inset space-y-6">
          <div className="border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Formulir Pengajuan Akun Mitra</h3>
            </div>
            <p className="text-xs text-ts-kremMuted mt-1">
              Pendaftaran akan dikurasi manual oleh tim TeeStock untuk menjaga standar kualitas kemitraan.
            </p>
          </div>

          {submittedSuccess ? (
            <div className="p-6 rounded-2xl bg-ts-green/15 border border-ts-green/30 text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Pengajuan Berhasil Dikirim!</h4>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Tim admin TeeStock akan meninjau data tokomu dan mengaktifkan tier harga mitra dalam 1x24 jam.
              </p>
              <div className="pt-2">
                <a
                  href={getWaApplyUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ts-green hover:bg-ts-green/90 text-zinc-950 text-xs font-bold shadow-md transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konfirmasi Cepat via WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Lengkap"
                  placeholder="Contoh: Budi Santoso"
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  required
                />
                <Input
                  label="Nomor WhatsApp"
                  placeholder="0812-xxxx-xxxx"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nama Toko / Brand Kamu"
                  placeholder="Contoh: StreetVibe Cloth"
                  value={formBrandName}
                  onChange={(e) => setFormBrandName(e.target.value)}
                  required
                />
                <Input
                  label="Kota Asal Toko"
                  placeholder="Contoh: Jakarta / Surabaya"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">Channel Penjualan Utama</label>
                <select
                  value={formChannel}
                  onChange={(e) => setFormChannel(e.target.value)}
                  className="w-full bg-ts-hitam/80 border border-white/[0.1] rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-ts-terracotta"
                >
                  <option value="Shopee & TikTok Shop">Shopee &amp; TikTok Shop</option>
                  <option value="Instagram & WhatsApp">Instagram &amp; WhatsApp</option>
                  <option value="Komunitas & Relasi">Komunitas &amp; Circle Terdekat</option>
                  <option value="Toko Fisik / Distro Offline">Toko Fisik / Distro Offline</option>
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
                  className="flex-1 justify-center"
                >
                  {submitting ? 'Mengirim Data...' : 'Kirim Formulir Pengajuan'}
                </Button>

                <a
                  href={getWaApplyUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-bold transition-all"
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
