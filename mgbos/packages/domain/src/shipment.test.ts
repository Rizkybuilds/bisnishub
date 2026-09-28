import { describe, it, expect } from 'vitest';
import {
  canTransitionShipment,
  calculateShipmentAllocation,
  OrderItemAllocationContext,
  RequestedShipmentItem,
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
});
