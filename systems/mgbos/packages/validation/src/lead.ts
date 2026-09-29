import { z } from 'zod';

export const leadStatusSchema = z.enum([
  'NEW',
  'CONTACTED',
  'QUALIFYING',
  'QUALIFIED',
  'DISQUALIFIED',
  'CONVERTED',
  'LOST',
]);
export const qualificationResultSchema = z.enum(['QUALIFIED', 'DISQUALIFIED']);
export const disqualificationReasonSchema = z.enum([
  'OUT_OF_SCOPE',
  'SPAM',
  'INVALID_CONTACT',
  'QUANTITY_NOT_SUPPORTED',
  'DEADLINE_IMPOSSIBLE',
  'BUDGET_MISMATCH',
  'OTHER',
]);

export const createLeadSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
  brandId: z.string().uuid('Invalid brand ID'),
  businessLineId: z
    .string()
    .uuid('Invalid business line ID')
    .optional()
    .nullable(),
  channelId: z.string().uuid('Invalid channel ID'),
  customerAccountId: z
    .string()
    .uuid('Invalid customer account ID')
    .optional()
    .nullable(),
  customerContactId: z
    .string()
    .uuid('Invalid customer contact ID')
    .optional()
    .nullable(),
  title: z
    .string()
    .trim()
    .min(3, 'Judul kebutuhan lead minimal 3 karakter')
    .max(200, 'Judul kebutuhan maksimal 200 karakter'),
  contactName: z.string().trim().max(100).optional().nullable(),
  companyName: z.string().trim().max(150).optional().nullable(),
  email: z
    .string()
    .trim()
    .email('Format email tidak valid')
    .optional()
    .nullable()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(6, 'Nomor telepon minimal 6 karakter')
    .max(32, 'Nomor telepon maksimal 32 karakter')
    .optional()
    .nullable()
    .or(z.literal('')),
  rawInquiry: z.string().trim().max(3000).optional().nullable(),
  estimatedQuantity: z
    .number()
    .int('Kuantiti harus berupa bilangan bulat')
    .positive('Kuantiti harus lebih dari 0')
    .optional()
    .nullable(),
  estimatedBudget: z
    .union([z.number().int().positive(), z.bigint().positive()])
    .optional()
    .nullable(),
  status: leadStatusSchema.optional().default('NEW'),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const qualifyLeadSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID'),
  qualificationNotes: z.string().trim().max(1000).optional().nullable(),
  qualificationScore: z
    .number()
    .int()
    .min(0, 'Skor minimal 0')
    .max(100, 'Skor maksimal 100')
    .optional()
    .nullable(),
  estimatedQuantity: z
    .number()
    .int()
    .positive('Kuantiti harus lebih dari 0')
    .optional()
    .nullable(),
  estimatedBudget: z
    .union([z.number().int().positive(), z.bigint().positive()])
    .optional()
    .nullable(),
});

export type QualifyLeadInput = z.infer<typeof qualifyLeadSchema>;

export const disqualifyLeadSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID'),
  reason: disqualificationReasonSchema,
  qualificationNotes: z
    .string()
    .trim()
    .min(3, 'Catatan diskualifikasi minimal 3 karakter')
    .max(1000),
});

export type DisqualifyLeadInput = z.infer<typeof disqualifyLeadSchema>;

export const convertLeadSchema = z.object({
  leadId: z.string().uuid('Invalid lead ID'),
  customerAccountId: z.string().uuid().optional().nullable(),
  createNewAccount: z.boolean().optional().default(false),
  accountType: z.enum(['PERSON', 'COMPANY']).optional().default('PERSON'),
  displayName: z.string().trim().min(2).max(255).optional(),
});

export type ConvertLeadInput = z.infer<typeof convertLeadSchema>;
