import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Code2, 
  Compass, 
  Package 
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { ProductCard } from '../ProductCard';

export function HomeCatalogShowcase({
  catalog,
  activeCategory,
  setActiveCategory,
  displayedProducts
}) {
  const categories = [
    { id: 'all', label: 'Semua Desain', icon: Flame },
    { id: 'statement', label: 'Graphic Statement', icon: Code2 },
    { id: 'subculture', label: 'Urban Subculture', icon: Sparkles },
    { id: 'outdoor', label: 'Outdoor Explorer', icon: Compass },
    { id: 'blank', label: 'Kaos Polos NSA', icon: Package },
  ];

  const getCategoryCount = (id) => {
    if (id === 'all') return catalog.filter(p => p.series !== 'blank' && p.status === 'active').length;
    if (id === 'blank') return catalog.filter(p => p.series === 'blank').length;
    return catalog.filter(p => p.series === id && p.status === 'active').length;
  };

  return (
    <section id="katalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 sm:gap-4 border-b border-ts-border pb-4 sm:pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-kremMuted bg-ts-surface px-3 py-1 rounded-full border border-ts-border mb-2">
            <Sparkles className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>BANYAK PILIHAN DESAIN // SATU STANDAR KUALITAS</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight">
            Koleksi Grafis Terkurasi untuk Sehari-hari
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted mt-1 max-w-2xl leading-relaxed">
            Pilih karya desain yang paling mewakili hobi dan ceritamu, atau ambil kaos polos New States Apparel original. Kualitas katun murni tubular knit tanpa jahitan samping, awet dicuci harian.
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

      {/* Category Filter Pills (Sticky on Scroll & Thumb-friendly with counts) */}
      <div className="sticky top-16 sm:top-20 z-20 bg-ts-hitam/90 backdrop-blur-md py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto no-scrollbar touch-pan-x border-y border-ts-border/60">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          const count = getCategoryCount(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-ts-krem text-ts-hitam shadow-sm border border-ts-krem'
                  : 'bg-ts-surface text-ts-kremMuted hover:text-ts-krem hover:bg-ts-surfaceHover border border-ts-border'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-ts-hitam' : 'text-ts-kremMuted'}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive
                    ? 'bg-ts-hitam/15 text-ts-hitam'
                    : 'bg-ts-surfaceHover text-ts-muted border border-ts-border'
                }`}>
                  {count}
                </span>
              )}
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
        <div className="p-8 sm:p-12 rounded-3xl bg-ts-surface border border-ts-border text-center space-y-4 max-w-xl mx-auto">
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
    </section>
  );
}
