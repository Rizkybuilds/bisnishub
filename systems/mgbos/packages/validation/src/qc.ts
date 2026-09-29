import { z } from 'zod';
import {
  QC_RESULTS,
  DEFECT_CATEGORIES,
  DEFECT_SEVERITIES,
} from '@mgbos/domain';

export const recordQcInspectionSchema = z
  .object({
    productionJobId: z.string().uuid('ID job produksi tidak valid'),
    result: z.enum(QC_RESULTS, {
      message: 'Hasil QC harus PASS, REWORK, atau REJECTED',
    }),
    sampleSize: z.number().int().min(1, 'Sample size minimal 1').default(1),
    defectCount: z
      .number()
      .int()
      .min(0, 'Jumlah defect tidak boleh negatif')
      .default(0),
    defectCategory: z.enum(DEFECT_CATEGORIES).optional().nullable(),
    defectSeverity: z.enum(DEFECT_SEVERITIES).optional().nullable(),
    checklistSnapshot: z.record(z.string(), z.unknown()).default({}),
    reworkInstructions: z.string().trim().max(2000).optional().nullable(),
    notes: z.string().trim().max(2000).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.defectCount > data.sampleSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Jumlah defect tidak boleh melebihi jumlah sample',
        path: ['defectCount'],
      });
    }

    if (data.result === 'REWORK' || data.defectCount > 0) {
      if (!data.defectCategory) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Kategori defect wajib diisi jika ditemukan defect atau rework',
          path: ['defectCategory'],
        });
      }

      if (!data.defectSeverity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Tingkat keparahan (severity) defect wajib diisi',
          path: ['defectSeverity'],
        });
      }
    }

    if (data.result === 'REWORK') {
      if (
        !data.reworkInstructions ||
        data.reworkInstructions.trim().length < 5
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            'Instruksi pengerjaan ulang (rework) wajib diisi minimal 5 karakter',
          path: ['reworkInstructions'],
        });
      }
    }
  });

export type RecordQcInspectionInput = z.infer<typeof recordQcInspectionSchema>;
