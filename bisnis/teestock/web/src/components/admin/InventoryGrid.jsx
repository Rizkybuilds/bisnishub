import React, { useState } from 'react';
import { 
  Plus, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  ShoppingCart, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export function InventoryGrid({ onOpenRestock }) {
  const { inventory, updateStockCell, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('nsa_softstyle_30s');
  const [isCititexModalOpen, setIsCititexModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentGarment = GARMENT_TYPES[activeTab];

  const handleCellClick = (gKey, col, sz, currentVal) => {
    const input = prompt(`Update jumlah stok ${currentGarment.name} warna ${col} ukuran ${sz}:`, currentVal);
    if (input !== null && !isNaN(input)) {
      updateStockCell(gKey, col, sz, input);
    }
  };

  // Find all low stock items across all garments (stock <= 2 pcs)
  const lowStockItems = [];
  Object.entries(GARMENT_TYPES).forEach(([gKey, gObj]) => {
    if (gKey === 'supplies') return;
    const colors = gObj.colors || [];
    colors.forEach(colObj => {
      const col = colObj.name;
      const rowData = inventory[gKey]?.[col] || {};
      SIZES.forEach(sz => {
        const count = rowData[sz] || 0;
        if (count <= 2) {
          lowStockItems.push({
            garmentName: gObj.name,
            color: col,
            size: sz,
            currentStock: count,
            suggestedOrder: count === 0 ? 6 : 4
          });
        }
      });
    });
  });

  // Generate Cititex WhatsApp text
  const totalPcsToOrder = lowStockItems.reduce((sum, item) => sum + item.suggestedOrder, 0);
  const cititexOrderText = `Halo Cititex! Mau pesan restok kaos polos New State Apparel (NSA) untuk TeeStock:

${lowStockItems.map(item => `• ${item.garmentName} — ${item.color} (${item.size}): ${item.suggestedOrder} pcs (sisa stok: ${item.currentStock})`).join('\n')}

📦 Total Pesanan: ${totalPcsToOrder} pcs
Mohon info ketersediaan stok di gerai terdekat dan total tagihannya ya kak. Terima kasih!`;

  const handleCopyCititexText = () => {
    navigator.clipboard.writeText(cititexOrderText);
    setCopied(true);
    showToast("✅ Format pesanan Cititex berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Garment Selector Tabs & Actions */}
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

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={ShoppingCart}
            onClick={() => setIsCititexModalOpen(true)}
            className="border-ts-mustard/40 text-ts-mustard hover:bg-ts-mustard/10"
          >
            Order Belanja Cititex ({lowStockItems.length} Menipis)
          </Button>

          {onOpenRestock && (
            <Button size="sm" variant="cream" icon={Plus} onClick={onOpenRestock}>
              Catat Restok Bahan
            </Button>
          )}
        </div>
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
          <div className="text-[11px] text-ts-muted">Estimasi HPP Kaos Polos di Cititex:</div>
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

      {/* Cititex Order Helper Modal */}
      <Modal
        isOpen={isCititexModalOpen}
        onClose={() => setIsCititexModalOpen(false)}
        title="Daftar Belanja Kaos Polos ke Cititex"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="bg-ts-hitam/60 border border-ts-borderDim p-3 rounded-xl text-xs text-ts-muted flex items-center justify-between">
            <div>
              <span className="text-ts-krem font-bold block">Supplier Resmi: Cititex Indonesia</span>
              <span>Distributor resmi New State Apparel (Tanpa Minimal Order)</span>
            </div>
            <a
              href="https://cititex.com/id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ts-teal hover:underline flex items-center gap-1 text-[11px] font-bold shrink-0"
            >
              <span>Buka Cititex.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-6 text-center text-ts-muted text-xs bg-ts-surface/40 rounded-xl border border-ts-borderDim">
              🎉 Seluruh stok varian New State Apparel saat ini dalam kondisi aman (&gt; 2 pcs).
            </div>
          ) : (
            <>
              <div className="text-xs font-bold text-ts-krem flex justify-between">
                <span>Varian Perlu Restok Segera ({lowStockItems.length} Varian):</span>
                <span className="text-ts-mustard font-mono">Saran Order: {totalPcsToOrder} pcs</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {lowStockItems.map((item, idx) => (
                  <div key={idx} className="bg-ts-surface/60 border border-ts-borderDim p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-ts-krem">{item.garmentName}</strong>
                      <div className="text-[11px] text-ts-muted">{item.color} ({item.size})</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-ts-mustard font-bold">Pesan: +{item.suggestedOrder} pcs</div>
                      <div className="text-[10px] text-ts-muted">Sisa: {item.currentStock} pcs</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Text Preview to Copy */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ts-muted">Format WhatsApp ke Cititex:</label>
                <textarea
                  readOnly
                  rows={6}
                  value={cititexOrderText}
                  className="w-full bg-ts-hitam border border-ts-border rounded-xl p-3 text-xs font-mono text-ts-krem focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-ts-borderDim">
                <Button variant="secondary" onClick={() => setIsCititexModalOpen(false)}>
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  icon={copied ? Check : Copy}
                  onClick={handleCopyCititexText}
                >
                  {copied ? "Berhasil Disalin!" : "Salin Pesanan WhatsApp"}
                </Button>
                <a
                  href={`https://wa.me/6281280000581?text=${encodeURIComponent(cititexOrderText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-slate-950 hover:bg-[#20bd5a] transition-colors"
                >
                  Kirim ke WA Cititex
                </a>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
