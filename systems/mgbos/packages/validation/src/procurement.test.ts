import { describe, expect, it } from 'vitest';
import {
  createPurchaseOrderSchema,
  receivePurchaseOrderSchema,
  payVendorBillSchema,
} from './procurement';

describe('Procurement Validation Schemas', () => {
  it('validates and normalizes createPurchaseOrderSchema input', () => {
    const valid = createPurchaseOrderSchema.parse({
      vendorId: '11111111-1111-4111-8111-111111111111',
      items: [
        {
          inventoryItemId: '22222222-2222-4222-8222-222222222222',
          quantity: '100',
          unitCost: '38000',
        },
      ],
      shippingCost: '50000',
      paymentTerms: 'NET_14',
    });

    expect(valid.items[0]?.quantity).toBe(100);
    expect(valid.items[0]?.unitCost).toBe(38000n);
    expect(valid.shippingCost).toBe(50000n);
    expect(valid.paymentTerms).toBe('NET_14');
  });

  it('validates receivePurchaseOrderSchema input', () => {
    const valid = receivePurchaseOrderSchema.parse({
      purchaseOrderId: '11111111-1111-4111-8111-111111111111',
      items: [
        {
          purchaseOrderItemId: '22222222-2222-4222-8222-222222222222',
          quantityAccepted: '60',
          quantityRejected: '2',
          rejectionReason: 'Cacat kain',
        },
      ],
      vendorDeliveryNote: 'SJ-001',
    });

    expect(valid.items[0]?.quantityAccepted).toBe(60);
    expect(valid.items[0]?.quantityRejected).toBe(2);
    expect(valid.locationCode).toBe('MAIN_WORKSHOP');
  });

  it('validates payVendorBillSchema input', () => {
    const valid = payVendorBillSchema.parse({
      vendorBillId: '11111111-1111-4111-8111-111111111111',
      amount: '2000000',
      sourceBank: 'BCA',
    });

    expect(valid.amount).toBe(2000000n);
    expect(valid.paymentMethod).toBe('BANK_TRANSFER');
  });
});
