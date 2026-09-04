import React, { useState } from 'react';
import { Plus, AlertTriangle, Layers, CheckCircle2 } from 'lucide-react';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/Button';

export function InventoryGrid({ onOpenRestock }) {
  const { inventory, updateStockCell } = useAdmin();
  const [activeTab, setActiveTab] = useState('nsa_softstyle_30s');

  const currentGarment = GARMENT_TYPES[activeTab];

  const handleCellClick = (gKey, col, sz, currentVal) => {
    const input = prompt(`Update jumlah stok ${currentGarment.name} warna ${col} ukuran ${sz}:`, currentVal);
    if (input !== null && !isNaN(input)) {
      updateStockCell(gKey, col, sz, input);
    }
  };

  return (
    <div className="space-y-6">
      {/* Garment Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ts-borderDim">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(GARMENT_TYPES).map(([key, g]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === key
                  ? 'bg-ts-terracotta text-white shadow-sm'
                  : 'bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {onOpenRestock && (
          <Button size="sm" variant="cream" icon={Plus} onClick={onOpenRestock}>
            Catat Restok Bahan
          </Button>
        )}
      </div>

      {/* Garment Details & Description */}
      <div className="bg-ts-surface border border-ts-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-sm text-ts-krem">
            <Layers className="w-4 h-4 text-ts-terracotta" />
            <span>{currentGarment.name}</span>
            <span className="font-mono text-xs text-ts-muted">({currentGarment.code})</span>
          </div>
          <p className="text-xs text-ts-muted mt-1 max-w-2xl">{currentGarment.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[11px] text-ts-muted">Estimasi HPP Kaos Polos:</div>
          <div className="font-mono text-base font-extrabold text-ts-terracotta">
            Rp {(currentGarment.baseCost || 0).toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Normal Garment Matrix (Warna x Ukuran) */}
      {activeTab !== 'supplies' ? (
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-ts-hitam/60 border-b border-ts-border text-ts-muted font-bold tracking-wider uppercase">
                  <th className="py-3.5 px-4">Warna NSA</th>
                  {SIZES.map(sz => (
                    <th key={sz} className="py-3.5 px-4 text-center font-mono">{sz}</th>
                  ))}
                  <th className="py-3.5 px-4 text-right">Total Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim">
                {currentGarment.colors.map(colorObj => {
                  const col = colorObj.name;
                  const rowData = inventory[activeTab]?.[col] || {};
                  const rowTotal = SIZES.reduce((sum, sz) => sum + (rowData[sz] || 0), 0);

                  return (
                    <tr key={col} className="hover:bg-ts-surfaceHover/50 transition-colors">
                      <td className="py-3 px-4 font-bold flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: colorObj.hex }}
                        />
                        <span className="text-ts-krem">{col}</span>
                      </td>

                      {SIZES.map(sz => {
                        const qty = rowData[sz] || 0;
                        let chipStyle = "bg-ts-green/15 text-ts-green border-ts-green/30";
                        if (qty === 0) chipStyle = "bg-ts-red/20 text-ts-red border-ts-red/40";
                        else if (qty <= 2) chipStyle = "bg-ts-mustard/20 text-ts-mustard border-ts-mustard/40";

                        return (
                          <td key={sz} className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleCellClick(activeTab, col, sz, qty)}
                              className={`w-10 h-7 rounded-lg border font-mono font-extrabold text-xs transition-transform active:scale-95 inline-flex items-center justify-center ${chipStyle}`}
                              title="Klik untuk ubah stok di tempat"
                            >
                              {qty}
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-3 px-4 text-right font-mono font-extrabold text-ts-krem">
                        {rowTotal} pcs
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Supplies Table */
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(inventory.supplies || {}).map(([name, val]) => (
              <div key={name} className="bg-ts-hitam/60 border border-ts-borderDim rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-ts-krem">{name}</div>
                  <div className="text-[11px] text-ts-muted mt-0.5">Batas Minimal: {val.Min} pcs</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-lg font-extrabold text-ts-green">{val.Ready} pcs</div>
                  {val.Ready <= val.Min && (
                    <span className="text-[10px] text-ts-red font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Perlu Order Ulang
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
