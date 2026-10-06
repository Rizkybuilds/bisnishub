import { describe, expect, it } from 'vitest';
import {
  canChangeOperationalExceptionSeverity,
  getOperationalExceptionCategoryForType,
  getRequiredPrimaryResourceType,
  isOperationalExceptionActive,
  isP2aSourceKindAllowed,
  isPrimaryResourceTypeAllowedForType,
  OPERATIONAL_EXCEPTION_CATEGORIES,
  OPERATIONAL_EXCEPTION_DISMISSAL_REASONS,
  OPERATIONAL_EXCEPTION_RESOLUTION_TYPES,
  OPERATIONAL_EXCEPTION_RESOURCE_TYPES,
  OPERATIONAL_EXCEPTION_SEVERITIES,
  OPERATIONAL_EXCEPTION_SOURCE_KINDS,
  OPERATIONAL_EXCEPTION_STATUSES,
  OPERATIONAL_EXCEPTION_TYPES,
  requiresDuplicateTarget,
  requiresOwnerForResolution,
  requiresSupersededTarget,
  RESPONSIBLE_ROLE_CODES,
  validateOperationalExceptionTransition,
} from './operationalException';

describe('Operational Exception Domain Model', () => {
  describe('Controlled Vocabularies', () => {
    it('defines exact canonical categories (11)', () => {
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toHaveLength(11);
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('COMMERCIAL');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('FINANCIAL');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('PRODUCTION');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('VENDOR');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('QUALITY');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('FULFILLMENT');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain(
        'INVENTORY_PROCUREMENT',
      );
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('DATA_INTEGRITY');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('AUTOMATION_IMPACT');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('POLICY_COMPLIANCE');
      expect(OPERATIONAL_EXCEPTION_CATEGORIES).toContain('OTHER');
    });

    it('defines bounded P2-A exception types (8)', () => {
      expect(OPERATIONAL_EXCEPTION_TYPES).toHaveLength(8);
      expect(OPERATIONAL_EXCEPTION_TYPES).toEqual([
        'production.deadline_breached',
        'vendor.commitment_problem',
        'quality.qc_failed',
        'fulfillment.delivery_problem',
        'financial.receivable_past_due',
        'financial.actual_cost_missing',
        'financial.margin_exception',
        'other.operational_abnormality',
      ]);
    });

    it('defines exact canonical statuses (4) without persisted REOPENED', () => {
      expect(OPERATIONAL_EXCEPTION_STATUSES).toEqual([
        'OPEN',
        'ACKNOWLEDGED',
        'RESOLVED',
        'DISMISSED',
      ]);
      expect(OPERATIONAL_EXCEPTION_STATUSES).not.toContain('REOPENED');
    });

    it('defines exact severity levels (4)', () => {
      expect(OPERATIONAL_EXCEPTION_SEVERITIES).toEqual([
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL',
      ]);
    });

    it('defines source kinds (5)', () => {
      expect(OPERATIONAL_EXCEPTION_SOURCE_KINDS).toEqual([
        'DETERMINISTIC_RULE',
        'HUMAN_REPORT',
        'AUTOMATION_SIGNAL',
        'EXTERNAL_SIGNAL',
        'RECONCILIATION',
      ]);
    });

    it('defines resolution types (5)', () => {
      expect(OPERATIONAL_EXCEPTION_RESOLUTION_TYPES).toEqual([
        'REMEDIATED',
        'WORKAROUND',
        'SOURCE_CORRECTED',
        'ACCEPTED_RISK',
        'SUPERSEDED',
      ]);
    });

    it('defines dismissal reasons (4)', () => {
      expect(OPERATIONAL_EXCEPTION_DISMISSAL_REASONS).toEqual([
        'FALSE_POSITIVE',
        'DUPLICATE',
        'NOT_APPLICABLE',
        'OPENED_IN_ERROR',
      ]);
      expect(OPERATIONAL_EXCEPTION_DISMISSAL_REASONS).not.toContain(
        'ACCEPTED_RISK',
      );
    });

    it('defines primary resource types (6)', () => {
      expect(OPERATIONAL_EXCEPTION_RESOURCE_TYPES).toEqual([
        'ORDER',
        'PRODUCTION_JOB',
        'PRODUCTION_ASSIGNMENT',
        'QC_INSPECTION',
        'INVOICE',
        'SHIPMENT',
      ]);
    });

    it('defines responsible role codes (6)', () => {
      expect(RESPONSIBLE_ROLE_CODES).toEqual([
        'OWNER',
        'ADMIN',
        'SALES',
        'OPERATIONS',
        'FINANCE',
        'QC',
      ]);
    });
  });

  describe('Deterministic Mappings (Sections 21 & 26)', () => {
    it('maps every type to its correct category', () => {
      expect(
        getOperationalExceptionCategoryForType('production.deadline_breached'),
      ).toBe('PRODUCTION');
      expect(
        getOperationalExceptionCategoryForType('vendor.commitment_problem'),
      ).toBe('VENDOR');
      expect(getOperationalExceptionCategoryForType('quality.qc_failed')).toBe(
        'QUALITY',
      );
      expect(
        getOperationalExceptionCategoryForType('fulfillment.delivery_problem'),
      ).toBe('FULFILLMENT');
      expect(
        getOperationalExceptionCategoryForType('financial.receivable_past_due'),
      ).toBe('FINANCIAL');
      expect(
        getOperationalExceptionCategoryForType('financial.actual_cost_missing'),
      ).toBe('FINANCIAL');
      expect(
        getOperationalExceptionCategoryForType('financial.margin_exception'),
      ).toBe('FINANCIAL');
      expect(
        getOperationalExceptionCategoryForType('other.operational_abnormality'),
      ).toBe('OTHER');
    });

    it('maps typed exceptions to their required primary resource type', () => {
      expect(
        getRequiredPrimaryResourceType('production.deadline_breached'),
      ).toBe('PRODUCTION_JOB');
      expect(getRequiredPrimaryResourceType('vendor.commitment_problem')).toBe(
        'PRODUCTION_ASSIGNMENT',
      );
      expect(getRequiredPrimaryResourceType('quality.qc_failed')).toBe(
        'QC_INSPECTION',
      );
      expect(
        getRequiredPrimaryResourceType('fulfillment.delivery_problem'),
      ).toBe('SHIPMENT');
      expect(
        getRequiredPrimaryResourceType('financial.receivable_past_due'),
      ).toBe('INVOICE');
      expect(
        getRequiredPrimaryResourceType('financial.actual_cost_missing'),
      ).toBe('PRODUCTION_JOB');
      expect(getRequiredPrimaryResourceType('financial.margin_exception')).toBe(
        'ORDER',
      );
      expect(
        getRequiredPrimaryResourceType('other.operational_abnormality'),
      ).toBeNull();
    });

    it('validates allowed resource types for each exception type', () => {
      expect(
        isPrimaryResourceTypeAllowedForType(
          'production.deadline_breached',
          'PRODUCTION_JOB',
        ),
      ).toBe(true);
      expect(
        isPrimaryResourceTypeAllowedForType(
          'production.deadline_breached',
          'ORDER',
        ),
      ).toBe(false);

      // 'other' allows any governed resource type
      expect(
        isPrimaryResourceTypeAllowedForType(
          'other.operational_abnormality',
          'ORDER',
        ),
      ).toBe(true);
      expect(
        isPrimaryResourceTypeAllowedForType(
          'other.operational_abnormality',
          'SHIPMENT',
        ),
      ).toBe(true);
    });
  });

  describe('Lifecycle State Transitions', () => {
    it('identifies active statuses correctly', () => {
      expect(isOperationalExceptionActive('OPEN')).toBe(true);
      expect(isOperationalExceptionActive('ACKNOWLEDGED')).toBe(true);
      expect(isOperationalExceptionActive('RESOLVED')).toBe(false);
      expect(isOperationalExceptionActive('DISMISSED')).toBe(false);
    });

    it('allows valid transitions from OPEN', () => {
      expect(
        validateOperationalExceptionTransition('OPEN', 'ACKNOWLEDGED'),
      ).toEqual({ valid: true });
      expect(
        validateOperationalExceptionTransition('OPEN', 'RESOLVED'),
      ).toEqual({ valid: true });
      expect(
        validateOperationalExceptionTransition('OPEN', 'DISMISSED'),
      ).toEqual({ valid: true });
    });

    it('allows valid transitions from ACKNOWLEDGED', () => {
      expect(
        validateOperationalExceptionTransition('ACKNOWLEDGED', 'RESOLVED'),
      ).toEqual({ valid: true });
      expect(
        validateOperationalExceptionTransition('ACKNOWLEDGED', 'DISMISSED'),
      ).toEqual({ valid: true });
      expect(
        validateOperationalExceptionTransition('ACKNOWLEDGED', 'OPEN').valid,
      ).toBe(false);
    });

    it('allows reopen from RESOLVED or DISMISSED back to OPEN', () => {
      expect(
        validateOperationalExceptionTransition('RESOLVED', 'OPEN'),
      ).toEqual({ valid: true });
      expect(
        validateOperationalExceptionTransition('DISMISSED', 'OPEN'),
      ).toEqual({ valid: true });
    });

    it('rejects self-transitions', () => {
      expect(validateOperationalExceptionTransition('OPEN', 'OPEN')).toEqual({
        valid: false,
        reason: 'Cannot transition from OPEN to itself',
      });
      expect(
        validateOperationalExceptionTransition('RESOLVED', 'RESOLVED'),
      ).toEqual({
        valid: false,
        reason: 'Cannot transition from RESOLVED to itself',
      });
    });

    it('rejects direct RESOLVED -> DISMISSED or DISMISSED -> RESOLVED', () => {
      expect(
        validateOperationalExceptionTransition('RESOLVED', 'DISMISSED').valid,
      ).toBe(false);
      expect(
        validateOperationalExceptionTransition('DISMISSED', 'RESOLVED').valid,
      ).toBe(false);
    });
  });

  describe('Severity Modification Rules', () => {
    it('allows severity change on active exceptions with distinct severity', () => {
      expect(
        canChangeOperationalExceptionSeverity('OPEN', 'LOW', 'HIGH'),
      ).toEqual({ allowed: true });
      expect(
        canChangeOperationalExceptionSeverity('ACKNOWLEDGED', 'MEDIUM', 'LOW'),
      ).toEqual({ allowed: true });
    });

    it('rejects no-op severity changes', () => {
      expect(
        canChangeOperationalExceptionSeverity('OPEN', 'HIGH', 'HIGH'),
      ).toEqual({
        allowed: false,
        reason: 'New severity must be different from current severity',
      });
    });

    it('rejects severity changes on closed exceptions', () => {
      expect(
        canChangeOperationalExceptionSeverity('RESOLVED', 'LOW', 'HIGH'),
      ).toEqual({
        allowed: false,
        reason:
          'Cannot change severity of exception with status RESOLVED: only OPEN or ACKNOWLEDGED exceptions can be modified',
      });
      expect(
        canChangeOperationalExceptionSeverity('DISMISSED', 'LOW', 'HIGH'),
      ).toEqual({
        allowed: false,
        reason:
          'Cannot change severity of exception with status DISMISSED: only OPEN or ACKNOWLEDGED exceptions can be modified',
      });
    });
  });

  describe('Authority and Target Invariants', () => {
    it('requires OWNER authority for ACCEPTED_RISK resolution only', () => {
      expect(requiresOwnerForResolution('ACCEPTED_RISK')).toBe(true);
      expect(requiresOwnerForResolution('REMEDIATED')).toBe(false);
      expect(requiresOwnerForResolution('WORKAROUND')).toBe(false);
      expect(requiresOwnerForResolution('SOURCE_CORRECTED')).toBe(false);
      expect(requiresOwnerForResolution('SUPERSEDED')).toBe(false);
    });

    it('requires duplicate target for DUPLICATE dismissal only', () => {
      expect(requiresDuplicateTarget('DUPLICATE')).toBe(true);
      expect(requiresDuplicateTarget('FALSE_POSITIVE')).toBe(false);
      expect(requiresDuplicateTarget('NOT_APPLICABLE')).toBe(false);
      expect(requiresDuplicateTarget('OPENED_IN_ERROR')).toBe(false);
    });

    it('requires superseded target for SUPERSEDED resolution only', () => {
      expect(requiresSupersededTarget('SUPERSEDED')).toBe(true);
      expect(requiresSupersededTarget('REMEDIATED')).toBe(false);
      expect(requiresSupersededTarget('ACCEPTED_RISK')).toBe(false);
    });

    it('verifies P2-A allowed opening source kinds', () => {
      expect(isP2aSourceKindAllowed('HUMAN_REPORT')).toBe(true);
      expect(isP2aSourceKindAllowed('RECONCILIATION')).toBe(true);
      expect(isP2aSourceKindAllowed('DETERMINISTIC_RULE')).toBe(false);
      expect(isP2aSourceKindAllowed('AUTOMATION_SIGNAL')).toBe(false);
      expect(isP2aSourceKindAllowed('EXTERNAL_SIGNAL')).toBe(false);
    });
  });
});
