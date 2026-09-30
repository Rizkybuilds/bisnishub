import { describe, it, expect } from 'vitest';
import {
  canTransitionLead,
  validateLeadTransition,
  evaluateLeadQualification,
  formatLeadStatus,
  formatDisqualificationReason,
  isLeadEligibleForRequirement,
  mapLeadToRequirementPrefill,
} from './lead';

describe('Lead Domain Model & State Machine (MGBOS-006)', () => {
  it('validates permitted lead state machine transitions', () => {
    expect(canTransitionLead('NEW', 'CONTACTED')).toBe(true);
    expect(canTransitionLead('NEW', 'QUALIFYING')).toBe(true);
    expect(canTransitionLead('QUALIFYING', 'QUALIFIED')).toBe(true);
    expect(canTransitionLead('QUALIFIED', 'CONVERTED')).toBe(true);
    expect(canTransitionLead('DISQUALIFIED', 'QUALIFYING')).toBe(true); // Re-evaluation allowed
    expect(canTransitionLead('LOST', 'QUALIFYING')).toBe(true); // Revived

    // Disallowed jumps
    expect(canTransitionLead('NEW', 'CONVERTED')).toBe(false);
    expect(canTransitionLead('CONVERTED', 'NEW')).toBe(false);
  });

  it('validateLeadTransition throws on invalid state transition', () => {
    expect(() => validateLeadTransition('NEW', 'CONVERTED')).toThrowError(
      /Invalid lead state transition from 'NEW' to 'CONVERTED'/,
    );
  });

  it('evaluates lead qualification rule v1 successfully for valid leads', () => {
    const evaluation = evaluateLeadQualification({
      contactName: 'Budi Santoso',
      phone: '+6281234567890',
      email: 'budi@example.com',
      rawInquiry: 'Mau bikin kaos 100 pcs untuk gathering',
      estimatedQuantity: 100,
      estimatedBudget: 8000000n,
    });

    expect(evaluation.isQualified).toBe(true);
    expect(evaluation.score).toBeGreaterThanOrEqual(70);
    expect(evaluation.notes).toContain('Kriteria kualifikasi terpenuhi');
  });

  it('disqualifies leads with missing contact methods (INVALID_CONTACT)', () => {
    const evaluation = evaluateLeadQualification({
      rawInquiry: 'Halo mau tanya harga kaos',
      phone: '',
      email: '',
    });

    expect(evaluation.isQualified).toBe(false);
    expect(evaluation.reason).toBe('INVALID_CONTACT');
  });

  it('disqualifies leads with empty inquiry details (OUT_OF_SCOPE)', () => {
    const evaluation = evaluateLeadQualification({
      phone: '+6281234567890',
      rawInquiry: '   ',
    });

    expect(evaluation.isQualified).toBe(false);
    expect(evaluation.reason).toBe('OUT_OF_SCOPE');
  });

  it('disqualifies leads with invalid quantity (QUANTITY_NOT_SUPPORTED)', () => {
    const evaluation = evaluateLeadQualification({
      phone: '+6281234567890',
      rawInquiry: 'Kaos sampel 0 pcs',
      estimatedQuantity: 0,
    });

    expect(evaluation.isQualified).toBe(false);
    expect(evaluation.reason).toBe('QUANTITY_NOT_SUPPORTED');
  });

  it('formats Indonesian human-readable labels', () => {
    expect(formatLeadStatus('NEW')).toBe('Inquiry Baru');
    expect(formatLeadStatus('QUALIFIED')).toBe('Terverifikasi (Qualified)');
    expect(formatDisqualificationReason('SPAM')).toBe(
      'Spam / Bot / Promosi Ilegal',
    );
  });

  describe('Lead to Requirement Continuation (P0-01)', () => {
    it('determines lead requirement continuation eligibility correctly', () => {
      // Eligible
      expect(isLeadEligibleForRequirement('QUALIFIED')).toBe(true);
      expect(isLeadEligibleForRequirement('CONVERTED')).toBe(true);

      // Ineligible
      expect(isLeadEligibleForRequirement('NEW')).toBe(false);
      expect(isLeadEligibleForRequirement('CONTACTED')).toBe(false);
      expect(isLeadEligibleForRequirement('QUALIFYING')).toBe(false);
      expect(isLeadEligibleForRequirement('DISQUALIFIED')).toBe(false);
      expect(isLeadEligibleForRequirement('LOST')).toBe(false);
    });

    it('maps eligible lead to requirement prefill data with all fields', () => {
      const prefill = mapLeadToRequirementPrefill({
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Pesanan Kaos Komunitas 150 pcs',
        rawInquiry: 'Halo kami mau pesan kaos katun combed 24s sablon DTF',
        estimatedQuantity: 150,
        estimatedBudget: 12000000n,
        customerAccountId: '223e4567-e89b-12d3-a456-426614174001',
        status: 'QUALIFIED',
      });

      expect(prefill).toEqual({
        leadId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Pesanan Kaos Komunitas 150 pcs',
        summary: 'Halo kami mau pesan kaos katun combed 24s sablon DTF',
        quantity: 150,
        targetBudget: '12000000',
        customerAccountId: '223e4567-e89b-12d3-a456-426614174001',
      });
    });

    it('preserves missing/optional fields as empty or undefined without inventing data', () => {
      const prefill = mapLeadToRequirementPrefill({
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Inquiry Kaos Polos',
        rawInquiry: null,
        estimatedQuantity: null,
        estimatedBudget: null,
        customerAccountId: null,
        status: 'CONVERTED',
      });

      expect(prefill.leadId).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(prefill.title).toBe('Inquiry Kaos Polos');
      expect(prefill.summary).toBe('');
      expect(prefill.quantity).toBeUndefined();
      expect(prefill.targetBudget).toBeUndefined();
      expect(prefill.customerAccountId).toBeUndefined();
    });

    it('throws error when attempting to map an ineligible lead', () => {
      expect(() =>
        mapLeadToRequirementPrefill({
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Unqualified Lead',
          status: 'QUALIFYING',
        }),
      ).toThrowError(/not eligible for Requirement continuation/);

      expect(() =>
        mapLeadToRequirementPrefill({
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Disqualified Lead',
          status: 'DISQUALIFIED',
        }),
      ).toThrowError(/not eligible for Requirement continuation/);
    });
  });
});
