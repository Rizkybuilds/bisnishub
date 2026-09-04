import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  ShoppingBag, 
  MessageSquare,
  Layers
} from 'lucide-react';
import { SERIES } from '../../constants/series';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../../components/ui/Button';
import { formatRupiah } from '../../utils/formatters';

export function HomePage() {
  const { catalog } = useAdmin();
  const featured = catalog.filter(p => p.featured || p.status === 'active').slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 border-b border-ts-border">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ts-terracotta/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-surface border border-ts-border text-xs font-semibold text-ts-krem animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>Koleksi Distro Print-on-Demand Resmi Batch 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ts-krem max-w-4xl mx-auto leading-tight">
            Identitas, Profesi & Fase Hidup <br />
            <span className="bg-gradient-to-r from-ts-terracotta via-ts-mustard to-ts-teal bg-clip-text text-transparent">
              Dalam Sehelai Kaos Premium.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-ts-muted max-w-2xl mx-auto leading-relaxed">
            Kaos streetwear berkualitas tinggi menggunakan bahan 100% Cotton New State Apparel (NSA) impor berpadu dengan sablon DTF Raster HD bertekstur lembut dan tahan cuci.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/katalog">
              <Button size="lg" variant="primary" icon={ShoppingBag}>
                Jelajahi 9 Series Desain
              </Button>
            </Link>
            <Link to="/custom-order">
              <Button size="lg" variant="secondary" icon={MessageSquare}>
                Pesan Sablon Custom
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9 Series Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ts-krem">9 Series Resmi TeeStock</h2>
          <p className="text-xs sm:text-sm text-ts-muted">
            Setiap desain dikurasi secara tematik sesuai perjalanan hidup, profesi, dan kegemaran kamu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERIES.map((s) => (
            <Link
              key={s.id}
              to={`/katalog?series=${s.id}`}
              className="p-5 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-muted/60 transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.badgeBg}`}>
                    SERIES #{s.code}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ts-muted group-hover:text-ts-terracotta group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-extrabold text-base text-ts-krem group-hover:text-ts-terracotta transition-colors">
                  {s.name}
                </h3>
                <p className="text-xs text-ts-muted mt-1">{s.tagline}</p>
              </div>
              <p className="text-[11px] text-ts-krem/70 mt-4 line-clamp-2 leading-relaxed">
                {s.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Drops Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-ts-krem">Desain Unggulan Terkini</h2>
            <p className="text-xs sm:text-sm text-ts-muted mt-1">Pilihan favorit komunitas dan best-seller bulan ini</p>
          </div>
          <Link to="/katalog" className="text-xs font-bold text-ts-terracotta hover:underline flex items-center gap-1">
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
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
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-ts-borderDim">
                  <span className="font-mono text-sm font-extrabold text-ts-krem">
                    {formatRupiah(product.priceRetail || product.price_retail || 99000)}
                  </span>
                  <span className="text-[10px] text-ts-muted">NSA 30s</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose TeeStock / Quality Specs */}
      <section className="bg-ts-surface border-y border-ts-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ts-krem">Standar Kualitas Tanpa Kompromi</h2>
            <p className="text-xs sm:text-sm text-ts-muted">
              Kami memproduksi setiap potong kaos dengan standar distro profesional di workshop kami sendiri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-ts-hitam/60 border border-ts-border rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-ts-terracotta/20 text-ts-terracotta flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ts-krem">100% Kaos Polos NSA Impor</h3>
              <p className="text-xs text-ts-muted leading-relaxed">
                Menggunakan New State Apparel Softstyle 30s dan Heavyweight 24s. Tanpa jahitan samping (tubular), rajutan benang ring spun lembut yang tidak panas dan tidak mudah melar.
              </p>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-border rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ts-krem">Heat Press Suhu Presisi</h3>
              <p className="text-xs text-ts-muted leading-relaxed">
                Di-press pada temperatur terkontrol 160°C dengan sistem dua kali pemanasan (double press) sehingga lem serbuk DTF meresap sempurna ke dalam serat katun dan tidak pecah.
              </p>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-border rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-ts-teal/20 text-ts-teal flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ts-krem">QC Ketat & Kemasan Distro</h3>
              <p className="text-xs text-ts-muted leading-relaxed">
                Setiap kaos melewati inspeksi visual, pembersihan sisa benang, pelipatan rapi, dimasukkan ke dalam polymailer tebal, dan disertai stiker hologram eksklusif.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
