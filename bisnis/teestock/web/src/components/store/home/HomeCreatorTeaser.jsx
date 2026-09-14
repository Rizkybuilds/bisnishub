import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, DollarSign, ShieldCheck, Shirt, ExternalLink } from 'lucide-react';
import { Button } from '../../ui/Button';

export function HomeCreatorTeaser() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-ts-surface border border-ts-border p-6 sm:p-10 lg:p-12 shadow-sm transition-colors duration-300">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-ts-terracotta/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Narrative & Pitch */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-terracotta/10 border border-ts-terracotta/25 text-ts-terracotta text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CREATOR &amp; MERCH HOUSE // FLYWHEEL KOLABORASI</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-ts-krem tracking-tight leading-tight">
              Punya Desain Keren? <br className="hidden sm:inline" />
              <span className="text-ts-terracotta">Biar Kami yang Produksi &amp; Kirim.</span>
            </h2>

            <p className="text-xs sm:text-sm text-ts-kremMuted max-w-xl leading-relaxed">
              Kamu fokus menggambar dan bercerita ke audiensmu. TeeStock yang menanggung stok garmen New States Apparel, sablon in-house 155°C, kemasan polymailer, hingga kirim dari Depok ke seluruh Indonesia.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-ts-surfaceHover/60 border border-ts-border space-y-1">
                <div className="flex items-center gap-1.5 text-ts-terracotta font-mono text-[11px] font-bold">
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Modal Rp 0</span>
                </div>
                <p className="text-[11px] text-ts-kremMuted leading-tight">
                  Tanpa perlu beli stok kain atau mesin sablon sendiri.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-ts-surfaceHover/60 border border-ts-border space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Royalti Rp 25.000</span>
                </div>
                <p className="text-[11px] text-ts-kremMuted leading-tight">
                  Royalti bersih tiap helai kaos terjual, cair otomatis tiap bulan.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-ts-surfaceHover/60 border border-ts-border space-y-1">
                <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-mono text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% NSA 24s</span>
                </div>
                <p className="text-[11px] text-ts-kremMuted leading-tight">
                  Karya dicetak di atas katun murni tubular knit berstandar tinggi.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <Link to="/creator" className="w-full sm:w-auto">
                <Button size="md" variant="primary" icon={ArrowRight} className="w-full sm:w-auto justify-center font-bold text-xs shadow-sm">
                  Daftar Desain &amp; Hitung Royalti
                </Button>
              </Link>
              <Link to="/mitra" className="w-full sm:w-auto">
                <Button size="md" variant="secondary" icon={ExternalLink} className="w-full sm:w-auto justify-center font-bold text-xs border-ts-border bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem">
                  Skema Mitra Reseller
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Simulation Card Preview */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-ts-surfaceHover/40 border border-ts-border space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-ts-border pb-3">
                <span className="text-xs font-mono font-bold text-ts-krem uppercase tracking-wider">
                  Kalkulator Potensi Royalti
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                  Rp 25.000 / Kaos
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ts-kremMuted">Target Penjualan Drop:</span>
                  <span className="font-mono font-bold text-ts-krem">50 Kaos</span>
                </div>
                <div className="h-2 w-full bg-ts-border rounded-full overflow-hidden">
                  <div className="h-full bg-ts-terracotta rounded-full w-1/2" />
                </div>
                <div className="p-3.5 rounded-xl bg-ts-surface border border-ts-border flex items-center justify-between">
                  <span className="text-xs font-medium text-ts-kremMuted">Pendapatan Bersih Kreator:</span>
                  <span className="text-base sm:text-lg font-mono font-black text-ts-terracotta">
                    Rp 1.250.000
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-ts-kremMuted leading-relaxed border-t border-ts-border pt-3">
                💡 Cukup upload file PNG transparan (300 DPI). Sistem kami akan membuatkan mockup katalog siap rilis dan memasarkannya ke audiens nasional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
