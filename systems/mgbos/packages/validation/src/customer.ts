import { z } from 'zod';

export const customerAccountTypeSchema = z.enum(['PERSON', 'COMPANY']);

export const customerAccountStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'ARCHIVED',
]);

export const customerBrandStatusSchema = z.enum([
  'PROSPECT',
  'ACTIVE',
  'DORMANT',
  'CHURNED',
]);

export const addressTypeSchema = z.enum([
  'BILLING',
  'SHIPPING',
  'OFFICE',
  'WAREHOUSE',
  'OTHER',
]);

export const createCustomerAccountSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
  accountType: customerAccountTypeSchema,
  displayName: z
    .string()
    .trim()
    .min(2, 'Display name must be at least 2 characters')
    .max(255),
  legalName: z.string().trim().min(2).max(255).optional().nullable(),
  primaryEmail: z
    .string()
    .trim()
    .email('Invalid email address')
    .optional()
    .nullable()
    .or(z.literal('')),
  primaryPhone: z
    .string()
    .trim()
    .min(6, 'Phone number too short')
    .max(32)
    .optional()
    .nullable()
    .or(z.literal('')),
  taxId: z.string().trim().max(64).optional().nullable(),
  status: customerAccountStatusSchema.default('ACTIVE').optional(),
});

export type CreateCustomerAccountInput = z.infer<
  typeof createCustomerAccountSchema
>;

export const createCustomerContactSchema = z.object({
  customerAccountId: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(2, 'Contact name must be at least 2 characters')
    .max(255),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .optional()
    .nullable()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .min(6, 'Phone number too short')
    .max(32)
    .optional()
    .nullable()
    .or(z.literal('')),
  position: z.string().trim().max(100).optional().nullable(),
  isPrimary: z.boolean().default(false),
});

export type CreateCustomerContactInput = z.infer<
  typeof createCustomerContactSchema
>;

export const createCustomerBrandRelationshipSchema = z.object({
  customerAccountId: z.string().uuid('Invalid customer account ID'),
  brandId: z.string().uuid('Invalid brand ID'),
  customerSegment: z.string().trim().default('STANDARD').optional(),
  relationshipStatus: customerBrandStatusSchema.default('ACTIVE').optional(),
});

export type CreateCustomerBrandRelationshipInput = z.infer<
  typeof createCustomerBrandRelationshipSchema
>;

export const createAddressSchema = z.object({
  recipientName: z.string().trim().min(2).max(255),
  phone: z.string().trim().min(6).max(32),
  addressLine1: z.string().trim().min(5).max(255),
  addressLine2: z.string().trim().max(255).optional().nullable(),
  district: z.string().trim().max(100).optional().nullable(),
  city: z.string().trim().min(2).max(100),
  province: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(3).max(10),
  countryCode: z.string().trim().length(2).default('ID'),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
