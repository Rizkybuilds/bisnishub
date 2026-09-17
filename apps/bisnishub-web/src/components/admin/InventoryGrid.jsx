import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  AlertTriangle, 
  Layers, 
  ShoppingCart, 
  Copy, 
  Check, 
  Package, 
  ShieldAlert, 
  Lock, 
  Search, 
  X, 
  Scale,
  ShieldCheck
} from 'lucide-react';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { StockOpnameModal } from './StockOpnameModal';

export function InventoryGrid({ onOpenRestock }) {
  const { inventory, showToast, recordStockOpname } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('nsa_softstyle_30s');
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [auditLockModal, setAuditLockModal] = useState(null);
  const [opnameModalItem, setOpnameModalItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const isDtfTab = activeTab === 'dtf_films';
  const currentGarment = GARMENT_TYPES[activeTab] || {};

  // DTF Films Calculation
  const dtfFilms = inventory.dtf_films || {};
  const dtfFilmEntries = Object.entries(dtfFilms);
  const totalDtfSheets = dtfFilmEntries.reduce((sum, [, item]) => sum + (Number(item.ready) || 0), 0);
  const totalDtfAssetValue = dtfFilmEntries.reduce((sum, [, item]) => sum + ((Number(item.ready) || 0) * (Number(item.unitCost) || 12000)), 0);
  const lowDtfItems = dtfFilmEntries.filter(([, item]) => (Number(item.ready) || 0) <= (Number(item.min) || 2));

  // Open strict audit security modal
  const openAuditLock = (itemData) => {
    setAuditLockModal(itemData);
  };

  // Find all low stock items across all garments (stock <= 2 pcs)
  const lowStockItems = [];
  Object.entries(GARMENT_TYPES).forEach(([gKey, gObj]) => {
    if (gKey === 'supplies') return;
    const colors = gObj.colors || [];
    const garmentSizes = gObj.sizes || SIZES;
    colors.forEach(colObj => {
      const col = colObj.name;
      const rowData = inventory[gKey]?.[col] || {};
      garmentSizes.forEach(sz => {
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

  // Filtered colors for normal garment tab
  const filteredColors = (currentGarment.colors || []).filter(colObj => {
    if (!searchQuery.trim()) return true;
    return colObj.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Filtered DTF films for dtf tab
  const filteredDtfFilms = dtfFilmEntries.filter(([sku, item]) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return sku.toLowerCase().includes(q) || (item.name || '').toLowerCase().includes(q);
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
      {/* Garment Selector Tabs & Actions Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        {/* Left: Tab Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-white/[0.08]">
          {/* Garment Tabs */}
          {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([key, g]) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === key
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {g.name}
            </button>
          ))}

          {/* Dedicated DTF Films Tab */}
          <button
            onClick={() => {
              setActiveTab('dtf_films');
              setSearchQuery('');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'dtf_films'
                ? 'bg-sky-500 text-neutral-950 font-bold shadow-sm'
                : 'text-sky-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>⚡ Stok Film DTF</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'dtf_films' ? 'bg-neutral-950/30 text-neutral-950 font-bold' : 'bg-sky-500/20 text-sky-300'}`}>
              {totalDtfSheets} lbr
            </span>
          </button>

          {/* Supplies Tab */}
          {GARMENT_TYPES.supplies && (
            <button
              onClick={() => {
                setActiveTab('supplies');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'supplies'
                  ? 'bg-purple-500 text-white font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {GARMENT_TYPES.supplies.name}
            </button>
          )}
        </div>

        {/* Right: Search & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Search */}
          {activeTab !== 'supplies' && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isDtfTab ? "Cari SKU / Artwork DTF..." : "Cari Warna Kaos..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-7 py-1.5 bg-zinc-950 border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:border-amber-500/60 focus:outline-none w-44 sm:w-52 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {activeTab !== 'dtf_films' ? (
            <button
              type="button"
              onClick={() => setIsSupplierModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
              <span>Order NSA ({lowStockItems.length} Menipis)</span>
            </button>
          ) : (
            <Link
              to="/admin/gangsheet"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 transition-all"
            >
              <span>+ Rancang Roll Gang Sheet (1 Meter)</span>
            </Link>
          )}

          {onOpenRestock && activeTab !== 'dtf_films' && (
            <button
              type="button"
              onClick={onOpenRestock}
              className="px-3.5 py-1.5 rounded-lg text-xs font-black bg-white hover:bg-zinc-200 text-neutral-950 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-950" />
              <span>+ Catat Restok Bahan</span>
            </button>
          )}
        </div>
      </div>

      {/* Details & Description Banner */}
      {!isDtfTab && activeTab !== 'supplies' && (
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{currentGarment.name}</span>
              <span className="font-mono text-xs text-zinc-400">({currentGarment.code})</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{currentGarment.description}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[11px] text-zinc-400">Estimasi HPP Kaos Polos NSA:</div>
            <div className="font-mono text-base font-extrabold text-amber-400">
              Rp {(currentGarment.baseCost || 0).toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      )}

      {/* DTF Film Stock Summary Banner */}
      {isDtfTab && (
        <div className="bg-gradient-to-r from-sky-950/30 via-zinc-900 to-zinc-900 border border-sky-500/30 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-sky-400 bg-sky-500/15 px-2 py-0.5 rounded uppercase font-mono mb-1 border border-sky-500/20">
                ⚡ Buffer Film Sablon Siap Press
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Persediaan Lembaran Film DTF per Desain
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
                Sisa lembar film hasil cetak roll gang sheet meteran yang siap dipress kapan saja tanpa harus menunggu cetak vendor.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-zinc-950 border border-sky-500/40 px-3.5 py-2 rounded-xl text-right">
                <div className="text-[10px] text-zinc-400 font-mono uppercase">Total Nilai Aset Film</div>
                <div className="font-mono text-lg font-black text-sky-400">
                  Rp {totalDtfAssetValue.toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-zinc-950/70 border border-white/[0.08] rounded-xl flex items-center justify-between">
              <span className="text-zinc-400">Total Lembar Ready:</span>
              <span className="font-mono text-base font-bold text-sky-400">{totalDtfSheets} lembar</span>
            </div>
            <div className="p-3 bg-zinc-950/70 border border-white/[0.08] rounded-xl flex items-center justify-between">
              <span className="text-zinc-400">Desain Menipis (&le; 2 lbr):</span>
              <span className="font-mono text-base font-bold text-amber-400">{lowDtfItems.length} SKU</span>
            </div>
            <div className="p-3 bg-zinc-950/70 border border-white/[0.08] rounded-xl flex items-center justify-between">
              <span className="text-zinc-400">HPP Standar DTF A3:</span>
              <span className="font-mono text-base font-bold text-zinc-200">Rp 12.000 / lembar</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area Based on Active Tab */}
      {isDtfTab ? (
        /* DTF Film Inventory Table */
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-bold text-zinc-200">
              Daftar Stok Lembar Film DTF Studio ({filteredDtfFilms.length} Item Ditampilkan)
            </div>
            <span className="text-[10px] text-zinc-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Stok Dilindungi: Tambah via Pengadaan | Kurang via Order &amp; Cacat QC | Opname via Otorisasi</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-white/[0.08] font-mono">
                <tr>
                  <th className="p-3 w-32">SKU</th>
                  <th className="p-3">Nama Artwork / Desain</th>
                  <th className="p-3 w-32">Ukuran Cetak</th>
                  <th className="p-3 text-right w-28">Alokasi HPP</th>
                  <th className="p-3 text-center w-36">Stok Ready</th>
                  <th className="p-3 text-right w-32">Nilai Aset</th>
                  <th className="p-3 text-center w-28">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredDtfFilms.map(([sku, item]) => {
                  const ready = Number(item.ready) || 0;
                  const min = Number(item.min) || 2;
                  const unitCost = Number(item.unitCost) || 12000;
                  const assetVal = ready * unitCost;

                  let statusBadge = "bg-sky-500/10 text-sky-400 border-sky-500/30";
                  let statusText = "Ready Aman";
                  if (ready === 0) {
                    statusBadge = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                    statusText = "Habis";
                  } else if (ready <= min) {
                    statusBadge = "bg-amber-500/10 text-amber-400 border-amber-500/30";
                    statusText = "Menipis";
                  }

                  return (
                    <tr key={sku} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-mono font-bold text-sky-400">{sku}</td>
                      <td className="p-3">
                        <strong className="text-white block">{item.name || sku}</strong>
                        <span className="text-[10px] text-zinc-400 capitalize">Kategori: {item.category || 'graphic'}</span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-zinc-300">{item.size || 'A3'}</td>
                      <td className="p-3 text-right font-mono text-zinc-300">
                        Rp {unitCost.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => openAuditLock({
                              type: 'dtf_film',
                              title: item.name || sku,
                              sku: sku,
                              currentStock: ready,
                              unit: sku.includes('ROLL') ? 'meter' : 'lembar',
                              hpp: unitCost
                            })}
                            className={`min-w-[64px] px-2.5 py-1 rounded-lg border font-mono text-xs font-black transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5 ${
                              ready === 0
                                ? 'bg-rose-500/15 text-rose-400 border-rose-500/40'
                                : ready <= min
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
                                  : 'bg-sky-500/15 text-sky-300 border-sky-500/40'
                            }`}
                            title="Akses Terkunci: Klik untuk melihat status audit, jalur mutasi, atau rekam stock opname"
                          >
                            <Lock className="w-2.5 h-2.5 opacity-60" />
                            <span>{ready} {sku.includes('ROLL') ? 'm' : 'lbr'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-sky-400">
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
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
            <div className="text-xs font-bold text-zinc-200">
              Matrix Stok Fisik Studio ({filteredColors.length} Varian Warna Ditampilkan)
            </div>
            <span className="text-[10px] text-zinc-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Klik angka stok untuk melihat status audit / rekam stock opname fisik</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-white/[0.08] font-mono">
                <tr>
                  <th className="p-3 w-44">Warna</th>
                  {(currentGarment.sizes || SIZES).map(sz => (
                    <th key={sz} className="p-3 text-center w-20">{sz}</th>
                  ))}
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredColors.map(colObj => {
                  const col = colObj.name;
                  const rowData = inventory[activeTab]?.[col] || {};
                  const activeSizes = currentGarment.sizes || SIZES;
                  const totalRow = activeSizes.reduce((acc, sz) => acc + (rowData[sz] || 0), 0);

                  return (
                    <tr key={col} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-medium text-zinc-200 flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm shrink-0"
                          style={{ backgroundColor: colObj.hex }}
                        />
                        <span>{col}</span>
                      </td>

                      {activeSizes.map(sz => {
                        const count = rowData[sz] || 0;
                        const isStudioBufferFast = (activeTab === 'nsa_softstyle_30s' || activeTab === 'nsa_heavyweight_24s') &&
                          (col === 'Hitam' || col === 'Putih' || col === 'Black' || col === 'White') &&
                          (sz === 'M' || sz === 'L' || sz === 'XL');

                        let badgeColor = "bg-zinc-950 text-zinc-300 border-white/[0.08] hover:border-white/20";
                        if (count === 0) badgeColor = "bg-rose-500/15 text-rose-400 border-rose-500/40 font-bold";
                        else if (count <= 2) badgeColor = "bg-amber-500/15 text-amber-400 border-amber-500/40 font-bold";
                        else if (isStudioBufferFast) badgeColor = "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 font-bold";

                        return (
                          <td key={sz} className="p-2 text-center">
                            <button
                              onClick={() => openAuditLock({
                                type: 'blank_tshirt',
                                title: `${currentGarment.name} — ${col} (${sz})`,
                                sku: `${currentGarment.code || 'NSA'}-${col.toUpperCase().replace(/\s+/g, '')}-${sz}`,
                                currentStock: count,
                                unit: 'pcs',
                                hpp: currentGarment.baseCost || 37000,
                                garmentKey: activeTab,
                                color: col,
                                size: sz
                              })}
                              className={`w-12 py-1.5 rounded-lg border font-mono text-xs transition-all hover:scale-105 cursor-pointer ${badgeColor}`}
                              title={`${currentGarment.name} - ${col} (${sz})\nStok Fisik: ${count} pcs\nKlik untuk melihat status audit atau rekam opname`}
                            >
                              {count}
                            </button>
                          </td>
                        );
                      })}

                      <td className="p-3 text-right font-mono font-bold text-zinc-200">
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
            const rawVal = inventory.supplies?.[sup.id];
            const currentVal = typeof rawVal === 'object' && rawVal !== null ? (Number(rawVal.qty) || 0) : (Number(rawVal) || 0);
            const isLow = currentVal <= sup.minStock;

            return (
              <div
                key={sup.id}
                className="bg-zinc-900/60 border border-white/[0.08] rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">{sup.name}</div>
                  <Package className="w-4 h-4 text-zinc-400" />
                </div>

                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-2xl font-black text-white">
                    {currentVal}{' '}
                    <span className="text-xs font-normal text-zinc-400">{sup.unit}</span>
                  </div>
                  {isLow && (
                    <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <AlertTriangle className="w-3 h-3" />
                      Menipis
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-zinc-400 flex justify-between">
                  <span>Batas Aman:</span>
                  <span className="font-mono">{sup.minStock} {sup.unit}</span>
                </div>

                <button
                  onClick={() => openAuditLock({
                    type: 'supplies',
                    title: sup.name,
                    sku: sup.id === 'polymailer' ? 'MAT-POLY-30X40' : sup.id === 'sticker' ? 'MAT-STICKER-VP' : `MAT-${sup.id.toUpperCase()}`,
                    currentStock: currentVal,
                    unit: sup.unit,
                    hpp: sup.cost || 800,
                    supplyId: sup.id
                  })}
                  className="w-full py-2 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/[0.08] text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Audit &amp; Mutasi Stok</span>
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
        <div className="space-y-4 text-zinc-100">
          <div className="bg-zinc-950 border border-white/[0.08] p-3 rounded-xl text-xs text-zinc-400 flex items-center justify-between">
            <div>
              <span className="text-white font-bold block">Distributor Resmi New States Apparel (NSA)</span>
              <span>Garmen polos standar distro tanpa minimal order</span>
            </div>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="p-6 text-center text-zinc-400 text-xs bg-zinc-950/60 rounded-xl border border-white/[0.08]">
              🎉 Seluruh stok varian New States Apparel saat ini dalam kondisi aman (&gt; 2 pcs).
            </div>
          ) : (
            <>
              <div className="text-xs font-bold text-zinc-200 flex justify-between">
                <span>Varian Perlu Restok Segera ({lowStockItems.length} Varian):</span>
                <span className="text-amber-400 font-mono">Saran Order: {totalPcsToOrder} pcs</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {lowStockItems.map((item, idx) => (
                  <div key={idx} className="bg-zinc-950/80 border border-white/[0.08] p-2.5 rounded-lg flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white">{item.garmentName}</strong>
                      <div className="text-[11px] text-zinc-400">{item.color} ({item.size})</div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-amber-400 font-bold">Pesan: +{item.suggestedOrder} pcs</div>
                      <div className="text-[10px] text-zinc-400">Sisa: {item.currentStock} pcs</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Text Preview to Copy */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400">Format WhatsApp ke Supplier:</label>
                <textarea
                  readOnly
                  rows={6}
                  value={supplierOrderText}
                  className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/[0.08]">
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

      {/* Strict Zero-Leakage Audit Lock Modal */}
      <Modal
        isOpen={!!auditLockModal}
        onClose={() => setAuditLockModal(null)}
        title="Protokol Pengamanan Stok Terkunci (Zero Leakage)"
        maxWidth="max-w-lg"
      >
        {auditLockModal && (
          <div className="space-y-4 text-zinc-100">
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-300 block">
                  Perubahan Sembarangan Diblokir Demi Keamanan Audit Finansial
                </span>
                <p className="text-zinc-400 leading-relaxed">
                  Sesuai prinsip <strong className="text-white">Zero-Leakage</strong>, sistem mencegah manipulasi stok sepihak. Pilih jalur mutasi resmi di bawah ini:
                </p>
              </div>
            </div>

            {/* Item Details Box */}
            <div className="bg-zinc-950/80 border border-white/[0.08] p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <span className="text-zinc-400">Item / Komponen:</span>
                <strong className="text-white text-right">{auditLockModal.title}</strong>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <span className="text-zinc-400">Kode Master SKU:</span>
                <span className="font-mono text-sky-400">{auditLockModal.sku}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                <span className="text-zinc-400">Stok Fisik Sistem:</span>
                <span className="font-mono font-bold text-white">
                  {auditLockModal.currentStock} {auditLockModal.unit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Estimasi HPP Satuan:</span>
                <span className="font-mono text-zinc-200">
                  Rp {Number(auditLockModal.hpp || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Official Mutation Routes */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-zinc-300 block">Pilihan Aksi Sah Terverifikasi:</span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = auditLockModal;
                    setAuditLockModal(null);
                    setOpnameModalItem(target);
                  }}
                  className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] text-zinc-200 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <div className="text-left">
                      <strong className="text-amber-300 block">⚖️ Catat Stock Opname Fisik</strong>
                      <span className="text-zinc-400">Sesuaikan stok fisik rak dengan berita acara audit resmi</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    Opname
                  </span>
                </button>

                <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-zinc-300 flex items-start gap-2">
                  <span className="font-bold text-emerald-400 shrink-0">Penambahan:</span>
                  <span>Via <strong>Input Pengadaan / Restok PO</strong> resmi (kas berkurang, HPP dihitung).</span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-[11px] text-zinc-300 flex items-start gap-2">
                  <span className="font-bold text-rose-400 shrink-0">Pengurangan:</span>
                  <span>Otomatis via <strong>Pesanan Penjualan</strong> ATAU <strong>Cacat QC / Reject</strong>.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setAuditLockModal(null)}
              >
                Tutup
              </Button>
              <button
                onClick={() => {
                  setAuditLockModal(null);
                  navigate('/admin/defects');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>- Catat Cacat QC / Reject</span>
              </button>
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  const modalData = auditLockModal;
                  setAuditLockModal(null);
                  onOpenRestock?.(modalData);
                }}
              >
                + Buat PO Pengadaan (Restok)
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Authorized Stock Opname Modal */}
      <StockOpnameModal
        isOpen={!!opnameModalItem}
        onClose={() => setOpnameModalItem(null)}
        itemData={opnameModalItem}
        onSaveOpname={recordStockOpname}
      />
    </div>
  );
}

