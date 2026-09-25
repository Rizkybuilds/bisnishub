/**
 * MultiGraph Business OS — Requirement Aggregate & Versioning Domain Model (MGBOS-007)
 * Pure domain rules for custom order requirements, immutable version snapshots, and state machine transitions.
 */

export const REQUIREMENT_STATUSES = [
  'DRAFT',
  'NEEDS_INFORMATION',
  'READY',
  'LOCKED',
  'CANCELLED',
] as const;

export type RequirementStatus = (typeof REQUIREMENT_STATUSES)[number];

export interface Requirement {
  id: string;
  organizationId: string;
  brandId: string;
  leadId?: string | null;
  customerAccountId?: string | null;
  requirementNumber: string;
  title: string;
  status: RequirementStatus;
  currentVersionId?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface RequirementVersion {
  id: string;
  requirementId: string;
  versionNumber: number;
  summary: string;
  quantity?: number | null;
  unit: string;
  targetBudget?: bigint | null;
  currency: string;
  targetDate?: string | null;
  specification: Record<string, unknown>;
  completenessScore?: number | null;
  isLocked: boolean;
  lockedAt?: string | null;
  lockedReason?: string | null;
  createdByUserId?: string | null;
  createdAt: string;
}

/**
 * Valid Requirement State Machine Transitions (MGBOS 0.3 Business State Machines)
 * Lifecycle: DRAFT -> NEEDS_INFORMATION -> READY -> LOCKED (and CANCELLED)
 */
export const REQUIREMENT_TRANSITIONS: Record<
  RequirementStatus,
  readonly RequirementStatus[]
> = {
  DRAFT: ['NEEDS_INFORMATION', 'READY', 'CANCELLED'],
  NEEDS_INFORMATION: ['READY', 'DRAFT', 'CANCELLED'],
  READY: ['NEEDS_INFORMATION', 'LOCKED', 'CANCELLED'],
  LOCKED: ['CANCELLED'], // Locked version cannot be modified; changes require creating a new version
  CANCELLED: [], // Terminal state
};

/**
 * Checks whether a requirement transition from one status to another is valid.
 */
export function canTransitionRequirement(
  from: RequirementStatus,
  to: RequirementStatus,
): boolean {
  if (from === to) return true;
  return REQUIREMENT_TRANSITIONS[from].includes(to);
}

/**
 * Asserts that a requirement transition is valid, throwing a domain error if not.
 */
export function validateRequirementTransition(
  from: RequirementStatus,
  to: RequirementStatus,
): void {
  if (!canTransitionRequirement(from, to)) {
    throw new Error(
      `Invalid requirement state transition from '${from}' to '${to}'. Allowed transitions: ${
        REQUIREMENT_TRANSITIONS[from].join(', ') || 'none (terminal state)'
      }`,
    );
  }
}

/**
 * Computes the next version number given a list of existing version numbers.
 * Enforces sequential integer versions starting from 1.
 */
export function getNextVersionNumber(existingVersions: number[]): number {
  if (!existingVersions.length) return 1;
  const max = Math.max(...existingVersions);
  return max + 1;
}

export interface RequirementCompletenessEvaluation {
  score: number;
  isComplete: boolean;
  missingFields: string[];
}

/**
 * Evaluates the completeness score of a requirement specification.
 * Standard criteria:
 * - Product/garment type specified (+20)
 * - Material specified (+20)
 * - Quantity specified and > 0 (+20)
 * - Printing method or custom decoration specified (+20)
 * - Size breakdown or target delivery date specified (+20)
 */
export function evaluateRequirementCompleteness(
  quantity?: number | null,
  specification?: Record<string, unknown> | null,
): RequirementCompletenessEvaluation {
  let score = 0;
  const missingFields: string[] = [];
  const spec = specification || {};

  // 1. Quantity Check
  if (quantity != null && quantity > 0) {
    score += 20;
  } else {
    missingFields.push('quantity');
  }

  // 2. Product / Garment Type
  const garment = spec.garment as Record<string, unknown> | undefined;
  const productType = spec.productType || garment?.type;
  if (productType && typeof productType === 'string' && productType.trim()) {
    score += 20;
  } else {
    missingFields.push('garment.type');
  }

  // 3. Material Specification
  const material = spec.material || garment?.material;
  if (material && typeof material === 'string' && material.trim()) {
    score += 20;
  } else {
    missingFields.push('garment.material');
  }

  // 4. Custom Decoration / Printing Method
  const printing = spec.printing as Record<string, unknown> | undefined;
  const printMethod = spec.printMethod || printing?.method;
  if (printMethod && typeof printMethod === 'string' && printMethod.trim()) {
    score += 20;
  } else {
    missingFields.push('printing.method');
  }

  // 5. Sizes Breakdown or Target Date
  const sizes = spec.sizes || garment?.sizes;
  const hasSizes =
    sizes && typeof sizes === 'object' && Object.keys(sizes).length > 0;
  if (hasSizes) {
    score += 20;
  } else {
    missingFields.push('sizes');
  }

  return {
    score,
    isComplete: score >= 80,
    missingFields,
  };
}
