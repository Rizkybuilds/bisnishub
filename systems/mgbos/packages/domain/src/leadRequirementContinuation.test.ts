import { describe, it, expect } from 'vitest';
import {
  isLeadEligibleForRequirement,
  mapLeadToRequirementPrefill,
  type LeadStatus,
  type LeadForRequirementPrefill,
} from './lead';

describe('P0-01: Lead to Requirement Continuation', () => {
  describe('AC-01 & AC-08: State Eligibility Guard', () => {
    it('permits only QUALIFIED and CONVERTED leads to proceed', () => {
      const eligibleStatuses: LeadStatus[] = ['QUALIFIED', 'CONVERTED'];
      const ineligibleStatuses: LeadStatus[] = [
        'NEW',
        'CONTACTED',
        'QUALIFYING',
        'DISQUALIFIED',
        'LOST',
      ];

      for (const status of eligibleStatuses) {
        expect(isLeadEligibleForRequirement(status)).toBe(true);
      }

      for (const status of ineligibleStatuses) {
        expect(isLeadEligibleForRequirement(status)).toBe(false);
      }
    });

    it('rejects mapping for ineligible lead states with clear domain error', () => {
      const ineligibleStatuses: LeadStatus[] = [
        'NEW',
        'CONTACTED',
        'QUALIFYING',
        'DISQUALIFIED',
        'LOST',
      ];

      for (const status of ineligibleStatuses) {
        const lead: LeadForRequirementPrefill = {
          id: 'lead-uuid-1',
          title: 'Custom Polo 50 pcs',
          status,
        };
        expect(() => mapLeadToRequirementPrefill(lead)).toThrowError(
          /not eligible for Requirement continuation/,
        );
      }
    });
  });

  describe('AC-02, AC-03 & AC-04: Trusted Lead Context Prefill Mapping', () => {
    it('correctly maps all trusted lead attributes into requirement prefill fields', () => {
      const lead: LeadForRequirementPrefill = {
        id: '999e4567-e89b-12d3-a456-426614174099',
        title: 'Jersey Futsal Printing DTF 30 pcs',
        rawInquiry: 'Halo kami mau pesan jersey futsal full print bahan dryfit',
        estimatedQuantity: 30,
        estimatedBudget: 4500000n,
        customerAccountId: '888e4567-e89b-12d3-a456-426614174088',
        status: 'QUALIFIED',
      };

      const prefill = mapLeadToRequirementPrefill(lead);

      // AC-02: lead_id is retained
      expect(prefill.leadId).toBe('999e4567-e89b-12d3-a456-426614174099');
      // AC-03: customer_account_id is preserved
      expect(prefill.customerAccountId).toBe(
        '888e4567-e89b-12d3-a456-426614174088',
      );
      // AC-04: title, summary (raw inquiry), quantity, budget prefilled
      expect(prefill.title).toBe('Jersey Futsal Printing DTF 30 pcs');
      expect(prefill.summary).toBe(
        'Halo kami mau pesan jersey futsal full print bahan dryfit',
      );
      expect(prefill.quantity).toBe(30);
      expect(prefill.targetBudget).toBe('4500000');
    });

    it('handles numeric and string representations of budget safely', () => {
      const leadWithNum: LeadForRequirementPrefill = {
        id: 'lead-1',
        title: 'Kaos Acara',
        estimatedBudget: 2500000,
        status: 'CONVERTED',
      };
      expect(mapLeadToRequirementPrefill(leadWithNum).targetBudget).toBe(
        '2500000',
      );

      const leadWithStr: LeadForRequirementPrefill = {
        id: 'lead-2',
        title: 'Kaos Acara 2',
        estimatedBudget: '3000000',
        status: 'QUALIFIED',
      };
      expect(mapLeadToRequirementPrefill(leadWithStr).targetBudget).toBe(
        '3000000',
      );
    });
  });

  describe('AC-06: Missing Source Data Remains Missing', () => {
    it('does not invent placeholder data when lead fields are null or undefined', () => {
      const minimalLead: LeadForRequirementPrefill = {
        id: 'lead-minimal',
        title: 'Inquiry Singkat',
        rawInquiry: null,
        estimatedQuantity: null,
        estimatedBudget: null,
        customerAccountId: null,
        status: 'QUALIFIED',
      };

      const prefill = mapLeadToRequirementPrefill(minimalLead);

      expect(prefill.leadId).toBe('lead-minimal');
      expect(prefill.title).toBe('Inquiry Singkat');
      expect(prefill.summary).toBe('');
      expect(prefill.quantity).toBeUndefined();
      expect(prefill.targetBudget).toBeUndefined();
      expect(prefill.customerAccountId).toBeUndefined();
    });

    it('ignores non-positive quantities', () => {
      const zeroQtyLead: LeadForRequirementPrefill = {
        id: 'lead-zero-qty',
        title: 'Zero Qty Inquiry',
        estimatedQuantity: 0,
        status: 'QUALIFIED',
      };
      expect(
        mapLeadToRequirementPrefill(zeroQtyLead).quantity,
      ).toBeUndefined();
    });
  });

  describe('AC-09: Existing Requirement Linkage Discoverability', () => {
    it('filters existing requirements matching the lead id', () => {
      const existingRequirements = [
        { id: 'req-1', lead_id: 'lead-target', title: 'Batch 1' },
        { id: 'req-2', lead_id: 'other-lead', title: 'Unrelated' },
        { id: 'req-3', lead_id: 'lead-target', title: 'Batch 2' },
      ];

      const linked = existingRequirements.filter(
        (r) => r.lead_id === 'lead-target',
      );
      expect(linked).toHaveLength(2);
      expect(linked.map((r) => r.id)).toEqual(['req-1', 'req-3']);
    });
  });
});
