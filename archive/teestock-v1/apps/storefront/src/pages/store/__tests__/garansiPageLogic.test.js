import { describe, it, expect } from 'vitest';
import {
  SIZE_CHART_MODELS,
  GARMENT_CARE_RULES,
  recommendGarmentSize,
  generateWarrantyClaimWaText,
  generateWarrantyClaimWaUrl
} from '../GaransiPage';

describe('GaransiPage Logic & Sizing Engine (Checkpoint C-08)', () => {
  describe('SIZE_CHART_MODELS Constant', () => {
    it('memiliki 4 model garmen NSA (7200, 3600, 7280 Longsleeve, 72Y00 Youth)', () => {
      expect(SIZE_CHART_MODELS.nsa_7200).toBeDefined();
      expect(SIZE_CHART_MODELS.nsa_3600).toBeDefined();
      expect(SIZE_CHART_MODELS.nsa_7280).toBeDefined();
      expect(SIZE_CHART_MODELS.nsa_72y00).toBeDefined();
    });

    it('setiap model memiliki data pengukuran baris (rows) yang valid', () => {
      Object.values(SIZE_CHART_MODELS).forEach(model => {
        expect(model.id).toBeDefined();
        expect(model.name).toBeDefined();
        expect(model.badge).toBeDefined();
        expect(model.desc).toBeDefined();
        expect(Array.isArray(model.rows)).toBe(true);
        expect(model.rows.length).toBeGreaterThanOrEqual(5);

        model.rows.forEach(row => {
          expect(row.size).toBeDefined();
          expect(row.chest).toMatch(/\d+\s*cm/);
          expect(row.length).toMatch(/\d+\s*cm/);
          expect(row.sleeve).toMatch(/\d+(\.\d+)?\s*cm/);
        });
      });
    });

    it('NSA 7200 mencakup ukuran hingga 5XL dengan lebar dada 68 cm', () => {
      const rows7200 = SIZE_CHART_MODELS.nsa_7200.rows;
      const size5XL = rows7200.find(r => r.size === '5XL');
      expect(size5XL).toBeDefined();
      expect(size5XL.chest).toBe('68 cm');
    });
  });

  describe('GARMENT_CARE_RULES Constant', () => {
    it('memiliki 4 panduan standar perawatan kaos dan sablon DTF', () => {
      expect(GARMENT_CARE_RULES).toHaveLength(4);
      GARMENT_CARE_RULES.forEach((rule, idx) => {
        expect(rule.ruleNo).toBe(`0${idx + 1}`);
        expect(rule.title).toBeDefined();
        expect(rule.desc).toBeDefined();
        expect(rule.colorTheme).toBeDefined();
      });
    });

    it('memuat aturan esensial proteksi sablon: balik kaos dan pantang setrika langsung', () => {
      const titles = GARMENT_CARE_RULES.map(r => r.title);
      expect(titles.some(t => t.toLowerCase().includes('balik'))).toBe(true);
      expect(titles.some(t => t.toLowerCase().includes('setrika'))).toBe(true);
      expect(titles.some(t => t.toLowerCase().includes('pemutih'))).toBe(true);
      expect(titles.some(t => t.toLowerCase().includes('teduh'))).toBe(true);
    });
  });

  describe('recommendGarmentSize (Antropometric Sizing Engine)', () => {
    it('memberikan rekomendasi default reguler yang sesuai', () => {
      const res = recommendGarmentSize();
      expect(res.recommendedSize).toBe('M'); // 65 kg falls into w <= 65 -> M
      expect(res.fitPreference).toBe('regular');
      expect(res.chestEstimate).toBe('50 cm');
      expect(res.note).toContain('proporsional ideal');
    });

    it('mengelompokkan ukuran berat badan dengan akurat (regular fit)', () => {
      expect(recommendGarmentSize({ weightKg: 50, fitPreference: 'regular' }).recommendedSize).toBe('S');
      expect(recommendGarmentSize({ weightKg: 62, fitPreference: 'regular' }).recommendedSize).toBe('M');
      expect(recommendGarmentSize({ weightKg: 72, fitPreference: 'regular' }).recommendedSize).toBe('L');
      expect(recommendGarmentSize({ weightKg: 82, fitPreference: 'regular' }).recommendedSize).toBe('XL');
      expect(recommendGarmentSize({ weightKg: 95, fitPreference: 'regular' }).recommendedSize).toBe('2XL');
      expect(recommendGarmentSize({ weightKg: 105, fitPreference: 'regular' }).recommendedSize).toBe('3XL');
      expect(recommendGarmentSize({ weightKg: 120, fitPreference: 'regular' }).recommendedSize).toBe('4XL');
      expect(recommendGarmentSize({ weightKg: 135, fitPreference: 'regular' }).recommendedSize).toBe('5XL');
    });

    it('menaikkan 1 tingkat ukuran jika memilih preferensi oversize', () => {
      // 62 kg base = M -> oversize = L
      const resM = recommendGarmentSize({ weightKg: 62, fitPreference: 'oversize' });
      expect(resM.recommendedSize).toBe('L');
      expect(resM.note).toContain('dinaikkan 1 tingkat');

      // 135 kg base = 5XL -> oversize tetap 5XL (batas maksimum)
      const resMax = recommendGarmentSize({ weightKg: 135, fitPreference: 'oversize' });
      expect(resMax.recommendedSize).toBe('5XL');
    });

    it('menurunkan 1 tingkat ukuran jika memilih preferensi slim fit', () => {
      // 72 kg base = L -> slim = M
      const resL = recommendGarmentSize({ weightKg: 72, fitPreference: 'slim' });
      expect(resL.recommendedSize).toBe('M');
      expect(resL.note).toContain('mengikuti siluet tubuh');

      // 50 kg base = S -> slim tetap S (batas minimum)
      const resMin = recommendGarmentSize({ weightKg: 50, fitPreference: 'slim' });
      expect(resMin.recommendedSize).toBe('S');
    });
  });

  describe('generateWarrantyClaimWaText & generateWarrantyClaimWaUrl', () => {
    it('membuat naskah WhatsApp klaim garansi cacat sablon dengan format rapi', () => {
      const text = generateWarrantyClaimWaText({
        orderNumber: 'TS-260918-001234',
        customerName: 'Budi Santoso',
        issueType: 'cacat_sablon',
        details: 'Sablon di bagian dada retak setelah cuci pertama'
      });

      expect(text).toContain('Klaim Retur: Cacat Sablon DTF / Mengelupas');
      expect(text).toContain('TS-260918-001234');
      expect(text).toContain('Budi Santoso');
      expect(text).toContain('Sablon di bagian dada retak setelah cuci pertama');
      expect(text).toContain('video unboxing');
    });

    it('menangani kategori konsultasi ukuran sebelum order', () => {
      const text = generateWarrantyClaimWaText({
        issueType: 'konsultasi_ukuran',
        customerName: 'Siti Rahma',
        details: 'Tinggi 168 cm, BB 58 kg bingung antara S atau M'
      });

      expect(text).toContain('Konsultasi: Rekomendasi Ukuran Sebelum Membeli');
      expect(text).toContain('Siti Rahma');
      expect(text).toContain('Tinggi 168 cm, BB 58 kg');
    });

    it('membuat URL wa.me yang valid dengan nomor telepon tersanitasi', () => {
      const url = generateWarrantyClaimWaUrl('0852-2027-4968', {
        orderNumber: 'TS-TEST-01',
        customerName: 'Rian'
      });

      expect(url).toContain('https://wa.me/6285220274968?text=');
      expect(url).toContain(encodeURIComponent('TS-TEST-01'));
      expect(url).toContain(encodeURIComponent('Rian'));
    });
  });
});
