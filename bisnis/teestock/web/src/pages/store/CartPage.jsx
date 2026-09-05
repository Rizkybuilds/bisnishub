import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Package, Truck, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber } from '../../utils/whatsappTemplates';

export function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart, totalCartAmount, storeSettings } = useStore();
  const { addOrder } = useAdmin();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [courier, setCourier] = useState('J&T Express');
  const [orderComplete, setOrderComplete] = useState(null);

  const shippingFee = cart.length > 0 ? 15000 : 0;
  const grandTotal = totalCartAmount + shippingFee;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert("Mohon lengkapi nama, nomor WhatsApp, dan alamat pengiriman");
      return;
    }

    const orderId = `WEB-${Date.now().toString().slice(-6)}`;
    
    // Save each cart item as part of the order
    cart.forEach(item => {
      const orderRecord = {
        id: orderId,
        customer: customerName.trim(),
        phone: `${phone.trim()} (${city.trim() || 'Indonesia'})`,
        channel: 'web',
        sku: item.sku,
        productName: item.name,
        garment: item.garment,
        color: item.color,
        size: item.size,
        qty: item.qty,
        price: item.price * item.qty,
        fee: Math.round((item.price * item.qty) * 0.015),
        status: 'pending',
        date: new Date().toISOString()
      };
      addOrder(orderRecord);
    });

    setOrderComplete({
      orderId,
      customerName,
      phone,
      total: grandTotal,
      itemCount: cart.length
    });

    clearCart();
  };

  if (orderComplete) {
    const targetPhone = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
      `Halo TeeStock! Saya sudah melakukan checkout di website:\nNo. Order: ${orderComplete.orderId}\nNama: ${orderComplete.customerName}\nTotal Tagihan: ${formatRupiah(orderComplete.total)}\nMohon info nomor rekening transfer pembayaran dan konfirmasi resi. Terima kasih!`
    )}`;

    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30 shadow-glow-teal">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Pesanan Berhasil Dibuat!</h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted">
            Nomor Pesanan Anda: <strong className="text-ts-terracotta font-mono font-bold text-base px-2 py-0.5 rounded-lg bg-ts-terracotta/10 border border-ts-terracotta/30">{orderComplete.orderId}</strong>
          </p>
          <p className="text-xs text-ts-muted">
            Simpan nomor pesanan ini untuk mengecek progres kaos Anda di menu <strong>Lacak Pesanan</strong>.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={waUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
            <Button size="lg" variant="whatsapp" icon={MessageSquare} className="w-full">
              Konfirmasi Pembayaran via WhatsApp
            </Button>
          </a>
          <Link to="/" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-ts-muted shadow-glass-inset">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Troli Belanja Anda Masih Kosong</h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-sm mx-auto">
            Temukan desain distro tematik sesuai kepribadianmu atau pesan kaos polos NSA sekarang.
          </p>
        </div>
        <Link to="/katalog">
          <Button variant="glow" size="lg">Mulai Jelajahi Katalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Troli &amp; Pengiriman Pesanan</h1>
        <p className="text-xs text-ts-kremMuted mt-1">Periksa kembali item pesanan dan lengkapi alamat penerima.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List & Shipping Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-ts-surface/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glass-card shadow-glass-inset"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={item.filePath || item.file_path}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover bg-ts-hitam shrink-0 border border-white/10"
                  />
                  <div>
                    <span className="font-mono text-[10px] text-ts-terracotta font-bold">{item.sku}</span>
                    <h3 className="font-bold text-sm text-white">{item.name}</h3>
                    <div className="text-xs text-ts-kremMuted mt-0.5">
                      {item.garment} • {item.color} ({item.size})
                    </div>
                    <div className="font-mono text-xs font-bold text-ts-green mt-1">
                      {formatRupiah(item.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.06]">
                  <div className="flex items-center border border-white/[0.1] rounded-xl bg-white/[0.03] p-1">
                    <button
                      type="button"
                      onClick={() => updateCartQty(idx, -1)}
                      className="w-7 h-7 rounded-lg hover:bg-white/[0.1] text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-white">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(idx, 1)}
                      className="w-7 h-7 rounded-lg hover:bg-white/[0.1] text-white font-bold text-xs cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-mono text-sm font-extrabold text-white min-w-[90px] text-right">
                    {formatRupiah(item.price * item.qty)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(idx)}
                    className="p-2 text-ts-muted hover:text-ts-red hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                    title="Hapus item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Shipping Form */}
          <form id="checkoutForm" onSubmit={handleCheckout} className="bg-ts-surface/80 backdrop-blur-xl border border-white/[0.09] rounded-3xl p-6 sm:p-7 space-y-4 shadow-glass-card shadow-glass-inset">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-white/[0.06] flex items-center gap-2">
              <Truck className="w-4 h-4 text-ts-teal" />
              <span>Informasi Penerima &amp; Alamat Kirim</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Nama Lengkap Penerima"
                placeholder="Contoh: Budi Santoso"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              <Input
                label="Nomor WhatsApp"
                placeholder="0812-xxxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Kota / Kabupaten"
                placeholder="Contoh: Bandung, Surabaya, Medan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Select
                label="Pilihan Kurir Rekomendasi"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
              >
                <option value="J&T Express">J&T Express</option>
                <option value="SiCepat Reguler">SiCepat Reguler</option>
                <option value="JNE Reguler">JNE Reguler</option>
                <option value="Shopee Xpress">SPX Standard</option>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white mb-1.5">Alamat Lengkap Pengiriman</label>
              <textarea
                placeholder="Jalan, RT/RW, No. Rumah, Kelurahan, Kecamatan, Kode Pos..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-ts-hitam/80 border border-white/[0.1] rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-ts-terracotta h-20"
              />
            </div>
          </form>
        </div>

        {/* Order Summary Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="bg-ts-surface/80 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 space-y-5 shadow-glass-card shadow-glass-inset">
            <h3 className="text-sm font-bold text-white pb-3 border-b border-white/[0.08] flex items-center gap-2">
              <Package className="w-4 h-4 text-ts-terracotta" />
              <span>Ringkasan Tagihan</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-ts-kremMuted">
                <span>Subtotal ({cart.length} item):</span>
                <span className="font-mono text-white font-bold">{formatRupiah(totalCartAmount)}</span>
              </div>
              <div className="flex justify-between text-ts-kremMuted">
                <span>Estimasi Ongkos Kirim:</span>
                <span className="font-mono text-white font-bold">{formatRupiah(shippingFee)}</span>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-between items-baseline">
                <span className="font-bold text-white text-sm">Total Pembayaran:</span>
                <span className="font-mono text-2xl font-black text-ts-green">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkoutForm"
              variant="glow"
              size="lg"
              className="w-full text-sm py-3.5 font-extrabold"
              icon={ArrowRight}
            >
              Konfirmasi &amp; Proses Pesanan
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-ts-muted text-center pt-2">
              <Lock className="w-3.5 h-3.5 text-ts-green" />
              <span>Checkout aman langsung terhubung ke admin WhatsApp</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
