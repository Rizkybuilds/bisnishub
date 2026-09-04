import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { SERIES } from '../../constants/series';
import { formatRupiah } from '../../utils/formatters';

export function CatalogPage() {
  const { catalog } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const seriesParam = searchParams.get('series') || 'all';

  const [search, setSearch] = useState('');
  const [activeSeries, setActiveSeries] = useState(seriesParam);

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

  const filtered = catalog.filter(p => {
    const matchQ = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.niche && p.niche.toLowerCase().includes(search.toLowerCase()));
    const matchS = activeSeries === 'all' || p.series === activeSeries;
    return matchQ && matchS;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Search Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold text-ts-krem tracking-tight">Katalog Desain TeeStock</h1>
        <p className="text-xs sm:text-sm text-ts-muted max-w-2xl">
          Eksplorasi seluruh karya desain eksklusif yang dicetak di atas kaos katun New State Apparel original.
        </p>

        {/* Search & Filter Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-ts-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tema, profesi, hobi, atau judul desain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-ts-surface border border-ts-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-ts-krem placeholder:text-ts-muted/60 focus:outline-none focus:border-ts-terracotta"
          />
        </div>
      </div>

      {/* Series Filter Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleSeriesClick('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            activeSeries === 'all'
              ? 'bg-ts-terracotta text-white'
              : 'bg-ts-surface text-ts-krem/80 hover:bg-ts-surfaceHover border border-ts-border'
          }`}
        >
          Semua Series ({catalog.length})
        </button>

        {SERIES.map(s => (
          <button
            key={s.id}
            onClick={() => handleSeriesClick(s.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeSeries === s.id
                ? 'bg-ts-terracotta text-white'
                : 'bg-ts-surface text-ts-krem/80 hover:bg-ts-surfaceHover border border-ts-border'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-ts-surface/40 border border-dashed border-ts-border rounded-2xl">
          <ShoppingBag className="w-10 h-10 text-ts-muted mx-auto" />
          <p className="text-sm font-bold text-ts-krem">Tidak ada desain yang cocok dengan pencarian Anda</p>
          <p className="text-xs text-ts-muted">Coba gunakan kata kunci lain atau pilih series berbeda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map(product => (
            <Link
              key={product.sku}
              to={`/produk/${product.sku}`}
              className="group bg-ts-surface border border-ts-border rounded-2xl overflow-hidden hover:border-ts-muted/60 transition-all flex flex-col"
            >
              <div className="aspect-square bg-ts-hitam overflow-hidden relative">
                <img
                  src={product.filePath || product.file_path}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ts-hitam/80 text-ts-krem border border-ts-border">
                  {product.sku}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="text-[10px] font-bold text-ts-terracotta uppercase">{product.seriesName || product.series}</div>
                  <h3 className="text-sm font-bold text-ts-krem group-hover:text-ts-terracotta transition-colors mt-0.5">
                    {product.name}
                  </h3>
                  {product.niche && (
                    <div className="text-[11px] text-ts-muted mt-0.5">{product.niche}</div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-ts-borderDim">
                  <div>
                    <div className="text-[10px] text-ts-muted">Mulai dari</div>
                    <span className="font-mono text-sm font-extrabold text-ts-krem">
                      {formatRupiah(product.priceRetail || product.price_retail || 99000)}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-ts-hitam border border-ts-border text-ts-krem">
                    Detail &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
