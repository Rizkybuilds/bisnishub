import React, { useState } from 'react';
import { 
  Flame, 
  Wrench, 
  Plus, 
  Trash2, 
  Building2, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Layers
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { formatRupiah } from '../../utils/formatters';

export function AssetsPage() {
  const { fixedAssets, addFixedAsset, removeFixedAsset, totalAssetsValue } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('machine');
  const [purchaseCost, setPurchaseCost] = useState(2500000);
  const [currentValue, setCurrentValue] = useState(2500000);
  const [location, setLocation] = useState('TeeStock Studio & Print Lab (Citayam Hub)');
  const [notes, setNotes] = useState('');

  const handleOpenNew = () => {
    setAssetName('');
    setCategory('machine');
    setPurchaseCost(500000);
    setCurrentValue(500000);
    setLocation('TeeStock Studio & Print Lab (Citayam Hub)');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assetName.trim()) {
      alert('Mohon isi nama aset/alat');
      return;
    }

    await addFixedAsset({
      assetName: assetName.trim(),
      category,
      acquisitionDate: new Date().toISOString().slice(0, 10),
      purchaseCost: Number(purchaseCost),
      currentValue: Number(currentValue) || Number(purchaseCost),
      status: 'active',
      location: location.trim(),
      notes: notes.trim()
    });

    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-ts-hitam">
      <AdminTopbar title="Aset Mesin & Peralatan (CAPEX)" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ts-borderDim pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                CAPITAL EXPENDITURE
              </span>
              <h1 className="text-xl font-extrabold text-ts-krem tracking-wide">
                Aset Mesin &amp; Peralatan Kerja (CAPEX)
              </h1>
            </div>
            <p className="text-xs text-ts-muted mt-1">
              Catatan alat kerja produktif berumur panjang. Uang Anda tidak hilang, melainkan berwujud mesin dan alat penunjang produksi mandiri.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleOpenNew}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Aset / Alat Kerja
          </Button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Total Nilai Buku Aset Tetap</span>
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-2xl text-amber-400">
              {formatRupiah(totalAssetsValue)}
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              {fixedAssets.length} Unit Mesin/Alat Terdaftar
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Status Produksi In-House</span>
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-base text-emerald-400">
              ⚡ Mandiri (In-House Press)
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Hemat Jasa Press Rp 5.000–Rp 7.000/pcs
            </p>
          </Card>

          <Card className="bg-ts-surface border-ts-border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ts-muted font-medium">Kapasitas Maksimal Studio</span>
              <div className="p-1.5 rounded-lg bg-ts-teal/20 text-ts-teal">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 font-mono font-bold text-base text-ts-teal">
              40–60 Pcs Kaos / Hari
            </div>
            <p className="text-[10px] text-ts-muted mt-1 font-mono">
              Siklus Press 15s + Curing 5s
            </p>
          </Card>
        </div>

        {/* Fixed Assets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fixedAssets.map(asset => (
            <Card key={asset.id} className="bg-ts-surface border-ts-border p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-ts-krem">{asset.assetName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">
                        {asset.category}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-[10px] text-ts-muted">
                        <MapPin className="w-3 h-3" /> {asset.location}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Hapus aset ${asset.assetName}?`)) {
                      removeFixedAsset(asset.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-ts-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Hapus Aset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-ts-borderDim/50 font-mono text-xs">
                <div className="bg-ts-hitam/50 p-2 rounded-lg border border-ts-borderDim">
                  <span className="text-[10px] text-ts-muted block">Harga Perolehan</span>
                  <span className="font-bold text-ts-krem">{formatRupiah(asset.purchaseCost)}</span>
                </div>
                <div className="bg-ts-hitam/50 p-2 rounded-lg border border-ts-borderDim">
                  <span className="text-[10px] text-ts-muted block">Nilai Buku Saat Ini</span>
                  <span className="font-bold text-amber-400">{formatRupiah(asset.currentValue)}</span>
                </div>
              </div>

              {asset.notes && (
                <p className="text-xs text-ts-muted bg-ts-hitam/30 p-2.5 rounded-lg border border-ts-borderDim/40">
                  {asset.notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Tambah Aset */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Aset Tetap / Peralatan Kerja (CAPEX)"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Mesin / Peralatan"
            placeholder="cth: Mesin Heat Press High-Pressure 38x38 cm"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori Aset"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="machine">Mesin Produksi (Heat Press, dll)</option>
              <option value="electronics">Elektronik &amp; Komputer</option>
              <option value="tools">Perkakas / Meja Kerja</option>
            </Select>

            <Input
              label="Lokasi Penyimpanan"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Harga Pembelian (Rp)"
              type="number"
              value={purchaseCost}
              onChange={(e) => {
                setPurchaseCost(e.target.value);
                setCurrentValue(e.target.value);
              }}
              required
            />
            <Input
              label="Estimasi Nilai Buku Saat Ini (Rp)"
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
            />
          </div>

          <Input
            label="Catatan / Spesifikasi"
            placeholder="cth: Suhu kerja 155°C, teflon sheet ganda"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-ts-borderDim">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Aset ke Neraca
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
