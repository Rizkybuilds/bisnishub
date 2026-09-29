import { z } from 'zod';

const moneySchema = z.union([
  z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  z.bigint().min(0n).max(9223372036854775807n),
]);
const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    'Tanggal tidak valid',
  );

export const requirementStatusSchema = z.enum([
  'DRAFT',
  'NEEDS_INFORMATION',
  'READY',
  'LOCKED',
  'CANCELLED',
]);

export const createRequirementSchema = z.object({
  organizationId: z.string().uuid('Organization ID must be a valid UUID'),
  brandId: z.string().uuid('Brand ID must be a valid UUID'),
  leadId: z.string().uuid('Lead ID must be a valid UUID').optional().nullable(),
  customerAccountId: z
    .string()
    .uuid('Customer Account ID must be a valid UUID')
    .optional()
    .nullable(),
  title: z
    .string()
    .trim()
    .min(2, 'Judul kebutuhan minimal 2 karakter')
    .max(255, 'Judul kebutuhan maksimal 255 karakter'),
  // Initial Version payload
  summary: z
    .string()
    .trim()
    .min(2, 'Ringkasan kebutuhan versi minimal 2 karakter'),
  quantity: z
    .number()
    .int('Kuantiti harus bilangan bulat')
    .positive('Kuantiti harus lebih besar dari 0')
    .optional()
    .nullable(),
  unit: z.string().trim().min(1).max(24).default('PCS'),
  targetBudget: moneySchema.optional().nullable(),
  targetDate: dateSchema.optional().nullable(),
  specification: z.record(z.string(), z.unknown()).default({}),
});

export type CreateRequirementInput = z.infer<typeof createRequirementSchema>;

export const createRequirementVersionSchema = z.object({
  requirementId: z.string().uuid('Requirement ID must be a valid UUID'),
  summary: z
    .string()
    .trim()
    .min(2, 'Ringkasan kebutuhan versi minimal 2 karakter'),
  quantity: z
    .number()
    .int('Kuantiti harus bilangan bulat')
    .positive('Kuantiti harus lebih besar dari 0')
    .optional()
    .nullable(),
  unit: z.string().trim().min(1).max(24).default('PCS'),
  targetBudget: moneySchema.optional().nullable(),
  targetDate: dateSchema.optional().nullable(),
  specification: z.record(z.string(), z.unknown()).default({}),
});

export type CreateRequirementVersionInput = z.infer<
  typeof createRequirementVersionSchema
>;

export const transitionRequirementStatusSchema = z.object({
  requirementId: z.string().uuid('Requirement ID must be a valid UUID'),
  targetStatus: requirementStatusSchema,
});

export type TransitionRequirementStatusInput = z.infer<
  typeof transitionRequirementStatusSchema
>;

export const lockRequirementVersionSchema = z.object({
  versionId: z.string().uuid('Version ID must be a valid UUID'),
  reason: z
    .string()
    .trim()
    .min(2, 'Alasan penguncian versi minimal 2 karakter'),
});

export type LockRequirementVersionInput = z.infer<
  typeof lockRequirementVersionSchema
>;
