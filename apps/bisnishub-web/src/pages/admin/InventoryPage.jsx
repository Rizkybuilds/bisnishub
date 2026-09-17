import React, { useState } from 'react';
import { Plus, Database, RefreshCw, Sparkles, Package, ShieldCheck, Lock } from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { InventoryGrid } from '../../components/admin/InventoryGrid';
import { ProcurementIntakeModal } from '../../components/admin/ProcurementIntakeModal';
import { useAdmin } from '../../context/AdminContext';
import { getInventoryMatrix, syncFullInventoryToCloud } from '../../services/inventoryApi';

export function InventoryPage() {
  const { setInventory, showToast, addProcurement } = useAdmin();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const latest = await getInventoryMatrix();
      setInventory(latest);
      showToast("🔄 Data stok fisik berhasil disinkronkan dari real database Supabase!");
    } catch (err) {
      showToast("Gagal mengambil data database: " + err.message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  const handleFullReinit = async () => {
    if (!window.confirm("⚠️ Konfirmasi Inisialisasi Database Cloud:\n\nApakah Anda ingin memastikan seluruh 337 SKU master (Kaos Polos NSA, DTF Drop #01, dan Kemasan) terdaftar rapi di PostgreSQL Cloud Supabase?\n\nStok akan diinisialisasi bersih (0 pcs) siap untuk operasional live.")) {
      return;
    }
    setRefreshing(true);
    try {
      const latest = await syncFullInventoryToCloud();
      setInventory(latest);
      showToast("✅ Berhasil! Seluruh 337 SKU master berhasil diinisialisasi ke database Cloud Supabase!");
    } catch (err) {
      showToast("Gagal inisialisasi cloud: " + err.message, "error");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <AdminTopbar
        title="Stok Kaos Polos NSA & Bahan"
        subtitle="Matriks inventori New States Apparel 30s, 24s, Long Sleeve, Hoodie, Polo & Kemasan MultiGraph"
        onNewDesign={() => setIsRestockModalOpen(true)}
      />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Real Database Sync & Zero-Leakage Audit Lock Banner (Monochrome 21st.dev style) */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white">
                  Sistem Pengamanan Stok Anti-Bocor (Zero-Leakage Active)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Audit Lock Enforced
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white font-semibold border border-white/20">
                  ts_inventory (337 SKU)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Aturan Mutasi Ketat: Penambahan <strong className="text-zinc-200">HANYA</strong> via Pengadaan Resmi (PO) | Pengurangan <strong className="text-zinc-200">HANYA</strong> via Pesanan Toko &amp; Cacat QC. Edit manual sembarangan diblokir total.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Ulang</span>
            </button>
            <button
              onClick={handleFullReinit}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5"
              title="Inisialisasi ulang seluruh 337 SKU master ke PostgreSQL Cloud Supabase jika data di database terhapus"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Inisialisasi Master Cloud</span>
            </button>
            <button
              onClick={() => setIsRestockModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-950" />
              <span>+ Catat Pengadaan / Restok</span>
            </button>
          </div>
        </div>

        <InventoryGrid onOpenRestock={() => setIsRestockModalOpen(true)} />
      </div>

      {/* Smart Procurement & Batch Restock Intake Modal */}
      <ProcurementIntakeModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        onSave={addProcurement}
      />
    </div>
  );
}
