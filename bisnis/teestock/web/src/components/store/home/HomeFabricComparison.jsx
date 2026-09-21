import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight, Check, Sparkles, Scale, Wind, HelpCircle } from 'lucide-react';
import { Button } from '@bisnishub/shared/components/ui/Button';

export const FABRIC_SPECS = {
  nsa24s: {
    id: 'nsa24s',
    name: 'NSA Heavyweight 24s',
    model: 'New States Apparel 7200',
    gsm: 180,
    yarnCount: '24s Ringspun Cotton',
    collarRib: '2.2 cm Heavyweight Rib',
    silhouette: 'Boxy, Tegap & Jatuh Kokoh',
    feel: 'Solid, Berbobot, Tidak Menerawang',
    construction: 'Tubular Knit (Tanpa Jahitan Samping)',
    recommendedFor: 'Streetwear, Grafis Subkultur, Penggunaan Kasual Sehari-hari yang Awet Bertahun-tahun',
    seriesUsage: 'TeeStock Originals & Premium Blanks',
    startingPrice: 'Rp 45.000 (Polos) / Rp 99.000 (Grafis)',
    badge: 'FLAGSHIP CHOICE'
  },
  nsa30s: {
    id: 'nsa30s',
    name: 'NSA Softstyle 30s',
    model: 'New States Apparel 3600',
    gsm: 150,
    yarnCount: '30s Ringspun Cotton',
    collarRib: '2.0 cm Comfort Rib',
    silhouette: 'Modern Fit, Lentur & Jatuh Santai',
    feel: 'Ultra Lembut, Dingin & Breathable',
    construction: 'Tubular Knit (Tanpa Jahitan Samping)',
    recommendedFor: 'Cuaca Panas Tropis, Daily Layering, Aktivitas Aktif, Pecinta Kaos Ringan & Adem',
    seriesUsage: 'Essential Blanks & Light Collection',
    startingPrice: 'Rp 34.000 (Polos)',
    badge: 'DAILY ADEM'
  }
};

export function HomeFabricComparison() {
  const [selectedFabric, setSelectedFabric] = useState('nsa24s');

  return (
    <section aria-labelledby="fabric-guide-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl bg-ts-surface border border-ts-border shadow-sm space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ts-border pb-5 sm:pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ts-surfaceHover border border-ts-border text-ts-terracotta text-[10px] font-mono font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>PANDUAN GARMEN // EDUKASI KAIN NSA</span>
            </div>
            <h2 id="fabric-guide-heading" className="text-xl sm:text-3xl lg:text-4xl font-black text-ts-krem tracking-tight uppercase">
              NSA 24s Heavyweight vs NSA 30s Softstyle
            </h2>
            <p className="text-xs sm:text-sm text-ts-kremMuted max-w-2xl leading-relaxed">
              Semua kaos kami 100% diproduksi dari garmen New States Apparel original tanpa jahitan samping. Pahami karakternya sebelum checkout:
            </p>
          </div>

          {/* Quick tab switcher for mobile */}
          <div className="flex md:hidden p-1 rounded-xl bg-ts-surfaceHover border border-ts-border w-full">
            <button
              type="button"
              onClick={() => setSelectedFabric('nsa24s')}
              className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                selectedFabric === 'nsa24s'
                  ? 'bg-ts-krem text-ts-hitam shadow-sm'
                  : 'text-ts-kremMuted hover:text-ts-krem'
              }`}
            >
              NSA 24s (180 GSM)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFabric('nsa30s')}
              className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                selectedFabric === 'nsa30s'
                  ? 'bg-ts-krem text-ts-hitam shadow-sm'
                  : 'text-ts-kremMuted hover:text-ts-krem'
              }`}
            >
              NSA 30s (150 GSM)
            </button>
          </div>
        </div>

        {/* Side-by-side comparison on desktop, Tab-driven on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card 1: NSA 24s Heavyweight */}
          <div
            className={`p-5 sm:p-7 rounded-2xl border transition-all space-y-5 flex flex-col justify-between ${
              selectedFabric === 'nsa24s' ? 'block' : 'hidden md:flex'
            } ${
              selectedFabric === 'nsa24s'
                ? 'bg-ts-surfaceHover/40 border-ts-terracotta/40 shadow-sm ring-1 ring-ts-terracotta/20'
                : 'bg-ts-surface border-ts-border opacity-90'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black text-ts-terracotta bg-ts-terracotta/10 border border-ts-terracotta/20">
                  {FABRIC_SPECS.nsa24s.badge}
                </span>
                <span className="text-[11px] font-mono text-ts-kremMuted">
                  {FABRIC_SPECS.nsa24s.model}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-2xl font-black text-ts-krem">
                  {FABRIC_SPECS.nsa24s.name}
                </h3>
                <p className="text-xs text-ts-terracotta font-mono font-bold mt-0.5">
                  180 GSM // Tebal, Kokoh, Boxy Look
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-ts-kremMuted border-t border-ts-border pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sensasi:</strong> {FABRIC_SPECS.nsa24s.feel}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Kerah Rib:</strong> {FABRIC_SPECS.nsa24s.collarRib} (tidak mudah mekar)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Konstruksi:</strong> {FABRIC_SPECS.nsa24s.construction}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Rekomendasi:</strong> {FABRIC_SPECS.nsa24s.recommendedFor}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-ts-border flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-ts-muted block font-mono">Mulai dari:</span>
                <span className="text-xs font-mono font-bold text-ts-krem">
                  {FABRIC_SPECS.nsa24s.startingPrice}
                </span>
              </div>
              <Link to="/katalog">
                <Button size="sm" variant="primary" icon={ArrowRight} className="text-xs font-bold">
                  Pilih Kaos 24s
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2: NSA 30s Softstyle */}
          <div
            className={`p-5 sm:p-7 rounded-2xl border transition-all space-y-5 flex flex-col justify-between ${
              selectedFabric === 'nsa30s' ? 'block' : 'hidden md:flex'
            } ${
              selectedFabric === 'nsa30s'
                ? 'bg-ts-surfaceHover/40 border-teal-400/40 shadow-sm ring-1 ring-teal-400/20'
                : 'bg-ts-surface border-ts-border opacity-90'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-black text-teal-600 dark:text-teal-300 bg-teal-400/10 border border-teal-400/20">
                  {FABRIC_SPECS.nsa30s.badge}
                </span>
                <span className="text-[11px] font-mono text-ts-kremMuted">
                  {FABRIC_SPECS.nsa30s.model}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-2xl font-black text-ts-krem">
                  {FABRIC_SPECS.nsa30s.name}
                </h3>
                <p className="text-xs text-teal-600 dark:text-teal-300 font-mono font-bold mt-0.5">
                  150 GSM // Lembut, Adem Tropis, Ringan
                </p>
              </div>

              <ul className="space-y-2.5 text-xs text-ts-kremMuted border-t border-ts-border pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sensasi:</strong> {FABRIC_SPECS.nsa30s.feel}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Kerah Rib:</strong> {FABRIC_SPECS.nsa30s.collarRib}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Konstruksi:</strong> {FABRIC_SPECS.nsa30s.construction}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Rekomendasi:</strong> {FABRIC_SPECS.nsa30s.recommendedFor}</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-ts-border flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-ts-muted block font-mono">Mulai dari:</span>
                <span className="text-xs font-mono font-bold text-ts-krem">
                  {FABRIC_SPECS.nsa30s.startingPrice}
                </span>
              </div>
              <Link to="/polos">
                <Button size="sm" variant="secondary" icon={ArrowRight} className="text-xs font-bold border-teal-400/30 text-teal-600 dark:text-teal-300 hover:bg-teal-400/10">
                  Pilih Kaos Polos 30s
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Guarantee / Guide Link */}
        <div className="p-4 rounded-xl bg-ts-surfaceHover/60 border border-ts-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5 text-xs text-ts-kremMuted">
            <HelpCircle className="w-4 h-4 text-ts-terracotta shrink-0" />
            <span>Masih ragu memilih ukuran atau bahan yang tepat?</span>
          </div>
          <Link
            to="/garansi-panduan-ukuran"
            className="text-xs font-mono font-bold text-ts-terracotta hover:underline inline-flex items-center gap-1"
          >
            <span>Buka Tabel Size Chart &amp; Garansi Lengkap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
