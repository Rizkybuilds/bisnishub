import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Search, Filter, Package, Sparkles, ArrowUpDown, X, Tag, Palette, CheckCircle2, RotateCcw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { SERIES } from '../../constants/series';
import { Button } from '../../components/ui/Button';
import { SEOHead } from '../../components/common/SEOHead';
import { ProductCard } from '../../components/store/ProductCard';

/**
 * Pure helper to determine true base retail price for exact sorting
 */
export function getProductBasePrice(product) {
  const isBlank = product?.series === 'blank';
  if (isBlank) {
    if (product?.sku === 'TS-BLK-3600' || product?.name?.includes('3600')) return 34000;
    if (product?.sku === 'TS-BLK-7200' || product?.name?.includes('7200')) return 49000;
    return product?.priceRetail || product?.price_retail || 49000;
  }
  return product?.pricePromo && product?.pricePromo > 0
    ? product.pricePromo
    : (product?.priceRetail || product?.price_retail || 99000);
}

/**
 * Pure helper for catalog filtering
 */
export function filterCatalogProducts({
  catalog,
  isBlankMode,
  search = '',
  activeSeries = 'all',
  selectedBlankModel = 'all'
}) {
  const blankProducts = catalog.filter(p => p.series === 'blank');
  const graphicProducts = catalog.filter(p => p.series !== 'blank' && p.status !== 'archived');
  const baseList = isBlankMode ? blankProducts : graphicProducts;

  return baseList.filter(p => {
    // Search query match
    const q = search.trim().toLowerCase();
    const matchQ = !q ||
      p.name?.toLowerCase().includes(q) ||
      p.sku?.toLowerCase().includes(q) ||
      (p.niche && p.niche.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q));

    // Secondary sub-filters
    let matchSub = true;
    if (isBlankMode) {
      if (selectedBlankModel !== 'all') {
        matchSub = p.sku === selectedBlankModel || p.name?.toLowerCase().includes(selectedBlankModel.toLowerCase());
      }
    } else {
      if (activeSeries !== 'all' && activeSeries !== 'blank') {
        matchSub = p.series === activeSeries;
      }
    }

    return matchQ && matchSub;
  });
}

/**
 * Pure helper for catalog sorting
 */
export function sortCatalogProducts(products, sortBy = 'default') {
  return [...products].sort((a, b) => {
    const priceA = getProductBasePrice(a);
    const priceB = getProductBasePrice(b);

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'newest') {
      const dateA = a.createdAt || a.created_at || '';
      const dateB = b.createdAt || b.created_at || '';
      if (dateA && dateB) return dateB.localeCompare(dateA);
      return (b.sku || '').localeCompare(a.sku || '');
    }
    if (sortBy === 'popularity') {
      const salesA = a.salesCount || a.sales_count || (a.series === 'statement' ? 50 : 10);
      const salesB = b.salesCount || b.sales_count || (b.series === 'statement' ? 50 : 10);
      return salesB - salesA;
    }
    return 0; // default order
  });
}

export function CatalogPage({ defaultSegment }) {
  const { catalog } = useStore();
  const { isPartner, profile } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const seriesParam = searchParams.get('series') || 'all';

  // Mode check: /polos vs /katalog
  const isBlankMode = location.pathname === '/polos' || defaultSegment === 'blank' || seriesParam === 'blank';

  const [search, setSearch] = useState('');
  const [activeSeries, setActiveSeries] = useState(seriesParam);
  const [selectedBlankModel, setSelectedBlankModel] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // Reset or sync series param when URL changes
  useEffect(() => {
    setActiveSeries(seriesParam);
  }, [seriesParam]);

  // Reset model filter when switching route modes
  useEffect(() => {
    setSelectedBlankModel('all');
  }, [isBlankMode]);

  const handleSeriesClick = (id) => {
    setActiveSeries(id);
    if (id === 'all') {
      searchParams.delete('series');
    } else {
      searchParams.set('series', id);
    }
    setSearchParams(searchParams);
  };

  const blankProducts = catalog.filter(p => p.series === 'blank');
  const graphicProducts = catalog.filter(p => p.series !== 'blank' && p.status !== 'archived');
  const blankCount = blankProducts.length;
  const graphicCount = graphicProducts.length;

  // Execute filtering & sorting
  const filtered = filterCatalogProducts({
    catalog,
    isBlankMode,
    search,
    activeSeries,
    selectedBlankModel
  });

  const sortedProducts = sortCatalogProducts(filtered, sortBy);

  const hasActiveFilters = Boolean(
    search ||
    (!isBlankMode && activeSeries !== 'all') ||
    (isBlankMode && selectedBlankModel !== 'all')
  );

  const resetAllFilters = () => {
    setSearch('');
    setActiveSeries('all');
    setSelectedBlankModel('all');
    searchParams.delete('series');
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8">
      <SEOHead
        title={
          isBlankMode
            ? "Official NSA Blanks Supply | Kaos Polos New States Apparel Original | TeeStock"
            : "TeeStock Originals // Graphic Archive — Heavyweight 24s | TeeStock"
        }
        description={
          isBlankMode
            ? "Beli kaos polos New States Apparel (NSA) Softstyle 30s & Heavyweight 24s Original Cititex. 100% katun tubular tanpa jahitan samping, eceran dan grosir lusinan."
            : "Koleksi kurasi grafis bertema TeeStock dalam 3 seri kurasi (Graphic Statement, Urban Subculture, Outdoor Explorer). Dicetak di atas garmen NSA Heavyweight 24s dengan sablon DTF double-press in-house 155°C."
        }
        keywords={
          isBlankMode
            ? ["kaos polos nsa", "kaos nsa 24s", "kaos nsa 30s", "kaos polos grosir", "kaos oversize"]
            : ["teestock originals", "curated graphic tees", "kaos dtf satuan", "streetwear apparel", "kaos nsa 24s"]
        }
        canonicalPath={isBlankMode ? "/polos" : "/katalog"}
      />

      {/* Two-Tab Top Switcher: Grafis vs Polos */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 sm:p-2 bg-ts-surface border border-ts-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Link
            to="/katalog"
            className={`flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !isBlankMode
                ? 'bg-ts-terracotta text-white shadow-sm border border-ts-terracotta'
                : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Desain Grafis ({graphicCount})</span>
          </Link>

          <Link
            to="/polos"
            className={`flex-1 sm:flex-initial min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isBlankMode
                ? 'bg-ts-teal text-white shadow-sm border border-ts-teal'
                : 'text-ts-muted hover:text-ts-krem hover:bg-ts-surfaceHover'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Kaos Polos NSA ({blankCount})</span>
          </Link>
        </div>

        {/* Quick Context Tip */}
        <div className="text-[11px] text-ts-muted hidden md:flex items-center gap-1.5 pr-2 font-mono">
          {isBlankMode ? (
            <span>💡 100% NSA Original Tubular Built-Up • Ecer &amp; Grosir</span>
          ) : (
            <span>✨ Sablon DTF Dual-Press 155°C di atas NSA Heavyweight 24s</span>
          )}
        </div>
      </div>

      {/* Title & Search Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-surface border border-ts-border text-[11px] font-semibold text-ts-krem">
          <Tag className={`w-3.5 h-3.5 ${isBlankMode ? 'text-ts-teal' : 'text-ts-terracotta'}`} />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase">
            {isBlankMode ? 'OFFICIAL BLANKS SUPPLY • 100% NEW STATES APPAREL' : 'CURATED GRAPHICS • THE ARCHIVE'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-ts-krem tracking-tight">
          {isBlankMode ? 'Official NSA Blanks Supply' : 'TeeStock Originals // Graphic Archive'}
        </h1>

        <p className="text-xs sm:text-sm text-ts-kremMuted max-w-2xl leading-relaxed">
          {isBlankMode
            ? '100% Katun New States Apparel (NSA) Original tanpa sambungan samping (tubular built-up). Pilihan katun combed Softstyle 30s sejuk (150 GSM) dan Heavyweight 24s berbobot mantap (180 GSM).'
            : 'Koleksi kurasi rilis grafis bertema subkultur di atas katun New States Apparel Heavyweight 24s tubular knit dengan sablon in-house 155°C.'}
        </p>

        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ts-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="catalog-search-input"
              aria-label={isBlankMode ? "Cari model kaos polos NSA" : "Cari desain grafis, tema, atau SKU"}
              placeholder={isBlankMode ? "Cari model NSA (Softstyle, Heavyweight, Longsleeve)..." : "Cari judul desain, seri, tema profesi, hobi..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ts-surface border border-ts-border rounded-2xl pl-10 pr-10 py-2.5 text-xs text-ts-krem placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta focus:ring-1 focus:ring-ts-terracotta transition-all shadow-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Hapus teks pencarian"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ts-muted hover:text-ts-krem cursor-pointer p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="catalog-sort-select" className="text-xs text-ts-muted flex items-center gap-1 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5 text-ts-terracotta" />
              <span>Urutkan:</span>
            </label>
            <select
              id="catalog-sort-select"
              aria-label="Pilihan pengurutan katalog"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-ts-surface border border-ts-border rounded-xl px-3 py-2 text-xs font-semibold text-ts-krem focus:outline-none focus:border-ts-terracotta cursor-pointer shadow-sm min-h-[38px]"
            >
              <option value="default">Rekomendasi Utama</option>
              <option value="popularity">Paling Populer (Best Seller)</option>
              <option value="newest">Rilis Terbaru</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="name-asc">Nama: A ke Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cross-Sell Banners */}
      {isBlankMode ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-ts-terracotta/20 via-ts-surface/80 to-transparent border border-ts-terracotta/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div>
            <span className="font-bold text-ts-krem block text-sm">Mau Tambah Sablon Custom di Kaos Polos Ini?</span>
            <span className="text-ts-kremMuted">TeeStock Atelier melayani sablon DTF in-house 155°C satuan &amp; lusinan tanpa minimum order kaku.</span>
          </div>
          <Link to="/custom-order">
            <Button size="sm" variant="primary" className="whitespace-nowrap shadow-sm min-h-[40px]">
              Konsultasi Custom Order &rarr;
            </Button>
          </Link>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-ts-teal/15 via-ts-surface/80 to-transparent border border-ts-teal/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div>
            <span className="font-bold text-ts-krem block text-sm">Hanya Butuh Kaos Polos Tanpa Sablon?</span>
            <span className="text-ts-kremMuted">Dapatkan bahan New States Apparel (NSA) Original Cititex mulai Rp 34.000 ecer &amp; grosir.</span>
          </div>
          <Link to="/polos">
            <Button size="sm" variant="secondary" className="border-ts-teal/30 text-ts-teal hover:bg-ts-teal/20 whitespace-nowrap min-h-[40px]">
              Buka Kaos Polos NSA &rarr;
            </Button>
          </Link>
        </div>
      )}

      {/* Sub-Filter Section */}
      {isBlankMode ? (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-ts-muted uppercase tracking-wider font-mono">
            Pilih Model &amp; Ketebalan Bahan NSA:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x" role="tablist" aria-label="Model garmen polos">
            <button
              type="button"
              onClick={() => setSelectedBlankModel('all')}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedBlankModel === 'all'
                  ? 'bg-ts-teal text-white border border-ts-teal shadow-sm'
                  : 'bg-ts-surface text-ts-muted hover:text-ts-krem border border-ts-border hover:bg-ts-surfaceHover'
              }`}
            >
              Semua Model ({blankCount})
            </button>
            {blankProducts.map(bm => (
              <button
                key={bm.sku}
                type="button"
                onClick={() => setSelectedBlankModel(bm.sku)}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedBlankModel === bm.sku
                    ? 'bg-ts-teal text-white border border-ts-teal shadow-sm'
                    : 'bg-ts-surface text-ts-muted hover:text-ts-krem border border-ts-border hover:bg-ts-surfaceHover'
                }`}
              >
                {bm.name.replace('New States Apparel ', '')}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-ts-muted uppercase tracking-wider font-mono">
            Filter Series Koleksi:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x" role="tablist" aria-label="Kategori series grafis">
            <button
              type="button"
              onClick={() => handleSeriesClick('all')}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeSeries === 'all'
                  ? 'bg-ts-terracotta text-white border border-ts-terracotta shadow-sm'
                  : 'bg-ts-surface text-ts-muted hover:text-ts-krem border border-ts-border hover:bg-ts-surfaceHover'
              }`}
            >
              Semua Series ({graphicCount})
            </button>

            {SERIES.filter(s => s.id !== 'blank').map(s => {
              const seriesCount = catalog.filter(p => p.series === s.id && p.status === 'active').length;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSeriesClick(s.id)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeSeries === s.id
                      ? 'bg-ts-terracotta text-white border border-ts-terracotta shadow-sm'
                      : 'bg-ts-surface text-ts-muted hover:text-ts-krem border border-ts-border hover:bg-ts-surfaceHover'
                  }`}
                >
                  <span>{s.name}</span>
                  {seriesCount > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      activeSeries === s.id ? 'bg-white/20 text-white' : 'bg-ts-surfaceHover text-ts-kremMuted'
                    }`}>
                      {seriesCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filter Chips & Counter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs font-mono text-ts-kremMuted border-t border-ts-border/60">
        <div className="flex items-center gap-2" role="status" aria-live="polite">
          <span className="font-bold text-ts-krem">
            Menampilkan {sortedProducts.length} dari {isBlankMode ? blankCount : graphicCount} produk
          </span>
          {hasActiveFilters && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-ts-terracotta/10 text-ts-terracotta font-bold border border-ts-terracotta/20">
              Filter Aktif
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ts-surface border border-ts-border text-[11px] text-ts-krem">
                <span>Cari: &ldquo;{search}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Hapus pencarian"
                  className="hover:text-ts-terracotta cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {!isBlankMode && activeSeries !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ts-surface border border-ts-border text-[11px] text-ts-krem">
                <span>Series: {activeSeries}</span>
                <button
                  type="button"
                  onClick={() => handleSeriesClick('all')}
                  aria-label="Hapus filter series"
                  className="hover:text-ts-terracotta cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {isBlankMode && selectedBlankModel !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-ts-surface border border-ts-border text-[11px] text-ts-krem">
                <span>Model: {selectedBlankModel}</span>
                <button
                  type="button"
                  onClick={() => setSelectedBlankModel('all')}
                  aria-label="Hapus filter model"
                  className="hover:text-ts-terracotta cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] text-ts-terracotta hover:underline inline-flex items-center gap-1 cursor-pointer pl-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="py-16 px-4 bg-ts-surface border border-dashed border-ts-border rounded-3xl max-w-xl mx-auto text-center space-y-5 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-ts-surfaceHover text-ts-terracotta flex items-center justify-center mx-auto border border-ts-border">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-ts-krem">
              {search 
                ? `Pencarian "${search}" Belum Ditemukan` 
                : (!isBlankMode && graphicCount === 0)
                  ? "Koleksi Drop Grafis Sedang Dikurasi"
                  : "Tidak Ada Produk yang Sesuai Filter"}
            </h3>
            <p className="text-xs text-ts-kremMuted max-w-md mx-auto leading-relaxed">
              {!isBlankMode && graphicCount === 0
                ? "Koleksi desain grafis kurasi sedang dipersiapkan untuk rilis batch perdana. Saat ini tersedia Kaos Polos NSA Original dan Layanan Custom Sablon DTF Satuan."
                : "Silakan sesuaikan kata kunci pencarian atau reset filter untuk melihat seluruh produk yang tersedia."}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center items-center">
            {!isBlankMode && (
              <Link to="/polos" className="w-full sm:w-auto">
                <Button variant="primary" size="sm" icon={Package} className="w-full sm:w-auto font-bold shadow-sm min-h-[44px]">
                  Lihat Kaos Polos NSA &rarr;
                </Button>
              </Link>
            )}
            <Link to="/custom-order" className="w-full sm:w-auto">
              <Button variant="secondary" size="sm" icon={Palette} className="w-full sm:w-auto font-bold border-ts-border min-h-[44px]">
                Cetak Desain Custom &rarr;
              </Button>
            </Link>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetAllFilters}
                className="w-full sm:w-auto text-xs min-h-[44px]"
              >
                Reset Semua Filter
              </Button>
            )}
          </div>
          {/* Popular Search Suggestions */}
          <div className="pt-3 border-t border-ts-border space-y-2">
            <span className="text-[10px] font-mono uppercase text-ts-muted tracking-wider block">Pencarian Populer:</span>
            <div className="flex flex-wrap justify-center gap-1.5 text-xs">
              {['NSA Premium Cotton 7200', 'NSA Softstyle 3600', 'Heavyweight 24s', 'Combed 30s', 'Custom Sablon'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearch(term)}
                  className="px-2.5 py-1 rounded-lg bg-ts-surface hover:bg-ts-surfaceHover text-ts-kremMuted hover:text-ts-krem border border-ts-border text-[11px] transition-all cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {sortedProducts.map(product => (
            <ProductCard
              key={product.sku}
              product={product}
              isBlank={product.series === 'blank'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
