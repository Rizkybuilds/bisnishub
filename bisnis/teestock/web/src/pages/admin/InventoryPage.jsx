import React, { useState } from 'react';
import { Layers, Plus, Database, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { InventoryGrid } from '../../components/admin/InventoryGrid';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { useAdmin } from '../../context/AdminContext';
import { getInventoryMatrix } from '../../services/inventoryApi';

export function InventoryPage() {
  const { restockInventory, setInventory, showToast } = useAdmin();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [garmentKey, setGarmentKey] = useState('nsa_softstyle_30s');
  const [color, setColor] = useState('Hitam');
  const [size, setSize] = useState('L');
  const [qty, setQty] = useState(12);

  const currentGarment = GARMENT_TYPES[garmentKey];

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

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (qty <= 0) {
      alert("Jumlah restok harus lebih dari 0");
      return;
    }

    restockInventory(garmentKey, color, size, qty);
    setIsRestockModalOpen(false);
  };

  return (
    <div>
      <AdminTopbar
        title="Stok Kaos Polos NSA & Bahan"
        subtitle="Matriks inventori New States Apparel 30s, 24s, Long Sleeve, Hoodie, Polo & Kemasan MultiGraph"
        onNewDesign={() => setIsRestockModalOpen(true)}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-5">
        {/* Real Database Sync Banner */}
        <div className="bg-ts-surface border border-ts-teal/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ts-teal/15 border border-ts-teal/30 flex items-center justify-center text-ts-teal shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-ts-krem">
                  Sinkronisasi Real Database Aktif (PostgreSQL Cloud)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ts-teal/20 text-ts-teal font-semibold border border-ts-teal/30">
                  ts_inventory
                </span>
              </div>
              <p className="text-xs text-ts-muted mt-0.5">
                Setiap perubahan stok, restok garmen, belanja pengadaan, dan potongan pesanan disinkronkan langsung ke tabel relasional database Supabase.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="secondary"
              icon={RefreshCw}
              onClick={handleRefresh}
              loading={refreshing}
              className="text-xs font-mono border-ts-borderDim"
            >
              Sinkronkan Ulang
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={Plus}
              onClick={() => setIsRestockModalOpen(true)}
              className="text-xs"
            >
              Catat Restok Kaos
            </Button>
          </div>
        </div>

        <InventoryGrid onOpenRestock={() => setIsRestockModalOpen(true)} />
      </div>

      {/* Modal Restock */}
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        title="Catat Restok Kaos Polos Masuk"
      >
        <form onSubmit={handleRestockSubmit} className="space-y-4">
          <Select
            label="Pilih Model NSA"
            value={garmentKey}
            onChange={(e) => {
              setGarmentKey(e.target.value);
              const g = GARMENT_TYPES[e.target.value];
              if (g?.colors?.[0]) setColor(g.colors[0].name);
            }}
          >
            {Object.entries(GARMENT_TYPES).filter(([k]) => k !== 'supplies').map(([k, g]) => (
              <option key={k} value={k}>{g.name}</option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Warna Kaos"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              {currentGarment?.colors?.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </Select>

            <Select
              label="Ukuran"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {SIZES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>

          <Input
            label="Jumlah Masuk (Pcs)"
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-ts-borderDim">
            <Button type="button" variant="secondary" onClick={() => setIsRestockModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Tambahkan ke Matriks Stok
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
