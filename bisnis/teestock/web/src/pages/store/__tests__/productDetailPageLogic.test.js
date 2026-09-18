import { describe, it, expect } from 'vitest';
import {
  calculatePDPPrice,
  resolveSizeList,
  filterColorsByCategory,
  SIZES_5XL_COLORS,
  COLOR_CATEGORIES
} from '../ProductDetailPage';

describe('ProductDetailPage Business & Pricing Logic (Storefront Checkpoint 3)', () => {
  const mockGraphicProduct = {
    sku: 'TS-STM-001',
    name: 'Raw Identity // Statement Tee',
    series: 'statement',
    seriesName: 'Graphic Statement',
    status: 'active',
    priceRetail: 99000,
    pricePromo: 0,
    priceReseller: 65000,
    priceDropship: 75000,
    colors: 'Hitam, Putih, Charcoal, Navy, Sand'
  };

  const mockBlank3600 = {
    sku: 'TS-BLK-3600',
    name: 'New States Apparel Softstyle 3600',
    series: 'blank',
    status: 'active',
    template: 'softstyle_30s',
    priceRetail: 37000,
    priceReseller: 32000,
    colors: 'White, Black, Navy, Maroon, Sand'
  };

  const mockBlank7200 = {
    sku: 'TS-BLK-7200',
    name: 'New States Apparel Heavyweight 7200',
    series: 'blank',
    status: 'active',
    template: 'heavyweight_24s',
    priceRetail: 52000,
    priceReseller: 42000,
    colors: 'White, Black, Charcoal, Forest Green, Sand'
  };

  describe('calculatePDPPrice for Graphic Apparel', () => {
    it('menghitung harga retail standar tanpa surcharge ukuran reguler', () => {
      const pricing = calculatePDPPrice({
        product: mockGraphicProduct,
        isBlank: false,
        selectedSize: 'L'
      });

      expect(pricing.currentPrice).toBe(99000);
      expect(pricing.baseRetailPrice).toBe(99000);
      expect(pricing.sizeSurcharge).toBe(0);
      expect(pricing.partnerSavings).toBe(0);
    });

    it('menambahkan surcharge ukuran jumbo (2XL, 3XL, 4XL, 5XL)', () => {
      const price2XL = calculatePDPPrice({
        product: mockGraphicProduct,
        isBlank: false,
        selectedSize: '2XL'
      });
      expect(price2XL.currentPrice).toBe(99000 + 5000); // 104.000

      const price3XL = calculatePDPPrice({
        product: mockGraphicProduct,
        isBlank: false,
        selectedSize: '3XL'
      });
      expect(price3XL.currentPrice).toBe(99000 + 10000); // 109.000
    });

    it('menambahkan delta harga saat garmen di-upgrade ke Longsleeve', () => {
      const pricing = calculatePDPPrice({
        product: mockGraphicProduct,
        isBlank: false,
        selectedGarmentKey: 'nsa_longsleeve',
        selectedSize: 'L'
      });

      expect(pricing.priceDelta).toBe(12000);
      expect(pricing.currentPrice).toBe(99000 + 12000); // 111.000
    });

    it('mengaplikasikan diskon mitra reseller resmi (Rp 65.000)', () => {
      const pricing = calculatePDPPrice({
        product: mockGraphicProduct,
        isBlank: false,
        isPartner: true,
        profile: { partner_tier: 'reseller' },
        selectedSize: 'L'
      });

      expect(pricing.currentPrice).toBe(65000);
      expect(pricing.partnerSavings).toBe(99000 - 65000); // 34.000
      expect(pricing.isPartnerDiscountApplied).toBe(true);
    });

    it('mengaplikasikan diskon mitra dropship resmi (Rp 75.000)', () => {
      const pricing = calculatePDPPrice({
        product: mockGraphicProduct,
        isBlank: false,
        isPartner: true,
        profile: { partner_tier: 'dropship' },
        selectedSize: 'L'
      });

      expect(pricing.currentPrice).toBe(75000);
      expect(pricing.partnerSavings).toBe(99000 - 75000); // 24.000
      expect(pricing.isPartnerDiscountApplied).toBe(true);
    });
  });

  describe('calculatePDPPrice for NSA Blanks', () => {
    it('menghitung harga eceran NSA 3600 (White Rp 37.000 vs Color Rp 40.000)', () => {
      const whitePricing = calculatePDPPrice({
        product: mockBlank3600,
        isBlank: true,
        selectedColor: 'White',
        selectedSize: 'M'
      });
      // Vendor 34.000 + margin retail 3.000 = 37.000
      expect(whitePricing.currentPrice).toBe(37000);

      const colorPricing = calculatePDPPrice({
        product: mockBlank3600,
        isBlank: true,
        selectedColor: 'Black',
        selectedSize: 'M'
      });
      // Vendor 37.000 + margin retail 3.000 = 40.000
      expect(colorPricing.currentPrice).toBe(40000);
    });

    it('menghitung harga eceran NSA 7200 (White Rp 42.000 vs Color Rp 45.000)', () => {
      const whitePricing = calculatePDPPrice({
        product: mockBlank7200,
        isBlank: true,
        selectedColor: 'White',
        selectedSize: 'XL'
      });
      // Vendor 39.000 + margin retail 3.000 = 42.000
      expect(whitePricing.currentPrice).toBe(42000);

      const colorPricing = calculatePDPPrice({
        product: mockBlank7200,
        isBlank: true,
        selectedColor: 'Charcoal',
        selectedSize: 'XL'
      });
      // Vendor 42.000 + margin retail 3.000 = 45.000
      expect(colorPricing.currentPrice).toBe(45000);
    });
  });

  describe('resolveSizeList', () => {
    it('membatasi ukuran NSA 3600 maksimal sampai 2XL', () => {
      const sizes = resolveSizeList({
        product: mockBlank3600,
        isBlank: true,
        selectedColor: 'Black'
      });
      expect(sizes).toEqual(['S', 'M', 'L', 'XL', '2XL']);
      expect(sizes.includes('3XL')).toBe(false);
    });

    it('menyediakan size 5XL pada NSA 7200 untuk warna hitam dan putih', () => {
      const sizesBlack = resolveSizeList({
        product: mockBlank7200,
        isBlank: true,
        selectedColor: 'Black'
      });
      expect(sizesBlack.includes('5XL')).toBe(true);

      const sizesSand = resolveSizeList({
        product: mockBlank7200,
        isBlank: true,
        selectedColor: 'Sand' // bukan warna 5XL
      });
      expect(sizesSand.includes('5XL')).toBe(false);
      expect(sizesSand.includes('3XL')).toBe(true);
    });
  });

  describe('filterColorsByCategory', () => {
    const sampleColors = ['Hitam', 'Putih', 'Charcoal', 'Sand', 'Army', 'Mustard', 'Royal Blue'];

    it('mengembalikan semua warna jika activeColorTab adalah all', () => {
      const filtered = filterColorsByCategory({ colorList: sampleColors, activeColorTab: 'all' });
      expect(filtered).toEqual(sampleColors);
    });

    it('memfilter kategori basic dengan benar', () => {
      const basic = filterColorsByCategory({ colorList: sampleColors, activeColorTab: 'basic' });
      expect(basic).toEqual(['Hitam', 'Putih', 'Charcoal']);
    });

    it('memfilter kategori earthy dengan benar', () => {
      const earthy = filterColorsByCategory({ colorList: sampleColors, activeColorTab: 'earthy' });
      expect(earthy).toEqual(['Sand', 'Army']);
    });

    it('memfilter kategori vibrant dengan benar', () => {
      const vibrant = filterColorsByCategory({ colorList: sampleColors, activeColorTab: 'vibrant' });
      expect(vibrant).toEqual(['Mustard', 'Royal Blue']);
    });
  });
});
