import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  authUserId: z.string().uuid().nullable().optional(),
  name: z.string().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().max(32).nullable().optional(),
  status: userStatusSchema.default('ACTIVE'),
});

export const memberStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'INVITED']);

export const organizationMemberSchema = z.object({
  id: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  status: memberStatusSchema.default('ACTIVE'),
});
