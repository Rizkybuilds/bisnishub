import React, { useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import { AdminTopbar } from '../../components/admin/AdminTopbar';
import { InventoryGrid } from '../../components/admin/InventoryGrid';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { GARMENT_TYPES, SIZES } from '../../constants/garments';
import { useAdmin } from '../../context/AdminContext';

export function InventoryPage() {
  const { restockInventory } = useAdmin();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const [garmentKey, setGarmentKey] = useState('nsa_softstyle_30s');
  const [color, setColor] = useState('Hitam');
  const [size, setSize] = useState('L');
  const [qty, setQty] = useState(12);

  const currentGarment = GARMENT_TYPES[garmentKey];

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
        subtitle="Matriks inventori New State Apparel 30s, 24s, Long Sleeve, Hoodie, dan Polo"
        onNewDesign={() => setIsRestockModalOpen(true)}
      />

      <div className="p-8 max-w-7xl mx-auto">
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
