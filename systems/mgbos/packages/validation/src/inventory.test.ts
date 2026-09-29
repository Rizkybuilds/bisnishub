import { describe, expect, it } from 'vitest';
import {
  createInventoryItemSchema,
  recordInventoryMutationSchema,
  reserveInventorySchema,
  performStockOpnameSchema,
} from './inventory';

describe('Inventory Validation Schemas', () => {
  it('validates and normalizes createInventoryItemSchema input', () => {
    const valid = createInventoryItemSchema.parse({
      sku: ' ts-nsa-7200-blk-l ',
      name: 'Kaos NSA 7200 Black L',
      category: 'BLANK_GARMENT',
      costPrice: '38000',
      minStockAlert: '15',
      initialStock: '50',
    });

    expect(valid.sku).toBe('TS-NSA-7200-BLK-L');
    expect(valid.costPrice).toBe(38000n);
    expect(valid.minStockAlert).toBe(15);
    expect(valid.initialStock).toBe(50);
    expect(valid.unit).toBe('pcs');
    expect(valid.locationCode).toBe('MAIN_WORKSHOP');
  });

  it('rejects invalid category or negative stock in createInventoryItemSchema', () => {
    expect(() =>
      createInventoryItemSchema.parse({
        sku: 'TEST',
        name: 'Test',
        category: 'INVALID_CATEGORY',
      }),
    ).toThrow();

    expect(() =>
      createInventoryItemSchema.parse({
        sku: 'TEST',
        name: 'Test',
        category: 'BLANK_GARMENT',
        initialStock: -5,
      }),
    ).toThrow();
  });

  it('validates recordInventoryMutationSchema', () => {
    const valid = recordInventoryMutationSchema.parse({
      inventoryItemId: '11111111-1111-4111-8111-111111111111',
      mutationType: 'INBOUND_PURCHASE',
      quantity: '25',
      notes: 'Penerimaan supplier',
    });

    expect(valid.quantity).toBe(25);
    expect(valid.locationCode).toBe('MAIN_WORKSHOP');
  });

  it('validates reserveInventorySchema', () => {
    const valid = reserveInventorySchema.parse({
      orderId: '22222222-2222-4222-8222-222222222222',
      items: [
        {
          inventoryItemId: '11111111-1111-4111-8111-111111111111',
          quantity: 10,
        },
      ],
    });

    expect(valid.items).toHaveLength(1);
    expect(valid.items[0]?.quantity).toBe(10);
  });

  it('validates performStockOpnameSchema', () => {
    const valid = performStockOpnameSchema.parse({
      inventoryItemId: '11111111-1111-4111-8111-111111111111',
      actualPhysicalCount: '48',
      reason: 'Hasil opname mingguan fisik',
    });

    expect(valid.actualPhysicalCount).toBe(48);
    expect(valid.reason).toBe('Hasil opname mingguan fisik');
  });
});
