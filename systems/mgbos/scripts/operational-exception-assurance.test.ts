import { describe, expect, it } from 'vitest';
import {
  formatSeverityBadge,
  formatStatusBadge,
  getAvailableActions,
  getAvailableResolutionTypes,
  translateErrorCode,
} from '../apps/mgbos/src/app/(app)/exceptions/console';
import {
  validateOperationalExceptionTransition,
  OPERATIONAL_EXCEPTION_RESOLUTION_TYPES,
  OPERATIONAL_EXCEPTION_DISMISSAL_REASONS,
  OPERATIONAL_EXCEPTION_SEVERITIES,
  OPERATIONAL_EXCEPTION_STATUSES,
  OPERATIONAL_EXCEPTION_RESOURCE_TYPES,
  OPERATIONAL_EXCEPTION_CATEGORIES,
} from '../packages/domain/src/operationalException';
import {
  openOperationalExceptionSchema,
  resolveOperationalExceptionSchema,
  dismissOperationalExceptionSchema,
} from '../packages/validation/src/operationalException';

describe('Operational Exception Integrated Assurance Suite (WP-P2A-04)', () => {
  // ==========================================================================
  // 1. Vocabulary & Contract Integrity (AC-001, AC-003)
  // ==========================================================================
  describe('Vocabulary & Domain Constants Invariants', () => {
    it('defines exactly four canonical statuses in lifecycle', () => {
      expect(OPERATIONAL_EXCEPTION_STATUSES).toEqual([
        'OPEN',
        'ACKNOWLEDGED',
        'RESOLVED',
        'DISMISSED',
      ]);
    });

    it('defines exactly four canonical severities', () => {
      expect(OPERATIONAL_EXCEPTION_SEVERITIES).toEqual([
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL',
      ]);
    });

    it('defines exactly five resolution types including ACCEPTED_RISK', () => {
      expect(OPERATIONAL_EXCEPTION_RESOLUTION_TYPES).toEqual([
        'REMEDIATED',
        'WORKAROUND',
        'SOURCE_CORRECTED',
        'ACCEPTED_RISK',
        'SUPERSEDED',
      ]);
    });

    it('defines exactly four dismissal reasons', () => {
      expect(OPERATIONAL_EXCEPTION_DISMISSAL_REASONS).toEqual([
        'FALSE_POSITIVE',
        'DUPLICATE',
        'NOT_APPLICABLE',
        'OPENED_IN_ERROR',
      ]);
    });

    it('defines exactly six primary resource types', () => {
      expect(OPERATIONAL_EXCEPTION_RESOURCE_TYPES).toEqual([
        'ORDER',
        'PRODUCTION_JOB',
        'PRODUCTION_ASSIGNMENT',
        'QC_INSPECTION',
        'INVOICE',
        'SHIPMENT',
      ]);
    });

    it('defines canonical operational abnormality categories', () => {
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('PRODUCTION');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('VENDOR');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('QUALITY');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('FULFILLMENT');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('FINANCIAL');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('OTHER');
    });
  });

  // ==========================================================================
  // 2. Canonical State Machine Transition Invariants (AC-004)
  // ==========================================================================
  describe('State Machine Transition Matrix Verification', () => {
    it('allows valid transitions from OPEN', () => {
      expect(
        validateOperationalExceptionTransition('OPEN', 'ACKNOWLEDGED').valid,
      ).toBe(true);
      expect(
        validateOperationalExceptionTransition('OPEN', 'RESOLVED').valid,
      ).toBe(true);
      expect(
        validateOperationalExceptionTransition('OPEN', 'DISMISSED').valid,
      ).toBe(true);
      expect(validateOperationalExceptionTransition('OPEN', 'OPEN').valid).toBe(
        false,
      );
    });

    it('allows valid transitions from ACKNOWLEDGED', () => {
      expect(
        validateOperationalExceptionTransition('ACKNOWLEDGED', 'RESOLVED')
          .valid,
      ).toBe(true);
      expect(
        validateOperationalExceptionTransition('ACKNOWLEDGED', 'DISMISSED')
          .valid,
      ).toBe(true);
      expect(
        validateOperationalExceptionTransition('ACKNOWLEDGED', 'OPEN').valid,
      ).toBe(false);
      expect(
        validateOperationalExceptionTransition('ACKNOWLEDGED', 'ACKNOWLEDGED')
          .valid,
      ).toBe(false);
    });

    it('allows reopening from RESOLVED and DISMISSED', () => {
      expect(
        validateOperationalExceptionTransition('RESOLVED', 'OPEN').valid,
      ).toBe(true);
      expect(
        validateOperationalExceptionTransition('DISMISSED', 'OPEN').valid,
      ).toBe(true);
    });

    it('strictly forbids invalid closed-to-closed or closed-to-acknowledged transitions', () => {
      expect(
        validateOperationalExceptionTransition('RESOLVED', 'ACKNOWLEDGED')
          .valid,
      ).toBe(false);
      expect(
        validateOperationalExceptionTransition('RESOLVED', 'DISMISSED').valid,
      ).toBe(false);
      expect(
        validateOperationalExceptionTransition('DISMISSED', 'ACKNOWLEDGED')
          .valid,
      ).toBe(false);
      expect(
        validateOperationalExceptionTransition('DISMISSED', 'RESOLVED').valid,
      ).toBe(false);
    });
  });

  // ==========================================================================
  // 3. Security Boundary & Authority Invariants (AC-003, AC-006)
  // ==========================================================================
  describe('Security Boundary & Authority Rules', () => {
    it('grants ACCEPTED_RISK resolution only to OWNER authority', () => {
      const ownerResolutions = getAvailableResolutionTypes('OWNER');
      expect(ownerResolutions).toContain('ACCEPTED_RISK');

      const adminResolutions = getAvailableResolutionTypes('ADMIN');
      expect(adminResolutions).not.toContain('ACCEPTED_RISK');

      const opsResolutions = getAvailableResolutionTypes('OPERATIONS');
      expect(opsResolutions).not.toContain('ACCEPTED_RISK');
    });

    it('denies all console lifecycle actions to non-authorized staff roles', () => {
      const staffRoles = ['OPERATIONS', 'SALES', 'FINANCE', 'QC', 'VIEWER'];
      const statuses = ['OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'];

      for (const role of staffRoles) {
        for (const status of statuses) {
          const actions = getAvailableActions({ status }, role);
          expect(actions.canAcknowledge).toBe(false);
          expect(actions.canAssign).toBe(false);
          expect(actions.canReassign).toBe(false);
          expect(actions.canChangeSeverity).toBe(false);
          expect(actions.canResolve).toBe(false);
          expect(actions.canDismiss).toBe(false);
          expect(actions.canReopen).toBe(false);
        }
      }
    });

    it('allows lifecycle actions to OWNER and ADMIN only in valid states', () => {
      for (const role of ['OWNER', 'ADMIN']) {
        const openActions = getAvailableActions({ status: 'OPEN' }, role);
        expect(openActions.canAcknowledge).toBe(true);
        expect(openActions.canAssign).toBe(true);
        expect(openActions.canReassign).toBe(true);
        expect(openActions.canChangeSeverity).toBe(true);
        expect(openActions.canResolve).toBe(true);
        expect(openActions.canDismiss).toBe(true);
        expect(openActions.canReopen).toBe(false);

        const ackActions = getAvailableActions(
          { status: 'ACKNOWLEDGED' },
          role,
        );
        expect(ackActions.canAcknowledge).toBe(false);
        expect(ackActions.canAssign).toBe(true);
        expect(ackActions.canReassign).toBe(true);
        expect(ackActions.canChangeSeverity).toBe(true);
        expect(ackActions.canResolve).toBe(true);
        expect(ackActions.canDismiss).toBe(true);
        expect(ackActions.canReopen).toBe(false);

        const resolvedActions = getAvailableActions(
          { status: 'RESOLVED' },
          role,
        );
        expect(resolvedActions.canAcknowledge).toBe(false);
        expect(resolvedActions.canAssign).toBe(false);
        expect(resolvedActions.canReassign).toBe(false);
        expect(resolvedActions.canChangeSeverity).toBe(false);
        expect(resolvedActions.canResolve).toBe(false);
        expect(resolvedActions.canDismiss).toBe(false);
        expect(resolvedActions.canReopen).toBe(true);

        const dismissedActions = getAvailableActions(
          { status: 'DISMISSED' },
          role,
        );
        expect(dismissedActions.canReopen).toBe(true);
      }
    });
  });

  // ==========================================================================
  // 4. Input Schema Validation Invariants (AC-001, AC-004)
  // ==========================================================================
  describe('Zod Validation Boundary Invariants', () => {
    const validUuid = '00000000-0000-4000-8000-000000000001';

    it('rejects empty summary or business impact on open', () => {
      const parsed = openOperationalExceptionSchema.safeParse({
        requestId: validUuid,
        exceptionType: 'production.deadline_breached',
        primaryResourceType: 'PRODUCTION_JOB',
        primaryResourceId: validUuid,
        severity: 'HIGH',
        sourceKind: 'HUMAN_REPORT',
        responsibleRoleCode: 'OPERATIONS',
        summary: '   ',
        businessImpact: 'Valid impact',
      });
      expect(parsed.success).toBe(false);
    });

    it('requires otherCategoryReason when exceptionType is other.operational_abnormality', () => {
      const invalidParse = openOperationalExceptionSchema.safeParse({
        requestId: validUuid,
        exceptionType: 'other.operational_abnormality',
        primaryResourceType: 'ORDER',
        primaryResourceId: validUuid,
        severity: 'HIGH',
        sourceKind: 'HUMAN_REPORT',
        responsibleRoleCode: 'OPERATIONS',
        summary: 'Valid summary text',
        businessImpact: 'Valid business impact text',
      });
      expect(invalidParse.success).toBe(false);

      const validParse = openOperationalExceptionSchema.safeParse({
        requestId: validUuid,
        exceptionType: 'other.operational_abnormality',
        primaryResourceType: 'ORDER',
        primaryResourceId: validUuid,
        severity: 'HIGH',
        sourceKind: 'HUMAN_REPORT',
        responsibleRoleCode: 'OPERATIONS',
        summary: 'Valid summary text',
        businessImpact: 'Valid business impact text',
        otherCategoryReason: 'Detailed reason explaining abnormality',
      });
      expect(validParse.success).toBe(true);
    });

    it('requires duplicateOfExceptionId when dismissal reason is DUPLICATE', () => {
      const invalidParse = dismissOperationalExceptionSchema.safeParse({
        requestId: validUuid,
        exceptionId: validUuid,
        expectedRevision: 1,
        dismissalReason: 'DUPLICATE',
        reasonSummary: 'Duplicate of previous exception',
      });
      expect(invalidParse.success).toBe(false);

      const validParse = dismissOperationalExceptionSchema.safeParse({
        requestId: validUuid,
        exceptionId: validUuid,
        expectedRevision: 1,
        dismissalReason: 'DUPLICATE',
        reasonSummary: 'Duplicate of previous exception',
        duplicateOfExceptionId: '00000000-0000-4000-8000-000000000002',
      });
      expect(validParse.success).toBe(true);
    });

    it('requires supersededByExceptionId when resolution type is SUPERSEDED', () => {
      const invalidParse = resolveOperationalExceptionSchema.safeParse({
        requestId: validUuid,
        exceptionId: validUuid,
        expectedRevision: 1,
        resolutionType: 'SUPERSEDED',
        resolutionSummary: 'Superseded by newer exception',
      });
      expect(invalidParse.success).toBe(false);

      const validParse = resolveOperationalExceptionSchema.safeParse({
        requestId: validUuid,
        exceptionId: validUuid,
        expectedRevision: 1,
        resolutionType: 'SUPERSEDED',
        resolutionSummary: 'Superseded by newer exception',
        supersededByExceptionId: '00000000-0000-4000-8000-000000000002',
      });
      expect(validParse.success).toBe(true);
    });
  });

  // ==========================================================================
  // 5. Console UI Rendering & Formatting Determinism (AC-006)
  // ==========================================================================
  describe('Console Presentation Determinism', () => {
    it('renders deterministic badge labels and colors for all severities', () => {
      expect(formatSeverityBadge('CRITICAL').label).toBe('KRITIS');
      expect(formatSeverityBadge('HIGH').label).toBe('TINGGI');
      expect(formatSeverityBadge('MEDIUM').label).toBe('SEDANG');
      expect(formatSeverityBadge('LOW').label).toBe('RENDAH');
    });

    it('renders deterministic badge labels for all statuses', () => {
      expect(formatStatusBadge('OPEN').label).toBe('TERBUKA (OPEN)');
      expect(formatStatusBadge('ACKNOWLEDGED').label).toBe('DIKETAHUI (ACK)');
      expect(formatStatusBadge('RESOLVED').label).toBe('SELESAI (RESOLVED)');
      expect(formatStatusBadge('DISMISSED').label).toBe('DITOLAK (DISMISSED)');
    });

    it('translates database and API error codes into human-friendly explanations', () => {
      expect(translateErrorCode('STALE_REVISION')).toContain(
        'telah diperbarui oleh pengguna lain',
      );
      expect(translateErrorCode('BUSINESS_DUPLICATE')).toContain(
        'Exception serupa yang masih aktif sudah ada',
      );
      expect(translateErrorCode('IDEMPOTENCY_CONFLICT')).toContain(
        'Konflik permintaan',
      );
      expect(translateErrorCode('UNAUTHORIZED')).toContain('Akses ditolak');
    });
  });
});
