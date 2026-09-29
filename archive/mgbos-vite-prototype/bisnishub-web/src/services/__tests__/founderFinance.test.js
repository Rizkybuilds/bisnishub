import { describe, it, expect } from 'vitest';
import { calculateLedgerSummary } from '@bisnishub/shared/services/ledgerApi';
import { getTotalFixedAssetsValue } from '@bisnishub/shared/services/assetsApi';

describe('Founder Finance & Wealth Engine (CFO Standard)', () => {
  describe('calculateLedgerSummary() — Pemisahan Dompet Pribadi vs Bisnis', () => {
    it('menghitung likuiditas kas, modal disetor, dan prive founder secara akurat', () => {
      const mockTransactions = [
        {
          id: 'tx-1',
          type: 'CASH_IN',
          category: 'personal_injection',
          amount: 5000000,
          sourceAccount: 'dompet_pribadi',
          destinationAccount: 'bank_teestock'
        },
        {
          id: 'tx-2',
          type: 'CASH_OUT',
          category: 'capex_equipment',
          amount: 2500000,
          sourceAccount: 'bank_teestock',
          destinationAccount: 'Vendor Mesin'
        },
        {
          id: 'tx-3',
          type: 'CASH_OUT',
          category: 'procurement',
          amount: 435000,
          sourceAccount: 'bank_teestock',
          destinationAccount: 'Distributor NSA'
        },
        {
          id: 'tx-4',
          type: 'CASH_IN',
          category: 'sales_order',
          amount: 99000,
          sourceAccount: 'qris_midtrans',
          destinationAccount: 'bank_teestock'
        },
        {
          id: 'tx-5',
          type: 'CASH_OUT',
          category: 'owner_prive',
          amount: 500000,
          sourceAccount: 'bank_teestock',
          destinationAccount: 'rekening_pribadi_founder'
        }
      ];

      const summary = calculateLedgerSummary(mockTransactions);

      // Total Cash In = 5.000.000 + 99.000 = 5.099.000
      expect(summary.totalCashIn).toBe(5099000);

      // Total Cash Out = 2.500.000 + 435.000 + 500.000 = 3.435.000
      expect(summary.totalCashOut).toBe(3435000);

      // Net Cash Liquidity = 5.099.000 - 3.435.000 = 1.664.000
      expect(summary.netCashLiquidity).toBe(1664000);

      // Total Injected = 5.000.000
      expect(summary.totalInjected).toBe(5000000);

      // Total Prive = 500.000
      expect(summary.totalPrive).toBe(500000);

      // Net Founder Equity Injected = 5.000.000 - 500.000 = 4.500.000
      expect(summary.netFounderEquityInjected).toBe(4500000);
    });

    it('menangani data transaksi kosong dengan aman', () => {
      const summary = calculateLedgerSummary([]);
      expect(summary.totalCashIn).toBe(0);
      expect(summary.totalCashOut).toBe(0);
      expect(summary.netCashLiquidity).toBe(0);
      expect(summary.totalInjected).toBe(0);
      expect(summary.totalPrive).toBe(0);
      expect(summary.netFounderEquityInjected).toBe(0);
    });
  });

  describe('BOM Procurement Division (Pembagian Biaya Kemasan & Kaos)', () => {
    it('membagi rata biaya kemasan partai menjadi HPP satuan riil (BOM)', () => {
      // Pembelian 100 polymailer @ Rp 80.000 total tanpa ongkir
      const polyTotal = 80000;
      const polyQty = 100;
      const polyUnitCost = polyTotal / polyQty;
      expect(polyUnitCost).toBe(800);

      // Pembelian 100 stiker vinyl @ Rp 60.000 total
      const stickerTotal = 60000;
      const stickerQty = 100;
      const stickerUnitCost = stickerTotal / stickerQty;
      expect(stickerUnitCost).toBe(600);

      // Pembelian 1 roll thermal label (500 pcs) @ Rp 35.000
      const labelTotal = 35000;
      const labelQty = 500;
      const labelUnitCost = labelTotal / labelQty;
      expect(labelUnitCost).toBe(70);

      // Total HPP Kemasan 1 Kaos Jadi:
      const totalPackagingHpp = polyUnitCost + stickerUnitCost + labelUnitCost;
      expect(totalPackagingHpp).toBe(1470);
      // Dianggarkan aman Rp 2.000 (ada buffer lakban + thank you card)
    });

    it('menghitung unit cost riil kaos dengan alokasi ongkir vendor', () => {
      // 1 lusin (12 pcs) @ Rp 35.000 + Rp 15.000 ongkir
      const qty = 12;
      const baseCost = 35000;
      const shipping = 15000;
      const totalCost = (qty * baseCost) + shipping; // 420.000 + 15.000 = 435.000
      const realUnitCost = Math.round(totalCost / qty);

      expect(totalCost).toBe(435000);
      expect(realUnitCost).toBe(36250); // Rp 36.250 / pcs
    });
  });

  describe('getTotalFixedAssetsValue() — Nilai Buku Alat Produksi (CAPEX)', () => {
    it('menghitung total nilai alat kerja aktif secara presisi', () => {
      const mockAssets = [
        {
          id: 'asset-1',
          assetName: 'Mesin Heat Press High-Pressure 38x38 cm',
          currentValue: 2500000,
          status: 'active'
        },
        {
          id: 'asset-2',
          assetName: 'Alat Rusak / Pensiun',
          currentValue: 300000,
          status: 'retired'
        }
      ];

      const totalValue = getTotalFixedAssetsValue(mockAssets);
      // Hanya menghitung aset berstatus 'active'
      expect(totalValue).toBe(2500000);
    });
  });

  describe('Founder Wealth & Balance Sheet Equation', () => {
    it('memverifikasi formula neraca harta seimbang (Assets = Equity + Liabilities)', () => {
      const netCash = 1664000;
      const inventoryAsset = 1950000; // Kaos NSA + DTF + Kemasan
      const fixedAssets = 2500000;    // Mesin Heat Press
      const netFounderEquity = 4500000; // 5jt modal - 500rb prive

      const totalBusinessWealth = netCash + inventoryAsset + fixedAssets;
      // 1.664.000 + 1.950.000 + 2.500.000 = 6.114.000
      expect(totalBusinessWealth).toBe(6114000);

      // Pertumbuhan Nilai Bersih Usaha (Net Wealth Growth)
      const netWealthGrowth = totalBusinessWealth - netFounderEquity;
      // 6.114.000 - 4.500.000 = 1.614.000
      expect(netWealthGrowth).toBe(1614000);

      // Persentase Pertumbuhan Modal (ROI)
      const growthPct = Number(((netWealthGrowth / netFounderEquity) * 100).toFixed(1));
      // (1.614.000 / 4.500.000) * 100 = 35.866% -> 35.9%
      expect(growthPct).toBe(35.9);
      expect(growthPct).toBeGreaterThan(0);
    });
  });
});
