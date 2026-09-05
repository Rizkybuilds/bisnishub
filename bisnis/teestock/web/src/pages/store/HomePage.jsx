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
  CheckCircle2
} from 'lucide-react';
import { SERIES } from '../../constants/series';
import { useAdmin } from '../../context/AdminContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../../components/ui/Button';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function HomePage() {
  const { catalog } = useAdmin();
  const { storeSettings } = useStore();
  const featured = catalog.filter(p => p.featured || p.status === 'active').slice(0, 4);

  const cleanWhatsapp = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '081280000581');
  const shopeeUrl = storeSettings?.shopeeUrl || 'https://shopee.co.id';

  // Batch 1 Trilogy Products from catalog
  const batch1Skus = ['TS-PRO-001', 'TS-KOM-001', 'TS-LOK-001'];
  const batch1Products = batch1Skus.map(sku => catalog.find(p => p.sku === sku)).filter(Boolean);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 border-b border-ts-border">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ts-terracotta/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-surface border border-ts-border text-xs font-semibold text-ts-krem animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>Koleksi Distro Print-on-Demand Resmi Batch 1 (2026)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ts-krem max-w-4xl mx-auto leading-tight">
            Identitas, Profesi &amp; Passion <br />
            <span className="bg-gradient-to-r from-ts-terracotta via-ts-mustard to-ts-teal bg-clip-text text-transparent">
              Dalam Sehelai Kaos Premium.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-ts-muted max-w-2xl mx-auto leading-relaxed">
            Streetwear otentik menggunakan bahan resmi <strong>New State Apparel (NSA) Softstyle 30s</strong> dari distributor Cititex, berpadu sablon DTF HD Raster lentur, lembut, dan tanpa jahitan samping.
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
            {shopeeUrl && (
              <a href={shopeeUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" icon={ExternalLink} className="border-[#EE4D2D]/60 text-[#FF6E4E] hover:bg-[#EE4D2D]/10">
                  Toko Shopee Resmi
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Batch 1 Trilogy Launch Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-ts-surface via-ts-hitam to-ts-surface border border-ts-border rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ts-borderDim pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ts-mustard bg-ts-mustard/10 px-2.5 py-1 rounded-full border border-ts-mustard/30 mb-2">
                <Tag className="w-3.5 h-3.5" />
                <span>LAUNCHING BATCH 1 (3 NICHE TERPILIH)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ts-krem">
                Trilogi Peluncuran Perdana TeeStock
              </h2>
              <p className="text-xs sm:text-sm text-ts-muted mt-1 max-w-xl">
                Tiga desain terkurasi dari hasil riset scoring matrix. Siap dipress menggunakan bahan original NSA Softstyle katun combed 30s.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white shadow-md transition-all"
              >
                <span>Promo Shopee Rp 99.000</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batch1Products.map((p) => (
              <div key={p.sku} className="bg-ts-hitam/80 border border-ts-border rounded-2xl overflow-hidden flex flex-col group hover:border-ts-terracotta transition-all shadow-lg">
                <div className="aspect-square relative overflow-hidden bg-ts-surface">
                  <img
                    src={p.filePath}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-ts-hitam/90 text-ts-krem border border-ts-border">
                    {p.sku}
                  </span>
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-ts-terracotta text-white">
                    Sweet Spot Rp 99k
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-ts-muted uppercase tracking-wider">{p.niche}</span>
                    <h3 className="text-base font-bold text-ts-krem group-hover:text-ts-terracotta transition-colors mt-0.5">
                      {p.name}
                    </h3>
                    <p className="text-xs text-ts-muted mt-1.5 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-ts-borderDim flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-ts-muted">Harga Peluncuran:</div>
                      <div className="font-mono text-base font-extrabold text-ts-green">{formatRupiah(p.priceRetail)}</div>
                    </div>
                    <Link to={`/produk/${p.sku}`}>
                      <Button size="sm" variant="secondary" icon={ArrowRight}>
                        Pesan
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cititex NSA Trust Seal Banner */}
          <div className="p-4 bg-ts-surface border border-ts-borderDim rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-ts-krem">
              <div className="w-10 h-10 rounded-xl bg-ts-teal/20 text-ts-teal flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-sm">Standar Garmen Resmi New State Apparel (Cititex)</strong>
                <span className="text-ts-muted">100% Ring Spun Cotton • Tanpa Jahitan Samping (Built-Up) • Halus &amp; Adem</span>
              </div>
            </div>
            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Halo TeeStock! Saya mau pesan kaos Batch 1 langsung via WhatsApp.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-[#4EFA8A] bg-[#25D366]/20 hover:bg-[#25D366]/30 px-4 py-2 rounded-xl border border-[#25D366]/40 transition-colors shrink-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Order Langsung via WA (0% Fee)</span>
            </a>
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
              <h3 className="font-bold text-base text-ts-krem">100% Kaos Polos NSA Impor (Cititex)</h3>
              <p className="text-xs text-ts-muted leading-relaxed">
                Menggunakan New State Apparel Softstyle 30s resmi. Tanpa jahitan samping (tubular), rajutan benang ring spun lembut yang tidak panas dan tidak mudah melar.
              </p>
            </div>

            <div className="bg-ts-hitam/60 border border-ts-border rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-ts-mustard/20 text-ts-mustard flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-ts-krem">Heat Press Suhu Presisi 155°C</h3>
              <p className="text-xs text-ts-muted leading-relaxed">
                Di-press pada temperatur terkontrol 155°C dengan sistem dua kali pemanasan (double press) sehingga lem serbuk DTF meresap sempurna ke dalam serat katun dan tidak pecah.
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
