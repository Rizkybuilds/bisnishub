import { describe, it, expect, beforeEach } from 'vitest';
import { restockGarmentBatch, restockSupplyItem, restockDtfFilm } from '@bisnishub/shared/services/inventoryApi';
import { calculateUnitPnl, calculateMultiUnitBalances } from '@bisnishub/shared/services/ledgerApi';

describe('Smart Procurement & Batch Inventory Intake Engine', () => {
  let mockMatrix;

  beforeEach(() => {
    mockMatrix = {
      nsa_heavyweight_24s: {
        Hitam: { S: 0, M: 2, L: 4, XL: 0 },
        Putih: { S: 1, M: 1, L: 2, XL: 1 }
      },
      supplies: {
        sticker: 50,
        polymailer: 30
      }
    };
  });

  describe('restockGarmentBatch() — Belanja Grosir Kaos Polos Campur (Wholesale Matrix)', () => {
    it('mengupdate stok banyak ukuran dan warna sekaligus dalam 1 nota pengadaan (72 pcs mix)', () => {
      const wholesaleBreakdown = [
        { color: 'Hitam', size: 'S', qty: 6, landedUnitCost: 40625 },
        { color: 'Hitam', size: 'M', qty: 12, landedUnitCost: 40625 },
        { color: 'Hitam', size: 'L', qty: 12, landedUnitCost: 40625 },
        { color: 'Hitam', size: 'XL', qty: 6, landedUnitCost: 40625 },
        { color: 'Putih', size: 'S', qty: 6, landedUnitCost: 40625 },
        { color: 'Putih', size: 'M', qty: 12, landedUnitCost: 40625 },
        { color: 'Putih', size: 'L', qty: 12, landedUnitCost: 40625 },
        { color: 'Putih', size: 'XL', qty: 6, landedUnitCost: 40625 }
      ];

      const totalPcs = wholesaleBreakdown.reduce((sum, i) => sum + i.qty, 0);
      expect(totalPcs).toBe(72);

      const result = restockGarmentBatch(mockMatrix, 'nsa_heavyweight_24s', wholesaleBreakdown);

      // Verifikasi stok bertambah secara akurat di seluruh kombinasi warna dan size
      expect(result.nsa_heavyweight_24s.Hitam.S).toBe(6); // 0 + 6
      expect(result.nsa_heavyweight_24s.Hitam.M).toBe(14); // 2 + 12
      expect(result.nsa_heavyweight_24s.Hitam.L).toBe(16); // 4 + 12
      expect(result.nsa_heavyweight_24s.Hitam.XL).toBe(6); // 0 + 6
      expect(result.nsa_heavyweight_24s.Putih.S).toBe(7); // 1 + 6
      expect(result.nsa_heavyweight_24s.Putih.M).toBe(13); // 1 + 12
      expect(result.nsa_heavyweight_24s.Putih.L).toBe(14); // 2 + 12
      expect(result.nsa_heavyweight_24s.Putih.XL).toBe(7); // 1 + 6
    });

    it('menghitung Landed Cost per pcs dengan akurat termasuk ongkos kirim cargo', () => {
      const qtyKaos = 72;
      const hargaKaosPerPcs = 40000;
      const ongkirCargo = 45000;

      const subtotalKaos = qtyKaos * hargaKaosPerPcs; // Rp 2.880.000
      const totalInvoiced = subtotalKaos + ongkirCargo; // Rp 2.925.000
      const landedCostPerPcs = Math.round(totalInvoiced / qtyKaos);

      expect(subtotalKaos).toBe(2880000);
      expect(totalInvoiced).toBe(2925000);
      expect(landedCostPerPcs).toBe(40625); // Rp 40.625 / pcs
    });
  });

  describe('Outsource Sticker A3+ Yield Calculator (MultiGraph belum running)', () => {
    it('mengonversi lembaran cetak A3+ vendor luar ke pcs stiker fisik unboxing', () => {
      const sheetQty = 10; // 10 lembar A3+
      const costPerSheet = 15000; // Rp 15.000 / lembar (incl laminasi & die-cut)
      const yieldPerSheet = 24; // 24 pcs per lembar A3+
      const shippingOjol = 12000; // Rp 12.000 ongkir

      const totalStikerYield = sheetQty * yieldPerSheet; // 240 pcs stiker jadi
      const totalCost = (sheetQty * costPerSheet) + shippingOjol; // Rp 162.000
      const realCostPerSticker = Math.round(totalCost / totalStikerYield); // Rp 675 / pcs

      expect(totalStikerYield).toBe(240);
      expect(totalCost).toBe(162000);
      expect(realCostPerSticker).toBe(675);

      // Verifikasi update stok stiker
      const result = restockSupplyItem(mockMatrix, 'sticker', totalStikerYield);
      expect(result.supplies.sticker).toBe(290); // 50 + 240
    });
  });

  describe('Packaging Multi-Unit Converter (Lusin & Pack)', () => {
    it('mengonversi pembelian 2 lusin polymailer menjadi 24 pcs dengan landed cost presisi', () => {
      const supplyUnitCount = 2; // 2 lusin
      const multiplier = 12; // 1 lusin = 12 pcs
      const totalPcs = supplyUnitCount * multiplier; // 24 pcs
      const hargaBeli = 28000;
      const ongkir = 10000;
      const totalTagihan = hargaBeli + ongkir; // Rp 38.000
      const hppPerLembar = Math.round(totalTagihan / totalPcs);

      expect(totalPcs).toBe(24);
      expect(totalTagihan).toBe(38000);
      expect(hppPerLembar).toBe(1583); // Rp 1.583 / lembar

      // Verifikasi update stok polymailer
      const result = restockSupplyItem(mockMatrix, 'polymailer', totalPcs);
      expect(result.supplies.polymailer).toBe(54); // 30 + 24
    });
  });

  describe('Audit Sinkronisasi Pencatatan & Pelaporan Keuangan (CFO Audit)', () => {
    it('memastikan pengadaan Roll DTF meteran ter-restock dengan landed cost presisi', () => {
      const dtfMeters = 10;
      const meterPrice = 30000;
      const shippingCost = 15000;
      const totalCost = (dtfMeters * meterPrice) + shippingCost; // Rp 315.000
      const landedPerMeter = Math.round(totalCost / dtfMeters); // Rp 31.500

      expect(totalCost).toBe(315000);
      expect(landedPerMeter).toBe(31500);

      const result = restockDtfFilm(mockMatrix, 'DTF-ROLL-58CM', dtfMeters, landedPerMeter, 'Roll Film DTF 58cm');
      expect(result.dtf_films['DTF-ROLL-58CM'].ready).toBe(10);
      expect(result.dtf_films['DTF-ROLL-58CM'].unitCost).toBe(31500);
    });

    it('memastikan seluruh kategori pengadaan masuk sebagai COGS (HPP) bukan OPEX dalam Laba Rugi', () => {
      const procurementTxs = [
        {
          id: 'tx-po-01',
          type: 'CASH_OUT',
          category: 'blank_garment', // Kaos NSA
          amount: 2925000,
          businessUnit: 'teestock'
        },
        {
          id: 'tx-po-02',
          type: 'CASH_OUT',
          category: 'dtf_printing', // DTF Roll
          amount: 315000,
          businessUnit: 'teestock'
        },
        {
          id: 'tx-po-03',
          type: 'CASH_OUT',
          category: 'unboxing_packaging', // Stiker & Polymailer
          amount: 200000,
          businessUnit: 'teestock'
        },
        {
          id: 'tx-po-04',
          type: 'CASH_OUT',
          category: 'procurement', // Fallback procurement
          amount: 100000,
          businessUnit: 'teestock'
        },
        {
          id: 'tx-rev-01',
          type: 'CASH_IN',
          category: 'sales_retail',
          amount: 6000000,
          businessUnit: 'teestock'
        }
      ];

      const pnl = calculateUnitPnl(procurementTxs, 'teestock');

      // Total Belanja Pengadaan: 2.925.000 + 315.000 + 200.000 + 100.000 = 3.540.000
      expect(pnl.cogs).toBe(3540000);
      // OPEX harus 0 karena seluruh transaksi di atas adalah HPP Bahan Baku
      expect(pnl.opex).toBe(0);
      // Laba Kotor: 6.000.000 - 3.540.000 = 2.460.000
      expect(pnl.grossProfit).toBe(2460000);
      expect(pnl.netProfit).toBe(2460000);
    });

    it('memastikan pemotongan kas mengisolasi wallet sesuai paymentSource (TeeStock vs Holding vs Founder)', () => {
      const txs = [
        // 1. Injeksi modal awal founder ke holding 10M & ke teestock 5M
        {
          id: 'tx-cap-1',
          type: 'CAPITAL_INJECTION',
          category: 'capital_injection',
          amount: 10000000,
          destinationWallet: 'wallet_holding',
          businessUnit: 'holding',
          settlementStatus: 'cleared'
        },
        {
          id: 'tx-cap-2',
          type: 'CAPITAL_INJECTION',
          category: 'capital_injection',
          amount: 5000000,
          destinationWallet: 'wallet_teestock',
          businessUnit: 'teestock',
          settlementStatus: 'cleared'
        },
        // 2. Pengadaan dibayar dari Holding Treasury
        {
          id: 'tx-po-holding',
          type: 'CASH_OUT',
          category: 'blank_garment',
          amount: 2000000,
          sourceWallet: 'wallet_holding',
          businessUnit: 'holding',
          settlementStatus: 'cleared'
        },
        // 3. Pengadaan dibayar dari Kas Operasional TeeStock
        {
          id: 'tx-po-teestock',
          type: 'CASH_OUT',
          category: 'dtf_printing',
          amount: 1000000,
          sourceWallet: 'wallet_teestock',
          businessUnit: 'teestock',
          settlementStatus: 'cleared'
        }
      ];

      const balances = calculateMultiUnitBalances(txs);

      // Holding: 10.000.000 - 2.000.000 = 8.000.000
      expect(balances.holding.balance).toBe(8000000);
      // TeeStock: 5.000.000 - 1.000.000 = 4.000.000
      expect(balances.teestock.balance).toBe(4000000);
      // Total Konsolidasi: 8M + 4M = 12M
      expect(balances.totalConsolidatedLiquidity).toBe(12000000);
    });
  });
});
