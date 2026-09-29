import { describe, it, expect } from 'vitest';
import { validateQcInspection } from './qc';

describe('QC Inspection Domain Service', () => {
  it('validates a clean PASS inspection', () => {
    const res = validateQcInspection({
      result: 'PASS',
      sampleSize: 10,
      defectCount: 0,
    });
    expect(res.valid).toBe(true);
  });

  it('rejects inspection when sample size is invalid or defect count exceeds sample size', () => {
    const invalidSample = validateQcInspection({
      result: 'PASS',
      sampleSize: 0,
      defectCount: 0,
    });
    expect(invalidSample.valid).toBe(false);

    const excessiveDefect = validateQcInspection({
      result: 'PASS',
      sampleSize: 5,
      defectCount: 8,
    });
    expect(excessiveDefect.valid).toBe(false);
  });

  it('requires defect category and severity when defects are present or rework is requested', () => {
    const missingCategory = validateQcInspection({
      result: 'REWORK',
      sampleSize: 10,
      defectCount: 2,
      reworkInstructions: 'Press ulang bagian dada',
    });
    expect(missingCategory.valid).toBe(false);
    expect(missingCategory.reason).toContain('Kategori defect wajib diisi');

    const missingInstructions = validateQcInspection({
      result: 'REWORK',
      sampleSize: 10,
      defectCount: 2,
      defectCategory: 'PRINT_MISALIGNMENT',
      defectSeverity: 'MAJOR',
      reworkInstructions: '',
    });
    expect(missingInstructions.valid).toBe(false);
    expect(missingInstructions.reason).toContain(
      'Instruksi rework wajib diisi',
    );
  });

  it('approves a fully specified REWORK inspection', () => {
    const validRework = validateQcInspection({
      result: 'REWORK',
      sampleSize: 10,
      defectCount: 2,
      defectCategory: 'PRINT_MISALIGNMENT',
      defectSeverity: 'MAJOR',
      reworkInstructions: 'Reposition film 7 cm below collar and repress',
    });
    expect(validRework.valid).toBe(true);
  });
});
