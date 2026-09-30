import { describe, it, expect } from 'vitest';
import {
  canTransitionShipment,
  calculateShipmentAllocation,
  validateFulfillmentReadiness,
  OrderItemAllocationContext,
  RequestedShipmentItem,
  ProductionReadinessContext,
} from './shipment';

describe('Shipment Domain Service (MGBOS-017 / TS-PLAN-06)', () => {
  describe('canTransitionShipment', () => {
    it('allows valid transitions in standard fulfillment lifecycle', () => {
      expect(canTransitionShipment('DRAFT', 'READY_TO_DISPATCH')).toBe(true);
      expect(canTransitionShipment('READY_TO_DISPATCH', 'DISPATCHED')).toBe(
        true,
      );
      expect(canTransitionShipment('DISPATCHED', 'IN_TRANSIT')).toBe(true);
      expect(canTransitionShipment('DISPATCHED', 'DELIVERED')).toBe(true);
      expect(canTransitionShipment('IN_TRANSIT', 'DELIVERED')).toBe(true);
    });

    it('blocks illegal backward or bypass transitions', () => {
      expect(canTransitionShipment('DRAFT', 'DELIVERED')).toBe(false);
      expect(canTransitionShipment('READY_TO_DISPATCH', 'DELIVERED')).toBe(
        false,
      );
      expect(canTransitionShipment('DELIVERED', 'DISPATCHED')).toBe(false);
      expect(canTransitionShipment('CANCELLED', 'READY_TO_DISPATCH')).toBe(
        false,
      );
    });

    it('allows same-state idempotency', () => {
      expect(canTransitionShipment('DISPATCHED', 'DISPATCHED')).toBe(true);
      expect(canTransitionShipment('DELIVERED', 'DELIVERED')).toBe(true);
    });
  });

  describe('calculateShipmentAllocation', () => {
    const contextItems: OrderItemAllocationContext[] = [
      {
        orderItemId: 'item-1',
        description: 'Tee Black Heavyweight',
        orderedQuantity: 100,
        previouslyShippedQuantity: 0,
      },
      {
        orderItemId: 'item-2',
        description: 'Tee White Oversized',
        orderedQuantity: 50,
        previouslyShippedQuantity: 20, // 30 remaining
      },
    ];

    it('calculates partial shipment allocation correctly', () => {
      const requested: RequestedShipmentItem[] = [
        { orderItemId: 'item-1', quantity: 60 },
        { orderItemId: 'item-2', quantity: 30 },
      ];

      const result = calculateShipmentAllocation(contextItems, requested);
      expect(result.isValid).toBe(true);
      expect(result.totalRequestedQty).toBe(90);
      expect(result.items[0]?.remainingAfterShipment).toBe(40);
      expect(result.items[1]?.remainingAfterShipment).toBe(0);
      expect(result.isFullyFulfilled).toBe(false); // 20 + 90 = 110 out of 150
      expect(result.fulfillmentPercentage).toBe(73.33);
    });

    it('detects 100% full fulfillment', () => {
      const requested: RequestedShipmentItem[] = [
        { orderItemId: 'item-1', quantity: 100 },
        { orderItemId: 'item-2', quantity: 30 },
      ];

      const result = calculateShipmentAllocation(contextItems, requested);
      expect(result.isValid).toBe(true);
      expect(result.isFullyFulfilled).toBe(true);
      expect(result.fulfillmentPercentage).toBe(100);
    });

    it('rejects requested quantity exceeding remaining unshipped quota', () => {
      const requested: RequestedShipmentItem[] = [
        { orderItemId: 'item-2', quantity: 35 }, // Only 30 remaining!
      ];

      const result = calculateShipmentAllocation(contextItems, requested);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('melebihi sisa kuota');
    });

    it('rejects empty requested items or zero quantity', () => {
      expect(calculateShipmentAllocation(contextItems, []).isValid).toBe(false);
      expect(
        calculateShipmentAllocation(contextItems, [
          { orderItemId: 'item-1', quantity: 0 },
        ]).isValid,
      ).toBe(false);
    });
  });

  describe('validateFulfillmentReadiness (P0-05)', () => {
    const orderId = 'order-uuid-1';
    const item1 = 'item-uuid-1';
    const item2 = 'item-uuid-2';

    it('passes when all relevant active jobs are READY_FOR_HANDOFF with clean QC (AC-01)', () => {
      const jobs: ProductionReadinessContext[] = [
        {
          jobId: 'job-1',
          jobNumber: 'TS-J-01',
          orderId,
          orderItemId: item1,
          status: 'READY_FOR_HANDOFF',
          latestQcResult: 'PASS',
        },
        {
          jobId: 'job-2',
          jobNumber: 'TS-J-02',
          orderId,
          orderItemId: item2,
          status: 'COMPLETED',
          latestQcResult: 'PASS',
        },
      ];

      const res = validateFulfillmentReadiness(orderId, [item1, item2], jobs);
      expect(res.isReady).toBe(true);
      expect(res.blockingReasons).toHaveLength(0);
    });

    it('blocks shipment when a job is still IN_PRODUCTION (AC-02)', () => {
      const jobs: ProductionReadinessContext[] = [
        {
          jobId: 'job-1',
          jobNumber: 'TS-J-01',
          orderId,
          orderItemId: item1,
          status: 'IN_PRODUCTION',
        },
      ];

      const res = validateFulfillmentReadiness(orderId, [item1], jobs);
      expect(res.isReady).toBe(false);
      expect(res.blockingReasons[0]).toContain('masih berstatus IN_PRODUCTION');
    });

    it('blocks shipment when a job is AWAITING_QC (AC-03)', () => {
      const jobs: ProductionReadinessContext[] = [
        {
          jobId: 'job-1',
          jobNumber: 'TS-J-01',
          orderId,
          orderItemId: item1,
          status: 'AWAITING_QC',
        },
      ];

      const res = validateFulfillmentReadiness(orderId, [item1], jobs);
      expect(res.isReady).toBe(false);
      expect(res.blockingReasons[0]).toContain('masih berstatus AWAITING_QC');
    });

    it('blocks shipment when a job is in REWORK (AC-04)', () => {
      const jobs: ProductionReadinessContext[] = [
        {
          jobId: 'job-1',
          jobNumber: 'TS-J-01',
          orderId,
          orderItemId: item1,
          status: 'REWORK',
          latestQcResult: 'REWORK',
        },
      ];

      const res = validateFulfillmentReadiness(orderId, [item1], jobs);
      expect(res.isReady).toBe(false);
      expect(res.blockingReasons.some((r) => r.includes('REWORK'))).toBe(true);
    });

    it('blocks shipment when a job is ON_HOLD after QC rejection (AC-05)', () => {
      const jobs: ProductionReadinessContext[] = [
        {
          jobId: 'job-1',
          jobNumber: 'TS-J-01',
          orderId,
          orderItemId: item1,
          status: 'READY_FOR_HANDOFF',
          latestQcResult: 'PASS',
        },
        {
          jobId: 'job-2',
          jobNumber: 'TS-J-02',
          orderId,
          status: 'ON_HOLD',
          latestQcResult: 'REJECTED',
        },
      ];

      const res = validateFulfillmentReadiness(orderId, [item1], jobs);
      expect(res.isReady).toBe(false);
      expect(res.blockingReasons.some((r) => r.includes('ON_HOLD'))).toBe(true);
    });

    it('ignores legitimate CANCELLED jobs that no longer represent required work (AC-07)', () => {
      const jobs: ProductionReadinessContext[] = [
        {
          jobId: 'job-1',
          jobNumber: 'TS-J-01',
          orderId,
          orderItemId: item1,
          status: 'READY_FOR_HANDOFF',
          latestQcResult: 'PASS',
        },
        {
          jobId: 'job-cancelled',
          jobNumber: 'TS-J-CAN',
          orderId,
          orderItemId: item1,
          status: 'CANCELLED',
        },
      ];

      const res = validateFulfillmentReadiness(orderId, [item1], jobs);
      expect(res.isReady).toBe(true);
      expect(res.blockingReasons).toHaveLength(0);
    });

    it('allows partial shipment of item-1 when item-2 unfinished job is not in request (AC-08)', () => {
      const jobs: ProductionReadinessContext[] = [
        {
          jobId: 'job-1',
          jobNumber: 'TS-J-01',
          orderId,
          orderItemId: item1,
          status: 'READY_FOR_HANDOFF',
          latestQcResult: 'PASS',
        },
        {
          jobId: 'job-2',
          jobNumber: 'TS-J-02',
          orderId,
          orderItemId: item2,
          status: 'IN_PRODUCTION',
        },
      ];

      // Shipping only item1
      const res = validateFulfillmentReadiness(orderId, [item1], jobs);
      expect(res.isReady).toBe(true);

      // Shipping item2 is blocked
      const res2 = validateFulfillmentReadiness(orderId, [item2], jobs);
      expect(res2.isReady).toBe(false);
    });
  });
});
