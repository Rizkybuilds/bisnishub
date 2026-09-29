import { z } from 'zod';

export const organizationStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED',
]);

export const organizationSchema = z.object({
  id: z.string().uuid().optional(),
  code: z
    .string()
    .min(2)
    .max(64)
    .regex(/^[a-z0-9-]+$/, 'Code must be lowercase alphanumeric with hyphens'),
  legalName: z.string().min(2).max(255),
  displayName: z.string().min(2).max(255),
  timezone: z.string().min(1).default('Asia/Jakarta'),
  baseCurrency: z.string().length(3).default('IDR'),
  status: organizationStatusSchema.default('ACTIVE'),
});

export const brandStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']);

export const brandSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
  code: z
    .string()
    .min(2)
    .max(10)
    .regex(/^[A-Z0-9]+$/, 'Brand code must be uppercase alphanumeric'),
  name: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(64)
    .regex(
      /^[a-z0-9-]+$/,
      'Brand slug must be lowercase alphanumeric with hyphens',
    ),
  domain: z.string().min(3).max(255).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  status: brandStatusSchema.default('ACTIVE'),
});

export const businessLineStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED',
]);

export const businessLineSchema = z.object({
  id: z.string().uuid().optional(),
  brandId: z.string().uuid(),
  code: z
    .string()
    .min(2)
    .max(32)
    .regex(
      /^[A-Z0-9_]+$/,
      'Business line code must be uppercase alphanumeric with underscores',
    ),
  name: z.string().min(2).max(100),
  description: z.string().max(1000).nullable().optional(),
  status: businessLineStatusSchema.default('ACTIVE'),
});

export const channelTypeSchema = z.enum([
  'MESSAGING',
  'WEB',
  'SOCIAL',
  'DIRECT',
  'MARKETPLACE',
  'API',
]);

export const channelStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']);

export const channelSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
  code: z
    .string()
    .min(2)
    .max(32)
    .regex(
      /^[A-Z0-9_]+$/,
      'Channel code must be uppercase alphanumeric with underscores',
    ),
  name: z.string().min(2).max(100),
  channelType: channelTypeSchema,
  status: channelStatusSchema.default('ACTIVE'),
});

export const coreRoleCodeSchema = z.enum([
  'OWNER',
  'ADMIN',
  'SALES',
  'OPERATIONS',
  'FINANCE',
  'QC',
]);

export const roleSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
  code: z.string().min(2).max(32),
  name: z.string().min(2).max(100),
  description: z.string().max(1000).nullable().optional(),
});
