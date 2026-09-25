import { describe, it, expect } from 'vitest';
import { quotePricing, QUOTE_MONEY_MAX } from './quote';
describe('Quote pricing exact integer rules', () => {
  it.each([
    [700000n, 'TARGET'],
    [750000n, 'CAUTION'],
    [800000n, 'WARNING'],
    [800001n, 'APPROVAL_REQUIRED'],
  ] as const)('classifies cost %s correctly', (cost, guard) =>
    expect(quotePricing(10, 100000n, 0n, 0n, cost).guard).toBe(guard),
  );
  it('excludes customer shipping from profit and guard', () => {
    const result = quotePricing(10, 100000n, 0n, 500000n, 900000n);
    expect(result.profit).toBe(100000n);
    expect(result.guard).toBe('APPROVAL_REQUIRED');
    expect(result.grandTotal).toBe(1500000n);
  });
  it('subtracts discount before margin', () =>
    expect(quotePricing(10, 100000n, 100000n, 0n, 800000n).guard).toBe(
      'APPROVAL_REQUIRED',
    ));
  it('rejects zero cost, zero net revenue, fractional quantity and overflowing totals', () => {
    expect(() => quotePricing(1, 10n, 0n, 0n, 0n)).toThrow();
    expect(() => quotePricing(1, 10n, 10n, 0n, 1n)).toThrow();
    expect(() => quotePricing(1.5, 10n, 0n, 0n, 1n)).toThrow();
    expect(() => quotePricing(2, QUOTE_MONEY_MAX, 0n, 0n, 1n)).toThrow();
  });
  it('retains exact values above JavaScript safe integers', () => {
    const n = 9007199254740993n;
    expect(quotePricing(1, n, 0n, 0n, 1n).revenue).toBe(n);
  });
});
