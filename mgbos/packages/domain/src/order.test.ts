import { describe, it, expect } from 'vitest';
import {
  validateOrderTransition,
  validateOrderFinancials,
  ORDER_MONEY_MAX,
  formatOrderTypeLabel,
  calculateRetailOrderTotals,
} from './order';

describe('Order Domain Logic (MGBOS-011)', () => {
  describe('State Machine Transitions', () => {
    it('permits valid order lifecycle progressions', () => {
      expect(validateOrderTransition('DRAFT', 'CONFIRMED').valid).toBe(true);
      expect(validateOrderTransition('CONFIRMED', 'ACTIVE').valid).toBe(true);
      expect(validateOrderTransition('ACTIVE', 'COMPLETED').valid).toBe(true);
      expect(validateOrderTransition('ACTIVE', 'ON_HOLD').valid).toBe(true);
      expect(validateOrderTransition('ON_HOLD', 'ACTIVE').valid).toBe(true);
      expect(validateOrderTransition('CONFIRMED', 'CANCELLED').valid).toBe(
        true,
      );
      expect(validateOrderTransition('CONFIRMED', 'CONFIRMED').valid).toBe(
        true,
      );
    });

    it('rejects illegal transitions', () => {
      // Completed is terminal
      expect(validateOrderTransition('COMPLETED', 'ACTIVE').valid).toBe(false);
      expect(validateOrderTransition('COMPLETED', 'CANCELLED').valid).toBe(
        false,
      );

      // Cancelled is terminal
      expect(validateOrderTransition('CANCELLED', 'ACTIVE').valid).toBe(false);
      expect(validateOrderTransition('CANCELLED', 'CONFIRMED').valid).toBe(
        false,
      );

      // Cannot skip to completed directly from draft
      expect(validateOrderTransition('DRAFT', 'COMPLETED').valid).toBe(false);
    });
  });

  describe('Financial Invariants & Zero-Float Arithmetic', () => {
    it('calculates grand total and net profit accurately in bigint', () => {
      const subtotal = 6000000n; // 50 pcs @ 120.000
      const discount = 200000n;
      const shipping = 150000n;
      const cost = 3500000n;

      const result = validateOrderFinancials(
        subtotal,
        discount,
        shipping,
        cost,
      );

      expect(result.netProductRevenue).toBe(5800000n);
      expect(result.grandTotal).toBe(5950000n);
      expect(result.estimatedGrossProfit).toBe(2300000n);
      expect(result.shippingTotal).toBe(150000n);
    });

    it('isolates courier shipping from profit', () => {
      const result = validateOrderFinancials(1000000n, 0n, 500000n, 600000n);
      expect(result.estimatedGrossProfit).toBe(400000n); // exactly 1.000.000 - 600.000
      expect(result.grandTotal).toBe(1500000n);
    });

    it('rejects invalid, negative, or overflowing amounts', () => {
      expect(() => validateOrderFinancials(0n, 0n, 0n, 100n)).toThrow(
        'Subtotal pesanan harus lebih besar dari 0',
      );
      expect(() => validateOrderFinancials(1000n, 1000n, 0n, 500n)).toThrow(
        'Diskon tidak boleh melebihi atau sama dengan subtotal',
      );
      expect(() => validateOrderFinancials(1000n, 0n, 0n, 0n)).toThrow(
        'Estimasi HPP modal pesanan harus lebih besar dari 0',
      );
      expect(() =>
        validateOrderFinancials(ORDER_MONEY_MAX, 0n, 100n, 500n),
      ).toThrow('Grand total melebihi kapasitas integer batas maksimum');
    });
  });

  describe('Retail Direct Calculations', () => {
    it('calculates retail multi-item order totals correctly', () => {
      const items = [
        {
          quantity: 2,
          unitPrice: 75000n,
          discountTotal: 10000n,
          costPrice: 40000n,
        },
        {
          quantity: 3,
          unitPrice: 85000n,
          discountTotal: 0n,
          costPrice: 45000n,
        },
      ];
      const shipping = 20000n;

      const result = calculateRetailOrderTotals(items, shipping);
      // Item 1: 2 * 75.000 = 150.000, disc: 10.000, cost: 80.000
      // Item 2: 3 * 85.000 = 255.000, disc: 0, cost: 135.000
      // Subtotal = 405.000
      // Discount = 10.000
      // Net Revenue = 395.000
      // Grand Total = 395.000 + 20.000 = 415.000
      // Cost = 215.000
      // Gross Profit = 395.000 - 215.000 = 180.000
      expect(result.subtotal).toBe(405000n);
      expect(result.discountTotal).toBe(10000n);
      expect(result.netProductRevenue).toBe(395000n);
      expect(result.grandTotal).toBe(415000n);
      expect(result.estimatedCostTotal).toBe(215000n);
      expect(result.estimatedGrossProfit).toBe(180000n);
    });

    it('formats order type labels correctly', () => {
      expect(formatOrderTypeLabel('RETAIL_DIRECT')).toBe(
        'Penjualan Ritel Langsung (POS)',
      );
      expect(formatOrderTypeLabel('CUSTOM_B2B')).toBe('Custom Atelier (B2B)');
    });
  });
});
