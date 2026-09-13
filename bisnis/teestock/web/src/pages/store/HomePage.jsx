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
import { getColorHex } from '../../constants/colors';
import { getAvailableColors, getCardPreviewImage } from '../../utils/productImages';

const FABRIC_HOTSPOTS = [
  {
    id: 'collar',
    label: 'Kerah Elastan 2.2 cm',
    badge: 'ANTI-BACON COLLAR',
    shortTitle: 'Rib Kerah Single Needle + Elastan',
    tagline: 'Kerah Kokoh, Bulat Rapi, Anti Keriting',
    nsaFeature: 'Rib rajut 2.2 cm dengan campuran benang elastan elastis dan jahitan pengunci single needle. Struktur kerah tetap bulat tegak dan tidak keriting (bacon collar) meski dicuci di mesin cuci.',
    ordinaryFeature: 'Karet rib tipis 1.5 cm tanpa elastan pasaran. Mudah keriting, melar, dan bergelombang setelah 2-3 kali jemur.',
    statNsa: '100% Anti-Melar',
    statOrdinary: 'Mudah Keriting'
  },
  {
    id: 'tubular',
    label: 'Tubular Silinder',
    badge: '100% ANTI-MELINTIR',
    shortTitle: 'Rajutan Silinder Tanpa Jahitan Samping',
    tagline: 'Bebas Jahitan Samping, Tidak Pernah Melintir',
    nsaFeature: 'Ditenun langsung membentuk silinder utuh dari mesin rajut memutar. Kaos tidak akan pernah melintir spiral setelah dicuci, dan tidak ada jahitan samping yang menggesek atau membuat gatal pinggang.',
    ordinaryFeature: 'Pola kain dipotong lembaran lalu dijahit sambung di samping. Perbedaan tegangan benang menyebabkan kaos melintir miring setelah dicuci.',
    statNsa: '0 Jahitan Samping',
    statOrdinary: 'Jahitan Melintir'
  },
  {
    id: 'fabric',
    label: 'Katun 180 GSM',
    badge: 'HEAVYWEIGHT 24S',
    shortTitle: 'Katun Ringspun 180 GSM Heavyweight',
    tagline: 'Tebal Berbobot, Adem, & Anti Menerawang',
    nsaFeature: 'Gramasi 180 GSM memberikan drape jatuh yang boxy dan berbobot streetwear. Serat katun ringspun halus adem menyerap keringat di cuaca tropis, serta 100% tidak menerawang di bawah sinar matahari.',
    ordinaryFeature: 'Combed 30s pasaran dengan gramasi tipis 140–150 GSM. Lemas menerawang di bawah cahaya dan menempel di tubuh saat berkeringat.',
    statNsa: '180 GSM Heavyweight',
    statOrdinary: '140 GSM Tipis Menerawang'
  },
  {
    id: 'press',
    label: 'Double Press 155°C',
    badge: 'STUDIO HEAT LAB',
    shortTitle: 'SOP Double Heat Press In-House 155°C Presisi',
    tagline: 'Sablon Menyatu ke Serat, Lentur & Anti Pecah',
    nsaFeature: 'Dipress dengan suhu presisi 155°C selama 15 detik (press primer), didinginkan sistem cold-peel, lalu curing sekunder 5 detik. Lem tinta DTF meresap menyatu ke pori benang, lentur dan tahan tarikan tanpa retak.',
    ordinaryFeature: 'Satu kali press kilat tanpa kalibrasi suhu dan tanpa curing sekunder. Lem hanya menempel di permukaan kain dan mudah retak mengelupas saat dicuci atau disikat.',
    statNsa: 'Double Press 155°C',
    statOrdinary: 'Press Kilat Permukaan'
  },
  {
    id: 'pack',
    label: 'Kemasan Doff',
    badge: 'DISTRO UNBOXING',
    shortTitle: 'Polymailer Matte Doff & Collector Stickers',
    tagline: 'Unboxing Menyenangkan, Tahan Cuaca Hujan',
    nsaFeature: 'Tiap helai dilipat presisi dan dikemas dalam polymailer matte doff tahan air berstandar distro, lengkap dengan Founder Warranty Card dan stiker vinyl tahan air edisi kolektor per rilisan.',
    ordinaryFeature: 'Plastik opp bening tipis tanpa proteksi benturan atau kresek murah yang rentan robek di perjalanan kurir.',
    statNsa: 'Doff + Sticker Pack',
    statOrdinary: 'Plastik Kresek Bening'
  }
];

export function HomePage() {
  const { catalog, storeSettings } = useStore();
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [activeHotspot, setActiveHotspot] = React.useState('collar');

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
  const shopeeUrl = storeSettings?.shopeeUrl || 'https://shopee.co.id/teestock.id';

  const blankProducts = React.useMemo(() => {
    return catalog.filter(p => p.series === 'blank').slice(0, 4);
  }, [catalog]);

  // Featured product for Spotlight Lookbook Hero
  const featuredProduct = React.useMemo(() => {
    const graphic = catalog.find(p => p.series !== 'blank' && p.status === 'active');
    if (graphic) return graphic;
    if (catalog.length > 0) return catalog[0];
    return {
      sku: 'TS-RAW-001',
      name: 'Bug or Feature // Raw Identity',
      seriesName: 'Tech & Profesi',
      priceRetail: 99000,
      priceAnchor: 139000,
      colors: 'Hitam, Putih, Charcoal, Navy, Forest Green',
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
    const filtered = catalog.filter(p => p.series === activeCategory && p.status === 'active');
    return filtered.length > 0 ? filtered : catalog.filter(p => p.series !== 'blank' && p.status === 'active').slice(0, 6);
  }, [catalog, activeCategory]);

  const activeHotspotData = React.useMemo(() => {
    return FABRIC_HOTSPOTS.find(h => h.id === activeHotspot) || FABRIC_HOTSPOTS[0];
  }, [activeHotspot]);


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
    "100% NEW STATES APPAREL ORIGINAL",
    "TUBULAR KNIT BUILT-UP (TANPA JAHITAN SAMPING)",
    "DOUBLE HEAT PRESS 155°C IN-HOUSE",
    "ONLINE DIRECT-TO-CONSUMER // HARGA JUJUR",
    "GARANSI RETUR 100% CACAT KAMI GANTI BARU",
    "PILIHAN DESAIN LENGKAP & READY STOCK",
    "CUSTOM SABLON SATUAN TANPA MINIMUM ORDER",
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
          SECTION 1: EDITORIAL SPLIT HERO (Direction A — Asymmetric Spotlight)
          ==================================================================== */}
      <section className="relative pt-6 sm:pt-12 pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 cols): Editorial Typography, Value Prop, CTAs, Micro-Trust */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Floating Release Badge & D2C Online Model */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-ts-surface border border-ts-border backdrop-blur-xl text-xs text-ts-krem shadow-sm hover:border-ts-terracotta/40 transition-all">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] text-ts-krem font-bold uppercase tracking-wider">
                100% ONLINE DIRECT-TO-CONSUMER • READY STOCK DISPATCH H+0 / H+1
              </span>
            </div>

            {/* Hero Title & Value Proposition (Formula D) */}
            <div className="space-y-3.5">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ts-krem leading-[1.12]">
                Kaos Nyaman dengan <br className="hidden sm:inline" />
                Desain yang <span className="text-ts-terracotta">Nggak Pernah Ngebosenin.</span>
              </h1>

              <p className="text-sm sm:text-base text-ts-kremMuted max-w-xl leading-relaxed font-normal">
                Eksplorasi puluhan kurasi grafis dan kaos polos <strong className="text-ts-krem font-semibold">New States Apparel (NSA) Original</strong>. Katun tebal tubular tanpa jahitan samping yang awet dicuci, dengan harga jujur yang tetap ramah di kantong untuk harianmu.
              </p>
            </div>

            {/* Primary Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a href="#katalog-section">
                <Button size="lg" variant="primary" icon={ArrowRight} className="px-6 py-3 text-sm font-bold shadow-glow-terracotta-sm">
                  Jelajahi Katalog — Rp 99K
                </Button>
              </a>
              <Link to="/polos">
                <Button size="lg" variant="secondary" icon={Package} className="px-5 py-3 text-sm border-ts-teal/40 bg-ts-teal/10 text-teal-600 dark:text-teal-300 font-bold hover:bg-ts-teal/20">
                  Kaos Polos NSA (Mulai Rp 34K)
                </Button>
              </Link>
              <Link to="/custom-order">
                <Button size="lg" variant="secondary" icon={Palette} className="px-5 py-3 text-sm border-ts-border bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem font-bold">
                  Custom Satuan
                </Button>
              </Link>
              {shopeeUrl && (
                <a href={shopeeUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" icon={ExternalLink} className="px-4 py-3 text-sm border-ts-border text-ts-krem hover:bg-ts-surfaceHover">
                    Shopee
                  </Button>
                </a>
              )}
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-mono text-ts-kremMuted border-t border-ts-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% NSA Original Resmi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ts-terracotta shrink-0" />
                <span>Double Press In-House 155°C</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-ts-mustard shrink-0" />
                <span>Garansi Retur 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-300 shrink-0" />
                <span>Ready Stock Siap Kirim</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Interactive Lookbook Spotlight Showcase */}
          <div className="lg:col-span-5">
            <div className="p-4 sm:p-5 rounded-3xl bg-ts-surface border border-ts-border shadow-elevation relative overflow-hidden space-y-4">
              {/* Spotlight Top Bar */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-ts-terracotta animate-pulse" />
                  <span className="text-[11px] font-bold text-ts-krem uppercase tracking-wider">LOOKBOOK SPOTLIGHT</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-ts-surfaceHover text-ts-krem text-[10px] border border-ts-border font-bold">
                  {featuredProduct.sku || 'TS-FEATURED'}
                </span>
              </div>

              {/* Garment Mockup Showcase Box with Floating Tech Badges */}
              <div className="aspect-[4/4] sm:aspect-[4/4.2] rounded-2xl bg-ts-surfaceHover/50 relative overflow-hidden flex items-center justify-center p-4 border border-ts-border group">
                <img
                  src={heroImage}
                  alt={`${featuredProduct.name} - ${heroSelectedColor}`}
                  className="w-full h-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />

                {/* Floating Badge Top-Left: Fabric Spec */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-ts-surfaceCard/90 backdrop-blur-md border border-ts-border text-[10px] font-mono text-ts-krem flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-bold">NSA 24s (180 GSM)</span>
                </div>

                {/* Floating Badge Top-Right: Press Spec */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-ts-surfaceCard/90 backdrop-blur-md border border-ts-terracotta/30 text-[10px] font-mono text-ts-terracotta flex items-center gap-1.5 shadow-sm">
                  <Flame className="w-3.5 h-3.5 text-ts-terracotta" />
                  <span className="font-bold">155°C In-House</span>
                </div>

                {/* Floating Badge Bottom-Left: Live Color Tag */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-ts-surfaceCard/90 backdrop-blur-md border border-ts-border text-[10px] font-mono text-ts-krem flex items-center gap-1.5 shadow-sm">
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-ts-border"
                    style={{ backgroundColor: getColorHex(heroSelectedColor) }}
                  />
                  <span className="font-bold">{heroSelectedColor}</span>
                </div>

                {/* Floating Badge Bottom-Right: Price */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-emerald-950/20 dark:bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-[11px] font-mono text-emerald-600 dark:text-emerald-300 font-black shadow-sm">
                  Rp 99.000
                </div>
              </div>

              {/* Interactive Swatch Selector directly on the Hero */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ts-krem font-bold truncate max-w-[200px]">{featuredProduct.name}</span>
                  <span className="text-[10px] font-mono text-ts-muted">Pilih Mockup Warna:</span>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Pilihan warna spotlight">
                  {heroColors.slice(0, 6).map((colorName) => {
                    const hex = getColorHex(colorName);
                    const isSelected = heroSelectedColor === colorName;
                    return (
                      <button
                        key={colorName}
                        type="button"
                        title={`Ganti warna ke ${colorName}`}
                        onClick={() => setHeroSelectedColor(colorName)}
                        className={`p-1 rounded-full cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-ts-terracotta ring-offset-2 ring-offset-ts-surface scale-110'
                            : 'ring-1 ring-ts-border hover:ring-ts-borderHover opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full inline-block shadow-sm"
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
                className="w-full py-2.5 rounded-xl bg-ts-surfaceHover text-ts-krem font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all border border-ts-border hover:border-ts-terracotta"
              >
                <span>Buka Detail &amp; Order Kaos Ini</span>
                <ArrowRight className="w-3.5 h-3.5 text-ts-terracotta" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Ticker Marquee */}
      <div className="relative w-full overflow-hidden border-y border-ts-border bg-ts-surfaceHover/30 backdrop-blur-md py-3.5 transition-colors">
        <div className="flex w-max animate-marquee space-x-8 items-center">
          {[...tickerItems, ...tickerItems].map((text, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[11px] font-mono font-bold tracking-widest text-ts-kremMuted uppercase whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-ts-terracotta" />
              <span>{text}</span>
              <span className="text-ts-borderHover ml-5">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================================
          SECTION 2: CATALOG SHOWCASE WITH 21ST CATEGORY FILTER PILLS
          ==================================================================== */}
      <section id="katalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ts-border pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-mustard bg-ts-mustard/15 px-3 py-1 rounded-full border border-ts-mustard/30 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
              <span>KATALOG LENGKAP // RETAIL APPAREL HOUSE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-ts-krem tracking-tight">
              Pilihan Desain &amp; Kaos Polos
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1.5 max-w-2xl leading-relaxed">
              Pilih grafis yang mewakili seleramu atau ambil kaos polos New States Apparel original. Kualitas garmen tubular knit tanpa jahitan samping, awet dicuci harian.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/katalog"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border transition-all"
            >
              <span>Buka Semua Katalog ({catalog.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-ts-terracotta" />
            </Link>
          </div>
        </div>

        {/* 21st Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'all', label: 'Semua Desain', icon: Flame },
            { id: 'profesi', label: 'Tech & Profesi', icon: Code2 },
            { id: 'komunitas', label: 'Outdoor & Aktif', icon: Compass },
            { id: 'receh', label: 'Humor & Sarkas', icon: Sparkles },
            { id: 'lokal', label: 'Lokal Pride', icon: HeartHandshake },
            { id: 'blank', label: 'Kaos Polos NSA', icon: Package },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-ts-terracotta text-white shadow-glow-terracotta-sm border border-ts-terracotta'
                    : 'bg-ts-surface text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-ts-border'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-ts-terracotta'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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


        {/* Launch Studio Pass Banner */}
        <div className="p-5 sm:p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-terracotta flex items-center justify-center shrink-0 border border-ts-border">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-ts-krem uppercase tracking-tight font-mono">
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
            className="shrink-0 px-5 py-2.5 rounded-xl bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <span>KLAIM VIA SHOPEE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: 3 WAYS TO SHOP — BENTO GRID (Katalog, Polos, Custom)
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-widest uppercase bg-ts-surface px-3.5 py-1 rounded-full border border-ts-border">
            <Layers className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>3 WAYS TO SHOP // TEESTOCK APPAREL</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-ts-krem tracking-tight uppercase">
            3 Cara Belanja di TeeStock
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            Satu tempat untuk seluruh kebutuhan kaos harianmu: koleksi grafis siap pakai, kaos polos original, atau sablon custom satuan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Katalog Grafis */}
          <div className="p-6 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-terracotta/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center border border-ts-terracotta/30">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-ts-terracotta uppercase tracking-wider">PILAR 01</span>
                <h3 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                  Katalog Grafis
                </h3>
                <p className="text-xs font-mono text-ts-mustard font-semibold mt-1">
                  Rp 99.000 / pcs
                </p>
              </div>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Puluhan kurasi desain siap pakai di atas katun NSA 24s Heavyweight tubular. Pilihan tema luas: tech, humor, outdoor, dan seni grafis berkarakter.
              </p>
            </div>
            <Link to="/katalog">
              <Button size="md" variant="primary" icon={ArrowRight} className="w-full justify-center text-xs font-bold">
                Jelajahi Grafis (Rp 99K)
              </Button>
            </Link>
          </div>

          {/* Card 2: Kaos Polos NSA */}
          <div className="p-6 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-teal-400/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal-400/15 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-400/30">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-300 uppercase tracking-wider">PILAR 02</span>
                <h3 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                  Official NSA Blanks
                </h3>
                <p className="text-xs font-mono text-teal-600 dark:text-teal-300 font-semibold mt-1">
                  Mulai Rp 34.000 – Rp 52.000
                </p>
              </div>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Kaos polos resmi New States Apparel (Softstyle 30s &amp; Heavyweight 24s). Rajutan silinder tanpa jahitan samping, adem, dan awet dicuci berkali-kali.
              </p>
            </div>
            <Link to="/polos">
              <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center text-xs font-bold border-teal-400/30 text-teal-600 dark:text-teal-300 hover:bg-teal-400/10">
                Beli Kaos Polos NSA
              </Button>
            </Link>
          </div>

          {/* Card 3: Custom Sablon Satuan */}
          <div className="p-6 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-mustard/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center border border-ts-mustard/30">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-ts-mustard uppercase tracking-wider">PILAR 03</span>
                <h3 className="text-xl sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                  Custom Atelier
                </h3>
                <p className="text-xs font-mono text-ts-mustard font-semibold mt-1">
                  Rp 119.000 – Rp 139.000 / pcs
                </p>
              </div>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Bebas cetak desainmu sendiri tanpa batas minimum order! Konsultasi mockup cepat via WhatsApp, dipress dengan suhu presisi 155°C, selesai 24–48 jam.
              </p>
            </div>
            <Link to="/custom-order">
              <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center text-xs font-bold border-ts-border hover:bg-ts-surfaceHover text-ts-krem">
                Konsultasi Custom Satuan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Kaos Polos NSA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ts-border pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-wider uppercase bg-ts-surface px-3 py-1 rounded-full border border-ts-border mb-2.5">
              <Package className="w-3.5 h-3.5 text-ts-mustard" />
              <span>RAW MATERIAL STANDARD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ts-krem tracking-tight uppercase">
              Official Blank Supply // New States Apparel
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 max-w-xl leading-relaxed">
              Katun rajutan silinder tubular tanpa jahitan samping. Standar kualitas internasional untuk kebutuhan harian, seragam komunitas, sabloner, dan brand fashion lokal.
            </p>
          </div>

          <Link
            to="/polos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border transition-all"
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
          SECTION: INTERACTIVE GARMENT HOTSPOT ANATOMY (Direction A)
          ==================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-mustard tracking-widest uppercase bg-ts-mustard/10 px-3.5 py-1 rounded-full border border-ts-mustard/25">
            <Zap className="w-3.5 h-3.5 text-ts-mustard" />
            <span>INTERACTIVE GARMENT ANATOMY</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-ts-krem tracking-tight uppercase">
            Anatomi Kualitas Kaos NSA 24s
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
            Klik tiap bagian spesifikasi di bawah untuk melihat perbedaan teknis antara standar garmen TeeStock dengan kaos distro konvensional.
          </p>
        </div>

        {/* Hotspot Selector Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {FABRIC_HOTSPOTS.map((hotspot) => {
            const isSelected = activeHotspot === hotspot.id;
            return (
              <button
                key={hotspot.id}
                onClick={() => setActiveHotspot(hotspot.id)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-ts-terracotta text-white shadow-glow-terracotta-sm border border-ts-terracotta'
                    : 'bg-ts-surface text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-ts-border'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-ts-mustard'}`} />
                <span>{hotspot.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Hotspot Comparison Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (7 cols): TeeStock NSA Standard */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-ts-surface border-2 border-ts-terracotta/40 shadow-glow-terracotta-sm relative overflow-hidden flex flex-col justify-between space-y-6">
            <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-ts-terracotta text-white font-mono text-[10px] font-bold tracking-wider uppercase">
              STANDAR TEESTOCK ({activeHotspotData.badge})
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center border border-ts-terracotta/40 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-ts-krem">{activeHotspotData.shortTitle}</h3>
                  <p className="text-xs text-ts-mustard font-mono font-semibold">{activeHotspotData.tagline}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-ts-surfaceHover/50 border border-ts-border text-xs sm:text-sm text-ts-krem leading-relaxed space-y-2">
                <p>{activeHotspotData.nsaFeature}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/10 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs font-mono">
              <span className="text-ts-kremMuted">Keunggulan Utama:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                {activeHotspotData.statNsa}
              </span>
            </div>
          </div>

          {/* Right Column (5 cols): Ordinary Distro Comparison */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border relative opacity-90 flex flex-col justify-between space-y-6">
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-ts-surfaceHover text-ts-muted flex items-center justify-center border border-ts-border shrink-0">
                  <X className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ts-kremMuted">Kaos Distro Biasa Pasaran</h3>
                  <p className="text-xs text-ts-muted font-mono">Combed 30s Jahit Samping</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-ts-surfaceHover/40 border border-ts-border text-xs text-ts-kremMuted leading-relaxed space-y-2">
                <p>{activeHotspotData.ordinaryFeature}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/10 dark:bg-rose-950/20 border border-rose-500/20 flex items-center justify-between text-xs font-mono">
              <span className="text-ts-muted">Resiko Pasaran:</span>
              <span className="text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" />
                {activeHotspotData.statOrdinary}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: WORKSHOP STANDARDS — TACTILE PRODUCTION EXCELLENCE
          ==================================================================== */}
      <section className="relative bg-ts-surface/50 border-y border-ts-border py-16 sm:py-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Trust Specs */}
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-wider uppercase bg-ts-surfaceHover px-3 py-1 rounded-full border border-ts-border">
              <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
              <span>STUDIO WORKSHOP SOP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ts-krem tracking-tight uppercase">
              Standar Workshop &amp; Ketelitian Garmen Fisik
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
              Setiap potong kaos diproses langsung di workshop in-house kami dengan kontrol suhu, tekanan, dan inspeksi fisik berlapis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 sm:p-7 space-y-3.5 hover:border-ts-terracotta/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-krem flex items-center justify-center border border-ts-border">
                  <Layers className="w-5 h-5 text-ts-terracotta" />
                </div>
                <span className="text-[10px] font-mono font-bold text-ts-muted uppercase">SPEC // 01</span>
              </div>
              <h3 className="font-bold text-base text-ts-krem">Garmen Built-Up Tubular NSA</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Menggunakan bahan katun ringspun New States Apparel (NSA) original Cititex. Rajutan silinder tanpa sambungan samping yang jatuh rapi di badan, sejuk dipakai, dan tahan bentuk.
              </p>
              <div className="pt-2 text-[11px] font-mono text-ts-terracotta font-semibold">
                • 170-180 GSM (24s) / 150 GSM (30s)
              </div>
            </div>

            <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 sm:p-7 space-y-3.5 hover:border-ts-mustard/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-mustard flex items-center justify-center border border-ts-border">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-ts-muted uppercase">SPEC // 02</span>
              </div>
              <h3 className="font-bold text-base text-ts-krem">Double Heat Press 155°C</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Proses penempelan film DTF menggunakan suhu presisi 155°C selama 15 detik, diikuti pendinginan cold-peel dan curing sekunder 5 detik agar lem menyatu permanen ke pori katun.
              </p>
              <div className="pt-2 text-[11px] font-mono text-ts-mustard font-semibold">
                • Anti-pecah &amp; tahan cuci berulang
              </div>
            </div>

            <div className="bg-ts-surface border border-ts-border rounded-2xl p-6 sm:p-7 space-y-3.5 hover:border-ts-teal/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-ts-surfaceHover text-ts-teal flex items-center justify-center border border-ts-border">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-ts-muted uppercase">SPEC // 03</span>
              </div>
              <h3 className="font-bold text-base text-ts-krem">Packaging Doff &amp; Sticker Pack</h3>
              <p className="text-xs text-ts-kremMuted leading-relaxed">
                Setiap helai dilipat presisi dan dikemas dalam polymailer doff tahan hujan berstandar distro, lengkap dengan kartu ucapan terima kasih dan stiker vinyl eksklusif per edisi.
              </p>
              <div className="pt-2 text-[11px] font-mono text-ts-teal font-semibold">
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
              <h3 className="text-xl sm:text-2xl font-black text-ts-krem tracking-tight uppercase">
                Catatan Fitting &amp; Uji Pemakaian Nyata
              </h3>
              <p className="text-xs text-ts-kremMuted max-w-lg mx-auto">
                Feedback langsung dari pembeli batch perdana mengenai kualitas bahan, akurasi ukuran, dan ketahanan sablon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col justify-between space-y-4 shadow-sm">
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

              <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col justify-between space-y-4 shadow-sm">
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

              <div className="p-6 rounded-2xl bg-ts-surface border border-ts-border flex flex-col justify-between space-y-4 shadow-sm">
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
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: BRAND STORY & COST TRANSPARENCY INFOGRAPHIC (Direction A)
          ==================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-ts-surface border border-ts-border relative overflow-hidden space-y-8 shadow-sm transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ts-border pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-[10px] font-mono uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% ONLINE DIRECT-TO-CONSUMER // WORKSHOP ATELIER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-ts-krem tracking-tight uppercase leading-snug">
                Kenapa Kualitas Distro Rp 150K+ <br className="hidden sm:inline" />
                Bisa Dijual Rp 99.000?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md leading-relaxed">
              TeeStock beroperasi <strong className="text-ts-krem">100% Online D2C</strong> tanpa membuka toko retail fisik di mall. Seluruh efisiensi sewa dialihkan ke garmen katun terbaik dan harga yang ramah di kantong.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Box 1: Distro Mall Biasa */}
            <div className="p-6 rounded-2xl bg-ts-surfaceHover/40 border border-ts-border space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400 uppercase tracking-wider font-bold">MODEL KONVENSIONAL</span>
                  <h3 className="text-lg font-black text-ts-krem">Distro Ruko &amp; Mall Fisik</h3>
                </div>
                <span className="font-mono text-lg font-bold text-rose-500 dark:text-rose-400">Rp 150K – 185K</span>
              </div>
              <p className="text-xs text-ts-muted">
                Harga tinggi bukan karena bahan yang mahal, melainkan karena tingginya biaya sewa toko fisik dan komisi perantara toko.
              </p>
              <div className="space-y-2.5 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-ts-muted mb-1 font-mono">
                    <span>Sewa Ruko &amp; Biaya Mall</span>
                    <span>35% (Rp 55.000)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ts-border overflow-hidden">
                    <div className="h-full bg-rose-500/70 w-[35%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-ts-muted mb-1 font-mono">
                    <span>Markup Toko &amp; SPG</span>
                    <span>25% (Rp 40.000)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ts-border overflow-hidden">
                    <div className="h-full bg-rose-500/50 w-[25%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-ts-krem font-medium mb-1 font-mono">
                    <span>⚠️ Kualitas Bahan Kaos &amp; Sablon</span>
                    <span className="text-rose-600 dark:text-rose-300 font-bold">Hanya 40% (Rp 60.000)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ts-border overflow-hidden">
                    <div className="h-full bg-rose-500 w-[40%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: TeeStock 100% Online D2C */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/10 dark:from-emerald-950/30 via-ts-surface to-ts-surfaceHover/60 border border-emerald-500/30 space-y-4 relative shadow-sm">
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-500 text-black font-mono text-[9px] font-black uppercase tracking-wider">
                THE HONEST VALUE
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">100% ONLINE D2C</span>
                  <h3 className="text-lg font-black text-ts-krem">TeeStock Apparel House</h3>
                </div>
                <span className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-400">Rp 99.000</span>
              </div>
              <p className="text-xs text-ts-kremMuted">
                Nol rupiah untuk sewa mall. 70% alokasi dana murni untuk katun NSA Heavyweight 24s tubular &amp; sablon in-house 155°C.
              </p>
              <div className="space-y-2.5 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400/80 mb-1 font-mono">
                    <span>Sewa Toko Fisik &amp; Mall</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-300">Rp 0 (0%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ts-border overflow-hidden">
                    <div className="h-full bg-emerald-500/20 w-[0%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-ts-krem font-medium mb-1 font-mono">
                    <span>✨ Garmen NSA 24s Original + Double Press 155°C</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">70% (Rp 69.000 - Maksimal!)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ts-border overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[70%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-ts-kremMuted mb-1 font-mono">
                    <span>Kemasan Polymailer Doff, QC &amp; Garansi 100%</span>
                    <span>30% (Rp 30.000)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-ts-border overflow-hidden">
                    <div className="h-full bg-ts-terracotta w-[30%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Workshop Origin Transparency Footer */}
          <div className="pt-4 border-t border-ts-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-ts-terracotta/20 text-ts-terracotta font-bold flex items-center justify-center font-mono text-xs border border-ts-terracotta/30">
                TS
              </div>
              <div>
                <span className="block text-xs font-bold text-ts-krem uppercase font-mono">TeeStock Central Studio Workshop</span>
                <span className="block text-[10px] text-ts-muted">Citayam Hub (Kab. Bogor / Depok) &amp; Satellite Hub (Bogor) • Pengiriman Online ke Seluruh Indonesia</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock! Saya ingin tanya produk kaos.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-ts-surfaceHover hover:bg-ts-border text-ts-krem border border-ts-border transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-ts-green" />
              <span>KONSULTASI CS WHATSAPP</span>
            </a>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: LEAD CAPTURE & VIP UPDATES (Newsletter Capture)
          ==================================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterCapture source="homepage_funnel" />
      </section>
    </div>
  );
}

