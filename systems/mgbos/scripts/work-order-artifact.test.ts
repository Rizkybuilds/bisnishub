import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
}));

vi.mock('../apps/mgbos/src/lib/session.server', () => ({
  getSession: mocks.session,
}));

vi.mock('../apps/mgbos/src/lib/env.server', () => ({
  serverEnvironment: { SUPABASE_SERVICE_ROLE_KEY: 'test-service-key' },
}));

vi.mock('../apps/mgbos/src/lib/env.client', () => ({
  publicEnvironment: { NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431' },
}));

import {
  loadWorkOrder,
  DocumentAccessError,
} from '../apps/mgbos/src/lib/workOrder/load.server';

const validJobId = '00000000-0000-4000-8000-000000000001';
const validOrderId = '00000000-0000-4000-8000-000000000002';
const validBrandId = '00000000-0000-4000-8000-000000000003';
const validAssignId1 = '00000000-0000-4000-8000-000000000004';
const validAssignId2 = '00000000-0000-4000-8000-000000000005';
const validVendorId = '00000000-0000-4000-8000-000000000006';

const validSession = {
  organization: {
    id: 'org-uuid-001',
    code: 'TEST',
    displayName: 'MGBOS Test Organization',
  },
  user: { id: 'user-uuid-001' },
  role: { code: 'OPERATIONS' }, // has production:read
};

describe('Governed Work Order / SPK Artifact Loader (P0-06)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.session.mockResolvedValue(validSession);
  });

  it('rejects unauthenticated requests with 401 (AC-01)', async () => {
    mocks.session.mockResolvedValue(null);

    await expect(loadWorkOrder(validJobId)).rejects.toThrowError(
      DocumentAccessError,
    );
    await expect(loadWorkOrder(validJobId)).rejects.toMatchObject({
      status: 401,
      message: 'Silakan masuk terlebih dahulu.',
    });
  });

  it('rejects unauthorized roles lacking production:read with 403 (AC-01)', async () => {
    mocks.session.mockResolvedValue({
      ...validSession,
      role: { code: 'CUSTOMER' },
    });

    await expect(loadWorkOrder(validJobId)).rejects.toThrowError(
      DocumentAccessError,
    );
    await expect(loadWorkOrder(validJobId)).rejects.toMatchObject({
      status: 403,
    });
  });

  it('enforces organization isolation and rejects cross-org job requests with 404 (AC-02)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        // Return empty array for cross-org lookup
        if (url.includes('production_jobs?')) {
          return Promise.resolve(
            new Response(JSON.stringify([]), { status: 200 }),
          );
        }
        return Promise.resolve(
          new Response(JSON.stringify([]), { status: 200 }),
        );
      }),
    );

    await expect(loadWorkOrder(validJobId)).rejects.toThrowError(
      DocumentAccessError,
    );
    await expect(loadWorkOrder(validJobId)).rejects.toMatchObject({
      status: 404,
      message: 'Job produksi tidak ditemukan.',
    });
  });

  it('loads and generates complete governed SPK artifact (AC-03 to AC-08, AC-11)', async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation((url: string, options?: RequestInit) => {
        // Assert that all requests are read-only (AC-11: no mutations)
        expect(options?.method === undefined || options?.method === 'GET').toBe(
          true,
        );

        if (url.includes('production_jobs?')) {
          expect(url).toContain(
            `organization_id=eq.${validSession.organization.id}`,
          );
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validJobId,
                  organization_id: validSession.organization.id,
                  job_number: 'JOB-202609-001',
                  title: 'Sablon DTF Apparel Batch 1',
                  job_type: 'PRINTING',
                  status: 'ASSIGNED',
                  priority: 'HIGH',
                  target_completion_date: '2026-10-04',
                  notes:
                    'Gunakan pet film kualitas super dan press 160C 15 detik.',
                  created_at: '2026-09-30T10:00:00Z',
                  order_id: validOrderId,
                  brand_id: validBrandId,
                  specification: {},
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('orders?')) {
          expect(url).toContain(
            `organization_id=eq.${validSession.organization.id}`,
          );
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validOrderId,
                  order_number: 'ORD-202609-001',
                  brand_id: validBrandId,
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('brands?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validBrandId,
                  code: 'TSK',
                  name: 'TeeStock Brand',
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('production_assignments?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validAssignId1,
                  production_job_id: validJobId,
                  executor_type: 'VENDOR',
                  assigned_brand_id: null,
                  vendor_id: validVendorId,
                  vendor_name: 'Mitra DTF Express',
                  assigned_cost: '650000',
                  status: 'ASSIGNED',
                  assigned_at: '2026-09-30T10:15:00Z',
                  accepted_at: null,
                  notes: 'Tolong kerjakan duluan sebelum siang.',
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('vendors?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validVendorId,
                  code: 'VND-DTF-01',
                  name: 'Mitra DTF Express Bandung',
                  category: 'PRINT_STUDIO',
                  contact_person: 'Kang Asep',
                  phone: '081234567890',
                  email: 'asep@dtfexpress.id',
                  address: 'Jl. Industri Grafika No. 12',
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('production_job_items?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: 'job-item-1',
                  quantity: 40,
                  notes: '20 M, 20 L',
                  order_items: {
                    id: 'order-item-1',
                    description: 'Kaos Combed 24s Hitam',
                    unit: 'pcs',
                    specification_snapshot: {
                      schemaCode: 'teestock.custom_atelier.v1',
                      garment: {
                        type: 'T-Shirt',
                        fit: 'Regular',
                        material: 'Cotton Combed 24s',
                        color: 'Black',
                        gsm: 185,
                        blankPreference: 'Koze Comfort',
                      },
                      sizes: { M: 20, L: 20 },
                      decorations: [
                        {
                          location: 'Front',
                          method: 'DTF',
                          widthCm: 25,
                          heightCm: 30,
                          artworkReference: 'artwork_kaos_front.png',
                        },
                      ],
                    },
                  },
                },
              ]),
              { status: 200 },
            ),
          );
        }

        return Promise.resolve(
          new Response(JSON.stringify([]), { status: 200 }),
        );
      });

    vi.stubGlobal('fetch', fetchMock);

    const doc = await loadWorkOrder(validJobId);

    // AC-03: Correct Job shown
    expect(doc.spkNumber).toBe('SPK-JOB-202609-001');
    expect(doc.jobNumber).toBe('JOB-202609-001');
    expect(doc.orderNumber).toBe('ORD-202609-001');
    expect(doc.title).toBe('Sablon DTF Apparel Batch 1');
    expect(doc.jobType).toBe('PRINTING');

    // AC-04: Correct Vendor shown
    expect(doc.executor.type).toBe('VENDOR');
    expect(doc.executor.name).toBe('Mitra DTF Express Bandung');
    expect(doc.executor.code).toBe('VND-DTF-01');
    expect(doc.executor.contactPerson).toBe('Kang Asep');
    expect(doc.executor.phone).toBe('081234567890');

    // AC-05: Correct quantities & specifications shown
    expect(doc.totalQuantity).toBe(40);
    expect(doc.items).toHaveLength(1);
    const item = doc.items[0]!;
    expect(item.description).toBe('Kaos Combed 24s Hitam');
    expect(item.quantity).toBe(40);
    expect(
      item.specifications.some((s) => s.includes('Cotton Combed 24s')),
    ).toBe(true);
    expect(item.specifications.some((s) => s.includes('M: 20, L: 20'))).toBe(
      true,
    );
    expect(
      item.specifications.some((s) => s.includes('DTF (25cm x 30cm)')),
    ).toBe(true);

    // AC-06: Correct deadline shown
    expect(doc.targetDeadline).toBe('2026-10-04');

    // AC-07: Correct committed cost context shown
    expect(doc.assignment?.assignedCostFormatted).toBe('Rp 650.000');
    expect(doc.assignment?.assignedCostRaw).toBe(650000n);

    // AC-08: Security allowlist — no internal margin leak
    const docJson = JSON.stringify(doc, (_, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    ).toLowerCase();
    expect(docJson).not.toContain('gross_profit');
    expect(docJson).not.toContain('grossprofit');
    expect(docJson).not.toContain('margin');
    expect(docJson).not.toContain('customer_price');

    // AC-11: Document generation caused no hidden Production state mutation
    expect(fetchMock).toHaveBeenCalled();
  });

  it('distinguishes historical assignment when assignmentId is requested (AC-10)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('production_jobs?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validJobId,
                  organization_id: validSession.organization.id,
                  job_number: 'JOB-202609-001',
                  title: 'Sablon DTF Apparel Batch 1',
                  job_type: 'PRINTING',
                  status: 'ASSIGNED',
                  priority: 'HIGH',
                  target_completion_date: '2026-10-04',
                  notes: null,
                  created_at: '2026-09-30T10:00:00Z',
                  order_id: validOrderId,
                  brand_id: validBrandId,
                  specification: {},
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('orders?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validOrderId,
                  order_number: 'ORD-202609-001',
                  brand_id: validBrandId,
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('brands?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                { id: validBrandId, code: 'TSK', name: 'TeeStock' },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('production_assignments?')) {
          // Return 2 assignments: validAssignId1 (latest) and validAssignId2 (declined past)
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validAssignId1,
                  production_job_id: validJobId,
                  executor_type: 'VENDOR',
                  assigned_brand_id: null,
                  vendor_id: validVendorId,
                  vendor_name: 'Mitra Baru',
                  assigned_cost: '650000',
                  status: 'ASSIGNED',
                  assigned_at: '2026-09-30T14:00:00Z',
                  accepted_at: null,
                  notes: null,
                },
                {
                  id: validAssignId2,
                  production_job_id: validJobId,
                  executor_type: 'VENDOR',
                  assigned_brand_id: null,
                  vendor_id: validVendorId,
                  vendor_name: 'Mitra Lama',
                  assigned_cost: '500000',
                  status: 'DECLINED',
                  assigned_at: '2026-09-30T09:00:00Z',
                  accepted_at: null,
                  notes: 'Vendor menolak karena antrian penuh',
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('vendors?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: validVendorId,
                  code: 'VND-OLD',
                  name: 'Mitra Lama Screen',
                  category: 'PRINT_STUDIO',
                  contact_person: 'Pak Budi',
                  phone: '08111111111',
                  email: null,
                  address: null,
                },
              ]),
              { status: 200 },
            ),
          );
        }

        if (url.includes('production_job_items?')) {
          return Promise.resolve(
            new Response(
              JSON.stringify([
                {
                  id: 'job-item-1',
                  quantity: 10,
                  notes: null,
                  order_items: {
                    id: 'order-item-1',
                    description: 'Kaos Uji Coba',
                    unit: 'pcs',
                    specification_snapshot: {},
                  },
                },
              ]),
              { status: 200 },
            ),
          );
        }

        return Promise.resolve(
          new Response(JSON.stringify([]), { status: 200 }),
        );
      }),
    );

    // Request specifically the historical assignment validAssignId2
    const doc = await loadWorkOrder(validJobId, validAssignId2);

    expect(doc.assignment?.id).toBe(validAssignId2);
    expect(doc.assignment?.isHistorical).toBe(true);
    expect(doc.assignment?.status).toBe('DECLINED');
    expect(doc.assignment?.assignedCostFormatted).toBe('Rp 500.000');
    expect(doc.notice).toContain('DOKUMEN HISTORIS');
    expect(doc.notice).toContain('DECLINED');
  });
});
