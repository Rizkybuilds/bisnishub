import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Zap, 
  Package 
} from 'lucide-react';
import { useStore } from '@bisnishub/shared/context/StoreContext';
import { ScrollRevealSection } from '../../hooks/useScrollReveal';
import { sanitizePhoneNumber } from '@bisnishub/shared/utils/whatsappTemplates';
import { getAvailableColors, getCardPreviewImage } from '@bisnishub/shared/utils/productImages';
import { SEOHead } from '@bisnishub/shared/components/common/SEOHead';
import { MarqueeTicker } from '../../components/store/interactive/MarqueeTicker';
import { UnboxingShowcase } from '../../components/store/UnboxingShowcase';
import { NewsletterCapture } from '../../components/store/NewsletterCapture';

// Modular Home Sub-Components
import { HomeHero } from '../../components/store/home/HomeHero';
import { HomeTrustRibbon } from '../../components/store/home/HomeTrustRibbon';
import { HomeThreePillars } from '../../components/store/home/HomeThreePillars';
import { HomeCatalogShowcase } from '../../components/store/home/HomeCatalogShowcase';
import { HomeFabricComparison } from '../../components/store/home/HomeFabricComparison';
import { HomeCreatorTeaser } from '../../components/store/home/HomeCreatorTeaser';
import { HomeStudioManifesto } from '../../components/store/home/HomeStudioManifesto';
import { HomeFittingReviews } from '../../components/store/home/HomeFittingReviews';

export function HomePage() {
  const { catalog, storeSettings } = useStore();
  const [activeCategory, setActiveCategory] = React.useState('all');

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');

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

  // Filter products for the showcase grid (limit to 6)
  const displayedProducts = React.useMemo(() => {
    if (activeCategory === 'all') {
      return catalog.filter(p => p.series !== 'blank' && p.status === 'active').slice(0, 6);
    }
    if (activeCategory === 'blank') {
      return catalog.filter(p => p.series === 'blank').slice(0, 6);
    }
    return catalog.filter(p => p.series === activeCategory && p.status === 'active').slice(0, 6);
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
        description="Brand apparel kurasi dan studio sablon DTF cepat. 100% garmen New States Apparel (NSA) Heavyweight 24s & Softstyle 30s original tanpa jahitan samping. Beli ritel atau custom satuan."
        keywords={["kaos nsa 24s heavyweight", "kaos nsa softstyle 30s", "sablon dtf satuan", "curated graphic tees", "streetwear brand indonesia"]}
        canonicalPath="/"
        schema={homeSchema}
      />

      {/* Subtle Ambient Lighting Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[400px] bg-ts-terracotta/[0.12] blur-[140px] rounded-full" />
      </div>

      {/* 1. EDITORIAL SPLIT HERO */}
      <HomeHero
        featuredProduct={featuredProduct}
        heroColors={heroColors}
        heroSelectedColor={heroSelectedColor}
        setHeroSelectedColor={setHeroSelectedColor}
        heroImage={heroImage}
      />

      {/* 2. CUSTOMER TRUST RIBBON (4 Value Cards) */}
      <ScrollRevealSection>
        <HomeTrustRibbon />
      </ScrollRevealSection>

      {/* 3. EDITORIAL STUDIO TICKER */}
      <ScrollRevealSection>
        <MarqueeTicker items={tickerItems} speed={30} />
      </ScrollRevealSection>

      {/* 4. THE THREE HOUSES BENTO GRID (Originals, Blanks, Atelier) */}
      <ScrollRevealSection>
        <HomeThreePillars />
      </ScrollRevealSection>

      {/* 5. CURATED DROP CATALOG SHOWCASE WITH CATEGORY TABS */}
      <ScrollRevealSection>
        <HomeCatalogShowcase
          catalog={catalog}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          displayedProducts={displayedProducts}
        />
      </ScrollRevealSection>

      {/* 6. NSA FABRIC GUIDE (24s Heavyweight vs 30s Softstyle) */}
      <ScrollRevealSection>
        <HomeFabricComparison />
      </ScrollRevealSection>

      {/* 7. CREATOR & ARTIST FLYWHEEL TEASER */}
      <ScrollRevealSection>
        <HomeCreatorTeaser />
      </ScrollRevealSection>

      {/* 6. SENSORY UNBOXING SHOWCASE (The 4 Physical Touchpoints) */}
      <UnboxingShowcase />

      {/* 6. THE STUDIO MANIFESTO (Obsessive Craft, 180 GSM, 155°C) */}
      <ScrollRevealSection>
        <HomeStudioManifesto cleanWhatsapp={cleanWhatsapp} />
      </ScrollRevealSection>

      {/* 7. AUTHENTIC FITTING NOTES & CUSTOMER REVIEWS */}
      <ScrollRevealSection>
        <HomeFittingReviews />
      </ScrollRevealSection>

      {/* 8. THE ARCHIVE CLUB VIP NEWSLETTER CAPTURE */}
      <ScrollRevealSection className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterCapture source="homepage_funnel" />
      </ScrollRevealSection>
    </div>
  );
}
