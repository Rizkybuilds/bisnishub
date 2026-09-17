import { describe, it, expect, vi } from 'vitest';
import {
  calculateMultiUnitBalances,
  calculateUnitPnl,
  calculateRunwayAndBurnRate,
  calculateBusinessValuation,
  recordInterUnitTransfer,
  calculateLedgerSummary,
  WALLETS
} from '../ledgerApi';

describe('Treasury & Ledger Engine (ledgerApi.js)', () => {
  describe('calculateMultiUnitBalances() — Multi-Wallet Isolation', () => {
    it('mengisolasi saldo setiap dompet unit bisnis tanpa campur aduk', () => {
      const txs = [
        {
          id: 'tx-1',
          type: 'CAPITAL_INJECTION',
          category: 'capital_injection',
          amount: 10000000,
          sourceWallet: 'wallet_founder',
          destinationWallet: 'wallet_holding',
          businessUnit: 'holding',
          settlementStatus: 'cleared'
        },
        {
          id: 'tx-2',
          type: 'INTER_TRANSFER',
          category: 'inter_unit_transfer',
          amount: 3000000,
          sourceWallet: 'wallet_holding',
          destinationWallet: 'wallet_teestock',
          businessUnit: 'holding',
          settlementStatus: 'cleared'
        },
        {
          id: 'tx-3',
          type: 'CASH_OUT',
          category: 'blank_garment',
          amount: 1000000,
          sourceWallet: 'wallet_teestock',
          businessUnit: 'teestock',
          settlementStatus: 'cleared'
        },
        {
          id: 'tx-4',
          type: 'CASH_IN',
          category: 'b2b_packaging_dp',
          amount: 500000,
          destinationWallet: 'wallet_multigraph',
          businessUnit: 'multigraph',
          settlementStatus: 'cleared'
        }
      ];

      const balances = calculateMultiUnitBalances(txs);

      // Holding: +10M - 3M = 7M
      expect(balances.holding.balance).toBe(7000000);
      // TeeStock: +3M - 1M = 2M
      expect(balances.teestock.balance).toBe(2000000);
      // MultiGraph: +500K = 500K
      expect(balances.multigraph.balance).toBe(500000);
      // Founder: Injected 10M, Prive 0 -> netEquity 10M
      expect(balances.founder.netEquity).toBe(10000000);
      // Total Consolidated Holding Liquidity: 7M + 2M + 500K = 9.5M
      expect(balances.totalConsolidatedLiquidity).toBe(9500000);
    });
  });

  describe('calculateUnitPnl() — Laba Rugi per Unit Bisnis', () => {
    it('menghitung revenue, COGS, opex, dan net profit masing-masing unit', () => {
      const txs = [
        {
          id: 't-1',
          type: 'CASH_IN',
          category: 'sales_retail',
          amount: 2000000,
          businessUnit: 'teestock'
        },
        {
          id: 't-2',
          type: 'CASH_OUT',
          category: 'blank_garment',
          amount: 800000,
          businessUnit: 'teestock'
        },
        {
          id: 't-3',
          type: 'CASH_OUT',
          category: 'operational_expense',
          amount: 200000,
          businessUnit: 'teestock'
        },
        {
          id: 't-4',
          type: 'CASH_IN',
          category: 'b2b_packaging_dp',
          amount: 5000000,
          businessUnit: 'multigraph'
        },
        {
          id: 't-5',
          type: 'CASH_OUT',
          category: 'raw_materials_packaging',
          amount: 2000000,
          businessUnit: 'multigraph'
        }
      ];

      const teestockPnl = calculateUnitPnl(txs, 'teestock');
      const multigraphPnl = calculateUnitPnl(txs, 'multigraph');

      // TeeStock
      expect(teestockPnl.revenue).toBe(2000000);
      expect(teestockPnl.cogs).toBe(800000);
      expect(teestockPnl.grossProfit).toBe(1200000);
      expect(teestockPnl.opex).toBe(200000);
      expect(teestockPnl.netProfit).toBe(1000000);
      expect(teestockPnl.netMarginPercent).toBe(50); // 50%

      // MultiGraph
      expect(multigraphPnl.revenue).toBe(5000000);
      expect(multigraphPnl.cogs).toBe(2000000);
      expect(multigraphPnl.netProfit).toBe(3000000);
      expect(multigraphPnl.netMarginPercent).toBe(60); // 60%
    });
  });

  describe('calculateRunwayAndBurnRate() — CFO Cash Safety', () => {
    it('menghitung daily burn rate, monthly burn rate, dan cash runway secara aman', () => {
      const today = new Date().toISOString().slice(0, 10);
      const txs = [
        {
          id: 'b-1',
          type: 'CASH_OUT',
          category: 'operational_expense',
          amount: 3000000,
          date: today,
          createdAt: new Date().toISOString()
        }
      ];

      const runway = calculateRunwayAndBurnRate(txs, 9000000);
      expect(runway.dailyBurnRate).toBe(100000); // 3.000.000 / 30 = 100.000
      expect(runway.monthlyBurnRate).toBe(3000000);
      expect(runway.runwayMonths).toBeCloseTo(3.0, 0); // 9M / 3M = 3 bulan
    });
  });

  describe('calculateBusinessValuation() — Holding Valuation Engine', () => {
    it('menghitung valuasi dengan 3 metode terbobot (NAV, SDE, Revenue)', () => {
      const multiUnitBalances = {
        totalConsolidatedLiquidity: 20000000
      };
      const founderWealth = {
        netCashLiquidity: 20000000,
        totalInventoryValue: 15000000,
        fixedAssetsValue: 15000000,
        netFounderEquity: 10000000,
        totalPrive: 0
      };
      const teestockPnl = {
        revenue: 10000000,
        netProfit: 4000000
      };
      const multigraphPnl = {
        revenue: 5000000,
        netProfit: 2000000
      };

      const val = calculateBusinessValuation({
        founderWealth,
        multiUnitBalances,
        teestockPnl,
        multigraphPnl
      });

      // 1. NAV = Kas (20M) + Inventori (15M) + Fixed Assets (15M) = 50M
      expect(val.totalBookValueNAV).toBe(50000000);

      // 2. Revenue = 15M sample * 12 = 180M -> 180M * 1.5 = 270M
      expect(val.annualizedRevenue).toBe(180000000);
      expect(val.revenueValuation).toBe(270000000);

      // 3. SDE = 6M net profit * 12 = 72M -> 72M * 2.8 = 201.6M
      expect(val.annualizedSDE).toBe(72000000);
      expect(val.sdeValuation).toBe(201600000);

      // 4. Fair Enterprise Valuation = 40% NAV (20M) + 40% SDE (80.64M) + 20% Rev (54M) = 154.64M
      expect(val.fairEnterpriseValuation).toBe(154640000);

      // 5. Milestones
      expect(val.milestones.length).toBe(3);
      expect(val.milestones[0].achieved).toBe(true);
      expect(val.wealthGrowthRatio).toBeGreaterThan(1.0);
    });
  });

  describe('recordInterUnitTransfer() — Anti-Commingling Audit Trail', () => {
    it('mencatat transaksi transfer antar-unit dengan payload objek yang valid', async () => {
      const updated = await recordInterUnitTransfer({
        fromUnit: 'teestock',
        toUnit: 'multigraph',
        amount: 150000,
        description: 'Pembayaran kemasan unboxing pack',
        proofRef: 'TRANSFER-MG-001'
      });

      expect(Array.isArray(updated)).toBe(true);
      const newTx = updated[0];
      expect(newTx.type).toBe('INTER_TRANSFER');
      expect(newTx.sourceWallet).toBe('wallet_teestock');
      expect(newTx.destinationWallet).toBe('wallet_multigraph');
      expect(newTx.amount).toBe(150000);
      expect(newTx.businessUnit).toBe('teestock');
    });
  });
});
