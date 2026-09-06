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
  Cpu,
  Palette,
  Users,
  Compass,
  Code2,
  HeartHandshake
} from 'lucide-react';
import { SERIES } from '../../constants/series';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { NewsletterCapture } from '../../components/store/NewsletterCapture';
import { SEOHead } from '../../components/common/SEOHead';

export function HomePage() {
  const { catalog } = useAdmin();
  const { storeSettings } = useStore();

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
  const shopeeUrl = storeSettings?.shopeeUrl || 'https://shopee.co.id';

  // Drop #01 "Identity" - 6 Hero Designs
  const drop01Skus = [
    'TS-PRO-001', 'TS-PRO-002', 
    'TS-KOM-001', 'TS-KOM-002', 
    'TS-LOK-001', 'TS-LOK-002'
  ];
  
  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "TeeStock Apparel",
    "url": "https://teestock.vercel.app",
    "logo": "https://teestock.vercel.app/logo-teestock.svg",
    "description": "Brand apparel kurasi & studio sablon DTF cepat. Garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s original tanpa jahitan samping.",
    "priceRange": "Rp 37.000 - Rp 99.000",
    "currenciesAccepted": "IDR",
    "paymentAccepted": "Bank Transfer, QRIS, COD",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID"
    }
  };
  
  const drop01Products = drop01Skus
    .map(sku => catalog.find(p => p.sku === sku))
    .filter(Boolean);

  // Fallback to active non-blank products if specific SKUs not found
  const activeGraphicProducts = drop01Products.length >= 3 
    ? drop01Products 
    : catalog.filter(p => p.series !== 'blank' && p.status === 'active').slice(0, 6);

  const blankProducts = catalog.filter(p => p.series === 'blank').slice(0, 4);

  // Ticker items
  const tickerItems = [
    { icon: ShieldCheck, text: "100% NSA Original Softstyle 30s Impor", color: "text-ts-green" },
    { icon: Flame, text: "Double Heat Press 155°C Anti-Pecah", color: "text-ts-mustard" },
    { icon: Sparkles, text: "DTF HD Raster Super Halus & Lentur", color: "text-ts-terracotta" },
    { icon: Layers, text: "Tubular Knit Tanpa Jahitan Samping (Built-Up)", color: "text-teal-400" },
    { icon: Zap, text: "Produksi Mandiri Kirim Cepat H+1", color: "text-amber-400" },
    { icon: MessageSquare, text: "Direct WhatsApp Order (0% Fee Transaksi)", color: "text-emerald-400" },
    { icon: Tag, text: "Launch Sweet Spot Rp 89k - Rp 99k", color: "text-rose-400" },
  ];

  return (
    <div className="relative min-h-screen space-y-20 sm:space-y-28 pb-24 overflow-hidden">
      <SEOHead
        title="TeeStock Apparel | Curated Merch & Kaos NSA 24s Heavyweight Original"
        description="Brand apparel kurasi dan studio sablon DTF cepat. 100% garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s original tanpa jahitan samping. Beli ritel, custom satuan, atau kemitraan dropship."
        keywords={["kaos nsa 24s heavyweight", "kaos nsa softstyle 30s", "sablon dtf satuan", "kaos distro tech programmer", "dropship apparel distro"]}
        canonicalPath="/"
        schema={homeSchema}
      />
      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[500px] bg-gradient-to-b from-ts-terracotta/20 via-ts-mustard/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-24 right-10 w-72 h-72 bg-ts-teal/15 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-dot-grid opacity-60" />
      </div>

      {/* ====================================================================
          SECTION 1: HERO — THE HOOK (Above the fold)
          ==================================================================== */}
      <section className="relative pt-8 sm:pt-16 pb-6 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Floating Release Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl shadow-glass-inset text-xs font-semibold text-ts-krem animate-in fade-in duration-500 hover:border-ts-terracotta/50 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-ts-terracotta animate-pulse" />
          <span className="font-mono text-[11px] text-ts-mustard font-bold uppercase tracking-wider">DROP #01 "IDENTITY"</span>
          <span className="text-white/20">•</span>
          <span className="text-ts-kremMuted">Curated Apparel &amp; Merch House</span>
          <ArrowRight className="w-3.5 h-3.5 text-ts-kremMuted ml-0.5" />
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="space-y-5 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Wear Your Identity, <br />
            <span className="bg-gradient-to-r from-ts-terracotta via-[#ECC369] to-ts-teal bg-clip-text text-transparent drop-shadow-sm">
              Stock Your Story.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-ts-kremMuted max-w-2xl mx-auto leading-relaxed font-normal">
            Creative apparel house independen yang memadukan kurasi desain berkarakter kuat dengan garmen asli <strong className="text-white font-semibold">New States Apparel (NSA) Softstyle 30s</strong> tubular dan sablon DTF HD Raster lentur tahan cuci.
          </p>
        </div>

        {/* Dual Primary CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <a href="#live-drop">
            <Button size="lg" variant="glow" icon={Flame} className="px-6 py-3 text-sm sm:text-base">
              Lihat Drop #01 "Identity"
            </Button>
          </a>
          <Link to="/custom-order">
            <Button size="lg" variant="secondary" icon={Palette} className="px-6 py-3 text-sm sm:text-base border-white/20">
              TeeStock Studio (Custom Kaos)
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
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-ts-muted">
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

      {/* Infinite Ticker Marquee */}
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

      {/* ====================================================================
          SECTION 2: LIVE DROP — URGENCY + SCARCITY (Drop #01 "Identity")
          ==================================================================== */}
      <section id="live-drop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-mustard bg-ts-mustard/15 px-3 py-1 rounded-full border border-ts-mustard/30 mb-2.5">
              <Flame className="w-3.5 h-3.5 text-ts-terracotta" />
              <span>THE DROP MODEL • EDISI PERDANA</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Drop #01: "Identity" — 6 Desain Pilihan
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1.5 max-w-2xl leading-relaxed">
              Koleksi kapsul eksklusif mengangkat dunia software engineer, petualang alam bebas, dan kebanggaan kultural nusantara. Diproduksi mandiri di atas bahan katun New States Apparel 30s tubular.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/15 transition-all"
            >
              <span>Lihat Semua Katalog ({catalog.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-ts-terracotta" />
            </Link>
          </div>
        </div>

        {/* 6 Drop Designs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeGraphicProducts.map((p) => {
            const price = p.priceRetail || p.price_retail || 99000;
            return (
              <div
                key={p.sku}
                className="group bg-ts-surface/75 backdrop-blur-xl border border-white/[0.09] rounded-3xl overflow-hidden hover:border-ts-terracotta/50 transition-all duration-300 flex flex-col justify-between shadow-glass-card shadow-glass-inset"
              >
                {/* Product Card Header */}
                <div className="p-4 pb-0 flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/[0.06] text-white border border-white/10">
                    {p.sku}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ts-terracotta/15 text-ts-terracotta border border-ts-terracotta/30 uppercase tracking-wide">
                    {p.niche || 'Original'}
                  </span>
                </div>

                {/* Mockup Showcase */}
                <Link to={`/produk/${p.sku}`} className="p-4 block">
                  <div className="aspect-square rounded-2xl bg-ts-hitam/60 border border-white/[0.06] overflow-hidden relative group-hover:border-white/20 transition-all flex items-center justify-center">
                    <img
                      src={p.filePath || p.file_path}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-ts-hitam/80 backdrop-blur-md border border-white/10 text-[10px] text-ts-krem font-medium">
                      100% NSA Softstyle 30s
                    </span>
                  </div>
                </Link>

                {/* Details & Action */}
                <div className="px-5 pb-5 space-y-3.5">
                  <div>
                    <h3 className="text-base font-extrabold text-white group-hover:text-ts-terracotta transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <p className="text-xs text-ts-kremMuted mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div>
                      <span className="text-[10px] text-ts-muted block font-mono">Harga Launching</span>
                      <span className="font-mono text-base font-black text-ts-green">
                        {formatRupiah(price)}
                      </span>
                    </div>
                    <Link to={`/produk/${p.sku}`}>
                      <Button size="sm" variant="primary" icon={ArrowRight}>
                        Pesan Kaos
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Launch Promo Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-ts-terracotta/20 via-ts-mustard/15 to-transparent border border-ts-terracotta/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center shrink-0 border border-ts-terracotta/40">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white">
                Dapatkan Promo Sweet Spot Peluncuran Rp 99.000 + Bebas Ongkir
              </h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">
                Pesan langsung via Shopee Official Store untuk klaim voucher gratis ongkir ke seluruh Indonesia.
              </p>
            </div>
          </div>
          <a
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>Klaim di Shopee</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: DUAL PILLAR — BRAND ARCHITECTURE
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-teal bg-ts-teal/15 px-3 py-1 rounded-full border border-ts-teal/30">
            <Layers className="w-3.5 h-3.5" />
            <span>ARSITEKTUR DUA SAYAP TEESTOCK</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Satu Rumah, Dua Pilar Layanan
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            TeeStock beroperasi dengan dua pilar utama yang saling memperkuat: lini apparel siap pakai dan studio produksi merchandise kreatif.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: TeeStock Originals */}
          <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-ts-surface/80 via-[#1B1917] to-ts-surface border border-ts-terracotta/30 shadow-glass-card shadow-glass-inset relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-ts-terracotta/20 text-ts-terracotta border border-ts-terracotta/30 uppercase">
                  Pilar #01 • Lini Ritel B2C
                </span>
                <Flame className="w-6 h-6 text-ts-terracotta" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  TeeStock Originals
                </h3>
                <p className="text-xs sm:text-sm text-ts-mustard font-semibold mt-1">
                  Koleksi Ritel Desain In-House Siap Pakai
                </p>
              </div>

              <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
                Apparel berkarakter yang dirancang sendiri oleh tim internal dengan sistem rilis berkala (<em>The Drop Model</em>). Setiap desain memiliki identitas tajam dan diproduksi secara terbatas di atas katun premium New States Apparel.
              </p>

              <ul className="space-y-2 text-xs text-ts-krem pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-ts-terracotta shrink-0" />
                  <span>Sistem rilis berkala per edisi kapsul tematik</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-ts-terracotta shrink-0" />
                  <span>Pustaka 9 series kurasi (Tech, Outdoor, Local Pride, dsb.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-ts-terracotta shrink-0" />
                  <span>Jaminan bahan 100% NSA impor tanpa sambungan samping</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <Link to="/katalog">
                <Button size="md" variant="glow" icon={ArrowRight} className="w-full justify-center">
                  Jelajahi Koleksi Originals
                </Button>
              </Link>
            </div>
          </div>

          {/* Pillar 2: TeeStock Studio */}
          <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-ts-surface/80 via-[#171D1B] to-ts-surface border border-ts-teal/30 shadow-glass-card shadow-glass-inset relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-ts-teal/20 text-teal-300 border border-ts-teal/30 uppercase">
                  Pilar #02 • Layanan Kreatif &amp; Kemitraan B2B2C
                </span>
                <Palette className="w-6 h-6 text-ts-teal" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  TeeStock Studio
                </h3>
                <p className="text-xs sm:text-sm text-ts-teal font-semibold mt-1">
                  Custom Kaos, Creator Merch &amp; Mitra Dropship
                </p>
              </div>

              <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
                Solusi hulu-ke-hilir untuk pesanan kaos custom komunitas, kolaborasi merchandise resmi konten kreator/musisi dengan sistem bagi hasil, dan kemitraan dropship/reseller tanpa modal.
              </p>

              <ul className="space-y-2 text-xs text-ts-krem pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-ts-teal shrink-0" />
                  <span>Custom kaos satuan maupun lusinan (tanpa minimum order kaku)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-ts-teal shrink-0" />
                  <span>Official Creator Merch kolaboratif (Cetak, packing, kirim ditangani)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-ts-teal shrink-0" />
                  <span>Peluang dropship white-label dengan materi promosi siap pakai</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <Link to="/custom-order">
                <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center border-ts-teal/30 text-teal-300 hover:bg-ts-teal/20">
                  Konsultasi TeeStock Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kaos Polos NSA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-ts-teal bg-ts-teal/15 px-3 py-1 rounded-full border border-ts-teal/30 mb-2">
              <Package className="w-3.5 h-3.5" />
              <span>SUPPLY CHAIN TERPERCAYA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Koleksi Kaos Polos New States Apparel (NSA)
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 max-w-xl">
              Tersedia eceran dan lusinan untuk kebutuhan harian, seragam komunitas, sabloner, dan brand fashion lokal.
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

      {/* ====================================================================
          SECTION 4: TRUST BUILDER — SOCIAL PROOF & TECHNICAL EXCELLENCE
          ==================================================================== */}
      <section className="relative bg-white/[0.02] border-y border-white/[0.08] py-16 sm:py-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Trust Specs */}
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
                Setiap kaos melewati inspeksi visual, pembersihan sisa benang, pelipatan presisi, polymailer tebal tahan hujan, dan disertai stiker koleksi bertema desain.
              </p>
            </div>
          </div>

          {/* Social Proof Reviews */}
          <div className="pt-6 space-y-6">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-ts-mustard bg-ts-mustard/15 px-3 py-1 rounded-full border border-ts-mustard/30">
                <Star className="w-3.5 h-3.5 fill-ts-mustard text-ts-mustard" />
                <span>RATING 4.9 / 5.0 • 150+ PESANAN TERKIRIM</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Kata Mereka yang Telah Memakai TeeStock
              </h3>
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
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: BRAND STORY — EMOTIONAL HOOK & POSITIONING
          ==================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-ts-surface/90 via-[#1C1A18] to-ts-surface border border-white/[0.1] shadow-glass-card shadow-glass-inset relative overflow-hidden space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-ts-krem text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
            <span>CERITA DI BALIK TEESTOCK</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Bukan Toserba Sablon Murahan. <br />
            Bukan Distro Eksklusif Sempit.
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            <p>
              Kami memulai TeeStock dari kegelisahan sederhana: pasar apparel sering kali terbagi dua kubu ekstrem. Di satu sisi, toko sablon serba ada yang menghasilkan kaos kaku dan tipografi murahan. Di sisi lain, distro eksklusif yang membatasi pilihan dengan harga yang tidak masuk akal.
            </p>
            <p>
              <strong className="text-white">TeeStock lahir sebagai titik temu.</strong> Kami mengkurasi ide, hobi, dan fase hidup nyata ke dalam desain grafis berkarakter tinggi — lalu mencetaknya di atas garmen katun impor resmi New States Apparel dengan ketelitian suhu press 155°C.
            </p>
            <p className="italic text-ts-krem">
              "Bagi kami, sehelai kaos bukan cuma penutup tubuh. Ia adalah pernyataan identitas, memori perjalanan, dan cerita yang kamu bawa setiap hari."
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-ts-terracotta/20 text-ts-terracotta font-bold flex items-center justify-center font-mono">
                TS
              </div>
              <div>
                <span className="block text-xs font-bold text-white">TeeStock Creative Team</span>
                <span className="block text-[10px] text-ts-muted">Tangerang / Jakarta • Indonesia</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock! Saya suka konsep brandnya, ingin konsultasi kaos custom.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-ts-green" />
              <span>Sapa Tim Kami di WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: LEAD CAPTURE & VIP DROP ALERTS (Newsletter Capture)
          ==================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterCapture source="homepage_funnel" />
      </section>
    </div>
  );
}
