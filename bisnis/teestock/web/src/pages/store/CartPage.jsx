import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { createPublicOrder } from '../../services/ordersApi';
import { validateVoucher } from '../../services/vouchersApi';
import { 
  calculateBundleDiscount, 
  getSizeSurcharge,
  getBlankPricing,
  isProductBlank
} from '../../constants/pricing';
import { calculateOrderWeight, calculateShippingFee } from '../../services/shippingApi';
import { determineFulfillmentOrigin } from '../../utils/garmentStockRouting';
import { 
  PAYMENT_PROVIDERS, 
  createPaymentSession
} from '../../services/paymentAdapter';
import { sanitizePhoneNumber, generateOrderCheckoutWhatsAppText } from '../../utils/whatsappTemplates';
import { formatRupiah } from '../../utils/formatters';
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
  const [courier, setCourier] = useState('J&T Express');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_PROVIDERS.MANUAL_QRIS);

  // Live destination input tracking for Smart Multi-Hub Routing
  const [destinationCity, setDestinationCity] = useState('');
  const [destinationSubdistrict, setDestinationSubdistrict] = useState('');

  // 3-digit random unique code for manual payment reconciliation
  const [uniqueCode] = useState(() => Math.floor(100 + Math.random() * 899));

  // Voucher states
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherMsg, setVoucherMsg] = useState(null);

  // Smart Multi-Hub Origin Routing (Citayam Studio vs Bogor Express Hub)
  const fulfillmentOrigin = determineFulfillmentOrigin(cart, destinationCity, destinationSubdistrict);

  // Bundling calculations (for graphic merchandise only)
  const totalCartQty = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
  const eligibleGraphicQty = cart
    .filter(item => !isProductBlank(item))
    .reduce((acc, item) => acc + (item.qty || 1), 0);
  const bundleDiscount = calculateBundleDiscount(eligibleGraphicQty, role);

  // Dynamic Weight-Based & Multi-Origin Shipping calculations
  const weightInfo = calculateOrderWeight(cart);
  const shippingCalculation = calculateShippingFee({
    zoneId: shippingZone,
    cartItems: cart,
    courierName: courier,
    originHubId: fulfillmentOrigin.hub.id
  });

  const rawShippingFee = cart.length > 0 ? shippingCalculation.shippingFee : 0;
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
    const isBlankItem = isProductBlank(item);
    if (isBlankItem) {
      const blankPricing = getBlankPricing(item, item.color, role, item.size, item.qty);
      const floorPricePerPcs = blankPricing.vendorCost + 2000;
      const maxDiscForThisItem = Math.max(0, ((item.price || blankPricing.basePrice) - floorPricePerPcs) * (item.qty || 1));
      return acc + maxDiscForThisItem;
    }
    return acc + Math.max(0, ((item.price || 99000) - 55000) * (item.qty || 1));
  }, 0);

  effectiveProductDiscount = Math.min(effectiveProductDiscount, maxAllowableDiscount);

  const isInstantPayment = paymentMethod === PAYMENT_PROVIDERS.MIDTRANS_SNAP;
  const baseGrandTotal = Math.max(0, totalCartAmount - effectiveProductDiscount) + shippingFee;
  // Instant payment uses exact total, manual QRIS includes unique 3-digit code
  const grandTotal = baseGrandTotal > 0 ? (isInstantPayment ? baseGrandTotal : baseGrandTotal + uniqueCode) : 0;

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

  const triggerSnapPayment = async (token, redirectUrl) => {
    const isSandbox = Boolean(redirectUrl && redirectUrl.includes('sandbox.midtrans.com'));
    const targetScriptSrc = isSandbox 
      ? 'https://app.sandbox.midtrans.com/snap/snap.js'
      : 'https://app.midtrans.com/snap/snap.js';
    
    if (typeof window !== 'undefined') {
      const existingScript = document.querySelector('script[src*="/snap/snap.js"]');
      if (existingScript && !existingScript.src.includes(isSandbox ? 'sandbox' : 'app.midtrans.com')) {
        existingScript.remove();
        delete window.snap;
      }

      if (!window.snap) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = targetScriptSrc;
          script.setAttribute('data-client-key', isSandbox ? 'Mid-client-WWRMeWNQzS_zx-E-' : 'Mid-client-DL-HKOnueKXtxjSF');
          script.async = true;
          script.onload = () => resolve(window.snap);
          script.onerror = () => resolve(null);
          document.head.appendChild(script);
        });
      }

      if (window.snap && typeof window.snap.pay === 'function' && token) {
        try {
          window.snap.pay(token, {
            onSuccess: (res) => {
              console.log('Midtrans payment success callback:', res);
            },
            onPending: (res) => {
              console.log('Midtrans payment pending callback:', res);
            },
            onError: (err) => {
              console.error('Midtrans payment error callback:', err);
            },
            onClose: () => {
              console.log('Midtrans payment popup closed by customer');
            }
          });
          return;
        } catch (e) {
          console.warn('snap.pay runtime exception:', e);
        }
      }
    }

    // Direct redirection fallback if window.snap is blocked by browser or extensions
    const directUrl = redirectUrl || (token ? `https://${isSandbox ? 'app.sandbox.midtrans.com' : 'app.midtrans.com'}/snap/v4/redirection/${token}` : null);
    if (directUrl && typeof window !== 'undefined') {
      window.open(directUrl, '_blank');
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
        phone: formData.phone.trim(),
        city: fullCityDisplay,
        address: fullAddressDisplay,
        shipping_zone: `${shippingCalculation.zoneName} (${formData.courier || courier})`,
        shipping_fee: shippingFee,
        package_weight_grams: weightInfo.actualWeightGrams,
        billable_weight_kg: weightInfo.billableWeightKg,
        fulfillment_origin: fulfillmentOrigin.hub.name,
        origin_hub_id: fulfillmentOrigin.hub.id,
        origin_hub_short: fulfillmentOrigin.hub.shortName,
        origin_address: fulfillmentOrigin.hub.address,
        channel: 'web',
        tier: role || 'retail',
        status: 'pending_payment', // Keamanan Transaksi: Status awal selalu pending sampai diverifikasi
        price: grandTotal,
        total_amount: grandTotal,
        discount: effectiveProductDiscount + shippingDiscount,
        discount_amount: effectiveProductDiscount + shippingDiscount,
        voucher_code: appliedVoucher?.code || null,
        unique_code: isInstantPayment ? null : uniqueCode,
        uniqueCode: isInstantPayment ? null : uniqueCode,
        user_id: user?.id || null,
        payment_method: paymentMethod,
        items: [...cart],
        date: new Date().toISOString()
      };

      // 1. Persist order via Edge Function create-checkout / authoritative pipeline
      const createdOrder = await createPublicOrder(orderRecord, cart);
      const finalOrderId = createdOrder?.id || createdOrder?.order_number || orderId;

      // 2. Dispatch Payment Session (Memanfaatkan Snap Token dari server jika metode Midtrans)
      let paymentSession = null;
      try {
        paymentSession = await createPaymentSession(createdOrder, paymentMethod);

        // Auto trigger popup with safe timing
        if (isInstantPayment && (paymentSession?.token || createdOrder?.snapToken)) {
          const snapTok = paymentSession?.token || createdOrder?.snapToken;
          const redir = paymentSession?.redirectUrl || createdOrder?.redirectUrl;
          setTimeout(() => {
            triggerSnapPayment(snapTok, redir);
          }, 300);
        }
      } catch (payErr) {
        console.warn('Payment session initialization warning, falling back to manual verification:', payErr);
        paymentSession = {
          status: 'pending',
          requiresManualVerification: true,
          uniqueCode: isInstantPayment ? 0 : Number(createdOrder?.unique_code ?? 0)
        };
      }

      // Verifikasi ketersediaan token untuk Midtrans Snap sebelum menyelesaikan order di UI
      if (isInstantPayment && !paymentSession?.token && !createdOrder?.snapToken) {
        throw new Error('Sesi pembayaran online Midtrans tidak dapat diinisialisasi. Silakan coba lagi atau gunakan metode QRIS & Transfer Manual.');
      }

      // 3. Sumber Otoritatif Server: Gunakan HANYA data resmi yang dikembalikan backend/createdOrder
      const authUniqueCode = Number(createdOrder?.unique_code ?? createdOrder?.uniqueCode ?? 0);
      const authTotal = Number(createdOrder?.total_amount ?? createdOrder?.price ?? grandTotal);
      const authShippingFee = Number(createdOrder?.shipping_fee ?? shippingFee);
      const authShippingZone = createdOrder?.shipping_zone || shippingCalculation.zoneName;
      const authSubtotal = Number(createdOrder?.subtotal ?? totalCartAmount);
      const authDiscount = Number(createdOrder?.discount_amount ?? createdOrder?.discount ?? (effectiveProductDiscount + shippingDiscount));
      const authBaseTotal = Math.max(0, authSubtotal + authShippingFee - authDiscount);
      const authItems = (createdOrder?.items && Array.isArray(createdOrder.items) && createdOrder.items.length > 0)
        ? createdOrder.items
        : [...cart];

      setOrderComplete({
        orderId: finalOrderId,
        customerName: createdOrder?.customer_name || formData.customerName.trim(),
        phone: createdOrder?.customer_phone || formData.phone.trim(),
        city: cleanCity,
        subdistrict: cleanSubdistrict,
        address: cleanAddress,
        shippingZone: authShippingZone,
        shippingFee: authShippingFee,
        courier: formData.courier || courier,
        fulfillmentOrigin,
        items: authItems,
        baseTotal: authBaseTotal,
        uniqueCode: isInstantPayment ? 0 : authUniqueCode,
        total: authTotal,
        itemCount: authItems.length,
        paymentMethod,
        isInstantPayment,
        paymentSession,
        snapToken: paymentSession?.token || createdOrder?.snapToken || null,
        redirectUrl: paymentSession?.redirectUrl || createdOrder?.redirectUrl || null
      });

      clearCart();
    } catch (err) {
      console.error("Gagal memproses checkout:", err);
      alert(err.message || "Terjadi kendala saat memproses pesanan. Silakan periksa koneksi Anda dan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Complete Screen (QRIS Payment Display or Instant Gateway Confirmation)
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ts-krem tracking-tight">
            {orderComplete.isInstantPayment ? 'Transaksi Berhasil Diinisialisasi!' : 'Pesanan Berhasil Dicatat!'}
          </h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-md mx-auto">
            {orderComplete.isInstantPayment 
              ? 'Pembayaran instan melalui sistem otomatis Midtrans. Status pesanan Anda langsung diperbarui di sistem antrean produksi.'
              : 'Silakan scan QRIS di bawah ini dan transfer nominal persis sampai 3 angka terakhir untuk verifikasi instan.'}
          </p>
        </div>

        {orderComplete.isInstantPayment ? (
          <div className="p-6 rounded-3xl bg-ts-surface border border-sky-500/30 space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-ts-border pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-500" />
                Gateway Pembayaran Instan
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-mono text-[11px] font-bold">
                Midtrans Snap
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-ts-kremMuted">
                <span>Nama Pemesan:</span>
                <strong className="text-ts-krem">{orderComplete.customerName}</strong>
              </div>
              <div className="flex justify-between text-ts-kremMuted">
                <span>Total Tagihan:</span>
                <strong className="text-sky-500 dark:text-sky-300 font-mono text-base">{formatRupiah(orderComplete.total)}</strong>
              </div>
              <div className="flex justify-between text-ts-kremMuted">
                <span>Kurir Pengiriman:</span>
                <span className="text-ts-krem font-medium">{orderComplete.courier} ({orderComplete.shippingZone})</span>
              </div>
              <div className="flex justify-between text-ts-kremMuted pt-1 border-t border-ts-border">
                <span>Sentra Pengiriman:</span>
                <span className="text-emerald-500 font-semibold">{orderComplete.fulfillmentOrigin?.hub?.name || 'TeeStock Central Studio (Depok)'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Tanda terima pesanan tercatat di sistem antrean studio. Silakan selesaikan pembayaran untuk memulai proses sablon DTF 155°C.
              </p>
            </div>

            {/* Tombol Utama: Buka Layar Pembayaran Midtrans Snap */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const snapTok = orderComplete.paymentSession?.token || orderComplete.snapToken;
                  const redir = orderComplete.paymentSession?.redirectUrl || orderComplete.redirectUrl;
                  triggerSnapPayment(snapTok, redir);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer ring-2 ring-sky-400/40 animate-pulse"
              >
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span>Bayar Sekarang (Buka Layar QRIS / VA)</span>
              </button>

              {(orderComplete.paymentSession?.redirectUrl || orderComplete.redirectUrl || orderComplete.paymentSession?.token) && (
                <a
                  href={orderComplete.paymentSession?.redirectUrl || orderComplete.redirectUrl || `https://app.midtrans.com/snap/v4/redirection/${orderComplete.paymentSession?.token}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-[11px] text-sky-400 hover:text-sky-300 hover:underline pt-1 transition-colors"
                >
                  Layar pembayaran belum muncul? Klik di sini untuk bayar langsung &rarr;
                </a>
              )}
            </div>

            <a href={waUrl} target="_blank" rel="noreferrer" className="block w-full pt-1">
              <button
                type="button"
                className="w-full py-3 rounded-xl bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem font-semibold text-xs border border-ts-border transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Konfirmasi Status Pesanan ke Admin via WhatsApp</span>
              </button>
            </a>
          </div>
        ) : (
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
        )}

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={`/tracking?order=${orderComplete.orderId}`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ts-surface hover:bg-ts-surfaceHover text-xs font-bold text-ts-krem border border-ts-border transition-all inline-flex items-center justify-center gap-2 shadow-sm"
          >
            <Truck className="w-4 h-4 text-ts-terracotta" />
            <span>Lacak Status Pesanan #{orderComplete.orderId}</span>
          </Link>
          <Link to="/" className="inline-block text-xs font-medium text-ts-kremMuted hover:text-ts-krem transition-colors">
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
        <div className="w-16 h-16 rounded-3xl bg-ts-surface border border-ts-border flex items-center justify-center mx-auto text-ts-muted">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-ts-krem">Troli Belanja Masih Kosong</h2>
          <p className="text-xs sm:text-sm text-ts-kremMuted max-w-sm mx-auto">
            Temukan kurasi grafis bertema subkultur atau pesan kaos polos New States Apparel original sekarang.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/katalog"
            className="px-6 py-3 rounded-xl bg-ts-terracotta hover:bg-ts-terracottaDark text-white font-bold text-xs tracking-wider transition-colors inline-flex items-center gap-2"
          >
            <span>Explore Drop Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/polos"
            className="px-6 py-3 rounded-xl bg-ts-surface hover:bg-ts-surfaceHover text-ts-krem font-bold text-xs tracking-wider border border-ts-border transition-colors inline-flex items-center gap-2"
          >
            <span>The Blanks (Kaos Polos NSA)</span>
          </Link>
        </div>
      </div>
    );
  }

  // Active Cart Screen
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Title */}
      <div className="space-y-1 pb-4 border-b border-ts-border">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ts-krem">
          Keranjang &amp; Checkout
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

          {/* Cross-Sell: Sering Dibeli Bersamaan */}
          {cart.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 border border-ts-border">
              <h3 className="text-sm font-mono font-bold text-ts-kremMuted uppercase tracking-wider mb-4">
                Sering Dibeli Bersamaan
              </h3>
              <div className="space-y-3">
                {/* Order Bump: Kaos Polos NSA */}
                <div className="flex items-center gap-4 p-3 rounded-xl border border-ts-borderDim hover:border-ts-borderHover transition-colors cursor-pointer group">
                  <div className="w-14 h-14 rounded-lg bg-ts-surface flex items-center justify-center shrink-0">
                    <span className="text-2xl">👕</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ts-krem">Tambah Kaos Polos NSA 24s</p>
                    <p className="text-xs text-ts-kremMuted">Heavyweight Tubular • Baselayer sempurna</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-mono font-bold text-ts-terracotta">+Rp 45.000</p>
                    <button onClick={() => window.location.href = '/polos'} className="text-xs text-ts-kremMuted hover:text-ts-terracotta transition-colors font-medium mt-0.5">+ Tambah</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <CheckoutShippingForm
            formRef={formRef}
            profile={profile}
            onSubmitOrder={handleProcessOrder}
            onShippingZoneChange={setShippingZone}
            onCourierChange={setCourier}
            onCityChange={setDestinationCity}
            onSubdistrictChange={setDestinationSubdistrict}
            fulfillmentOrigin={fulfillmentOrigin}
            selectedPaymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            weightInfo={weightInfo}
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
            weightInfo={weightInfo}
            selectedPaymentMethod={paymentMethod}
          />
        </div>
      </div>
    </div>
  );
}
