import { describe, it, expect, beforeEach } from 'vitest';
import { 
  deductStock, 
  deductDtfFilm, 
  restockDtfFilm, 
  restockDtfBatch 
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
});
