import { describe, expect, it, vi } from 'vitest';
import {
  loadLeadsData,
  computeLeadKpis,
  filterLeads,
  type CrmDataState,
} from '../apps/mgbos/src/app/(app)/leads/LeadListTable';
import type { LeadDetailData } from '../apps/mgbos/src/app/(app)/leads/LeadDetailModal';

const sampleLeads: LeadDetailData[] = [
  {
    id: 'lead-001',
    lead_number: 'LEAD-2026-0001',
    title: 'Seragam Kaos Komunitas Jakarta',
    contact_name: 'Budi Santoso',
    company_name: 'Komunitas Motor Bahagia',
    phone: '081234567890',
    email: 'budi@example.com',
    raw_inquiry: 'Mau pesan 100 pcs kaos combed 30s sablon DTF',
    estimated_quantity: 100,
    estimated_budget: 7500000,
    status: 'NEW',
    qualification_result: null,
    qualification_score: null,
    qualification_notes: null,
    disqualification_reason: null,
    created_at: '2026-10-15T08:00:00Z',
    qualified_at: null,
    disqualified_at: null,
    converted_at: null,
    channels: {
      id: 'ch-01',
      code: 'WHATSAPP',
      name: 'WhatsApp Business',
      channel_type: 'CHAT',
    },
    brands: { id: 'br-ts', code: 'TS', name: 'TeeStock' },
    customer_accounts: null,
    requirements: null,
  },
  {
    id: 'lead-002',
    lead_number: 'LEAD-2026-0002',
    title: 'Merchandise Jaket Hoodie Kantor',
    contact_name: 'Siti Aminah',
    company_name: 'PT Maju Bersama',
    phone: '089876543210',
    email: 'siti@majubersama.co.id',
    raw_inquiry: 'Kebutuhan hoodie bordir 50 pcs untuk gathering',
    estimated_quantity: 50,
    estimated_budget: 12500000,
    status: 'QUALIFIED',
    qualification_result: 'QUALIFIED',
    qualification_score: 85,
    qualification_notes: 'Budget & timeline matched',
    disqualification_reason: null,
    created_at: '2026-10-15T09:00:00Z',
    qualified_at: '2026-10-15T09:30:00Z',
    disqualified_at: null,
    converted_at: null,
    channels: {
      id: 'ch-02',
      code: 'WEBSITE',
      name: 'Website Atelier',
      channel_type: 'WEB',
    },
    brands: { id: 'br-mg', code: 'MG', name: 'MultiGraph' },
    customer_accounts: null,
    requirements: null,
  },
  {
    id: 'lead-003',
    lead_number: 'LEAD-2026-0003',
    title: 'Polo Shirt Bordir Event',
    contact_name: 'Rian Pratama',
    company_name: null,
    phone: '081333444555',
    email: 'rian@gmail.com',
    raw_inquiry: 'Polo shirt 30 pcs',
    estimated_quantity: 30,
    estimated_budget: 3000000,
    status: 'CONVERTED',
    qualification_result: 'QUALIFIED',
    qualification_score: 90,
    qualification_notes: 'Lanjut ke pembuatan requirement',
    disqualification_reason: null,
    created_at: '2026-10-15T10:00:00Z',
    qualified_at: '2026-10-15T10:15:00Z',
    disqualified_at: null,
    converted_at: '2026-10-15T10:45:00Z',
    channels: {
      id: 'ch-01',
      code: 'WHATSAPP',
      name: 'WhatsApp Business',
      channel_type: 'CHAT',
    },
    brands: { id: 'br-ts', code: 'TS', name: 'TeeStock' },
    customer_accounts: null,
    requirements: null,
  },
];

describe('UXR02-A Leads Data States & Acceptance Criteria', () => {
  describe('loadLeadsData', () => {
    it('AC-A01: returns SUCCESS with empty array on HTTP 200 with zero records', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const result = await loadLeadsData(
        'http://127.0.0.1:55431',
        'valid-service-key',
        'org-tenant-123',
        mockFetch as unknown as typeof fetch,
      );

      expect(result.status).toBe('SUCCESS');
      if (result.status === 'SUCCESS') {
        expect(result.data).toEqual([]);
      }
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('AC-A02: returns SUCCESS with populated records on HTTP 200', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => sampleLeads,
      });

      const result = await loadLeadsData(
        'http://127.0.0.1:55431',
        'valid-service-key',
        'org-tenant-123',
        mockFetch as unknown as typeof fetch,
      );

      expect(result.status).toBe('SUCCESS');
      if (result.status === 'SUCCESS') {
        expect(result.data).toHaveLength(3);
        expect(result.data[0]?.lead_number).toBe('LEAD-2026-0001');
      }
    });

    it('AC-A03: returns UNAVAILABLE with sanitized message on HTTP non-2xx', async () => {
      for (const status of [401, 403, 404, 500, 502, 503]) {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: false,
          status,
          json: async () => ({
            error: 'Database connection failed: internal postgres error',
          }),
        });

        const result = await loadLeadsData(
          'http://127.0.0.1:55431',
          'valid-service-key',
          'org-tenant-123',
          mockFetch as unknown as typeof fetch,
        );

        expect(result.status).toBe('UNAVAILABLE');
        if (result.status === 'UNAVAILABLE') {
          expect(result.message).toBe(
            'Layanan data leads tidak dapat diakses saat ini.',
          );
          // AC-A08: ensure sensitive upstream internal error is not leaked
          expect(result.message).not.toContain('postgres');
          expect(result.message).not.toContain(String(status));
        }
      }
    });

    it('AC-A04: returns UNAVAILABLE when service key is missing without invoking fetch', async () => {
      const mockFetch = vi.fn();

      const resultUndefined = await loadLeadsData(
        'http://127.0.0.1:55431',
        undefined,
        'org-tenant-123',
        mockFetch as unknown as typeof fetch,
      );

      expect(resultUndefined.status).toBe('UNAVAILABLE');
      if (resultUndefined.status === 'UNAVAILABLE') {
        expect(resultUndefined.message).toBe(
          'Layanan data leads tidak tersedia saat ini.',
        );
        // AC-A08: No credential name leaked
        expect(resultUndefined.message).not.toContain(
          'SUPABASE_SERVICE_ROLE_KEY',
        );
        expect(resultUndefined.message).not.toContain('serviceKey');
      }

      const resultEmpty = await loadLeadsData(
        'http://127.0.0.1:55431',
        '',
        'org-tenant-123',
        mockFetch as unknown as typeof fetch,
      );
      expect(resultEmpty.status).toBe('UNAVAILABLE');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('AC-A05: returns UNAVAILABLE when network request throws or response is malformed', async () => {
      // Network failure
      const mockFetchThrow = vi
        .fn()
        .mockRejectedValue(new Error('ECONNREFUSED'));
      const resultNet = await loadLeadsData(
        'http://127.0.0.1:55431',
        'key',
        'org-123',
        mockFetchThrow as unknown as typeof fetch,
      );
      expect(resultNet.status).toBe('UNAVAILABLE');
      if (resultNet.status === 'UNAVAILABLE') {
        expect(resultNet.message).toBe(
          'Terjadi gangguan jaringan saat memuat data leads.',
        );
        expect(resultNet.message).not.toContain('ECONNREFUSED');
      }

      // Malformed non-array response
      const mockFetchObject = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ message: 'unexpected object instead of array' }),
      });
      const resultMalformed = await loadLeadsData(
        'http://127.0.0.1:55431',
        'key',
        'org-123',
        mockFetchObject as unknown as typeof fetch,
      );
      expect(resultMalformed.status).toBe('UNAVAILABLE');
      if (resultMalformed.status === 'UNAVAILABLE') {
        expect(resultMalformed.message).toBe('Format data leads tidak valid.');
      }
    });

    it('AC-A09: strictly includes organization_id filter and headers in request', async () => {
      let capturedUrl = '';
      let capturedOptions: RequestInit | undefined;
      const mockFetch = vi
        .fn()
        .mockImplementation(async (url: string, options: RequestInit) => {
          capturedUrl = url;
          capturedOptions = options;
          return { ok: true, status: 200, json: async () => [] };
        });

      await loadLeadsData(
        'http://127.0.0.1:55431',
        'test-service-key-xyz',
        'org-strictly-isolated-99',
        mockFetch as unknown as typeof fetch,
      );

      expect(capturedUrl).toContain(
        'organization_id=eq.org-strictly-isolated-99',
      );
      expect(capturedOptions?.method).toBe('GET');
      expect(capturedOptions?.cache).toBe('no-store');
      const headers = capturedOptions?.headers as Record<string, string>;
      expect(headers['apikey']).toBe('test-service-key-xyz');
      expect(headers['Authorization']).toBe('Bearer test-service-key-xyz');
      expect(headers['Accept-Profile']).toBe('app');
    });
  });

  describe('computeLeadKpis', () => {
    it('AC-A01: computes valid numeric 0 KPIs on genuine empty dataset (HTTP 200, data: [])', () => {
      const state: CrmDataState<LeadDetailData> = {
        status: 'SUCCESS',
        data: [],
      };

      const kpis = computeLeadKpis(state, 'TS');
      expect(kpis.total).toBe(0);
      expect(kpis.newCount).toBe(0);
      expect(kpis.qualifiedCount).toBe(0);
      expect(kpis.activeBrandLeads).toBe(0);
      expect(kpis.convertedCount).toBe(0);
    });

    it('AC-A02: correctly computes brand-relative and status KPIs on populated dataset', () => {
      const state: CrmDataState<LeadDetailData> = {
        status: 'SUCCESS',
        data: sampleLeads,
      };

      const kpisTS = computeLeadKpis(state, 'TS');
      expect(kpisTS.total).toBe(3);
      expect(kpisTS.newCount).toBe(1); // lead-001
      expect(kpisTS.qualifiedCount).toBe(1); // lead-002
      expect(kpisTS.convertedCount).toBe(1); // lead-003
      expect(kpisTS.activeBrandLeads).toBe(2); // lead-001 (TS) and lead-003 (TS)

      const kpisMG = computeLeadKpis(state, 'MG');
      expect(kpisMG.activeBrandLeads).toBe(1); // lead-002 (MG)
    });

    it('AC-A03, AC-A04, AC-A05: returns null for all KPIs when status is UNAVAILABLE (never fabricated zero)', () => {
      const unavailableState: CrmDataState<LeadDetailData> = {
        status: 'UNAVAILABLE',
        message: 'Layanan data leads tidak tersedia saat ini.',
      };

      const kpis = computeLeadKpis(unavailableState, 'TS');
      expect(kpis.total).toBeNull();
      expect(kpis.newCount).toBeNull();
      expect(kpis.qualifiedCount).toBeNull();
      expect(kpis.activeBrandLeads).toBeNull();
      expect(kpis.convertedCount).toBeNull();
    });
  });

  describe('filterLeads (AC-A06)', () => {
    it('returns empty array when dataset is originally empty (True Empty)', () => {
      const filtered = filterLeads([], {
        search: '',
        statusFilter: 'ALL',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(filtered).toEqual([]);
    });

    it('distinguishes filtered-empty when search or filter returns no matches', () => {
      const filtered = filterLeads(sampleLeads, {
        search: 'nonexistent keyword xyz',
        statusFilter: 'ALL',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(filtered).toHaveLength(0);
      // Original dataset still has length 3!
      expect(sampleLeads).toHaveLength(3);
    });

    it('filters by status correctly', () => {
      const newOnly = filterLeads(sampleLeads, {
        search: '',
        statusFilter: 'NEW',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(newOnly).toHaveLength(1);
      expect(newOnly[0]?.id).toBe('lead-001');

      const qualifiedOnly = filterLeads(sampleLeads, {
        search: '',
        statusFilter: 'QUALIFIED',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(qualifiedOnly).toHaveLength(1);
      expect(qualifiedOnly[0]?.id).toBe('lead-002');
    });

    it('filters by active brand code correctly', () => {
      const tsOnly = filterLeads(sampleLeads, {
        search: '',
        statusFilter: 'ALL',
        brandFilter: 'ACTIVE',
        activeBrandCode: 'TS',
      });
      expect(tsOnly).toHaveLength(2);
      expect(tsOnly.map((l) => l.brands?.code)).toEqual(['TS', 'TS']);

      const mgOnly = filterLeads(sampleLeads, {
        search: '',
        statusFilter: 'ALL',
        brandFilter: 'ACTIVE',
        activeBrandCode: 'MG',
      });
      expect(mgOnly).toHaveLength(1);
      expect(mgOnly[0]?.brands?.code).toBe('MG');
    });

    it('searches across title, lead_number, contact_name, company_name, and phone', () => {
      // By lead number
      expect(
        filterLeads(sampleLeads, {
          search: 'LEAD-2026-0002',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By title
      expect(
        filterLeads(sampleLeads, {
          search: 'Kaos Komunitas',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By contact name
      expect(
        filterLeads(sampleLeads, {
          search: 'Siti Aminah',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By company name
      expect(
        filterLeads(sampleLeads, {
          search: 'Maju Bersama',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By phone
      expect(
        filterLeads(sampleLeads, {
          search: '081333444555',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);
    });
  });
});
