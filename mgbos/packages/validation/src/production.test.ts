import { describe, it, expect } from 'vitest';
import {
  createProductionJobSchema,
  transitionProductionJobSchema,
  assignProductionJobSchema,
} from './production';

describe('Production Validation Schemas (MGBOS-012)', () => {
  describe('createProductionJobSchema', () => {
    it('accepts valid job input with items', () => {
      const valid = {
        orderId: '99999999-0000-4000-8000-000000000001',
        jobType: 'GARMENT',
        title: 'Pengadaan Kaos Polos Combed 24s',
        estimatedCost: '4500000',
        priority: 'HIGH',
        targetDate: '2026-10-05',
        items: [
          {
            order_item_id: '99999999-0000-4000-8000-000000000002',
            quantity: 50,
            notes: 'Batch 1',
          },
        ],
      };
      const res = createProductionJobSchema.safeParse(valid);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.estimatedCost).toBe(4500000n);
        expect(res.data.items).toHaveLength(1);
      }
    });

    it('rejects short title or negative cost', () => {
      expect(
        createProductionJobSchema.safeParse({
          orderId: '99999999-0000-4000-8000-000000000001',
          jobType: 'GARMENT',
          title: 'No',
          estimatedCost: 1000,
        }).success,
      ).toBe(false);

      expect(
        createProductionJobSchema.safeParse({
          orderId: '99999999-0000-4000-8000-000000000001',
          jobType: 'GARMENT',
          title: 'Valid Title',
          estimatedCost: -100,
        }).success,
      ).toBe(false);
    });
  });

  describe('transitionProductionJobSchema', () => {
    it('accepts valid transition input', () => {
      const valid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        toStatus: 'READY',
        reason: 'Material ready for assignment',
      };
      expect(transitionProductionJobSchema.safeParse(valid).success).toBe(true);
    });
  });

  describe('assignProductionJobSchema', () => {
    it('accepts valid assignment input', () => {
      const valid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'VENDOR',
        vendorName: 'PT Mulia Blanks Garmen',
        assignedCost: '4400000',
      };
      const res = assignProductionJobSchema.safeParse(valid);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.assignedCost).toBe(4400000n);
      }
    });
  });
});
