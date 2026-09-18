import { describe, it, expect } from 'vitest';
import {
  BLANK_SKU_TO_GARMENT,
  getCustomTierDiscount,
  calculateCustomOrderPrice,
  validateArtworkPreflight,
  generateCustomOrderWaText,
  generateCustomOrderWaUrl
} from '../CustomOrderPage';

describe('CustomOrderPage Logic & Quotation Engine (Checkpoint C-06)', () => {
  describe('BLANK_SKU_TO_GARMENT Mapping', () => {
    it('memetakan SKU blank katalog ke kunci tipe garmen yang valid', () => {
      expect(BLANK_SKU_TO_GARMENT['TS-BLK-3600']).toBe('nsa_softstyle_30s');
      expect(BLANK_SKU_TO_GARMENT['TS-BLK-7200']).toBe('nsa_heavyweight_24s');
      expect(BLANK_SKU_TO_GARMENT['TS-BLK-7280']).toBe('nsa_longsleeve');
      expect(BLANK_SKU_TO_GARMENT['TS-BLK-7250']).toBe('nsa_ringer');
      expect(BLANK_SKU_TO_GARMENT['TS-BLK-7260']).toBe('nsa_raglan');
      expect(BLANK_SKU_TO_GARMENT['TS-BLK-72Y00']).toBe('nsa_youth');
    });
  });

  describe('getCustomTierDiscount (CFO Volume Pricing Matrix)', () => {
    it('memberikan harga retail normal (multiplier 1.65, diskon 0%) untuk 1 - 5 pcs', () => {
      const tier1 = getCustomTierDiscount(1);
      expect(tier1.tierKey).toBe('retail');
      expect(tier1.discountPct).toBe(0);
      expect(tier1.multiplier).toBe(1.65);

      const tier5 = getCustomTierDiscount(5);
      expect(tier5.tierKey).toBe('retail');
      expect(tier5.multiplier).toBe(1.65);
    });

    it('memberikan diskon grup kecil (multiplier 1.55, diskon ~6%) untuk 6 - 11 pcs', () => {
      const tier6 = getCustomTierDiscount(6);
      expect(tier6.tierKey).toBe('tier6');
      expect(tier6.multiplier).toBe(1.55);

      const tier11 = getCustomTierDiscount(11);
      expect(tier11.tierKey).toBe('tier6');
    });

    it('memberikan diskon grosir lusinan (multiplier 1.45, diskon 12%) untuk 12 - 23 pcs', () => {
      const tier12 = getCustomTierDiscount(12);
      expect(tier12.tierKey).toBe('tier12');
      expect(tier12.multiplier).toBe(1.45);
      expect(tier12.discountPct).toBe(12);

      const tier23 = getCustomTierDiscount(23);
      expect(tier23.tierKey).toBe('tier12');
    });

    it('memberikan diskon grosir 2 lusin (multiplier 1.35, diskon 18%) untuk 24 - 49 pcs', () => {
      const tier24 = getCustomTierDiscount(24);
      expect(tier24.tierKey).toBe('tier24');
      expect(tier24.multiplier).toBe(1.35);
      expect(tier24.discountPct).toBe(18);
    });

    it('memberikan diskon partai 50+ pcs (multiplier 1.28, diskon 22%) dengan mematuhi CFO floor <= 25%', () => {
      const tier50 = getCustomTierDiscount(50);
      expect(tier50.tierKey).toBe('tier50');
      expect(tier50.multiplier).toBe(1.28);
      expect(tier50.discountPct).toBeLessThanOrEqual(25);
    });

    it('menangani input edge case (0, minus, string tidak valid) dengan aman', () => {
      const tier0 = getCustomTierDiscount(0);
      expect(tier0.tierKey).toBe('retail');

      const tierNegative = getCustomTierDiscount(-10);
      expect(tierNegative.tierKey).toBe('retail');

      const tierInvalid = getCustomTierDiscount('bukan-angka');
      expect(tierInvalid.tierKey).toBe('retail');
    });
  });

  describe('calculateCustomOrderPrice (Pure Quotation Engine)', () => {
    it('menghitung harga retail satuan (1 pcs) dengan pembulatan ke atas 1.000 terdekat', () => {
      const quote = calculateCustomOrderPrice({
        garmentKey: 'nsa_softstyle_30s',
        printSizeId: 'a3',
        size: 'L',
        qty: 1
      });

      expect(quote.qty).toBe(1);
      expect(quote.sizeSurcharge).toBe(0);
      expect(quote.baseLaborAndPack).toBe(8000); // 5000 + 2000 + 1000
      expect(quote.estPricePerPcs).toBeGreaterThan(quote.baseCost);
      expect(quote.estTotal).toBe(quote.estPricePerPcs * 1);
      expect(quote.estPricePerPcs % 1000).toBe(0);
      expect(quote.totalSavings).toBe(0);
    });

    it('menerapkan surcharge ukuran besar (2XL dan 3XL)', () => {
      const quoteL = calculateCustomOrderPrice({
        garmentKey: 'nsa_heavyweight_24s',
        printSizeId: 'a3',
        size: 'L',
        qty: 1
      });

      const quote2XL = calculateCustomOrderPrice({
        garmentKey: 'nsa_heavyweight_24s',
        printSizeId: 'a3',
        size: '2XL',
        qty: 1
      });

      const quote3XL = calculateCustomOrderPrice({
        garmentKey: 'nsa_heavyweight_24s',
        printSizeId: 'a3',
        size: '3XL',
        qty: 1
      });

      expect(quote2XL.sizeSurcharge).toBe(5000);
      expect(quote3XL.sizeSurcharge).toBe(10000);
      expect(quote2XL.estPricePerPcs).toBeGreaterThan(quoteL.estPricePerPcs);
      expect(quote3XL.estPricePerPcs).toBeGreaterThan(quote2XL.estPricePerPcs);
    });

    it('memberikan penghematan grosir (totalSavings > 0) pada pesanan lusinan (12 pcs)', () => {
      const quote12 = calculateCustomOrderPrice({
        garmentKey: 'nsa_softstyle_30s',
        printSizeId: 'a3',
        size: 'L',
        qty: 12
      });

      expect(quote12.tierLabel).toContain('Grosir Lusinan');
      expect(quote12.totalSavings).toBeGreaterThan(0);
      expect(quote12.estTotal).toBe(quote12.estPricePerPcs * 12);
    });

    it('memastikan margin kotor retail memenuhi CFO guardrail >= 35%', () => {
      const quote = calculateCustomOrderPrice({
        garmentKey: 'nsa_softstyle_30s',
        printSizeId: 'a3',
        size: 'L',
        qty: 1
      });

      const grossProfit = quote.estPricePerPcs - quote.baseCost;
      const marginPct = (grossProfit / quote.estPricePerPcs) * 100;
      expect(marginPct).toBeGreaterThanOrEqual(35);
    });

    it('melakukan fallback aman bila garmentKey atau printSizeId tidak ditemukan', () => {
      const quote = calculateCustomOrderPrice({
        garmentKey: 'unknown_garment_key',
        printSizeId: 'unknown_print_id',
        size: 'M',
        qty: 2
      });

      expect(quote.estPricePerPcs).toBeGreaterThan(0);
      expect(quote.estTotal).toBe(quote.estPricePerPcs * 2);
    });
  });

  describe('validateArtworkPreflight (Artwork & DTF Quality Preflight)', () => {
    it('menolak jika file tidak ada / null', () => {
      const res = validateArtworkPreflight(null);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Silakan pilih file');
    });

    it('menolak file yang melebihi batas 25MB', () => {
      const oversizedFile = {
        name: 'artwork-huge.png',
        size: 30 * 1024 * 1024, // 30 MB
        type: 'image/png'
      };
      const res = validateArtworkPreflight(oversizedFile);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('melebihi batas 25 MB');
    });

    it('menolak format file yang tidak didukung (.exe, .zip)', () => {
      const invalidFile = {
        name: 'program.exe',
        size: 500 * 1024,
        type: 'application/x-msdownload'
      };
      const res = validateArtworkPreflight(invalidFile);
      expect(res.valid).toBe(false);
      expect(res.error).toContain('Format file tidak didukung');
    });

    it('menerima file PNG transparan tanpa peringatan background', () => {
      const pngFile = {
        name: 'band-logo-transparent.png',
        size: 2 * 1024 * 1024,
        type: 'image/png'
      };
      const res = validateArtworkPreflight(pngFile);
      expect(res.valid).toBe(true);
      expect(res.warning).toBeNull();
      expect(res.isImage).toBe(true);
    });

    it('menerima file JPG namun memberikan peringatan background padat', () => {
      const jpgFile = {
        name: 'artwork-photo.jpg',
        size: 1.5 * 1024 * 1024,
        type: 'image/jpeg'
      };
      const res = validateArtworkPreflight(jpgFile);
      expect(res.valid).toBe(true);
      expect(res.warning).toContain('Format JPG memiliki background padat');
    });

    it('menerima file vector PDF atau AI', () => {
      const pdfFile = {
        name: 'vector-design.pdf',
        size: 4 * 1024 * 1024,
        type: 'application/pdf'
      };
      const res = validateArtworkPreflight(pdfFile);
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });
  });

  describe('generateCustomOrderWaText & generateCustomOrderWaUrl', () => {
    const mockOrder = {
      orderNumber: 'TS-CST-260918-1234',
      customer: 'Rizky Founder',
      city: 'Depok',
      garmentName: 'NSA Premium Cotton 7200 (24s)',
      color: 'Black',
      size: 'XL',
      qty: 12,
      printName: 'Studio Standard (A3 - 28x40 cm)',
      artworkDesc: 'https://cloudinary.com/teestock/artwork.png',
      notes: 'Bahan adem, sablon pekat tanpa retak',
      estPricePerPcs: 85000,
      estTotal: 1020000
    };

    it('membuat teks brief WhatsApp yang rapi dan memuat seluruh data teknis', () => {
      const text = generateCustomOrderWaText(mockOrder);
      expect(text).toContain('TS-CST-260918-1234');
      expect(text).toContain('Rizky Founder (Depok)');
      expect(text).toContain('NSA Premium Cotton 7200 (24s)');
      expect(text).toContain('Black • Size XL');
      expect(text).toContain('Studio Standard (A3 - 28x40 cm)');
      expect(text).toContain('12 pcs');
      expect(text).toContain('Artwork:');
      expect(text).toContain('Catatan Khusus:');
      expect(text).toContain('1.020.000');
    });

    it('menghasilkan URL wa.me dengan encoding URI yang valid', () => {
      const waUrl = generateCustomOrderWaUrl('085220274968', mockOrder);
      expect(waUrl).toContain('https://wa.me/6285220274968?text=');
      expect(waUrl).toContain(encodeURIComponent('TS-CST-260918-1234'));
    });
  });
});
