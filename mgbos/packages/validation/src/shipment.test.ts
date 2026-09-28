import { describe, it, expect } from 'vitest';
import {
  createDeliveryOrderSchema,
  dispatchShipmentSchema,
  markShipmentDeliveredSchema,
  cancelShipmentSchema,
} from './shipment';

describe('Shipment Validation Schemas (MGBOS-017 / TS-PLAN-06)', () => {
  it('validates a correct delivery order payload', () => {
    const valid = {
      orderId: '11111111-1111-4111-8111-111111111111',
      courierName: 'JNT',
      courierService: 'CARGO',
      items: [
        {
          orderItemId: '22222222-2222-4222-8222-222222222222',
          quantity: 60,
          notes: 'Batch 1',
        },
      ],
      packageWeightGrams: 15000,
      packageCount: 2,
      notes: 'Pengiriman aman',
    };

    const parsed = createDeliveryOrderSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.courierName).toBe('JNT');
      expect(parsed.data.packageCount).toBe(2);
    }
  });

  it('rejects delivery order with empty items or invalid UUID', () => {
    const invalid = {
      orderId: 'not-a-uuid',
      courierName: 'JNE',
      items: [],
    };

    const parsed = createDeliveryOrderSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('validates dispatch payload and coerces actual shipping cost to BigInt', () => {
    const valid = {
      shipmentId: '33333333-3333-4333-8333-333333333333',
      trackingNumber: 'JNT-00112233',
      actualShippingCost: '150000',
      notes: 'Diserahkan ke kurir jemput',
    };

    const parsed = dispatchShipmentSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.actualShippingCost).toBe(150000n);
      expect(parsed.data.trackingNumber).toBe('JNT-00112233');
    }
  });

  it('validates cancellation schema requiring reason', () => {
    expect(
      cancelShipmentSchema.safeParse({
        shipmentId: '33333333-3333-4333-8333-333333333333',
        reason: 'Pelanggan minta ganti kurir',
      }).success,
    ).toBe(true);

    expect(
      cancelShipmentSchema.safeParse({
        shipmentId: '33333333-3333-4333-8333-333333333333',
        reason: '',
      }).success,
    ).toBe(false);
  });

  it('validates delivered confirmation schema', () => {
    expect(
      markShipmentDeliveredSchema.safeParse({
        shipmentId: '33333333-3333-4333-8333-333333333333',
        receivedBy: 'Pak Budi',
        notes: 'Diterima dengan baik',
      }).success,
    ).toBe(true);
  });
});
