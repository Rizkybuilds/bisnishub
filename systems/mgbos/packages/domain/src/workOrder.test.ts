import { describe, expect, it } from 'vitest';
import {
  buildWorkOrderDocument,
  extractTechnicalSpecifications,
  workOrderVendorMessage,
  WorkOrderSource,
} from './workOrder';

describe('Work Order / SPK Domain Service (P0-06)', () => {
  const baseSource: WorkOrderSource = {
    job: {
      id: 'job-uuid-1',
      jobNumber: 'JOB-202609-001',
      title: 'Sablon Kaos Oversized Drop 1',
      jobType: 'PRINTING',
      status: 'READY',
      priority: 'HIGH',
      targetCompletionDate: '2026-10-05',
      notes:
        'Gunakan tinta plastisol high-density. Jangan sampai curing underbake.',
      createdAt: '2026-09-30T10:00:00Z',
    },
    order: {
      id: 'order-uuid-1',
      orderNumber: 'ORD-202609-008',
    },
    issuer: {
      organizationName: 'MGBOS Holding Inc.',
      brandName: 'TeeStock Atelier',
      brandCode: 'TSK',
    },
    assignment: {
      id: 'assign-uuid-1',
      status: 'ASSIGNED',
      executorType: 'VENDOR',
      assignedCost: 750000n,
      assignedAt: '2026-09-30T10:30:00Z',
      notes: 'Tolong prioritaskan selesai sebelum tanggal 5.',
      vendor: {
        id: 'vendor-uuid-1',
        code: 'VND-SBL-01',
        name: 'Berkah Sablon Screen & DTF',
        category: 'PRINT_STUDIO',
        phone: '+628123456789',
        email: 'berkah@sablon.id',
        address: 'Jl. Percetakan No. 42, Bandung',
        contactPerson: 'Pak Joko',
      },
    },
    items: [
      {
        id: 'item-uuid-1',
        description: 'T-Shirt Oversized Heavyweight Cotton 20s',
        allocatedQuantity: 50,
        unit: 'pcs',
        notes: '25 Black, 25 White',
        specificationSnapshot: {
          schemaCode: 'teestock.custom_atelier.v1',
          garment: {
            type: 'Oversized T-Shirt',
            fit: 'Oversized',
            material: 'Heavy Cotton Combed 20s',
            color: 'Jet Black / Pure White',
            gsm: 235,
            blankPreference: 'Heavyweight Tubular',
          },
          sizes: { S: 10, M: 15, L: 15, XL: 10 },
          decorations: [
            {
              location: 'Back',
              method: 'DTF',
              widthCm: 28,
              heightCm: 35,
              artworkReference: 'artwork_drop1_back_print.pdf',
              notes: 'Posisi tengah punggung, 7cm turun dari rib leher',
            },
            {
              location: 'Left Chest',
              method: 'DTF',
              widthCm: 8,
              heightCm: 4,
              artworkReference: 'artwork_drop1_chest_logo.ai',
            },
          ],
          customization: 'Neck label woven damask sewn inside collar',
        },
      },
    ],
  };

  describe('extractTechnicalSpecifications', () => {
    it('parses custom atelier specifications accurately', () => {
      const specs = extractTechnicalSpecifications(
        baseSource.items[0]!.specificationSnapshot,
      );

      expect(specs).toContain('Pakaian: Oversized T-Shirt');
      expect(specs).toContain('Fit: Oversized');
      expect(specs).toContain('Bahan: Heavy Cotton Combed 20s');
      expect(specs).toContain('Warna: Jet Black / Pure White');
      expect(specs).toContain('GSM: 235');
      expect(specs).toContain('Breakdown Ukuran: S: 10, M: 15, L: 15, XL: 10');
      expect(
        specs.some((s) => s.includes('Dekorasi: Back · DTF (28cm x 35cm)')),
      ).toBe(true);
      expect(
        specs.some((s) => s.includes('Dekorasi: Left Chest · DTF (8cm x 4cm)')),
      ).toBe(true);
      expect(specs).toContain(
        'Kustomisasi: Neck label woven damask sewn inside collar',
      );
    });

    it('sanitizes generic specifications by stripping sensitive financial/pricing keys (AC-08)', () => {
      const sensitiveSpec = {
        material: 'Canvas Premium 12oz',
        stitching: 'Double-needle flat fell seam',
        // Sensitive fields that MUST NOT leak to shop-floor / vendor
        customer_price: 150000,
        unit_price: 150000,
        subtotal: 7500000,
        estimated_cost: 3000000,
        gross_profit: 4500000,
        margin: '60%',
        customer_name: 'Budi Raharjo',
        customer_phone: '0819999999',
        billing_address: 'Secret VIP Residence',
      };

      const specs = extractTechnicalSpecifications(sensitiveSpec);

      expect(specs).toContain('material: Canvas Premium 12oz');
      expect(specs).toContain('stitching: Double-needle flat fell seam');

      // Assert ZERO leak
      const joined = specs.join(' ').toLowerCase();
      expect(joined).not.toContain('customer_price');
      expect(joined).not.toContain('unit_price');
      expect(joined).not.toContain('gross_profit');
      expect(joined).not.toContain('margin');
      expect(joined).not.toContain('budi raharjo');
      expect(joined).not.toContain('secret vip');
    });

    it('returns empty array when specification is null or empty', () => {
      expect(extractTechnicalSpecifications(null)).toEqual([]);
      expect(extractTechnicalSpecifications(undefined)).toEqual([]);
      expect(extractTechnicalSpecifications({})).toEqual([]);
    });
  });

  describe('buildWorkOrderDocument', () => {
    it('builds a valid Work Order for active vendor assignment (AC-03, AC-04, AC-05, AC-06, AC-07)', () => {
      const fixedDate = new Date('2026-09-30T11:00:00Z');
      const doc = buildWorkOrderDocument(baseSource, fixedDate);

      expect(doc.spkNumber).toBe('SPK-JOB-202609-001');
      expect(doc.orderNumber).toBe('ORD-202609-008');
      expect(doc.jobNumber).toBe('JOB-202609-001');
      expect(doc.jobType).toBe('PRINTING');
      expect(doc.title).toBe('Sablon Kaos Oversized Drop 1');
      expect(doc.priority).toBe('HIGH');
      expect(doc.targetDeadline).toBe('2026-10-05');

      // Executor verification (AC-04)
      expect(doc.executor.type).toBe('VENDOR');
      expect(doc.executor.name).toBe('Berkah Sablon Screen & DTF');
      expect(doc.executor.code).toBe('VND-SBL-01');
      expect(doc.executor.phone).toBe('+628123456789');

      // Committed cost context (AC-07)
      expect(doc.assignment?.assignedCostFormatted).toBe('Rp 750.000');
      expect(doc.assignment?.assignedCostRaw).toBe(750000n);
      expect(doc.assignment?.isHistorical).toBe(false);

      // Quantities and specs (AC-05)
      expect(doc.totalQuantity).toBe(50);
      expect(doc.items).toHaveLength(1);
      expect(doc.items[0]!.description).toBe(
        'T-Shirt Oversized Heavyweight Cotton 20s',
      );
      expect(doc.items[0]!.quantity).toBe(50);

      // Instructions
      expect(doc.instructions).toHaveLength(2);
      expect(doc.instructions[0]).toContain('Gunakan tinta plastisol');
      expect(doc.instructions[1]).toContain('Tolong prioritaskan');

      // File references extracted from artwork refs
      expect(
        doc.fileReferences.some(
          (f) => f.name === 'artwork_drop1_back_print.pdf',
        ),
      ).toBe(true);
      expect(
        doc.fileReferences.some(
          (f) => f.name === 'artwork_drop1_chest_logo.ai',
        ),
      ).toBe(true);

      // Notice
      expect(doc.notice).toContain('SPK RESMI');
    });

    it('handles internal studio executor correctly', () => {
      const internalSource: WorkOrderSource = {
        ...baseSource,
        assignment: {
          id: 'assign-uuid-2',
          status: 'ACCEPTED',
          executorType: 'INTERNAL',
          assignedCost: 0n,
          assignedAt: '2026-09-30T10:00:00Z',
          brand: {
            id: 'brand-uuid-1',
            code: 'TSK',
            name: 'TeeStock Studio Internal',
          },
        },
      };

      const doc = buildWorkOrderDocument(internalSource);
      expect(doc.executor.type).toBe('INTERNAL');
      expect(doc.executor.name).toBe('TeeStock Studio Internal');
      expect(doc.executor.code).toBe('TSK');
      expect(doc.executor.category).toBe('In-House Studio');
      expect(doc.assignment?.assignedCostFormatted).toBe('Rp 0');
      expect(doc.notice).toContain('TERKONFIRMASI');
    });

    it('handles unassigned job safely with draft notice', () => {
      const unassignedSource: WorkOrderSource = {
        ...baseSource,
        assignment: null,
      };

      const doc = buildWorkOrderDocument(unassignedSource);
      expect(doc.executor.type).toBe('UNASSIGNED');
      expect(doc.executor.name).toBe('BELUM DITUGASKAN');
      expect(doc.assignment).toBeNull();
      expect(doc.notice).toContain('DRAF SPK');
    });

    it('clearly distinguishes historical / declined assignments (AC-10)', () => {
      const historicalSource: WorkOrderSource = {
        ...baseSource,
        assignment: {
          ...baseSource.assignment!,
          id: 'declined-assign-12345678',
          status: 'DECLINED',
          notes: 'Kapasitas penuh sampai akhir pekan',
        },
        isLatestAssignment: false,
      };

      const doc = buildWorkOrderDocument(historicalSource);
      expect(doc.assignment?.isHistorical).toBe(true);
      expect(doc.assignment?.status).toBe('DECLINED');
      expect(doc.spkNumber).toContain('declined');
      expect(doc.notice).toContain('DOKUMEN HISTORIS');
      expect(doc.notice).toContain('DECLINED');
    });

    it('preserves historical snapshot vendorName when vendor master is renamed (F7)', () => {
      const sourceWithRenamedVendor: WorkOrderSource = {
        ...baseSource,
        assignment: {
          ...baseSource.assignment!,
          vendorName: 'Original Vendor Name A (Snapshot)',
          vendor: {
            ...baseSource.assignment!.vendor!,
            name: 'Renamed Vendor Master B (Live)',
          },
        },
        isLatestAssignment: false,
      };

      const doc = buildWorkOrderDocument(sourceWithRenamedVendor);
      expect(doc.executor.name).toBe('Original Vendor Name A (Snapshot)');
    });
  });

  describe('workOrderVendorMessage', () => {
    it('generates structured WhatsApp-ready message for vendor', () => {
      const doc = buildWorkOrderDocument(baseSource);
      const msg = workOrderVendorMessage(doc);

      expect(msg).toContain('*SURAT PERINTAH KERJA (SPK)*');
      expect(msg).toContain('No. SPK: *SPK-JOB-202609-001*');
      expect(msg).toContain('No. Pesanan: ORD-202609-008');
      expect(msg).toContain('Pelaksana: *Berkah Sablon Screen & DTF*');
      expect(msg).toContain('Biaya Komitmen Pengerjaan: *Rp 750.000*');
      expect(msg).toContain('Tenggat Penyelesaian: *2026-10-05*');
      expect(msg).toContain('Total: 50 pcs');
      expect(msg).toContain('artwork_drop1_back_print.pdf');
      expect(msg).toContain('Mohon konfirmasi penerimaan pekerjaan');
    });
  });
});
