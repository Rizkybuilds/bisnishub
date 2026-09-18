import { describe, it, expect } from 'vitest';
import {
  getProductBasePrice,
  filterCatalogProducts,
  sortCatalogProducts
} from '../CatalogPage';

describe('CatalogPage Business & Data Logic (Storefront Checkpoint 2)', () => {
  const mockCatalog = [
    {
      sku: 'TS-STM-001',
      name: 'Raw Identity Tee',
      series: 'statement',
      niche: 'Streetwear Minimalist',
      description: 'Kaos filosofis tipografi tajam',
      status: 'active',
      priceRetail: 99000,
      pricePromo: 89000,
      salesCount: 45,
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      sku: 'TS-SUB-002',
      name: 'Subculture Beats Tee',
      series: 'subculture',
      niche: 'Musik & Skate',
      description: 'Vintage 90s alternative rock',
      status: 'active',
      priceRetail: 110000,
      salesCount: 80,
      createdAt: '2026-02-01T00:00:00Z'
    },
    {
      sku: 'TS-OUT-003',
      name: 'Forest Runner Tee',
      series: 'outdoor',
      niche: 'Mountain Exploration',
      description: 'Ilustrasi botani alam pegunungan',
      status: 'active',
      priceRetail: 99000,
      salesCount: 15,
      createdAt: '2026-03-01T00:00:00Z'
    },
    {
      sku: 'TS-ARC-999',
      name: 'Archived Tee',
      series: 'statement',
      status: 'archived',
      priceRetail: 99000,
      salesCount: 0
    },
    {
      sku: 'TS-BLK-3600',
      name: 'New States Apparel Softstyle 3600',
      series: 'blank',
      status: 'active',
      priceRetail: 37000,
      salesCount: 120,
      createdAt: '2026-01-15T00:00:00Z'
    },
    {
      sku: 'TS-BLK-7200',
      name: 'New States Apparel Heavyweight 7200',
      series: 'blank',
      status: 'active',
      priceRetail: 52000,
      salesCount: 200,
      createdAt: '2026-02-15T00:00:00Z'
    }
  ];

  describe('filterCatalogProducts', () => {
    it('memisahkan produk grafis dan produk polos dengan benar', () => {
      const graphics = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: false
      });
      // 3 active graphics (archived TS-ARC-999 is excluded)
      expect(graphics.length).toBe(3);
      expect(graphics.every(p => p.series !== 'blank')).toBe(true);

      const blanks = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: true
      });
      expect(blanks.length).toBe(2);
      expect(blanks.every(p => p.series === 'blank')).toBe(true);
    });

    it('memfilter berdasarkan series pada mode grafis', () => {
      const statementOnly = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: false,
        activeSeries: 'statement'
      });
      expect(statementOnly.length).toBe(1);
      expect(statementOnly[0].sku).toBe('TS-STM-001');

      const outdoorOnly = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: false,
        activeSeries: 'outdoor'
      });
      expect(outdoorOnly.length).toBe(1);
      expect(outdoorOnly[0].sku).toBe('TS-OUT-003');
    });

    it('memfilter berdasarkan model spesifik pada mode kaos polos', () => {
      const model3600 = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: true,
        selectedBlankModel: 'TS-BLK-3600'
      });
      expect(model3600.length).toBe(1);
      expect(model3600[0].sku).toBe('TS-BLK-3600');
    });

    it('mencari secara case-insensitive berdasarkan nama, sku, dan deskripsi', () => {
      const searchByName = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: false,
        search: 'forest'
      });
      expect(searchByName.length).toBe(1);
      expect(searchByName[0].sku).toBe('TS-OUT-003');

      const searchBySku = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: false,
        search: 'ts-sub'
      });
      expect(searchBySku.length).toBe(1);
      expect(searchBySku[0].sku).toBe('TS-SUB-002');

      const searchByDesc = filterCatalogProducts({
        catalog: mockCatalog,
        isBlankMode: false,
        search: 'alternative rock'
      });
      expect(searchByDesc.length).toBe(1);
      expect(searchByDesc[0].sku).toBe('TS-SUB-002');
    });
  });

  describe('getProductBasePrice', () => {
    it('mengembalikan harga dasar akurat untuk NSA 3600 (Rp 34.000) dan 7200 (Rp 49.000)', () => {
      const p3600 = mockCatalog.find(p => p.sku === 'TS-BLK-3600');
      const p7200 = mockCatalog.find(p => p.sku === 'TS-BLK-7200');

      expect(getProductBasePrice(p3600)).toBe(34000);
      expect(getProductBasePrice(p7200)).toBe(49000);
    });

    it('mengembalikan harga promo jika tersedia untuk produk grafis', () => {
      const promoProduct = mockCatalog.find(p => p.sku === 'TS-STM-001');
      expect(getProductBasePrice(promoProduct)).toBe(89000); // pricePromo is 89000
    });
  });

  describe('sortCatalogProducts', () => {
    it('mengurutkan berdasarkan harga terendah ke tertinggi (price-asc)', () => {
      const graphics = filterCatalogProducts({ catalog: mockCatalog, isBlankMode: false });
      const sorted = sortCatalogProducts(graphics, 'price-asc');

      const prices = sorted.map(p => getProductBasePrice(p));
      expect(prices).toEqual([89000, 99000, 110000]);
    });

    it('mengurutkan berdasarkan harga tertinggi ke terendah (price-desc)', () => {
      const graphics = filterCatalogProducts({ catalog: mockCatalog, isBlankMode: false });
      const sorted = sortCatalogProducts(graphics, 'price-desc');

      const prices = sorted.map(p => getProductBasePrice(p));
      expect(prices).toEqual([110000, 99000, 89000]);
    });

    it('mengurutkan secara alfabetis A-Z (name-asc)', () => {
      const graphics = filterCatalogProducts({ catalog: mockCatalog, isBlankMode: false });
      const sorted = sortCatalogProducts(graphics, 'name-asc');

      expect(sorted.map(p => p.name)).toEqual([
        'Forest Runner Tee',
        'Raw Identity Tee',
        'Subculture Beats Tee'
      ]);
    });

    it('mengurutkan berdasarkan rilis terbaru (newest)', () => {
      const graphics = filterCatalogProducts({ catalog: mockCatalog, isBlankMode: false });
      const sorted = sortCatalogProducts(graphics, 'newest');

      // 2026-03-01 -> 2026-02-01 -> 2026-01-01
      expect(sorted.map(p => p.sku)).toEqual([
        'TS-OUT-003',
        'TS-SUB-002',
        'TS-STM-001'
      ]);
    });

    it('mengurutkan berdasarkan popularitas / salesCount (popularity)', () => {
      const graphics = filterCatalogProducts({ catalog: mockCatalog, isBlankMode: false });
      const sorted = sortCatalogProducts(graphics, 'popularity');

      // TS-SUB-002 (80 sales) -> TS-STM-001 (45 sales) -> TS-OUT-003 (15 sales)
      expect(sorted.map(p => p.sku)).toEqual([
        'TS-SUB-002',
        'TS-STM-001',
        'TS-OUT-003'
      ]);
    });
  });
});
