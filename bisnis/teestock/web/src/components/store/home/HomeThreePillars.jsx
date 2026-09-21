import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShoppingBag, Package, Palette, ArrowRight } from 'lucide-react';
import { Button } from '@bisnishub/shared/components/ui/Button';

export function HomeThreePillars() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-ts-krem tracking-widest uppercase bg-ts-surface px-3 py-1 rounded-full border border-ts-border">
          <Layers className="w-3.5 h-3.5 text-ts-terracotta" />
          <span>THE THREE HOUSES // TEESTOCK ARCHITECTURE</span>
        </div>
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight uppercase">
          Arsitektur Koleksi TeeStock
        </h2>
        <p className="text-xs sm:text-sm text-ts-kremMuted leading-relaxed">
          Dari kurasi grafis bertema subkultur, garmen katun polos resmi, hingga laboratorium sablon satuan studio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: TeeStock Originals (The Hero) */}
        <div className="p-5 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-terracotta/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="space-y-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center border border-ts-terracotta/30">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-ts-terracotta uppercase tracking-wider">PILAR 01 // THE HERO ARCHIVE</span>
              <h3 className="text-lg sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                TeeStock Originals
              </h3>
              <p className="text-xs font-mono text-zinc-950 dark:text-white font-bold mt-1">
                Rp 99.000 / pcs
              </p>
            </div>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Koleksi kurasi grafis pilihan bertema subkultur di atas katun NSA 24s Heavyweight tubular. Karakter grafis tajam, kerah rib 2.2 cm anti-melar, dan sablon double-press 155°C.
            </p>
          </div>
          <Link to="/katalog">
            <Button size="md" variant="primary" icon={ArrowRight} className="w-full justify-center text-xs font-bold shadow-sm">
              Pilih Kaos Grafis (Rp 99K)
            </Button>
          </Link>
        </div>

        {/* Card 2: Official NSA Blanks (The Pure Foundation) */}
        <div className="p-5 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-teal-400/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="space-y-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-400/15 text-teal-600 dark:text-teal-300 flex items-center justify-center border border-teal-400/30">
              <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-300 uppercase tracking-wider">PILAR 02 // THE PURE FOUNDATION</span>
              <h3 className="text-lg sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                Official NSA Blanks
              </h3>
              <p className="text-xs font-mono text-zinc-950 dark:text-white font-bold mt-1">
                Mulai Rp 34.000 – Rp 52.000
              </p>
            </div>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Kanvas murni yang sama yang kami pakai untuk koleksi Originals. Kaos polos resmi New States Apparel (Softstyle 30s &amp; Heavyweight 24s) untuk pecinta siluet boxy minimalis.
            </p>
          </div>
          <Link to="/polos">
            <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center text-xs font-bold border-teal-400/30 text-teal-600 dark:text-teal-300 hover:bg-teal-400/10">
              Beli Kaos Polos NSA
            </Button>
          </Link>
        </div>

        {/* Card 3: Custom Atelier (The Studio Lab) */}
        <div className="p-5 sm:p-8 rounded-2xl bg-ts-surface border border-ts-border hover:border-ts-mustard/40 shadow-sm hover:shadow-elevation transition-all flex flex-col justify-between space-y-5 sm:space-y-6">
          <div className="space-y-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-ts-mustard/15 text-ts-mustard flex items-center justify-center border border-ts-mustard/30">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-ts-mustard uppercase tracking-wider">PILAR 03 // THE STUDIO LAB</span>
              <h3 className="text-lg sm:text-2xl font-black text-ts-krem uppercase tracking-tight mt-0.5">
                TeeStock Atelier
              </h3>
              <p className="text-xs font-mono text-zinc-950 dark:text-white font-bold mt-1">
                Rp 119.000 – Rp 139.000 / pcs
              </p>
            </div>
            <p className="text-xs text-ts-kremMuted leading-relaxed">
              Fasilitas heat press in-house kami terbuka untuk karyamu sendiri! Sablon DTF satuan tanpa minimum order untuk kreator, musisi, dan komunitas independen.
            </p>
          </div>
          <Link to="/custom-order">
            <Button size="md" variant="secondary" icon={ArrowRight} className="w-full justify-center text-xs font-bold border-ts-border hover:bg-ts-surfaceHover text-ts-krem">
              Konsultasi Studio Lab
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
