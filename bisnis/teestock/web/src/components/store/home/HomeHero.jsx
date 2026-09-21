import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Package, 
  Palette, 
  CheckCircle2 
} from 'lucide-react';
import { Button } from '@bisnishub/shared/components/ui/Button';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';
import { getColorHex } from '@bisnishub/shared/constants/colors';

export function HomeHero({
  featuredProduct,
  heroColors,
  heroSelectedColor,
  setHeroSelectedColor,
  heroImage
}) {
  return (
    <section className="relative pt-4 sm:pt-12 pb-4 sm:pb-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
        {/* Left Column (7 cols): Editorial Typography, Value Prop, CTAs, Micro-Trust */}
        <div className="lg:col-span-7 text-left space-y-5 sm:space-y-6">
          {/* Release Badge: Curated Graphic Archive */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-ts-surface border border-ts-border backdrop-blur-xl text-xs text-ts-krem shadow-sm hover:border-ts-terracotta/40 transition-all max-w-full overflow-hidden opacity-0 animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5 text-ts-terracotta shrink-0" />
            <span className="font-mono text-[10px] sm:text-[11px] text-ts-terracotta font-black uppercase tracking-wider truncate">
              BANYAK PILIHAN DESAIN
            </span>
            <span className="text-ts-borderHover shrink-0">•</span>
            <span className="font-mono text-[9px] sm:text-[10px] text-ts-kremMuted font-bold uppercase tracking-wider truncate">
              SATU STANDAR KUALITAS
            </span>
          </div>

          {/* Hero Title & Value Proposition */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-ts-krem leading-[1.1] opacity-0 animate-fade-in-up-delay-1">
              Ratusan Desain, <span className="text-ts-terracotta">Satu Kualitas.</span>
            </h1>

            <p className="text-xs sm:text-base text-ts-kremMuted max-w-xl leading-relaxed font-normal opacity-0 animate-fade-in-up-delay-2">
              Kaos grafis pilihan untuk segala cerita dan hobi sehari-hari. Dibuat dari katun murni New States Apparel 24s tubular knit tanpa sambungan samping dengan in-house double-press 155°C di studio kami.
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
                fetchpriority="high"
                decoding="async"
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
              
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap" role="group" aria-label="Pilihan warna spotlight">
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
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer p-1"
                    >
                      <span
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          isSelected
                            ? 'ring-2 ring-ts-terracotta ring-offset-2 ring-offset-ts-surface scale-105'
                            : 'ring-1 ring-ts-border hover:ring-ts-borderHover opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span
                          className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full inline-block shadow-sm"
                          style={{ backgroundColor: hex }}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Studio Ready Status & Fit Note */}
            <div className="flex items-center justify-between text-[10px] font-mono text-ts-kremMuted px-1">
              <span className="inline-flex items-center gap-1 text-emerald-500 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready Stock Depok • H+1 Kirim</span>
              </span>
              <span className="text-ts-muted">Tubular Fit 24s</span>
            </div>

            {/* Link to detail */}
            <Link
              to={`/produk/${featuredProduct.sku}?color=${encodeURIComponent(heroSelectedColor)}`}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl bg-ts-surfaceHover text-ts-krem font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all border border-ts-border hover:border-white/20 active:scale-98"
            >
              <span>Buka Detail &amp; Order Kaos Ini</span>
              <ArrowRight className="w-3.5 h-3.5 text-ts-krem" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
