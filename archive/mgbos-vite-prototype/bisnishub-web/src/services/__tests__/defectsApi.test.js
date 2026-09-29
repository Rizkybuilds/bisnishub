import { describe, it, expect } from 'vitest';
import { 
  calculateDefectLoss, 
  DEFECT_TYPES, 
  RESPONSIBLE_PARTIES, 
  CLAIM_STATUSES 
} from '../defectsApi';

describe('Quality Control & Defect Loss Engine (defectsApi.js)', () => {
  describe('calculateDefectLoss() — Kalkulator Kerugian HPP Riil Scrap', () => {
    it('menghitung kerugian gagal heat press Kaos NSA 30s + Film DTF + Listrik', () => {
      const result = calculateDefectLoss({
        defectType: 'heat_press_failed',
        garmentKey: 'nsa_softstyle_30s',
        qty: 1
      });

      // Kaos 30s (37.000) + Film DTF (12.000) + Listrik (1.000) = 50.000
      expect(result.garmentHpp).toBe(37000);
      expect(result.dtfHpp).toBe(12000);
      expect(result.opCost).toBe(1000);
      expect(result.totalUnitLoss).toBe(50000);
      expect(result.totalCostLoss).toBe(50000);
    });

    it('menghitung kerugian gagal heat press Kaos NSA Heavyweight 24s', () => {
      const result = calculateDefectLoss({
        defectType: 'heat_press_failed',
        garmentKey: 'nsa_heavyweight_24s',
        qty: 2
      });

      // Kaos 24s (42.000) + Film DTF (12.000) + Listrik (1.000) = 55.000 * 2 = 110.000
      expect(result.garmentHpp).toBe(42000);
      expect(result.dtfHpp).toBe(12000);
      expect(result.totalUnitLoss).toBe(55000);
      expect(result.totalCostLoss).toBe(110000);
    });

    it('menghitung kerugian cacat sablon vendor DTF saja (film rusak sebelum dipress)', () => {
      const result = calculateDefectLoss({
        defectType: 'dtf_print',
        qty: 3,
        unitDtfCost: 11000
      });

      // Hanya film DTF: 11.000 * 3 = 33.000 (Kaos tidak terbuang)
      expect(result.garmentHpp).toBe(0);
      expect(result.dtfHpp).toBe(11000);
      expect(result.totalCostLoss).toBe(33000);
    });

    it('menghitung kerugian cacat garmen supplier NSA saja (kaos bolong sebelum dipress)', () => {
      const result = calculateDefectLoss({
        defectType: 'garment_flaw',
        garmentKey: 'nsa_softstyle_30s',
        qty: 1
      });

      // Hanya kaos NSA: 37.000 (Film DTF tidak terbuang)
      expect(result.garmentHpp).toBe(37000);
      expect(result.dtfHpp).toBe(0);
      expect(result.totalCostLoss).toBe(37000);
    });
  });

  describe('Master Configurations', () => {
    it('menyediakan konfigurasi lengkap jenis cacat dan pihak terkait', () => {
      expect(DEFECT_TYPES.heat_press_failed).toBeDefined();
      expect(DEFECT_TYPES.dtf_print).toBeDefined();
      expect(DEFECT_TYPES.garment_flaw).toBeDefined();

      expect(RESPONSIBLE_PARTIES.internal_press).toBeDefined();
      expect(RESPONSIBLE_PARTIES.vendor_dtf).toBeDefined();
      expect(RESPONSIBLE_PARTIES.vendor_nsa).toBeDefined();

      expect(CLAIM_STATUSES.unclaimed).toBeDefined();
      expect(CLAIM_STATUSES.claimed_pending).toBeDefined();
      expect(CLAIM_STATUSES.reimbursed).toBeDefined();
      expect(CLAIM_STATUSES.internal_absorbed).toBeDefined();
    });
  });
});
