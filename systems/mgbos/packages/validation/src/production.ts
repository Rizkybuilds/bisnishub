import { z } from 'zod';
import {
  PRODUCTION_JOB_TYPES,
  PRODUCTION_JOB_STATUSES,
  PRODUCTION_JOB_PRIORITIES,
  EXECUTOR_TYPES,
} from '@mgbos/domain';

export const productionJobTypeSchema = z.enum(PRODUCTION_JOB_TYPES);
export const productionJobStatusSchema = z.enum(PRODUCTION_JOB_STATUSES);
export const productionJobPrioritySchema = z.enum(PRODUCTION_JOB_PRIORITIES);
export const executorTypeSchema = z.enum(EXECUTOR_TYPES);

export const productionJobItemSchema = z.object({
  order_item_id: z.string().uuid('ID item pesanan tidak valid'),
  quantity: z.number().int().positive('Jumlah harus bilangan bulat positif'),
  notes: z.string().max(500).optional().nullable(),
});

export type ProductionJobItemInput = z.infer<typeof productionJobItemSchema>;

export const createProductionJobSchema = z.object({
  orderId: z.string().uuid('ID pesanan tidak valid'),
  jobType: productionJobTypeSchema,
  title: z.string().min(3, 'Judul job minimal 3 karakter').max(200),
  estimatedCost: z.coerce
    .bigint()
    .nonnegative('Estimasi biaya tidak boleh negatif'),
  specification: z.record(z.string(), z.unknown()).default({}),
  items: z.array(productionJobItemSchema).default([]),
  priority: productionJobPrioritySchema.default('NORMAL'),
  targetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')
    .optional()
    .nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type CreateProductionJobInput = z.infer<
  typeof createProductionJobSchema
>;

export const transitionProductionJobSchema = z.object({
  jobId: z.string().uuid('ID job tidak valid'),
  toStatus: productionJobStatusSchema,
  reason: z.string().max(1000).optional().nullable(),
});

export type TransitionProductionJobInput = z.infer<
  typeof transitionProductionJobSchema
>;

export const assignProductionJobSchema = z.object({
  jobId: z.string().uuid('ID job tidak valid'),
  executorType: executorTypeSchema,
  vendorName: z.string().max(200).optional().nullable(),
  assignedBrandId: z.string().uuid().optional().nullable(),
  assignedCost: z.coerce.bigint().nonnegative().default(0n),
  notes: z.string().max(1000).optional().nullable(),
});

export type AssignProductionJobInput = z.infer<
  typeof assignProductionJobSchema
>;
