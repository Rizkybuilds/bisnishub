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
import { useScrollReveal, ScrollRevealSection } from '../../hooks/useScrollReveal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';
import { NewsletterCapture } from '../../components/store/NewsletterCapture';
import { ProductCard } from '../../components/store/ProductCard';
import { SEOHead } from '../../components/common/SEOHead';
import { getColorHex } from '../../constants/colors';
import { getAvailableColors, getCardPreviewImage } from '../../utils/productImages';
import { MarqueeTicker } from '../../components/store/interactive/MarqueeTicker';
import { UnboxingShowcase } from '../../components/store/UnboxingShowcase';

export function HomePage() {
  const { catalog, storeSettings } = useStore();
  const [activeCategory, setActiveCategory] = React.useState('all');

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
  const shopeeUrl = storeSettings?.shopeeUrl || 'https://shopee.co.id/teestock.id';

  const blankProducts = React.useMemo(() => {
    return catalog.filter(p => p.series === 'blank').slice(0, 4);
  }, [catalog]);

  const totalBlankCount = React.useMemo(() => {
    return catalog.filter(p => p.series === 'blank').length;
  }, [catalog]);

  // Featured product for Spotlight Lookbook Hero
  const featuredProduct = React.useMemo(() => {
    const graphic = catalog.find(p => p.series !== 'blank' && p.status === 'active');
    if (graphic) return graphic;
    if (catalog.length > 0) return catalog[0];
    return {
      sku: 'TS-STM-001',
      name: 'Raw Identity // Statement Tee',
      seriesName: 'Graphic Statement',
      priceRetail: 99000,
      priceAnchor: 139000,
      colors: 'Hitam, Charcoal, Putih, Olive',
      filePath: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
    };
  }, [catalog]);

  const heroColors = React.useMemo(() => {
    const list = getAvailableColors(featuredProduct);
    return list.length > 0 ? list : ['Hitam', 'Putih', 'Charcoal', 'Navy'];
  }, [featuredProduct]);

  const [heroSelectedColor, setHeroSelectedColor] = React.useState('Hitam');

  React.useEffect(() => {
    if (heroColors.length > 0 && !heroColors.includes(heroSelectedColor)) {
      setHeroSelectedColor(heroColors[0]);
    }
  }, [heroColors]);

  const heroImage = React.useMemo(() => {
    return getCardPreviewImage(featuredProduct, heroSelectedColor) || featuredProduct.filePath || featuredProduct.file_path || '';
  }, [featuredProduct, heroSelectedColor]);

  const displayedProducts = React.useMemo(() => {
    if (activeCategory === 'all') {
      return catalog.filter(p => p.series !== 'blank' && p.status === 'active').slice(0, 6);
    }
    if (activeCategory === 'blank') {
      return catalog.filter(p => p.series === 'blank').slice(0, 6);
    }
    return catalog.filter(p => p.series === activeCategory && p.status === 'active');
  }, [catalog, activeCategory]);


  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "name": "TeeStock Apparel",
    "url": "https://teestockapparel.vercel.app",
    "logo": "https://teestockapparel.vercel.app/logo-teestock.svg",
    "description": "Brand apparel kurasi & studio sablon DTF cepat. Garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s original tanpa jahitan samping.",
    "priceRange": "Rp 34.000 - Rp 139.000",
    "currenciesAccepted": "IDR",
    "paymentAccepted": "Bank Transfer, QRIS, COD",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID"
    }
  };

  // Editorial Studio Ticker items
  const tickerItems = [
    { icon: Sparkles, text: 'KURASI GRAFIS BERKARAKTER // BANYAK PILIHAN DESAIN', highlight: true },
    { icon: ShieldCheck, text: '100% NEW STATES APPAREL 24S HEAVYWEIGHT (180 GSM)' },
    { icon: Layers, text: '0 JAHITAN SAMPING // SILUET TUBULAR KNIT' },
    { icon: Zap, text: '155°C IN-HOUSE DUAL-HEAT PRESS CURING' },
    { icon: Package, text: 'PACKAGING MATTE DOFF + FREE COLLECTOR STICKERS' },
    { icon: Sparkles, text: 'CUSTOM SABLON SATUAN TANPA MINIMAL ORDER' },
    { icon: ShieldCheck, text: 'GARANSI 100% RETUR PRODUKSI & UKURAN' },
  ];


  return (
    <div className="relative min-h-screen space-y-12 sm:space-y-24 lg:space-y-28 pb-24 overflow-hidden">
      <SEOHead
        title="TeeStock Apparel | Curated Merch & Kaos NSA 24s Heavyweight Original"
        description="Brand apparel kurasi dan studio sablon DTF cepat. 100% garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s original tanpa jahitan samping. Beli ritel, custom satuan, atau kemitraan dropship."
        keywords={["kaos nsa 24s heavyweight", "kaos nsa softstyle 30s", "sablon dtf satuan", "curated graphic tees", "dropship streetwear brand"]}
        canonicalPath="/"
        schema={homeSchema}
      />
      {/* Subtle Ambient Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] bg-ts-terracotta/[0.12] blur-[140px] rounded-full" />
      </div>

      {/* ====================================================================
          SECTION 1: EDITORIAL SPLIT HERO (Direction A — Asymmetric Spotlight)
          ==================================================================== */}
      <section className="relative pt-4 sm:pt-12 pb-4 sm:pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column (7 cols): Editorial Typography, Value Prop, CTAs, Micro-Trust */}
          <div className="lg:col-span-7 text-left space-y-5 sm:space-y-6">
            {/* Floating Release Badge: Curated Graphic Archive */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-ts-surface border border-ts-border backdrop-blur-xl text-xs text-ts-krem shadow-sm hover:border-ts-terracotta/40 transition-all max-w-full overflow-hidden opacity-0 animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5 text-ts-terracotta shrink-0" />
              <span className="font-mono text-[10px] sm:text-[11px] text-ts-terracotta font-black uppercase tracking-wider truncate">
                THE CURATED GRAPHIC ARCHIVE
              </span>
              <span className="text-ts-borderHover shrink-0">•</span>
              <span className="font-mono text-[9px] sm:text-[10px] text-ts-kremMuted font-bold uppercase tracking-wider truncate">
                100% NSA 24S HEAVYWEIGHT
              </span>
            </div>

            {/* Hero Title & Value Proposition */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-ts-krem leading-[1.1] opacity-0 animate-fade-in-up-delay-1">
                Wear Your <span className="text-ts-terracotta">Identity.</span>
              </h1>

              <p className="text-xs sm:text-base text-ts-kremMuted max-w-xl leading-relaxed font-normal opacity-0 animate-fade-in-up-delay-2">
                Kurasi beragam pilihan karya grafis berkarakter kuat di atas katun New States Apparel 24s Heavyweight tanpa jahitan samping. Dikerjakan presisi di studio in-house kami.
              </p>
            </div>

            {/* Primary Action CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 opacity-0 animate-fade-in-up-delay-3">
              <a href="#katalog-section" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" icon={ArrowRight} className="w-full sm:w-auto justify-center px-6 py-3 text-xs sm:text-sm font-bold shadow-sm">
                  Jelajahi Pilihan Desain
                </Button>
              </a>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 w-full sm:w-auto">
                <Link to="/polos" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" icon={Package} className="w-full sm:w-auto justify-center px-3 sm:px-5 py-3 text-xs sm:text-sm font-bold border-ts-border bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem">
                    The Blanks
                  </Button>
                </Link>
                <Link to="/custom-order" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" icon={Palette} className="w-full sm:w-auto justify-center px-3 sm:px-5 py-3 text-xs sm:text-sm border-ts-border bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem font-bold">
                    Studio Lab
                  </Button>
                </Link>
              </div>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-2 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-6 text-[11px] sm:text-xs font-mono text-ts-kremMuted border-t border-ts-border">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% NSA Original</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>180 GSM Tubular</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>155°C Dual Press</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Garansi Retur 100%</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive Lookbook Spotlight Showcase */}
          <div className="lg:col-span-5 opacity-0 animate-scale-in">
            <div className="p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-ts-surface border border-ts-border shadow-elevation relative overflow-hidden space-y-3 sm:space-y-4">
              {/* Spotlight Top Bar */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ts-terracotta animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-bold text-ts-krem uppercase tracking-wider">LOOKBOOK SPOTLIGHT</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-ts-surfaceHover text-ts-krem text-[9px] sm:text-[10px] border border-ts-border font-bold">
                  {featuredProduct.sku || 'TS-FEATURED'}
                </span>
              </div>

              {/* Garment Mockup Showcase Box with Floating Tech Badges */}
              <Link
                to={`/produk/${featuredProduct.sku}?color=${encodeURIComponent(heroSelectedColor)}`}
                className="block aspect-[4/4] sm:aspect-[4/4.2] rounded-2xl bg-ts-surfaceHover/50 relative overflow-hidden flex items-center justify-center p-3 sm:p-4 border border-ts-border group cursor-pointer"
                aria-label={`Buka detail produk ${featuredProduct.name} varian ${heroSelectedColor}`}
              >
                <img
                  src={heroImage}
                  alt={`${featuredProduct.name} - ${heroSelectedColor}`}
                  className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />

                {/* Floating Badge Top-Left: Fabric Spec */}
                <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-ts-surfaceCard/90 backdrop-blur-md border border-ts-border text-[9px] sm:text-[10px] font-mono text-ts-krem flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500" />
                  <span className="font-bold">NSA 24s (180 GSM)</span>
                </div>

                {/* Floating Badge Top-Right: Press Spec */}
                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-ts-surfaceCard/90 backdrop-blur-md border border-ts-terracotta/30 text-[9px] sm:text-[10px] font-mono text-ts-terracotta flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-ts-terracotta" />
                  <span className="font-bold">155°C Dual-Press</span>
                </div>

                {/* Floating Badge Bottom-Left: Live Color Tag */}
                <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-ts-surfaceCard/90 backdrop-blur-md border border-ts-border text-[9px] sm:text-[10px] font-mono text-ts-krem flex items-center gap-1.5 shadow-sm">
                  <span
                    className="w-2 h-2 rounded-full border border-ts-border"
                    style={{ backgroundColor: getColorHex(heroSelectedColor) }}
                  />
                  <span className="font-bold">{heroSelectedColor}</span>
                </div>

                {/* Floating Badge Bottom-Right: Price */}
                <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-zinc-950/90 dark:bg-black/90 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-mono text-white font-black shadow-sm">
                  {formatRupiah(featuredProduct.priceRetail || featuredProduct.price_retail || 99000)}
                </div>
              </Link>

              {/* Interactive Swatch Selector directly on the Hero */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ts-krem font-bold truncate max-w-[170px] sm:max-w-[200px]">{featuredProduct.name}</span>
                  <span className="text-[10px] font-mono text-ts-muted">Pilih Warna:</span>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap" role="group" aria-label="Pilihan warna spotlight">
                  {heroColors.slice(0, 6).map((colorName) => {
                    const hex = getColorHex(colorName);
                    const isSelected = heroSelectedColor === colorName;
                    return (
                      <button
                        key={colorName}
                        type="button"
                        title={`Ganti warna ke ${colorName}`}
                        aria-label={`Pilih warna ${colorName}`}
                        aria-pressed={isSelected}
                        onClick={() => setHeroSelectedColor(colorName)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-ts-terracotta ring-offset-2 ring-offset-ts-surface scale-105'
                            : 'ring-1 ring-ts-border hover:ring-ts-borderHover opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span
                          className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full inline-block shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Link to detail */}
              <Link
                to={`/produk/${featuredProduct.sku}?color=${encodeURIComponent(heroSelectedColor)}`}
                className="w-full py-2.5 px-3 rounded-xl bg-ts-surfaceHover text-ts-krem font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all border border-ts-border hover:border-white/20"
              >
                <span>Buka Detail &amp; Order Kaos Ini</span>
                <ArrowRight className="w-3.5 h-3.5 text-ts-krem" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Editorial Studio Marquee Ticker ────────────────────────── */}
      <ScrollRevealSection>
        <MarqueeTicker items={tickerItems} speed={30} />
      </ScrollRevealSection>

      {/* ====================================================================
          SECTION 2: CATALOG SHOWCASE WITH CATEGORY FILTER PILLS
          ==================================================================== */}
      <ScrollRevealSection id="katalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-4 border-b border-ts-border pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-kremMuted bg-ts-surface px-3 py-1 rounded-full border border-ts-border mb-2">
              <Sparkles className="w-3.5 h-3.5 text-ts-krem" />
              <span>ARSIP KURASI GRAFIS // BANYAK PILIHAN DESAIN</span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight">
              Koleksi Grafis &amp; Kaos Polos Pilihan
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 max-w-2xl leading-relaxed">
              Temukan grafis yang mewakili identitasmu atau ambil kaos polos New States Apparel original. Kualitas garmen tubular knit tanpa jahitan samping, awet dicuci harian.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/katalog"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border transition-all shadow-sm"
            >
              <span>Buka Semua Katalog ({catalog.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-ts-krem" />
            </Link>
          </div>
        </div>

        {/* Category Filter Pills (Monochrome High-End) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 touch-pan-x">
          {[
            { id: 'all', label: 'Semua Desain', icon: Flame },
            { id: 'statement', label: 'Graphic Statement', icon: Code2 },
            { id: 'subculture', label: 'Urban Subculture', icon: Sparkles },
            { id: 'outdoor', label: 'Outdoor Explorer', icon: Compass },
            { id: 'blank', label: 'Kaos Polos NSA', icon: Package },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm border border-zinc-950 dark:border-white'
                    : 'bg-ts-surface text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-ts-border'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-zinc-950' : 'text-ts-kremMuted'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {displayedProducts.map((p) => (
              <ProductCard
                key={p.sku}
                product={p}
                isBlank={p.series === 'blank'}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#141312] border border-white/[0.08] text-center space-y-4 max-w-xl mx-auto">
            <Package className="w-10 h-10 text-ts-terracotta mx-auto opacity-80" />
            <p className="text-sm text-ts-krem">Belum ada produk di kategori ini.</p>
            <Button size="sm" variant="secondary" onClick={() => setActiveCategory('all')}>
              Tampilkan Semua
            </Button>
          </div>
        )}

        {/* Direct Studio Advantage Banner */}
        <div className="p-4 sm:p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3 text-left">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-ts-surfaceHover text-ts-terracotta flex items-center justify-center shrink-0 border border-ts-border mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-base font-bold text-ts-krem uppercase tracking-tight font-mono">
                The Direct Studio Privilege // Official Store Perk
              </h4>
              <p className="text-xs text-ts-kremMuted mt-0.5 leading-relaxed">
                Order via website resmi: 2x Limited Die-Cut Vinyl Stickers, kemasan matte doff, dan prioritas antrean studio H+0/H+1.
              </p>
            </div>
          </div>
          <Link
            to="/katalog"
            className="w-full sm:w-auto justify-center shrink-0 px-4 sm:px-5 py-2.5 rounded-xl bg-ts-terracotta hover:bg-ts-terracotta/90 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm text-center"
          >
            <span>JELAJAHI SEMUA DESAIN</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </ScrollRevealSection>

      {/* ====================================================================
          SECTION: SENSORY UNBOXING SHOWCASE (The 4 Physical Touchpoints)
          ==================================================================== */}
      <UnboxingShowcase />

      {/* ====================================================================
          SECTION 3: 3 WAYS TO SHOP — BENTO GRID (Katalog, Polos, Custom)
          ==================================================================== */}
      <ScrollRevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-widest uppercase bg-ts-surface px-3 py-1 rounded-full border border-ts-border">
            <Layers className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>THE THREE HOUSES // TEESTOCK ARCHITECTURE</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight uppercase">
            Arsitektur Koleksi TeeStock
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            Dari kurasi grafis bertema subkultur, garmen katun polos resmi, hingga laboratorium sablon satuan studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: TeeStock Originals (The Hero) */}
          <div className="p-5 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-terracotta/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center border border-ts-terracotta/30">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-ts-terracotta uppercase tracking-wider">PILAR 01 // THE HERO ARCHIVE</span>
                <h3 className="text-lg sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                  TeeStock Originals
                </h3>
                <p className="text-xs font-mono text-zinc-950 dark:text-white font-bold mt-1">
                  Rp 99.000 / pcs
                </p>
              </div>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Koleksi kurasi grafis pilihan bertema subkultur di atas katun NSA 24s Heavyweight tubular. Karakter grafis tajam, kerah rib 2.2 cm anti-melar, dan sablon double-press 155°C.
              </p>
            </div>
            <Link to="/katalog">
              <Button size="md" variant="primary" icon={ArrowRight} className="w-full justify-center text-xs font-bold shadow-sm">
                Pilih Kaos Grafis (Rp 99K)
              </Button>
            </Link>
          </div>

          {/* Card 2: Official NSA Blanks (The Pure Foundation) */}
          <div className="p-5 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-teal-400/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-400/15 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-400/30">
                <Package className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-300 uppercase tracking-wider">PILAR 02 // THE PURE FOUNDATION</span>
                <h3 className="text-lg sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                  Official NSA Blanks
                </h3>
                <p className="text-xs font-mono text-zinc-950 dark:text-white font-bold mt-1">
                  Mulai Rp 34.000 – Rp 52.000
                </p>
              </div>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Kanvas murni yang sama yang kami pakai untuk koleksi Originals. Kaos polos resmi New States Apparel (Softstyle 30s &amp; Heavyweight 24s) untuk pecinta siluet boxy minimalis.
              </p>
            </div>
            <Link to="/polos">
              <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center text-xs font-bold border-teal-400/30 text-teal-600 dark:text-teal-300 hover:bg-teal-400/10">
                Beli Kaos Polos NSA
              </Button>
            </Link>
          </div>

          {/* Card 3: Custom Atelier (The Studio Lab) */}
          <div className="p-5 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-mustard/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
            <div className="space-y-3">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center border border-ts-mustard/30">
                <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-ts-mustard uppercase tracking-wider">PILAR 03 // THE STUDIO LAB</span>
                <h3 className="text-lg sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                  TeeStock Atelier
                </h3>
                <p className="text-xs font-mono text-zinc-950 dark:text-white font-bold mt-1">
                  Rp 119.000 – Rp 139.000 / pcs
                </p>
              </div>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Fasilitas heat press in-house kami terbuka untuk karyamu sendiri! Sablon DTF satuan tanpa minimum order untuk kreator, musisi, dan komunitas independen.
              </p>
            </div>
            <Link to="/custom-order">
              <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center text-xs font-bold border-ts-border hover:bg-ts-surfaceHover text-ts-krem">
                Konsultasi Studio Lab
              </Button>
            </Link>
          </div>
        </div>
      </ScrollRevealSection>

      {/* Kaos Polos NSA Section */}
      <ScrollRevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-4 border-b border-ts-border pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-wider uppercase bg-ts-surface px-3 py-1 rounded-full border border-ts-border mb-2">
              <Package className="w-3.5 h-3.5 text-ts-mustard" />
              <span>RAW MATERIAL STANDARD</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-ts-krem tracking-tight uppercase">
              Official Blank Supply // New States Apparel
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 max-w-xl leading-relaxed">
              Katun rajutan silinder tubular tanpa jahitan samping. Standar kualitas internasional untuk kebutuhan harian, seragam komunitas, sabloner, dan brand fashion lokal.
            </p>
          </div>

          <Link
            to="/polos"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border transition-all shadow-sm"
          >
            <span>LIHAT SEMUA MODEL BLANK ({totalBlankCount || blankProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-ts-terracotta" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {blankProducts.map((p) => (
            <ProductCard
              key={p.sku}
              product={p}
              isBlank={true}
            />
          ))}
        </div>
      </ScrollRevealSection>



      {/* ====================================================================
          SECTION 4: THE STUDIO MANIFESTO // OBSESSIVE CRAFT
          ==================================================================== */}
      {/* ====================================================================
          SECTION 4: THE STUDIO MANIFESTO // OBSESSIVE CRAFT
          ==================================================================== */}
      <ScrollRevealSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-ts-surface border border-ts-border relative overflow-hidden space-y-6 sm:space-y-8 shadow-sm transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ts-border pb-5 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-surfaceHover border border-ts-border text-ts-terracotta text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>THE STUDIO MANIFESTO // IN-HOUSE CRAFT</span>
              </div>
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight uppercase leading-snug">
                Obsessive Craft. <br className="hidden sm:inline" />
                Zero Compromise.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md leading-relaxed">
              TeeStock menolak garmen tipis yang kehilangan bentuk setelah dicuci. Kami merancang setiap potong di atas katun berbobot dan menyelesaikannya secara presisi di studio kami sendiri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
            {/* Pillar 1: Heavyweight Cotton */}
            <div className="p-4 sm:p-5 rounded-2xl bg-ts-surfaceHover/30 border border-ts-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-ts-terracotta uppercase tracking-wider font-bold">01 // GARMEN</span>
                <h3 className="text-sm sm:text-base font-bold text-ts-krem">180 GSM Heavyweight Tubular</h3>
                <p className="text-xs text-ts-kremMuted leading-relaxed">
                  Katun 100% ringspun New States Apparel tanpa jahitan samping. Memberi siluet bahu yang tegap, tidak melintir, dan tidak menerawang di bawah sinar matahari.
                </p>
              </div>
              <span className="text-[10px] font-mono text-ts-muted border-t border-ts-border pt-2.5 block">
                Standard: NSA 7200 Series
              </span>
            </div>

            {/* Pillar 2: Dual Heat Curing */}
            <div className="p-4 sm:p-5 rounded-2xl bg-ts-surfaceHover/30 border border-ts-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-ts-mustard uppercase tracking-wider font-bold">02 // SABLON</span>
                <h3 className="text-sm sm:text-base font-bold text-ts-krem">155°C Dual-Heat Curing</h3>
                <p className="text-xs text-ts-kremMuted leading-relaxed">
                  Bukan sablon massal asal jadi. Setiap lembar dipress dua kali di suhu 155°C dengan tekanan 4 bar agar tinta elastis mengunci sempurna ke pori serat kain.
                </p>
              </div>
              <span className="text-[10px] font-mono text-ts-muted border-t border-ts-border pt-2.5 block">
                Standard: In-House Double Press
              </span>
            </div>

            {/* Pillar 3: Unboxing Experience */}
            <div className="p-4 sm:p-5 rounded-2xl bg-ts-surfaceHover/30 border border-ts-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-teal-600 dark:text-teal-300 uppercase tracking-wider font-bold">03 // PENGALAMAN</span>
                <h3 className="text-sm sm:text-base font-bold text-ts-krem">The Unboxing Standard</h3>
                <p className="text-xs text-ts-kremMuted leading-relaxed">
                  Bebas label leher kertas yang gatal. Polymailer charcoal doff kedap air, aroma studio segar, 2x limited vinyl sticker pack, dan kartu garansi founder.
                </p>
              </div>
              <span className="text-[10px] font-mono text-ts-muted border-t border-ts-border pt-2.5 block">
                Standard: Zero-Itch Protocol
              </span>
            </div>
          </div>

          {/* Workshop Origin Transparency Footer */}
          <div className="pt-4 border-t border-ts-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-ts-terracotta/20 text-ts-terracotta font-bold flex items-center justify-center font-mono text-xs border border-ts-terracotta/30 shrink-0">
                TS
              </div>
              <div>
                <span className="block text-xs font-bold text-ts-krem uppercase font-mono">TeeStock Central Studio</span>
                <span className="block text-[10px] text-ts-muted">Central Studio &amp; Fulfillment: Depok • Kirim ke Seluruh Indonesia</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock Studio! Saya ingin tanya produk / custom order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-ts-surfaceHover hover:bg-ts-border text-ts-krem border border-ts-border transition-all cursor-pointer text-center"
            >
              <MessageSquare className="w-3.5 h-3.5 text-ts-green" />
              <span>DISKUSI VIA WHATSAPP</span>
            </a>
          </div>
        </div>
      </ScrollRevealSection>

      {/* ====================================================================
          SECTION 5: AUTHENTIC FITTING NOTES & CUSTOMER REVIEWS
          ==================================================================== */}
      <ScrollRevealSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-5 sm:space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-500 dark:fill-amber-400 text-amber-500 dark:text-amber-400" />
                <span>VERIFIED FIT // FITTING NOTES &amp; PEMAKAIAN NYATA</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-ts-krem tracking-tight uppercase">
                Catatan Fitting &amp; Uji Pemakaian Nyata
              </h3>
              <p className="text-xs text-ts-kremMuted max-w-lg mx-auto leading-relaxed">
                Feedback langsung dari pelanggan terverifikasi mengenai kenyamanan bahan katun NSA, akurasi ukuran, dan ketahanan sablon studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
              <div className="p-4 sm:p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col justify-between space-y-3.5 sm:space-y-4 shadow-sm">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ts-krem leading-relaxed">
                    &ldquo;Kain NSA 24s Heavyweight-nya terasa mantap dan berbobot tanpa bikin gerah. Sablon raster di kaos 'Raw Identity' sangat detail dan tidak terasa kaku seperti sablon karet tebal.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-ts-border flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-ts-krem font-medium">Dimas P.</strong>
                    <span className="text-[10px] text-ts-muted font-mono">TB 174 cm / BB 70 kg • Size L</span>
                  </div>
                  <span className="text-[10px] font-mono text-ts-green bg-ts-green/10 px-2 py-0.5 rounded border border-ts-green/20">
                    Verified
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col justify-between space-y-3.5 sm:space-y-4 shadow-sm">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ts-krem leading-relaxed">
                    &ldquo;Order 12 pcs custom untuk merch band. Hasil presisi di sablon A3, warna gradasi abu-abu keluar sempurna, dan kemasan polymailer-nya sangat rapi.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-ts-border flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-ts-krem font-medium">Rian H.</strong>
                    <span className="text-[10px] text-ts-muted font-mono">Merch Project • Size M &amp; L</span>
                  </div>
                  <span className="text-[10px] font-mono text-ts-teal bg-ts-teal/10 px-2 py-0.5 rounded border border-ts-teal/20">
                    Studio Collab
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col justify-between space-y-3.5 sm:space-y-4 shadow-sm">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-ts-krem leading-relaxed">
                    &ldquo;Kerah rib 2.2 cm di NSA 7200 kencang dan tidak letoy. Pengiriman cepat H+1 langsung dikirim resinya via WA tanpa harus ditanya berulang kali.&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-ts-border flex items-center justify-between text-xs">
                  <div>
                    <strong className="block text-ts-krem font-medium">Andi S.</strong>
                    <span className="text-[10px] text-ts-muted font-mono">TB 180 cm / BB 78 kg • Size XL</span>
                  </div>
                  <span className="text-[10px] font-mono text-ts-green bg-ts-green/10 px-2 py-0.5 rounded border border-ts-green/20">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollRevealSection>

      {/* Discreet B2B Partner Portal Gateway (Pemisahan Resmi teestock.id B2C & mitra.teestock.id B2B) */}
      <ScrollRevealSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-ts-surface border border-ts-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-ts-mustard/15 border border-ts-mustard/30 text-[10px] font-mono font-bold text-ts-mustard uppercase">
              B2B RESELLER &amp; DROPSHIP PORTAL
            </div>
            <h4 className="text-sm sm:text-base font-bold text-ts-krem">
              Ingin Menjual Kembali atau Cetak Merchandise Jumlah Besar?
            </h4>
            <p className="text-xs text-ts-muted max-w-xl leading-relaxed">
              Dapatkan katalog harga grosir bertingkat, sistem dropship white-label tanpa modal, dan simulator profit di portal khusus mitra.
            </p>
          </div>
          <a
            href="https://mitra.teestock.id"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-ts-surfaceHover hover:bg-ts-border text-ts-krem border border-ts-border transition-all shrink-0 hover:border-ts-mustard/50 text-center"
          >
            <span>Buka mitra.teestock.id</span>
            <ExternalLink className="w-3.5 h-3.5 text-ts-mustard" />
          </a>
        </div>
      </ScrollRevealSection>

      {/* Editorial Reverse Ticker Divider */}
      <div className="w-full">
        <MarqueeTicker 
          reverse={true} 
          items={[
            { icon: Zap, text: 'CUSTOM SABLON SATUAN TANPA MINIMAL ORDER', highlight: true },
            { icon: Package, text: 'PACKAGING MATTE DOFF + FREE COLLECTOR STICKER PACK' },
            { icon: ShieldCheck, text: 'GARANSI 100% RETUR PRODUKSI & SIZE' },
            { icon: Sparkles, text: '100% ORIGINAL NEW STATES APPAREL HEAVYWEIGHT' },
            { icon: Truck, text: 'DISPATCH CEPAT H+0 / H+1 DARI CENTRAL STUDIO' },
          ]}
        />
      </div>

      {/* ====================================================================
          SECTION 6: LEAD CAPTURE & VIP UPDATES (Newsletter Capture)
          ==================================================================== */}
      <ScrollRevealSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterCapture source="homepage_funnel" />
      </ScrollRevealSection>
    </div>
  );
}

