import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Download, 
  Boxes, 
  PackageCheck, 
  AlertCircle, 
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { InventoryGrid } from '../../components/admin/InventoryGrid';
import { ProcurementIntakeModal } from '../../components/admin/ProcurementIntakeModal';
import { useAdmin } from '../../context/AdminContext';
import { 
  getInventoryMatrix, 
  syncFullInventoryToCloud, 
  calculateInventoryStats,
  exportInventoryCsv 
} from '../../services/inventoryApi';

export function InventoryPage() {
  const { inventory, setInventory, showToast, addProcurement } = useAdmin();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Executive KPI Statistics
  const stats = useMemo(() => {
    return calculateInventoryStats(inventory);
  }, [inventory]);

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

  const handleExportCsv = () => {
    try {
      exportInventoryCsv(inventory);
      showToast("📥 File CSV Matriks Opname Gudang berhasil diunduh!");
    } catch (err) {
      showToast("Gagal ekspor CSV: " + err.message, "error");
    }
  };

  return (
    <div className="bg-[#09090B] text-zinc-100 min-h-full">
      <AdminTopbar
        title="Stok Kaos Polos NSA & Bahan"
        subtitle="Matriks inventori New States Apparel 30s, 24s, Long Sleeve, Hoodie, Polo & Kemasan MultiGraph"
        onNewDesign={() => setIsRestockModalOpen(true)}
      />

      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* 4 Executive KPI Ribbon Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Inventory Asset Value */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-amber-400" /> Nilai Aset Gudang
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Total Stok
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-mono font-black text-white">
                Rp {stats.totalInventoryValue.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                Kaos Rp {stats.blankGarmentValue.toLocaleString('id-ID')} • DTF Rp {stats.totalDtfAssetValue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Card 2: Total Blank Garment Ready */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-400" /> Kaos Polos Ready
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Buffer Studio
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-mono font-black text-emerald-400">
                {stats.totalBlankGarmentPcs} <span className="text-xs font-normal text-zinc-400 font-sans">pcs garmen</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Standar NSA 30s, 24s &amp; Polo distro siap press
              </p>
            </div>
          </div>

          {/* Card 3: Buffer Lembar Film DTF */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-sky-400" /> Lembar Film DTF
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                Siap Press
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl lg:text-2xl font-mono font-black text-sky-400">
                {stats.totalDtfSheets} <span className="text-xs font-normal text-zinc-400 font-sans">lembar</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                Valuasi: Rp {stats.totalDtfAssetValue.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          {/* Card 4: SKU Kritis / Menipis */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-white/[0.08] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> SKU Menipis (&le; 2 pcs)
              </span>
              {stats.criticalSkuCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                  Butuh Restok
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Stok Aman
                </span>
              )}
            </div>
            <div className="mt-3">
              <div className={`text-xl lg:text-2xl font-mono font-black ${stats.criticalSkuCount > 0 ? 'text-amber-400' : 'text-zinc-200'}`}>
                {stats.criticalSkuCount} <span className="text-xs font-normal text-zinc-400 font-sans">varian SKU</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Kombinasi ukuran/warna/desain di bawah safety limit
              </p>
            </div>
          </div>
        </div>

        {/* Real Database Sync & Zero-Leakage Audit Lock Banner */}
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
                Aturan Mutasi Sah: Masuk via <strong className="text-zinc-200">Pengadaan PO</strong> | Keluar via <strong className="text-zinc-200">Pesanan Toko &amp; Cacat QC</strong> | Selisih via <strong className="text-amber-300">Stock Opname Berita Acara</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/[0.08] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Download database matriks inventori seluruh SKU dalam format CSV standar Opname Gudang"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Ekspor CSV Opname</span>
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Sinkronkan Ulang</span>
            </button>
            <button
              type="button"
              onClick={handleFullReinit}
              disabled={refreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Inisialisasi ulang seluruh 337 SKU master ke PostgreSQL Cloud Supabase jika data di database terhapus"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Inisialisasi Master Cloud</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRestockModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-black bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
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

