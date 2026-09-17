import { describe, it, expect, beforeEach } from 'vitest';
import { 
  deductStock, 
  deductDtfFilm, 
  restockDtfFilm, 
  restockDtfBatch,
  restockBlankGarment,
  restockSupplyItem,
  adjustStockOpname,
  calculateInventoryStats
} from '../inventoryApi';

describe('Inventory Stock Engine (inventoryApi.js)', () => {
  let mockMatrix;

  beforeEach(() => {
    mockMatrix = {
      nsa_softstyle_30s: {
        Hitam: { S: 4, M: 8, L: 10, XL: 6 }
      },
      dtf_films: {
        'TS-PRO-001': { name: 'Commit & Pray', ready: 5, min: 2, unitCost: 12000 }
      }
    };
  });

  describe('deductStock() — Pemotongan Kaos Polos NSA', () => {
    it('mengurangi jumlah stok garmen dengan benar', () => {
      const result = deductStock(mockMatrix, 'nsa_softstyle_30s', 'Hitam', 'L', 3);
      expect(result.nsa_softstyle_30s.Hitam.L).toBe(7);
    });

    it('tidak membuat stok menjadi negatif jika potongan melebihi stok yang ada', () => {
      const result = deductStock(mockMatrix, 'nsa_softstyle_30s', 'Hitam', 'S', 10);
      expect(result.nsa_softstyle_30s.Hitam.S).toBe(0);
    });

    it('tidak mengubah state jika key garmen atau ukuran tidak ditemukan', () => {
      const result = deductStock(mockMatrix, 'nsa_softstyle_30s', 'Hitam', 'XXL', 2);
      expect(result.nsa_softstyle_30s.Hitam.L).toBe(10);
    });
  });

  describe('deductDtfFilm() — Pemotongan Lembar Film DTF Studio', () => {
    it('mengurangi lembar film DTF untuk SKU yang bersangkutan', () => {
      const result = deductDtfFilm(mockMatrix, 'TS-PRO-001', 2);
      expect(result.dtf_films['TS-PRO-001'].ready).toBe(3);
    });

    it('tidak membuat lembar film DTF menjadi negatif', () => {
      const result = deductDtfFilm(mockMatrix, 'TS-PRO-001', 10);
      expect(result.dtf_films['TS-PRO-001'].ready).toBe(0);
    });
  });

  describe('restockDtfFilm() — Penambahan Stok Film Satuan', () => {
    it('menambahkan lembar film DTF yang sudah terdaftar', () => {
      const result = restockDtfFilm(mockMatrix, 'TS-PRO-001', 4);
      expect(result.dtf_films['TS-PRO-001'].ready).toBe(9);
    });

    it('membuat entri film baru jika SKU belum pernah tercatat sebelumnya', () => {
      const result = restockDtfFilm(mockMatrix, 'TS-NEW-099', 5, 12500, 'New Design');
      expect(result.dtf_films['TS-NEW-099'].ready).toBe(5);
      expect(result.dtf_films['TS-NEW-099'].unitCost).toBe(12500);
      expect(result.dtf_films['TS-NEW-099'].name).toBe('New Design');
    });
  });

  describe('restockDtfBatch() — Restok Multi-Item dari Gang Sheet Builder', () => {
    it('menambah stok film untuk beberapa SKU sekaligus', () => {
      const batch = [
        { sku: 'TS-PRO-001', qty: 3, unitCost: 11000 },
        { sku: 'TS-KOM-001', qty: 2, unitCost: 11000, name: '7 Summits' }
      ];

      const result = restockDtfBatch(mockMatrix, batch);
      expect(result.dtf_films['TS-PRO-001'].ready).toBe(8); // 5 + 3
      expect(result.dtf_films['TS-KOM-001'].ready).toBe(2);
      expect(result.dtf_films['TS-KOM-001'].name).toBe('7 Summits');
    });
  });

  describe('restockBlankGarment() — Restok Otomatis dari Pengadaan Bahan NSA', () => {
    it('menambahkan stok NSA 24s L Hitam sebesar 12 pcs ke matriks', () => {
      const result = restockBlankGarment(mockMatrix, 'nsa_heavyweight_24s', 'Hitam', 'L', 12);
      expect(result.nsa_heavyweight_24s.Hitam.L).toBe(12);
    });

    it('mengakumulasi stok NSA 30s L Hitam yang sudah ada sebelumnya', () => {
      // Sebelumnya L = 10
      const result = restockBlankGarment(mockMatrix, 'nsa_softstyle_30s', 'Hitam', 'L', 12);
      expect(result.nsa_softstyle_30s.Hitam.L).toBe(22); // 10 + 12
    });

    it('menambahkan warna atau varian baru secara aman', () => {
      const result = restockBlankGarment(mockMatrix, 'nsa_softstyle_30s', 'Putih', 'L', 12);
      expect(result.nsa_softstyle_30s.Putih.L).toBe(12);
    });
  });

  describe('restockSupplyItem() — Restok Otomatis Kemasan & Material', () => {
    it('menambahkan stok polymailer 48 pcs', () => {
      const result = restockSupplyItem(mockMatrix, 'polymailer', 48);
      expect(result.supplies.polymailer).toBe(48);
    });

    it('menambahkan stok sticker 35 pcs', () => {
      const result = restockSupplyItem(mockMatrix, 'sticker', 35);
      expect(result.supplies.sticker).toBe(35);
    });

    it('mengakumulasi stok kemasan jika sebelumnya sudah ada nilai stok', () => {
      mockMatrix.supplies = { polymailer: 10 };
      const result = restockSupplyItem(mockMatrix, 'polymailer', 48);
      expect(result.supplies.polymailer).toBe(58); // 10 + 48
    });
  });

  describe('adjustStockOpname() — Penyesuaian Fisik Terotorisasi (Anti-Bocor)', () => {
    it('menyesuaikan stok kaos polos NSA Hitam L menjadi hasil hitung fisik', () => {
      // Mock awal: Hitam L = 10
      const { updatedMatrix, opnameLog } = adjustStockOpname(mockMatrix, {
        itemType: 'blank_tshirt',
        garmentKey: 'nsa_softstyle_30s',
        color: 'Hitam',
        size: 'L',
        actualQty: 8,
        reason: 'Selisih 2 pcs display studio',
        adminName: 'Rizky Founder'
      });

      expect(updatedMatrix.nsa_softstyle_30s.Hitam.L).toBe(8);
      expect(opnameLog.previousQty).toBe(10);
      expect(opnameLog.actualQty).toBe(8);
      expect(opnameLog.diffQty).toBe(-2);
      expect(opnameLog.reason).toBe('Selisih 2 pcs display studio');
    });

    it('menyesuaikan lembar film DTF ready dan mencatat dampak finansial', () => {
      // Mock awal: TS-PRO-001 ready = 5, unitCost = 12000
      const { updatedMatrix, opnameLog } = adjustStockOpname(mockMatrix, {
        itemType: 'dtf_film',
        sku: 'TS-PRO-001',
        actualQty: 7,
        reason: 'Temuan sisa potongan gang sheet'
      });

      expect(updatedMatrix.dtf_films['TS-PRO-001'].ready).toBe(7);
      expect(opnameLog.previousQty).toBe(5);
      expect(opnameLog.diffQty).toBe(2);
      expect(opnameLog.financialImpact).toBe(24000); // 2 * 12000
    });
  });

  describe('calculateInventoryStats() — Metrik Eksekutif Inventori', () => {
    it('menghitung total pcs, valuasi aset, dan SKU kritis secara akurat', () => {
      const stats = calculateInventoryStats(mockMatrix);
      // Kaos: S:4, M:8, L:10, XL:6 = 28 pcs
      expect(stats.totalBlankGarmentPcs).toBe(28);
      // DTF: 5 lembar @ 12000 = 60000
      expect(stats.totalDtfSheets).toBe(5);
      expect(stats.totalDtfAssetValue).toBe(60000);
      expect(stats.totalInventoryValue).toBeGreaterThan(60000);
    });
  });
});

