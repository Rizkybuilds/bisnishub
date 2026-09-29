import { describe, it, expect } from 'vitest';
import { recordQcInspectionSchema } from './qc';

describe('QC Validation Schema', () => {
  it('validates a valid PASS inspection', () => {
    const parsed = recordQcInspectionSchema.safeParse({
      productionJobId: '11111111-2222-4333-8444-555555555555',
      result: 'PASS',
      sampleSize: 10,
      defectCount: 0,
    });
    expect(parsed.success).toBe(true);
  });

  it('rejects PASS when defect count exceeds sample size', () => {
    const parsed = recordQcInspectionSchema.safeParse({
      productionJobId: '11111111-2222-4333-8444-555555555555',
      result: 'PASS',
      sampleSize: 5,
      defectCount: 10,
    });
    expect(parsed.success).toBe(false);
  });

  it('requires defect category and severity when result is REWORK', () => {
    const missingFields = recordQcInspectionSchema.safeParse({
      productionJobId: '11111111-2222-4333-8444-555555555555',
      result: 'REWORK',
      sampleSize: 10,
      defectCount: 2,
    });
    expect(missingFields.success).toBe(false);
  });

  it('requires rework instructions with at least 5 chars for REWORK result', () => {
    const shortInstructions = recordQcInspectionSchema.safeParse({
      productionJobId: '11111111-2222-4333-8444-555555555555',
      result: 'REWORK',
      sampleSize: 10,
      defectCount: 2,
      defectCategory: 'PRINT_MISALIGNMENT',
      defectSeverity: 'MAJOR',
      reworkInstructions: 'Fix',
    });
    expect(shortInstructions.success).toBe(false);

    const validRework = recordQcInspectionSchema.safeParse({
      productionJobId: '11111111-2222-4333-8444-555555555555',
      result: 'REWORK',
      sampleSize: 10,
      defectCount: 2,
      defectCategory: 'PRINT_MISALIGNMENT',
      defectSeverity: 'MAJOR',
      reworkInstructions: 'Press ulang film dengan posisi senter',
    });
    expect(validRework.success).toBe(true);
  });
});
