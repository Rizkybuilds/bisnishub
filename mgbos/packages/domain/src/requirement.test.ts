import { describe, it, expect } from 'vitest';
import {
  canTransitionRequirement,
  validateRequirementTransition,
  getNextVersionNumber,
  evaluateRequirementCompleteness,
  REQUIREMENT_STATUSES,
} from './requirement';

describe('Requirement Domain Model & State Machine (MGBOS-007)', () => {
  it('validates canonical lifecycle transitions from DRAFT', () => {
    expect(canTransitionRequirement('DRAFT', 'NEEDS_INFORMATION')).toBe(true);
    expect(canTransitionRequirement('DRAFT', 'READY')).toBe(true);
    expect(canTransitionRequirement('DRAFT', 'CANCELLED')).toBe(true);
    // Direct DRAFT -> LOCKED is illegal without READY
    expect(canTransitionRequirement('DRAFT', 'LOCKED')).toBe(false);
  });

  it('validates transitions from READY to LOCKED or back to NEEDS_INFORMATION', () => {
    expect(canTransitionRequirement('READY', 'LOCKED')).toBe(true);
    expect(canTransitionRequirement('READY', 'NEEDS_INFORMATION')).toBe(true);
    expect(canTransitionRequirement('READY', 'CANCELLED')).toBe(true);
    expect(canTransitionRequirement('READY', 'DRAFT')).toBe(false);
  });

  it('enforces that LOCKED cannot transition except to CANCELLED', () => {
    expect(canTransitionRequirement('LOCKED', 'DRAFT')).toBe(false);
    expect(canTransitionRequirement('LOCKED', 'READY')).toBe(false);
    expect(canTransitionRequirement('LOCKED', 'NEEDS_INFORMATION')).toBe(false);
    expect(canTransitionRequirement('LOCKED', 'CANCELLED')).toBe(true);
  });

  it('enforces that CANCELLED is a terminal state', () => {
    for (const status of REQUIREMENT_STATUSES) {
      if (status !== 'CANCELLED') {
        expect(canTransitionRequirement('CANCELLED', status)).toBe(false);
      }
    }
  });

  it('throws descriptive error on invalid transition in validateRequirementTransition', () => {
    expect(() => validateRequirementTransition('DRAFT', 'LOCKED')).toThrow(
      "Invalid requirement state transition from 'DRAFT' to 'LOCKED'",
    );
  });

  it('correctly calculates sequential version numbers', () => {
    expect(getNextVersionNumber([])).toBe(1);
    expect(getNextVersionNumber([1])).toBe(2);
    expect(getNextVersionNumber([1, 2, 3])).toBe(4);
    expect(getNextVersionNumber([1, 3])).toBe(4);
  });

  it('evaluates requirement completeness score correctly', () => {
    // Empty spec
    const emptyEval = evaluateRequirementCompleteness(null, {});
    expect(emptyEval.score).toBe(0);
    expect(emptyEval.isComplete).toBe(false);
    expect(emptyEval.missingFields).toContain('quantity');
    expect(emptyEval.missingFields).toContain('garment.type');

    // Partial spec
    const partialEval = evaluateRequirementCompleteness(50, {
      productType: 'T-Shirt',
    });
    expect(partialEval.score).toBe(40);
    expect(partialEval.isComplete).toBe(false);

    // Complete spec
    const completeEval = evaluateRequirementCompleteness(100, {
      garment: {
        type: 'oversized_tshirt',
        material: 'cotton_combed_24s',
        sizes: { S: 20, M: 40, L: 40 },
      },
      printing: {
        method: 'DTF',
      },
    });
    expect(completeEval.score).toBe(100);
    expect(completeEval.isComplete).toBe(true);
    expect(completeEval.missingFields).toHaveLength(0);
  });
});
