import { describe, it, expect } from 'vitest';
import { 
  getSizeSurcharge, 
  calculateBundleDiscount, 
  getBlankPricing, 
  getShippingRateByZone,
  SIZE_SURCHARGES,
  BUNDLE_DEALS,
  SHIPPING_ZONES
} from '../pricing';

describe('TeeStock Financial & Pricing Engine', () => {
  describe('getSizeSurcharge() — Surcharge Ukuran Jumbo NSA', () => {
    it('mengembalikan 0 untuk ukuran standar (S, M, L, XL)', () => {
      expect(getSizeSurcharge('S')).toBe(0);
      expect(getSizeSurcharge('M')).toBe(0);
      expect(getSizeSurcharge('L')).toBe(0);
      expect(getSizeSurcharge('XL')).toBe(0);
      expect(getSizeSurcharge('l')).toBe(0);
      expect(getSizeSurcharge('')).toBe(0);
      expect(getSizeSurcharge(null)).toBe(0);
    });

    it('menambahkan biaya tambahan secara presisi untuk ukuran jumbo', () => {
      expect(getSizeSurcharge('2XL')).toBe(5000);
      expect(getSizeSurcharge('XXL')).toBe(5000);
      expect(getSizeSurcharge('3XL')).toBe(10000);
      expect(getSizeSurcharge('4XL')).toBe(15000);
      expect(getSizeSurcharge('5XL')).toBe(20000);
    });

    it('kebal terhadap whitespace dan huruf kecil', () => {
      expect(getSizeSurcharge(' 2xl ')).toBe(5000);
      expect(getSizeSurcharge(' 3xl ')).toBe(10000);
    });
  });

  describe('calculateBundleDiscount() — Diskon Bundling Kaos Grafis Ritel', () => {
    it('tidak memberikan diskon untuk 0 atau 1 pcs kaos grafis', () => {
      expect(calculateBundleDiscount(0)).toBe(0);
      expect(calculateBundleDiscount(1)).toBe(0);
      expect(calculateBundleDiscount(null)).toBe(0);
    });

    it('memberikan potongan Rp 18.000 untuk pembelian tepat 2 pcs (Paket Duo)', () => {
      expect(calculateBundleDiscount(2)).toBe(18000);
    });

    it('memberikan potongan Rp 14.000/pcs untuk pembelian 3 pcs atau lebih (Paket Trio)', () => {
      expect(calculateBundleDiscount(3)).toBe(42000); // 3 * 14.000
      expect(calculateBundleDiscount(4)).toBe(56000); // 4 * 14.000
      expect(calculateBundleDiscount(5)).toBe(70000); // 5 * 14.000
    });

    it('TIDAK memberikan diskon bundling otomatis untuk akun Mitra Reseller / Dropship', () => {
      expect(calculateBundleDiscount(2, 'reseller')).toBe(0);
      expect(calculateBundleDiscount(3, 'reseller')).toBe(0);
      expect(calculateBundleDiscount(4, 'dropship')).toBe(0);
    });
  });

  describe('getBlankPricing() — Kalkulasi Grosir & Margin Kaos Polos NSA', () => {
    const mock3600 = { sku: 'TS-BLK-3600', name: 'New States Apparel Softstyle 3600' };
    const mock7200 = { sku: 'TS-BLK-7200', name: 'New States Apparel Premium Cotton 7200' };

    describe('NSA 3600 (Combed 30s)', () => {
      it('menghitung harga eceran satuan (<12 pcs)', () => {
        const whiteRetail = getBlankPricing(mock3600, 'White', 'retail', 'L', 1);
        expect(whiteRetail.unitPrice).toBe(34000);
        expect(whiteRetail.basePrice).toBe(34000);
        expect(whiteRetail.targetProfit).toBe(34000 - 27000); // 7.000

        const colorRetail = getBlankPricing(mock3600, 'Black', 'retail', 'L', 1);
        expect(colorRetail.unitPrice).toBe(37000);
        expect(colorRetail.targetProfit).toBe(37000 - 30000); // 7.000
      });

      it('menghitung tier grosir lusinan (>=12 pcs)', () => {
        const whiteGrosir = getBlankPricing(mock3600, 'White', 'retail', 'L', 12);
        expect(whiteGrosir.unitPrice).toBe(32000);
        expect(whiteGrosir.tier).toBe('grosir');

        const colorGrosir = getBlankPricing(mock3600, 'Black', 'retail', 'L', 12);
        expect(colorGrosir.unitPrice).toBe(35000);
      });

      it('menghitung tier partai besar (>=72 pcs)', () => {
        const whitePartai = getBlankPricing(mock3600, 'White', 'retail', 'L', 72);
        expect(whitePartai.unitPrice).toBe(29000);
        expect(whitePartai.tier).toBe('partai');

        const colorPartai = getBlankPricing(mock3600, 'Black', 'retail', 'L', 72);
        expect(colorPartai.unitPrice).toBe(32000);
      });

      it('menambahkan surcharge ukuran jumbo pada harga akhir', () => {
        const result2XL = getBlankPricing(mock3600, 'White', 'retail', '2XL', 1);
        expect(result2XL.surcharge).toBe(5000);
        expect(result2XL.basePrice).toBe(34000 + 5000);
      });
    });

    describe('NSA 7200 (Heavyweight 24s)', () => {
      it('menghitung harga retail standar', () => {
        const colorRetail = getBlankPricing(mock7200, 'Black', 'retail', 'L', 1);
        expect(colorRetail.vendorCost).toBe(42000);
        expect(colorRetail.targetProfit).toBe(10000);
        expect(colorRetail.basePrice).toBe(52000);
      });

      it('menjamin margin lantai minimal Rp 2.000 untuk mitra reseller', () => {
        const colorReseller = getBlankPricing(mock7200, 'Black', 'reseller', 'L', 1);
        expect(colorReseller.targetProfit).toBe(2000);
        expect(colorReseller.basePrice).toBe(44000);
        expect(colorReseller.minFloorPrice).toBe(44000);
      });
    });
  });

  describe('getShippingRateByZone() — Tarif Logistik Nasional', () => {
    it('mengembalikan tarif sesuai ID zona', () => {
      expect(getShippingRateByZone('jabodetabek_jabar')).toBe(10000);
      expect(getShippingRateByZone('jawa_lainnya')).toBe(15000);
      expect(getShippingRateByZone('luar_jawa_kota')).toBe(28000);
      expect(getShippingRateByZone('luar_jawa_timur')).toBe(45000);
    });

    it('memberikan fallback Rp 15.000 jika zona tidak dikenali', () => {
      expect(getShippingRateByZone('unknown_zone')).toBe(15000);
    });
  });
});
