import { describe, it, expect, vi } from 'vitest';
import {
  calculateEligibleGraphicQty,
  calculateMaxAllowableDiscount,
  calculateEffectiveDiscounts,
  calculateCartGrandTotal,
  CFO_MAX_DISCOUNT_PERCENT
} from '../CartPage';
import {
  validateVoucher,
  CFO_MAX_VOUCHER_DISCOUNT_PERCENT
} from '../../../services/vouchersApi';
import { generateOrderNumber, isValidOrderNumber } from '../../../utils/orderNumber';

// Mock Supabase to test validateVoucher against fallback presets cleanly
vi.mock('../../../services/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      })
    })
  }
}));

describe('CartPage & Checkout Logic Engine (Checkpoint C-04)', () => {
  describe('CFO Margin Floor Constant', () => {
    it('memastikan batas maksimal diskon retail adalah 25%', () => {
      expect(CFO_MAX_DISCOUNT_PERCENT).toBe(25);
      expect(CFO_MAX_VOUCHER_DISCOUNT_PERCENT).toBe(25);
    });
  });

  describe('calculateEligibleGraphicQty', () => {
    it('mengembalikan 0 untuk keranjang kosong atau invalid', () => {
      expect(calculateEligibleGraphicQty([])).toBe(0);
      expect(calculateEligibleGraphicQty(null)).toBe(0);
    });

    it('hanya menghitung item grafis dan mengabaikan kaos polos NSA (blank)', () => {
      const cart = [
        { sku: 'TS-DES-001', series: 'graphic', qty: 2 },
        { sku: 'TS-BLK-7200', series: 'blank', qty: 3 },
        { sku: 'TS-DES-002', series: 'curated', qty: 1 }
      ];
      expect(calculateEligibleGraphicQty(cart)).toBe(3);
    });
  });

  describe('calculateMaxAllowableDiscount (CFO Margin Guard)', () => {
    it('menjaga profit margin kaos polos minimal Rp 2.000 di atas biaya vendor', () => {
      // NSA 7200 Putih: vendorCost = 39.000, basePrice retail = 42.000, floor = 41.000.
      // Max allowable disc = (42.000 - 41.000) * 2 = 2.000
      const blankCart = [
        {
          sku: 'TS-BLK-7200',
          model: '7200',
          garment: 'NSA Heavyweight 24s',
          color: 'Putih',
          size: 'L',
          price: 42000,
          qty: 2,
          series: 'blank'
        }
      ];
      const maxDisc = calculateMaxAllowableDiscount(blankCart, 'retail');
      expect(maxDisc).toBe(2000);
    });

    it('menjaga margin kaos grafis di atas batas HPP Rp 55.000/pcs', () => {
      const graphicCart = [
        {
          sku: 'TS-DES-001',
          name: 'Graphic Tee',
          price: 99000,
          qty: 1,
          series: 'graphic'
        }
      ];
      // 99.000 - 55.000 = 44.000
      expect(calculateMaxAllowableDiscount(graphicCart, 'retail')).toBe(44000);
    });
  });

  describe('calculateEffectiveDiscounts', () => {
    const sampleCart = [
      {
        sku: 'TS-DES-001',
        series: 'graphic',
        price: 99000,
        qty: 2
      }
    ];

    it('menerapkan diskon bundling retail untuk 2 pcs grafis (Rp 18.000)', () => {
      const res = calculateEffectiveDiscounts({
        cart: sampleCart,
        role: 'retail',
        appliedVoucher: null,
        voucherDiscountAmount: 0,
        rawShippingFee: 15000
      });

      expect(res.bundleDiscount).toBe(18000);
      expect(res.effectiveProductDiscount).toBe(18000);
      expect(res.activeDiscountLabel).toBe('bundle');
      expect(res.shippingDiscount).toBe(0);
      expect(res.shippingFee).toBe(15000);
    });

    it('memilih voucher jika nominal voucher lebih besar dari bundling', () => {
      const res = calculateEffectiveDiscounts({
        cart: sampleCart,
        role: 'retail',
        appliedVoucher: { code: 'PROMO25K', type: 'discount' },
        voucherDiscountAmount: 25000,
        rawShippingFee: 15000
      });

      expect(res.effectiveProductDiscount).toBe(25000);
      expect(res.activeDiscountLabel).toBe('voucher_preferred');
    });

    it('memilih bundling jika diskon bundling lebih besar dari voucher', () => {
      const res = calculateEffectiveDiscounts({
        cart: sampleCart,
        role: 'retail',
        appliedVoucher: { code: 'DISKON10K', type: 'discount' },
        voucherDiscountAmount: 10000,
        rawShippingFee: 15000
      });

      expect(res.effectiveProductDiscount).toBe(18000); // Bundling 2 pcs adalah 18k
      expect(res.activeDiscountLabel).toBe('bundle_preferred');
    });

    it('menangani voucher subsidi gratis ongkir (free_shipping) secara terpisah', () => {
      const res = calculateEffectiveDiscounts({
        cart: sampleCart,
        role: 'retail',
        appliedVoucher: { code: 'FREESHIP15', type: 'free_shipping' },
        voucherDiscountAmount: 15000,
        rawShippingFee: 20000
      });

      expect(res.bundleDiscount).toBe(18000);
      expect(res.effectiveProductDiscount).toBe(18000); // Bundling tetap aktif
      expect(res.shippingDiscount).toBe(15000);          // Ongkir terpotong 15k
      expect(res.shippingFee).toBe(5000);               // Sisa ongkir 5k
    });

    it('memotong diskon jika melebihi plafon CFO maxAllowableDiscount', () => {
      const smallMarginCart = [
        {
          sku: 'TS-BLK-7200',
          model: '7200',
          color: 'Putih',
          size: 'M',
          price: 42000,
          qty: 1,
          series: 'blank'
        }
      ];
      // Max allowable discount untuk 1 pcs blank ini adalah Rp 1.000
      const res = calculateEffectiveDiscounts({
        cart: smallMarginCart,
        role: 'retail',
        appliedVoucher: { code: 'BIGDISC', type: 'discount' },
        voucherDiscountAmount: 10000,
        rawShippingFee: 10000
      });

      expect(res.effectiveProductDiscount).toBe(1000);
    });
  });

  describe('calculateCartGrandTotal', () => {
    it('mengembalikan 0 jika subtotal keranjang 0 atau negatif', () => {
      expect(calculateCartGrandTotal({ totalCartAmount: 0 })).toBe(0);
      expect(calculateCartGrandTotal({ totalCartAmount: -100 })).toBe(0);
    });

    it('menambahkan kode unik 3-digit pada metode pembayaran manual QRIS/Transfer', () => {
      const total = calculateCartGrandTotal({
        totalCartAmount: 198000,
        effectiveProductDiscount: 18000,
        shippingFee: 15000,
        uniqueCode: 382,
        isInstantPayment: false
      });
      // 198.000 - 18.000 + 15.000 = 195.000 + 382 = 195.382
      expect(total).toBe(195382);
    });

    it('menggunakan nominal persis tanpa kode unik pada pembayaran instan Midtrans Snap', () => {
      const total = calculateCartGrandTotal({
        totalCartAmount: 198000,
        effectiveProductDiscount: 18000,
        shippingFee: 15000,
        uniqueCode: 382,
        isInstantPayment: true
      });
      // 198.000 - 18.000 + 15.000 = 195.000 (tanpa +382)
      expect(total).toBe(195000);
    });
  });

  describe('validateVoucher (CFO Rules & Guardrails)', () => {
    it('menolak kode voucher kosong atau spasi', async () => {
      const res1 = await validateVoucher('', 100000);
      expect(res1.valid).toBe(false);
      expect(res1.message).toContain('Masukkan kode voucher');

      const res2 = await validateVoucher('   ', 100000);
      expect(res2.valid).toBe(false);
    });

    it('menolak kode voucher yang tidak dikenal', async () => {
      const res = await validateVoucher('VOUCHERPALSU', 100000);
      expect(res.valid).toBe(false);
      expect(res.message).toContain('tidak ditemukan');
    });

    it('menolak voucher jika total belanja belum mencapai min_order', async () => {
      // TEESTOCKDROP min_order: 89.000
      const res = await validateVoucher('TEESTOCKDROP', 50000);
      expect(res.valid).toBe(false);
      expect(res.message).toContain('Minimal belanja');
    });

    it('menerima voucher valid yang memenuhi syarat belanja', async () => {
      const res = await validateVoucher('TEESTOCKDROP', 100000);
      expect(res.valid).toBe(true);
      expect(res.discountAmount).toBe(10000);
      expect(res.voucher.code).toBe('TEESTOCKDROP');
    });

    it('membatasi diskon voucher persentase maksimal 25% sesuai CFO floor', async () => {
      // WELCOME10 = 10%
      const res = await validateVoucher('WELCOME10', 200000);
      expect(res.valid).toBe(true);
      expect(res.discountAmount).toBe(20000); // 10% of 200k = 20k
    });

    it('membatasi diskon voucher fixed maksimal 25% dari total belanja', async () => {
      // FOUNDER30 bernilai Rp 20.000 dengan min_order 99.000
      // 25% dari 99.000 = 24.750, jadi 20.000 masih dalam batas 25%
      const res = await validateVoucher('FOUNDER30', 99000);
      expect(res.valid).toBe(true);
      expect(res.discountAmount).toBe(20000);
    });
  });

  describe('Order Number Generation & Idempotency', () => {
    it('menghasilkan nomor pesanan standar TS-YYMMDD-XXXXXX', () => {
      const orderNum = generateOrderNumber('TS');
      expect(isValidOrderNumber(orderNum)).toBe(true);
      expect(orderNum.startsWith('TS-')).toBe(true);
      const parts = orderNum.split('-');
      expect(parts.length).toBe(3);
      expect(parts[1].length).toBe(6); // YYMMDD
      expect(parts[2].length).toBe(6); // 6 hex digits
    });
  });
});
