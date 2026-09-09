import { describe, it, expect } from 'vitest';
import {
  PAYMENT_PROVIDERS,
  PAYMENT_METHODS,
  formatMidtransTransactionParameter,
  createPaymentSession,
  calculateSha512,
  verifyMidtransSignature
} from '../paymentAdapter';

describe('Payment Gateway Dynamic Adapter (paymentAdapter)', () => {
  const sampleOrder = {
    id: 'WEB-260901',
    order_number: 'WEB-260901',
    customer: 'Budi Santoso',
    customer_name: 'Budi Santoso',
    phone: '081234567890',
    customer_phone: '081234567890',
    address: 'Jl. Dago No. 100',
    customer_address: 'Jl. Dago No. 100',
    city: 'Bandung',
    customer_city: 'Bandung',
    price: 198000,
    total_amount: 198000,
    discount_amount: 18000,
    shipping_fee: 15000,
    shipping_zone: 'Jawa Tengah, Jawa Timur, & DIY',
    unique_code: 345,
    uniqueCode: 345,
    items: [
      {
        sku: 'TS-BLK-7200',
        name: 'Kaos Polos NSA 7200',
        price: 99000,
        qty: 2
      }
    ]
  };

  describe('Daftar Provider Pembayaran', () => {
    it('memiliki metode manual_qris dan midtrans_snap', () => {
      const ids = PAYMENT_METHODS.map(m => m.id);
      expect(ids).toContain(PAYMENT_PROVIDERS.MANUAL_QRIS);
      expect(ids).toContain(PAYMENT_PROVIDERS.MIDTRANS_SNAP);
    });

    it('menetapkan manual_qris sebagai opsi default', () => {
      const defaultMethod = PAYMENT_METHODS.find(m => m.isDefault);
      expect(defaultMethod?.id).toBe(PAYMENT_PROVIDERS.MANUAL_QRIS);
    });
  });

  describe('Formatting Parameter Transaksi Midtrans (formatMidtransTransactionParameter)', () => {
    it('memformat detail transaksi order_id dan gross_amount dengan benar', () => {
      const param = formatMidtransTransactionParameter(sampleOrder);
      expect(param.transaction_details.order_id).toBe('WEB-260901');
      expect(param.transaction_details.gross_amount).toBe(198000);
    });

    it('memetakan customer_details dan alamat pengiriman', () => {
      const param = formatMidtransTransactionParameter(sampleOrder);
      expect(param.customer_details.first_name).toBe('Budi Santoso');
      expect(param.customer_details.phone).toBe('081234567890');
      expect(param.customer_details.billing_address.city).toBe('Bandung');
    });

    it('menyertakan item pesanan, ongkos kirim, dan potongan diskon dalam item_details', () => {
      const param = formatMidtransTransactionParameter(sampleOrder);
      const itemIds = param.item_details.map(i => i.id);

      expect(itemIds).toContain('TS-BLK-7200');
      expect(itemIds).toContain('SHIPPING-FEE');
      expect(itemIds).toContain('DISCOUNT-VOUCHER');

      const discountItem = param.item_details.find(i => i.id === 'DISCOUNT-VOUCHER');
      expect(discountItem.price).toBe(-18000);
    });

    it('mengaktifkan channel e-wallet (GoPay, ShopeePay, QRIS) dan Virtual Account bank', () => {
      const param = formatMidtransTransactionParameter(sampleOrder);
      expect(param.enabled_payments).toContain('qris');
      expect(param.enabled_payments).toContain('gopay');
      expect(param.enabled_payments).toContain('shopeepay');
      expect(param.enabled_payments).toContain('bca_va');
      expect(param.enabled_payments).toContain('mandiri_va');
    });
  });

  describe('Inisialisasi Sesi Pembayaran (createPaymentSession)', () => {
    it('menginisialisasi sesi manual_qris dengan kode unik 3-digit', async () => {
      const session = await createPaymentSession(sampleOrder, PAYMENT_PROVIDERS.MANUAL_QRIS);
      expect(session.status).toBe('pending');
      expect(session.provider).toBe(PAYMENT_PROVIDERS.MANUAL_QRIS);
      expect(session.uniqueCode).toBe(345);
      expect(session.requiresManualVerification).toBe(true);
    });

    it('menginisialisasi sesi mock_instant untuk pengujian/sandbox otomatis', async () => {
      const session = await createPaymentSession(sampleOrder, PAYMENT_PROVIDERS.MOCK_INSTANT);
      expect(session.status).toBe('success');
      expect(session.provider).toBe(PAYMENT_PROVIDERS.MOCK_INSTANT);
      expect(session.transactionId).toMatch(/^MOCK-TX-/);
      expect(session.requiresManualVerification).toBe(false);
    });

    it('fallback ke mode simulasi aman jika VITE_MIDTRANS_CLIENT_KEY belum dipasang', async () => {
      const session = await createPaymentSession(sampleOrder, PAYMENT_PROVIDERS.MIDTRANS_SNAP, {
        clientKey: ''
      });
      expect(session.status).toBe('simulation');
      expect(session.isSimulated).toBe(true);
      expect(session.token).toMatch(/^SNAP-SIM-/);
    });

    it('melempar error jika provider tidak dikenal', async () => {
      await expect(
        createPaymentSession(sampleOrder, 'unknown_crypto_gateway')
      ).rejects.toThrow('Payment provider tidak dikenali');
    });
  });

  describe('Verifikasi Keamanan Signature SHA-512 (verifyMidtransSignature)', () => {
    it('menghitung hash SHA-512 secara konsisten', async () => {
      const hash1 = await calculateSha512('test-payload-123');
      const hash2 = await calculateSha512('test-payload-123');
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(128); // 512 bits = 128 hex chars
    });

    it('memvalidasi signature webhook yang cocok', async () => {
      const orderId = 'WEB-260901';
      const statusCode = '200';
      const grossAmount = '198000.00';
      const serverKey = 'SB-Mid-server-TESTKEY123';

      const validSignature = await calculateSha512(`${orderId}${statusCode}${grossAmount}${serverKey}`);

      const isValid = await verifyMidtransSignature(
        orderId,
        statusCode,
        grossAmount,
        validSignature,
        serverKey
      );
      expect(isValid).toBe(true);
    });

    it('menolak signature yang dimanipulasi atau parameter tidak lengkap', async () => {
      const isValid = await verifyMidtransSignature(
        'WEB-260901',
        '200',
        '198000.00',
        'fake_signature_hash',
        'SB-Mid-server-TESTKEY123'
      );
      expect(isValid).toBe(false);

      const isMissing = await verifyMidtransSignature('', '', '', '', '');
      expect(isMissing).toBe(false);
    });
  });
});
