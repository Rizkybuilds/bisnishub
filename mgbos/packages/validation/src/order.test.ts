import { describe, it, expect } from 'vitest';
import {
  markQuoteAcceptedSchema,
  shippingAddressSnapshotSchema,
  createOrderFromQuoteSchema,
  createRetailOrderSchema,
  retailOrderItemInputSchema,
} from './order';

describe('Order Validation Schemas (MGBOS-011)', () => {
  describe('markQuoteAcceptedSchema', () => {
    it('accepts valid input', () => {
      const valid = {
        versionId: '99999999-0000-4000-8000-000000000001',
        acceptanceMethod: 'WHATSAPP',
        notes: 'Disetujui via WA chat resmi',
      };
      expect(markQuoteAcceptedSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects invalid acceptance method', () => {
      const invalid = {
        versionId: '99999999-0000-4000-8000-000000000001',
        acceptanceMethod: 'INVALID_CHANNEL',
      };
      expect(markQuoteAcceptedSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('shippingAddressSnapshotSchema', () => {
    it('validates complete shipping address', () => {
      const valid = {
        recipient_name: 'Budi Hartono',
        phone: '081234567890',
        street: 'Jl. Jend. Sudirman Kav. 25',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postal_code: '12920',
        courier_service: 'J&T Cargo',
      };
      expect(shippingAddressSnapshotSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects missing recipient, phone, street or city', () => {
      expect(
        shippingAddressSnapshotSchema.safeParse({
          recipient_name: 'Budi',
        }).success,
      ).toBe(false);
    });
  });

  describe('createOrderFromQuoteSchema', () => {
    it('validates order conversion payload', () => {
      const valid = {
        quoteVersionId: '99999999-0000-4000-8000-000000000001',
        shippingAddress: {
          recipient_name: 'Budi Hartono',
          phone: '081234567890',
          street: 'Jl. Jend. Sudirman Kav. 25',
          city: 'Jakarta Selatan',
        },
      };
      expect(createOrderFromQuoteSchema.safeParse(valid).success).toBe(true);
    });
  });

  describe('createRetailOrderSchema (MGBOS-020)', () => {
    it('validates direct retail order with auto-pay', () => {
      const valid = {
        customerAccountId: '99999999-0000-4000-8000-000000000001',
        items: [
          {
            inventoryItemId: '99999999-0000-4000-8000-000000000002',
            quantity: 5,
            unitPrice: '75000',
            discountTotal: '0',
          },
        ],
        shippingCost: '15000',
        autoPay: true,
        paymentMethod: 'QRIS',
        paymentReference: 'QRIS-REF-12345',
      };
      expect(createRetailOrderSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects retail order without any item', () => {
      const invalid = {
        customerAccountId: '99999999-0000-4000-8000-000000000001',
        items: [],
      };
      expect(createRetailOrderSchema.safeParse(invalid).success).toBe(false);
    });

    it('rejects invalid quantity or negative unit price in line item', () => {
      const invalid = {
        customerAccountId: '99999999-0000-4000-8000-000000000001',
        items: [
          {
            inventoryItemId: '99999999-0000-4000-8000-000000000002',
            quantity: 0,
            unitPrice: '75000',
          },
        ],
      };
      expect(createRetailOrderSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('retailOrderItemInputSchema', () => {
    it('validates a valid line item input', () => {
      const valid = {
        inventoryItemId: '99999999-0000-4000-8000-000000000002',
        quantity: 5,
        unitPrice: '85000',
        discountTotal: '5000',
        notes: 'Size L Black',
      };
      expect(retailOrderItemInputSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects item with invalid UUID or non-positive quantity', () => {
      const invalid = {
        inventoryItemId: 'invalid-id',
        quantity: -1,
        unitPrice: '85000',
      };
      expect(retailOrderItemInputSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
