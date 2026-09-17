import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  TrendingDown, 
  DollarSign, 
  Filter, 
  X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { supabase } from '../../services/supabase';

// Live Mode: Data defect fiktif telah dibersihkan
const INITIAL_DEFECTS = [];

export function DefectsPage() {
  const { catalog, orders, showToast, recordDefectDeduction } = useAdmin();
  const [defects, setDefects] = useState(() => {
    try {
      const saved = localStorage.getItem('ts_defects_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(d => !d.id?.startsWith('def-'));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStage, setFilterStage] = useState('all');

  // New Defect Form States
  const [newSku, setNewSku] = useState(catalog[0]?.sku || 'TS-PRO-001');
  const [newOrderId, setNewOrderId] = useState('');
  const [newType, setNewType] = useState('dtf_print');
  const [newQty, setNewQty] = useState(1);
  const [newLoss, setNewLoss] = useState(25000);
  const [newStage, setNewStage] = useState('vendor_dtf');
  const [newNotes, setNewNotes] = useState('');

  // Fetch defects from Supabase if table exists
  useEffect(() => {
    async function loadDefects() {
      try {
        const { data, error } = await supabase
          .from('ts_defects')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped = data.map(d => ({
            id: d.id,
            sku: d.sku,
            orderId: d.order_id,
            defectType: d.defect_type,
            qty: d.qty,
            costLoss: Number(d.cost_loss),
            responsibleStage: d.responsible_stage,
            resolutionNotes: d.resolution_notes,
            date: d.created_at
          }));
          setDefects(mapped);
          localStorage.setItem('ts_defects_cache', JSON.stringify(mapped));
        }
      } catch (err) {
        console.warn('Defects fetch notice:', err);
      }
    }
    loadDefects();
  }, []);

  const totalDefectPcs = defects.reduce((sum, d) => sum + Number(d.qty || 1), 0);
  const totalCostLoss = defects.reduce((sum, d) => sum + Number(d.costLoss || 0), 0);
  const defectRate = orders.length > 0 ? ((totalDefectPcs / orders.length) * 100).toFixed(1) : '0.0';

  const handleAddDefect = async (e) => {
    e.preventDefault();
    const newRecord = {
      id: `def-${Date.now()}`,
      sku: newSku,
      orderId: newOrderId.trim() || null,
      defectType: newType,
      qty: Number(newQty),
      costLoss: Number(newLoss),
      responsibleStage: newStage,
      resolutionNotes: newNotes.trim() || 'Reject tercatat untuk evaluasi QC harian.',
      date: new Date().toISOString()
    };

    // 1. Potong stok fisik secara sah melalui recordDefectDeduction (Zero-Leakage Integrity)
    if (recordDefectDeduction) {
      let itemType = 'dtf_film';
      if (newType === 'garment_flaw' || newSku.startsWith('NSA-') || newSku.startsWith('TS-BLK')) {
        itemType = 'blank_tshirt';
      } else if (newSku.startsWith('MAT-')) {
        itemType = 'supplies';
      }
      recordDefectDeduction({
        itemType,
        sku: newSku,
        qty: Number(newQty)
      });
    }

    const updated = [newRecord, ...defects];
    setDefects(updated);
    localStorage.setItem('ts_defects_cache', JSON.stringify(updated));

    try {
      await supabase.from('ts_defects').insert([{
        sku: newRecord.sku,
        order_id: newRecord.orderId,
        defect_type: newRecord.defectType,
        qty: newRecord.qty,
        cost_loss: newRecord.costLoss,
        responsible_stage: newRecord.responsibleStage,
        resolution_notes: newRecord.resolutionNotes
      }]);
    } catch (err) {
      console.warn('Supabase defect insert fallback:', err);
    }

    setIsModalOpen(false);
    showToast(`🛡️ Defect sah dicatat: Stok [${newSku}] -${newQty} pcs otomatis dipotong dari gudang (Loss: ${formatRupiah(newLoss)})`);
    setNewNotes('');
  };

  const handleDeleteDefect = async (id) => {
    const filtered = defects.filter(d => d.id !== id);
    setDefects(filtered);
    localStorage.setItem('ts_defects_cache', JSON.stringify(filtered));

    try {
      await supabase.from('ts_defects').delete().eq('id', id);
    } catch (e) {}

    showToast('Catatan defect dihapus');
  };

  const filteredDefects = defects.filter(d => {
    if (filterStage === 'all') return true;
    return d.responsibleStage === filterStage;
  });

  const defectTypeLabels = {
    dtf_print: { label: 'Sablon DTF Cacat/Buram', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    garment_flaw: { label: 'Garmen NSA Robek/Noda', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    press_alignment: { label: 'Posisi Press Miring/Gosong', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    shipping_return: { label: 'Retur Kurir / Paket Rusak', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' }
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      <AdminTopbar
        title="Quality Control &amp; Defect Tracker"
        subtitle="Monitoring reject rate sablon, evaluasi kualitas bahan vendor, dan pencegahan kerugian HPP"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-ts-muted">Total Cacat Terdata</div>
              <div className="font-mono text-2xl font-bold text-white">{totalDefectPcs} pcs</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-ts-muted">Defect Rate Produksi</div>
              <div className="font-mono text-2xl font-bold text-white">{defectRate}%</div>
              <div className="text-[10px] text-ts-green font-medium">Batas aman &lt; 3.0%</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-ts-terracotta/15 text-ts-terracotta flex items-center justify-center font-bold border border-ts-terracotta/30">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-ts-muted">Total Kerugian HPP</div>
              <div className="font-mono text-xl font-bold text-white">{formatRupiah(totalCostLoss)}</div>
            </div>
          </Card>

          <Card className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-ts-teal/15 text-ts-teal flex items-center justify-center font-bold border border-ts-teal/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-ts-muted">Tahap Evaluasi Utama</div>
              <div className="text-sm font-bold text-white mt-0.5">Vendor DTF &amp; Press</div>
            </div>
          </Card>
        </div>

        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-ts-muted mr-1 font-mono uppercase">Filter Tahap:</span>
            {['all', 'vendor_dtf', 'vendor_nsa', 'internal_press', 'courier'].map(stage => (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterStage === stage
                    ? 'bg-white/[0.12] text-white border border-white/20'
                    : 'bg-white/[0.03] text-ts-muted hover:text-white border border-white/[0.06]'
                }`}
              >
                {stage === 'all' ? 'Semua' : stage.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            size="md"
            variant="glow"
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
          >
            Catat Reject / Cacat Baru
          </Button>
        </div>

        {/* Defects Table */}
        <Card className="p-0 overflow-hidden border border-white/[0.08]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-ts-hitam/60 border-b border-white/[0.08] text-ts-muted font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-4">Tanggal &amp; SKU</th>
                  <th className="p-4">Jenis Cacat</th>
                  <th className="p-4">Jumlah</th>
                  <th className="p-4">Kerugian HPP</th>
                  <th className="p-4">Pihak Terkait</th>
                  <th className="p-4">Solusi / Catatan QC</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredDefects.map((d) => {
                  const typeInfo = defectTypeLabels[d.defectType] || defectTypeLabels.dtf_print;
                  return (
                    <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-mono font-bold text-white">{d.sku}</div>
                        <div className="text-[10px] text-ts-muted">{formatDate(d.date)}</div>
                        {d.orderId && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-ts-kremMuted">
                            {d.orderId}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        {d.qty} pcs
                      </td>
                      <td className="p-4 font-mono text-rose-400 font-bold">
                        {formatRupiah(d.costLoss)}
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] font-mono uppercase text-ts-kremMuted">
                          {d.responsibleStage?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs text-ts-kremMuted leading-relaxed">
                        {d.resolutionNotes}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteDefect(d.id)}
                          className="p-1.5 rounded-lg text-ts-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus Catatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ─── Modal Input Reject Baru ─────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-ts-surface border border-white/[0.12] rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Catat Cacat Produksi / Reject Baru</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-ts-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDefect} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Pilih SKU Produk"
                  value={newSku}
                  onChange={(e) => setNewSku(e.target.value)}
                >
                  {catalog.map(p => (
                    <option key={p.sku} value={p.sku}>{p.sku} - {p.name}</option>
                  ))}
                </Select>

                <Input
                  label="No. Order (Opsional)"
                  placeholder="WEB-481920"
                  value={newOrderId}
                  onChange={(e) => setNewOrderId(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Jenis Kerusakan / Cacat"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="dtf_print">Sablon DTF Cacat / Buram</option>
                  <option value="garment_flaw">Garmen NSA Rusak / Bolong</option>
                  <option value="press_alignment">Posisi Heat Press Miring</option>
                  <option value="shipping_return">Retur Kurir / Paket Rusak</option>
                </Select>

                <Select
                  label="Pihak Bertanggung Jawab"
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                >
                  <option value="vendor_dtf">Vendor Cetak DTF</option>
                  <option value="vendor_nsa">Vendor Kaos Polos NSA</option>
                  <option value="internal_press">Internal Press &amp; QC</option>
                  <option value="courier">Kurir Ekspedisi</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Jumlah (Pcs)"
                  type="number"
                  min="1"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  required
                />
                <Input
                  label="Estimasi Kerugian HPP (Rp)"
                  type="number"
                  step="1000"
                  value={newLoss}
                  onChange={(e) => setNewLoss(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5">Tindakan / Solusi QC</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Contoh: Klaim cetak ulang ke vendor DTF, atau ganti kaos baru dan sesuaikan suhu mesin press..."
                  rows={3}
                  className="w-full bg-ts-hitam/80 border border-white/[0.1] rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-ts-terracotta"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" variant="glow">
                  Simpan Catatan Reject
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
