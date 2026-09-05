import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Package, Sparkles, ArrowUpDown, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SERIES } from '../../constants/series';
import { formatRupiah } from '../../utils/formatters';

export function CatalogPage() {
  const { catalog } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const seriesParam = searchParams.get('series') || 'all';

  const [search, setSearch] = useState('');
  const [activeSegment, setActiveSegment] = useState(() => {
    if (seriesParam === 'blank') return 'blank';
    if (seriesParam !== 'all') return 'graphics';
    return 'all';
  });
  const [activeSeries, setActiveSeries] = useState(seriesParam);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setActiveSeries(seriesParam);
    if (seriesParam === 'blank') {
      setActiveSegment('blank');
    } else if (seriesParam !== 'all') {
      setActiveSegment('graphics');
    }
  }, [seriesParam]);

  const handleSegmentChange = (segment) => {
    setActiveSegment(segment);
    if (segment === 'blank') {
      setActiveSeries('blank');
      searchParams.set('series', 'blank');
    } else if (segment === 'graphics') {
      if (activeSeries === 'blank' || activeSeries === 'all') {
        setActiveSeries('all');
        searchParams.delete('series');
      }
    } else {
      setActiveSeries('all');
      searchParams.delete('series');
    }
    setSearchParams(searchParams);
  };

  const handleSeriesClick = (id) => {
    setActiveSeries(id);
    if (id === 'all') {
      searchParams.delete('series');
    } else {
      searchParams.set('series', id);
    }
    setSearchParams(searchParams);
  };

  const blankCount = catalog.filter(p => p.series === 'blank').length;
  const graphicCount = catalog.filter(p => p.series !== 'blank').length;

  // Filter logic
  let filtered = catalog.filter(p => {
    // Search query match
    const matchQ = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.niche && p.niche.toLowerCase().includes(search.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

    // Segment match
    let matchSegment = true;
    if (activeSegment === 'blank') {
      matchSegment = p.series === 'blank';
    } else if (activeSegment === 'graphics') {
      matchSegment = p.series !== 'blank';
    }

    // Series match
    let matchS = true;
    if (activeSeries !== 'all' && activeSeries !== 'blank') {
      matchS = p.series === activeSeries;
    }

    return matchQ && matchSegment && matchS;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-ts-krem tracking-tight">Katalog Produk TeeStock</h1>
        <p className="text-xs sm:text-sm text-ts-muted max-w-2xl">
          Eksplorasi seluruh karya desain streetwear eksklusif dan koleksi Kaos Polos New States Apparel (NSA) 100% original garmen impor berkualitas.
        </p>

        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ts-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari model NSA, seri, tema hobi, profesi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ts-surface border border-ts-border rounded-xl pl-9 pr-9 py-2.5 text-xs text-ts-krem placeholder:text-ts-muted/60 focus:outline-none focus:border-ts-terracotta transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ts-muted hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-ts-muted flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-ts-terracotta" />
              <span>Urutkan:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-ts-surface border border-ts-border rounded-xl px-3 py-2 text-xs font-semibold text-ts-krem focus:outline-none focus:border-ts-terracotta cursor-pointer"
            >
              <option value="default">Rekomendasi Utama</option>
              <option value="price-asc">Harga: Rendah ke Tinggi</option>
              <option value="price-desc">Harga: Tinggi ke Rendah</option>
              <option value="name-asc">Nama: A ke Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Category Segment Pills */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-ts-surface/60 border border-ts-border rounded-2xl">
        <button
          onClick={() => handleSegmentChange('all')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSegment === 'all'
              ? 'bg-ts-terracotta text-white shadow'
              : 'text-ts-muted hover:text-ts-krem'
          }`}
        >
          Semua Produk ({catalog.length})
        </button>

        <button
          onClick={() => handleSegmentChange('blank')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSegment === 'blank'
              ? 'bg-ts-teal text-white shadow'
              : 'text-ts-muted hover:text-ts-krem'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Kaos Polos NSA ({blankCount})</span>
        </button>

        <button
          onClick={() => handleSegmentChange('graphics')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeSegment === 'graphics'
              ? 'bg-ts-mustard text-ts-hitam shadow'
              : 'text-ts-muted hover:text-ts-krem'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Desain Grafis Distro ({graphicCount})</span>
        </button>
      </div>

      {/* Secondary Series Pills (Shown when in 'all' or 'graphics') */}
      {activeSegment !== 'blank' && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-ts-muted uppercase tracking-wider">
            Filter Berdasarkan Series:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleSeriesClick('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                activeSeries === 'all'
                  ? 'bg-ts-surface text-ts-krem border border-ts-terracotta'
                  : 'bg-ts-hitam/60 text-ts-muted hover:text-ts-krem border border-ts-border'
              }`}
            >
              Semua Series
            </button>

            {SERIES.map(s => (
              <button
                key={s.id}
                onClick={() => handleSeriesClick(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  activeSeries === s.id
                    ? 'bg-ts-surface text-ts-krem border border-ts-terracotta'
                    : 'bg-ts-hitam/60 text-ts-muted hover:text-ts-krem border border-ts-border'
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
        <div className="py-20 text-center space-y-4 bg-ts-surface/40 border border-dashed border-ts-border rounded-2xl">
          <ShoppingBag className="w-10 h-10 text-ts-muted mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-ts-krem">Tidak ada produk yang cocok dengan filter atau pencarian Anda</p>
            <p className="text-xs text-ts-muted">Coba reset pencarian atau pilih kategori yang berbeda.</p>
          </div>
          <button
            onClick={() => {
              setSearch('');
              handleSegmentChange('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-ts-surface border border-ts-border hover:border-ts-terracotta text-ts-krem transition-all"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(product => {
            const isBlank = product.series === 'blank';
            const colorCount = product.colors ? product.colors.split(',').length : null;

            return (
              <Link
                key={product.sku}
                to={`/produk/${product.sku}`}
                className={`group bg-ts-surface border rounded-2xl overflow-hidden transition-all flex flex-col ${
                  isBlank ? 'hover:border-ts-teal/60' : 'hover:border-ts-terracotta/60'
                } border-ts-border shadow-lg`}
              >
                <div className="aspect-square bg-ts-hitam overflow-hidden relative">
                  <img
                    src={product.filePath || product.file_path}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ts-hitam/90 text-ts-krem border border-ts-border">
                    {product.sku}
                  </span>
                  {isBlank ? (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-ts-teal text-white">
                      {colorCount ? `${colorCount} Warna` : '100% NSA'}
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-ts-terracotta text-white">
                      DTF HD
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${
                      isBlank ? 'text-ts-teal' : 'text-ts-terracotta'
                    }`}>
                      {isBlank ? 'Kaos Polos NSA' : (product.seriesName || product.series)}
                    </div>
                    <h3 className={`text-sm font-bold text-ts-krem transition-colors mt-0.5 line-clamp-1 ${
                      isBlank ? 'group-hover:text-ts-teal' : 'group-hover:text-ts-terracotta'
                    }`}>
                      {product.name}
                    </h3>
                    {product.niche && (
                      <div className="text-[11px] text-ts-muted mt-0.5 line-clamp-1">{product.niche}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-ts-borderDim">
                    <div>
                      <div className="text-[10px] text-ts-muted">Harga Satuan</div>
                      <span className="font-mono text-sm font-extrabold text-ts-krem">
                        {formatRupiah(product.priceRetail || product.price_retail || 99000)}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                      isBlank 
                        ? 'bg-ts-hitam border-ts-border text-ts-krem group-hover:bg-ts-teal group-hover:text-white' 
                        : 'bg-ts-hitam border-ts-border text-ts-krem group-hover:bg-ts-terracotta group-hover:text-white'
                    }`}>
                      Detail &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
