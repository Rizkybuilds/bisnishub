import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Package, Sparkles, ArrowUpDown, X, Tag } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { SERIES } from '../../constants/series';
import { formatRupiah } from '../../utils/formatters';

export function CatalogPage() {
  const { catalog } = useAdmin();
  const { isPartner, profile } = useAuth();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title & Search Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-ts-krem">
          <Tag className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>OFFICIAL CATALOG • STREETWEAR &amp; BLANK APPAREL</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Katalog Lengkap TeeStock
        </h1>
        <p className="text-xs sm:text-sm text-ts-kremMuted max-w-2xl leading-relaxed">
          Eksplorasi seluruh karya desain streetwear eksklusif dan koleksi Kaos Polos New States Apparel (NSA) 100% original garmen impor berkualitas.
        </p>

        {/* Top Controls: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 pt-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ts-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari model NSA, seri, tema hobi, profesi..."
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

      {/* Main Category Segment Pills (21st.dev style glass segment) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/[0.03] border border-white/[0.08] rounded-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => handleSegmentChange('all')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSegment === 'all'
              ? 'bg-ts-terracotta text-white shadow-glow-terracotta border border-white/20'
              : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          Semua Koleksi ({catalog.length})
        </button>

        <button
          type="button"
          onClick={() => handleSegmentChange('blank')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSegment === 'blank'
              ? 'bg-ts-teal text-white shadow-glow-teal border border-white/20'
              : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Kaos Polos NSA ({blankCount})</span>
        </button>

        <button
          type="button"
          onClick={() => handleSegmentChange('graphics')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSegment === 'graphics'
              ? 'bg-ts-mustard text-zinc-950 shadow-glow-mustard border border-white/20'
              : 'text-ts-kremMuted hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Desain Grafis Distro ({graphicCount})</span>
        </button>
      </div>

      {/* Secondary Series Pills */}
      {activeSegment !== 'blank' && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-ts-muted uppercase tracking-wider font-mono">
            Filter Berdasarkan 9 Series:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => handleSeriesClick('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeSeries === 'all'
                  ? 'bg-white/[0.12] text-white border border-white/20'
                  : 'bg-white/[0.03] text-ts-muted hover:text-white border border-white/[0.06]'
              }`}
            >
              Semua Series
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
        <div className="py-20 text-center space-y-4 bg-ts-surface/40 border border-dashed border-white/[0.1] rounded-3xl backdrop-blur-md">
          <ShoppingBag className="w-10 h-10 text-ts-muted mx-auto" />
          <div className="space-y-1">
            <p className="text-base font-bold text-white">Tidak ada produk yang cocok dengan pencarian Anda</p>
            <p className="text-xs text-ts-kremMuted">Coba gunakan kata kunci lain atau reset filter pilihan.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              handleSegmentChange('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/[0.06] border border-white/10 hover:border-ts-terracotta text-white transition-all cursor-pointer"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(product => {
            const isBlank = product.series === 'blank';
            const colorCount = product.colors ? product.colors.split(',').length : null;

            return (
              <Link
                key={product.sku}
                to={`/produk/${product.sku}`}
                className={`group bg-ts-surface/75 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col hover:-translate-y-1 ${
                  isBlank ? 'hover:border-ts-teal/60' : 'hover:border-ts-terracotta/60'
                } border-white/[0.08] shadow-glass-card shadow-glass-inset`}
              >
                <div className="aspect-square bg-ts-hitam/70 overflow-hidden relative">
                  <img
                    src={product.filePath || product.file_path}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ts-hitam/90 text-white border border-white/10">
                    {product.sku}
                  </span>
                  {isBlank ? (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ts-teal/30 text-teal-200 border border-ts-teal/40">
                      {colorCount ? `${colorCount} Warna` : '100% NSA'}
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ts-terracotta/30 text-[#E2885E] border border-ts-terracotta/40">
                      DTF HD
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-wider font-mono ${
                      isBlank ? 'text-ts-teal' : 'text-ts-terracotta'
                    }`}>
                      {isBlank ? 'Kaos Polos NSA' : (product.seriesName || product.series)}
                    </div>
                    <h3 className={`text-sm font-bold text-white transition-colors mt-0.5 truncate ${
                      isBlank ? 'group-hover:text-ts-teal' : 'group-hover:text-ts-terracotta'
                    }`}>
                      {product.name}
                    </h3>
                    {product.niche && (
                      <div className="text-[11px] text-ts-kremMuted mt-0.5 truncate">{product.niche}</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <div>
                      {isPartner && !isBlank ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-ts-mustard font-bold uppercase font-mono">Mitra</span>
                            <span className="text-[10px] text-ts-muted line-through font-mono">
                              {formatRupiah(product.priceRetail || product.price_retail || 99000)}
                            </span>
                          </div>
                          <span className="font-mono text-sm font-black text-ts-green">
                            {formatRupiah(
                              profile?.partner_tier === 'reseller'
                                ? (product.priceReseller || product.price_reseller || 74000)
                                : (product.priceDropship || product.price_dropship || 87000)
                            )}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[10px] text-ts-muted">Harga Satuan</div>
                          <span className="font-mono text-sm font-extrabold text-ts-green">
                            {formatRupiah(product.priceRetail || product.price_retail || 99000)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border transition-colors ${
                      isBlank 
                        ? 'bg-white/[0.04] border-white/10 text-white group-hover:bg-ts-teal group-hover:text-zinc-950' 
                        : 'bg-white/[0.04] border-white/10 text-white group-hover:bg-ts-terracotta group-hover:text-white'
                    }`}>
                      Pesan &rarr;
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
