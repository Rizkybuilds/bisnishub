import { z } from 'zod';
import {
  PRODUCTION_JOB_TYPES,
  PRODUCTION_JOB_STATUSES,
  PRODUCTION_JOB_PRIORITIES,
  EXECUTOR_TYPES,
  PRODUCTION_ASSIGNMENT_STATUSES,
} from '@mgbos/domain';

export const productionJobTypeSchema = z.enum(PRODUCTION_JOB_TYPES);
export const productionJobStatusSchema = z.enum(PRODUCTION_JOB_STATUSES);
export const productionJobPrioritySchema = z.enum(PRODUCTION_JOB_PRIORITIES);
export const executorTypeSchema = z.enum(EXECUTOR_TYPES);
export const productionAssignmentStatusSchema = z.enum(
  PRODUCTION_ASSIGNMENT_STATUSES,
);

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

export const assignProductionJobSchema = z
  .object({
    jobId: z.string().uuid('ID job tidak valid'),
    executorType: executorTypeSchema,
    vendorId: z.string().uuid('ID vendor tidak valid').optional().nullable(),
    vendorName: z.string().max(200).optional().nullable(),
    assignedBrandId: z
      .string()
      .uuid('ID brand tidak valid')
      .optional()
      .nullable(),
    assignedCost: z.coerce
      .bigint()
      .nonnegative('Biaya komitmen tidak boleh negatif')
      .default(0n),
    notes: z.string().max(1000).optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.executorType === 'INTERNAL') {
        return !!data.assignedBrandId;
      }
      if (data.executorType === 'VENDOR') {
        return (
          !!data.vendorId ||
          (!!data.vendorName && data.vendorName.trim().length >= 2)
        );
      }
      return true;
    },
    {
      message:
        'Pelaksana wajib ditentukan: pilih unit brand internal atau mitra vendor',
      path: ['executorType'],
    },
  );

export type AssignProductionJobInput = z.infer<
  typeof assignProductionJobSchema
>;

export const acceptProductionAssignmentSchema = z.object({
  assignmentId: z.string().uuid('ID penugasan tidak valid'),
});

export type AcceptProductionAssignmentInput = z.infer<
  typeof acceptProductionAssignmentSchema
>;

export const declineProductionAssignmentSchema = z.object({
  assignmentId: z.string().uuid('ID penugasan tidak valid'),
  reason: z
    .string()
    .min(3, 'Alasan penolakan minimal 3 karakter')
    .max(1000, 'Alasan penolakan maksimal 1000 karakter')
    .optional()
    .nullable(),
});

export type DeclineProductionAssignmentInput = z.infer<
  typeof declineProductionAssignmentSchema
>;

export const cancelProductionAssignmentSchema = z.object({
  assignmentId: z.string().uuid('ID penugasan tidak valid'),
  reason: z
    .string()
    .min(3, 'Alasan pembatalan minimal 3 karakter')
    .max(1000, 'Alasan pembatalan maksimal 1000 karakter')
    .optional()
    .nullable(),
});

export type CancelProductionAssignmentInput = z.infer<
  typeof cancelProductionAssignmentSchema
>;

export const reassignProductionJobSchema = assignProductionJobSchema.and(
  z.object({
    reason: z
      .string()
      .min(3, 'Alasan penugasan ulang minimal 3 karakter')
      .max(1000, 'Alasan penugasan ulang maksimal 1000 karakter')
      .optional()
      .nullable(),
  }),
);

export type ReassignProductionJobInput = z.infer<
  typeof reassignProductionJobSchema
>;
