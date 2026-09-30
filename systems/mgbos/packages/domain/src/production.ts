/**
 * MultiGraph Business OS — Production Job Domain Service (MGBOS-012)
 * Pure domain contracts, status transitions, and cost tracking for Production Jobs.
 */

export const PRODUCTION_JOB_TYPES = [
  'GARMENT',
  'PRINTING',
  'EMBROIDERY',
  'PACKAGING',
  'LABEL',
  'FINISHING',
  'OTHER',
] as const;

export type ProductionJobType = (typeof PRODUCTION_JOB_TYPES)[number];

export const PRODUCTION_JOB_STATUSES = [
  'PLANNED',
  'READY',
  'ASSIGNED',
  'ACCEPTED',
  'IN_PRODUCTION',
  'AWAITING_QC',
  'REWORK',
  'READY_FOR_HANDOFF',
  'COMPLETED',
  'ON_HOLD',
  'CANCELLED',
] as const;

export type ProductionJobStatus = (typeof PRODUCTION_JOB_STATUSES)[number];

export const PRODUCTION_JOB_PRIORITIES = [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
] as const;

export type ProductionJobPriority = (typeof PRODUCTION_JOB_PRIORITIES)[number];

export const EXECUTOR_TYPES = ['INTERNAL', 'VENDOR'] as const;

export type ExecutorType = (typeof EXECUTOR_TYPES)[number];

export const VALID_PRODUCTION_TRANSITIONS: Record<
  ProductionJobStatus,
  readonly ProductionJobStatus[]
> = {
  PLANNED: ['READY', 'CANCELLED'],
  READY: ['ASSIGNED', 'PLANNED', 'CANCELLED'],
  ASSIGNED: ['ACCEPTED', 'READY', 'CANCELLED'],
  ACCEPTED: ['IN_PRODUCTION', 'ON_HOLD', 'CANCELLED'],
  IN_PRODUCTION: ['AWAITING_QC', 'ON_HOLD', 'CANCELLED'],
  AWAITING_QC: ['READY_FOR_HANDOFF', 'REWORK', 'ON_HOLD', 'CANCELLED'],
  REWORK: ['IN_PRODUCTION', 'AWAITING_QC', 'ON_HOLD', 'CANCELLED'],
  READY_FOR_HANDOFF: ['COMPLETED', 'ON_HOLD', 'CANCELLED'],
  ON_HOLD: [
    'ACCEPTED',
    'IN_PRODUCTION',
    'AWAITING_QC',
    'READY_FOR_HANDOFF',
    'CANCELLED',
  ],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Validates shop-floor state progression for a production job.
 */
export function validateProductionJobTransition(
  from: ProductionJobStatus,
  to: ProductionJobStatus,
): { valid: boolean; reason?: string } {
  if (from === to) {
    return { valid: true };
  }

  const allowed = VALID_PRODUCTION_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    return {
      valid: false,
      reason: `Transisi job produksi dari ${from} ke ${to} tidak valid dalam state machine`,
    };
  }

  return { valid: true };
}

export const PRODUCTION_MONEY_MAX = 9223372036854775807n;

/**
 * Enforces Zero-Float non-negative values for the Cost Trilogy.
 */
export function validateProductionJobCosts(
  estimatedCost: bigint,
  committedCost?: bigint | null,
  actualCost?: bigint | null,
) {
  if (estimatedCost < 0n || estimatedCost > PRODUCTION_MONEY_MAX) {
    throw new Error('Estimasi biaya produksi tidak valid');
  }

  if (
    committedCost !== undefined &&
    committedCost !== null &&
    (committedCost < 0n || committedCost > PRODUCTION_MONEY_MAX)
  ) {
    throw new Error('Biaya komitmen produksi tidak valid');
  }

  if (
    actualCost !== undefined &&
    actualCost !== null &&
    (actualCost < 0n || actualCost > PRODUCTION_MONEY_MAX)
  ) {
    throw new Error('Biaya aktual produksi tidak valid');
  }

  return {
    estimatedCost,
    committedCost: committedCost ?? null,
    actualCost: actualCost ?? null,
  };
}

export interface ProductionAssignmentInput {
  executorType: ExecutorType;
  assignedBrandId?: string | null;
  vendorId?: string | null;
  vendorName?: string | null;
  assignedCost: bigint;
}

/**
 * Validates domain invariants for assigning a production job to an internal unit
 * or an external vendor.
 */
export function validateProductionAssignment(
  input: ProductionAssignmentInput,
): { valid: boolean; reason?: string } {
  if (input.executorType === 'INTERNAL') {
    if (!input.assignedBrandId) {
      return {
        valid: false,
        reason: 'Unit brand internal wajib ditentukan untuk penugasan internal',
      };
    }
  } else if (input.executorType === 'VENDOR') {
    if (
      !input.vendorId &&
      (!input.vendorName || input.vendorName.trim().length < 2)
    ) {
      return {
        valid: false,
        reason:
          'Identitas vendor (vendorId atau nama vendor) wajib ditentukan untuk penugasan vendor',
      };
    }
  }

  if (input.assignedCost < 0n || input.assignedCost > PRODUCTION_MONEY_MAX) {
    return {
      valid: false,
      reason: 'Biaya komitmen pengerjaan tidak boleh negatif atau melebihi batas maksimum',
    };
  }

  return { valid: true };
}

export const PRODUCTION_ASSIGNMENT_STATUSES = [
  'ASSIGNED',
  'ACCEPTED',
  'DECLINED',
  'CANCELLED',
] as const;

export type ProductionAssignmentStatus =
  (typeof PRODUCTION_ASSIGNMENT_STATUSES)[number];

export const VALID_ASSIGNMENT_TRANSITIONS: Record<
  ProductionAssignmentStatus,
  readonly ProductionAssignmentStatus[]
> = {
  ASSIGNED: ['ACCEPTED', 'DECLINED', 'CANCELLED'],
  ACCEPTED: ['CANCELLED'],
  DECLINED: [],
  CANCELLED: [],
};

/**
 * Validates state progression for a production assignment.
 * Duplicate acceptance is treated as safe/idempotent (AC-12).
 */
export function validateProductionAssignmentTransition(
  from: ProductionAssignmentStatus,
  to: ProductionAssignmentStatus,
): { valid: boolean; reason?: string; isDuplicate?: boolean } {
  if (from === to) {
    if (to === 'ACCEPTED') {
      return { valid: true, isDuplicate: true };
    }
    return { valid: true };
  }

  const allowed = VALID_ASSIGNMENT_TRANSITIONS[from];
  if (!allowed || !allowed.includes(to)) {
    return {
      valid: false,
      reason: `Transisi penugasan produksi dari ${from} ke ${to} tidak valid dalam state machine`,
    };
  }

  return { valid: true };
}

/**
 * Evaluates whether a production job is eligible to receive a new assignment.
 * Prevents multiple conflicting active assignments (AC-09).
 */
export function canAssignProductionJob(
  jobStatus: ProductionJobStatus,
  hasActiveAssignment: boolean,
): { allowed: boolean; reason?: string } {
  if (hasActiveAssignment) {
    return {
      allowed: false,
      reason:
        'Job produksi sudah memiliki penugasan aktif (ASSIGNED/ACCEPTED). Tolak atau batalkan penugasan aktif sebelum menugaskan ulang.',
    };
  }

  if (jobStatus !== 'PLANNED' && jobStatus !== 'READY') {
    return {
      allowed: false,
      reason: `Job produksi dengan status ${jobStatus} tidak dapat ditugaskan. Status harus PLANNED atau READY.`,
    };
  }

  return { allowed: true };
}

