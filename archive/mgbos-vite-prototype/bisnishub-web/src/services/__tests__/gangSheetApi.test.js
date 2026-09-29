import { describe, it, expect } from 'vitest';
import { 
  calculateAccurateGangSheet, 
  getGangSheetKpis, 
  exportGangSheetCutListCsv, 
  generateVendorWhatsAppText,
  DTF_DIMENSIONS
} from '../gangSheetApi.js';

describe('Gang Sheet DTF 58cm & Pre-Press Services', () => {
  describe('calculateAccurateGangSheet', () => {
    it('should return zeroed values for empty inputs', () => {
      const result = calculateAccurateGangSheet([], []);
      expect(result.totalQty).toBe(0);
      expect(result.meters).toBe(0);
      expect(result.totalCost).toBe(0);
      expect(result.usedPct).toBe(0);
    });

    it('should calculate roll length accurately for A3 designs', () => {
      // 2 A3 designs: 1 row = 42 cm + 10 cm lead-in = 52 cm -> rounded to 1.0 m
      const orders = [
        { sku: 'TS-PRO-001', productName: 'Code & Coffee', size: 'A3 Punggung', qty: 2 }
      ];

      const result = calculateAccurateGangSheet(orders, []);
      expect(result.totalQty).toBe(2);
      expect(result.orderQty).toBe(2);
      expect(result.bufferQty).toBe(0);
      expect(result.usedCm).toBe(52); // 42 + 10
      expect(result.meters).toBe(1.0); // min 1 meter
      expect(result.rollCapacityCm).toBe(100);
      expect(result.remainingCm).toBe(48);
      expect(result.totalCost).toBe(30000); // 1.0m * 30000
    });

    it('should round to nearest 0.5 meter when exceeding 1.0m', () => {
      // 6 A3 designs: 3 rows = 3 * 42 = 126 cm + 10 cm = 136 cm -> rounded to 1.5m
      const orders = [
        { sku: 'TS-PRO-001', productName: 'Code & Coffee', size: 'A3', qty: 6 }
      ];

      const result = calculateAccurateGangSheet(orders, []);
      expect(result.usedCm).toBe(136);
      expect(result.meters).toBe(1.5);
      expect(result.totalCost).toBe(45000); // 1.5 * 30000
    });

    it('should correctly include buffer items and asset value', () => {
      const orders = [
        { sku: 'TS-PRO-001', productName: 'Code & Coffee', size: 'A3', qty: 2 }
      ];
      const buffers = [
        { sku: 'TS-RET-002', name: 'Retro Sunset', size: 'A3', qty: 2, unitCost: 14000 },
        { sku: 'ACC-LABEL-NECK', name: 'Neck Label', size: 'Kecil', qty: 8, unitCost: 1000 }
      ];

      const result = calculateAccurateGangSheet(orders, buffers);
      expect(result.orderQty).toBe(2);
      expect(result.bufferQty).toBe(10);
      expect(result.totalQty).toBe(12);
      // bufferAssetValue = (2 * 14000) + (8 * 1000) = 28000 + 8000 = 36000
      expect(result.bufferAssetValue).toBe(36000);
    });
  });

  describe('getGangSheetKpis', () => {
    it('should extract correct KPI card data', () => {
      const gangSheet = {
        totalQty: 10,
        orderQty: 4,
        bufferQty: 6,
        meters: 2.0,
        usedPct: 85,
        remainingCm: 30,
        totalCost: 60000,
        costPerPcs: 6000,
        bufferAssetValue: 72000,
        rate: 30000
      };

      const kpis = getGangSheetKpis(gangSheet);
      expect(kpis.totalQty).toBe(10);
      expect(kpis.meters).toBe(2.0);
      expect(kpis.totalCost).toBe(60000);
      expect(kpis.bufferAssetValue).toBe(72000);
      expect(kpis.usedPct).toBe(85);
    });
  });

  describe('exportGangSheetCutListCsv', () => {
    it('should generate valid Cut List CSV with UTF-8 BOM', () => {
      const gangSheet = {
        meters: 1.5,
        costPerPcs: 10000,
        orderItems: [
          { id: 'ORD-101', sku: 'TS-PRO-001', productName: 'Code & Coffee', size: 'A3', qty: 2, garment: 'NSA 24s', color: 'Hitam', status: 'dtf' }
        ],
        bufferItems: [
          { sku: 'TS-RET-002', name: 'Retro Sunset', size: 'A3', qty: 2, unitCost: 12000 }
        ]
      };

      const csv = exportGangSheetCutListCsv(gangSheet);
      expect(csv).toBeDefined();
      expect(csv).toContain('Order Konsumen');
      expect(csv).toContain('ORD-101');
      expect(csv).toContain('Buffer Stok Studio');
      expect(csv).toContain('TS-RET-002');
    });
  });

  describe('generateVendorWhatsAppText', () => {
    it('should produce readable vendor dispatch order format', () => {
      const gangSheet = {
        meters: 1.0,
        usedCm: 65,
        rollCapacityCm: 100,
        usedPct: 65,
        remainingCm: 35,
        totalCost: 30000,
        rate: 30000,
        orderItems: [
          { sku: 'TS-PRO-001', productName: 'Code', garment: 'NSA 24s', color: 'Hitam', size: 'L', qty: 1 }
        ],
        bufferItems: [
          { sku: 'TS-RET-002', name: 'Retro', size: 'A3', qty: 1 }
        ]
      };

      const text = generateVendorWhatsAppText(gangSheet);
      expect(text).toContain('ORDER CETAK DTF METERAN');
      expect(text).toContain('Lebar Roll: 60 cm (Area Efektif 58 cm');
      expect(text).toContain('1 Meter');
      expect(text).toContain('Rp 30.000');
      expect(text).toContain('TS-PRO-001');
      expect(text).toContain('TS-RET-002');
    });
  });
});
