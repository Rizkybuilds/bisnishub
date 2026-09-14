import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Ruler, Sparkles, Check, Table, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { NSA_SIZE_SPECS } from '../../constants/garments';

export { NSA_SIZE_SPECS };

export function SizeCalculatorModal({ isOpen, onClose, onSelectSize, currentSize, availableSizes }) {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');
  const [fitPref, setFitPref] = useState('regular'); // 'slim', 'regular', 'oversize'
  const [activeTab, setActiveTab] = useState('calculator'); // 'calculator' or 'chart'

  const calculateSize = () => {
    const tb = parseFloat(height);
    const bb = parseFloat(weight);

    if (!tb || !bb || tb <= 0 || bb <= 0) return 'L';

    let baseSize = 'M';

    if (tb < 160) {
      if (bb < 52) baseSize = 'S';
      else if (bb <= 62) baseSize = 'M';
      else if (bb <= 72) baseSize = 'L';
      else if (bb <= 82) baseSize = 'XL';
      else if (bb <= 95) baseSize = '2XL';
      else if (bb <= 108) baseSize = '3XL';
      else if (bb <= 122) baseSize = '4XL';
      else baseSize = '5XL';
    } else if (tb <= 170) {
      if (bb < 56) baseSize = 'S';
      else if (bb <= 68) baseSize = 'M';
      else if (bb <= 78) baseSize = 'L';
      else if (bb <= 88) baseSize = 'XL';
      else if (bb <= 100) baseSize = '2XL';
      else if (bb <= 112) baseSize = '3XL';
      else if (bb <= 125) baseSize = '4XL';
      else baseSize = '5XL';
    } else if (tb <= 180) {
      if (bb < 62) baseSize = 'M';
      else if (bb <= 75) baseSize = 'L';
      else if (bb <= 86) baseSize = 'XL';
      else if (bb <= 98) baseSize = '2XL';
      else if (bb <= 112) baseSize = '3XL';
      else if (bb <= 126) baseSize = '4XL';
      else baseSize = '5XL';
    } else {
      if (bb < 68) baseSize = 'M';
      else if (bb <= 80) baseSize = 'L';
      else if (bb <= 92) baseSize = 'XL';
      else if (bb <= 104) baseSize = '2XL';
      else if (bb <= 116) baseSize = '3XL';
      else if (bb <= 130) baseSize = '4XL';
      else baseSize = '5XL';
    }

    const sizeOrder = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
    let idx = sizeOrder.indexOf(baseSize);

    if (fitPref === 'oversize' && idx < sizeOrder.length - 1) {
      idx += 1;
    } else if (fitPref === 'slim' && idx > 0) {
      idx -= 1;
    }

    return sizeOrder[idx];
  };

  const recommendedSize = calculateSize();
  const spec = NSA_SIZE_SPECS[recommendedSize] || NSA_SIZE_SPECS.L;

  const handleApply = () => {
    if (onSelectSize) {
      onSelectSize(recommendedSize);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Panduan Ukuran &amp; Fitting NSA"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-ts-krem">
        {/* Tab Selection */}
        <div className="flex rounded-xl bg-ts-surfaceHover p-1 border border-ts-border">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-ts-surface text-ts-krem shadow-sm border border-ts-border'
                : 'text-ts-kremMuted hover:text-ts-krem'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>Kalkulator TB / BB</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'chart'
                ? 'bg-ts-surface text-ts-krem shadow-sm border border-ts-border'
                : 'text-ts-kremMuted hover:text-ts-krem'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-ts-teal" />
            <span>Tabel Dimensi NSA</span>
          </button>
        </div>

        {activeTab === 'calculator' ? (
          <div className="space-y-5">
            {/* Inputs with Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 bg-ts-surfaceHover/60 p-3.5 rounded-2xl border border-ts-border">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-ts-kremMuted">Tinggi Badan</label>
                  <span className="font-mono font-black text-ts-krem text-sm">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="145"
                  max="205"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full accent-ts-terracotta cursor-pointer"
                />
              </div>

              <div className="space-y-2 bg-ts-surfaceHover/60 p-3.5 rounded-2xl border border-ts-border">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-ts-kremMuted">Berat Badan</label>
                  <span className="font-mono font-black text-ts-krem text-sm">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="150"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full accent-ts-terracotta cursor-pointer"
                />
              </div>
            </div>

            {/* Fit Preference */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-ts-kremMuted">Gaya Fitting Pilihan:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'slim', label: 'Slim Fit', sub: 'Pas Tubuh' },
                  { id: 'regular', label: 'Regular Fit', sub: 'Classic Asian Fit' },
                  { id: 'oversize', label: 'Oversized', sub: 'Longgar / Boxy' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFitPref(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      fitPref === f.id
                        ? 'bg-ts-terracotta/20 border-ts-terracotta text-ts-krem shadow-glow-terracotta ring-1 ring-ts-terracotta'
                        : 'bg-ts-surfaceHover/40 border-ts-border text-ts-kremMuted hover:bg-ts-surfaceHover hover:text-ts-krem'
                    }`}
                  >
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className="text-[10px] text-ts-muted mt-0.5">{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Result Box (21st.dev style card) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-ts-terracotta/15 via-ts-surface to-[#ECC369]/10 border border-ts-terracotta/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glass-inset">
              <div className="space-y-1 text-center sm:text-left w-full sm:w-auto">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-ts-mustard">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ukuran Paling Pas Buat Kamu:</span>
                </div>
                <div className="text-3xl font-black font-mono text-ts-krem flex items-baseline justify-center sm:justify-start gap-2">
                  <span>Size {recommendedSize}</span>
                  <span className="text-xs font-normal text-ts-muted font-sans">
                    ({fitPref === 'oversize' ? 'Boxy/Oversize' : fitPref === 'slim' ? 'Fit' : 'Regular Kasual'})
                  </span>
                </div>
                <div className="text-xs text-ts-kremMuted font-mono">{spec.desc}</div>
                {availableSizes && availableSizes.length > 0 && !availableSizes.includes(recommendedSize) && (
                  <div className="text-[11px] text-ts-mustard pt-1">
                    * Size {recommendedSize} tersedia di 8 warna utama (Black, White, Navy, Maroon, Red, Royal Blue, Forest Green, Carolina Blue).
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                icon={Check}
                onClick={handleApply}
                className="shrink-0 w-full sm:w-auto shadow-glow-terracotta"
              >
                Pilih Size {recommendedSize}
              </Button>
            </div>
          </div>
        ) : (
          /* Full NSA Size Chart Table */
          <div className="space-y-3">
            <p className="text-xs text-ts-muted leading-relaxed">
              Standar garmen New States Apparel Premium Cotton 7200 tubular built-up tanpa jahitan samping. Toleransi penjahitan pabrik &plusmn;1-2 cm.
            </p>
            <div className="overflow-x-auto rounded-xl border border-ts-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-ts-surfaceHover font-mono text-ts-kremMuted border-b border-ts-border">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Lebar Dada</th>
                    <th className="p-2.5">Panjang</th>
                    <th className="p-2.5">Lengan</th>
                    <th className="p-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ts-border font-mono">
                  {['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map((sz) => {
                    const s = NSA_SIZE_SPECS[sz];
                    const isSelected = currentSize === sz || (currentSize === 'XXL' && sz === '2XL');
                    const isAvail = !availableSizes || availableSizes.length === 0 || availableSizes.includes(sz);
                    return (
                      <tr
                        key={sz}
                        className={`hover:bg-ts-surfaceHover/50 transition-colors ${
                          isSelected ? 'bg-ts-terracotta/15 text-ts-krem font-bold' : ''
                        }`}
                      >
                        <td className="p-2.5 font-bold text-ts-terracotta">
                          <span>{sz}</span>
                          {!isAvail && (
                            <span className="block text-[8px] font-sans text-ts-muted font-normal">
                              8 Warna
                            </span>
                          )}
                        </td>
                        <td className="p-2.5">{s.chest} cm</td>
                        <td className="p-2.5">{s.length} cm</td>
                        <td className="p-2.5">{s.sleeve} cm</td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectSize) onSelectSize(sz);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-ts-surface border border-ts-border hover:border-ts-terracotta text-ts-krem transition-colors cursor-pointer"
                          >
                            Pilih {sz}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
