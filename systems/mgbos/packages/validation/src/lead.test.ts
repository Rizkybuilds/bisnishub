import { describe, it, expect } from 'vitest';
import {
  createLeadSchema,
  qualifyLeadSchema,
  disqualifyLeadSchema,
} from './lead';

describe('Lead Validation Schemas (MGBOS-006)', () => {
  const validOrgId = '123e4567-e89b-12d3-a456-426614174001';
  const validBrandId = '123e4567-e89b-12d3-a456-426614174002';
  const validChannelId = '123e4567-e89b-12d3-a456-426614174003';
  const validLeadId = '123e4567-e89b-12d3-a456-426614174004';

  it('validates a valid create lead input', () => {
    const input = {
      organizationId: validOrgId,
      brandId: validBrandId,
      channelId: validChannelId,
      title: 'Pemesanan Kaos 100 Pcs',
      contactName: 'Budi Santoso',
      phone: '+6281234567890',
      email: 'budi@example.com',
      rawInquiry: 'Kaos NSA 7200 sablon DTF',
      estimatedQuantity: 100,
      estimatedBudget: 7500000,
    };

    const result = createLeadSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('rejects create lead input when title is too short or missing', () => {
    const input = {
      organizationId: validOrgId,
      brandId: validBrandId,
      channelId: validChannelId,
      title: 'Hi',
    };

    const result = createLeadSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('rejects create lead input with invalid email format', () => {
    const input = {
      organizationId: validOrgId,
      brandId: validBrandId,
      channelId: validChannelId,
      title: 'Kaos 50 Pcs',
      email: 'not-an-email',
    };

    const result = createLeadSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('validates qualify lead schema within score bounds', () => {
    const valid = qualifyLeadSchema.safeParse({
      leadId: validLeadId,
      qualificationScore: 85,
      qualificationNotes: 'Kebutuhan jelas dan kuantiti memenuhi syarat.',
    });
    expect(valid.success).toBe(true);

    const invalidScore = qualifyLeadSchema.safeParse({
      leadId: validLeadId,
      qualificationScore: 120,
    });
    expect(invalidScore.success).toBe(false);
  });

  it('validates disqualify lead schema with structured reasons', () => {
    const valid = disqualifyLeadSchema.safeParse({
      leadId: validLeadId,
      reason: 'SPAM',
      qualificationNotes: 'Promosi bot Instagram',
    });
    expect(valid.success).toBe(true);

    const invalidReason = disqualifyLeadSchema.safeParse({
      leadId: validLeadId,
      reason: 'NOT_A_VALID_REASON' as unknown as 'SPAM',
      qualificationNotes: 'Notes',
    });
    expect(invalidReason.success).toBe(false);
  });
});
