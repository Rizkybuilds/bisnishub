import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Ruler, Sparkles, Check, Table } from 'lucide-react';
import { Button } from '../ui/Button';

const NSA_SIZE_SPECS = {
  S: { chest: 47, length: 66, desc: 'Lebar 47 cm • Panjang 66 cm' },
  M: { chest: 50, length: 69, desc: 'Lebar 50 cm • Panjang 69 cm' },
  L: { chest: 53, length: 72, desc: 'Lebar 53 cm • Panjang 72 cm' },
  XL: { chest: 56, length: 74, desc: 'Lebar 56 cm • Panjang 74 cm' },
  XXL: { chest: 59, length: 76, desc: 'Lebar 59 cm • Panjang 76 cm' },
  '3XL': { chest: 62, length: 79, desc: 'Lebar 62 cm • Panjang 79 cm' },
};

export function SizeCalculatorModal({ isOpen, onClose, onSelectSize, currentSize }) {
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
      else baseSize = 'XXL';
    } else if (tb <= 170) {
      if (bb < 56) baseSize = 'S';
      else if (bb <= 68) baseSize = 'M';
      else if (bb <= 78) baseSize = 'L';
      else if (bb <= 90) baseSize = 'XL';
      else baseSize = 'XXL';
    } else if (tb <= 180) {
      if (bb < 62) baseSize = 'M';
      else if (bb <= 75) baseSize = 'L';
      else if (bb <= 88) baseSize = 'XL';
      else if (bb <= 100) baseSize = 'XXL';
      else baseSize = '3XL';
    } else {
      if (bb < 70) baseSize = 'L';
      else if (bb <= 85) baseSize = 'XL';
      else if (bb <= 102) baseSize = 'XXL';
      else baseSize = '3XL';
    }

    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
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
      title="Kalkulator Ukuran &amp; Panduan NSA"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6 text-ts-krem">
        {/* Tab Selection */}
        <div className="flex rounded-xl bg-ts-hitam p-1 border border-ts-border">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'calculator'
                ? 'bg-ts-surface text-ts-krem shadow'
                : 'text-ts-muted hover:text-ts-krem'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-ts-terracotta" />
            <span>Kalkulator TB / BB</span>
          </button>
          <button
            onClick={() => setActiveTab('chart')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'chart'
                ? 'bg-ts-surface text-ts-krem shadow'
                : 'text-ts-muted hover:text-ts-krem'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-ts-teal" />
            <span>Tabel Dimensi NSA</span>
          </button>
        </div>

        {activeTab === 'calculator' ? (
          <div className="space-y-5">
            {/* Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ts-muted">Tinggi Badan (cm):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="130"
                    max="220"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-ts-hitam border border-ts-border rounded-xl px-3 py-2 text-sm font-mono text-ts-krem focus:border-ts-terracotta outline-none"
                    placeholder="170"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ts-muted font-mono">
                    cm
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-ts-muted">Berat Badan (kg):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="35"
                    max="160"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-ts-hitam border border-ts-border rounded-xl px-3 py-2 text-sm font-mono text-ts-krem focus:border-ts-terracotta outline-none"
                    placeholder="65"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ts-muted font-mono">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Fit Preference */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ts-muted">Gaya Pakaian (Fitting):</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'slim', label: 'Slim Fit', sub: 'Pas Badan' },
                  { id: 'regular', label: 'Regular Fit', sub: 'Standar Kasual' },
                  { id: 'oversize', label: 'Oversized', sub: 'Longgar / Santai' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFitPref(f.id)}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      fitPref === f.id
                        ? 'bg-ts-terracotta/20 border-ts-terracotta text-ts-krem ring-1 ring-ts-terracotta'
                        : 'bg-ts-hitam border-ts-border text-ts-muted hover:border-ts-borderDim'
                    }`}
                  >
                    <div className="text-xs font-bold">{f.label}</div>
                    <div className="text-[10px] text-ts-muted mt-0.5">{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Result Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-ts-terracotta/15 via-ts-surface to-ts-mustard/10 border border-ts-terracotta/40 flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-ts-mustard">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rekomendasi Terbaik Untukmu:</span>
                </div>
                <div className="text-2xl font-black font-mono text-ts-krem flex items-baseline gap-2">
                  <span>Size {recommendedSize}</span>
                  <span className="text-xs font-normal text-ts-muted">
                    ({fitPref === 'oversize' ? 'Longgar/Boxy' : fitPref === 'slim' ? 'Fit' : 'Nyaman'})
                  </span>
                </div>
                <div className="text-xs text-ts-muted font-mono">{spec.desc}</div>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Check}
                onClick={handleApply}
                className="shrink-0"
              >
                Pilih Size {recommendedSize}
              </Button>
            </div>
          </div>
        ) : (
          /* Full NSA Size Chart Table */
          <div className="space-y-3">
            <p className="text-xs text-ts-muted">
              Standar garmen ekspor New States Apparel (NSA) tubular built-up tanpa jahitan samping. Toleransi penjahitan pabrik &plusmn;1-2 cm.
            </p>
            <div className="overflow-x-auto rounded-xl border border-ts-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-ts-hitam font-mono text-ts-muted border-b border-ts-border">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Lebar Dada</th>
                    <th className="p-2.5">Panjang Badan</th>
                    <th className="p-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ts-borderDim font-mono">
                  {Object.entries(NSA_SIZE_SPECS).map(([sz, s]) => (
                    <tr
                      key={sz}
                      className={`hover:bg-ts-surfaceHover transition-colors ${
                        currentSize === sz ? 'bg-ts-terracotta/10 text-white font-bold' : ''
                      }`}
                    >
                      <td className="p-2.5 font-bold text-ts-terracotta">{sz}</td>
                      <td className="p-2.5">{s.chest} cm</td>
                      <td className="p-2.5">{s.length} cm</td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => {
                            if (onSelectSize) onSelectSize(sz);
                            onClose();
                          }}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-ts-surface border border-ts-border hover:border-ts-terracotta text-ts-krem"
                        >
                          Pilih {sz}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
