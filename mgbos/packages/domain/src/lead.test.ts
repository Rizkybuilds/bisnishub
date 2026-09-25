import { describe, it, expect } from 'vitest';
import {
  canTransitionLead,
  validateLeadTransition,
  evaluateLeadQualification,
  formatLeadStatus,
  formatDisqualificationReason,
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
});
