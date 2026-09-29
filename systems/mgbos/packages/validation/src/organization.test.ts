import { describe, it, expect } from 'vitest';
import {
  organizationSchema,
  brandSchema,
  businessLineSchema,
  channelSchema,
  roleSchema,
} from './organization';

describe('Organization validation schemas', () => {
  it('validates a correct holding organization', () => {
    const valid = organizationSchema.parse({
      code: 'multigraph-group',
      legalName: 'PT MultiGraph Ekosistem Kreatif',
      displayName: 'MultiGraph Group',
      timezone: 'Asia/Jakarta',
      baseCurrency: 'IDR',
      status: 'ACTIVE',
    });
    expect(valid.code).toBe('multigraph-group');
  });

  it('rejects an organization with invalid code format', () => {
    expect(() =>
      organizationSchema.parse({
        code: 'MultiGraph Group INVALID',
        legalName: 'Test',
        displayName: 'Test',
      }),
    ).toThrow();
  });

  it('validates a brand schema with uppercase code', () => {
    const valid = brandSchema.parse({
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      code: 'TS',
      name: 'TeeStock',
      slug: 'teestock',
      domain: 'teestockapparel.com',
      status: 'ACTIVE',
    });
    expect(valid.code).toBe('TS');
    expect(valid.slug).toBe('teestock');
  });

  it('rejects a brand with lowercase code', () => {
    expect(() =>
      brandSchema.parse({
        organizationId: '123e4567-e89b-12d3-a456-426614174000',
        code: 'ts',
        name: 'TeeStock',
        slug: 'teestock',
      }),
    ).toThrow();
  });

  it('validates a business line schema', () => {
    const valid = businessLineSchema.parse({
      brandId: '123e4567-e89b-12d3-a456-426614174000',
      code: 'CUSTOM_ATELIER',
      name: 'Custom Atelier',
      status: 'ACTIVE',
    });
    expect(valid.code).toBe('CUSTOM_ATELIER');
  });

  it('validates a channel schema', () => {
    const valid = channelSchema.parse({
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      code: 'WHATSAPP',
      name: 'WhatsApp Official',
      channelType: 'MESSAGING',
      status: 'ACTIVE',
    });
    expect(valid.channelType).toBe('MESSAGING');
  });

  it('validates a role schema', () => {
    const valid = roleSchema.parse({
      organizationId: '123e4567-e89b-12d3-a456-426614174000',
      code: 'OWNER',
      name: 'Owner',
      description: 'Founder & Executive Sole Decision Maker',
    });
    expect(valid.code).toBe('OWNER');
  });
});
