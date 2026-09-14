import React, { useState } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { Toast } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAdmin } from '../context/AdminContext';
import { CHANNELS } from '../constants/pricing';
import { GARMENT_TYPES, SIZES } from '../constants/garments';
import { formatRupiah } from '../utils/formatters';
import { SEOHead } from '../components/common/SEOHead';

export function AdminLayout() {
  const { toast, showToast, addOrder, catalog } = useAdmin();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Form Order state
  const [orderId, setOrderId] = useState(`ORD-${Date.now().toString().slice(-6)}`);
  const [channel, setChannel] = useState('shopee');
  const [trackingNo, setTrackingNo] = useState('');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSku, setSelectedSku] = useState(catalog[0]?.sku || '');
  const [garment, setGarment] = useState('NSA Softstyle 30s');
  const [color, setColor] = useState('Hitam');
  const [size, setSize] = useState('L');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(99000);
  const [notes, setNotes] = useState('');

  // CFO Financial Calculation for Preview
  const isMarketplace = channel === 'shopee' || channel === 'tiktok';
  const feeRate = isMarketplace ? 0.085 : 0;
  const calculatedFee = Math.round(Number(price || 0) * feeRate);
  const baseHppPerPcs = 64250;
  const totalHpp = baseHppPerPcs * Number(qty || 1);
  const netEstimatedProfit = Number(price || 0) - calculatedFee - totalHpp;

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!customer.trim()) {
      showToast("Mohon isi nama customer", "error");
      return;
    }

    const prod = catalog.find(p => p.sku === selectedSku) || { name: 'Custom Design' };
    const newOrder = {
      id: orderId.trim(),
      trackingNo: trackingNo.trim(),
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
      fee: calculatedFee,
      hpp: baseHppPerPcs,
      netProfit: netEstimatedProfit,
      notes: notes.trim(),
      status: 'pending',
      date: new Date().toISOString()
    };

    addOrder(newOrder);
    setIsOrderModalOpen(false);

    // Reset
    setOrderId(`ORD-${Date.now().toString().slice(-6)}`);
    setTrackingNo('');
    setCustomer('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="flex min-h-screen bg-ts-hitam text-ts-krem">
      <ScrollRestoration />
      <SEOHead
        title="TeeStock Operations & Production Hub"
        noindex={true}
      />
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
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Nomor Order TeeStock"
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
            <Input
              label="No. Resi / ID Marketplace"
              placeholder="Contoh: JP12345678"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
            />
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
                if (p) setPrice((p.priceRetail || 99000) * qty);
              }}
            >
              {catalog.map(p => (
                <option key={p.sku} value={p.sku}>[{p.sku}] {p.name}</option>
              ))}
            </Select>
            <Select
              label="Model Kaos NSA (Blanks)"
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
              label="Warna Kaos"
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
              onChange={(e) => {
                const newQty = Number(e.target.value);
                setQty(newQty);
                const p = catalog.find(item => item.sku === selectedSku);
                const unitPrice = p?.priceRetail || 99000;
                setPrice(unitPrice * newQty);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Harga Transaksi (Rp)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Catatan / Alamat Pengiriman"
              placeholder="Contoh: Titip satpam / Sablon depan dada A3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* CFO Real-time Financial Breakdown Preview */}
          <div className="bg-ts-hitam/60 border border-ts-borderDim rounded-xl p-3 text-xs space-y-1.5">
            <div className="text-[10px] font-bold text-ts-muted uppercase tracking-wider flex justify-between">
              <span>Simulasi Finansial Transaksi Ini:</span>
              <span className="font-mono text-ts-krem">Channel: {channel.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center pt-1">
              <div className="bg-ts-surface/80 p-2 rounded-lg border border-ts-borderDim">
                <div className="text-[10px] text-ts-muted">Total Bayar</div>
                <div className="font-mono font-bold text-ts-krem text-xs">{formatRupiah(price)}</div>
              </div>
              <div className="bg-ts-surface/80 p-2 rounded-lg border border-ts-borderDim">
                <div className="text-[10px] text-ts-muted">Fee Platform ({isMarketplace ? '8.5%' : '0%'})</div>
                <div className="font-mono font-bold text-rose-400 text-xs">-{formatRupiah(calculatedFee)}</div>
              </div>
              <div className="bg-ts-surface/80 p-2 rounded-lg border border-ts-borderDim">
                <div className="text-[10px] text-ts-muted">Estimasi HPP ({qty} pcs)</div>
                <div className="font-mono font-bold text-amber-400 text-xs">-{formatRupiah(totalHpp)}</div>
              </div>
              <div className="bg-ts-surface/80 p-2 rounded-lg border border-ts-borderDim">
                <div className="text-[10px] text-ts-muted">Laba Bersih Est.</div>
                <div className={`font-mono font-bold text-xs ${netEstimatedProfit >= 0 ? 'text-ts-green' : 'text-rose-400'}`}>
                  +{formatRupiah(netEstimatedProfit)}
                </div>
              </div>
            </div>
          </div>

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
