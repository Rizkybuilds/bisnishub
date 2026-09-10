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
  HeartHandshake,
  X
} from 'lucide-react';
import { SERIES } from '../../constants/series';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { NewsletterCapture } from '../../components/store/NewsletterCapture';
import { ProductCard } from '../../components/store/ProductCard';
import { SEOHead } from '../../components/common/SEOHead';

export function HomePage() {
  const { catalog, storeSettings } = useStore();

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
  const shopeeUrl = storeSettings?.shopeeUrl || 'https://shopee.co.id';

  const activeGraphicProducts = catalog.filter(p => p.series !== 'blank' && p.status === 'active').slice(0, 6);
  const blankProducts = catalog.filter(p => p.series === 'blank').slice(0, 4);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "TeeStock Apparel",
    "url": "https://teestockapparel.vercel.app",
    "logo": "https://teestockapparel.vercel.app/logo-teestock.svg",
    "description": "Brand apparel kurasi & studio sablon DTF cepat. Garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s original tanpa jahitan samping.",
    "priceRange": "Rp 37.000 - Rp 99.000",
    "currenciesAccepted": "IDR",
    "paymentAccepted": "Bank Transfer, QRIS, COD",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID"
    }
  };

  // Editorial Studio Ticker items
  const tickerItems = [
    "NEW STATES APPAREL 24S HEAVYWEIGHT",
    "TUBULAR KNIT BUILT-UP (TANPA JAHITAN SAMPING)",
    "DOUBLE HEAT PRESS 155°C IN-HOUSE",
    "CURATED DROP #01: RAW IDENTITY",
    "SLA PRODUKSI CEPAT H+0 / H+1",
    "DIRECT WHATSAPP ORDER (0% FEE)",
    "LIMITED BATCH PERDANA 24 PCS",
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
      {/* Subtle Ambient Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] bg-ts-terracotta/[0.12] blur-[140px] rounded-full" />
      </div>

      {/* ====================================================================
          SECTION 1: HERO — THE HOOK (Above the fold)
          ==================================================================== */}
      <section className="relative pt-8 sm:pt-16 pb-6 sm:pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Floating Release Badge & Live Batch Progress */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-2.5 p-1.5 sm:pr-4 rounded-full bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl text-xs text-ts-krem shadow-glass-card hover:border-ts-terracotta/40 transition-all">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-ts-terracotta/20 border border-ts-terracotta/30">
            <span className="flex h-2 w-2 rounded-full bg-ts-terracotta animate-pulse" />
            <span className="font-mono text-[11px] text-white font-bold uppercase tracking-wider">DROP #01: RAW IDENTITY</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono text-[11px] text-ts-kremMuted">18 / 24 Pcs Diklaim</span>
            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-ts-mustard to-ts-terracotta rounded-full" />
            </div>
            <span className="text-[10px] font-mono font-bold text-ts-mustard">Sisa 6</span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]">
            Wear Your Identity. <br />
            <span className="text-ts-terracotta">
              Stock Your Story.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-ts-kremMuted max-w-2xl mx-auto leading-relaxed font-normal">
            Studio apparel independen berbasis kurasi fisik. Menggunakan bahan resmi <strong className="text-white font-semibold">New States Apparel (NSA) Heavyweight 24s</strong> tubular tanpa jahitan samping, disablon dan dipress mandiri di <strong className="text-white font-semibold">TeeStock Studio &amp; Print Lab</strong> dengan suhu 155°C.
          </p>
        </div>

        {/* Dual Primary CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <a href="#live-drop">
            <Button size="lg" variant="primary" icon={ArrowRight} className="px-6 py-3 text-sm sm:text-base font-bold shadow-glow-terracotta-sm">
              Lihat Koleksi Drop #01
            </Button>
          </a>
          <Link to="/polos">
            <Button size="lg" variant="secondary" icon={Package} className="px-6 py-3 text-sm sm:text-base border-ts-teal/40 bg-ts-teal/10 text-teal-300 font-bold hover:bg-ts-teal/20">
              Kaos Polos NSA (30s &amp; 24s)
            </Button>
          </Link>
          <Link to="/custom-order">
            <Button size="lg" variant="secondary" icon={Palette} className="px-5 py-3 text-sm sm:text-base border-white/20 font-bold hover:bg-white/[0.08]">
              Custom Satuan
            </Button>
          </Link>
          {shopeeUrl && (
            <a href={shopeeUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" icon={ExternalLink} className="px-5 py-3 text-sm sm:text-base border-white/20 text-ts-krem hover:bg-white/[0.05]">
                Shopee Store
              </Button>
            </a>
          )}
        </div>

        {/* Micro Trust Stats */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-ts-kremMuted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ts-green" />
            <span>NSA 24s Heavyweight Original</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ts-terracotta" />
            <span>In-House Double Press 155°C</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-ts-mustard" />
            <span>Tubular Knit (Tanpa Jahitan Samping)</span>
          </div>
        </div>
      </section>

      {/* Editorial Ticker Marquee */}
      <div className="relative w-full overflow-hidden border-y border-white/[0.08] bg-white/[0.02] backdrop-blur-md py-3.5">
        <div className="flex w-max animate-marquee space-x-8 items-center">
          {[...tickerItems, ...tickerItems].map((text, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[11px] font-mono font-bold tracking-widest text-ts-kremMuted uppercase whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-terracotta" />
              <span>{text}</span>
              <span className="text-white/20 ml-5">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================================
          SECTION 2: LIVE DROP — URGENCY + SCARCITY (Drop #01 "Identity")
          ==================================================================== */}
      <section id="live-drop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-mustard bg-ts-mustard/15 px-3 py-1 rounded-full border border-ts-mustard/30 mb-2.5">
              <Flame className="w-3.5 h-3.5 text-ts-terracotta animate-pulse" />
              <span>THE DROP MODEL • BATCH #01 EARLY BIRD (KUOTA 24 PCS)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Drop #01: "RAW IDENTITY"
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1.5 max-w-2xl leading-relaxed">
              Koleksi perdana eksklusif dengan tema karakter independen. Diproduksi terbatas menggunakan garmen premium <strong className="text-white">New States Apparel (NSA) Heavyweight 24s</strong> tubular tanpa jahitan samping &amp; sablon DTF double-press suhu 155°C.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to={activeGraphicProducts.length > 0 ? "/katalog" : "/polos"}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/15 transition-all"
            >
              <span>{activeGraphicProducts.length > 0 ? `Lihat Semua Katalog (${catalog.length})` : `Buka Katalog Polos (${blankProducts.length})`}</span>
              <ArrowRight className="w-3.5 h-3.5 text-ts-terracotta" />
            </Link>
          </div>
        </div>

        {/* Drop Designs Grid or Curation Teaser */}
        {activeGraphicProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {activeGraphicProducts.map((p) => (
              <ProductCard
                key={p.sku}
                product={p}
                isBlank={false}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#141312] border border-white/[0.08] text-center space-y-5 max-w-2xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-ts-terracotta/10 text-ts-terracotta flex items-center justify-center mx-auto border border-ts-terracotta/20">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold text-ts-mustard tracking-wider uppercase bg-ts-mustard/10 px-3 py-1 rounded-full border border-ts-mustard/20">
                DROP ARCHIVE IN PREPARATION
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Koleksi Drop Grafis Sedang Dikurasi
              </h3>
              <p className="text-xs sm:text-sm text-ts-kremMuted max-w-lg mx-auto leading-relaxed">
                Katalog grafis bertema sedang dipersiapkan. Saat ini stok ready berfokus pada <strong className="text-white">Kaos Polos New States Apparel (NSA) Original</strong> dan layanan <strong className="text-white">Custom Sablon DTF Satuan</strong> tanpa minimum order.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/polos">
                <Button variant="primary" size="md" icon={Package} className="w-full sm:w-auto font-bold">
                  Beli Kaos Polos NSA Original
                </Button>
              </Link>
              <Link to="/custom-order">
                <Button variant="secondary" size="md" icon={Palette} className="w-full sm:w-auto font-bold border-white/15">
                  Cetak Desain Custom Sendiri
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Launch Studio Pass Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141312] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-ts-terracotta flex items-center justify-center shrink-0 border border-white/10">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-white uppercase tracking-tight font-mono">
                Launch Batch Voucher: Rp 99.000 + Bebas Ongkir
              </h4>
              <p className="text-xs text-ts-kremMuted mt-0.5">
                Pesan via Shopee Official Store untuk klaim voucher gratis ongkir subsidi se-Indonesia.
              </p>
            </div>
          </div>
          <a
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <span>KLAIM VIA SHOPEE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: TWO STUDIO DIVISIONS — READY-TO-WEAR & ATELIER
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-widest uppercase bg-white/[0.04] px-3.5 py-1 rounded-full border border-white/10">
            <Layers className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>STUDIO DIVISIONS // TEESTOCK APPAREL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Dua Divisi Studio: Archive &amp; Atelier
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            Menghubungkan koleksi apparel kurasi berkarakter tajam dengan layanan produksi custom &amp; kolaborasi merchandise kreator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Division 1: TeeStock Archive / Ready-to-Wear */}
          <div className="p-7 sm:p-9 rounded-2xl bg-[#141312] border border-white/[0.08] hover:border-ts-terracotta/40 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded text-[10px] font-mono font-bold bg-ts-terracotta/15 text-ts-terracotta border border-ts-terracotta/30 uppercase tracking-wider">
                  DIVISI 01 • READY-TO-WEAR ARCHIVE
                </span>
                <span className="text-xs font-mono text-ts-kremMuted/60">EDISI #01</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  TeeStock Archive
                </h3>
                <p className="text-xs sm:text-sm text-ts-mustard font-medium mt-1 font-mono">
                  Koleksi Grafis Tematik Terbatas (Drop System)
                </p>
              </div>

              <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
                Apparel grafis yang dirancang berkala dalam format edisi kapsul. Setiap rilis dicetak eksklusif di atas garmen <strong className="text-white">New States Apparel (NSA) Heavyweight 24s</strong> original rajutan tubular tanpa sambungan samping dengan detail raster DTF tajam.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-xs text-ts-krem">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-ts-terracotta font-bold text-[11px] mt-0.5">01/</span>
                  <span className="text-ts-kremMuted">Sistem Drop batch terbatas (24 pcs early bird per rilisan)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-ts-terracotta font-bold text-[11px] mt-0.5">02/</span>
                  <span className="text-ts-kremMuted">Pustaka 9 series kurasi (Tech, Outdoor, Local Pride, Nostalgia)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-ts-terracotta font-bold text-[11px] mt-0.5">03/</span>
                  <span className="text-ts-kremMuted">Jaminan 100% NSA Original Cititex tanpa sambungan samping</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <Link to="/katalog">
                <Button size="md" variant="primary" icon={ArrowRight} className="w-full justify-center text-xs sm:text-sm font-bold">
                  Jelajahi Koleksi Archive
                </Button>
              </Link>
            </div>
          </div>

          {/* Division 2: TeeStock Atelier / Custom & Collab */}
          <div className="p-7 sm:p-9 rounded-2xl bg-[#141312] border border-white/[0.08] hover:border-ts-teal/40 transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded text-[10px] font-mono font-bold bg-ts-teal/15 text-teal-300 border border-ts-teal/30 uppercase tracking-wider">
                  DIVISI 02 • MERCH &amp; CUSTOM ATELIER
                </span>
                <span className="text-xs font-mono text-ts-kremMuted/60">IN-HOUSE PRESS</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
                  TeeStock Atelier
                </h3>
                <p className="text-xs sm:text-sm text-ts-teal font-medium mt-1 font-mono">
                  Custom Sablon Satuan, Komunitas &amp; Official Merch
                </p>
              </div>

              <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
                Layanan sablon DTF in-house presisi untuk pesanan custom satuan, merchandise resmi kreator/musisi dengan sistem kemitraan, hingga produksi kaos event komunitas tanpa minimum order yang kaku.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-xs text-ts-krem">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-ts-teal font-bold text-[11px] mt-0.5">01/</span>
                  <span className="text-ts-kremMuted">Custom sablon satuan hingga lusinan (bebas minimum order)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-ts-teal font-bold text-[11px] mt-0.5">02/</span>
                  <span className="text-ts-kremMuted">Full fulfillment merchandise (produksi, packaging, pengiriman)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-ts-teal font-bold text-[11px] mt-0.5">03/</span>
                  <span className="text-ts-kremMuted">Bebas bawa desain sendiri (file siap cetak PNG transparan 300 DPI)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <Link to="/custom-order">
                <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center text-xs sm:text-sm font-bold border-white/15 hover:bg-white/[0.08]">
                  Konsultasi TeeStock Atelier
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
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-wider uppercase bg-white/[0.04] px-3 py-1 rounded-full border border-white/10 mb-2.5">
              <Package className="w-3.5 h-3.5 text-ts-mustard" />
              <span>RAW MATERIAL STANDARD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Official Blank Supply // New States Apparel
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 max-w-xl leading-relaxed">
              Katun rajutan silinder tubular tanpa jahitan samping. Standar kualitas internasional untuk kebutuhan harian, seragam komunitas, sabloner, dan brand fashion lokal.
            </p>
          </div>

          <Link
            to="/polos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] text-ts-krem border border-white/[0.1] hover:border-white/25 transition-all"
          >
            <span>LIHAT SEMUA MODEL BLANK ({blankProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-ts-terracotta" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {blankProducts.map((p) => (
            <ProductCard
              key={p.sku}
              product={p}
              isBlank={true}
            />
          ))}
        </div>
      </section>

      {/* ====================================================================
          SECTION: NSA TUBULAR VS ORDINARY COMBED COMPARISON
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-mustard tracking-widest uppercase bg-ts-mustard/10 px-3.5 py-1 rounded-full border border-ts-mustard/25">
            <Zap className="w-3.5 h-3.5 text-ts-mustard" />
            <span>FABRIC ENGINEERING BREAKDOWN</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Kenapa Harus NSA 24s Tubular Built-Up?
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            Perbandingan jujur antara standar garmen TeeStock dengan kaos distro konvensional yang beredar di pasaran.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: TeeStock NSA 24s Heavyweight (The Winner) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#161514] border-2 border-ts-terracotta/40 shadow-glow-terracotta-sm relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-ts-terracotta text-white font-mono text-[10px] font-bold tracking-wider uppercase">
              STANDAR TEESTOCK
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center border border-ts-terracotta/40 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">NSA 24s Heavyweight Original</h3>
                  <p className="text-xs text-ts-mustard font-mono">180 GSM • 100% Cotton Built-Up</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-3 border-t border-white/[0.08] text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Tubular Knit (Tanpa Jahitan Samping)</strong>
                    <span className="text-ts-kremMuted">Dirajut dari silinder utuh. Baju tidak akan pernah melintir, miring, atau berubah bentuk setelah dicuci berkali-kali.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Ketebalan Ideal 180 GSM (Heavyweight 24s)</strong>
                    <span className="text-ts-kremMuted">Tebal berbobot, drape jatuh tegak di badan streetwear, tidak menerawang meski dipakai di bawah terik matahari.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Rib Kerah 2.2 cm Single Needle</strong>
                    <span className="text-ts-kremMuted">Kerah kokoh berlapis elastan, tidak gampang melar atau bergelombang (bacon collar).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Double Heat Press 155°C Studio Lab</strong>
                    <span className="text-ts-kremMuted">Tinta menyerap ke serat benang, sablon lentur berdaya rekat tinggi, anti-pecah dan tahan mesin cuci.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-ts-kremMuted">Fitting: Asian Comfort Loose</span>
              <span className="text-emerald-400 font-bold">100% Anti-Melintir</span>
            </div>
          </div>

          {/* Card 2: Kaos Distro Jahit Samping Biasa */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#121110] border border-white/[0.08] relative opacity-90 flex flex-col justify-between space-y-6">
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-ts-muted flex items-center justify-center border border-white/10 shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-ts-kremMuted">Kaos Distro Konvensional</h3>
                  <p className="text-xs text-ts-muted font-mono">140–150 GSM • Combed 30s Pasaran</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-3 border-t border-white/[0.06] text-xs">
                <div className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ts-kremMuted block font-semibold">Ada Sambungan Jahitan Samping</strong>
                    <span className="text-ts-muted">Pola potong lembaran kain. Kerap melintir spiral setelah dicuci karena tegangan benang berbeda.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ts-kremMuted block font-semibold">Tipis &amp; Rentan Menerawang</strong>
                    <span className="text-ts-muted">Gramasi 140 GSM cenderung lemas, menempel di kulit saat berkeringat dan lekuk tubuh terlihat.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ts-kremMuted block font-semibold">Kerah Cepat Melar (Bacon Collar)</strong>
                    <span className="text-ts-muted">Karet rib tipis tanpa pengunci, melar dan keriting setelah beberapa kali jemur.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-ts-kremMuted block font-semibold">Sablon Satu Kali Press Suhu Bebas</strong>
                    <span className="text-ts-muted">Tanpa proses curing sekunder, rentan rontok dan pecah saat ditarik atau disikat.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs font-mono">
              <span className="text-ts-muted">Fitting: Standar Lokal Sempit</span>
              <span className="text-rose-400 font-bold">Resiko Melintir Tinggi</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: WORKSHOP STANDARDS — TACTILE PRODUCTION EXCELLENCE
          ==================================================================== */}
      <section className="relative bg-[#11100F] border-y border-white/[0.08] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Trust Specs */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-wider uppercase bg-white/[0.04] px-3 py-1 rounded-full border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
              <span>STUDIO WORKSHOP SOP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Standar Workshop &amp; Ketelitian Garmen Fisik
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
              Setiap potong kaos diproses langsung di workshop in-house kami dengan kontrol suhu, tekanan, dan inspeksi fisik berlapis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#151413] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-white flex items-center justify-center border border-white/10">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-ts-kremMuted/60 uppercase">SPEC // 01</span>
              </div>
              <h3 className="font-bold text-base text-white">Garmen Built-Up Tubular NSA</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Menggunakan bahan katun ringspun New States Apparel (NSA) original Cititex. Rajutan silinder tanpa sambungan samping yang jatuh rapi di badan, sejuk dipakai, dan tahan bentuk.
              </p>
              <div className="pt-2 text-[11px] font-mono text-ts-terracotta">
                • 170-180 GSM (24s) / 150 GSM (30s)
              </div>
            </div>

            <div className="bg-[#151413] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-ts-mustard flex items-center justify-center border border-white/10">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-ts-kremMuted/60 uppercase">SPEC // 02</span>
              </div>
              <h3 className="font-bold text-base text-white">Double Heat Press 155°C</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Proses penempelan film DTF menggunakan suhu presisi 155°C selama 15 detik, diikuti pendinginan cold-peel dan curing sekunder 5 detik agar lem menyatu permanen ke pori katun.
              </p>
              <div className="pt-2 text-[11px] font-mono text-ts-mustard">
                • Anti-pecah &amp; tahan cuci berulang
              </div>
            </div>

            <div className="bg-[#151413] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-ts-teal flex items-center justify-center border border-white/10">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-ts-kremMuted/60 uppercase">SPEC // 03</span>
              </div>
              <h3 className="font-bold text-base text-white">Packaging Doff &amp; Sticker Pack</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Setiap helai dilipat presisi dan dikemas dalam polymailer doff tahan hujan berstandar distro, lengkap dengan kartu ucapan terima kasih dan stiker vinyl eksklusif per edisi.
              </p>
              <div className="pt-2 text-[11px] font-mono text-teal-300">
                • Kolaborasi kemasan MultiGraph
              </div>
            </div>
          </div>

          {/* Authentic Fitting Notes & Customer Reviews */}
          <div className="pt-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-mustard bg-ts-mustard/10 px-3 py-1 rounded-full border border-ts-mustard/20">
                <Star className="w-3.5 h-3.5 fill-ts-mustard text-ts-mustard" />
                <span>PILOT BATCH // FITTING NOTES &amp; FEEDBACK</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                Catatan Fitting &amp; Uji Pemakaian Nyata
              </h3>
              <p className="text-xs text-ts-kremMuted max-w-lg mx-auto">
                Feedback langsung dari pembeli batch perdana mengenai kualitas bahan, akurasi ukuran, dan ketahanan sablon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-[#151413] border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-ts-mustard">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ts-krem leading-relaxed">
                    &ldquo;Kain NSA 24s Heavyweight-nya terasa mantap dan berbobot tanpa bikin gerah. Sablon raster di kaos 'Bug or Feature' sangat detail dan tidak terasa kaku seperti sablon karet tebal.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-white font-medium">Dimas P.</strong>
                    <span className="text-[10px] text-ts-muted font-mono">TB 174 cm / BB 70 kg • Size L</span>
                  </div>
                  <span className="text-[10px] font-mono text-ts-green bg-ts-green/10 px-2 py-0.5 rounded border border-ts-green/20">
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#151413] border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-ts-mustard">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ts-krem leading-relaxed">
                    &ldquo;Order 12 pcs custom untuk merch band. Hasil presisi di sablon A3, warna gradasi abu-abu keluar sempurna, dan kemasan polymailer-nya sangat rapi.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-white font-medium">Rian H.</strong>
                    <span className="text-[10px] text-ts-muted font-mono">Merch Project • Size M &amp; L</span>
                  </div>
                  <span className="text-[10px] font-mono text-teal-300 bg-ts-teal/10 px-2 py-0.5 rounded border border-ts-teal/20">
                    Studio Collab
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#151413] border border-white/[0.08] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-ts-mustard">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ts-krem leading-relaxed">
                    &ldquo;Kerah rib 2 cm di NSA 7200 kencang dan tidak letoy. Pengiriman cepat H+1 langsung dikirim resinya via WA tanpa harus ditanya berulang kali.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-white font-medium">Andi S.</strong>
                    <span className="text-[10px] text-ts-muted font-mono">TB 180 cm / BB 78 kg • Size XL</span>
                  </div>
                  <span className="text-[10px] font-mono text-ts-green bg-ts-green/10 px-2 py-0.5 rounded border border-ts-green/20">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: BRAND STORY — AUTHENTIC INDIE ATELIER MANIFESTO
          ==================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#141312] border border-white/[0.08] relative overflow-hidden space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-ts-krem text-[10px] font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
            <span>MANIFESTO // TEESTOCK STUDIO</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase leading-snug">
            Bukan Sablon Massal Murahan. <br />
            Bukan Distro Overpriced.
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-ts-kremMuted leading-relaxed font-normal">
            <p>
              Kami memulai TeeStock dari kegelisahan sederhana: pasar apparel sering kali terbagi dua kubu ekstrem. Di satu sisi, toko sablon serba ada yang menghasilkan kaos kaku dan tipografi murahan. Di sisi lain, distro eksklusif yang mematok harga tidak masuk akal demi cap gengsi semu.
            </p>
            <p>
              <strong className="text-white font-semibold">TeeStock lahir sebagai titik temu yang jujur.</strong> Kami mengkurasi gagasan, identitas profesi, dan kultur independen ke dalam desain grafis beresolusi tinggi — lalu mencetaknya di atas garmen katun New States Apparel original dengan ketelitian suhu press 155°C.
            </p>
            <p className="italic text-ts-krem border-l-2 border-ts-terracotta pl-4 py-1">
              "Bagi kami, sehelai kaos bukan sekadar penutup tubuh. Ia adalah pernyataan identitas, memori perjalanan, dan cerita yang kamu kenakan setiap hari."
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-ts-terracotta/20 text-ts-terracotta font-bold flex items-center justify-center font-mono text-xs border border-ts-terracotta/30">
                TS
              </div>
              <div>
                <span className="block text-xs font-bold text-white uppercase font-mono">TeeStock Apparel House</span>
                <span className="block text-[10px] text-ts-muted">Tangerang / Jakarta • Indonesia</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock! Saya suka konsep brandnya, ingin konsultasi kaos custom.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-ts-green" />
              <span>KONSULTASI WORKSHOP VIA WHATSAPP</span>
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
