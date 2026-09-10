import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Package, Sparkles, ArrowUpDown, X, Tag, ArrowRight, Palette } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { SERIES } from '../../constants/series';
import { Button } from '../../components/ui/Button';
import { formatRupiah } from '../../utils/formatters';
import { SEOHead } from '../../components/common/SEOHead';
import { ProductCard } from '../../components/store/ProductCard';

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

  useEffect(() => {
    setActiveSeries(seriesParam);
  }, [seriesParam]);

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
  const graphicProducts = catalog.filter(p => p.series !== 'blank');
  const blankCount = blankProducts.length;
  const graphicCount = graphicProducts.length;

  // Filter logic strictly separated
  let filtered = (isBlankMode ? blankProducts : graphicProducts).filter(p => {
    // Search query match
    const matchQ = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.niche && p.niche.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    // Secondary sub-filters
    let matchSub = true;
    if (isBlankMode) {
      if (selectedBlankModel !== 'all') {
        matchSub = p.sku === selectedBlankModel || p.name.toLowerCase().includes(selectedBlankModel.toLowerCase());
      }
    } else {
      if (activeSeries !== 'all' && activeSeries !== 'blank') {
        matchSub = p.series === activeSeries;
      }
    }

    return matchQ && matchSub;
  });

  // Sorting logic
  filtered = [...filtered].sort((a, b) => {
    const priceA = a.priceRetail || a.price_retail || 0;
    const priceB = b.priceRetail || b.price_retail || 0;

    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    return 0; // default order
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEOHead
        title={
          isBlankMode
            ? "Katalog Kaos Polos New States Apparel (NSA) Original | TeeStock"
            : "Katalog Kaos Distro Desain Grafis Curated — Bahan NSA 24s | TeeStock"
        }
        description={
          isBlankMode
            ? "Beli kaos polos New States Apparel (NSA) Softstyle 30s & Heavyweight 24s Original Cititex. 100% katun tubular tanpa jahitan samping, eceran dan grosir lusinan."
            : "Koleksi kaos distro grafis curated TeeStock dalam 9 series tematik. Dicetak di atas garmen NSA Heavyweight 24s dengan sablon DTF HD suhu 155°C anti-pecah."
        }
        keywords={
          isBlankMode
            ? ["kaos polos nsa", "kaos nsa 24s", "kaos nsa 30s", "kaos polos grosir", "kaos oversize"]
            : ["katalog kaos distro", "kaos desain grafis", "kaos dtf satuan", "kaos streetwear lokal", "sablon dtf bandung"]
        }
        canonicalPath={isBlankMode ? "/polos" : "/katalog"}
      />

      {/* Two-Tab Top Switcher: Grafis vs Polos */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Link
            to="/katalog"
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !isBlankMode
                ? 'bg-ts-terracotta text-white shadow-glow-terracotta border border-white/20'
                : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Desain Grafis ({graphicCount})</span>
          </Link>

          <Link
            to="/polos"
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isBlankMode
                ? 'bg-ts-teal text-white shadow-glow-teal border border-white/20'
                : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Kaos Polos NSA ({blankCount})</span>
          </Link>
        </div>

        {/* Quick Context Tip */}
        <div className="text-[11px] text-ts-muted hidden md:flex items-center gap-1.5 pr-2">
          {isBlankMode ? (
            <span>💡 100% NSA Original tanpa sambungan samping, siap pakai atau disablon</span>
          ) : (
            <span>✨ Dicetak dengan sablon DTF HD suhu 155°C di atas bahan katun NSA</span>
          )}
        </div>
      </div>

      {/* Title & Search Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-ts-krem">
          <Tag className={`w-3.5 h-3.5 ${isBlankMode ? 'text-ts-teal' : 'text-ts-terracotta'}`} />
          <span>
            {isBlankMode ? 'OFFICIAL BLANKS • 100% NEW STATES APPAREL' : 'CURATED GRAPHICS • 9 SERIES THEMATIC'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {isBlankMode ? 'Katalog Kaos Polos NSA' : 'Katalog Desain Grafis Distro'}
        </h1>

        <p className="text-xs sm:text-sm text-ts-kremMuted max-w-2xl leading-relaxed">
          {isBlankMode
            ? '100% Katun New States Apparel (NSA) Original tanpa sambungan samping (tubular/built-up). Pilihan katun combed Softstyle 30s yang adem, Heavyweight 24s yang tebal garmen prima, hingga Heavyweight 20s boxy streetwear.'
            : 'Koleksi desain streetwear eksklusif terkurasi dalam 9 tema kepribadian. Dicetak menggunakan tinta DTF HD raster premium di atas bahan katun New States Apparel original.'}
        </p>

        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ts-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isBlankMode ? "Cari model NSA (Softstyle, Heavyweight, Longsleeve)..." : "Cari judul desain, seri, tema profesi, hobi..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ts-surface/90 border border-white/[0.1] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-ts-muted focus:outline-none focus:border-ts-terracotta focus:ring-1 focus:ring-ts-terracotta transition-all shadow-glass-inset"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ts-muted hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-ts-muted flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-ts-terracotta" />
              <span>Urutkan:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-ts-surface/90 border border-white/[0.1] rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-ts-terracotta cursor-pointer shadow-glass-inset"
            >
              <option value="default">Rekomendasi Utama</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="name-asc">Nama: A ke Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cross-Sell Banners */}
      {isBlankMode ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-ts-terracotta/20 via-ts-surface/80 to-transparent border border-ts-terracotta/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-glass-card shadow-glass-inset">
          <div>
            <span className="font-bold text-white block text-sm">Mau Tambah Sablon Custom di Kaos Polos Ini?</span>
            <span className="text-ts-kremMuted">TeeStock Studio melayani sablon DTF HD satuan &amp; lusinan (+Rp 25.000) tanpa minimal order kaku.</span>
          </div>
          <Link to="/custom-order">
            <Button size="sm" variant="primary" className="whitespace-nowrap shadow-glow-terracotta">
              Konsultasi Custom Order &rarr;
            </Button>
          </Link>
        </div>
      ) : (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-ts-teal/15 via-ts-surface/80 to-transparent border border-ts-teal/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-glass-card shadow-glass-inset">
          <div>
            <span className="font-bold text-white block text-sm">Hanya Butuh Kaos Polos Tanpa Sablon?</span>
            <span className="text-ts-kremMuted">Dapatkan bahan New States Apparel (NSA) Original Cititex mulai Rp 49.000 ecer &amp; grosir.</span>
          </div>
          <Link to="/polos">
            <Button size="sm" variant="secondary" className="border-ts-teal/30 text-teal-300 hover:bg-ts-teal/20 whitespace-nowrap">
              Buka Katalog Kaos Polos NSA &rarr;
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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedBlankModel('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedBlankModel === 'all'
                  ? 'bg-ts-teal text-white border border-ts-teal/50 shadow-glow-teal'
                  : 'bg-white/[0.03] text-ts-muted hover:text-white border border-white/[0.06]'
              }`}
            >
              Semua Model ({blankCount})
            </button>
            {blankProducts.map(bm => (
              <button
                key={bm.sku}
                type="button"
                onClick={() => setSelectedBlankModel(bm.sku)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedBlankModel === bm.sku
                    ? 'bg-ts-teal text-white border border-ts-teal/50 shadow-glow-teal'
                    : 'bg-white/[0.03] text-ts-muted hover:text-white border border-white/[0.06]'
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
            Filter Berdasarkan 9 Series Distro:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSeriesClick('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeSeries === 'all'
                  ? 'bg-ts-terracotta/20 text-white border border-ts-terracotta/50 shadow-glow-terracotta'
                  : 'bg-white/[0.03] text-ts-muted hover:text-white border border-white/[0.06]'
              }`}
            >
              Semua Series ({graphicCount})
            </button>

            {SERIES.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSeriesClick(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  activeSeries === s.id
                    ? 'bg-ts-terracotta/20 text-white border border-ts-terracotta/50 shadow-glow-terracotta'
                    : 'bg-white/[0.03] text-ts-muted hover:text-white border border-white/[0.06]'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 px-4 bg-ts-surface/60 border border-dashed border-white/10 rounded-3xl backdrop-blur-md max-w-xl mx-auto text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] text-ts-terracotta flex items-center justify-center mx-auto border border-white/10 shadow-glass-card">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white">
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
                <Button variant="primary" size="sm" icon={Package} className="w-full sm:w-auto font-bold shadow-glow-terracotta">
                  Lihat Kaos Polos NSA &rarr;
                </Button>
              </Link>
            )}
            <Link to="/custom-order" className="w-full sm:w-auto">
              <Button variant="secondary" size="sm" icon={Palette} className="w-full sm:w-auto font-bold border-white/15">
                Cetak Desain Custom &rarr;
              </Button>
            </Link>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setActiveSeries('all');
                  setSelectedBlankModel('all');
                }}
                className="w-full sm:w-auto text-xs"
              >
                Reset Filter
              </Button>
            )}
          </div>
          {/* Popular Search Suggestions */}
          <div className="pt-3 border-t border-white/[0.06] space-y-2">
            <span className="text-[10px] font-mono uppercase text-ts-muted tracking-wider block">Pencarian Populer:</span>
            <div className="flex flex-wrap justify-center gap-1.5 text-xs">
              {['NSA Premium Cotton 7200', 'NSA Softstyle 3600', 'Heavyweight 24s', 'Combed 30s', 'Custom Sablon'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearch(term)}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-ts-kremMuted hover:text-white border border-white/[0.06] text-[11px] transition-all cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filtered.map(product => (
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
