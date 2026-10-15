import { describe, expect, it, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Hoisted mocks for session.server and env.server
const sessionMock = vi.hoisted(() => ({
  requireAuth: vi.fn(),
}));

const envMock = vi.hoisted(() => ({
  serverEnvironment: {
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key-cust-888',
  },
}));

vi.mock('@/lib/session.server', () => ({
  requireAuth: sessionMock.requireAuth,
}));

vi.mock('@/lib/env.server', () => ({
  serverEnvironment: envMock.serverEnvironment,
}));

import CustomersPage from '../apps/mgbos/src/app/(app)/customers/page';
import {
  filterCustomers,
  type CustomerData,
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

// Helper to extract all text recursively from a React element tree
function extractTextFromJsx(node: unknown): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (!node || typeof node !== 'object') {
    return '';
  }
  if (Array.isArray(node)) {
    return node.map(extractTextFromJsx).join(' ');
  }
  const element = node as { props?: { children?: unknown } };
  if (element.props && 'children' in element.props) {
    return extractTextFromJsx(element.props.children);
  }
  return '';
}

interface ReactElementNode {
  type?: unknown;
  props?: {
    children?: unknown;
    dataState?: { status: string; message?: string; data?: unknown };
    activeBrandCode?: string;
    [key: string]: unknown;
  };
}

// Helper to locate a specific React element in a tree
function findComponentInJsx(
  node: unknown,
  componentName: string,
): ReactElementNode | null {
  if (!node || typeof node !== 'object') return null;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findComponentInJsx(child, componentName);
      if (found) return found;
    }
    return null;
  }
  const element = node as ReactElementNode;
  if (
    typeof element.type === 'function' &&
    'name' in element.type &&
    element.type.name === componentName
  ) {
    return element;
  }
  if (element.props && element.props.children) {
    return findComponentInJsx(element.props.children, componentName);
  }
  return null;
}

interface RequiredComponentNode {
  props: {
    dataState: { status: string; message?: string; data?: unknown };
    activeBrandCode?: string;
    [key: string]: unknown;
  };
}

function requireComponentInJsx(
  node: unknown,
  componentName: string,
): RequiredComponentNode {
  const el = findComponentInJsx(node, componentName);
  if (!el || !el.props || !el.props.dataState) {
    throw new Error(
      `Component ${componentName} with dataState not found in JSX`,
    );
  }
  return el as RequiredComponentNode;
}

describe('UXR02-A Customers Server Component & Data States Acceptance Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.requireAuth.mockResolvedValue({
      organization: { id: 'org-tenant-123', displayName: 'Holding Org' },
      activeBrand: { code: 'TS', name: 'TeeStock' },
    });
    envMock.serverEnvironment.SUPABASE_SERVICE_ROLE_KEY =
      'test-service-key-cust-888';
  });

  describe('Server-Client Boundary Invariants (Finding F01)', () => {
    it('verifies CustomerListTable is a pure Client Component with no server data loaders', () => {
      const filePath = path.resolve(
        __dirname,
        '../apps/mgbos/src/app/(app)/customers/CustomerListTable.tsx',
      );
      const content = fs.readFileSync(filePath, 'utf8');

      // Must start with 'use client'
      expect(content.trim().startsWith("'use client'")).toBe(true);

      // Must not export loadCustomersData or server fetchers
      expect(content).not.toContain('loadCustomersData');
      expect(content).not.toContain('fetchCustomersData');

      // Must not reference server-only modules or service keys
      expect(content).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
      expect(content).not.toContain('@/lib/env.server');
      expect(content).not.toContain('@/lib/session.server');
    });

    it('verifies customers/page.tsx does not import functions from Client Component and has no invalid exports', () => {
      const filePath = path.resolve(
        __dirname,
        '../apps/mgbos/src/app/(app)/customers/page.tsx',
      );
      const content = fs.readFileSync(filePath, 'utf8');

      // Must not be a client component
      expect(content).not.toContain("'use client'");

      // Imports from CustomerListTable must be restricted to component and types
      const importMatches = content.match(
        /import\s+\{([^}]+)\}\s+from\s+['"]\.\/CustomerListTable['"]/,
      );
      expect(importMatches).not.toBeNull();
      const matchGroup = importMatches?.[1] ?? '';
      const importedTokens = matchGroup.split(',').map((t) => t.trim());
      expect(importedTokens).toContain('CustomerListTable');
      expect(importedTokens).not.toContain('loadCustomersData');
      expect(importedTokens).not.toContain('computeCustomerKpis');

      // No arbitrary custom function exports from Next.js route page
      expect(content).not.toMatch(
        /^export\s+(async\s+)?function\s+(?!default)/m,
      );
      expect(content).not.toMatch(/^export\s+const\s+(?!metadata)/m);
    });
  });

  describe('Server Component Execution: CustomersPage()', () => {
    it('AC-A01: HTTP 200 with zero records renders truthful empty state and valid KPI 0', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const pageJsx = await CustomersPage();
      const text = extractTextFromJsx(pageJsx);

      // KPIs must display valid 0 counts
      expect(text).toContain('0 Akun');
      expect(text).toContain('0 Perusahaan');
      expect(text).toContain('0 Individu');
      expect(text).toContain('0 Customer');
      expect(text).not.toContain('— Akun');

      // No alert banner on successful read
      expect(text).not.toContain(
        'Layanan data customer tidak dapat diakses saat ini',
      );

      // Table component receives SUCCESS with data: []
      const tableElement = requireComponentInJsx(pageJsx, 'CustomerListTable');
      expect(tableElement).not.toBeNull();
      expect(tableElement.props.dataState).toEqual({
        status: 'SUCCESS',
        data: [],
      });
      expect(tableElement.props.activeBrandCode).toBe('TS');
    });

    it('AC-A02: HTTP 200 with valid records preserves rows and accurate KPI metrics', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => sampleCustomers,
      });

      const pageJsx = await CustomersPage();
      const text = extractTextFromJsx(pageJsx);

      // Verify accurate KPI values
      expect(text).toContain('3 Akun');
      expect(text).toContain('2 Perusahaan');
      expect(text).toContain('1 Individu');
      expect(text).toContain('2 Customer'); // TS active brand customers

      // Table component receives SUCCESS with sample customers
      const tableElement = requireComponentInJsx(pageJsx, 'CustomerListTable');
      expect(tableElement).not.toBeNull();
      expect(tableElement.props.dataState).toEqual({
        status: 'SUCCESS',
        data: sampleCustomers,
      });
    });

    it('AC-A03: HTTP non-2xx produces sanitized error banner, never a fabricated zero', async () => {
      for (const status of [401, 403, 404, 500, 502, 503]) {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status,
          json: async () => ({
            error: 'Database error: connection pool timeout 500',
          }),
        });

        const pageJsx = await CustomersPage();
        const text = extractTextFromJsx(pageJsx);

        // Never fabricated zero
        expect(text).not.toContain('0 Akun');

        // Placeholder — is rendered
        expect(text).toContain('—');

        // Sanitized alert banner is present
        expect(text).toContain(
          'Layanan data customer tidak dapat diakses saat ini',
        );

        // AC-A08: No leaked internal error or status
        expect(text).not.toContain('connection pool');
        expect(text).not.toContain(String(status));

        // Table component receives UNAVAILABLE state
        const tableElement = requireComponentInJsx(
          pageJsx,
          'CustomerListTable',
        );
        expect(tableElement.props.dataState.status).toBe('UNAVAILABLE');
      }
    });

    it('AC-A04: missing service key produces unavailable state without network call or credential leakage', async () => {
      envMock.serverEnvironment.SUPABASE_SERVICE_ROLE_KEY = '';
      global.fetch = vi.fn();

      const pageJsx = await CustomersPage();
      const text = extractTextFromJsx(pageJsx);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(text).not.toContain('0 Akun');
      expect(text).toContain('Layanan data customer tidak tersedia saat ini.');
      expect(text).not.toContain('SUPABASE_SERVICE_ROLE_KEY');

      const tableElement = requireComponentInJsx(pageJsx, 'CustomerListTable');
      expect(tableElement.props.dataState).toEqual({
        status: 'UNAVAILABLE',
        message: 'Layanan data customer tidak tersedia saat ini.',
      });
    });

    it('AC-A05: network exception is safely handled without throwing uncaught error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('ETIMEDOUT'));

      const pageJsx = await CustomersPage();
      const text = extractTextFromJsx(pageJsx);

      expect(text).not.toContain('0 Akun');
      expect(text).toContain(
        'Terjadi gangguan jaringan saat memuat data customer.',
      );
      expect(text).not.toContain('ETIMEDOUT');

      const tableElement = requireComponentInJsx(pageJsx, 'CustomerListTable');
      expect(tableElement.props.dataState.status).toBe('UNAVAILABLE');
    });

    it('AC-A05 & F03: detects malformed responses and synthetic corrupt records safely', async () => {
      const malformedPayloads = [
        { desc: 'non-array object', json: { error: 'invalid payload' } },
        { desc: 'array with null element', json: [null] },
        { desc: 'array with primitive element', json: [42] },
        { desc: 'array with empty object', json: [{}] },
        {
          desc: 'array with record missing required contact/brand arrays',
          json: [
            {
              id: 'cust-99',
              account_type: 'COMPANY',
              display_name: 'PT Invalid',
              status: 'ACTIVE',
              // missing customer_contacts & customer_brand_relationships
            },
          ],
        },
      ];

      for (const payload of malformedPayloads) {
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => payload.json,
        });

        const pageJsx = await CustomersPage();
        const text = extractTextFromJsx(pageJsx);

        // Fails closed as UNAVAILABLE, never turning corrupt records into SUCCESS
        expect(text).toContain('Format data customer tidak valid.');
        expect(text).not.toContain('0 Akun');

        const tableElement = requireComponentInJsx(
          pageJsx,
          'CustomerListTable',
        );
        expect(tableElement.props.dataState).toEqual({
          status: 'UNAVAILABLE',
          message: 'Format data customer tidak valid.',
        });
      }
    });

    it('AC-A07: provides authorized server-side retry action without business mutation', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      const pageJsx = await CustomersPage();
      const text = extractTextFromJsx(pageJsx);

      // Alert banner retry link
      expect(text).toContain('Coba Lagi');

      // Table component is rendered with unavailable action
      const tableElement = requireComponentInJsx(pageJsx, 'CustomerListTable');
      expect(tableElement.props.dataState.status).toBe('UNAVAILABLE');
    });

    it('AC-A09: strictly enforces tenant organization isolation query parameter', async () => {
      let capturedUrl = '';
      let capturedOptions: RequestInit | undefined;
      global.fetch = vi
        .fn()
        .mockImplementation(async (url: string, options: RequestInit) => {
          capturedUrl = url;
          capturedOptions = options;
          return { ok: true, status: 200, json: async () => [] };
        });

      await CustomersPage();

      expect(capturedUrl).toContain('organization_id=eq.org-tenant-123');
      expect(capturedOptions?.method).toBe('GET');
      expect(capturedOptions?.cache).toBe('no-store');
      const headers = capturedOptions?.headers as Record<string, string>;
      expect(headers['apikey']).toBe('test-service-key-cust-888');
      expect(headers['Authorization']).toBe('Bearer test-service-key-cust-888');
      expect(headers['Accept-Profile']).toBe('app');
    });
  });

  describe('Client-Side Filter Behavior: filterCustomers (AC-A06)', () => {
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
      expect(tsOnly).toHaveLength(2);

      const mgOnly = filterCustomers(sampleCustomers, {
        search: '',
        typeFilter: 'ALL',
        brandFilter: 'ACTIVE',
        activeBrandCode: 'MG',
      });
      expect(mgOnly).toHaveLength(2);
    });

    it('searches across display_name, legal_name, email, phone, and contact names', () => {
      expect(
        filterCustomers(sampleCustomers, {
          search: 'Sinar Digital',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      expect(
        filterCustomers(sampleCustomers, {
          search: 'Makmur Sejahtera Abadi',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      expect(
        filterCustomers(sampleCustomers, {
          search: 'procurement@sinardigital.co.id',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      expect(
        filterCustomers(sampleCustomers, {
          search: '031-8889999',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      expect(
        filterCustomers(sampleCustomers, {
          search: 'Hendro Gunawan',
          typeFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

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
