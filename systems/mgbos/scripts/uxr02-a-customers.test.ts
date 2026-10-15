import { describe, expect, it, vi } from 'vitest';
import {
  loadCustomersData,
  computeCustomerKpis,
  filterCustomers,
  type CustomerData,
  type CrmDataState,
} from '../apps/mgbos/src/app/(app)/customers/CustomerListTable';

const sampleCustomers: CustomerData[] = [
  {
    id: 'cust-001',
    account_type: 'COMPANY',
    display_name: 'PT Sinar Digital Nusantara',
    legal_name: 'PT Sinar Digital Nusantara Utama',
    primary_email: 'procurement@sinardigital.co.id',
    primary_phone: '021-5551234',
    tax_id: '01.234.567.8-901.000',
    status: 'ACTIVE',
    customer_since: '2026-01-15T00:00:00Z',
    customer_contacts: [
      {
        id: 'pic-1',
        name: 'Hendro Gunawan',
        email: 'hendro@sinardigital.co.id',
        phone: '0811223344',
        position: 'Head of Procurement',
        is_primary: true,
      },
      {
        id: 'pic-2',
        name: 'Dewi Lestari',
        email: 'dewi@sinardigital.co.id',
        phone: '0811223355',
        position: 'Finance Admin',
        is_primary: false,
      },
    ],
    customer_brand_relationships: [
      {
        id: 'rel-1',
        brand_id: 'br-ts',
        customer_segment: 'CORPORATE_BULK',
        relationship_status: 'ACTIVE',
        brands: { id: 'br-ts', code: 'TS', name: 'TeeStock' },
      },
      {
        id: 'rel-2',
        brand_id: 'br-mg',
        customer_segment: 'PREMIUM_B2B',
        relationship_status: 'ACTIVE',
        brands: { id: 'br-mg', code: 'MG', name: 'MultiGraph' },
      },
    ],
  },
  {
    id: 'cust-002',
    account_type: 'PERSON',
    display_name: 'Ahmad Fauzi',
    legal_name: null,
    primary_email: 'ahmad.fauzi@gmail.com',
    primary_phone: '081298765432',
    tax_id: null,
    status: 'ACTIVE',
    customer_since: '2026-03-20T00:00:00Z',
    customer_contacts: [
      {
        id: 'pic-3',
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@gmail.com',
        phone: '081298765432',
        position: 'Owner',
        is_primary: true,
      },
    ],
    customer_brand_relationships: [
      {
        id: 'rel-3',
        brand_id: 'br-ts',
        customer_segment: 'RETAIL_RESELLER',
        relationship_status: 'ACTIVE',
        brands: { id: 'br-ts', code: 'TS', name: 'TeeStock' },
      },
    ],
  },
  {
    id: 'cust-003',
    account_type: 'COMPANY',
    display_name: 'CV Makmur Sejahtera',
    legal_name: 'CV Makmur Sejahtera Abadi',
    primary_email: 'makmur@sejahtera.com',
    primary_phone: '031-8889999',
    tax_id: '02.345.678.9-012.000',
    status: 'INACTIVE',
    customer_since: '2025-11-10T00:00:00Z',
    customer_contacts: [
      {
        id: 'pic-4',
        name: 'Bambang Sudiro',
        email: 'bambang@sejahtera.com',
        phone: '0813998877',
        position: 'Manager Operasional',
        is_primary: true,
      },
    ],
    customer_brand_relationships: [
      {
        id: 'rel-4',
        brand_id: 'br-mg',
        customer_segment: 'CUSTOM_PRODUCTION',
        relationship_status: 'DORMANT',
        brands: { id: 'br-mg', code: 'MG', name: 'MultiGraph' },
      },
    ],
  },
];

describe('UXR02-A Customers Data States & Acceptance Criteria', () => {
  describe('loadCustomersData', () => {
    it('AC-A01: returns SUCCESS with empty array on HTTP 200 with zero records', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const result = await loadCustomersData(
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
        json: async () => sampleCustomers,
      });

      const result = await loadCustomersData(
        'http://127.0.0.1:55431',
        'valid-service-key',
        'org-tenant-123',
        mockFetch as unknown as typeof fetch,
      );

      expect(result.status).toBe('SUCCESS');
      if (result.status === 'SUCCESS') {
        expect(result.data).toHaveLength(3);
        expect(result.data[0]?.display_name).toBe('PT Sinar Digital Nusantara');
      }
    });

    it('AC-A03: returns UNAVAILABLE with sanitized message on HTTP non-2xx', async () => {
      for (const status of [401, 403, 404, 500, 502, 503]) {
        const mockFetch = vi.fn().mockResolvedValue({
          ok: false,
          status,
          json: async () => ({
            error: 'Upstream connection error 500: psql timeout',
          }),
        });

        const result = await loadCustomersData(
          'http://127.0.0.1:55431',
          'valid-service-key',
          'org-tenant-123',
          mockFetch as unknown as typeof fetch,
        );

        expect(result.status).toBe('UNAVAILABLE');
        if (result.status === 'UNAVAILABLE') {
          expect(result.message).toBe(
            'Layanan data customer tidak dapat diakses saat ini.',
          );
          // AC-A08: ensure sensitive upstream internal error is not leaked
          expect(result.message).not.toContain('psql');
          expect(result.message).not.toContain(String(status));
        }
      }
    });

    it('AC-A04: returns UNAVAILABLE when service key is missing without invoking fetch', async () => {
      const mockFetch = vi.fn();

      const resultUndefined = await loadCustomersData(
        'http://127.0.0.1:55431',
        undefined,
        'org-tenant-123',
        mockFetch as unknown as typeof fetch,
      );

      expect(resultUndefined.status).toBe('UNAVAILABLE');
      if (resultUndefined.status === 'UNAVAILABLE') {
        expect(resultUndefined.message).toBe(
          'Layanan data customer tidak tersedia saat ini.',
        );
        // AC-A08: No credential name leaked
        expect(resultUndefined.message).not.toContain(
          'SUPABASE_SERVICE_ROLE_KEY',
        );
        expect(resultUndefined.message).not.toContain('serviceKey');
      }

      const resultEmpty = await loadCustomersData(
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
        .mockRejectedValue(new Error('Fetch network error'));
      const resultNet = await loadCustomersData(
        'http://127.0.0.1:55431',
        'key',
        'org-123',
        mockFetchThrow as unknown as typeof fetch,
      );
      expect(resultNet.status).toBe('UNAVAILABLE');
      if (resultNet.status === 'UNAVAILABLE') {
        expect(resultNet.message).toBe(
          'Terjadi gangguan jaringan saat memuat data customer.',
        );
        expect(resultNet.message).not.toContain('Fetch network error');
      }

      // Malformed non-array response
      const mockFetchObject = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ error: 'Invalid schema' }),
      });
      const resultMalformed = await loadCustomersData(
        'http://127.0.0.1:55431',
        'key',
        'org-123',
        mockFetchObject as unknown as typeof fetch,
      );
      expect(resultMalformed.status).toBe('UNAVAILABLE');
      if (resultMalformed.status === 'UNAVAILABLE') {
        expect(resultMalformed.message).toBe(
          'Format data customer tidak valid.',
        );
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

      await loadCustomersData(
        'http://127.0.0.1:55431',
        'test-service-key-xyz',
        'org-tenant-isolated-42',
        mockFetch as unknown as typeof fetch,
      );

      expect(capturedUrl).toContain(
        'organization_id=eq.org-tenant-isolated-42',
      );
      expect(capturedOptions?.method).toBe('GET');
      expect(capturedOptions?.cache).toBe('no-store');
      const headers = capturedOptions?.headers as Record<string, string>;
      expect(headers['apikey']).toBe('test-service-key-xyz');
      expect(headers['Authorization']).toBe('Bearer test-service-key-xyz');
      expect(headers['Accept-Profile']).toBe('app');
    });
  });

  describe('computeCustomerKpis', () => {
    it('AC-A01: computes valid numeric 0 KPIs on genuine empty dataset (HTTP 200, data: [])', () => {
      const state: CrmDataState<CustomerData> = {
        status: 'SUCCESS',
        data: [],
      };

      const kpis = computeCustomerKpis(state, 'TS');
      expect(kpis.total).toBe(0);
      expect(kpis.companyCount).toBe(0);
      expect(kpis.personCount).toBe(0);
      expect(kpis.activeBrandCustomers).toBe(0);
    });

    it('AC-A02: correctly computes brand-relative and type KPIs on populated dataset', () => {
      const state: CrmDataState<CustomerData> = {
        status: 'SUCCESS',
        data: sampleCustomers,
      };

      const kpisTS = computeCustomerKpis(state, 'TS');
      expect(kpisTS.total).toBe(3);
      expect(kpisTS.companyCount).toBe(2); // cust-001, cust-003
      expect(kpisTS.personCount).toBe(1); // cust-002
      expect(kpisTS.activeBrandCustomers).toBe(2); // cust-001 (TS & MG), cust-002 (TS)

      const kpisMG = computeCustomerKpis(state, 'MG');
      expect(kpisMG.activeBrandCustomers).toBe(2); // cust-001 (TS & MG), cust-003 (MG)
    });

    it('AC-A03, AC-A04, AC-A05: returns null for all KPIs when status is UNAVAILABLE (never fabricated zero)', () => {
      const unavailableState: CrmDataState<CustomerData> = {
        status: 'UNAVAILABLE',
        message: 'Layanan data customer tidak tersedia saat ini.',
      };

      const kpis = computeCustomerKpis(unavailableState, 'TS');
      expect(kpis.total).toBeNull();
      expect(kpis.companyCount).toBeNull();
      expect(kpis.personCount).toBeNull();
      expect(kpis.activeBrandCustomers).toBeNull();
    });
  });

  describe('filterCustomers (AC-A06)', () => {
    it('returns empty array when dataset is originally empty (True Empty)', () => {
      const filtered = filterCustomers([], {
        search: '',
        typeFilter: 'ALL',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(filtered).toEqual([]);
    });

    it('distinguishes filtered-empty when search or filter returns no matches', () => {
      const filtered = filterCustomers(sampleCustomers, {
        search: 'nonexistent customer xyz',
        typeFilter: 'ALL',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(filtered).toHaveLength(0);
      // Original dataset still has length 3!
      expect(sampleCustomers).toHaveLength(3);
    });

    it('filters by account type correctly (COMPANY vs PERSON)', () => {
      const companyOnly = filterCustomers(sampleCustomers, {
        search: '',
        typeFilter: 'COMPANY',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(companyOnly).toHaveLength(2);
      expect(companyOnly.every((c) => c.account_type === 'COMPANY')).toBe(true);

      const personOnly = filterCustomers(sampleCustomers, {
        search: '',
        typeFilter: 'PERSON',
        brandFilter: 'ALL',
        activeBrandCode: 'TS',
      });
      expect(personOnly).toHaveLength(1);
      expect(personOnly[0]?.id).toBe('cust-002');
    });

    it('filters by active brand code correctly', () => {
      const tsOnly = filterCustomers(sampleCustomers, {
        search: '',
        typeFilter: 'ALL',
        brandFilter: 'ACTIVE',
        activeBrandCode: 'TS',
      });
      expect(tsOnly).toHaveLength(2); // cust-001 and cust-002

      const mgOnly = filterCustomers(sampleCustomers, {
        search: '',
        typeFilter: 'ALL',
        brandFilter: 'ACTIVE',
        activeBrandCode: 'MG',
      });
      expect(mgOnly).toHaveLength(2); // cust-001 and cust-003
    });

    it('searches across display_name, legal_name, email, phone, and contact names', () => {
      // By display_name
      expect(
        filterCustomers(sampleCustomers, {
          search: 'Sinar Digital',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By legal_name
      expect(
        filterCustomers(sampleCustomers, {
          search: 'Makmur Sejahtera Abadi',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By email
      expect(
        filterCustomers(sampleCustomers, {
          search: 'procurement@sinardigital.co.id',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By phone
      expect(
        filterCustomers(sampleCustomers, {
          search: '031-8889999',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By PIC contact name
      expect(
        filterCustomers(sampleCustomers, {
          search: 'Hendro Gunawan',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      // By secondary contact name
      expect(
        filterCustomers(sampleCustomers, {
          search: 'Dewi Lestari',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);
    });
  });
});
