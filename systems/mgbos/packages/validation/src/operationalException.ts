import { z } from 'zod';
import {
  OPERATIONAL_EXCEPTION_TYPES,
  OPERATIONAL_EXCEPTION_SEVERITIES,
  OPERATIONAL_EXCEPTION_RESOURCE_TYPES,
  OPERATIONAL_EXCEPTION_RESOLUTION_TYPES,
  OPERATIONAL_EXCEPTION_DISMISSAL_REASONS,
  RESPONSIBLE_ROLE_CODES,
  EXCEPTION_TYPE_TO_RESOURCE,
} from '@mgbos/domain';

// WP01 manual opening is restricted to HUMAN_REPORT and RECONCILIATION
export const MANUAL_OPENING_SOURCE_KINDS = [
  'HUMAN_REPORT',
  'RECONCILIATION',
] as const;

export type ManualOpeningSourceKind =
  (typeof MANUAL_OPENING_SOURCE_KINDS)[number];

// ============================================================================
// 1. Open Operational Exception Schema
// ============================================================================

export const openOperationalExceptionSchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionType: z.enum(OPERATIONAL_EXCEPTION_TYPES, {
      message: 'Tipe pengecualian operasional tidak valid',
    }),
    primaryResourceType: z.enum(OPERATIONAL_EXCEPTION_RESOURCE_TYPES, {
      message: 'Tipe sumber daya primer tidak valid',
    }),
    primaryResourceId: z
      .string()
      .uuid('Primary resource ID harus berupa UUID yang valid'),
    severity: z.enum(OPERATIONAL_EXCEPTION_SEVERITIES, {
      message: 'Tingkat keparahan tidak valid',
    }),
    sourceKind: z.enum(MANUAL_OPENING_SOURCE_KINDS, {
      message:
        'Tipe sumber harus HUMAN_REPORT atau RECONCILIATION untuk pembukaan manual',
    }),
    responsibleRoleCode: z.enum(RESPONSIBLE_ROLE_CODES, {
      message: 'Kode peran penanggung jawab tidak valid',
    }),
    responsibleUserId: z
      .string()
      .uuid('Responsible user ID harus berupa UUID yang valid')
      .optional()
      .nullable(),
    summary: z
      .string()
      .trim()
      .min(5, 'Ringkasan minimal 5 karakter')
      .max(240, 'Ringkasan maksimal 240 karakter'),
    businessImpact: z
      .string()
      .trim()
      .min(5, 'Dampak bisnis minimal 5 karakter')
      .max(2000, 'Dampak bisnis maksimal 2000 karakter'),
    observation: z
      .string()
      .trim()
      .min(5, 'Observasi minimal 5 karakter')
      .max(4000, 'Observasi maksimal 4000 karakter')
      .optional()
      .nullable(),
    rootCause: z
      .string()
      .trim()
      .max(2000, 'Akar masalah maksimal 2000 karakter')
      .optional()
      .nullable(),
    detectedAt: z
      .string()
      .datetime({
        offset: true,
        message: 'detectedAt harus berupa ISO 8601 string',
      })
      .optional()
      .nullable(),
    otherCategoryReason: z
      .string()
      .trim()
      .max(1000, 'otherCategoryReason maksimal 1000 karakter')
      .optional()
      .nullable(),
    supplementaryEvidence: z
      .record(z.string(), z.unknown())
      .optional()
      .nullable(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.exceptionType !== 'other.operational_abnormality') {
      const expectedResource = EXCEPTION_TYPE_TO_RESOURCE[data.exceptionType];
      if (data.primaryResourceType !== expectedResource) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Tipe pengecualian ${data.exceptionType} membutuhkan primaryResourceType ${expectedResource}`,
          path: ['primaryResourceType'],
        });
      }
      if (
        data.otherCategoryReason !== undefined &&
        data.otherCategoryReason !== null &&
        data.otherCategoryReason.trim().length > 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'otherCategoryReason hanya boleh diisi jika exceptionType adalah other.operational_abnormality',
          path: ['otherCategoryReason'],
        });
      }
    } else {
      if (
        !data.otherCategoryReason ||
        data.otherCategoryReason.trim().length < 10
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'otherCategoryReason wajib diisi minimal 10 karakter untuk other.operational_abnormality',
          path: ['otherCategoryReason'],
        });
      }
    }
  });

export type OpenOperationalExceptionInput = z.infer<
  typeof openOperationalExceptionSchema
>;

// ============================================================================
// 2. Acknowledge Operational Exception Schema
// ============================================================================

export const acknowledgeOperationalExceptionSchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionId: z.string().uuid('Exception ID harus berupa UUID yang valid'),
    expectedRevision: z
      .number()
      .int('expectedRevision harus berupa bilangan bulat')
      .positive('expectedRevision harus berupa bilangan bulat positif'),
    note: z
      .string()
      .trim()
      .max(2000, 'Catatan maksimal 2000 karakter')
      .optional()
      .nullable(),
  })
  .strict();

export type AcknowledgeOperationalExceptionInput = z.infer<
  typeof acknowledgeOperationalExceptionSchema
>;

// ============================================================================
// 3. Assign Operational Exception Schema
// ============================================================================

export const assignOperationalExceptionSchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionId: z.string().uuid('Exception ID harus berupa UUID yang valid'),
    expectedRevision: z
      .number()
      .int('expectedRevision harus berupa bilangan bulat')
      .positive('expectedRevision harus berupa bilangan bulat positif'),
    responsibleRoleCode: z.enum(RESPONSIBLE_ROLE_CODES, {
      message: 'Kode peran penanggung jawab tidak valid',
    }),
    responsibleUserId: z
      .string()
      .uuid('Responsible user ID harus berupa UUID yang valid'),
    reason: z
      .string()
      .trim()
      .max(2000, 'Alasan penugasan maksimal 2000 karakter')
      .optional()
      .nullable(),
  })
  .strict();

export type AssignOperationalExceptionInput = z.infer<
  typeof assignOperationalExceptionSchema
>;

// ============================================================================
// 4. Reassign Operational Exception Schema
// ============================================================================

export const reassignOperationalExceptionSchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionId: z.string().uuid('Exception ID harus berupa UUID yang valid'),
    expectedRevision: z
      .number()
      .int('expectedRevision harus berupa bilangan bulat')
      .positive('expectedRevision harus berupa bilangan bulat positif'),
    newResponsibleRoleCode: z.enum(RESPONSIBLE_ROLE_CODES, {
      message: 'Kode peran penanggung jawab baru tidak valid',
    }),
    newResponsibleUserId: z
      .string()
      .uuid('Responsible user ID baru harus berupa UUID yang valid'),
    reason: z
      .string()
      .trim()
      .min(5, 'Alasan perubahan penugasan minimal 5 karakter')
      .max(2000, 'Alasan perubahan penugasan maksimal 2000 karakter'),
  })
  .strict();

export type ReassignOperationalExceptionInput = z.infer<
  typeof reassignOperationalExceptionSchema
>;

// ============================================================================
// 5. Change Operational Exception Severity Schema
// ============================================================================

export const changeOperationalExceptionSeveritySchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionId: z.string().uuid('Exception ID harus berupa UUID yang valid'),
    expectedRevision: z
      .number()
      .int('expectedRevision harus berupa bilangan bulat')
      .positive('expectedRevision harus berupa bilangan bulat positif'),
    newSeverity: z.enum(OPERATIONAL_EXCEPTION_SEVERITIES, {
      message: 'Tingkat keparahan baru tidak valid',
    }),
    reason: z
      .string()
      .trim()
      .min(5, 'Alasan perubahan tingkat keparahan minimal 5 karakter')
      .max(2000, 'Alasan perubahan tingkat keparahan maksimal 2000 karakter'),
  })
  .strict();

export type ChangeOperationalExceptionSeverityInput = z.infer<
  typeof changeOperationalExceptionSeveritySchema
>;

// ============================================================================
// 6. Resolve Operational Exception Schema
// ============================================================================

export const resolveOperationalExceptionSchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionId: z.string().uuid('Exception ID harus berupa UUID yang valid'),
    expectedRevision: z
      .number()
      .int('expectedRevision harus berupa bilangan bulat')
      .positive('expectedRevision harus berupa bilangan bulat positif'),
    resolutionType: z.enum(OPERATIONAL_EXCEPTION_RESOLUTION_TYPES, {
      message: 'Tipe resolusi tidak valid',
    }),
    resolutionSummary: z
      .string()
      .trim()
      .min(5, 'Ringkasan resolusi minimal 5 karakter')
      .max(2000, 'Ringkasan resolusi maksimal 2000 karakter'),
    supersededByExceptionId: z
      .string()
      .uuid('supersededByExceptionId harus berupa UUID yang valid')
      .optional()
      .nullable(),
    closureEvidence: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.resolutionType === 'SUPERSEDED') {
      if (!data.supersededByExceptionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'supersededByExceptionId wajib diisi jika tipe resolusi adalah SUPERSEDED',
          path: ['supersededByExceptionId'],
        });
      }
    } else {
      if (
        data.supersededByExceptionId !== undefined &&
        data.supersededByExceptionId !== null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'supersededByExceptionId hanya boleh diisi jika tipe resolusi adalah SUPERSEDED',
          path: ['supersededByExceptionId'],
        });
      }
    }
  });

export type ResolveOperationalExceptionInput = z.infer<
  typeof resolveOperationalExceptionSchema
>;

// ============================================================================
// 7. Dismiss Operational Exception Schema
// ============================================================================

export const dismissOperationalExceptionSchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionId: z.string().uuid('Exception ID harus berupa UUID yang valid'),
    expectedRevision: z
      .number()
      .int('expectedRevision harus berupa bilangan bulat')
      .positive('expectedRevision harus berupa bilangan bulat positif'),
    dismissalReason: z.enum(OPERATIONAL_EXCEPTION_DISMISSAL_REASONS, {
      message: 'Alasan dismissal tidak valid',
    }),
    reasonSummary: z
      .string()
      .trim()
      .min(5, 'Ringkasan alasan dismissal minimal 5 karakter')
      .max(2000, 'Ringkasan alasan dismissal maksimal 2000 karakter'),
    duplicateOfExceptionId: z
      .string()
      .uuid('duplicateOfExceptionId harus berupa UUID yang valid')
      .optional()
      .nullable(),
    closureEvidence: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.dismissalReason === 'DUPLICATE') {
      if (!data.duplicateOfExceptionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'duplicateOfExceptionId wajib diisi jika alasan dismissal adalah DUPLICATE',
          path: ['duplicateOfExceptionId'],
        });
      }
    } else {
      if (
        data.duplicateOfExceptionId !== undefined &&
        data.duplicateOfExceptionId !== null
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'duplicateOfExceptionId hanya boleh diisi jika alasan dismissal adalah DUPLICATE',
          path: ['duplicateOfExceptionId'],
        });
      }
    }
  });

export type DismissOperationalExceptionInput = z.infer<
  typeof dismissOperationalExceptionSchema
>;

// ============================================================================
// 8. Reopen Operational Exception Schema
// ============================================================================

export const reopenOperationalExceptionSchema = z
  .object({
    requestId: z.string().uuid('Request ID harus berupa UUID yang valid'),
    exceptionId: z.string().uuid('Exception ID harus berupa UUID yang valid'),
    expectedRevision: z
      .number()
      .int('expectedRevision harus berupa bilangan bulat')
      .positive('expectedRevision harus berupa bilangan bulat positif'),
    reason: z
      .string()
      .trim()
      .min(5, 'Alasan pembukaan kembali minimal 5 karakter')
      .max(2000, 'Alasan pembukaan kembali maksimal 2000 karakter'),
    supportingEvidence: z.record(z.string(), z.unknown()).optional().nullable(),
  })
  .strict();

export type ReopenOperationalExceptionInput = z.infer<
  typeof reopenOperationalExceptionSchema
>;
