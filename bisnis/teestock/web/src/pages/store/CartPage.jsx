import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatRupiah } from '../../utils/formatters';

export function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart, totalCartAmount } = useStore();
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
        fee: Math.round((item.price * item.qty) * 0.015), // Gateway fee ~1.5%
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
    const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
      `Halo TeeStock! Saya sudah melakukan checkout di website:\nNo. Order: ${orderComplete.orderId}\nNama: ${orderComplete.customerName}\nTotal: ${formatRupiah(orderComplete.total)}\nMohon info rekening pembayaran dan nomor resi. Terima kasih!`
    )}`;

    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-ts-krem">Pesanan Berhasil Dibuat!</h2>
          <p className="text-xs sm:text-sm text-ts-muted">
            Nomor Pesanan Anda: <strong className="text-ts-terracotta font-mono font-bold text-base">{orderComplete.orderId}</strong>
          </p>
          <p className="text-xs text-ts-muted">
            Simpan nomor pesanan ini untuk melacak status kaos Anda di halaman <strong>Lacak Pesanan</strong>.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a href={waUrl} target="_blank" rel="noreferrer">
            <Button size="lg" variant="primary" icon={MessageSquare}>
              Konfirmasi Pembayaran via WhatsApp
            </Button>
          </a>
          <Link to="/">
            <Button size="lg" variant="secondary">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-ts-surface border border-ts-border flex items-center justify-center mx-auto text-ts-muted">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-ts-krem">Keranjang Belanja Masih Kosong</h2>
        <p className="text-xs text-ts-muted max-w-sm mx-auto">
          Yuk jelajahi 9 series desain kami dan temukan kaos yang paling cocok dengan karakter kamu.
        </p>
        <Link to="/katalog">
          <Button variant="primary">Mulai Belanja Sekarang</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ts-krem">Keranjang Belanja & Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-ts-surface border border-ts-border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.filePath}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-ts-hitam shrink-0 border border-ts-border"
                />
                <div>
                  <span className="font-mono text-[10px] text-ts-terracotta font-bold">{item.sku}</span>
                  <h3 className="font-bold text-sm text-ts-krem">{item.name}</h3>
                  <div className="text-xs text-ts-muted mt-0.5">
                    {item.garment} • {item.color} ({item.size})
                  </div>
                  <div className="font-mono text-xs font-bold text-ts-green mt-1">
                    {formatRupiah(item.price)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-ts-borderDim">
                <div className="flex items-center border border-ts-border rounded-lg bg-ts-hitam p-1">
                  <button
                    onClick={() => updateCartQty(idx, -1)}
                    className="w-6 h-6 rounded hover:bg-ts-surface text-ts-krem font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-xs text-ts-krem">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateCartQty(idx, 1)}
                    className="w-6 h-6 rounded hover:bg-ts-surface text-ts-krem font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <div className="font-mono text-sm font-extrabold text-ts-krem min-w-[90px] text-right">
                  {formatRupiah(item.price * item.qty)}
                </div>

                <button
                  onClick={() => removeFromCart(idx)}
                  className="p-1.5 text-ts-muted hover:text-ts-red transition-colors"
                  title="Hapus item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Checkout Shipping Form */}
          <form id="checkoutForm" onSubmit={handleCheckout} className="bg-ts-surface border border-ts-border rounded-2xl p-6 space-y-4 shadow-xl mt-6">
            <h3 className="text-sm font-bold text-ts-krem pb-3 border-b border-ts-borderDim">
              Informasi Pengiriman
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nama Penerima"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Kota / Kabupaten"
                placeholder="Contoh: Jakarta Selatan"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <Select
                label="Pilihan Kurir"
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
              <label className="block text-xs font-bold text-ts-krem/90 mb-1.5">Alamat Lengkap (Jalan, RT/RW, No. Rumah, Kode Pos)</label>
              <textarea
                placeholder="Alamat lengkap tujuan pengiriman pesanan kamu..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-ts-hitam border border-ts-border rounded-xl p-3 text-xs text-ts-krem focus:outline-none focus:border-ts-terracotta h-20"
              />
            </div>
          </form>
        </div>

        {/* Order Summary Column */}
        <Card className="space-y-4 sticky top-24">
          <h3 className="text-sm font-bold text-ts-krem pb-2 border-b border-ts-borderDim">
            Ringkasan Pesanan
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-ts-muted">
              <span>Subtotal Produk ({cart.length} item):</span>
              <span className="font-mono text-ts-krem font-bold">{formatRupiah(totalCartAmount)}</span>
            </div>
            <div className="flex justify-between text-ts-muted">
              <span>Estimasi Ongkos Kirim:</span>
              <span className="font-mono text-ts-krem font-bold">{formatRupiah(shippingFee)}</span>
            </div>

            <div className="pt-3 border-t border-ts-borderDim flex justify-between items-baseline">
              <span className="font-bold text-ts-krem text-sm">Total Tagihan:</span>
              <span className="font-mono text-xl font-extrabold text-ts-green">{formatRupiah(grandTotal)}</span>
            </div>
          </div>

          <Button
            type="submit"
            form="checkoutForm"
            variant="primary"
            size="lg"
            className="w-full"
            icon={ArrowRight}
          >
            Konfirmasi & Pesan Sekarang
          </Button>

          <div className="text-[11px] text-ts-muted text-center pt-2">
            🔒 Transaksi aman & garansi retur jika terjadi cacat sablon atau salah ukuran.
          </div>
        </Card>
      </div>
    </div>
  );
}
