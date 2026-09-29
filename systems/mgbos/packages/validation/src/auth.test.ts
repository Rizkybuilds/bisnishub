import { describe, it, expect } from 'vitest';
import { loginSchema, userSchema, organizationMemberSchema } from './auth';

describe('Auth validation schemas', () => {
  it('validates a valid login payload', () => {
    const valid = loginSchema.parse({
      email: 'founder@multigraph.id',
      password: 'mgbos-founder-2026',
    });
    expect(valid.email).toBe('founder@multigraph.id');
    expect(valid.password).toBe('mgbos-founder-2026');
  });

  it('rejects an invalid email in login payload', () => {
    expect(() =>
      loginSchema.parse({
        email: 'not-an-email',
        password: 'password123',
      }),
    ).toThrow('Invalid email');
  });

  it('rejects short passwords', () => {
    expect(() =>
      loginSchema.parse({
        email: 'founder@multigraph.id',
        password: '123',
      }),
    ).toThrow('at least 6 characters');
  });

  it('validates user schema with default status', () => {
    const user = userSchema.parse({
      name: 'Rizky',
      email: 'founder@multigraph.id',
    });
    expect(user.status).toBe('ACTIVE');
    expect(user.name).toBe('Rizky');
  });

  it('validates organization member schema', () => {
    const member = organizationMemberSchema.parse({
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      userId: '223e4567-e89b-12d3-a456-426614174000',
      roleId: '323e4567-e89b-12d3-a456-426614174000',
    });
    expect(member.status).toBe('ACTIVE');
  });
});
