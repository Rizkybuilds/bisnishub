import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  TrendingDown, 
  DollarSign, 
  Filter, 
  X,
  Download,
  Scale,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { GARMENT_TYPES, SIZES, NSA_34_COLORS } from '../../constants/garments';
import { 
  getDefects, 
  saveDefect, 
  updateDefectClaimStatus, 
  deleteDefect, 
  calculateDefectLoss, 
  exportDefectsCsv,
  DEFECT_TYPES,
  RESPONSIBLE_PARTIES,
  CLAIM_STATUSES
} from '../../services/defectsApi';

export function DefectsPage() {
  const { catalog, orders, showToast, recordDefectDeduction } = useAdmin();
  const [defects, setDefects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStage, setFilterStage] = useState('all');
  const [filterClaim, setFilterClaim] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form States for New Defect
  const [newDefectType, setNewDefectType] = useState('heat_press_failed');
  const [newSku, setNewSku] = useState(catalog[0]?.sku || 'TS-PRO-001');
  const [newOrderId, setNewOrderId] = useState('');
  const [newGarmentKey, setNewGarmentKey] = useState('nsa_softstyle_30s');
  const [newGarmentColor, setNewGarmentColor] = useState('Black');
  const [newGarmentSize, setNewGarmentSize] = useState('L');
  const [newQty, setNewQty] = useState(1);
  const [newStage, setNewStage] = useState('internal_press');
  const [newClaimStatus, setNewClaimStatus] = useState('unclaimed');
  const [newNotes, setNewNotes] = useState('');

  // Auto-calculated loss breakdown
  const lossCalculation = useMemo(() => {
    return calculateDefectLoss({
      defectType: newDefectType,
      garmentKey: newGarmentKey,
      qty: newQty
    });
  }, [newDefectType, newGarmentKey, newQty]);

  // Load defects data
  useEffect(() => {
    async function fetchDefects() {
      setLoading(true);
      try {
        const data = await getDefects();
        setDefects(data);
      } catch (err) {
        console.warn('Load defects notice:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDefects();
  }, []);

  // Set default stage when defect type changes
  const handleDefectTypeChange = (typeKey) => {
    setNewDefectType(typeKey);
    const defConfig = DEFECT_TYPES[typeKey];
    if (defConfig?.defaultStage) {
      setNewStage(defConfig.defaultStage);
      if (defConfig.defaultStage === 'vendor_dtf' || defConfig.defaultStage === 'vendor_nsa') {
        setNewClaimStatus('unclaimed');
      } else {
        setNewClaimStatus('internal_absorbed');
      }
    }
  };

  // Executive KPI stats
  const totalDefectPcs = useMemo(() => {
    return defects.reduce((sum, d) => sum + Number(d.qty || 1), 0);
  }, [defects]);

  const totalCostLoss = useMemo(() => {
    return defects.reduce((sum, d) => sum + Number(d.costLoss || 0), 0);
  }, [defects]);

  const defectRate = useMemo(() => {
    if (orders.length === 0) return '0.0';
    return ((totalDefectPcs / orders.length) * 100).toFixed(1);
  }, [totalDefectPcs, orders.length]);

  const potentialVendorClaims = useMemo(() => {
    return defects
      .filter(d => (d.responsibleStage === 'vendor_dtf' || d.responsibleStage === 'vendor_nsa') && d.claimStatus !== 'reimbursed')
      .reduce((sum, d) => sum + Number(d.costLoss || 0), 0);
  }, [defects]);

  // Filtered defects
  const filteredDefects = useMemo(() => {
    return defects.filter(d => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSku = (d.sku || '').toLowerCase().includes(q);
        const matchOrder = (d.orderId || '').toLowerCase().includes(q);
        const matchNotes = (d.resolutionNotes || '').toLowerCase().includes(q);
        if (!matchSku && !matchOrder && !matchNotes) return false;
      }
      // 2. Stage Filter
      if (filterStage !== 'all' && d.responsibleStage !== filterStage) return false;
      // 3. Claim Filter
      if (filterClaim !== 'all' && d.claimStatus !== filterClaim) return false;
      return true;
    });
  }, [defects, searchQuery, filterStage, filterClaim]);

  // Handle submit new defect
  const handleAddDefect = async (e) => {
    e.preventDefault();

    const record = {
      sku: newSku,
      orderId: newOrderId.trim() || null,
      defectType: newDefectType,
      garmentKey: newGarmentKey,
      garmentColor: newGarmentColor,
      garmentSize: newGarmentSize,
      qty: Number(newQty),
      costLoss: lossCalculation.totalCostLoss,
      responsibleStage: newStage,
      claimStatus: newClaimStatus,
      resolutionNotes: newNotes.trim() || 'Reject tercatat resmi untuk evaluasi QC harian studio.'
    };

    // 1. Potong stok gudang fisik secara sah via recordDefectDeduction
    if (recordDefectDeduction) {
      recordDefectDeduction({
        defectType: newDefectType,
        sku: newSku,
        dtfSku: (newDefectType === 'heat_press_failed' || newDefectType === 'dtf_print') ? newSku : null,
        garmentKey: newGarmentKey,
        garmentColor: newGarmentColor,
        garmentSize: newGarmentSize,
        qty: Number(newQty)
      });
    }

    // 2. Simpan ke database & state
    try {
      const saved = await saveDefect(record);
      setDefects(prev => [saved, ...prev.filter(d => d.id !== saved.id)]);
      showToast(`🛡️ Reject QC sah: Beban kerugian ${formatRupiah(lossCalculation.totalCostLoss)} dicatat & stok fisik dipotong.`);
    } catch (err) {
      showToast('Gagal menyimpan defect: ' + err.message, 'error');
    }

    setIsModalOpen(false);
    setNewNotes('');
  };

  // Handle status update
  const handleUpdateClaimStatus = async (id, statusKey) => {
    try {
      const updated = await updateDefectClaimStatus(id, statusKey);
      setDefects(updated);
      showToast(`✅ Status klaim defect diperbarui menjadi "${CLAIM_STATUSES[statusKey]?.label}"`);
    } catch (err) {
      showToast('Gagal update status klaim: ' + err.message, 'error');
    }
  };

  // Handle delete
  const handleDeleteDefect = async (id) => {
    if (!window.confirm('Hapus catatan reject ini dari riwayat audit QC?')) return;
    try {
      const updated = await deleteDefect(id);
      setDefects(updated);
      showToast('Catatan defect berhasil dihapus');
    } catch (err) {
      showToast('Gagal menghapus defect: ' + err.message, 'error');
    }
  };

  const handleExportCsv = () => {
    try {
      exportDefectsCsv(filteredDefects);
      showToast('📥 Laporan Cacat & Scrap berhasil diekspor ke CSV!');
    } catch (err) {
      showToast('Gagal ekspor CSV: ' + err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col h-full min-w-0 bg-[#09090B] text-zinc-100">
      <AdminTopbar
        title="Quality Control &amp; Defect Tracker"
        subtitle="Monitoring reject rate sablon, evaluasi kualitas bahan vendor, dan pencegahan kerugian HPP"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* 4 Executive KPI Ribbon Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Kerugian HPP */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-rose-400" /> Total Kerugian HPP
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Scrap Log
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-mono font-black text-rose-400">
                {formatRupiah(totalCostLoss)}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Akumulasi modal bahan baku yang diafkir
              </p>
            </div>
          </div>

          {/* Card 2: Defect Rate Produksi */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-amber-400" /> Defect Rate
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                Number(defectRate) <= 2.5 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse'
              }`}>
                {Number(defectRate) <= 2.5 ? 'Toleransi Aman' : 'Di Atas Batas!'}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-mono font-black text-white">
                {defectRate}% <span className="text-xs font-normal text-zinc-400 font-sans">dari pesanan</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Target standar distro: &lt; 2.5% per batch
              </p>
            </div>
          </div>

          {/* Card 3: Total Pcs Reject */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Volume Reject
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Unit Fisik
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-mono font-black text-amber-300">
                {totalDefectPcs} <span className="text-xs font-normal text-zinc-400 font-sans">pcs / lembar</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Total garmen &amp; film sablon gagal QC
              </p>
            </div>
          </div>

          {/* Card 4: Potensi Klaim Vendor */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-sky-400" /> Potensi Klaim Vendor
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Chargeback
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-mono font-black text-sky-400">
                {formatRupiah(potentialVendorClaims)}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Dapat diretur / dikompensasi ke vendor
              </p>
            </div>
          </div>
        </div>

        {/* Filter Toolbar & Actions */}
        <div className="p-3 bg-zinc-900/60 border border-white/[0.08] rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left: Search & Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <input
              type="text"
              placeholder="Cari SKU, No Order, Catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-white/[0.08] rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 w-44 sm:w-56 transition-colors"
            />

            {/* Filter Pihak Bertanggung Jawab */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-white/[0.08]">
              <span className="text-[10px] font-bold text-zinc-500 px-1.5 uppercase font-mono">Pihak:</span>
              {[
                { id: 'all', label: 'Semua' },
                { id: 'internal_press', label: 'Studio Press' },
                { id: 'vendor_dtf', label: 'Vendor DTF' },
                { id: 'vendor_nsa', label: 'Vendor NSA' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setFilterStage(st.id)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    filterStage === st.id 
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Filter Status Klaim */}
            <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-white/[0.08]">
              <span className="text-[10px] font-bold text-zinc-500 px-1.5 uppercase font-mono">Klaim:</span>
              {[
                { id: 'all', label: 'Semua' },
                { id: 'unclaimed', label: 'Belum' },
                { id: 'claimed_pending', label: 'Pending' },
                { id: 'reimbursed', label: 'Reimbursed' }
              ].map(cl => (
                <button
                  key={cl.id}
                  onClick={() => setFilterClaim(cl.id)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    filterClaim === cl.id 
                      ? 'bg-sky-500 text-neutral-950 font-bold shadow-sm' 
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {cl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-white/[0.08] text-zinc-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Download database laporan reject dalam format CSV 12 kolom"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Ekspor CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-black transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-neutral-950" />
              <span>+ Catat Reject QC</span>
            </button>

            <span className="font-mono text-xs text-zinc-400 px-2 py-1 bg-zinc-950 rounded-lg border border-white/[0.08]">
              {filteredDefects.length} / {defects.length}
            </span>
          </div>
        </div>

        {/* Defects Data Table */}
        <div className="bg-zinc-900/60 border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-white/[0.08] text-zinc-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Tanggal &amp; Item</th>
                  <th className="p-3.5">Jenis Cacat</th>
                  <th className="p-3.5 text-center">Jumlah</th>
                  <th className="p-3.5 text-right">Kerugian HPP</th>
                  <th className="p-3.5">Pihak Terkait</th>
                  <th className="p-3.5">Status Klaim Vendor</th>
                  <th className="p-3.5">Solusi &amp; Catatan QC</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredDefects.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-zinc-500 text-xs font-medium">
                      Tidak ada catatan cacat produksi yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredDefects.map((d) => {
                    const typeObj = DEFECT_TYPES[d.defectType] || DEFECT_TYPES.dtf_print;
                    const claimObj = CLAIM_STATUSES[d.claimStatus] || CLAIM_STATUSES.unclaimed;
                    const isVendorResponsible = d.responsibleStage === 'vendor_dtf' || d.responsibleStage === 'vendor_nsa';

                    return (
                      <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-white">{d.sku}</div>
                          {d.garmentColor && d.garmentSize && (
                            <div className="text-[11px] text-zinc-400 mt-0.5">
                              {d.garmentColor} ({d.garmentSize})
                            </div>
                          )}
                          <div className="text-[10px] text-zinc-500 mt-0.5">{formatDate(d.date)}</div>
                          {d.orderId && (
                            <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-amber-300 border border-white/[0.08]">
                              Order: {d.orderId}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${typeObj.color}`}>
                            {typeObj.label}
                          </span>
                        </td>

                        <td className="p-3.5 text-center font-mono font-black text-white text-sm">
                          {d.qty} <span className="text-xs font-normal text-zinc-400 font-sans">pcs</span>
                        </td>

                        <td className="p-3.5 text-right font-mono font-bold text-rose-400 text-sm">
                          {formatRupiah(d.costLoss)}
                        </td>

                        <td className="p-3.5">
                          <span className="text-[11px] font-mono uppercase text-zinc-300 font-semibold block">
                            {RESPONSIBLE_PARTIES[d.responsibleStage]?.label || d.responsibleStage}
                          </span>
                        </td>

                        {/* Interactive Vendor Claim Status Switcher */}
                        <td className="p-3.5">
                          {isVendorResponsible ? (
                            <select
                              value={d.claimStatus}
                              onChange={(e) => handleUpdateClaimStatus(d.id, e.target.value)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border cursor-pointer focus:outline-none ${claimObj.color}`}
                            >
                              <option value="unclaimed" className="bg-zinc-900 text-zinc-300">Belum Diklaim</option>
                              <option value="claimed_pending" className="bg-zinc-900 text-amber-300">Pending Klaim</option>
                              <option value="reimbursed" className="bg-zinc-900 text-emerald-300">Reimbursed (Diganti)</option>
                              <option value="internal_absorbed" className="bg-zinc-900 text-rose-300">Diserap Studio</option>
                            </select>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/[0.06]">
                              Internal Studio
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 max-w-xs text-zinc-400 text-xs leading-relaxed">
                          {d.resolutionNotes || '-'}
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteDefect(d.id)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Hapus Catatan Reject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Modal Input Reject Baru (Auto-Scrap & HPP Calculator) ────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#0E0E11] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-2xl text-zinc-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Catat Cacat Produksi &amp; Scrap Log</h3>
                  <p className="text-[11px] text-zinc-400">Otomasi pemotongan stok ganda &amp; kalkulasi kerugian HPP</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDefect} className="space-y-4 text-xs">
              {/* Jenis Cacat / Kerusakan */}
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Jenis Cacat / Kerusakan:</label>
                <select
                  value={newDefectType}
                  onChange={(e) => handleDefectTypeChange(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {Object.values(DEFECT_TYPES).map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <p className="text-[11px] text-zinc-500">
                  {DEFECT_TYPES[newDefectType]?.description}
                </p>
              </div>

              {/* Komponen Produk & Desain */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">SKU Desain / Film DTF:</label>
                  <select
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {catalog.map(p => (
                      <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">No. Order Terkait (Opsional):</label>
                  <input
                    type="text"
                    placeholder="Contoh: WEB-20260901"
                    value={newOrderId}
                    onChange={(e) => setNewOrderId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Varian Garmen NSA (Jika Relevan) */}
              {(newDefectType === 'heat_press_failed' || newDefectType === 'garment_flaw' || newDefectType === 'shipping_return') && (
                <div className="p-3 bg-zinc-950/70 border border-white/[0.08] rounded-xl space-y-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                    Detail Kaos Polos NSA yang Rusak:
                  </span>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Model Garmen:</label>
                      <select
                        value={newGarmentKey}
                        onChange={(e) => setNewGarmentKey(e.target.value)}
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-white focus:outline-none"
                      >
                        {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([k, g]) => (
                          <option key={k} value={k}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Warna:</label>
                      <select
                        value={newGarmentColor}
                        onChange={(e) => setNewGarmentColor(e.target.value)}
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-white focus:outline-none"
                      >
                        {NSA_34_COLORS.slice(0, 15).map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-zinc-400 block mb-1">Ukuran:</label>
                      <select
                        value={newGarmentSize}
                        onChange={(e) => setNewGarmentSize(e.target.value)}
                        className="w-full px-2 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-white focus:outline-none"
                      >
                        {SIZES.map(sz => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Kuantitas & Pihak Terkait */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Jumlah Rusak (Pcs):</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Pihak Bertanggung Jawab:</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {Object.values(RESPONSIBLE_PARTIES).map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">Status Klaim Garansi:</label>
                  <select
                    value={newClaimStatus}
                    onChange={(e) => setNewClaimStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {Object.values(CLAIM_STATUSES).map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Real-time Loss Breakdown Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/30 to-zinc-950 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Rincian Kerugian HPP per Unit:</span>
                  <span className="font-mono text-white">
                    Kaos Rp {lossCalculation.garmentHpp.toLocaleString('id-ID')} + Film DTF Rp {lossCalculation.dtfHpp.toLocaleString('id-ID')} {lossCalculation.opCost > 0 && `+ Press Rp ${lossCalculation.opCost.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-rose-500/20">
                  <span className="font-bold text-zinc-200">Total Kerugian Riil ({newQty} pcs):</span>
                  <span className="font-mono text-base font-black text-rose-400">
                    {formatRupiah(lossCalculation.totalCostLoss)}
                  </span>
                </div>
              </div>

              {/* Tindakan / Solusi QC */}
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">Tindakan / Solusi QC:</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Contoh: Klaim retur lembar DTF ke vendor, press ulang dengan kaos NSA baru..."
                  rows={2}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/[0.12] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Stok kaos &amp; film otomatis terpotong sah</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-white/[0.08] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-black bg-rose-500 hover:bg-rose-400 text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    Simpan Catatan Reject
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

