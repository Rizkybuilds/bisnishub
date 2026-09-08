import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2, MessageSquare, Package, Truck, Lock, Tag, X, Sparkles, Loader2, QrCode } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { createPublicOrder } from '../../services/ordersApi';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { formatRupiah } from '../../utils/formatters';
import { sanitizePhoneNumber, generateOrderCheckoutWhatsAppText } from '../../utils/whatsappTemplates';
import { validateVoucher } from '../../services/vouchersApi';
import { calculateBundleDiscount, BUNDLE_DEALS, SHIPPING_ZONES, getShippingRateByZone } from '../../constants/pricing';
import { QrisPaymentBox } from '../../components/store/QrisPaymentBox';

export function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart, totalCartAmount, storeSettings } = useStore();
  const { user, profile, role } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [subdistrict, setSubdistrict] = useState('');
  const [shippingZone, setShippingZone] = useState('jawa_lainnya');
  const [courier, setCourier] = useState('J&T Express');
  const [orderComplete, setOrderComplete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // 3-digit unique code for manual QRIS verification (101 - 999)
  const [uniqueCode] = useState(() => Math.floor(100 + Math.random() * 899));

  // Voucher states
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState(null);

  // Auto-fill recipient data from member profile if logged in
  useEffect(() => {
    if (profile) {
      if (profile.full_name && !customerName) setCustomerName(profile.full_name);
      if (profile.phone && !phone) setPhone(profile.phone);
      if (profile.default_address && !address) setAddress(profile.default_address);
      if (profile.city && !city) setCity(profile.city);
      if (profile.subdistrict && !subdistrict) setSubdistrict(profile.subdistrict);
    }
  }, [profile]);

  // Bundling calculations: strictly for graphic t-shirts to protect blank margins
  const totalCartQty = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const eligibleGraphicQty = cart
    .filter(item => item.series !== 'blank' && !item.sku?.startsWith('TS-BLK-'))
    .reduce((acc, item) => acc + (item.qty || 1), 0);
  const bundleDiscount = calculateBundleDiscount(eligibleGraphicQty, role);

  // 🚚 Zona Ongkir Bertingkat
  const selectedZone = SHIPPING_ZONES.find(z => z.id === shippingZone) || SHIPPING_ZONES[1];
  const rawShippingFee = cart.length > 0 ? selectedZone.rate : 0;
  const isFreeShippingVoucher = appliedVoucher?.type === 'free_shipping';
  const shippingDiscount = isFreeShippingVoucher ? Math.min(rawShippingFee, discountAmount) : 0;
  const shippingFee = Math.max(0, rawShippingFee - shippingDiscount);

  // 💰 Aturan Diskon Non-Stackable (Opsi A - Proteksi Margin CFO):
  // Diskon bundling otomatis dan kupon voucher produk tidak ditumpuk sekaligus.
  // Sistem otomatis memilih diskon dengan nilai rupiah terbesar untuk pembeli.
  let effectiveProductDiscount = 0;
  let activeDiscountLabel = '';

  if (isFreeShippingVoucher) {
    effectiveProductDiscount = bundleDiscount;
    activeDiscountLabel = bundleDiscount > 0 ? 'bundle' : 'none';
  } else {
    if (bundleDiscount > 0 && discountAmount > 0) {
      if (bundleDiscount >= discountAmount) {
        effectiveProductDiscount = bundleDiscount;
        activeDiscountLabel = 'bundle_preferred'; // bundling lebih besar
      } else {
        effectiveProductDiscount = discountAmount;
        activeDiscountLabel = 'voucher_preferred'; // voucher lebih besar
      }
    } else if (bundleDiscount > 0) {
      effectiveProductDiscount = bundleDiscount;
      activeDiscountLabel = 'bundle';
    } else if (discountAmount > 0) {
      effectiveProductDiscount = discountAmount;
      activeDiscountLabel = 'voucher';
    }
  }

  const baseGrandTotal = Math.max(0, totalCartAmount - effectiveProductDiscount) + shippingFee;
  const grandTotal = baseGrandTotal > 0 ? (baseGrandTotal + uniqueCode) : 0;

  const handleApplyVoucher = async (codeToApply = null) => {
    const code = codeToApply || voucherInput;
    if (!code || !code.trim()) {
      setVoucherMsg({ type: 'error', text: 'Masukkan kode voucher terlebih dahulu.' });
      return;
    }

    setVoucherLoading(true);
    setVoucherMsg(null);

    const result = await validateVoucher(code, totalCartAmount, role);
    setVoucherLoading(false);

    if (result.valid) {
      setAppliedVoucher(result.voucher);
      setDiscountAmount(result.discountAmount);
      setVoucherMsg({ type: 'success', text: result.message });
      setVoucherInput('');
    } else {
      setVoucherMsg({ type: 'error', text: result.message });
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
    setVoucherMsg(null);
  };

  const handleCheckout = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const errors = {};

    if (!customerName.trim()) {
      errors.customerName = 'Nama penerima wajib diisi.';
    }
    if (!phone.trim()) {
      errors.phone = 'Nomor WhatsApp wajib diisi.';
    } else if (phone.trim().replace(/\D/g, '').length < 8) {
      errors.phone = 'Nomor WhatsApp minimal 8 digit.';
    }
    if (!city.trim()) {
      errors.city = 'Kota / Kabupaten pengiriman wajib diisi.';
    }
    if (!subdistrict.trim()) {
      errors.subdistrict = 'Kecamatan wajib diisi.';
    }
    if (!address.trim()) {
      errors.address = 'Alamat jalan & detail rumah wajib diisi.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorField = Object.keys(errors)[0];
      const targetElement = document.getElementById(firstErrorField);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.focus?.();
      }
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      const orderId = `WEB-${Date.now().toString().slice(-6)}`;
      const cleanCity = city.trim();
      const cleanSubdistrict = subdistrict.trim();
      const cleanAddress = address.trim();
      const fullCityDisplay = cleanSubdistrict ? `${cleanCity} (Kec. ${cleanSubdistrict})` : cleanCity;
      const fullAddressDisplay = cleanSubdistrict ? `Kec. ${cleanSubdistrict}, ${cleanAddress}` : cleanAddress;
      
      // Simpan 1 header pesanan relasional dengan seluruh rincian item belanja
      const orderRecord = {
        id: orderId,
        order_number: orderId,
        customer: customerName.trim(),
        phone: `${phone.trim()} (${fullCityDisplay})`,
        city: fullCityDisplay,
        address: fullAddressDisplay,
        shipping_zone: selectedZone.name,
        shipping_fee: shippingFee,
        channel: 'web',
        tier: role || 'retail',
        status: 'pending',
        price: grandTotal,
        total_amount: grandTotal,
        discount: effectiveProductDiscount + shippingDiscount,
        discount_amount: effectiveProductDiscount + shippingDiscount,
        voucher_code: appliedVoucher?.code || null,
        unique_code: uniqueCode,
        uniqueCode: uniqueCode,
        user_id: user?.id || null,
        payment_method: 'qris_manual',
        items: [...cart],
        date: new Date().toISOString()
      };
      
      // 🛡️ P0: WAJIB DIAWAIT agar pesanan benar-benar tercatat di Supabase
      await createPublicOrder(orderRecord, cart);

      setOrderComplete({
        orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        city: cleanCity,
        subdistrict: cleanSubdistrict,
        address: cleanAddress,
        shippingZone: selectedZone.name,
        shippingFee,
        courier,
        items: [...cart],
        baseTotal: baseGrandTotal,
        uniqueCode,
        total: grandTotal,
        itemCount: cart.length
      });

      clearCart();
    } catch (err) {
      console.error("Gagal memproses checkout:", err);
      alert("Terjadi kendala jaringan saat mencatat pesanan. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    const merchantName = storeSettings?.qrisMerchantName || 'TeeStock Apparel';
    const targetPhone = sanitizePhoneNumber(storeSettings?.storeWhatsapp || '085220274968');
    const waText = generateOrderCheckoutWhatsAppText({
      orderId: orderComplete.orderId,
      customerName: orderComplete.customerName,
      phone: orderComplete.phone,
      city: orderComplete.city,
      subdistrict: orderComplete.subdistrict,
      address: orderComplete.address,
      courier: orderComplete.courier,
      items: orderComplete.items,
      baseTotal: orderComplete.baseTotal,
      uniqueCode: orderComplete.uniqueCode,
      totalTransfer: orderComplete.total,
      merchantName
    });
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(waText)}`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30 shadow-glow-teal">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ts-terracotta/15 border border-ts-terracotta/30 text-xs font-mono font-bold text-ts-terracotta">
            Pesanan #{orderComplete.orderId}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Pesanan Berhasil Dicatat!</h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md mx-auto">
            Silakan scan QRIS di bawah ini dan transfer nominal <strong>persis sampai 3 angka terakhir</strong> untuk verifikasi instan.
          </p>
        </div>

        {/* Official QRIS Component */}
        <QrisPaymentBox
          orderId={orderComplete.orderId}
          customerName={orderComplete.customerName}
          phone={orderComplete.phone}
          baseTotal={orderComplete.baseTotal}
          uniqueCode={orderComplete.uniqueCode}
          totalTransfer={orderComplete.total}
          merchantName={merchantName}
          nmid={storeSettings?.qrisNmid || 'ID102609070001'}
          qrisImageUrl={storeSettings?.qrisImageUrl || ''}
          bankName={storeSettings?.bankName || 'BCA'}
          bankAccountNo={storeSettings?.bankAccountNo || ''}
          bankAccountHolder={storeSettings?.bankAccountHolder || 'TeeStock Apparel'}
          waUrl={waUrl}
        />

        <div className="pt-2">
          <Link to="/" className="inline-block text-xs font-medium text-ts-kremMuted hover:text-white transition-colors">
            ← Kembali ke Beranda
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-32 md:pb-16 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Troli &amp; Pengiriman Pesanan</h1>
        <p className="text-xs text-ts-kremMuted mt-1">Periksa kembali item pesanan dan lengkapi alamat penerima.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List & Shipping Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dynamic Bundling Progress Bar (AOV Booster) */}
          {role !== 'reseller' && role !== 'dropship' && (
            <div className="p-4 rounded-2xl bg-ts-surface border border-white/[0.08] space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-ts-mustard animate-pulse" />
                  {totalCartQty >= 2 
                    ? "Paket Hemat Duo / Trio Telah Aktif! 🎉" 
                    : "Tambah 1 Kaos Lagi untuk Hemat Rp 18.000 (Paket Duo)!"}
                </span>
                <span className="font-mono text-xs text-ts-mustard font-bold">
                  {Math.min(100, Math.round((totalCartQty / 2) * 100))}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-ts-terracotta to-ts-mustard rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((totalCartQty / 2) * 100))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-ts-kremMuted pt-0.5">
                <span>{totalCartQty >= 2 ? "Diskon otomatis diterapkan pada total pesanan" : "Bebas campur desain grafis & model kaos polos"}</span>
                {totalCartQty < 2 && (
                  <Link to="/katalog" className="text-ts-terracotta hover:underline font-bold">
                    + Tambah Kaos Lain &rarr;
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Active Bundle Banner */}
          {bundleDiscount > 0 && (
            <div className="p-3.5 rounded-2xl bg-ts-terracotta/15 border border-ts-terracotta/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-ts-mustard" />
                <div>
                  <span className="font-bold text-white">
                    {eligibleGraphicQty >= 3 ? 'Paket Trio Kaos Grafis (Diskon Rp 14.000/pcs)' : 'Paket Duo Kaos Grafis (Diskon Rp 18.000)'}
                  </span>
                  <span className="text-[11px] text-ts-kremMuted block">Diskon kuantitas {eligibleGraphicQty} pcs kaos grafis diterapkan otomatis.</span>
                </div>
              </div>
              <span className="font-mono font-bold text-ts-mustard text-sm bg-ts-terracotta/20 px-2 py-0.5 rounded border border-ts-terracotta/30">
                - {formatRupiah(bundleDiscount)}
              </span>
            </div>
          )}

          <div className="space-y-3">
            {cart.map((item, idx) => (
              <div
                key={`${item.sku}-${item.garment}-${item.color}-${item.size}-${idx}`}
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateCartQty(idx, -1);
                      }}
                      className="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/[0.1] text-white font-bold text-sm cursor-pointer transition-colors"
                      title="Kurangi kuantitas"
                      aria-label="Kurangi kuantitas"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-white select-none">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateCartQty(idx, 1);
                      }}
                      className="w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-white/[0.1] text-white font-bold text-sm cursor-pointer transition-colors"
                      title="Tambah kuantitas"
                      aria-label="Tambah kuantitas"
                    >
                      +
                    </button>
                  </div>

                  <div className="font-mono text-sm font-extrabold text-white min-w-[90px] text-right">
                    {formatRupiah(item.price * item.qty)}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromCart(idx);
                    }}
                    className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-ts-muted hover:text-red-400 hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                    title="Hapus item"
                    aria-label="Hapus item dari troli"
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
                id="customerName"
                label="Nama Lengkap Penerima"
                placeholder="Contoh: Budi Santoso"
                value={customerName}
                error={formErrors.customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (formErrors.customerName) setFormErrors(prev => ({ ...prev, customerName: null }));
                }}
                required
              />
              <Input
                id="phone"
                label="Nomor WhatsApp"
                placeholder="0812-xxxx-xxxx"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                error={formErrors.phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                }}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                id="city"
                label="Kota / Kabupaten"
                placeholder="Contoh: Bandung / Surabaya / Medan"
                value={city}
                error={formErrors.city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (formErrors.city) setFormErrors(prev => ({ ...prev, city: null }));
                }}
                required
              />
              <Input
                id="subdistrict"
                label="Kecamatan"
                placeholder="Contoh: Coblong / Sukajadi"
                value={subdistrict}
                error={formErrors.subdistrict}
                onChange={(e) => {
                  setSubdistrict(e.target.value);
                  if (formErrors.subdistrict) setFormErrors(prev => ({ ...prev, subdistrict: null }));
                }}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Select
                id="shippingZone"
                label="Wilayah Pengiriman (Zona Tarif Ongkir)"
                value={shippingZone}
                onChange={(e) => setShippingZone(e.target.value)}
              >
                {SHIPPING_ZONES.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.name} — {formatRupiah(z.rate)} ({z.eta})
                  </option>
                ))}
              </Select>
              <Select
                id="courier"
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
              <label htmlFor="address" className="block text-xs font-bold text-ts-krem/90 mb-1.5">
                Alamat Jalan &amp; Detail Rumah
              </label>
              <textarea
                id="address"
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, patokan lokasi..."
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (formErrors.address) setFormErrors(prev => ({ ...prev, address: null }));
                }}
                required
                aria-invalid={!!formErrors.address}
                className={`w-full bg-ts-hitam/80 border ${
                  formErrors.address
                    ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/50'
                    : 'border-white/[0.1] focus:border-ts-terracotta focus:ring-ts-terracotta'
                } rounded-2xl p-3 text-xs text-white placeholder:text-[#9A968D] focus:outline-none focus:ring-1 transition-colors h-20`}
              />
              {formErrors.address && (
                <p role="alert" className="text-[11px] text-red-400 font-medium mt-1 animate-in fade-in duration-200">
                  {formErrors.address}
                </p>
              )}
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

            {/* Voucher Section */}
            <div className="space-y-2.5 pt-1">
              <label className="block text-[11px] font-bold text-ts-krem flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-ts-mustard" />
                <span>Punya Kode Voucher / Kupon?</span>
              </label>

              {appliedVoucher ? (
                <div className="p-3 rounded-2xl bg-ts-green/15 border border-ts-green/30 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-ts-green shrink-0" />
                    <div>
                      <span className="font-mono font-bold text-white block">{appliedVoucher.code}</span>
                      <span className="text-[11px] text-emerald-300">Potongan {formatRupiah(discountAmount)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="p-1 rounded-lg text-ts-muted hover:text-white hover:bg-white/[0.08] transition-colors"
                    title="Batalkan Voucher"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                      placeholder="Contoh: WELCOME10"
                      className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white uppercase font-mono placeholder-ts-muted focus:outline-none focus:border-ts-terracotta"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => handleApplyVoucher()}
                      disabled={voucherLoading}
                      className="shrink-0"
                    >
                      {voucherLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Terapkan'}
                    </Button>
                  </div>

                  {/* Quick voucher shortcut chip */}
                  <button
                    type="button"
                    onClick={() => handleApplyVoucher('WELCOME10')}
                    className="inline-flex items-center gap-1.5 text-[10px] text-ts-mustard hover:text-ts-mustard/80 underline font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Gunakan voucher selamat datang: WELCOME10 (-10%)</span>
                  </button>
                </div>
              )}

              {voucherMsg && (
                <p className={`text-[11px] leading-tight ${voucherMsg.type === 'success' ? 'text-ts-green' : 'text-red-400'}`}>
                  {voucherMsg.text}
                </p>
              )}
            </div>

            <div className="space-y-3 text-xs pt-3 border-t border-white/[0.06]">
              <div className="flex justify-between text-ts-kremMuted">
                <span>Subtotal ({totalCartQty} kaos):</span>
                <span className="font-mono text-white font-bold">{formatRupiah(totalCartAmount)}</span>
              </div>

              {/* Rincian Diskon (Non-Stackable Option A) */}
              {activeDiscountLabel === 'bundle' && (
                <div className="flex justify-between text-ts-terracotta font-semibold">
                  <span>Diskon Paket Bundling ({totalCartQty} pcs):</span>
                  <span className="font-mono">- {formatRupiah(bundleDiscount)}</span>
                </div>
              )}

              {activeDiscountLabel === 'bundle_preferred' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-ts-terracotta font-semibold">
                    <span>Diskon Paket Bundling ({totalCartQty} pcs):</span>
                    <span className="font-mono">- {formatRupiah(bundleDiscount)}</span>
                  </div>
                  <p className="text-[10px] text-ts-muted italic">
                    *Diskon bundling otomatis diterapkan karena lebih hemat daripada voucher {appliedVoucher?.code} ({formatRupiah(discountAmount)}).
                  </p>
                </div>
              )}

              {activeDiscountLabel === 'voucher' && (
                <div className="flex justify-between text-ts-green font-semibold">
                  <span>Diskon Kupon ({appliedVoucher?.code}):</span>
                  <span className="font-mono">- {formatRupiah(discountAmount)}</span>
                </div>
              )}

              {activeDiscountLabel === 'voucher_preferred' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-ts-green font-semibold">
                    <span>Diskon Kupon ({appliedVoucher?.code}):</span>
                    <span className="font-mono">- {formatRupiah(discountAmount)}</span>
                  </div>
                  <p className="text-[10px] text-ts-muted italic">
                    *Kupon voucher diterapkan karena potongan lebih besar daripada bundling ({formatRupiah(bundleDiscount)}).
                  </p>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between text-ts-kremMuted">
                  <span>Ongkir ({selectedZone.name}):</span>
                  <div className="text-right">
                    {shippingDiscount > 0 ? (
                      <span className="space-x-1.5">
                        <span className="font-mono text-ts-muted line-through text-[11px]">{formatRupiah(rawShippingFee)}</span>
                        <span className="font-mono text-ts-green font-bold">{formatRupiah(shippingFee)}</span>
                      </span>
                    ) : (
                      <span className="font-mono text-white font-bold">{formatRupiah(shippingFee)}</span>
                    )}
                  </div>
                </div>
                {shippingDiscount > 0 && (
                  <div className="flex justify-between text-ts-green font-semibold text-[11px]">
                    <span>Subsidi Ongkir ({appliedVoucher?.code}):</span>
                    <span className="font-mono">- {formatRupiah(shippingDiscount)}</span>
                  </div>
                )}
                <p className="text-[10px] text-ts-kremMuted/80 leading-relaxed">
                  Estimasi tiba: <span className="text-white font-medium">{selectedZone.eta}</span> via {courier}
                </p>
              </div>

              {/* Unique Code Row */}
              <div className="flex justify-between items-center text-xs py-1.5 px-3 rounded-xl bg-ts-mustard/10 border border-ts-mustard/25">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-ts-mustard" />
                  <span className="font-semibold text-ts-krem">Kode Unik Verifikasi (3 Digit):</span>
                </div>
                <span className="font-mono font-black text-ts-mustard bg-ts-mustard/20 px-1.5 py-0.5 rounded border border-ts-mustard/30">
                  + {formatRupiah(uniqueCode)}
                </span>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-white text-sm block">Total Transfer Persis:</span>
                  <span className="text-[10px] text-ts-kremMuted">Wajib transfer tepat s/d 3 digit akhir</span>
                </div>
                <span className="font-mono text-2xl font-black text-ts-green">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-red-500" />
                  Metode: QRIS Standar Nasional
                </span>
                <span className="text-[10px] font-mono font-bold text-ts-green bg-ts-green/10 px-2 py-0.5 rounded border border-ts-green/30">
                  0% Fee Admin
                </span>
              </div>
              <p className="text-[11px] text-ts-kremMuted leading-relaxed">
                Merchant resmi: <strong className="text-white">TeeStock Apparel</strong>. Scan QRIS langsung dari seluruh m-banking &amp; e-wallet (BCA, Mandiri, BRI, GoPay, OVO, DANA, dll).
              </p>
            </div>

            <Button
              type="submit"
              form="checkoutForm"
              variant="glow"
              size="lg"
              className="w-full text-sm py-3.5 font-extrabold"
              icon={isSubmitting ? Loader2 : ArrowRight}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Proses Pesanan'}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-ts-muted text-center pt-2">
              <Lock className="w-3.5 h-3.5 text-ts-green" />
              <span>Checkout aman langsung terhubung ke admin WhatsApp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Checkout Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-[#141312]/95 backdrop-blur-xl border-t border-white/[0.12] shadow-2xl md:hidden">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] text-ts-muted uppercase font-mono block">Total Tagihan:</span>
            <div className="font-mono text-base font-black text-ts-green leading-tight truncate">
              {formatRupiah(grandTotal)}
            </div>
            <span className="text-[9px] text-ts-mustard font-mono">Termasuk kode unik</span>
          </div>

          <Button
            type="submit"
            form="checkoutForm"
            variant="glow"
            size="md"
            className="px-5 py-2.5 text-xs font-bold shrink-0 shadow-glow-terracotta"
            icon={isSubmitting ? Loader2 : ArrowRight}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Memproses...' : 'Bayar Sekarang'}
          </Button>
        </div>
      </div>
    </div>
  );
}
