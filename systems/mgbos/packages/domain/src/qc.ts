/**
 * MultiGraph Business OS — Digital QC Inspection Domain Service (MGBOS-013)
 * Pure domain contracts for shop-floor QC gate, defect taxonomy, and outcomes.
 */

export const QC_RESULTS = ['PASS', 'REWORK', 'REJECTED'] as const;

export type QcResult = (typeof QC_RESULTS)[number];

export const DEFECT_CATEGORIES = [
  'FABRIC',
  'PRINT_MISALIGNMENT',
  'COLOR_SHIFT',
  'ADHESION',
  'SIZING',
  'FINISHING_PACKAGING',
  'OTHER',
] as const;

export type DefectCategory = (typeof DEFECT_CATEGORIES)[number];

export const DEFECT_SEVERITIES = ['MINOR', 'MAJOR', 'CRITICAL'] as const;

export type DefectSeverity = (typeof DEFECT_SEVERITIES)[number];

export interface QcInspectionInput {
  result: QcResult;
  sampleSize: number;
  defectCount: number;
  defectCategory?: DefectCategory | null;
  defectSeverity?: DefectSeverity | null;
  reworkInstructions?: string | null;
}

export function validateQcInspection(input: QcInspectionInput): {
  valid: boolean;
  reason?: string;
} {
  if (input.sampleSize < 1) {
    return { valid: false, reason: 'Sample size pemeriksaan minimal 1' };
  }

  if (input.defectCount < 0) {
    return { valid: false, reason: 'Jumlah defect tidak boleh negatif' };
  }

  if (input.defectCount > input.sampleSize) {
    return {
      valid: false,
      reason: 'Jumlah defect tidak boleh melebihi jumlah sample',
    };
  }

  if (input.result === 'REWORK' || input.defectCount > 0) {
    if (!input.defectCategory) {
      return {
        valid: false,
        reason: 'Kategori defect wajib diisi jika ditemukan defect atau rework',
      };
    }

    if (!input.defectSeverity) {
      return {
        valid: false,
        reason: 'Tingkat keparahan (severity) defect wajib diisi',
      };
    }
  }

  if (input.result === 'REWORK') {
    if (
      !input.reworkInstructions ||
      input.reworkInstructions.trim().length < 5
    ) {
      return {
        valid: false,
        reason: 'Instruksi rework wajib diisi minimal 5 karakter',
      };
    }
  }

  return { valid: true };
}
