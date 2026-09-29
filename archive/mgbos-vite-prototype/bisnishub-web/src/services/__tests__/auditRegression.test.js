import { describe, it, expect } from 'vitest';
import { calculateBusinessValuation, calculateUnitPnl } from '@bisnishub/shared/services/ledgerApi';
describe('Audit financial regressions', () => {
 it('does not invent valuation or growth without business data', () => {
  const result = calculateBusinessValuation({});
  expect(result.fairEnterpriseValuation).toBe(0);
  expect(result.wealthGrowthPercent).toBe(0);
  expect(result.milestones.some(m => m.achieved)).toBe(false);
 });
 it('keeps internal treasury transfers out of operating expenses', () => {
  const result = calculateUnitPnl([{businessUnit:'teestock',type:'INTER_TRANSFER',category:'inter_unit_transfer',amount:100000}]);
  expect(result.netProfit).toBe(0);
  expect(result.opex).toBe(0);
 });
 it('separates posted courier funds and unsettled receipts from sales', () => {
  const base={businessUnit:'teestock',type:'CASH_IN'};
  const result=calculateUnitPnl([
   {...base,category:'sales_retail',amount:100000},
   {...base,category:'shipping_escrow',amount:10000},
   {...base,category:'unique_code',amount:123},
   {...base,category:'sales_retail',amount:200000,settlementStatus:'pending'},
   {...base,type:'CASH_OUT',category:'courier_shipping',amount:10000}
  ]);
  expect(result.revenue).toBe(100000);
  expect(result.cogs).toBe(0);
 });
});
