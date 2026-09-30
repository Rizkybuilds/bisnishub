import { describe, it, expect } from 'vitest';
import {
  validateProductionAssignmentTransition,
  canAssignProductionJob,
} from './production';

describe('Production Assignment Lifecycle Domain Service (P0-04)', () => {
  describe('validateProductionAssignmentTransition', () => {
    it('allows ASSIGNED -> ACCEPTED transition (AC-01, AC-02)', () => {
      const result = validateProductionAssignmentTransition('ASSIGNED', 'ACCEPTED');
      expect(result.valid).toBe(true);
      expect(result.isDuplicate).toBeFalsy();
    });

    it('allows ASSIGNED -> DECLINED transition (AC-05)', () => {
      const result = validateProductionAssignmentTransition('ASSIGNED', 'DECLINED');
      expect(result.valid).toBe(true);
    });

    it('allows ASSIGNED -> CANCELLED transition', () => {
      const result = validateProductionAssignmentTransition('ASSIGNED', 'CANCELLED');
      expect(result.valid).toBe(true);
    });

    it('allows ACCEPTED -> CANCELLED transition before shop-floor execution', () => {
      const result = validateProductionAssignmentTransition('ACCEPTED', 'CANCELLED');
      expect(result.valid).toBe(true);
    });

    it('treats duplicate acceptance as safe / idempotent (AC-12)', () => {
      const result = validateProductionAssignmentTransition('ACCEPTED', 'ACCEPTED');
      expect(result.valid).toBe(true);
      expect(result.isDuplicate).toBe(true);
    });

    it('rejects ACCEPTED -> DECLINED', () => {
      const result = validateProductionAssignmentTransition('ACCEPTED', 'DECLINED');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('tidak valid dalam state machine');
    });

    it('rejects terminal DECLINED state transitions', () => {
      expect(validateProductionAssignmentTransition('DECLINED', 'ACCEPTED').valid).toBe(false);
      expect(validateProductionAssignmentTransition('DECLINED', 'ASSIGNED').valid).toBe(false);
      expect(validateProductionAssignmentTransition('DECLINED', 'CANCELLED').valid).toBe(false);
    });

    it('rejects terminal CANCELLED state transitions', () => {
      expect(validateProductionAssignmentTransition('CANCELLED', 'ACCEPTED').valid).toBe(false);
      expect(validateProductionAssignmentTransition('CANCELLED', 'ASSIGNED').valid).toBe(false);
      expect(validateProductionAssignmentTransition('CANCELLED', 'DECLINED').valid).toBe(false);
    });
  });

  describe('canAssignProductionJob', () => {
    it('allows assignment for PLANNED job without active assignment', () => {
      const result = canAssignProductionJob('PLANNED', false);
      expect(result.allowed).toBe(true);
    });

    it('allows assignment for READY job without active assignment (AC-07, AC-08)', () => {
      const result = canAssignProductionJob('READY', false);
      expect(result.allowed).toBe(true);
    });

    it('blocks assignment if an active assignment already exists (AC-09)', () => {
      const result = canAssignProductionJob('READY', true);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('penugasan aktif');
    });

    it('blocks assignment if job status is IN_PRODUCTION or later', () => {
      expect(canAssignProductionJob('IN_PRODUCTION', false).allowed).toBe(false);
      expect(canAssignProductionJob('AWAITING_QC', false).allowed).toBe(false);
      expect(canAssignProductionJob('COMPLETED', false).allowed).toBe(false);
      expect(canAssignProductionJob('CANCELLED', false).allowed).toBe(false);
    });
  });
});
