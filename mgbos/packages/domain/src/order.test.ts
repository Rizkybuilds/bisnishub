import { describe, it, expect } from 'vitest';
import {
  validateOrderTransition,
  validateOrderFinancials,
  ORDER_MONEY_MAX,
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
});
