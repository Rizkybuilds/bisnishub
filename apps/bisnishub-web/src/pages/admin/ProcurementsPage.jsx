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
  FileSpreadsheet,
  Download,
  Eye,
  X,
  FileText,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { ProcurementIntakeModal } from '../../components/admin/ProcurementIntakeModal';
import { formatRupiah } from '@bisnishub/shared/utils/formatters';

export function ProcurementsPage() {
  const { procurements, addProcurement, removeProcurement } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPo, setSelectedPo] = useState(null);

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

  // Filtered Summary for Dynamic Ribbon
  const filteredSpend = filtered.reduce((sum, p) => sum + (p.totalCost || 0), 0);
  const filteredPcs = filtered.reduce((sum, p) => sum + (p.qty || 0), 0);
  const filteredAvgCost = filteredPcs > 0 ? Math.round(filteredSpend / filteredPcs) : 0;

  // Wallet metadata helper
  const getSourceInfo = (source) => {
    switch (source) {
      case 'business_bank':
        return { label: 'BCA TeeStock', icon: Building2, color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' };
      case 'multigraph_bank':
        return { label: 'BCA MultiGraph', icon: Building2, color: 'bg-blue-500/10 text-blue-300 border-blue-500/20' };
      case 'holding_treasury':
        return { label: 'Holding Treasury', icon: Building2, color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' };
      case 'personal_pocket':
        return { label: 'Dompet Pribadi', icon: Wallet, color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' };
      default:
        return { label: source || 'Kas Operasional', icon: Building2, color: 'bg-white/10 text-white border-white/15' };
    }
  };

  // CSV Exporter for BOM & Procurements
  const handleExportCsv = () => {
    if (!filtered || filtered.length === 0) {
      alert('Tidak ada data pengadaan untuk diunduh.');
      return;
    }

    const headers = [
      'No. PO',
      'Tanggal',
      'Kategori Item',
      'Nama Item / Uraian',
      'Vendor / Supplier',
      'Tipe Vendor',
      'Jumlah Masuk',
      'Satuan',
      'Biaya Barang (Rp)',
      'Ongkir Kargo (Rp)',
      'Biaya Lain (Rp)',
      'Total Nota (Rp)',
      'Landed Cost Riil / Satuan (Rp)',
      'Sumber Kas',
      'Buku Kas Terhubung',
      'Catatan / Resi'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = filtered.map(p => {
      const rawItemCost = p.itemCost || Math.max(0, (p.totalCost || 0) - (p.shippingCost || 0) - (p.otherCost || 0));
      return [
        escapeCsv(p.procurementNo || '-'),
        escapeCsv(p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '-'),
        escapeCsv(p.itemType || '-'),
        escapeCsv(p.itemName || '-'),
        escapeCsv(p.supplierName || '-'),
        escapeCsv(p.vendorType === 'external_vendor' ? 'Percetakan Luar' : 'Distributor/Vendor'),
        p.qty || 0,
        escapeCsv(p.unitMeasure || 'pcs'),
        rawItemCost,
        p.shippingCost || 0,
        p.otherCost || 0,
        p.totalCost || 0,
        p.realUnitCost || 0,
        escapeCsv(getSourceInfo(p.paymentSource).label),
        escapeCsv(p.cashTxId ? 'Ya (CASH_OUT)' : 'Tidak'),
        escapeCsv(p.notes || '')
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `PO-BOM-PENGADAAN-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminTopbar
        title="Pengadaan Bahan & Biaya Pokok (BOM)"
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

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={handleExportCsv}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-white/10 text-white border border-white/10 transition-all flex items-center gap-2"
                title="Ekspor CSV Data Pengadaan BOM"
              >
                <Download className="w-4 h-4 text-zinc-400" />
                <span>Unduh CSV BOM</span>
              </button>
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

        {/* Dynamic Filter Summary Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#121215] border border-white/[0.08] rounded-xl text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>Menampilkan <strong className="text-white font-bold">{filtered.length}</strong> dari {procurements.length} nota pengadaan</span>
            {filterType !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px] font-bold">
                Kategori: {filterType}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-400">
              Total Spend: <strong className="text-white font-bold">{formatRupiah(filteredSpend)}</strong>
            </span>
            <span className="text-zinc-400">
              Total Masuk: <strong className="text-white font-bold">{filteredPcs.toLocaleString('id-ID')} pcs</strong>
            </span>
            {filteredPcs > 0 && (
              <span className="text-zinc-400">
                Landed Rata-rata: <strong className="text-emerald-400 font-bold">{formatRupiah(filteredAvgCost)}/unit</strong>
              </span>
            )}
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
                        <button
                          onClick={() => setSelectedPo(p)}
                          className="font-bold text-white hover:underline text-left flex items-center gap-1 group"
                          title="Klik untuk membuka Slip PO Digital"
                        >
                          <span>{p.procurementNo}</span>
                          <Eye className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
                        </button>
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
                                {item.color ? `${item.color} (${item.size})` : `${item.name || item.sku} [${item.size}]`} &times;{item.qty}
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
                        {(() => {
                          const info = getSourceInfo(p.paymentSource);
                          const Icon = info.icon;
                          return (
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${info.color}`}>
                              <Icon className="w-3 h-3 shrink-0" />
                              <span>{info.label}</span>
                            </span>
                          );
                        })()}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedPo(p)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            title="Buka & Cetak Slip PO"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data pengadaan ${p.procurementNo}?`)) {
                                removeProcurement(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Hapus Pengadaan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

      {/* Digital PO Slip & Printable Modal */}
      {selectedPo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-[#121215] border border-white/[0.12] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 text-white relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header Bar */}
            <div className="p-4 px-6 border-b border-white/[0.08] flex items-center justify-between bg-black/40 shrink-0 no-print">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-mono font-bold text-zinc-300">
                  SLIP PURCHASE ORDER (BOM) &bull; {selectedPo.procurementNo}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Slip</span>
                </button>
                <button
                  onClick={() => setSelectedPo(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Slip Content */}
            <div id="po-slip-printable" className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {/* Slip Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-white/[0.1] print-dark-invert">
                <div>
                  <div className="text-base font-black tracking-tight text-white uppercase">
                    MultiGraph Printing &amp; Apparel Holding
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Divisi Pengadaan &amp; Bill of Materials (BOM) TeeStock
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-1">
                    Jl. Percetakan &amp; Konveksi No. 88, Indonesia
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs font-mono font-bold text-white bg-white/10 px-3 py-1 rounded-lg border border-white/20 inline-block">
                    {selectedPo.procurementNo}
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1">
                    Tanggal: {new Date(selectedPo.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <div className="mt-1 flex items-center sm:justify-end gap-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>STATUS: LUNAS &amp; DITERIMA</span>
                  </div>
                </div>
              </div>

              {/* Vendor & Treasury Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-white/[0.06] print-dark-invert">
                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Vendor / Supplier</span>
                  <div className="font-bold text-white text-sm mt-0.5">{selectedPo.supplierName}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    {selectedPo.vendorType === 'external_vendor' ? 'Mitra Maklon / Percetakan Luar' : 'Distributor Bahan Baku Utama'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Sumber Pendanaan Kas</span>
                  <div className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                    {(() => {
                      const info = getSourceInfo(selectedPo.paymentSource);
                      const Icon = info.icon;
                      return (
                        <>
                          <Icon className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{info.label}</span>
                        </>
                      );
                    })()}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    {selectedPo.cashTxId ? 'Tersinkronisasi otomatis dengan Buku Kas (CASH_OUT)' : 'Pengadaan Non-Kas / Terpisah'}
                  </div>
                </div>
              </div>

              {/* Item Details / Matrix Breakdown */}
              <div className="space-y-3">
                <div className="font-mono font-bold text-zinc-300 text-xs flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-zinc-400" />
                  <span>RINCIAN BARANG &amp; SPESIFIKASI</span>
                </div>

                <div className="bg-black/30 border border-white/[0.08] rounded-xl overflow-hidden print-dark-invert">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.04] border-b border-white/[0.08] text-zinc-400 font-mono text-[10px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Uraian Barang / Varian</th>
                        <th className="py-2.5 px-3 text-center">Jumlah</th>
                        <th className="py-2.5 px-3 text-right">Harga Beli Dasar</th>
                        <th className="py-2.5 px-3 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-zinc-200">
                      {selectedPo.itemsBreakdown && selectedPo.itemsBreakdown.length > 0 ? (
                        selectedPo.itemsBreakdown.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3">
                              <span className="font-medium text-white">{item.name || selectedPo.itemName}</span>
                              <span className="text-zinc-400 ml-2 font-mono">
                                {item.color ? `[${item.color} - Size ${item.size}]` : `[${item.sku || 'SKU'} - Ukuran ${item.size}]`}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-bold">
                              {item.qty} {selectedPo.itemType === 'dtf_film' ? 'lbr' : 'pcs'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-zinc-400">
                              {formatRupiah(item.unitCost || (selectedPo.itemCost ? Math.round(selectedPo.itemCost / selectedPo.qty) : Math.round((selectedPo.totalCost - (selectedPo.shippingCost || 0)) / selectedPo.qty)))}
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-white font-semibold">
                              {formatRupiah(item.qty * (item.unitCost || (selectedPo.itemCost ? Math.round(selectedPo.itemCost / selectedPo.qty) : Math.round((selectedPo.totalCost - (selectedPo.shippingCost || 0)) / selectedPo.qty))))}
                            </td>
                          </tr>
                        ))
                      ) : selectedPo.yieldCalculation ? (
                        <tr>
                          <td className="py-2.5 px-3">
                            <div className="font-medium text-white">{selectedPo.itemName}</div>
                            <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                              {selectedPo.yieldCalculation.sheetQty} Lembar A3+ &times; {selectedPo.yieldCalculation.yieldPerSheet} pcs/lembar (Total: {selectedPo.qty} stiker)
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold">
                            {selectedPo.yieldCalculation.sheetQty} Lembar
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-400">
                            {formatRupiah(Math.round((selectedPo.totalCost - (selectedPo.shippingCost || 0)) / (selectedPo.yieldCalculation.sheetQty || 1)))}/lbr
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-white font-semibold">
                            {formatRupiah(selectedPo.totalCost - (selectedPo.shippingCost || 0))}
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-white">
                            <div>{selectedPo.itemName}</div>
                            {selectedPo.itemSku && (
                              <div className="text-[10px] text-zinc-500 font-mono">SKU: {selectedPo.itemSku}</div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold">
                            {selectedPo.qty} {selectedPo.unitMeasure}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-zinc-400">
                            {formatRupiah(Math.round((selectedPo.totalCost - (selectedPo.shippingCost || 0)) / selectedPo.qty))}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-white font-semibold">
                            {formatRupiah(selectedPo.totalCost - (selectedPo.shippingCost || 0))}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial & Landed Cost Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs font-mono print-dark-invert">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Komponen Biaya Pengadaan
                  </span>
                  <div className="flex justify-between text-zinc-300">
                    <span>Subtotal Bahan/Item:</span>
                    <span>{formatRupiah(selectedPo.totalCost - (selectedPo.shippingCost || 0))}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Ongkos Kirim Kargo/Kurir:</span>
                    <span>{formatRupiah(selectedPo.shippingCost || 0)}</span>
                  </div>
                  {selectedPo.otherCost > 0 && (
                    <div className="flex justify-between text-zinc-300">
                      <span>Biaya Tambahan:</span>
                      <span>{formatRupiah(selectedPo.otherCost)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-sm">
                    <span>Total Pembayaran:</span>
                    <span>{formatRupiah(selectedPo.totalCost)}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex flex-col justify-between print-dark-invert">
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold block text-emerald-400">
                      HPP Riil Per Unit (Landed Cost Masuk)
                    </span>
                    <div className="text-2xl font-black font-mono mt-1 text-white">
                      {formatRupiah(selectedPo.realUnitCost)}
                      <span className="text-xs text-zinc-400 font-normal"> / {selectedPo.unitMeasure}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      Landed cost ini mencakup harga beli dasar ditambah alokasi beban ongkir cargo terbagi rata per satuan unit.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 pt-2">
                    Sinkron ke Database Stok &amp; BOM Produk
                  </div>
                </div>
              </div>

              {/* Notes & Tracking */}
              {selectedPo.notes && (
                <div className="p-3 bg-black/40 border border-white/[0.06] rounded-xl text-xs print-dark-invert">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">
                    Catatan PO / Resi Ekspedisi:
                  </span>
                  <div className="text-zinc-200 mt-1 font-mono">{selectedPo.notes}</div>
                </div>
              )}

              {/* Signatures for Print Slip */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-2 gap-8 text-center text-xs print-dark-invert">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-mono">Dibuat Oleh (Purchasing / Ops)</span>
                  <div className="h-14"></div>
                  <div className="border-t border-zinc-700 mx-auto w-36 pt-1 font-semibold text-white">
                    Rizky / Ops Team
                  </div>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-mono">Diverifikasi (CFO / Treasury)</span>
                  <div className="h-14"></div>
                  <div className="border-t border-zinc-700 mx-auto w-36 pt-1 font-semibold text-white">
                    Cabinet CFO BisnisHub
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Bar */}
            <div className="p-4 px-6 border-t border-white/[0.08] bg-black/40 flex items-center justify-between shrink-0 no-print">
              <span className="text-[10px] font-mono text-zinc-500">
                Dokumen resmi sistem internal MultiGraph Holding
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedPo(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Slip PO</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #po-slip-printable, #po-slip-printable * {
            visibility: visible;
          }
          #po-slip-printable {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: auto;
            padding: 24px;
            background: #ffffff !important;
            color: #000000 !important;
            z-index: 99999;
          }
          #po-slip-printable .print-dark-invert {
            background: #f4f4f5 !important;
            color: #000000 !important;
            border-color: #e4e4e7 !important;
          }
          #po-slip-printable .text-white {
            color: #000000 !important;
          }
          #po-slip-printable .text-zinc-400,
          #po-slip-printable .text-zinc-500,
          #po-slip-printable .text-zinc-300 {
            color: #52525b !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
