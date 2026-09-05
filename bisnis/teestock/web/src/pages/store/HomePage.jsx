import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  ShoppingBag, 
  MessageSquare,
  Layers,
  ExternalLink,
  Tag,
  CheckCircle2,
  Star,
  Package,
  Truck,
  Zap,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { SERIES } from '../../constants/series';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function HomePage() {
  const { catalog } = useAdmin();
  const { storeSettings } = useStore();
  const featured = catalog.filter(p => (p.featured || p.status === 'active') && p.series !== 'blank').slice(0, 4);
  const blankProducts = catalog.filter(p => p.series === 'blank').slice(0, 4);

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
  const shopeeUrl = storeSettings?.shopeeUrl || 'https://shopee.co.id';

  // Batch 1 Trilogy Products from catalog
  const batch1Skus = ['TS-PRO-001', 'TS-KOM-001', 'TS-LOK-001'];
  const batch1Products = batch1Skus.map(sku => catalog.find(p => p.sku === sku)).filter(Boolean);

  const heroProduct = batch1Products[0] || featured[0];
  const sideProducts = batch1Products.slice(1);

  // Ticker items
  const tickerItems = [
    { icon: ShieldCheck, text: "100% NSA Original Softstyle 30s", color: "text-ts-green" },
    { icon: Flame, text: "Double Heat Press 155°C Anti-Pecah", color: "text-ts-mustard" },
    { icon: Sparkles, text: "DTF HD Raster Super Halus & Lentur", color: "text-ts-terracotta" },
    { icon: Layers, text: "Tubular Knit Tanpa Jahitan Samping", color: "text-teal-400" },
    { icon: Zap, text: "Produksi Harian Kirim Cepat H+1", color: "text-amber-400" },
    { icon: MessageSquare, text: "Direct WhatsApp Order (0% Fee Transaksi)", color: "text-emerald-400" },
    { icon: Tag, text: "Harga Sweet Spot Launching Rp 99.000", color: "text-rose-400" },
  ];

  return (
    <div className="relative min-h-screen space-y-20 sm:space-y-28 pb-24 overflow-hidden">
      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] bg-gradient-to-b from-ts-terracotta/20 via-ts-mustard/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-ts-teal/15 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-dot-grid opacity-60" />
      </div>

      {/* 1. HERO SECTION (21st.dev High-Impact Design) */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Floating Release Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl shadow-glass-inset text-xs font-semibold text-ts-krem animate-in fade-in duration-500 hover:border-ts-terracotta/50 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-ts-terracotta animate-pulse" />
          <span className="font-mono text-[11px] text-ts-mustard font-bold uppercase tracking-wider">OFFICIAL DROP</span>
          <span className="text-white/20">•</span>
          <span className="text-ts-kremMuted">Distro POD &amp; Kaos Polos NSA Resmi</span>
          <ArrowRight className="w-3.5 h-3.5 text-ts-kremMuted ml-0.5" />
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Identitas, Profesi &amp; Passion <br />
            <span className="bg-gradient-to-r from-ts-terracotta via-[#ECC369] to-ts-teal bg-clip-text text-transparent drop-shadow-sm">
              Dalam Sehelai Kaos Premium.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-ts-kremMuted max-w-2xl mx-auto leading-relaxed font-normal">
            Streetwear otentik menggunakan bahan garmen resmi <strong className="text-white font-semibold">New States Apparel (NSA) Softstyle 30s</strong> impor berkualitas, berpadu sablon DTF HD Raster lentur, lembut, dan tanpa jahitan samping.
          </p>
        </div>

        {/* Hero CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link to="/katalog">
            <Button size="lg" variant="glow" icon={ShoppingBag} className="px-6 py-3 text-sm sm:text-base">
              Katalog Desain Grafis
            </Button>
          </Link>
          <Link to="/katalog?series=blank">
            <Button size="lg" variant="secondary" icon={Package} className="px-6 py-3 text-sm sm:text-base">
              Beli Kaos Polos NSA
            </Button>
          </Link>
          {shopeeUrl && (
            <a href={shopeeUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" icon={ExternalLink} className="px-5 py-3 text-sm sm:text-base border-[#EE4D2D]/40 text-[#FF7E61] hover:bg-[#EE4D2D]/10 hover:border-[#EE4D2D]/60">
                Shopee Official Store
              </Button>
            </a>
          )}
        </div>

        {/* Micro Trust Stats */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-ts-muted">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-ts-green" />
            <span>100% NSA Original Import</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-ts-mustard" />
            <span>Suhu Press Presisi 155°C</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-ts-terracotta" />
            <span>Tanpa Jahitan Samping (Built-Up)</span>
          </div>
        </div>
      </section>

      {/* 2. INFINITE TICKER MARQUEE (21st.dev Style) */}
      <div className="relative w-full overflow-hidden border-y border-white/[0.08] bg-white/[0.02] backdrop-blur-md py-3.5">
        <div className="flex w-max animate-marquee space-x-8 items-center">
          {[...tickerItems, ...tickerItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-ts-krem tracking-wide whitespace-nowrap">
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.text}</span>
                <span className="text-white/20 ml-6">•</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. BATCH 1 TRILOGY SHOWCASE: 21ST.DEV ASYMMETRIC BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-mustard bg-ts-mustard/15 px-3 py-1 rounded-full border border-ts-mustard/30 mb-2.5">
              <Tag className="w-3.5 h-3.5" />
              <span>LAUNCHING BATCH 1 TERPILIH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trilogi Peluncuran Perdana TeeStock
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1.5 max-w-xl leading-relaxed">
              Tiga desain rilisan pertama dari hasil scoring market matrix. Tersedia di atas bahan garmen 100% NSA Softstyle 30s tubular.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={shopeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white shadow-md border border-white/20 transition-all active:scale-95"
            >
              <span>Klaim Promo Shopee Rp 99k</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Bento Card 1 (Large Featured - 7 Cols) */}
          {heroProduct && (
            <div className="lg:col-span-7 bg-ts-surface/70 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-ts-terracotta/50 transition-all duration-300 shadow-glass-card shadow-glass-inset">
              <div className="absolute top-0 right-0 w-96 h-96 bg-ts-terracotta/10 rounded-full blur-3xl -z-10" />
              
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/[0.08] text-white border border-white/10">
                    {heroProduct.sku}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30 uppercase">
                    {heroProduct.niche || 'Signature Drop'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-ts-muted block font-mono">Special Price</span>
                  <span className="font-mono text-lg font-black text-ts-green">
                    {formatRupiah(heroProduct.priceRetail || 99000)}
                  </span>
                </div>
              </div>

              {/* Product Image & Showcase */}
              <div className="aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-ts-hitam/60 border border-white/[0.06] relative my-4 flex items-center justify-center group-hover:border-white/20 transition-all">
                <img
                  src={heroProduct.filePath || heroProduct.file_path}
                  alt={heroProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-ts-hitam/85 backdrop-blur-md border border-white/15 text-xs text-ts-krem flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-ts-green" />
                  <span>Katalog NSA Softstyle 30s Original</span>
                </div>
              </div>

              {/* Bottom Details & CTAs */}
              <div className="pt-2 space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-ts-terracotta transition-colors">
                    {heroProduct.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 line-clamp-2 leading-relaxed">
                    {heroProduct.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs text-ts-muted">
                    <span>Katun 30s</span>
                    <span>•</span>
                    <span>Tubular Knit</span>
                    <span>•</span>
                    <span>Sablon DTF Raster</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/produk/${heroProduct.sku}`}>
                      <Button size="md" variant="primary" icon={ArrowRight}>
                        Lihat &amp; Pesan
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bento Right Column (5 Cols) - 2 Smaller Cards + 1 Spec Card */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {sideProducts.map((p) => (
              <div
                key={p.sku}
                className="bg-ts-surface/70 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-center group hover:border-ts-terracotta/40 transition-all shadow-glass-card shadow-glass-inset"
              >
                <div className="w-full sm:w-36 h-36 rounded-2xl bg-ts-hitam/60 border border-white/[0.06] overflow-hidden shrink-0 relative">
                  <img
                    src={p.filePath || p.file_path}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-ts-hitam/80 text-white border border-white/10">
                    {p.sku}
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-2 w-full">
                  <span className="text-[10px] font-bold text-ts-mustard uppercase tracking-wider block">
                    {p.niche}
                  </span>
                  <h4 className="text-sm sm:text-base font-extrabold text-white group-hover:text-ts-terracotta transition-colors truncate">
                    {p.name}
                  </h4>
                  <p className="text-xs text-ts-kremMuted line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-sm font-extrabold text-ts-green">
                      {formatRupiah(p.priceRetail || 99000)}
                    </span>
                    <Link to={`/produk/${p.sku}`}>
                      <Button size="sm" variant="secondary" icon={ArrowRight}>
                        Pesan
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Spec & Direct Order Card */}
            <div className="bg-gradient-to-br from-ts-surface/90 to-[#1F1B17] border border-white/[0.1] rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-glass-inset">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-ts-teal/20 text-ts-teal flex items-center justify-center border border-ts-teal/30 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Standar Garmen Resmi NSA 100%</h5>
                    <p className="text-[11px] text-ts-kremMuted">Bahan adem, lembut, tanpa jahitan samping (built-up).</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock! Saya ingin tanya atau order kaos Batch 1 langsung via WhatsApp.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-950 bg-[#25D366] hover:bg-[#20ba59] shadow-md border border-white/20 transition-all active:scale-98"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat WhatsApp Cepat (0% Fee)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KAOS POLOS NSA ORIGINAL SHOWCASE (Bento Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-teal bg-ts-teal/15 px-3 py-1 rounded-full border border-ts-teal/30 mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>ORIGINAL BLANK APPAREL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Koleksi Kaos Polos New States Apparel (NSA)
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 max-w-xl">
              Tersedia untuk kebutuhan harian, seragam komunitas, sabloner, dan brand fashion lokal.
            </p>
          </div>

          <Link
            to="/katalog?series=blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] text-ts-krem border border-white/[0.08] hover:border-ts-teal/50 transition-all"
          >
            <span>Semua 12 Model NSA</span>
            <ArrowRight className="w-3.5 h-3.5 text-ts-teal" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {blankProducts.map((p) => {
            const colorCount = p.colors ? p.colors.split(',').length : 12;
            return (
              <Link
                key={p.sku}
                to={`/produk/${p.sku}`}
                className="group bg-ts-surface/75 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden hover:border-ts-teal/50 transition-all flex flex-col shadow-glass-card shadow-glass-inset"
              >
                <div className="aspect-square bg-ts-hitam/70 overflow-hidden relative">
                  <img
                    src={p.filePath || p.file_path}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ts-hitam/90 text-white border border-white/10">
                    {p.sku}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-ts-teal/30 text-teal-200 border border-ts-teal/40">
                    {colorCount} Warna
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-ts-teal uppercase tracking-wider block">
                      {p.niche || 'Kaos Polos NSA'}
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-ts-teal transition-colors mt-0.5 truncate">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-ts-kremMuted line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div>
                      <div className="text-[10px] text-ts-muted">Harga Satuan</div>
                      <span className="font-mono text-sm font-extrabold text-ts-green">
                        {formatRupiah(p.priceRetail || p.price_retail || 35000)}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-white group-hover:bg-ts-teal group-hover:text-zinc-950 transition-colors">
                      Pesan &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. 9 SERIES TEMATIK TEESTOCK (21st.dev Style Bento Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            9 Series Kurasi Distro TeeStock
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted">
            Setiap desain dikurasi secara tematik sesuai perjalanan hidup, profesi, dan kegemaran kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {SERIES.map((s) => (
            <Link
              key={s.id}
              to={`/katalog?series=${s.id}`}
              className="p-5 sm:p-6 rounded-2xl bg-ts-surface/70 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-glass-card shadow-glass-inset"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${s.badgeBg}`}>
                    SERIES #{s.code}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ts-muted group-hover:text-ts-terracotta group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-ts-terracotta transition-colors">
                  {s.name}
                </h3>
                <p className="text-xs text-ts-mustard font-medium mt-1">{s.tagline}</p>
              </div>
              <p className="text-[11px] text-ts-kremMuted mt-4 line-clamp-2 leading-relaxed">
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. STANDAR KUALITAS DISTRO (Modern Technical Specs) */}
      <section className="relative bg-white/[0.02] border-y border-white/[0.08] py-16 sm:py-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Standar Workshop &amp; Kualitas Tanpa Kompromi
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted">
              Setiap helai kaos diproses dengan standar distro profesional demi kenyamanan dan daya tahan jangka panjang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ts-surface/80 border border-white/[0.08] rounded-3xl p-6 sm:p-7 space-y-3 shadow-glass-card shadow-glass-inset hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center border border-ts-terracotta/30">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">100% NSA Softstyle 30s Original</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Menggunakan bahan New States Apparel Softstyle 30s impor resmi. Jahitan tubular tanpa sambungan samping yang sejuk, pas di badan, dan tidak mudah melar.
              </p>
            </div>

            <div className="bg-ts-surface/80 border border-white/[0.08] rounded-3xl p-6 sm:p-7 space-y-3 shadow-glass-card shadow-glass-inset hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center border border-ts-mustard/30">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Suhu Press Terkontrol 155°C</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Teknik double heat-press pada suhu presisi 155°C memastikan lem serbuk DTF menyatu ke dalam pori-pori katun sehingga sablon tidak retak meski dicuci berulang kali.
              </p>
            </div>

            <div className="bg-ts-surface/80 border border-white/[0.08] rounded-3xl p-6 sm:p-7 space-y-3 shadow-glass-card shadow-glass-inset hover:border-white/20 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-ts-teal/15 text-ts-teal flex items-center justify-center border border-ts-teal/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">QC Teliti &amp; Polymailer Distro</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Setiap kaos melewati inspeksi visual, pembersihan sisa benang, pelipatan presisi, polymailer tebal tahan hujan, dan disertai stiker hologram eksklusif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SOCIAL PROOF & COMMUNITY REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ts-mustard bg-ts-mustard/15 px-3 py-1 rounded-full border border-ts-mustard/30">
            <Star className="w-3.5 h-3.5 fill-ts-mustard text-ts-mustard" />
            <span>RATING 4.9 / 5.0 • 150+ PESANAN TERKIRIM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Ulasan Komunitas &amp; Pembeli
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted">
            Transparansi kepuasan pelanggan retail, pembeli kaos polos NSA, hingga komunitas custom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-ts-surface/70 backdrop-blur-xl border border-white/[0.08] flex flex-col justify-between space-y-4 shadow-glass-card shadow-glass-inset">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-ts-mustard">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-ts-krem leading-relaxed italic">
                &ldquo;Bahan NSA Softstyle 30s-nya terbukti 100% original, adem banget tanpa jahitan samping. Sablon DTF-nya lentur dan detail warna raster tajam, dicuci 5x tidak pecah sama sekali.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <strong className="block text-white">Dimas Pratama</strong>
                <span className="text-[10px] text-ts-muted">Order: TS-PRO-001 (Size L)</span>
              </div>
              <span className="text-[10px] font-bold text-ts-green bg-ts-green/15 px-2 py-0.5 rounded-full border border-ts-green/30">
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface/70 backdrop-blur-xl border border-white/[0.08] flex flex-col justify-between space-y-4 shadow-glass-card shadow-glass-inset">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-ts-mustard">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-ts-krem leading-relaxed italic">
                &ldquo;Order kaos polos NSA Heavyweight 24s untuk sample clothing line. Packing polymailer tebal, pengiriman kilat H+1 langsung sampai. Mantap buat langganan blank apparel!&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <strong className="block text-white">Rian Hidayat</strong>
                <span className="text-[10px] text-ts-muted">Order: NSA 7200 Heavyweight</span>
              </div>
              <span className="text-[10px] font-bold text-ts-green bg-ts-green/15 px-2 py-0.5 rounded-full border border-ts-green/30">
                Brand Owner
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-ts-surface/70 backdrop-blur-xl border border-white/[0.08] flex flex-col justify-between space-y-4 shadow-glass-card shadow-glass-inset">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-ts-mustard">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs text-ts-krem leading-relaxed italic">
                &ldquo;Kalkulator ukurannya akurat banget. TB 172 BB 68 disarankan size L regular dan beneran pas jatuh bahunya. Admin WA fast respons waktu tanya ketersediaan warna Sport Grey.&rdquo;
              </p>
            </div>
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <strong className="block text-white">Andi Setiawan</strong>
                <span className="text-[10px] text-ts-muted">Order: TS-LOK-001 (Size L)</span>
              </div>
              <span className="text-[10px] font-bold text-ts-green bg-ts-green/15 px-2 py-0.5 rounded-full border border-ts-green/30">
                Verified Buyer
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
