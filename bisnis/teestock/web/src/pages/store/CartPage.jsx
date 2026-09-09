import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, CheckCircle2, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { createPublicOrder } from '../../services/ordersApi';
import { validateVoucher } from '../../services/vouchersApi';
import { 
  calculateBundleDiscount, 
  BUNDLE_DEALS, 
  SHIPPING_ZONES, 
  getSizeSurcharge 
} from '../../constants/pricing';
import { sanitizePhoneNumber, generateOrderCheckoutWhatsAppText } from '../../utils/whatsappTemplates';
import { QrisPaymentBox } from '../../components/store/QrisPaymentBox';
import { CartItemList } from '../../components/store/cart/CartItemList';
import { CheckoutShippingForm } from '../../components/store/cart/CheckoutShippingForm';
import { CartSummaryCard } from '../../components/store/cart/CartSummaryCard';

export function CartPage() {
  const { cart, removeFromCart, updateCartQty, clearCart, totalCartAmount, storeSettings } = useStore();
  const { user, profile, role } = useAuth();
  const formRef = useRef(null);

  const [orderComplete, setOrderComplete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingZone, setShippingZone] = useState('jawa_lainnya');

  // 3-digit random unique code for payment reconciliation
  const [uniqueCode] = useState(() => Math.floor(100 + Math.random() * 899));

  // Voucher states
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState(null);

  // Bundling calculations (for graphic merchandise only)
  const totalCartQty = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const eligibleGraphicQty = cart
    .filter(item => item.series !== 'blank' && !item.sku?.startsWith('TS-BLK-'))
    .reduce((acc, item) => acc + (item.qty || 1), 0);
  const bundleDiscount = calculateBundleDiscount(eligibleGraphicQty, role);

  // Shipping rate calculations
  const selectedZone = SHIPPING_ZONES.find(z => z.id === shippingZone) || SHIPPING_ZONES[1];
  const rawShippingFee = cart.length > 0 ? selectedZone.rate : 0;
  const isFreeShippingVoucher = appliedVoucher?.type === 'free_shipping';
  const shippingDiscount = isFreeShippingVoucher ? Math.min(rawShippingFee, discountAmount) : 0;
  const shippingFee = Math.max(0, rawShippingFee - shippingDiscount);

  // Non-stackable discount selection
  let effectiveProductDiscount = 0;
  let activeDiscountLabel = '';

  if (isFreeShippingVoucher) {
    effectiveProductDiscount = bundleDiscount;
    activeDiscountLabel = bundleDiscount > 0 ? 'bundle' : 'none';
  } else {
    if (bundleDiscount > 0 && discountAmount > 0) {
      if (bundleDiscount >= discountAmount) {
        effectiveProductDiscount = bundleDiscount;
        activeDiscountLabel = 'bundle_preferred';
      } else {
        effectiveProductDiscount = discountAmount;
        activeDiscountLabel = 'voucher_preferred';
      }
    } else if (bundleDiscount > 0) {
      effectiveProductDiscount = bundleDiscount;
      activeDiscountLabel = 'bundle';
    } else if (discountAmount > 0) {
      effectiveProductDiscount = discountAmount;
      activeDiscountLabel = 'voucher';
    }
  }

  // CFO Margin Guard: Ensure blank tee profit margin never drops below Rp 2.000/pcs
  const maxAllowableDiscount = cart.reduce((acc, item) => {
    const isBlankItem = item.series === 'blank' || item.sku?.startsWith('TS-BLK-');
    if (isBlankItem) {
      const isWhite = String(item.color).trim().toLowerCase() === 'white';
      const vendorBase = isWhite ? 39000 : 42000;
      const surcharge = getSizeSurcharge(item.size);
      const floorPricePerPcs = vendorBase + 2000 + surcharge;
      const maxDiscForThisItem = Math.max(0, ((item.price || 52000) - floorPricePerPcs) * (item.qty || 1));
      return acc + maxDiscForThisItem;
    }
    return acc + Math.max(0, ((item.price || 99000) - 55000) * (item.qty || 1));
  }, 0);

  effectiveProductDiscount = Math.min(effectiveProductDiscount, maxAllowableDiscount);

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

  const handleTriggerFormSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  // Called when CheckoutShippingForm passes Zod schema validation
  const handleProcessOrder = async (formData) => {
    setIsSubmitting(true);
    try {
      const orderId = `WEB-${Date.now().toString().slice(-6)}`;
      const cleanCity = formData.city.trim();
      const cleanSubdistrict = formData.subdistrict.trim();
      const cleanAddress = formData.address.trim();
      const fullCityDisplay = cleanSubdistrict ? `${cleanCity} (Kec. ${cleanSubdistrict})` : cleanCity;
      const fullAddressDisplay = cleanSubdistrict ? `Kec. ${cleanSubdistrict}, ${cleanAddress}` : cleanAddress;

      const orderRecord = {
        id: orderId,
        order_number: orderId,
        customer: formData.customerName.trim(),
        phone: `${formData.phone.trim()} (${fullCityDisplay})`,
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

      await createPublicOrder(orderRecord, cart);

      setOrderComplete({
        orderId,
        customerName: formData.customerName.trim(),
        phone: formData.phone.trim(),
        city: cleanCity,
        subdistrict: cleanSubdistrict,
        address: cleanAddress,
        shippingZone: selectedZone.name,
        shippingFee,
        courier: formData.courier || 'J&T Express',
        items: [...cart],
        baseTotal: baseGrandTotal,
        uniqueCode,
        total: grandTotal,
        itemCount: cart.length
      });

      clearCart();
    } catch (err) {
      console.error("Gagal memproses checkout:", err);
      alert("Terjadi kendala saat mencatat pesanan. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Complete Screen (QRIS Payment Display)
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
        <div className="w-16 h-16 rounded-3xl bg-ts-green/20 text-ts-green flex items-center justify-center mx-auto border border-ts-green/30">
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

  // Empty Cart Screen
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mx-auto text-ts-muted">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Troli Belanja Anda Masih Kosong</h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-sm mx-auto">
            Temukan desain distro tematik sesuai kepribadianmu atau pesan kaos polos NSA sekarang.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/katalog"
            className="px-6 py-3 rounded-xl bg-ts-terracotta hover:bg-ts-terracottaDark text-white font-bold text-xs tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <span>Eksplor Katalog Desain</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/polos"
            className="px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-xs tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <span>Katalog Kaos Polos NSA</span>
          </Link>
        </div>
      </div>
    );
  }

  // Active Cart Screen
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Title */}
      <div className="space-y-1 pb-4 border-b border-white/[0.08]">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          Keranjang & Checkout
        </h1>
        <p className="text-xs text-ts-kremMuted">
          Lengkapi detail pesanan dan alamat pengiriman untuk proses cetak & pengiriman cepat.
        </p>
      </div>

      {/* Main Grid: Left Items & Form, Right Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Items & Form) */}
        <div className="lg:col-span-7 space-y-8">
          <CartItemList
            cart={cart}
            updateCartQty={updateCartQty}
            removeFromCart={removeFromCart}
          />

          <CheckoutShippingForm
            formRef={formRef}
            profile={profile}
            onSubmitOrder={handleProcessOrder}
            onShippingZoneChange={setShippingZone}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Right Column (Summary & Payment Action) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <CartSummaryCard
            totalCartAmount={totalCartAmount}
            effectiveProductDiscount={effectiveProductDiscount}
            activeDiscountLabel={activeDiscountLabel}
            shippingFee={shippingFee}
            rawShippingFee={rawShippingFee}
            shippingDiscount={shippingDiscount}
            uniqueCode={uniqueCode}
            grandTotal={grandTotal}
            appliedVoucher={appliedVoucher}
            voucherInput={voucherInput}
            setVoucherInput={setVoucherInput}
            handleApplyVoucher={handleApplyVoucher}
            handleRemoveVoucher={handleRemoveVoucher}
            voucherLoading={voucherLoading}
            voucherMsg={voucherMsg}
            isSubmitting={isSubmitting}
            onTriggerSubmit={handleTriggerFormSubmit}
          />
        </div>
      </div>
    </div>
  );
}
