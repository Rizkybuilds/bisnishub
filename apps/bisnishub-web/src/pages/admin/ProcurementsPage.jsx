import React, { useState } from 'react';
import { 
  Plus, 
  PackageCheck, 
  Layers, 
  Boxes, 
  Wallet, 
  Building2, 
  Search,
  Trash2,
  Sparkles,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { ProcurementIntakeModal } from '../../components/admin/ProcurementIntakeModal';
import { formatRupiah } from '../../utils/formatters';

export function ProcurementsPage() {
  const { procurements, addProcurement, removeProcurement } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 4 Founder Procurement Metrics
  const totalProcurementSpend = procurements.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  const blankProcurements = procurements.filter(p => p.itemType === 'blank_tshirt');
  const totalBlankPcs = blankProcurements.reduce((sum, p) => sum + (p.qty || 0), 0);
  const averageBlankLandedCost = totalBlankPcs > 0 
    ? Math.round(blankProcurements.reduce((sum, p) => sum + (p.totalCost || 0), 0) / totalBlankPcs) 
    : 0;
  const stickerProcurements = procurements.filter(p => p.itemType === 'sticker_vendor' || p.itemSku?.includes('STICKER'));
  const totalStickerPcs = stickerProcurements.reduce((sum, p) => sum + (p.qty || 0), 0);
  const packagingProcurements = procurements.filter(p => p.itemType === 'packaging');

  // Filter List
  const filtered = procurements.filter(p => {
    if (filterType !== 'all' && p.itemType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNo = p.procurementNo?.toLowerCase().includes(q);
      const matchName = p.itemName?.toLowerCase().includes(q);
      const matchSupplier = p.supplierName?.toLowerCase().includes(q);
      const matchNotes = p.notes?.toLowerCase().includes(q);
      return matchNo || matchName || matchSupplier || matchNotes;
    }
    return true;
  });

  return (
    <div>
      <AdminTopbar
        title="Pengadaan Bahan &amp; Biaya Pokok (BOM)"
        subtitle="Kelola belanja grosir kaos NSA, cetak stiker vendor luar, kemasan unboxing, dan kalkulasi landed cost otomatis"
        onNewDesign={() => setIsModalOpen(true)}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Executive Header Banner (21st.dev Monochrome) */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                  <Boxes className="w-3.5 h-3.5" /> SMART BOM &amp; PROCUREMENT ENGINE
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  Bill of Materials MultiGraph Holding
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Pusat Pengadaan Bahan Baku &amp; Landed Cost
              </h1>
              <p className="text-xs text-zinc-400 max-w-2xl mt-1 leading-relaxed">
                Catat belanja grosir kaos polos NSA (campur warna &amp; ukuran), kalkulasi yield stiker percetakan luar berbasis lembar A3+, 
                dan kemasan unboxing. Landed cost dialokasikan otomatis ke HPP riil produk.
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="shrink-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-zinc-950" />
                <span>+ Catat Pengadaan Baru</span>
              </button>
            </div>
          </div>

          {/* 4 Procurement Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-white/[0.08]">
            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Total Belanja Pengadaan
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {formatRupiah(totalProcurementSpend)}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                {procurements.length} Nota Pembelian
              </span>
            </div>

            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Kaos Polos NSA Masuk
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {totalBlankPcs} pcs
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                {(totalBlankPcs / 12).toFixed(1)} Lusin Terdata
              </span>
            </div>

            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Rata-Rata Landed Cost Kaos
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {formatRupiah(averageBlankLandedCost)}
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                Termasuk Beban Ongkir Cargo
              </span>
            </div>

            <div className="bg-black/30 p-3.5 rounded-xl border border-white/[0.05]">
              <span className="text-[11px] text-zinc-400 font-medium block">
                Stiker &amp; Kemasan Fisik
              </span>
              <div className="text-xl font-mono font-black text-white mt-1">
                {totalStickerPcs} pcs stiker
              </div>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                {packagingProcurements.length} Pengadaan Kemasan
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121215] border border-white/[0.08] p-3 rounded-2xl">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua Nota' },
              { id: 'blank_tshirt', label: '👕 Kaos Polos' },
              { id: 'sticker_vendor', label: '🏷️ Stiker Vendor Luar' },
              { id: 'packaging', label: '📦 Kemasan & Polymailer' },
              { id: 'dtf_film', label: '🖨️ Roll Film DTF' },
              { id: 'design_license', label: '🎨 Lisensi Desain' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterType === f.id
                    ? 'bg-white text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari PO / barang / vendor / resi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white"
            />
          </div>
        </div>

        {/* Procurements Table */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4 font-bold">No. PO &amp; Tanggal</th>
                  <th className="py-3 px-4 font-bold">Bahan / Uraian Item</th>
                  <th className="py-3 px-4 font-bold">Vendor / Supplier</th>
                  <th className="py-3 px-4 text-center font-bold">Jumlah Masuk</th>
                  <th className="py-3 px-4 text-right font-bold">Total Nota + Ongkir</th>
                  <th className="py-3 px-4 text-right font-bold">Landed Cost Riil</th>
                  <th className="py-3 px-4 text-center font-bold">Sumber Kas</th>
                  <th className="py-3 px-4 text-center font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-zinc-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-zinc-500 text-xs">
                      Belum ada riwayat pengadaan bahan yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-white">{p.procurementNo}</div>
                        <div className="text-[10px] text-zinc-500">
                          {new Date(p.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-white">{p.itemName}</div>
                        
                        {/* Wholesale Matrix Multi-Item Badges */}
                        {p.itemsBreakdown && p.itemsBreakdown.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {p.itemsBreakdown.slice(0, 5).map((item, idx) => (
                              <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
                                {item.color} ({item.size}) &times;{item.qty}
                              </span>
                            ))}
                            {p.itemsBreakdown.length > 5 && (
                              <span className="text-[9px] font-mono text-zinc-500 self-center">
                                +{p.itemsBreakdown.length - 5} varian lagi
                              </span>
                            )}
                          </div>
                        )}

                        {/* Outsource Sticker A3+ Yield Badge */}
                        {p.yieldCalculation && (
                          <div className="text-[10px] font-mono text-zinc-400 mt-1 flex items-center gap-1">
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                              {p.yieldCalculation.sheetQty} lbr A3+ &times; {p.yieldCalculation.yieldPerSheet} pcs = {p.qty} pcs
                            </span>
                          </div>
                        )}

                        {/* Design License Badge */}
                        {p.itemType === 'design_license' && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/25 text-sky-300">
                              🎨 Lisensi Desain Beli Putih
                            </span>
                            {p.itemSku && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                                SKU: {p.itemSku}
                              </span>
                            )}
                          </div>
                        )}

                        {p.notes && (
                          <div className="text-[10px] text-zinc-500 truncate mt-0.5" title={p.notes}>
                            {p.notes}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-300">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="font-medium">{p.supplierName}</span>
                          {p.vendorType === 'external_vendor' && p.itemType === 'sticker_vendor' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/15">
                              Percetakan Luar
                            </span>
                          )}
                          {p.itemType === 'design_license' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                              Digital Asset
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                        {p.qty} {p.unitMeasure}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <div className="font-bold text-white">{formatRupiah(p.totalCost)}</div>
                        {p.shippingCost > 0 && (
                          <div className="text-[10px] text-zinc-400">
                            +Ongkir {formatRupiah(p.shippingCost)}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-bold border border-white/15">
                          {formatRupiah(p.realUnitCost)}/{p.unitMeasure}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {p.paymentSource === 'personal_pocket' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                            <Wallet className="w-3 h-3" /> Dompet Pribadi
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15 font-semibold">
                            <Building2 className="w-3 h-3" /> BCA Bisnis
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus data pengadaan ${p.procurementNo}?`)) {
                              removeProcurement(p.id);
                            }
                          }}
                          className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                          title="Hapus Pengadaan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Smart Procurement Intake Modal */}
      <ProcurementIntakeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addProcurement}
      />
    </div>
  );
}
