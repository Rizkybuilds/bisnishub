import { describe, it, expect } from 'vitest';
import {
  validateProductionJobTransition,
  validateProductionJobCosts,
  PRODUCTION_MONEY_MAX,
} from './production';

describe('Production Job Domain Logic (MGBOS-012)', () => {
  describe('State Machine Transitions', () => {
    it('permits valid manufacturing transitions', () => {
      expect(validateProductionJobTransition('PLANNED', 'READY').valid).toBe(
        true,
      );
      expect(validateProductionJobTransition('READY', 'ASSIGNED').valid).toBe(
        true,
      );
      expect(
        validateProductionJobTransition('ASSIGNED', 'ACCEPTED').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('ACCEPTED', 'IN_PRODUCTION').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('IN_PRODUCTION', 'AWAITING_QC').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('AWAITING_QC', 'READY_FOR_HANDOFF')
          .valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('READY_FOR_HANDOFF', 'COMPLETED').valid,
      ).toBe(true);

      // Exceptions & Re-work
      expect(
        validateProductionJobTransition('AWAITING_QC', 'REWORK').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('AWAITING_QC', 'ON_HOLD').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('REWORK', 'IN_PRODUCTION').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('REWORK', 'AWAITING_QC').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('IN_PRODUCTION', 'ON_HOLD').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('ON_HOLD', 'IN_PRODUCTION').valid,
      ).toBe(true);
      expect(
        validateProductionJobTransition('PLANNED', 'CANCELLED').valid,
      ).toBe(true);
    });

    it('rejects invalid jumps and transitions from terminal states', () => {
      // Completed is terminal
      expect(
        validateProductionJobTransition('COMPLETED', 'IN_PRODUCTION').valid,
      ).toBe(false);
      expect(
        validateProductionJobTransition('COMPLETED', 'CANCELLED').valid,
      ).toBe(false);

      // Cancelled is terminal
      expect(validateProductionJobTransition('CANCELLED', 'READY').valid).toBe(
        false,
      );

      // Cannot skip directly from planned to completed
      expect(
        validateProductionJobTransition('PLANNED', 'COMPLETED').valid,
      ).toBe(false);
    });
  });

  describe('Cost Invariants', () => {
    it('accepts valid non-negative bigint costs', () => {
      const costs = validateProductionJobCosts(4500000n, 4400000n, 4400000n);
      expect(costs.estimatedCost).toBe(4500000n);
      expect(costs.committedCost).toBe(4400000n);
      expect(costs.actualCost).toBe(4400000n);
    });

    it('rejects negative or overflowing costs', () => {
      expect(() => validateProductionJobCosts(-100n)).toThrow(
        'Estimasi biaya produksi tidak valid',
      );
      expect(() => validateProductionJobCosts(100n, -50n)).toThrow(
        'Biaya komitmen produksi tidak valid',
      );
      expect(() => validateProductionJobCosts(100n, 100n, -1n)).toThrow(
        'Biaya aktual produksi tidak valid',
      );
      expect(() =>
        validateProductionJobCosts(PRODUCTION_MONEY_MAX + 1n),
      ).toThrow();
    });
  });
});
