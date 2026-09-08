import React, { useState } from 'react';
import { Printer, Truck, ShieldCheck, Tag, Building2, User, Phone, MapPin, Package, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatters';

export function ShippingLabelModal({ isOpen, onClose, order }) {
  const [courier, setCourier] = useState(order?.courier || 'J&T Express');
  const [serviceType, setServiceType] = useState('EZ / REGULER');
  const [trackingNumber, setTrackingNumber] = useState(order?.trackingNo || order?.id || '');
  const [isDropship, setIsDropship] = useState(order?.channel === 'dropship' || false);
  const [dropshipStore, setDropshipStore] = useState('Distro Mitra Indie');
  const [dropshipPhone, setDropshipPhone] = useState('0812-3456-7890');
  const [fragileNote, setFragileNote] = useState('FRAGILE: PAKET APPAREL & MERCHANDISE — JANGAN DIBANTING');

  const handlePrint = () => {
    window.print();
  };

  if (!order) return null;

  // Weight estimation: ~250g per t-shirt
  const totalQty = order.qty || 1;
  const estimatedWeight = (totalQty * 0.25).toFixed(2);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Label Pengiriman Thermal (100x150 mm) — ${order.id}`} maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Controls / Customization Bar */}
        <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-ts-terracotta" />
              Konfigurasi Ekspedisi &amp; White-Label
            </span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 cursor-pointer text-ts-krem">
                <input
                  type="checkbox"
                  checked={isDropship}
                  onChange={(e) => setIsDropship(e.target.checked)}
                  className="rounded bg-white/10 text-ts-terracotta focus:ring-0"
                />
                <span className="font-semibold text-[11px]">Mode Dropship (White-Label)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-ts-muted mb-1 font-mono text-[10px] uppercase">Kurir Ekspedisi</label>
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#201E1B] border border-white/10 text-white focus:outline-none focus:border-ts-terracotta"
              >
                <option value="J&T Express">J&T Express</option>
                <option value="JNE Express">JNE Express</option>
                <option value="SiCepat Ekspres">SiCepat Ekspres</option>
                <option value="Shopee Xpress">Shopee Xpress</option>
                <option value="Anteraja">Anteraja</option>
                <option value="POS Indonesia">POS Indonesia</option>
                <option value="GoSend / Grab">GoSend / Grab Instant</option>
              </select>
            </div>

            <div>
              <label className="block text-ts-muted mb-1 font-mono text-[10px] uppercase">Layanan</label>
              <input
                type="text"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                placeholder="EZ / Reguler / Cargo"
                className="w-full px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-ts-terracotta"
              />
            </div>

            <div>
              <label className="block text-ts-muted mb-1 font-mono text-[10px] uppercase">No. Resi / Booking ID</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="JP8291029482"
                className="w-full px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:border-ts-terracotta font-mono"
              />
            </div>
          </div>

          {isDropship && (
            <div className="p-3 bg-ts-terracotta/10 border border-ts-terracotta/30 rounded-xl grid grid-cols-2 gap-3 text-xs animate-in fade-in">
              <div>
                <label className="block text-ts-muted mb-1 text-[10px]">Nama Toko Mitra (Pengirim)</label>
                <input
                  type="text"
                  value={dropshipStore}
                  onChange={(e) => setDropshipStore(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-ts-terracotta"
                />
              </div>
              <div>
                <label className="block text-ts-muted mb-1 text-[10px]">No. Telepon Toko Mitra</label>
                <input
                  type="text"
                  value={dropshipPhone}
                  onChange={(e) => setDropshipPhone(e.target.value)}
                  className="w-full px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-ts-terracotta"
                />
              </div>
            </div>
          )}
        </div>

        {/* ─── Printable Thermal Sticker Area (100x150 mm) ─── */}
        <div className="flex justify-center overflow-x-auto p-4 bg-gray-900/50 rounded-2xl border border-white/[0.06]">
          <div
            id="printable-shipping-label"
            className="w-[100mm] min-h-[150mm] bg-white text-black p-4 rounded-lg shadow-2xl font-sans text-xs flex flex-col justify-between border-2 border-black print:border-none print:m-0 print:p-2 print:shadow-none print:w-[100mm] print:h-[150mm]"
            style={{ boxSizing: 'border-box' }}
          >
            {/* Top Header: Courier & Barcode */}
            <div className="border-b-2 border-black pb-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-lg tracking-tight uppercase">{courier}</span>
                <span className="font-mono font-bold text-xs px-2 py-0.5 border border-black rounded">
                  {serviceType}
                </span>
              </div>

              {/* Barcode Mock Visual */}
              <div className="text-center py-1 bg-gray-50 border border-gray-300 rounded">
                <div className="h-9 flex items-center justify-center gap-0.5 px-4 overflow-hidden">
                  {/* Decorative Barcode Bars */}
                  {[3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1, 3, 2, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3].map((w, i) => (
                    <div
                      key={i}
                      className="bg-black h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <div className="font-mono text-[10px] font-bold tracking-widest mt-0.5">
                  {trackingNumber || order.id}
                </div>
              </div>
            </div>

            {/* Middle Section: Recipient & Sender */}
            <div className="border-b-2 border-black py-2.5 space-y-2">
              {/* Recipient */}
              <div className="space-y-0.5">
                <div className="text-[9px] font-mono font-bold uppercase text-gray-500 tracking-wider">
                  PENERIMA (CONSIGNEE):
                </div>
                <div className="font-black text-sm text-black uppercase">
                  {order.customer}
                </div>
                <div className="font-mono text-[11px] font-bold text-gray-800">
                  {order.phone || '-'}
                </div>
                <div className="text-[11px] leading-tight text-gray-900 font-medium pt-0.5">
                  {order.notes || order.shippingAddress || 'Alamat lengkap pengiriman sesuai order sistem.'}
                </div>
              </div>

              {/* Sender */}
              <div className="pt-2 border-t border-gray-300 grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="font-mono font-bold uppercase text-gray-500 text-[8px] block">
                    PENGIRIM (SHIPPER):
                  </span>
                  <span className="font-bold text-black uppercase">
                    {isDropship ? dropshipStore : 'TeeStock Apparel Official'}
                  </span>
                  <div className="font-mono text-gray-700">
                    {isDropship ? dropshipPhone : '0852-2027-4968'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold uppercase text-gray-500 text-[8px] block">
                    TANGGAL &amp; BERAT:
                  </span>
                  <span className="font-mono font-bold text-black">
                    {formatDate(order.date || new Date())}
                  </span>
                  <div className="font-mono font-bold text-black">
                    Qty: {totalQty} pcs ({estimatedWeight} kg)
                  </div>
                </div>
              </div>
            </div>

            {/* Items Content Specification */}
            <div className="py-2 border-b-2 border-black space-y-1">
              <div className="text-[9px] font-mono font-bold uppercase text-gray-500">
                RINCIAN ISI PAKET (CONTENT):
              </div>
              {order.items && order.items.length > 1 ? (
                <div className="space-y-0.5 text-[9px] font-mono">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between font-bold text-black">
                      <span className="truncate max-w-[190px]">{it.name || it.product_name}</span>
                      <span className="shrink-0">[{it.size} • {it.color} • x{it.qty}]</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] font-mono font-bold flex justify-between">
                  <span>{order.productName || order.sku}</span>
                  <span>[{order.garment || 'NSA 24s'} • {order.color || 'Black'} • {order.size || 'L'}]</span>
                </div>
              )}
            </div>

            {/* Fragile Notice & Instructions */}
            <div className="pt-1.5 space-y-1 text-center">
              <div className="bg-black text-white text-[9px] font-mono font-extrabold py-0.5 tracking-wider uppercase rounded">
                ⚠️ {fragileNote}
              </div>
              <div className="text-[8px] text-gray-600 font-medium">
                Wajib video unboxing tanpa jeda untuk klaim garansi retur/cacat produk.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <span className="text-xs text-ts-muted">
            Ukuran standar printer thermal stiker: <strong>100 x 150 mm (A6)</strong>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose}>
              Tutup
            </Button>
            <Button variant="glow" size="md" icon={Printer} onClick={handlePrint}>
              Cetak Label Thermal (Ctrl+P)
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
