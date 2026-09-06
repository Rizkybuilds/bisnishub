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
  const { inventory, updateStockCell, updateDtfFilmStock, showToast } = useAdmin();
  const [activeTab, setActiveTab] = useState('nsa_softstyle_30s');
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isDtfTab = activeTab === 'dtf_films';
  const currentGarment = GARMENT_TYPES[activeTab] || {};

  // DTF Films Calculation
  const dtfFilms = inventory.dtf_films || {};
  const dtfFilmEntries = Object.entries(dtfFilms);
  const totalDtfSheets = dtfFilmEntries.reduce((sum, [, item]) => sum + (Number(item.ready) || 0), 0);
  const totalDtfAssetValue = dtfFilmEntries.reduce((sum, [, item]) => sum + ((Number(item.ready) || 0) * (Number(item.unitCost) || 12000)), 0);
  const lowDtfItems = dtfFilmEntries.filter(([, item]) => (Number(item.ready) || 0) <= (Number(item.min) || 2));

  const handleCellClick = (gKey, col, sz, currentVal) => {
    const input = prompt(`Update jumlah stok ${currentGarment.name} warna ${col} ukuran ${sz}:`, currentVal);
    if (input !== null && !isNaN(input)) {
      updateStockCell(gKey, col, sz, input);
    }
  };

  const handleDtfStockClick = (sku, currentVal) => {
    const film = dtfFilms[sku];
    const input = prompt(`Update stok film DTF "${film?.name || sku}" (lembar):`, currentVal);
    if (input !== null && !isNaN(input)) {
      updateDtfFilmStock(sku, input);
    }
  };

  const handleQuickDtfDelta = (sku, delta) => {
    const film = dtfFilms[sku];
    const current = Number(film?.ready) || 0;
    const nextVal = Math.max(0, current + delta);
    updateDtfFilmStock(sku, nextVal);
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

  // Generate Supplier WhatsApp text
  const totalPcsToOrder = lowStockItems.reduce((sum, item) => sum + item.suggestedOrder, 0);
  const supplierOrderText = `Halo Admin Supplier NSA! Mau pesan restok kaos polos New States Apparel (NSA) untuk TeeStock:

${lowStockItems.map(item => `• ${item.garmentName} — ${item.color} (${item.size}): ${item.suggestedOrder} pcs (sisa stok: ${item.currentStock})`).join('\n')}

📦 Total Pesanan: ${totalPcsToOrder} pcs
Mohon info ketersediaan stok di gerai terdekat dan total tagihannya ya kak. Terima kasih!`;

  const handleCopySupplierText = () => {
    navigator.clipboard.writeText(supplierOrderText);
    setCopied(true);
    showToast("✅ Format pesanan supplier berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Garment Selector Tabs & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-ts-borderDim">
        <div className="flex flex-wrap items-center gap-2">
          {/* Garment Tabs */}
          {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([key, g]) => (
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

          {/* Dedicated DTF Films Tab */}
          <button
            onClick={() => setActiveTab('dtf_films')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'dtf_films'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-900/30'
                : 'bg-ts-surface hover:bg-ts-surfaceHover text-teal-400 border border-teal-500/30'
            }`}
          >
            <span>⚡ Stok Film DTF</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'dtf_films' ? 'bg-white/20 text-white' : 'bg-teal-500/20 text-teal-300'}`}>
              {totalDtfSheets} lbr
            </span>
          </button>

          {/* Supplies Tab */}
          {GARMENT_TYPES.supplies && (
            <button
              onClick={() => setActiveTab('supplies')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'supplies'
                  ? 'bg-ts-terracotta text-white shadow-sm'
                  : 'bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem border border-ts-border'
              }`}
            >
              {GARMENT_TYPES.supplies.name}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== 'dtf_films' ? (
            <Button
              size="sm"
              variant="secondary"
              icon={ShoppingCart}
              onClick={() => setIsSupplierModalOpen(true)}
              className="border-ts-mustard/40 text-ts-mustard hover:bg-ts-mustard/10"
            >
              Order Belanja Supplier NSA ({lowStockItems.length} Menipis)
            </Button>
          ) : (
            <a
              href="/admin/gang-sheet"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 transition-all"
            >
              <span>+ Rancang Roll Gang Sheet (1 Meter)</span>
            </a>
          )}

          {onOpenRestock && activeTab !== 'dtf_films' && (
            <Button size="sm" variant="cream" icon={Plus} onClick={onOpenRestock}>
              Catat Restok Bahan
            </Button>
          )}
        </div>
      </div>

      {/* Details & Description Banner */}
      {!isDtfTab && activeTab !== 'supplies' && (
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
            <div className="text-[11px] text-ts-muted">Estimasi HPP Kaos Polos NSA:</div>
            <div className="font-mono text-base font-extrabold text-ts-terracotta">
              Rp {(currentGarment.baseCost || 0).toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      )}

      {/* DTF Film Stock Summary Banner */}
      {isDtfTab && (
        <div className="bg-gradient-to-r from-teal-950/40 via-ts-surface to-ts-surface border border-teal-500/30 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ts-borderDim pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded uppercase font-mono mb-1">
                ⚡ Buffer Film Sablon Siap Press
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Persediaan Lembaran Film DTF per Desain
              </h3>
              <p className="text-xs text-ts-muted mt-0.5 max-w-2xl">
                Sisa potongan film dari cetak roll meteran (gang sheet) disimpan di map dokumen studio. Siap langsung di-press ke kaos tanpa harus ke vendor cetak lagi.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-ts-hitam/70 border border-teal-500/40 px-3.5 py-2 rounded-xl text-right">
                <div className="text-[10px] text-ts-muted font-mono uppercase">Total Nilai Aset Film</div>
                <div className="font-mono text-lg font-black text-teal-400">
                  Rp {totalDtfAssetValue.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl flex items-center justify-between">
              <span className="text-ts-muted">Total Lembar Ready:</span>
              <span className="font-mono text-base font-bold text-teal-400">{totalDtfSheets} lembar</span>
            </div>
            <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl flex items-center justify-between">
              <span className="text-ts-muted">Desain Menipis (&le; 2 lbr):</span>
              <span className="font-mono text-base font-bold text-amber-400">{lowDtfItems.length} SKU</span>
            </div>
            <div className="p-3 bg-ts-hitam/60 border border-ts-borderDim rounded-xl flex items-center justify-between">
              <span className="text-ts-muted">HPP Standar DTF A3:</span>
              <span className="font-mono text-base font-bold text-ts-krem">Rp 12.000 / lembar</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area Based on Active Tab */}
      {isDtfTab ? (
        /* DTF Film Inventory Table */
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-ts-borderDim flex items-center justify-between">
            <div className="text-xs font-bold text-ts-krem">
              Daftar Stok Lembar Film DTF Studio ({dtfFilmEntries.length} Item Terdaftar)
            </div>
            <span className="text-[10px] text-ts-muted">
              💡 Klik angka lembar untuk ubah cepat atau gunakan tombol +/-
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ts-hitam/60 text-ts-muted border-b border-ts-borderDim font-mono">
                <tr>
                  <th className="p-3 w-32">SKU</th>
                  <th className="p-3">Nama Artwork / Desain</th>
                  <th className="p-3 w-32">Ukuran Cetak</th>
                  <th className="p-3 text-right w-28">Alokasi HPP</th>
                  <th className="p-3 text-center w-40">Stok Ready</th>
                  <th className="p-3 text-right w-32">Nilai Aset</th>
                  <th className="p-3 text-center w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim">
                {dtfFilmEntries.map(([sku, item]) => {
                  const ready = Number(item.ready) || 0;
                  const min = Number(item.min) || 2;
                  const unitCost = Number(item.unitCost) || 12000;
                  const assetVal = ready * unitCost;

                  let statusBadge = "bg-teal-500/10 text-teal-400 border-teal-500/30";
                  let statusText = "Ready Aman";
                  if (ready === 0) {
                    statusBadge = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                    statusText = "Habis";
                  } else if (ready <= min) {
                    statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                    statusText = "Menipis";
                  }

                  return (
                    <tr key={sku} className="hover:bg-ts-surfaceHover/50 transition-colors">
                      <td className="p-3 font-mono font-bold text-ts-teal">{sku}</td>
                      <td className="p-3">
                        <strong className="text-white block">{item.name || sku}</strong>
                        <span className="text-[10px] text-ts-muted capitalize">Kategori: {item.category || 'graphic'}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-ts-kremMuted">{item.size || 'A3'}</td>
                      <td className="p-3 text-right font-mono text-ts-krem">
                        Rp {unitCost.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleQuickDtfDelta(sku, -1)}
                            className="w-6 h-6 rounded bg-ts-hitam hover:bg-ts-borderDim border border-ts-borderDim text-ts-muted hover:text-white font-mono text-xs flex items-center justify-center cursor-pointer transition-colors"
                            title="Kurang 1 lembar"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleDtfStockClick(sku, ready)}
                            className={`min-w-[44px] px-2 py-1 rounded-lg border font-mono text-xs font-black transition-all hover:scale-105 cursor-pointer ${
                              ready === 0
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                                : ready <= min
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                                  : 'bg-teal-500/15 text-teal-300 border-teal-500/40'
                            }`}
                            title="Klik untuk ubah jumlah stok lembar"
                          >
                            {ready} lbr
                          </button>
                          <button
                            onClick={() => handleQuickDtfDelta(sku, 1)}
                            className="w-6 h-6 rounded bg-ts-hitam hover:bg-ts-borderDim border border-ts-borderDim text-ts-muted hover:text-white font-mono text-xs flex items-center justify-center cursor-pointer transition-colors"
                            title="Tambah 1 lembar"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleQuickDtfDelta(sku, 5)}
                            className="px-1.5 h-6 rounded bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 font-mono text-[10px] flex items-center justify-center cursor-pointer transition-colors"
                            title="Tambah 5 lembar (hasil cetak roll)"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-teal-400">
                        Rp {assetVal.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab !== 'supplies' ? (
        /* Normal Garment Matrix (Warna x Ukuran) */
        <div className="bg-ts-surface border border-ts-border rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-ts-borderDim flex items-center justify-between">
            <div className="text-xs font-bold text-ts-krem">
              Matrix Stok Fisik Studio ({currentGarment.colors?.length || 0} Varian Warna)
            </div>
            <span className="text-[10px] text-ts-muted">
              💡 Klik angka kotak untuk update cepat stok
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ts-hitam/60 text-ts-muted border-b border-ts-borderDim font-mono">
                <tr>
                  <th className="p-3 w-44">Warna</th>
                  {SIZES.map(sz => (
                    <th key={sz} className="p-3 text-center w-20">{sz}</th>
                  ))}
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ts-borderDim">
                {currentGarment.colors?.map(colObj => {
                  const col = colObj.name;
                  const rowData = inventory[activeTab]?.[col] || {};
                  const totalRow = SIZES.reduce((acc, sz) => acc + (rowData[sz] || 0), 0);

                  return (
                    <tr key={col} className="hover:bg-ts-surfaceHover/50 transition-colors">
                      <td className="p-3 font-medium text-ts-krem flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                          style={{ backgroundColor: colObj.hex }}
                        />
                        <span>{col}</span>
                      </td>

                      {SIZES.map(sz => {
                        const count = rowData[sz] || 0;
                        const isStudioBufferFast = (activeTab === 'nsa_softstyle_30s' || activeTab === 'nsa_heavyweight_24s') &&
                          (col === 'Hitam' || col === 'Putih') &&
                          (sz === 'M' || sz === 'L' || sz === 'XL');

                        let badgeColor = "bg-ts-hitam text-ts-krem border-ts-borderDim";
                        if (count === 0) badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold";
                        else if (count <= 2) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                        else if (isStudioBufferFast) badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

                        return (
                          <td key={sz} className="p-2 text-center">
                            <button
                              onClick={() => handleCellClick(activeTab, col, sz, count)}
                              className={`w-12 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all hover:scale-105 cursor-pointer ${badgeColor}`}
                              title={`${currentGarment.name} - ${col} (${sz})\nKlik untuk ubah stok`}
                            >
                              {count}
                            </button>
                          </td>
                        );
                      })}

                      <td className="p-3 text-right font-mono font-bold text-ts-krem">
                        {totalRow} pcs
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Supplies Section */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {GARMENT_TYPES.supplies.items.map(sup => {
            const currentVal = inventory.supplies?.[sup.id] || 0;
            const isLow = currentVal <= sup.minStock;

            return (
              <div
                key={sup.id}
                className="bg-ts-surface border border-ts-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-ts-krem">{sup.name}</div>
                  <Package className="w-4 h-4 text-ts-muted" />
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-2xl font-black text-ts-krem">
                    {currentVal}{' '}
                    <span className="text-xs font-normal text-ts-muted">{sup.unit}</span>
                  </div>
                  {isLow && (
                    <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <AlertTriangle className="w-3 h-3" />
                      Menipis
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-ts-muted flex justify-between">
                  <span>Batas Aman:</span>
                  <span className="font-mono">{sup.minStock} {sup.unit}</span>
                </div>

                <button
                  onClick={() => {
                    const input = prompt(`Update stok ${sup.name} (${sup.unit}):`, currentVal);
                    if (input !== null && !isNaN(input)) {
                      updateStockCell('supplies', sup.id, 'qty', input);
                    }
                  }}
                  className="w-full py-1.5 rounded-lg bg-ts-hitam hover:bg-ts-surfaceHover border border-ts-borderDim text-xs font-bold text-ts-krem transition-colors"
                >
                  Update Stok Fisik
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Supplier Order Helper Modal */}
      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        title="Daftar Belanja Kaos Polos NSA"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="bg-ts-hitam/60 border border-ts-borderDim p-3 rounded-xl text-xs text-ts-muted flex items-center justify-between">
            <div>
              <span className="text-ts-krem font-bold block">Distributor Resmi New States Apparel (NSA)</span>
              <span>Garmen polos standar distro tanpa minimal order</span>
            </div>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-6 text-center text-ts-muted text-xs bg-ts-surface/40 rounded-xl border border-ts-borderDim">
              🎉 Seluruh stok varian New States Apparel saat ini dalam kondisi aman (&gt; 2 pcs).
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
                <label className="text-[11px] font-bold text-ts-muted">Format WhatsApp ke Supplier:</label>
                <textarea
                  readOnly
                  rows={6}
                  value={supplierOrderText}
                  className="w-full bg-ts-hitam border border-ts-border rounded-xl p-3 text-xs font-mono text-ts-krem focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-ts-borderDim">
                <Button variant="secondary" onClick={() => setIsSupplierModalOpen(false)}>
                  Tutup
                </Button>
                <Button
                  variant="primary"
                  icon={copied ? Check : Copy}
                  onClick={handleCopySupplierText}
                >
                  {copied ? "Berhasil Disalin!" : "Salin Pesanan WhatsApp"}
                </Button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(supplierOrderText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#25D366] text-slate-950 hover:bg-[#20bd5a] transition-colors"
                >
                  Kirim ke WA Supplier
                </a>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
