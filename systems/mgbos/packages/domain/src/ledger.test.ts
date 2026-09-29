import { describe, it, expect } from 'vitest';
import {
  calculateNetProductRevenue,
  evaluateCostTrilogy,
  calculateRealizedGrossProfit,
  calculateRealizedMarginPct,
  getFinancialHealthStatus,
  verifyCourierPassThroughEscrow,
} from './ledger';

describe('MGBOS-016: Financial Ledger & Margin Realization Domain', () => {
  it('strictly isolates net product revenue from shipping fee', () => {
    const subtotal = 10_000_000n;
    const discount = 500_000n;
    const net = calculateNetProductRevenue(subtotal, discount);
    expect(net).toBe(9_500_000n);
  });

  it('correctly evaluates the Cost Trilogy (estimated -> committed -> actual)', () => {
    // 1. Only estimated
    const phase1 = evaluateCostTrilogy({ estimatedCost: 5_000_000n });
    expect(phase1.effectiveCost).toBe(5_000_000n);
    expect(phase1.isActualSettled).toBe(false);
    expect(phase1.variance).toBe(0n);

    // 2. Vendor committed
    const phase2 = evaluateCostTrilogy({
      estimatedCost: 5_000_000n,
      committedCost: 5_200_000n,
    });
    expect(phase2.effectiveCost).toBe(5_200_000n);
    expect(phase2.isActualSettled).toBe(false);
    expect(phase2.variance).toBe(200_000n);

    // 3. Final actual settled
    const phase3 = evaluateCostTrilogy({
      estimatedCost: 5_000_000n,
      committedCost: 5_200_000n,
      actualCost: 5_400_000n,
    });
    expect(phase3.effectiveCost).toBe(5_400_000n);
    expect(phase3.isActualSettled).toBe(true);
    expect(phase3.variance).toBe(200_000n); // variance against committed
  });

  it('computes realized gross profit and margin % accurately without floats', () => {
    const netRevenue = 10_000_000n;
    const effectiveCost = 6_000_000n;

    const profit = calculateRealizedGrossProfit(netRevenue, effectiveCost);
    expect(profit).toBe(4_000_000n);

    const marginPct = calculateRealizedMarginPct(netRevenue, effectiveCost);
    expect(marginPct).toBe(40.0);
    expect(getFinancialHealthStatus(marginPct)).toBe('HEALTHY');
  });

  it('classifies margin health tiers accurately', () => {
    expect(getFinancialHealthStatus(35.0)).toBe('HEALTHY');
    expect(getFinancialHealthStatus(30.0)).toBe('MODERATE');
    expect(getFinancialHealthStatus(22.5)).toBe('LOW_MARGIN');
    expect(getFinancialHealthStatus(18.0)).toBe('CRITICAL');
  });

  it('enforces courier pass-through escrow producing Rp 0 net margin', () => {
    const charged = 150_000n;
    const disbursed = 150_000n;
    const escrow = verifyCourierPassThroughEscrow(charged, disbursed);
    expect(escrow.netMargin).toBe(0n);
    expect(escrow.isBalanced).toBe(true);
    expect(escrow.discrepancy).toBe(0n);
  });
});
