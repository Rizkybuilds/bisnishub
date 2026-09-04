import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Toast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAdmin } from '../context/AdminContext';
import { CHANNELS } from '../constants/pricing';
import { GARMENT_TYPES, SIZES } from '../constants/garments';

export function AdminLayout() {
  const { toast, showToast, addOrder, catalog } = useAdmin();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Form Order state
  const [orderId, setOrderId] = useState(`ORD-${Date.now().toString().slice(-6)}`);
  const [channel, setChannel] = useState('shopee');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSku, setSelectedSku] = useState(catalog[0]?.sku || '');
  const [garment, setGarment] = useState('NSA Softstyle 30s');
  const [color, setColor] = useState('Hitam');
  const [size, setSize] = useState('L');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(99000);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!customer.trim()) {
      alert("Mohon isi nama customer");
      return;
    }

    const prod = catalog.find(p => p.sku === selectedSku) || { name: 'Custom Design' };
    const newOrder = {
      id: orderId,
      customer: customer.trim(),
      phone: phone.trim(),
      channel,
      sku: selectedSku,
      productName: prod.name,
      garment,
      color,
      size,
      qty: Number(qty),
      price: Number(price),
      fee: channel === 'shopee' ? Math.round(price * 0.065) : 0,
      status: 'pending',
      date: new Date().toISOString()
    };

    addOrder(newOrder);
    setIsOrderModalOpen(false);
    // Reset
    setOrderId(`ORD-${Date.now().toString().slice(-6)}`);
    setCustomer('');
    setPhone('');
  };

  return (
    <div className="flex min-h-screen bg-ts-hitam text-ts-krem">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet context={{ openNewOrderModal: () => setIsOrderModalOpen(true) }} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Global Quick Order Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title="Input Pesanan Baru (Multi-Channel)"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nomor Pesanan / Resi"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
            <Select
              label="Channel Penjualan"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {CHANNELS.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Pembeli"
              placeholder="Contoh: Budi Santoso"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              required
            />
            <Input
              label="WhatsApp / Telepon"
              placeholder="0812-xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Pilih Desain (Master PIM)"
              value={selectedSku}
              onChange={(e) => {
                setSelectedSku(e.target.value);
                const p = catalog.find(item => item.sku === e.target.value);
                if (p) setPrice(p.priceRetail || 99000);
              }}
            >
              {catalog.map(p => (
                <option key={p.sku} value={p.sku}>[{p.sku}] {p.name}</option>
              ))}
            </Select>
            <Select
              label="Model Kaos NSA"
              value={garment}
              onChange={(e) => setGarment(e.target.value)}
            >
              {Object.values(GARMENT_TYPES).filter(g => g.id !== 'supplies').map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Warna"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <Select
              label="Ukuran"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input
              label="Qty (Pcs)"
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <Input
            label="Total Harga Transaksi (Rp)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-ts-borderDim">
            <Button type="button" variant="secondary" onClick={() => setIsOrderModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Pesanan ke Antrean
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
