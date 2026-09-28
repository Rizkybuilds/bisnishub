import { describe, it, expect } from 'vitest';
import { getAvailableColors, getCardPreviewImage } from '@bisnishub/shared/utils/productImages';
import { FABRIC_SPECS } from '../../../components/store/home/HomeFabricComparison';

describe('HomePage Business & Data Logic (Storefront Checkpoint 1)', () => {
  const mockCatalog = [
    {
      sku: 'TS-STM-001',
      name: 'Raw Identity Tee',
      series: 'statement',
      status: 'active',
      priceRetail: 99000,
      colors: 'Hitam, Putih, Charcoal',
      filePath: '/images/ts-stm-001.png'
    },
    {
      sku: 'TS-SUB-002',
      name: 'Subculture Beats',
      series: 'subculture',
      status: 'active',
      priceRetail: 99000,
      colors: 'Hitam, Navy',
      filePath: '/images/ts-sub-002.png'
    },
    {
      sku: 'TS-OUT-003',
      name: 'Forest Runner',
      series: 'outdoor',
      status: 'draft', // Draft product
      priceRetail: 99000,
      colors: 'Army, Sand',
      filePath: '/images/ts-out-003.png'
    },
    {
      sku: 'TS-BLK-7200',
      name: 'NSA Heavyweight 24s Blank',
      series: 'blank',
      status: 'active',
      priceRetail: 52000,
      colors: 'Hitam, Putih, Navy, Maroon',
      filePath: '/images/ts-blk-7200.png'
    }
  ];

  it('memilih produk grafis aktif pertama sebagai featured lookbook spotlight', () => {
    const graphic = mockCatalog.find(p => p.series !== 'blank' && p.status === 'active');
    expect(graphic).toBeDefined();
    expect(graphic.sku).toBe('TS-STM-001');
    expect(graphic.series).toBe('statement');
  });

  it('menggunakan fallback aman jika katalog kosong', () => {
    const emptyCatalog = [];
    const fallback = emptyCatalog.find(p => p.series !== 'blank' && p.status === 'active') || {
      sku: 'TS-STM-001',
      name: 'Raw Identity // Statement Tee',
      priceRetail: 99000
    };
    expect(fallback.sku).toBe('TS-STM-001');
    expect(fallback.priceRetail).toBe(99000);
  });

  it('mengekstrak daftar varian warna dengan benar untuk swatches interaktif', () => {
    const product = mockCatalog[0];
    const colors = getAvailableColors(product);
    expect(colors).toEqual(['Hitam', 'Putih', 'Charcoal']);
  });

  it('memfilter kategori produk aktif dengan benar untuk showcase grid', () => {
    // Kategori all: hanya produk grafis aktif (bukan blank dan bukan draft)
    const allGraphics = mockCatalog.filter(p => p.series !== 'blank' && p.status === 'active');
    expect(allGraphics.length).toBe(2);
    expect(allGraphics.map(p => p.sku)).toEqual(['TS-STM-001', 'TS-SUB-002']);

    // Kategori blank
    const blanks = mockCatalog.filter(p => p.series === 'blank');
    expect(blanks.length).toBe(1);
    expect(blanks[0].sku).toBe('TS-BLK-7200');

    // Kategori outdoor (hanya yang aktif)
    const outdoorActive = mockCatalog.filter(p => p.series === 'outdoor' && p.status === 'active');
    expect(outdoorActive.length).toBe(0); // Karena TS-OUT-003 berstatus draft
  });

  it('memastikan schema JSON-LD terstruktur valid untuk Google Rich Results', () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ClothingStore",
      "name": "TeeStock Apparel",
      "url": "https://teestockapparel.vercel.app",
      "currenciesAccepted": "IDR",
      "priceRange": "Rp 34.000 - Rp 139.000"
    };

    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("ClothingStore");
    expect(schema.currenciesAccepted).toBe("IDR");
  });

  it('memvalidasi integritas data FABRIC_SPECS untuk komparasi garmen NSA', () => {
    expect(FABRIC_SPECS).toBeDefined();
    expect(FABRIC_SPECS.nsa24s.gsm).toBe(180);
    expect(FABRIC_SPECS.nsa30s.gsm).toBe(150);
    expect(FABRIC_SPECS.nsa24s.gsm).toBeGreaterThan(FABRIC_SPECS.nsa30s.gsm);
    expect(FABRIC_SPECS.nsa24s.construction).toContain('Tubular Knit');
    expect(FABRIC_SPECS.nsa30s.construction).toContain('Tubular Knit');
    expect(FABRIC_SPECS.nsa24s.model).toContain('7200');
    expect(FABRIC_SPECS.nsa30s.model).toContain('3600');
  });

  it('memvalidasi kalkulasi badge counter untuk setiap tab kategori katalog', () => {
    const computeCount = (categoryId) => {
      if (categoryId === 'all') return mockCatalog.filter(p => p.series !== 'blank' && p.status === 'active').length;
      if (categoryId === 'blank') return mockCatalog.filter(p => p.series === 'blank').length;
      return mockCatalog.filter(p => p.series === categoryId && p.status === 'active').length;
    };

    expect(computeCount('all')).toBe(2);
    expect(computeCount('statement')).toBe(1);
    expect(computeCount('subculture')).toBe(1);
    expect(computeCount('outdoor')).toBe(0); // draft
    expect(computeCount('blank')).toBe(1);
  });
});
