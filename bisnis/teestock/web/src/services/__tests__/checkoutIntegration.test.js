import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkoutSchema } from '../../schemas/checkoutSchema';
import { calculateShippingFee, calculateOrderWeight } from '../shippingApi';
import { createPaymentSession, PAYMENT_PROVIDERS } from '../paymentAdapter';
import { calculateBundleDiscount } from '../../constants/pricing';
import { createPublicOrder } from '../ordersApi';

vi.mock('../supabase', () => ({
  supabase: {
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ data: [], error: null })
    })
  }
}));

describe('Integration Test: Alur Lengkap Transaksi Checkout (Checkout Integration)', () => {

  beforeEach(() => {
    // Clear mock storage if any
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('mengeksekusi jalur emas transaksi: keranjang -> kalkulasi berat & ongkir -> diskon -> validasi Zod -> buat order -> inisialisasi pembayaran', async () => {
    // 1. Pelanggan memiliki 2 item kaos grafis dan 1 kaos polos ukuran 2XL di keranjang
    const cart = [
      {
        id: 'cart-1',
        sku: 'TS-DES-001',
        name: 'Kaos Distro Graphic #01',
        garment: 'NSA Heavyweight 24s',
        size: 'L',
        color: 'Hitam',
        price: 99000,
        qty: 2,
        series: 'graphic'
      },
      {
        id: 'cart-2',
        sku: 'TS-BLK-7200',
        name: 'Kaos Polos NSA 7200',
        garment: 'NSA Heavyweight 24s',
        size: '2XL',
        color: 'Putih',
        price: 57000, // 52k base + 5k surcharge 2XL
        qty: 1,
        series: 'blank'
      }
    ];

    // 2. Kalkulasi berat pesanan & ongkir dinamis
    // 2 x 220g + 1 x 220g = 660g + 30g polymailer = 690g => dihitung 1 kg
    const weightResult = calculateOrderWeight(cart);
    expect(weightResult.actualWeightGrams).toBe(690);
    expect(weightResult.billableWeightKg).toBe(1);

    const shippingResult = calculateShippingFee({
      zoneId: 'jawa_lainnya',
      cartItems: cart,
      courierName: 'J&T Express'
    });
    expect(shippingResult.shippingFee).toBe(15000);
    expect(shippingResult.billableWeightKg).toBe(1);

    // 3. Kalkulasi harga & diskon bundling ritel
    // 2 pcs graphic => hemat Rp 18.000
    const graphicQty = cart.filter(i => i.series === 'graphic').reduce((sum, i) => sum + i.qty, 0);
    const bundleDiscount = calculateBundleDiscount(graphicQty, 'retail');
    expect(bundleDiscount).toBe(18000);

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0); // (99k x 2) + 57k = 255.000
    expect(subtotal).toBe(255000);

    const baseGrandTotal = subtotal - bundleDiscount + shippingResult.shippingFee; // 255k - 18k + 15k = 252.000
    expect(baseGrandTotal).toBe(252000);

    const uniqueCode = 482;
    const finalTransferAmount = baseGrandTotal + uniqueCode; // 252.482

    // 4. Data formulir pengiriman pembeli
    const checkoutFormData = {
      customerName: 'Aditya Pratama',
      phone: '081298765432',
      city: 'Semarang',
      subdistrict: 'Banyumanik',
      address: 'Jl. Setiabudi No. 88, RT 02/05',
      shippingZone: 'jawa_lainnya',
      courier: 'J&T Express',
      notes: 'Tolong packing rapi'
    };

    // Validasi dengan Zod schema
    const zodValidation = checkoutSchema.safeParse(checkoutFormData);
    expect(zodValidation.success).toBe(true);

    // 5. Pencatatan pesanan publik relasional (createPublicOrder)
    const orderRecord = {
      order_number: 'WEB-TEST-001',
      customer: checkoutFormData.customerName,
      phone: checkoutFormData.phone,
      city: `${checkoutFormData.city} (Kec. ${checkoutFormData.subdistrict})`,
      address: checkoutFormData.address,
      channel: 'web',
      tier: 'retail',
      status: 'pending',
      price: finalTransferAmount,
      total_amount: finalTransferAmount,
      discount_amount: bundleDiscount,
      shipping_fee: shippingResult.shippingFee,
      shipping_zone: shippingResult.zoneName,
      unique_code: uniqueCode,
      notes: checkoutFormData.notes
    };

    const savedOrder = await createPublicOrder(orderRecord, cart);
    expect(savedOrder).toBeDefined();
    expect(savedOrder.order_number).toBe('WEB-TEST-001');
    expect(savedOrder.customer).toBe('Aditya Pratama');
    expect(savedOrder.items.length).toBe(2);
    expect(savedOrder.total_amount).toBe(252482);

    // 6. Inisialisasi Sesi Pembayaran (Payment Adapter)
    // Skenario A: Manual QRIS
    const manualSession = await createPaymentSession(savedOrder, PAYMENT_PROVIDERS.MANUAL_QRIS);
    expect(manualSession.status).toBe('pending');
    expect(manualSession.requiresManualVerification).toBe(true);
    expect(manualSession.uniqueCode).toBe(482);

    // Skenario B: Instant Gateway Mock
    const instantSession = await createPaymentSession(savedOrder, PAYMENT_PROVIDERS.MOCK_INSTANT);
    expect(instantSession.status).toBe('success');
    expect(instantSession.requiresManualVerification).toBe(false);
    expect(instantSession.transactionId).toBeDefined();
  });
});
