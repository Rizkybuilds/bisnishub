import { describe, it, expect } from 'vitest';
import { 
  getSizeSurcharge, 
  calculateBundleDiscount, 
  getBlankPricing, 
  getShippingRateByZone,
  calculateProductHPPAndARB,
  applyARBGuard,
  calculateCatalogAutoPrice,
  GARMENT_OPTIONS,
  DESIGN_TIERS,
  CURATED_COLORS
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
        expect(whiteRetail.unitPrice).toBe(37000); // 34k vendor + 3k margin
        expect(whiteRetail.basePrice).toBe(37000);
        expect(whiteRetail.targetProfit).toBe(3000);

        const colorRetail = getBlankPricing(mock3600, 'Black', 'retail', 'L', 1);
        expect(colorRetail.unitPrice).toBe(40000); // 37k vendor + 3k margin
        expect(colorRetail.targetProfit).toBe(3000);
      });

      it('menghitung tier grosir lusinan (>=12 pcs)', () => {
        const whiteGrosir = getBlankPricing(mock3600, 'White', 'retail', 'L', 12);
        expect(whiteGrosir.unitPrice).toBe(34000); // 32k vendor + 2k margin
        expect(whiteGrosir.tier).toBe('grosir');

        const colorGrosir = getBlankPricing(mock3600, 'Black', 'retail', 'L', 12);
        expect(colorGrosir.unitPrice).toBe(37000); // 35k vendor + 2k margin
      });

      it('menghitung tier partai besar (>=72 pcs)', () => {
        const whitePartai = getBlankPricing(mock3600, 'White', 'retail', 'L', 72);
        expect(whitePartai.unitPrice).toBe(30000); // 29k vendor + 1k margin
        expect(whitePartai.tier).toBe('partai');

        const colorPartai = getBlankPricing(mock3600, 'Black', 'retail', 'L', 72);
        expect(colorPartai.unitPrice).toBe(33000); // 32k vendor + 1k margin
      });

      it('menambahkan surcharge ukuran jumbo pada harga akhir', () => {
        const result2XL = getBlankPricing(mock3600, 'White', 'retail', '2XL', 1);
        expect(result2XL.surcharge).toBe(5000);
        expect(result2XL.basePrice).toBe(37000 + 5000);
      });
    });

    describe('NSA 7200 (Heavyweight 24s)', () => {
      it('menghitung harga retail standar (+Rp 3.000)', () => {
        const colorRetail = getBlankPricing(mock7200, 'Black', 'retail', 'L', 1);
        expect(colorRetail.vendorCost).toBe(42000);
        expect(colorRetail.targetProfit).toBe(3000);
        expect(colorRetail.basePrice).toBe(45000);
      });

      it('menjamin margin tetap Rp 1.000 untuk mitra reseller', () => {
        const colorReseller = getBlankPricing(mock7200, 'Black', 'reseller', 'L', 1);
        expect(colorReseller.targetProfit).toBe(1000);
        expect(colorReseller.basePrice).toBe(43000);
        expect(colorReseller.minFloorPrice).toBe(43000);
      });
    });

    describe('NSA 7280 (Long Sleeve 24s)', () => {
      const mock7280 = { sku: 'TS-BLK-7280', name: 'NSA Premium Cotton Long Sleeve 7280' };

      it('menghitung harga retail standar (White 56k, Color 59k)', () => {
        const whiteRetail = getBlankPricing(mock7280, 'White', 'retail', 'L', 1);
        expect(whiteRetail.unitPrice).toBe(56000); // 53k + 3k
        expect(whiteRetail.targetProfit).toBe(3000);

        const colorRetail = getBlankPricing(mock7280, 'Black', 'retail', 'L', 1);
        expect(colorRetail.unitPrice).toBe(59000); // 56k + 3k
      });

      it('menerapkan surcharge jumbo +Rp 7.000 untuk lengan panjang', () => {
        const result2XL = getBlankPricing(mock7280, 'Black', 'retail', '2XL', 1);
        expect(result2XL.surcharge).toBe(7000);
        expect(result2XL.basePrice).toBe(59000 + 7000);
      });
    });

    describe('NSA 72Y00 (Youth Kids 24s)', () => {
      const mock72Y00 = { sku: 'TS-BLK-72Y00', name: 'NSA Youth Kids 72Y00' };

      it('menghitung harga retail flat 36k (vendor 33k + margin 3k)', () => {
        const retail = getBlankPricing(mock72Y00, 'Red', 'retail', 'M', 1);
        expect(retail.unitPrice).toBe(36000);
        expect(retail.targetProfit).toBe(3000);
      });

      it('menghitung harga reseller flat 34k (vendor 33k + margin 1k)', () => {
        const reseller = getBlankPricing(mock72Y00, 'Black', 'reseller', 'M', 1);
        expect(reseller.unitPrice).toBe(34000);
        expect(reseller.targetProfit).toBe(1000);
      });
    });

    describe('NSA 7250 (Ringer 24s) & NSA 7260 (Raglan 24s)', () => {
      const mock7250 = { sku: 'TS-BLK-7250', name: 'NSA Premium Cotton Ringer 7250' };
      const mock7260 = { sku: 'TS-BLK-7260', name: 'NSA Premium Cotton Raglan 7260' };

      it('menghitung harga retail Ringer 48k (vendor 45k + margin 3k)', () => {
        const retail = getBlankPricing(mock7250, 'White-Black', 'retail', 'L', 1);
        expect(retail.unitPrice).toBe(48000);
      });

      it('menghitung harga retail Raglan 58k (vendor 55k + margin 3k)', () => {
        const retail = getBlankPricing(mock7260, 'White-Black', 'retail', 'L', 1);
        expect(retail.unitPrice).toBe(58000);
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

  describe('calculateProductHPPAndARB() — HPP & Auto Rijek Bawah (ARB)', () => {
    it('menghitung HPP Kaos Polos Blank (Kaos + Packing)', () => {
      const result = calculateProductHPPAndARB({
        garmentCost: 33000,
        isBlank: true
      });
      // HPP = 33.000 + 2.000 = 35.000
      expect(result.packCost).toBe(2000);
      expect(result.electCost).toBe(0);
      expect(result.dtfCost).toBe(0);
      expect(result.totalHPP).toBe(35000);
      // ARB = 35.000 * 1.10 = 38.500 -> Ceil ke 39.000
      expect(result.arbFloorPrice).toBe(39000);
    });

    it('menghitung HPP Kaos Grafis A3 (Kaos + DTF + Packing + Listrik)', () => {
      const result = calculateProductHPPAndARB({
        garmentCost: 38000, // NSA 7200
        printSize: 'a3',
        isBlank: false
      });
      // HPP = 38.000 (kaos) + 12.500 (DTF A3) + 2.000 (pack) + 1.000 (listrik) = 53.500
      expect(result.dtfCost).toBe(12500);
      expect(result.packCost).toBe(2000);
      expect(result.electCost).toBe(1000);
      expect(result.totalHPP).toBe(53500);
      // ARB = 53.500 * 1.10 = 58.850 -> Ceil ke 59.000
      expect(result.arbFloorPrice).toBe(59000);
    });

    it('menghitung HPP Kaos Grafis Double A3 (Full Depan + Belakang)', () => {
      const result = calculateProductHPPAndARB({
        garmentCost: 38000,
        printSize: 'double_a3',
        isBlank: false
      });
      // HPP = 38.000 + 24.000 + 2.000 + 1.000 = 65.000
      expect(result.dtfCost).toBe(24000);
      expect(result.totalHPP).toBe(65000);
      // ARB = 65.000 * 1.10 = 71.500 -> Ceil ke 72.000
      expect(result.arbFloorPrice).toBe(72000);
    });
  });

  describe('applyARBGuard() — Proteksi Diskon/Promo agar Tidak Tembus ARB', () => {
    const arbFloor = 59000;

    it('mengizinkan harga promo jika berada di atas ARB', () => {
      const promoCheck = applyARBGuard(89000, arbFloor);
      expect(promoCheck.finalPrice).toBe(89000);
      expect(promoCheck.isFloorClamped).toBe(false);
      expect(promoCheck.message).toBeNull();
    });

    it('mengizinkan harga promo jika tepat sama dengan ARB', () => {
      const promoCheck = applyARBGuard(59000, arbFloor);
      expect(promoCheck.finalPrice).toBe(59000);
      expect(promoCheck.isFloorClamped).toBe(false);
    });

    it('MENOLAK dan MENGUNCI harga ke floor jika promo tembus di bawah ARB', () => {
      // Misal diskon bug / diskon kelewat besar sehingga harga jatuh ke 45.000
      const promoCheck = applyARBGuard(45000, arbFloor);
      expect(promoCheck.finalPrice).toBe(59000);
      expect(promoCheck.isFloorClamped).toBe(true);
      expect(promoCheck.message).toContain('Diskon optimal maksimal telah diterapkan');
    });
  });

  describe('calculateCatalogAutoPrice() — Auto-Pricing Katalog TeeStock (Piagam 17 Sept 2026)', () => {
    it('menghitung harga anchor default Rp 99.000 (NSA 24s + A3+ + Kemasan + Signature)', () => {
      const calc = calculateCatalogAutoPrice({
        garmentId: 'nsa_heavyweight_24s',
        printSizeId: 'a3_plus',
        designValue: 16000,
        resellerDiscountPercent: 25
      });

      // Retail = 45.000 (24s) + 35.000 (A3+) + 3.000 (kemasan) + 16.000 (desain) = 99.000
      expect(calc.retailPrice).toBe(99000);
      // Reseller 25% diskon = 99.000 * 0.75 = 74.250
      expect(calc.resellerPrice).toBe(74250);
      // Modal fisik = 42.000 + 14.500 + 3.000 + 2.000 = 61.500
      expect(calc.physicalCogs).toBe(61500);
      // Laba kotor retail = 99.000 - 61.500 = 37.500 (37.9%)
      expect(calc.grossProfitRetail).toBe(37500);
      expect(Number(calc.grossMarginRetail)).toBeCloseTo(37.9, 0);
      // Laba kotor reseller = 74.250 - 61.500 = 12.750
      expect(calc.grossProfitReseller).toBe(12750);
    });

    it('menghitung harga garmen NSA 30s Softstyle (Rp 94.000)', () => {
      const calc = calculateCatalogAutoPrice({
        garmentId: 'nsa_softstyle_30s',
        printSizeId: 'a3_plus',
        designValue: 16000,
        resellerDiscountPercent: 25
      });

      // Retail = 40.000 (30s) + 35.000 (A3+) + 3.000 + 16.000 = 94.000
      expect(calc.retailPrice).toBe(94000);
      expect(calc.resellerPrice).toBe(70500); // 94.000 * 0.75
    });

    it('menghitung desain Minimalist A4 (Rp 75.000)', () => {
      const calc = calculateCatalogAutoPrice({
        garmentId: 'nsa_heavyweight_24s',
        printSizeId: 'a4',
        designValue: 10000,
        resellerDiscountPercent: 20
      });

      // Retail = 45.000 (24s) + 17.000 (A4) + 3.000 + 10.000 = 75.000
      expect(calc.retailPrice).toBe(75000);
      expect(calc.resellerPrice).toBe(60000); // 75.000 * 0.80
    });

    it('memastikan data konstanta katalog lengkap', () => {
      expect(GARMENT_OPTIONS.length).toBeGreaterThanOrEqual(6);
      expect(DESIGN_TIERS.length).toBeGreaterThanOrEqual(5);
      expect(CURATED_COLORS.length).toBeGreaterThanOrEqual(10);
    });

    it('menghitung kombinasi sablon multi-titik: Dada Logo (A6) + Punggung (A3+)', () => {
      const calc = calculateCatalogAutoPrice({
        garmentId: 'nsa_heavyweight_24s',
        printPlacements: { front: 'logo', back: 'a3_plus', sleeve: 'none' },
        designValue: 16000,
        resellerDiscountPercent: 25
      });

      // DTF: Logo A6 (6k) + Punggung A3+ (35k) = 41.000
      expect(calc.dtfRate).toBe(41000);
      expect(calc.frontRate).toBe(6000);
      expect(calc.backRate).toBe(35000);
      // Retail: 45k + 41k + 3k + 16k = 105.000
      expect(calc.retailPrice).toBe(105000);
      // Reseller 25%: 105.000 * 0.75 = 78.750
      expect(calc.resellerPrice).toBe(78750);
      // Film DTF: 2k (A6) + 14.5k (A3+) = 16.500
      // Physical COGS: 42k + 16.5k + 3k + 2k = 63.500
      expect(calc.physicalCogs).toBe(63500);
      // Laba kotor retail: 105.000 - 63.500 = 41.500 (39.5%)
      expect(calc.grossProfitRetail).toBe(41500);
    });

    it('menghitung kombinasi 3 titik: Dada + Punggung + Lengan/Bahu', () => {
      const calc = calculateCatalogAutoPrice({
        garmentId: 'nsa_heavyweight_24s',
        printPreset: 'front_a6_back_a3_plus_sleeve',
        designValue: 16000,
        resellerDiscountPercent: 25
      });

      // DTF: Logo A6 (6k) + Punggung A3+ (35k) + Lengan A6 (5k) = 46.000
      expect(calc.dtfRate).toBe(46000);
      expect(calc.retailPrice).toBe(110000);
      expect(calc.resellerPrice).toBe(82500);
    });
  });
});
