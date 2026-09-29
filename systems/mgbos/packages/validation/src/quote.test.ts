import { it, expect } from 'vitest';
import { quoteMoneySchema, quoteCostSchema } from './quote';
it('returns validation failures for malformed or overflowing money without throwing', () => {
  for (const n of ['', '1.5', '-1', 'Rp 10', '9223372036854775808'])
    expect(quoteMoneySchema.safeParse(n).success).toBe(false);
  expect(quoteMoneySchema.safeParse('9223372036854775807').success).toBe(true);
});
it('rejects fractional component quantities and unrecognized costs', () => {
  expect(
    quoteCostSchema.safeParse({
      cost_type: 'GARMENT',
      description: 'Blank',
      quantity: 1.5,
      unit_cost: '10',
    }).success,
  ).toBe(false);
  expect(
    quoteCostSchema.safeParse({
      cost_type: 'UNKNOWN',
      description: 'Blank',
      quantity: 1,
      unit_cost: '10',
    }).success,
  ).toBe(false);
});
