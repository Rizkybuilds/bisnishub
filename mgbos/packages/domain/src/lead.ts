/**
 * MultiGraph Business OS — Inbound Lead Pipeline & Qualification Domain Model (MGBOS-006)
 * Pure domain rules for inbound inquiries, lifecycle state machine transitions, and qualification engine.
 */

export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFYING',
  'QUALIFIED',
  'DISQUALIFIED',
  'CONVERTED',
  'LOST',
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const QUALIFICATION_RESULTS = ['QUALIFIED', 'DISQUALIFIED'] as const;
export type QualificationResult = (typeof QUALIFICATION_RESULTS)[number];

export const DISQUALIFICATION_REASONS = [
  'OUT_OF_SCOPE',
  'SPAM',
  'INVALID_CONTACT',
  'QUANTITY_NOT_SUPPORTED',
  'DEADLINE_IMPOSSIBLE',
  'BUDGET_MISMATCH',
  'OTHER',
] as const;
export type DisqualificationReason = (typeof DISQUALIFICATION_REASONS)[number];

export interface Lead {
  id: string;
  organizationId: string;
  brandId: string;
  businessLineId?: string | null;
  channelId: string;
  customerAccountId?: string | null;
  customerContactId?: string | null;
  leadNumber: string;
  title: string;
  contactName?: string | null;
  companyName?: string | null;
  email?: string | null;
  phone?: string | null;
  rawInquiry?: string | null;
  estimatedQuantity?: number | null;
  estimatedBudget?: bigint | null;
  status: LeadStatus;
  qualificationResult?: QualificationResult | null;
  qualificationScore?: number | null;
  qualificationNotes?: string | null;
  disqualificationReason?: DisqualificationReason | null;
  assignedUserId?: string | null;
  createdAt: string;
  contactedAt?: string | null;
  qualifiedAt?: string | null;
  disqualifiedAt?: string | null;
  convertedAt?: string | null;
  lostAt?: string | null;
  lostReason?: string | null;
  updatedAt: string;
  archivedAt?: string | null;
}

/**
 * Valid Lead State Machine Transitions (MGBOS 0.3 Business State Machines)
 */
export const LEAD_TRANSITIONS: Record<LeadStatus, readonly LeadStatus[]> = {
  NEW: ['CONTACTED', 'QUALIFYING', 'DISQUALIFIED', 'LOST'],
  CONTACTED: ['QUALIFYING', 'DISQUALIFIED', 'LOST'],
  QUALIFYING: ['QUALIFIED', 'DISQUALIFIED', 'LOST'],
  QUALIFIED: ['CONVERTED', 'LOST'],
  DISQUALIFIED: ['QUALIFYING'], // Re-evaluation allowed
  LOST: ['QUALIFYING'], // Revived lead
  CONVERTED: [], // Terminal state
};

/**
 * Returns whether a transition from one status to another is valid.
 */
export function canTransitionLead(from: LeadStatus, to: LeadStatus): boolean {
  if (from === to) return true;
  return LEAD_TRANSITIONS[from].includes(to);
}

/**
 * Asserts that a lead transition is valid, throwing a domain error if not.
 */
export function validateLeadTransition(from: LeadStatus, to: LeadStatus): void {
  if (!canTransitionLead(from, to)) {
    throw new Error(
      `Invalid lead state transition from '${from}' to '${to}'. Allowed transitions: ${LEAD_TRANSITIONS[from].join(', ') || 'none (terminal state)'}`,
    );
  }
}

export interface LeadQualificationInput {
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  rawInquiry?: string | null;
  estimatedQuantity?: number | null;
  estimatedBudget?: bigint | null;
}

export interface LeadQualificationEvaluation {
  isQualified: boolean;
  score: number;
  reason?: DisqualificationReason;
  notes: string;
}

/**
 * Lead Qualification Rules v1 (MGBOS 0.5.1 Section 9)
 * Requirements:
 * 1. Valid contact method (phone or email)
 * 2. Requirements sufficiently clear / identifiable
 * 3. Quantity can be estimated (> 0 if specified)
 */
export function evaluateLeadQualification(
  input: LeadQualificationInput,
): LeadQualificationEvaluation {
  const hasPhone = Boolean(input.phone?.trim());
  const hasEmail = Boolean(input.email?.trim());
  const hasInquiry = Boolean(input.rawInquiry?.trim());
  const hasValidQuantity =
    input.estimatedQuantity == null || input.estimatedQuantity > 0;

  if (!hasPhone && !hasEmail) {
    return {
      isQualified: false,
      score: 10,
      reason: 'INVALID_CONTACT',
      notes:
        'Lead tidak memiliki metode kontak valid (nomor telepon/WhatsApp atau email).',
    };
  }

  if (!hasInquiry) {
    return {
      isQualified: false,
      score: 20,
      reason: 'OUT_OF_SCOPE',
      notes: 'Pesan inquiry kosong atau tidak ada rincian kebutuhan pesanan.',
    };
  }

  if (!hasValidQuantity) {
    return {
      isQualified: false,
      score: 30,
      reason: 'QUANTITY_NOT_SUPPORTED',
      notes: 'Jumlah kuantiti pesanan tidak valid atau kurang dari 1 pcs.',
    };
  }

  let score = 50; // base score for valid contact & inquiry
  if (hasPhone) score += 20; // WhatsApp/direct phone is high priority
  if (input.estimatedQuantity && input.estimatedQuantity >= 24)
    score += 20; // B2B / wholesale batch
  else if (input.estimatedQuantity && input.estimatedQuantity > 0) score += 10;
  if (input.estimatedBudget != null && input.estimatedBudget > 0n) score += 10;

  score = Math.min(score, 100);

  return {
    isQualified: true,
    score,
    notes:
      'Kriteria kualifikasi terpenuhi (kontak valid, kebutuhan pesanan teridentifikasi).',
  };
}

/**
 * Human-readable label for lead status in Indonesian.
 */
export function formatLeadStatus(status: LeadStatus): string {
  switch (status) {
    case 'NEW':
      return 'Inquiry Baru';
    case 'CONTACTED':
      return 'Dihubungi';
    case 'QUALIFYING':
      return 'Sedang Kualifikasi';
    case 'QUALIFIED':
      return 'Terverifikasi (Qualified)';
    case 'DISQUALIFIED':
      return 'Diskualifikasi';
    case 'CONVERTED':
      return 'Terkonversi';
    case 'LOST':
      return 'Dibatalkan (Lost)';
  }
}

/**
 * Badge color formatting for lead status.
 */
export function getLeadStatusBadgeColor(status: LeadStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'NEW':
      return { bg: '#082f49', text: '#38bdf8', border: '#0284c7' };
    case 'CONTACTED':
      return { bg: '#1e1b4b', text: '#818cf8', border: '#4338ca' };
    case 'QUALIFYING':
      return { bg: '#451a03', text: '#fb923c', border: '#c2410c' };
    case 'QUALIFIED':
      return { bg: '#052e16', text: '#4ade80', border: '#16a34a' };
    case 'DISQUALIFIED':
      return { bg: '#450a0a', text: '#f87171', border: '#dc2626' };
    case 'CONVERTED':
      return { bg: '#3b0764', text: '#c084fc', border: '#9333ea' };
    case 'LOST':
      return { bg: '#1f2937', text: '#9ca3af', border: '#4b5563' };
  }
}

/**
 * Human-readable label for disqualification reasons.
 */
export function formatDisqualificationReason(
  reason: DisqualificationReason,
): string {
  switch (reason) {
    case 'OUT_OF_SCOPE':
      return 'Di Luar Kapasitas / Scope Produksi';
    case 'SPAM':
      return 'Spam / Bot / Promosi Ilegal';
    case 'INVALID_CONTACT':
      return 'Nomor / Kontak Tidak Valid';
    case 'QUANTITY_NOT_SUPPORTED':
      return 'Kuantiti Tidak Memenuhi Minimum';
    case 'DEADLINE_IMPOSSIBLE':
      return 'Deadline Terlalu Mepet / Tidak Terkejar';
    case 'BUDGET_MISMATCH':
      return 'Budget Terlalu Rendah';
    case 'OTHER':
      return 'Alasan Lainnya';
  }
}
