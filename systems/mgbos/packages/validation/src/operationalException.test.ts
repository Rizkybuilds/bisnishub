import { describe, it, expect } from 'vitest';
import {
  openOperationalExceptionSchema,
  acknowledgeOperationalExceptionSchema,
  assignOperationalExceptionSchema,
  reassignOperationalExceptionSchema,
  changeOperationalExceptionSeveritySchema,
  resolveOperationalExceptionSchema,
  dismissOperationalExceptionSchema,
  reopenOperationalExceptionSchema,
} from './operationalException';

const VALID_UUID_1 = '00000000-0000-4000-8000-000000000001';
const VALID_UUID_2 = '00000000-0000-4000-8000-000000000002';
const VALID_UUID_3 = '00000000-0000-4000-8000-000000000003';
const VALID_UUID_REQ = '11111111-1111-4111-8111-111111111111';

describe('Operational Exception Validation Schemas (P2-A / WP02)', () => {
  describe('openOperationalExceptionSchema', () => {
    const validBaseOpenPayload = {
      requestId: VALID_UUID_REQ,
      exceptionType: 'production.deadline_breached' as const,
      primaryResourceType: 'PRODUCTION_JOB' as const,
      primaryResourceId: VALID_UUID_1,
      severity: 'HIGH' as const,
      sourceKind: 'HUMAN_REPORT' as const,
      responsibleRoleCode: 'OPERATIONS' as const,
      responsibleUserId: VALID_UUID_2,
      summary: 'Keterlambatan proses jahit pada pesanan TS-O-2026-0001',
      businessImpact: 'Potensi penalti keterlambatan pengiriman ke pelanggan',
      observation: 'Mesin jahit lini 2 mengalami kendala dinamo sejak pagi',
      rootCause: 'Kerusakan dinamo listrik mesin utama',
      detectedAt: '2026-10-06T10:00:00.000Z',
    };

    it('accepts valid standard opening payload', () => {
      const res =
        openOperationalExceptionSchema.safeParse(validBaseOpenPayload);
      expect(res.success).toBe(true);
    });

    it('accepts valid RECONCILIATION sourceKind', () => {
      const res = openOperationalExceptionSchema.safeParse({
        ...validBaseOpenPayload,
        sourceKind: 'RECONCILIATION',
      });
      expect(res.success).toBe(true);
    });

    it('rejects invalid UUIDs for requestId, primaryResourceId, and responsibleUserId', () => {
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          requestId: 'not-a-uuid',
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          primaryResourceId: 'not-a-uuid',
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          responsibleUserId: 'not-a-uuid',
        }).success,
      ).toBe(false);
    });

    it('rejects invalid vocabularies for exceptionType, severity, sourceKind, and responsibleRoleCode', () => {
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'invalid.exception_type',
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          severity: 'SUPER_CRITICAL',
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          sourceKind: 'DETERMINISTIC_RULE', // disallowed for manual opening in WP01
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          responsibleRoleCode: 'SUPER_ADMIN',
        }).success,
      ).toBe(false);
    });

    it('enforces text bounds for summary, businessImpact, observation, and rootCause', () => {
      // summary: 5-240
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          summary: 'abc', // < 5
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          summary: 'x'.repeat(241), // > 240
        }).success,
      ).toBe(false);

      // businessImpact: 5-2000
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          businessImpact: 'abc', // < 5
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          businessImpact: 'x'.repeat(2001), // > 2000
        }).success,
      ).toBe(false);

      // observation: 5-4000 when provided
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          observation: 'abc', // < 5
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          observation: 'x'.repeat(4001), // > 4000
        }).success,
      ).toBe(false);

      // rootCause: max 2000
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          rootCause: 'x'.repeat(2001), // > 2000
        }).success,
      ).toBe(false);
    });

    it('enforces deterministic type-to-resource matching and rejects mismatched resource', () => {
      // production.deadline_breached requires PRODUCTION_JOB
      const mismatched = openOperationalExceptionSchema.safeParse({
        ...validBaseOpenPayload,
        exceptionType: 'production.deadline_breached',
        primaryResourceType: 'ORDER',
      });
      expect(mismatched.success).toBe(false);
      if (!mismatched.success) {
        expect(mismatched.error.issues[0]?.message).toContain(
          'membutuhkan primaryResourceType PRODUCTION_JOB',
        );
      }

      // vendor.commitment_problem requires PRODUCTION_ASSIGNMENT
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'vendor.commitment_problem',
          primaryResourceType: 'ORDER',
        }).success,
      ).toBe(false);

      // quality.qc_failed requires QC_INSPECTION
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'quality.qc_failed',
          primaryResourceType: 'ORDER',
        }).success,
      ).toBe(false);

      // fulfillment.delivery_problem requires SHIPMENT
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'fulfillment.delivery_problem',
          primaryResourceType: 'ORDER',
        }).success,
      ).toBe(false);

      // financial.receivable_past_due requires INVOICE
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'financial.receivable_past_due',
          primaryResourceType: 'ORDER',
        }).success,
      ).toBe(false);

      // financial.actual_cost_missing requires PRODUCTION_JOB
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'financial.actual_cost_missing',
          primaryResourceType: 'ORDER',
        }).success,
      ).toBe(false);

      // financial.margin_exception requires ORDER
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'financial.margin_exception',
          primaryResourceType: 'INVOICE',
        }).success,
      ).toBe(false);
    });

    it('validates other.operational_abnormality condition', () => {
      // other without otherCategoryReason fails
      const missingReason = openOperationalExceptionSchema.safeParse({
        ...validBaseOpenPayload,
        exceptionType: 'other.operational_abnormality',
        primaryResourceType: 'ORDER',
      });
      expect(missingReason.success).toBe(false);
      if (!missingReason.success) {
        expect(missingReason.error.issues[0]?.message).toContain(
          'otherCategoryReason wajib diisi',
        );
      }

      // other with reason < 10 chars fails
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'other.operational_abnormality',
          primaryResourceType: 'ORDER',
          otherCategoryReason: 'terlalu p',
        }).success,
      ).toBe(false);

      // other with valid reason passes
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          exceptionType: 'other.operational_abnormality',
          primaryResourceType: 'ORDER',
          otherCategoryReason:
            'Kendala operasional tak terduga pada gudang transit',
        }).success,
      ).toBe(true);

      // non-other exception with otherCategoryReason fails (contradictory payload)
      const contradictory = openOperationalExceptionSchema.safeParse({
        ...validBaseOpenPayload,
        exceptionType: 'production.deadline_breached',
        primaryResourceType: 'PRODUCTION_JOB',
        otherCategoryReason: 'Alasan tak perlu untuk produksi',
      });
      expect(contradictory.success).toBe(false);
      if (!contradictory.success) {
        expect(contradictory.error.issues[0]?.message).toContain(
          'otherCategoryReason hanya boleh diisi jika exceptionType adalah other.operational_abnormality',
        );
      }
    });

    it('strictly rejects caller-supplied organizationId, actorId, or authoritative database fields', () => {
      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          organizationId: VALID_UUID_3,
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          actorId: VALID_UUID_3,
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          brandId: VALID_UUID_3,
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          status: 'OPEN',
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          currentRevision: 1,
        }).success,
      ).toBe(false);

      expect(
        openOperationalExceptionSchema.safeParse({
          ...validBaseOpenPayload,
          dedupFingerprint: 'some-hash',
        }).success,
      ).toBe(false);
    });
  });

  describe('acknowledgeOperationalExceptionSchema', () => {
    const validAcknowledge = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_1,
      expectedRevision: 1,
      note: 'Telah dikonfirmasi oleh supervisor shift',
    };

    it('accepts valid acknowledge payload', () => {
      expect(
        acknowledgeOperationalExceptionSchema.safeParse(validAcknowledge)
          .success,
      ).toBe(true);
    });

    it('rejects invalid revision (0, negative, non-integer)', () => {
      expect(
        acknowledgeOperationalExceptionSchema.safeParse({
          ...validAcknowledge,
          expectedRevision: 0,
        }).success,
      ).toBe(false);

      expect(
        acknowledgeOperationalExceptionSchema.safeParse({
          ...validAcknowledge,
          expectedRevision: -1,
        }).success,
      ).toBe(false);

      expect(
        acknowledgeOperationalExceptionSchema.safeParse({
          ...validAcknowledge,
          expectedRevision: 1.5,
        }).success,
      ).toBe(false);
    });

    it('rejects note longer than 2000 characters', () => {
      expect(
        acknowledgeOperationalExceptionSchema.safeParse({
          ...validAcknowledge,
          note: 'x'.repeat(2001),
        }).success,
      ).toBe(false);
    });

    it('strictly rejects unauthorized actorId or organizationId injection', () => {
      expect(
        acknowledgeOperationalExceptionSchema.safeParse({
          ...validAcknowledge,
          organizationId: VALID_UUID_2,
        }).success,
      ).toBe(false);

      expect(
        acknowledgeOperationalExceptionSchema.safeParse({
          ...validAcknowledge,
          actorId: VALID_UUID_2,
        }).success,
      ).toBe(false);
    });
  });

  describe('assignOperationalExceptionSchema', () => {
    const validAssign = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_1,
      expectedRevision: 1,
      responsibleRoleCode: 'OPERATIONS' as const,
      responsibleUserId: VALID_UUID_2,
      reason: 'Penugasan investigasi ke lead operator',
    };

    it('accepts valid assign payload', () => {
      expect(
        assignOperationalExceptionSchema.safeParse(validAssign).success,
      ).toBe(true);
    });

    it('rejects invalid role code and invalid revision', () => {
      expect(
        assignOperationalExceptionSchema.safeParse({
          ...validAssign,
          responsibleRoleCode: 'INVALID_ROLE',
        }).success,
      ).toBe(false);

      expect(
        assignOperationalExceptionSchema.safeParse({
          ...validAssign,
          expectedRevision: 0,
        }).success,
      ).toBe(false);
    });

    it('strictly rejects injected fields', () => {
      expect(
        assignOperationalExceptionSchema.safeParse({
          ...validAssign,
          actorId: VALID_UUID_3,
        }).success,
      ).toBe(false);
    });
  });

  describe('reassignOperationalExceptionSchema', () => {
    const validReassign = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_1,
      expectedRevision: 2,
      newResponsibleRoleCode: 'ADMIN' as const,
      newResponsibleUserId: VALID_UUID_2,
      reason: 'Eskalasi penanganan ke level Admin karena keterlambatan',
    };

    it('accepts valid reassign payload', () => {
      expect(
        reassignOperationalExceptionSchema.safeParse(validReassign).success,
      ).toBe(true);
    });

    it('enforces reason bounds (5-2000)', () => {
      expect(
        reassignOperationalExceptionSchema.safeParse({
          ...validReassign,
          reason: 'pend', // < 5
        }).success,
      ).toBe(false);

      expect(
        reassignOperationalExceptionSchema.safeParse({
          ...validReassign,
          reason: 'x'.repeat(2001),
        }).success,
      ).toBe(false);
    });

    it('strictly rejects injected fields', () => {
      expect(
        reassignOperationalExceptionSchema.safeParse({
          ...validReassign,
          organizationId: VALID_UUID_3,
        }).success,
      ).toBe(false);
    });
  });

  describe('changeOperationalExceptionSeveritySchema', () => {
    const validChangeSeverity = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_1,
      expectedRevision: 2,
      newSeverity: 'CRITICAL' as const,
      reason: 'Dampak meluas ke pesanan prioritas lainnya',
    };

    it('accepts valid change severity payload', () => {
      expect(
        changeOperationalExceptionSeveritySchema.safeParse(validChangeSeverity)
          .success,
      ).toBe(true);
    });

    it('enforces severity vocabulary and reason bounds', () => {
      expect(
        changeOperationalExceptionSeveritySchema.safeParse({
          ...validChangeSeverity,
          newSeverity: 'EXTREME',
        }).success,
      ).toBe(false);

      expect(
        changeOperationalExceptionSeveritySchema.safeParse({
          ...validChangeSeverity,
          reason: 'pend', // < 5
        }).success,
      ).toBe(false);
    });

    it('strictly rejects injected fields', () => {
      expect(
        changeOperationalExceptionSeveritySchema.safeParse({
          ...validChangeSeverity,
          actorId: VALID_UUID_3,
        }).success,
      ).toBe(false);
    });
  });

  describe('resolveOperationalExceptionSchema', () => {
    const validResolve = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_1,
      expectedRevision: 3,
      resolutionType: 'REMEDIATED' as const,
      resolutionSummary:
        'Dinamo mesin jahit telah diganti dengan suku cadang cadangan',
    };

    it('accepts valid standard resolution', () => {
      expect(
        resolveOperationalExceptionSchema.safeParse(validResolve).success,
      ).toBe(true);
    });

    it('enforces SUPERSEDED target condition and rejects contradictory payloads', () => {
      // SUPERSEDED without target fails
      const missingTarget = resolveOperationalExceptionSchema.safeParse({
        ...validResolve,
        resolutionType: 'SUPERSEDED',
      });
      expect(missingTarget.success).toBe(false);
      if (!missingTarget.error) {
        expect(missingTarget.error).toBeDefined();
      } else {
        expect(missingTarget.error.issues[0]?.message).toContain(
          'supersededByExceptionId wajib diisi jika tipe resolusi adalah SUPERSEDED',
        );
      }

      // SUPERSEDED with invalid UUID fails
      expect(
        resolveOperationalExceptionSchema.safeParse({
          ...validResolve,
          resolutionType: 'SUPERSEDED',
          supersededByExceptionId: 'not-a-uuid',
        }).success,
      ).toBe(false);

      // SUPERSEDED with valid UUID passes
      expect(
        resolveOperationalExceptionSchema.safeParse({
          ...validResolve,
          resolutionType: 'SUPERSEDED',
          supersededByExceptionId: VALID_UUID_2,
        }).success,
      ).toBe(true);

      // Non-SUPERSEDED with target fails (contradictory payload)
      const contradictory = resolveOperationalExceptionSchema.safeParse({
        ...validResolve,
        resolutionType: 'REMEDIATED',
        supersededByExceptionId: VALID_UUID_2,
      });
      expect(contradictory.success).toBe(false);
      if (!contradictory.success) {
        expect(contradictory.error.issues[0]?.message).toContain(
          'supersededByExceptionId hanya boleh diisi jika tipe resolusi adalah SUPERSEDED',
        );
      }
    });

    it('enforces resolutionSummary bounds (5-2000)', () => {
      expect(
        resolveOperationalExceptionSchema.safeParse({
          ...validResolve,
          resolutionSummary: 'abc', // < 5
        }).success,
      ).toBe(false);

      expect(
        resolveOperationalExceptionSchema.safeParse({
          ...validResolve,
          resolutionSummary: 'x'.repeat(2001),
        }).success,
      ).toBe(false);
    });

    it('strictly rejects injected fields', () => {
      expect(
        resolveOperationalExceptionSchema.safeParse({
          ...validResolve,
          organizationId: VALID_UUID_3,
        }).success,
      ).toBe(false);
    });
  });

  describe('dismissOperationalExceptionSchema', () => {
    const validDismiss = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_1,
      expectedRevision: 1,
      dismissalReason: 'NOT_APPLICABLE' as const,
      reasonSummary: 'Kondisi telah terselesaikan sebelum laporan resmi dibuka',
    };

    it('accepts valid standard dismissal', () => {
      expect(
        dismissOperationalExceptionSchema.safeParse(validDismiss).success,
      ).toBe(true);
    });

    it('enforces DUPLICATE target condition and rejects contradictory payloads', () => {
      // DUPLICATE without duplicate target fails
      const missingTarget = dismissOperationalExceptionSchema.safeParse({
        ...validDismiss,
        dismissalReason: 'DUPLICATE',
      });
      expect(missingTarget.success).toBe(false);
      if (!missingTarget.error) {
        expect(missingTarget.error).toBeDefined();
      } else {
        expect(missingTarget.error.issues[0]?.message).toContain(
          'duplicateOfExceptionId wajib diisi jika alasan dismissal adalah DUPLICATE',
        );
      }

      // DUPLICATE with invalid UUID fails
      expect(
        dismissOperationalExceptionSchema.safeParse({
          ...validDismiss,
          dismissalReason: 'DUPLICATE',
          duplicateOfExceptionId: 'not-a-uuid',
        }).success,
      ).toBe(false);

      // DUPLICATE with valid target passes
      expect(
        dismissOperationalExceptionSchema.safeParse({
          ...validDismiss,
          dismissalReason: 'DUPLICATE',
          duplicateOfExceptionId: VALID_UUID_2,
        }).success,
      ).toBe(true);

      // Non-DUPLICATE with duplicate target fails (contradictory payload)
      const contradictory = dismissOperationalExceptionSchema.safeParse({
        ...validDismiss,
        dismissalReason: 'FALSE_POSITIVE',
        duplicateOfExceptionId: VALID_UUID_2,
      });
      expect(contradictory.success).toBe(false);
      if (!contradictory.success) {
        expect(contradictory.error.issues[0]?.message).toContain(
          'duplicateOfExceptionId hanya boleh diisi jika alasan dismissal adalah DUPLICATE',
        );
      }
    });

    it('enforces reasonSummary bounds (5-2000)', () => {
      expect(
        dismissOperationalExceptionSchema.safeParse({
          ...validDismiss,
          reasonSummary: 'pend', // < 5
        }).success,
      ).toBe(false);

      expect(
        dismissOperationalExceptionSchema.safeParse({
          ...validDismiss,
          reasonSummary: 'x'.repeat(2001),
        }).success,
      ).toBe(false);
    });

    it('strictly rejects injected fields', () => {
      expect(
        dismissOperationalExceptionSchema.safeParse({
          ...validDismiss,
          actorId: VALID_UUID_3,
        }).success,
      ).toBe(false);
    });
  });

  describe('reopenOperationalExceptionSchema', () => {
    const validReopen = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_1,
      expectedRevision: 4,
      reason:
        'Kerusakan dinamo berulang kembali setelah penggantian suku cadang',
    };

    it('accepts valid reopen payload', () => {
      expect(
        reopenOperationalExceptionSchema.safeParse(validReopen).success,
      ).toBe(true);
    });

    it('enforces reason bounds (5-2000)', () => {
      expect(
        reopenOperationalExceptionSchema.safeParse({
          ...validReopen,
          reason: 'pend', // < 5
        }).success,
      ).toBe(false);

      expect(
        reopenOperationalExceptionSchema.safeParse({
          ...validReopen,
          reason: 'x'.repeat(2001),
        }).success,
      ).toBe(false);
    });

    it('rejects invalid revision (0, negative)', () => {
      expect(
        reopenOperationalExceptionSchema.safeParse({
          ...validReopen,
          expectedRevision: 0,
        }).success,
      ).toBe(false);

      expect(
        reopenOperationalExceptionSchema.safeParse({
          ...validReopen,
          expectedRevision: -2,
        }).success,
      ).toBe(false);
    });

    it('strictly rejects injected fields', () => {
      expect(
        reopenOperationalExceptionSchema.safeParse({
          ...validReopen,
          organizationId: VALID_UUID_3,
        }).success,
      ).toBe(false);
    });
  });
});
