import React, { useState, useMemo } from 'react';
import { Ruler, Sparkles, ArrowRight, Check, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';

const SIZE_SPECS = {
  S: { chest: 47, length: 67, fit: 'Cocok untuk postur ramping atau look fitted.' },
  M: { chest: 50, length: 70, fit: 'Pilihan standar untuk tinggi 160-172 cm dengan berat 55-65 kg.' },
  L: { chest: 55, length: 73, fit: 'Paling favorit! Streetwear boxy fit tegap untuk tinggi 170-180 cm.' },
  XL: { chest: 60, length: 75, fit: 'Siluet streetwear leluasa untuk tinggi 175-185 cm atau berat 75-88 kg.' },
  XXL: { chest: 63, length: 77, fit: 'Ekstra lega di dada dan lengan, tetap proporsional.' },
  '3XL': { chest: 66, length: 80, fit: 'Ukuran maksimal NSA Heavyweight, sangat lapang dan kokoh.' },
};

export function InteractiveSizeRecommender() {
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(66);
  const [fitPreference, setFitPreference] = useState('boxy'); // 'slim', 'boxy', 'oversize'

  const recommendedSize = useMemo(() => {
    let base = 'L';

    // Simple height-weight index heuristic
    if (weight < 55 && height < 165) {
      base = 'S';
    } else if (weight < 65 && height < 173) {
      base = 'M';
    } else if (weight < 78 && height < 182) {
      base = 'L';
    } else if (weight < 90 && height < 188) {
      base = 'XL';
    } else if (weight < 100) {
      base = 'XXL';
    } else {
      base = '3XL';
    }

    const sizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
    let idx = sizes.indexOf(base);

    if (fitPreference === 'slim' && idx > 0) {
      idx -= 1;
    } else if (fitPreference === 'oversize' && idx < sizes.length - 1) {
      idx += 1;
    }

    return sizes[idx];
  }, [height, weight, fitPreference]);

  const currentSpec = SIZE_SPECS[recommendedSize] || SIZE_SPECS.L;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="rounded-3xl bg-ts-surface border border-ts-border p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-ts-terracotta/10 blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ts-terracotta/15 border border-ts-terracotta/30 text-xs font-mono font-bold text-ts-terracotta">
            <Ruler className="w-3.5 h-3.5" />
            <span>INTERACTIVE SIZE RECOMMENDER // NSA FIT GUIDE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-ts-krem tracking-tight">
            Temukan Ukuran Sempurna Kamu
          </h2>
          <p className="text-xs sm:text-sm text-ts-muted">
            Geser slider tinggi dan berat badanmu untuk mendapatkan rekomendasi ukuran New States Apparel (NSA) yang paling pas dan nyaman.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders Control (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Height Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-ts-krem flex items-center gap-1.5">
                  <User className="w-4 h-4 text-ts-terracotta" />
                  <span>Tinggi Badan:</span>
                </span>
                <span className="font-mono text-base font-bold text-ts-terracotta px-3 py-1 rounded-xl bg-ts-hitam/30 border border-ts-border">
                  {height} cm
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="195"
                step="1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full accent-ts-terracotta cursor-pointer"
                aria-label="Tinggi Badan dalam cm"
              />
              <div className="flex justify-between text-[10px] text-ts-muted font-mono">
                <span>150 cm</span>
                <span>170 cm</span>
                <span>195 cm</span>
              </div>
            </div>

            {/* Weight Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-ts-krem flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-ts-mustard" />
                  <span>Berat Badan:</span>
                </span>
                <span className="font-mono text-base font-bold text-ts-mustard px-3 py-1 rounded-xl bg-ts-hitam/30 border border-ts-border">
                  {weight} kg
                </span>
              </div>
              <input
                type="range"
                min="45"
                max="110"
                step="1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full accent-ts-mustard cursor-pointer"
                aria-label="Berat Badan dalam kg"
              />
              <div className="flex justify-between text-[10px] text-ts-muted font-mono">
                <span>45 kg</span>
                <span>75 kg</span>
                <span>110 kg</span>
              </div>
            </div>

            {/* Fit Preference Pills */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-ts-krem">Pilihan Tampilan / Siluet:</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { id: 'slim', label: 'Fitted (Ramping)' },
                  { id: 'boxy', label: 'Boxy (Rekomendasi)' },
                  { id: 'oversize', label: 'Baggy Oversize' },
                ].map((fit) => (
                  <button
                    key={fit.id}
                    type="button"
                    onClick={() => setFitPreference(fit.id)}
                    className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-bold ${
                      fitPreference === fit.id
                        ? 'bg-ts-terracotta/20 border-ts-terracotta text-ts-krem'
                        : 'bg-ts-hitam/20 border-ts-border text-ts-muted hover:border-ts-borderHover'
                    }`}
                  >
                    {fit.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Recommendation Output Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-ts-surface border border-ts-border space-y-5 shadow-xl text-center flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-ts-muted uppercase tracking-wider block">
                Rekomendasi Ukuran Kamu
              </span>
              
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-ts-terracotta to-[#8A3319] text-white font-mono text-4xl font-black shadow-glow-terracotta mx-auto">
                {recommendedSize}
              </div>

              <div className="pt-2">
                <div className="font-mono text-sm font-bold text-ts-krem">
                  Lebar: {currentSpec.chest} cm • Panjang: {currentSpec.length} cm
                </div>
                <p className="text-xs text-ts-muted mt-1 leading-relaxed">
                  {currentSpec.fit}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-ts-border space-y-3">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-ts-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-ts-green" />
                <span>Bebas tukar ukuran jika tidak pas di badan!</span>
              </div>

              <Link 
                to={`/katalog?size=${recommendedSize}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ts-terracotta hover:bg-ts-terracotta/90 text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <span>Lihat Produk Ukuran {recommendedSize}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
