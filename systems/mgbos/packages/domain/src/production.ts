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
