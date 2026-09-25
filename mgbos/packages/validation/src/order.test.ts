import { describe, it, expect } from 'vitest';
import {
  markQuoteAcceptedSchema,
  shippingAddressSnapshotSchema,
  createOrderFromQuoteSchema,
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
});
