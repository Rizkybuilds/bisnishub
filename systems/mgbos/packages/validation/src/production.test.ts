import { describe, it, expect } from 'vitest';
import {
  createProductionJobSchema,
  transitionProductionJobSchema,
  assignProductionJobSchema,
  acceptProductionAssignmentSchema,
  declineProductionAssignmentSchema,
  cancelProductionAssignmentSchema,
  reassignProductionJobSchema,
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
    it('accepts valid assignment input with vendorId (canonical)', () => {
      const valid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'VENDOR',
        vendorId: '99999999-0000-4000-8000-000000000003',
        vendorName: 'PT Mulia Blanks Garmen',
        assignedCost: '4400000',
      };
      const res = assignProductionJobSchema.safeParse(valid);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.assignedCost).toBe(4400000n);
        expect(res.data.vendorId).toBe('99999999-0000-4000-8000-000000000003');
      }
    });

    it('accepts valid assignment input with vendorName (fallback compatibility)', () => {
      const valid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'VENDOR',
        vendorName: 'PT Mulia Blanks Garmen',
        assignedCost: '4400000',
      };
      const res = assignProductionJobSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it('accepts valid internal brand assignment', () => {
      const valid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'INTERNAL',
        assignedBrandId: '99999999-0000-4000-8000-000000000004',
        assignedCost: '2500000',
      };
      const res = assignProductionJobSchema.safeParse(valid);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.assignedBrandId).toBe(
          '99999999-0000-4000-8000-000000000004',
        );
      }
    });

    it('rejects internal assignment missing assignedBrandId', () => {
      const invalid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'INTERNAL',
        assignedCost: '2500000',
      };
      const res = assignProductionJobSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it('rejects vendor assignment missing both vendorId and vendorName', () => {
      const invalid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'VENDOR',
        assignedCost: '2500000',
      };
      const res = assignProductionJobSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it('rejects invalid vendor UUID', () => {
      const invalid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'VENDOR',
        vendorId: 'not-a-uuid',
      };
      const res = assignProductionJobSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe('acceptProductionAssignmentSchema (P0-04)', () => {
    it('accepts valid assignment UUID (AC-01)', () => {
      const res = acceptProductionAssignmentSchema.safeParse({
        assignmentId: '99999999-0000-4000-8000-000000000001',
      });
      expect(res.success).toBe(true);
    });

    it('rejects invalid assignment UUID', () => {
      const res = acceptProductionAssignmentSchema.safeParse({
        assignmentId: 'invalid-uuid',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('declineProductionAssignmentSchema (P0-04)', () => {
    it('accepts valid assignment UUID with reason (AC-05)', () => {
      const res = declineProductionAssignmentSchema.safeParse({
        assignmentId: '99999999-0000-4000-8000-000000000001',
        reason: 'Kapasitas vendor penuh minggu ini',
      });
      expect(res.success).toBe(true);
    });

    it('rejects reason shorter than 3 characters', () => {
      const res = declineProductionAssignmentSchema.safeParse({
        assignmentId: '99999999-0000-4000-8000-000000000001',
        reason: 'no',
      });
      expect(res.success).toBe(false);
    });
  });

  describe('cancelProductionAssignmentSchema (P0-04)', () => {
    it('accepts valid assignment UUID with reason', () => {
      const res = cancelProductionAssignmentSchema.safeParse({
        assignmentId: '99999999-0000-4000-8000-000000000001',
        reason: 'Pesanan diubah oleh customer',
      });
      expect(res.success).toBe(true);
    });
  });

  describe('reassignProductionJobSchema (P0-04)', () => {
    it('accepts valid reassignment with new vendor and reason (AC-08)', () => {
      const valid = {
        jobId: '99999999-0000-4000-8000-000000000001',
        executorType: 'VENDOR',
        vendorId: '99999999-0000-4000-8000-000000000003',
        assignedCost: '4200000',
        reason: 'Alihkan ke vendor sekunder karena SLA mendesak',
      };
      const res = reassignProductionJobSchema.safeParse(valid);
      expect(res.success).toBe(true);
      if (res.success) {
        expect(res.data.assignedCost).toBe(4200000n);
        expect(res.data.reason).toBe(
          'Alihkan ke vendor sekunder karena SLA mendesak',
        );
      }
    });
  });
});

