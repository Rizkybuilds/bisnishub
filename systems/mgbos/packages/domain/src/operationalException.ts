/**
 * MultiGraph Business OS — Operational Exception Domain Service (P2-A / WP01)
 *
 * Authoritative pure domain contracts for Operational Exception:
 * - Controlled category, type, status, severity, source, resolution, and dismissal vocabularies
 * - Canonical lifecycle state transitions and active state definitions
 * - Type-to-category and type-to-primary-resource deterministic mappings
 * - Owner-only Accepted Risk rule and target reference guards
 *
 * This module is pure and database-independent.
 */

// ============================================================================
// 1. Controlled Vocabularies
// ============================================================================

export const OPERATIONAL_EXCEPTION_CATEGORIES = [
  'COMMERCIAL',
  'FINANCIAL',
  'PRODUCTION',
  'VENDOR',
  'QUALITY',
  'FULFILLMENT',
  'INVENTORY_PROCUREMENT',
  'DATA_INTEGRITY',
  'AUTOMATION_IMPACT',
  'POLICY_COMPLIANCE',
  'OTHER',
] as const;

export type OperationalExceptionCategory =
  (typeof OPERATIONAL_EXCEPTION_CATEGORIES)[number];

export const OPERATIONAL_EXCEPTION_TYPES = [
  'production.deadline_breached',
  'vendor.commitment_problem',
  'quality.qc_failed',
  'fulfillment.delivery_problem',
  'financial.receivable_past_due',
  'financial.actual_cost_missing',
  'financial.margin_exception',
  'other.operational_abnormality',
] as const;

export type OperationalExceptionType =
  (typeof OPERATIONAL_EXCEPTION_TYPES)[number];

export const OPERATIONAL_EXCEPTION_STATUSES = [
  'OPEN',
  'ACKNOWLEDGED',
  'RESOLVED',
  'DISMISSED',
] as const;

export type OperationalExceptionStatus =
  (typeof OPERATIONAL_EXCEPTION_STATUSES)[number];

export const OPERATIONAL_EXCEPTION_SEVERITIES = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
] as const;

export type OperationalExceptionSeverity =
  (typeof OPERATIONAL_EXCEPTION_SEVERITIES)[number];

export const OPERATIONAL_EXCEPTION_SOURCE_KINDS = [
  'DETERMINISTIC_RULE',
  'HUMAN_REPORT',
  'AUTOMATION_SIGNAL',
  'EXTERNAL_SIGNAL',
  'RECONCILIATION',
] as const;

export type OperationalExceptionSourceKind =
  (typeof OPERATIONAL_EXCEPTION_SOURCE_KINDS)[number];

export const OPERATIONAL_EXCEPTION_RESOLUTION_TYPES = [
  'REMEDIATED',
  'WORKAROUND',
  'SOURCE_CORRECTED',
  'ACCEPTED_RISK',
  'SUPERSEDED',
] as const;

export type OperationalExceptionResolutionType =
  (typeof OPERATIONAL_EXCEPTION_RESOLUTION_TYPES)[number];

export const OPERATIONAL_EXCEPTION_DISMISSAL_REASONS = [
  'FALSE_POSITIVE',
  'DUPLICATE',
  'NOT_APPLICABLE',
  'OPENED_IN_ERROR',
] as const;

export type OperationalExceptionDismissalReason =
  (typeof OPERATIONAL_EXCEPTION_DISMISSAL_REASONS)[number];

export const OPERATIONAL_EXCEPTION_RESOURCE_TYPES = [
  'ORDER',
  'PRODUCTION_JOB',
  'PRODUCTION_ASSIGNMENT',
  'QC_INSPECTION',
  'INVOICE',
  'SHIPMENT',
] as const;

export type OperationalExceptionResourceType =
  (typeof OPERATIONAL_EXCEPTION_RESOURCE_TYPES)[number];

export const RESPONSIBLE_ROLE_CODES = [
  'OWNER',
  'ADMIN',
  'SALES',
  'OPERATIONS',
  'FINANCE',
  'QC',
] as const;

export type ResponsibleRoleCode = (typeof RESPONSIBLE_ROLE_CODES)[number];

// ============================================================================
// 2. Deterministic Category & Resource Mappings (Sections 21 & 26)
// ============================================================================

export const EXCEPTION_TYPE_TO_CATEGORY: Record<
  OperationalExceptionType,
  OperationalExceptionCategory
> = {
  'production.deadline_breached': 'PRODUCTION',
  'vendor.commitment_problem': 'VENDOR',
  'quality.qc_failed': 'QUALITY',
  'fulfillment.delivery_problem': 'FULFILLMENT',
  'financial.receivable_past_due': 'FINANCIAL',
  'financial.actual_cost_missing': 'FINANCIAL',
  'financial.margin_exception': 'FINANCIAL',
  'other.operational_abnormality': 'OTHER',
};

export const EXCEPTION_TYPE_TO_RESOURCE: Record<
  Exclude<OperationalExceptionType, 'other.operational_abnormality'>,
  OperationalExceptionResourceType
> = {
  'production.deadline_breached': 'PRODUCTION_JOB',
  'vendor.commitment_problem': 'PRODUCTION_ASSIGNMENT',
  'quality.qc_failed': 'QC_INSPECTION',
  'fulfillment.delivery_problem': 'SHIPMENT',
  'financial.receivable_past_due': 'INVOICE',
  'financial.actual_cost_missing': 'PRODUCTION_JOB',
  'financial.margin_exception': 'ORDER',
};

// ============================================================================
// 3. Allowed Transitions Matrix (Section 13 & 38)
// ============================================================================

export const ALLOWED_OPERATIONAL_EXCEPTION_TRANSITIONS: Record<
  OperationalExceptionStatus,
  readonly OperationalExceptionStatus[]
> = {
  OPEN: ['ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'],
  ACKNOWLEDGED: ['RESOLVED', 'DISMISSED'],
  RESOLVED: ['OPEN'], // Via reopen
  DISMISSED: ['OPEN'], // Via reopen
};

// ============================================================================
// 4. Pure Domain Helper Functions
// ============================================================================

/**
 * Returns true if the status represents an active abnormality.
 * Active states are OPEN and ACKNOWLEDGED.
 */
export function isOperationalExceptionActive(
  status: OperationalExceptionStatus,
): boolean {
  return status === 'OPEN' || status === 'ACKNOWLEDGED';
}

/**
 * Validates whether a lifecycle state transition is canonical.
 */
export function validateOperationalExceptionTransition(
  fromStatus: OperationalExceptionStatus,
  toStatus: OperationalExceptionStatus,
): { valid: boolean; reason?: string } {
  if (fromStatus === toStatus) {
    return {
      valid: false,
      reason: `Cannot transition from ${fromStatus} to itself`,
    };
  }

  const allowedTargets = ALLOWED_OPERATIONAL_EXCEPTION_TRANSITIONS[fromStatus];
  if (!allowedTargets.includes(toStatus)) {
    return {
      valid: false,
      reason: `Transition from ${fromStatus} to ${toStatus} is not permitted in canonical lifecycle`,
    };
  }

  return { valid: true };
}

/**
 * Checks whether severity may be modified.
 * Allowed only on active statuses (OPEN, ACKNOWLEDGED) and must be a distinct value.
 */
export function canChangeOperationalExceptionSeverity(
  status: OperationalExceptionStatus,
  currentSeverity: OperationalExceptionSeverity,
  newSeverity: OperationalExceptionSeverity,
): { allowed: boolean; reason?: string } {
  if (!isOperationalExceptionActive(status)) {
    return {
      allowed: false,
      reason: `Cannot change severity of exception with status ${status}: only OPEN or ACKNOWLEDGED exceptions can be modified`,
    };
  }

  if (currentSeverity === newSeverity) {
    return {
      allowed: false,
      reason: 'New severity must be different from current severity',
    };
  }

  return { allowed: true };
}

/**
 * Invariant: Accepted Risk requires OWNER authority.
 * Returns true if the resolution type requires OWNER authority.
 */
export function requiresOwnerForResolution(
  resolutionType: OperationalExceptionResolutionType,
): boolean {
  return resolutionType === 'ACCEPTED_RISK';
}

/**
 * Invariant: DUPLICATE dismissal requires a duplicate target Exception ID.
 */
export function requiresDuplicateTarget(
  dismissalReason: OperationalExceptionDismissalReason,
): boolean {
  return dismissalReason === 'DUPLICATE';
}

/**
 * Invariant: SUPERSEDED resolution requires a superseded_by target Exception ID.
 */
export function requiresSupersededTarget(
  resolutionType: OperationalExceptionResolutionType,
): boolean {
  return resolutionType === 'SUPERSEDED';
}

/**
 * Resolves the deterministic category for an exception type.
 */
export function getOperationalExceptionCategoryForType(
  type: OperationalExceptionType,
): OperationalExceptionCategory {
  return EXCEPTION_TYPE_TO_CATEGORY[type];
}

/**
 * Resolves the required primary resource type for an exception type.
 * Returns null for 'other.operational_abnormality' which supports any governed resource type.
 */
export function getRequiredPrimaryResourceType(
  type: OperationalExceptionType,
): OperationalExceptionResourceType | null {
  if (type === 'other.operational_abnormality') {
    return null;
  }
  return EXCEPTION_TYPE_TO_RESOURCE[type];
}

/**
 * Validates if the given primary resource type is allowed for the exception type.
 */
export function isPrimaryResourceTypeAllowedForType(
  type: OperationalExceptionType,
  resourceType: OperationalExceptionResourceType,
): boolean {
  if (type === 'other.operational_abnormality') {
    return OPERATIONAL_EXCEPTION_RESOURCE_TYPES.includes(resourceType);
  }
  return EXCEPTION_TYPE_TO_RESOURCE[type] === resourceType;
}

/**
 * WP01 restricts opening source kinds to human-governed sources:
 * HUMAN_REPORT or RECONCILIATION.
 */
export function isP2aSourceKindAllowed(
  sourceKind: OperationalExceptionSourceKind,
): boolean {
  return sourceKind === 'HUMAN_REPORT' || sourceKind === 'RECONCILIATION';
}
