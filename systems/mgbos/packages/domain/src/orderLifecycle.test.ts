import { describe, it, expect } from 'vitest';
import {
  ORDER_STATUSES,
  validateOrderTransition,
  getAllowedOrderTransitions,
  isOrderTerminalState,
  evaluateOrderCompletionEligibility,
  formatOrderStatusLabel,
} from './order';

describe('Authoritative Order Lifecycle Domain Service (P0-02)', () => {
  describe('Canonical Transition Graph (AC-01, AC-02)', () => {
    it('allows valid progressions through the commercial lifecycle', () => {
      // DRAFT transitions
      expect(validateOrderTransition('DRAFT', 'CONFIRMED').valid).toBe(true);
      expect(validateOrderTransition('DRAFT', 'CANCELLED').valid).toBe(true);

      // CONFIRMED transitions
      expect(validateOrderTransition('CONFIRMED', 'ACTIVE').valid).toBe(true);
      expect(validateOrderTransition('CONFIRMED', 'ON_HOLD').valid).toBe(true);
      expect(validateOrderTransition('CONFIRMED', 'CANCELLED').valid).toBe(
        true,
      );

      // ACTIVE transitions
      expect(validateOrderTransition('ACTIVE', 'ON_HOLD').valid).toBe(true);
      expect(validateOrderTransition('ACTIVE', 'COMPLETED').valid).toBe(true);
      expect(validateOrderTransition('ACTIVE', 'CANCELLED').valid).toBe(true);

      // ON_HOLD transitions
      expect(validateOrderTransition('ON_HOLD', 'ACTIVE').valid).toBe(true);
      expect(validateOrderTransition('ON_HOLD', 'CANCELLED').valid).toBe(true);
    });

    it('rejects illegal transition progressions', () => {
      // Cannot skip directly from DRAFT to ACTIVE or COMPLETED
      expect(validateOrderTransition('DRAFT', 'ACTIVE').valid).toBe(false);
      expect(validateOrderTransition('DRAFT', 'COMPLETED').valid).toBe(false);
      expect(validateOrderTransition('DRAFT', 'ON_HOLD').valid).toBe(false);

      // Cannot skip directly from CONFIRMED to COMPLETED
      expect(validateOrderTransition('CONFIRMED', 'COMPLETED').valid).toBe(
        false,
      );

      // Cannot go backwards from ACTIVE to CONFIRMED or DRAFT
      expect(validateOrderTransition('ACTIVE', 'CONFIRMED').valid).toBe(false);
      expect(validateOrderTransition('ACTIVE', 'DRAFT').valid).toBe(false);

      // Cannot skip from ON_HOLD directly to COMPLETED or DRAFT
      expect(validateOrderTransition('ON_HOLD', 'COMPLETED').valid).toBe(false);
      expect(validateOrderTransition('ON_HOLD', 'DRAFT').valid).toBe(false);
    });

    it('permits idempotent self-transitions (no-op)', () => {
      for (const status of ORDER_STATUSES) {
        expect(validateOrderTransition(status, status).valid).toBe(true);
      }
    });

    it('provides accurate allowed transitions via getAllowedOrderTransitions', () => {
      expect(getAllowedOrderTransitions('DRAFT')).toEqual([
        'CONFIRMED',
        'CANCELLED',
      ]);
      expect(getAllowedOrderTransitions('CONFIRMED')).toEqual([
        'ACTIVE',
        'ON_HOLD',
        'CANCELLED',
      ]);
      expect(getAllowedOrderTransitions('ACTIVE')).toEqual([
        'ON_HOLD',
        'COMPLETED',
        'CANCELLED',
      ]);
      expect(getAllowedOrderTransitions('ON_HOLD')).toEqual([
        'ACTIVE',
        'CANCELLED',
      ]);
      expect(getAllowedOrderTransitions('COMPLETED')).toEqual([]);
      expect(getAllowedOrderTransitions('CANCELLED')).toEqual([]);
    });
  });

  describe('Terminal State Protection (AC-03, AC-04)', () => {
    it('identifies COMPLETED and CANCELLED as terminal states', () => {
      expect(isOrderTerminalState('COMPLETED')).toBe(true);
      expect(isOrderTerminalState('CANCELLED')).toBe(true);
      expect(isOrderTerminalState('ACTIVE')).toBe(false);
      expect(isOrderTerminalState('CONFIRMED')).toBe(false);
      expect(isOrderTerminalState('ON_HOLD')).toBe(false);
      expect(isOrderTerminalState('DRAFT')).toBe(false);
    });

    it('forbids COMPLETED from transitioning to any different state', () => {
      const targets = ORDER_STATUSES.filter((s) => s !== 'COMPLETED');
      for (const target of targets) {
        const result = validateOrderTransition('COMPLETED', target);
        expect(result.valid).toBe(false);
      }
    });

    it('forbids CANCELLED from transitioning to any different state', () => {
      const targets = ORDER_STATUSES.filter((s) => s !== 'CANCELLED');
      for (const target of targets) {
        const result = validateOrderTransition('CANCELLED', target);
        expect(result.valid).toBe(false);
      }
    });
  });

  describe('Completion Guard Evaluation (AC-07, AC-08)', () => {
    it('grants completion eligibility when all obligations are fulfilled', () => {
      const result = evaluateOrderCompletionEligibility({
        openProductionJobsCount: 0,
        openShipmentsCount: 0,
        unpaidInvoicesCount: 0,
      });

      expect(result.eligible).toBe(true);
      expect(result.blockingReasons).toHaveLength(0);
    });

    it('blocks completion when open production jobs remain', () => {
      const result = evaluateOrderCompletionEligibility({
        openProductionJobsCount: 2,
        openShipmentsCount: 0,
        unpaidInvoicesCount: 0,
      });

      expect(result.eligible).toBe(false);
      expect(result.blockingReasons[0]).toContain(
        '2 pekerjaan produksi (SPK) yang belum selesai',
      );
    });

    it('blocks completion when open shipments remain', () => {
      const result = evaluateOrderCompletionEligibility({
        openProductionJobsCount: 0,
        openShipmentsCount: 1,
        unpaidInvoicesCount: 0,
      });

      expect(result.eligible).toBe(false);
      expect(result.blockingReasons[0]).toContain(
        '1 surat jalan / pengiriman yang belum terkirim',
      );
    });

    it('blocks completion when unpaid invoices remain', () => {
      const result = evaluateOrderCompletionEligibility({
        openProductionJobsCount: 0,
        openShipmentsCount: 0,
        unpaidInvoicesCount: 3,
      });

      expect(result.eligible).toBe(false);
      expect(result.blockingReasons[0]).toContain(
        '3 faktur komersial yang belum lunas',
      );
    });

    it('accumulates multiple blocking reasons when multiple obligations remain', () => {
      const result = evaluateOrderCompletionEligibility({
        openProductionJobsCount: 1,
        openShipmentsCount: 2,
        unpaidInvoicesCount: 1,
      });

      expect(result.eligible).toBe(false);
      expect(result.blockingReasons).toHaveLength(3);
    });
  });

  describe('Order Status Labels', () => {
    it('formats human-readable labels for all order statuses', () => {
      expect(formatOrderStatusLabel('DRAFT')).toBe('Draf');
      expect(formatOrderStatusLabel('CONFIRMED')).toBe(
        'Terkonfirmasi (Kontrak Sah)',
      );
      expect(formatOrderStatusLabel('ACTIVE')).toBe('Sedang Berjalan (Aktif)');
      expect(formatOrderStatusLabel('ON_HOLD')).toBe('Ditahan (On Hold)');
      expect(formatOrderStatusLabel('COMPLETED')).toBe('Selesai (Completed)');
      expect(formatOrderStatusLabel('CANCELLED')).toBe(
        'Dibatalkan (Cancelled)',
      );
    });
  });
});
