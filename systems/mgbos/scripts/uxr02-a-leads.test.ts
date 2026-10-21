import { describe, expect, it, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

// Hoisted mocks for session.server and env.server
const sessionMock = vi.hoisted(() => ({
  requireAuth: vi.fn(),
}));

const envMock = vi.hoisted(() => ({
  serverEnvironment: {
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key-leads-999',
  },
}));

vi.mock('@/lib/session.server', () => ({
  requireAuth: sessionMock.requireAuth,
}));

vi.mock('@/lib/env.server', () => ({
  serverEnvironment: envMock.serverEnvironment,
}));

import LeadsPage from '../apps/mgbos/src/app/(app)/leads/page';
import { filterLeads } from '../apps/mgbos/src/app/(app)/leads/LeadListTable';
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

describe('UXR02-A Leads Server Component & Data States Acceptance Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.requireAuth.mockResolvedValue({
      organization: { id: 'org-tenant-123', displayName: 'Holding Org' },
      activeBrand: { code: 'TS', name: 'TeeStock' },
    });
    envMock.serverEnvironment.SUPABASE_SERVICE_ROLE_KEY =
      'test-service-key-leads-999';
  });

  describe('Server-Client Boundary Invariants (Finding F01)', () => {
    it('verifies LeadListTable is a pure Client Component with no server data loaders', () => {
      const filePath = path.resolve(
        __dirname,
        '../apps/mgbos/src/app/(app)/leads/LeadListTable.tsx',
      );
      const content = fs.readFileSync(filePath, 'utf8');

      // Must start with 'use client'
      expect(content.trim().startsWith("'use client'")).toBe(true);

      // Must not export loadLeadsData or server fetchers
      expect(content).not.toContain('loadLeadsData');
      expect(content).not.toContain('fetchLeadsData');

      // Must not reference server-only modules or service keys
      expect(content).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
      expect(content).not.toContain('@/lib/env.server');
      expect(content).not.toContain('@/lib/session.server');
    });

    it('verifies leads/page.tsx does not import functions from Client Component and has no invalid exports', () => {
      const filePath = path.resolve(
        __dirname,
        '../apps/mgbos/src/app/(app)/leads/page.tsx',
      );
      const content = fs.readFileSync(filePath, 'utf8');

      // Must not be a client component
      expect(content).not.toContain("'use client'");

      // Imports from LeadListTable must be restricted to component and types
      const importMatches = content.match(
        /import\s+\{([^}]+)\}\s+from\s+['"]\.\/LeadListTable['"]/,
      );
      expect(importMatches).not.toBeNull();
      const matchGroup = importMatches?.[1] ?? '';
      const importedTokens = matchGroup.split(',').map((t) => t.trim());
      expect(importedTokens).toContain('LeadListTable');
      expect(importedTokens).not.toContain('loadLeadsData');
      expect(importedTokens).not.toContain('computeLeadKpis');

      // No arbitrary custom function exports from Next.js route page
      expect(content).not.toMatch(
        /^export\s+(async\s+)?function\s+(?!default)/m,
      );
      expect(content).not.toMatch(/^export\s+const\s+(?!metadata)/m);
    });
  });

  describe('Server Component Execution: LeadsPage()', () => {
    it('AC-A01: HTTP 200 with zero records renders truthful empty state and valid KPI 0', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      });

      const pageJsx = await LeadsPage();
      const text = extractTextFromJsx(pageJsx);

      // KPIs must display valid 0 counts
      expect(text).toContain('0 Leads');
      expect(text).toContain('0 Inquiry');
      expect(text).toContain('0 Lead');
      expect(text).not.toContain('— Leads');

      // No alert banner on successful read
      expect(text).not.toContain(
        'Layanan data leads tidak dapat diakses saat ini',
      );

      // Table component receives SUCCESS with data: []
      const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
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
        json: async () => sampleLeads,
      });

      const pageJsx = await LeadsPage();
      const text = extractTextFromJsx(pageJsx);

      // Verify accurate KPI values
      expect(text).toContain('3 Leads');
      expect(text).toContain('1 Inquiry'); // NEW
      expect(text).toContain('1 Lead'); // QUALIFIED
      expect(text).toContain('2 Lead'); // TS active brand leads

      // Table component receives SUCCESS with sample leads
      const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
      expect(tableElement).not.toBeNull();
      expect(tableElement.props.dataState).toEqual({
        status: 'SUCCESS',
        data: sampleLeads,
      });
    });

    it('AC-A03: HTTP non-2xx produces sanitized error banner, never a fabricated zero', async () => {
      for (const status of [401, 403, 404, 500, 502, 503]) {
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status,
          json: async () => ({
            error: 'psql connection failure: internal postgres error',
          }),
        });

        const pageJsx = await LeadsPage();
        const text = extractTextFromJsx(pageJsx);

        // Never fabricated zero
        expect(text).not.toContain('0 Leads');

        // Placeholder — is rendered
        expect(text).toContain('—');

        // Sanitized alert banner is present
        expect(text).toContain(
          'Layanan data leads tidak dapat diakses saat ini',
        );

        // AC-A08: No leaked internal error or status
        expect(text).not.toContain('postgres');
        expect(text).not.toContain('psql');
        expect(text).not.toContain(String(status));

        // Table component receives UNAVAILABLE state
        const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
        expect(tableElement.props.dataState.status).toBe('UNAVAILABLE');
      }
    });

    it('AC-A04: missing service key produces unavailable state without network call or credential leakage', async () => {
      envMock.serverEnvironment.SUPABASE_SERVICE_ROLE_KEY = '';
      global.fetch = vi.fn();

      const pageJsx = await LeadsPage();
      const text = extractTextFromJsx(pageJsx);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(text).not.toContain('0 Leads');
      expect(text).toContain('Layanan data leads tidak tersedia saat ini.');
      expect(text).not.toContain('SUPABASE_SERVICE_ROLE_KEY');

      const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
      expect(tableElement.props.dataState).toEqual({
        status: 'UNAVAILABLE',
        message: 'Layanan data leads tidak tersedia saat ini.',
      });
    });

    it('AC-A05: network exception is safely handled without throwing uncaught error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('ECONNRESET'));

      const pageJsx = await LeadsPage();
      const text = extractTextFromJsx(pageJsx);

      expect(text).not.toContain('0 Leads');
      expect(text).toContain(
        'Terjadi gangguan jaringan saat memuat data leads.',
      );
      expect(text).not.toContain('ECONNRESET');

      const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
      expect(tableElement.props.dataState.status).toBe('UNAVAILABLE');
    });

    it('AC-A05, F03 & F04: detects malformed responses, corrupt records, and malformed nested arrays safely', async () => {
      const validBaseLead = {
        id: 'lead-99',
        lead_number: 'LEAD-99',
        title: 'Kaos Komunitas',
        status: 'NEW',
        contact_name: 'Budi Santoso',
        company_name: 'Komunitas Motor',
        phone: '08123456789',
        email: 'budi@example.com',
        raw_inquiry: 'Mau pesan 100 pcs kaos',
        estimated_quantity: 100,
        estimated_budget: 7500000,
        qualification_result: null,
        qualification_score: null,
        qualification_notes: null,
        disqualification_reason: null,
        created_at: '2026-01-01T00:00:00Z',
        brands: { id: 'br-ts', code: 'TS', name: 'TeeStock' },
        channels: {
          id: 'ch-1',
          code: 'WA',
          name: 'WhatsApp',
          channel_type: 'CHAT',
        },
        customer_accounts: null,
        requirements: null,
      };

      const malformedPayloads = [
        { desc: 'non-array object', json: { error: 'not an array' } },
        { desc: 'array with null element', json: [null] },
        { desc: 'array with primitive element', json: ['corrupted-string'] },
        { desc: 'array with empty object', json: [{}] },
        {
          desc: 'array with record missing required title and status',
          json: [{ id: 'lead-99', lead_number: 'LEAD-99' }],
        },
        {
          desc: 'F04: requirements is string instead of array or null',
          json: [
            {
              ...validBaseLead,
              requirements: 'bad-data',
            },
          ],
        },
        {
          desc: 'F04: requirements array containing null element',
          json: [
            {
              ...validBaseLead,
              requirements: [null],
            },
          ],
        },
        {
          desc: 'F04: requirements array containing item with non-string title',
          json: [
            {
              ...validBaseLead,
              requirements: [{ id: 'req-1', title: 999 }],
            },
          ],
        },
        {
          desc: 'F04: requirements array containing item missing required id',
          json: [
            {
              ...validBaseLead,
              requirements: [{ title: 'Missing ID' }],
            },
          ],
        },
        {
          desc: 'F04: brands is string instead of object or null',
          json: [
            {
              ...validBaseLead,
              brands: 'bad-brand-string',
            },
          ],
        },
        {
          desc: 'F04: brands object has non-string code',
          json: [
            {
              ...validBaseLead,
              brands: { id: 'br-ts', code: 12345, name: 'TeeStock' },
            },
          ],
        },
        {
          desc: 'F04: channels is string instead of object or null',
          json: [
            {
              ...validBaseLead,
              channels: 'bad-channel-string',
            },
          ],
        },
        {
          desc: 'F04: optional phone has wrong type number',
          json: [
            {
              ...validBaseLead,
              phone: 123456789,
            },
          ],
        },
        {
          desc: 'F04: optional estimated_budget has wrong type string',
          json: [
            {
              ...validBaseLead,
              estimated_budget: 'five-million',
            },
          ],
        },
        {
          desc: 'F04: optional estimated_quantity has wrong type string',
          json: [
            {
              ...validBaseLead,
              estimated_quantity: 'hundred-pcs',
            },
          ],
        },
        {
          desc: 'F05: customer_accounts is array instead of object or null',
          json: [
            {
              ...validBaseLead,
              customer_accounts: [],
            },
          ],
        },
        {
          desc: 'F05: customer_accounts object has object display_name (counterexample)',
          json: [
            {
              ...validBaseLead,
              customer_accounts: {
                id: 'synthetic-ca-01',
                display_name: { unexpected: true },
                account_type: 'COMPANY',
              },
            },
          ],
        },
        {
          desc: 'F05: customer_accounts object has non-string account_type',
          json: [
            {
              ...validBaseLead,
              customer_accounts: {
                id: 'synthetic-ca-01',
                display_name: 'PT Maju Bersama',
                account_type: 12345,
              },
            },
          ],
        },
        {
          desc: 'F05: customer_accounts object has non-string id',
          json: [
            {
              ...validBaseLead,
              customer_accounts: {
                id: 99999,
                display_name: 'PT Maju Bersama',
                account_type: 'COMPANY',
              },
            },
          ],
        },
        {
          desc: 'F05: channels is array instead of object or null',
          json: [
            {
              ...validBaseLead,
              channels: [],
            },
          ],
        },
        {
          desc: 'F05: channels object has non-string name',
          json: [
            {
              ...validBaseLead,
              channels: {
                id: 'ch-01',
                code: 'WHATSAPP',
                name: { unexpected: true },
                channel_type: 'CHAT',
              },
            },
          ],
        },
        {
          desc: 'F05: channels object has non-string id',
          json: [
            {
              ...validBaseLead,
              channels: {
                id: 12345,
                code: 'WHATSAPP',
                name: 'WhatsApp Business',
                channel_type: 'CHAT',
              },
            },
          ],
        },
        {
          desc: 'F05: brands is array instead of object or null',
          json: [
            {
              ...validBaseLead,
              brands: [],
            },
          ],
        },
        {
          desc: 'F05: brands object has non-string name',
          json: [
            {
              ...validBaseLead,
              brands: {
                id: 'br-ts',
                code: 'TS',
                name: { unexpected: true },
              },
            },
          ],
        },
        {
          desc: 'F05: requirements array containing item with non-string title',
          json: [
            {
              ...validBaseLead,
              requirements: [
                {
                  id: 'req-01',
                  title: { bad: true },
                },
              ],
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

        const pageJsx = await LeadsPage();
        const text = extractTextFromJsx(pageJsx);

        // Fails closed as UNAVAILABLE, never turning corrupt records into SUCCESS
        expect(text).toContain('Format data leads tidak valid.');
        expect(text).not.toContain('0 Leads');
        expect(text).toContain('—');

        const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
        expect(tableElement.props.dataState).toEqual({
          status: 'UNAVAILABLE',
          message: 'Format data leads tidak valid.',
        });
      }
    });

    it('AC-A05 & F05: accepts valid PostgREST records with nullable relations, connected customer account, and valid requirements', async () => {
      const validLeadsWithEdgeCases = [
        {
          id: 'lead-edge-01',
          lead_number: 'LEAD-2026-E1',
          title: 'Jaket Angkatan (Null Requirements)',
          status: 'NEW',
          contact_name: null,
          company_name: null,
          phone: null,
          email: null,
          raw_inquiry: null,
          estimated_quantity: null,
          estimated_budget: null,
          qualification_result: null,
          qualification_score: null,
          qualification_notes: null,
          disqualification_reason: null,
          created_at: '2026-02-01T00:00:00Z',
          brands: null,
          channels: null,
          customer_accounts: null,
          requirements: null,
        },
        {
          id: 'lead-edge-02',
          lead_number: 'LEAD-2026-E2',
          title: 'Jersey Futsal (Array Requirements)',
          status: 'QUALIFIED',
          contact_name: 'Andi',
          company_name: 'FC Jakarta',
          phone: '0812334455',
          email: 'andi@fcjkt.com',
          raw_inquiry: 'Jersey 24 set',
          estimated_quantity: 24,
          estimated_budget: 4800000,
          qualification_result: 'QUALIFIED',
          qualification_score: 85,
          qualification_notes: 'Budget siap',
          disqualification_reason: null,
          created_at: '2026-02-02T00:00:00Z',
          brands: { id: 'br-ts', code: 'TS', name: 'TeeStock' },
          channels: {
            id: 'ch-w',
            code: 'WEB',
            name: 'Web Store',
            channel_type: 'WEB',
          },
          customer_accounts: null,
          requirements: [
            {
              id: 'req-01',
              requirement_number: 'REQ-2026-001',
              status: 'OPEN',
              title: 'Jersey Futsal Dryfit 24 pcs',
            },
          ],
        },
        {
          id: 'lead-edge-03',
          lead_number: 'LEAD-2026-E3',
          title: 'Polo Shirt Seragam (Connected Customer Account)',
          status: 'CONVERTED',
          contact_name: 'Budi Santoso',
          company_name: 'PT Sinar Abadi',
          phone: '081234567890',
          email: 'budi@sinarabadi.com',
          raw_inquiry: 'Polo shirt 50 pcs',
          estimated_quantity: 50,
          estimated_budget: 6000000,
          qualification_result: 'QUALIFIED',
          qualification_score: 95,
          qualification_notes: 'Sudah terhubung ke customer',
          disqualification_reason: null,
          created_at: '2026-02-03T00:00:00Z',
          brands: { id: 'br-ts', code: 'TS', name: 'TeeStock' },
          channels: {
            id: 'ch-wa',
            code: 'WHATSAPP',
            name: 'WhatsApp Business',
            channel_type: 'CHAT',
          },
          customer_accounts: {
            id: 'cust-acc-01',
            display_name: 'PT Sinar Abadi',
            account_type: 'COMPANY',
          },
          requirements: null,
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => validLeadsWithEdgeCases,
      });

      const pageJsx = await LeadsPage();
      const text = extractTextFromJsx(pageJsx);

      expect(text).toContain('3 Leads');
      expect(text).toContain('1 Inquiry'); // NEW
      expect(text).toContain('1 Lead'); // QUALIFIED
      expect(text).toContain('2 Lead'); // TS active brand
      expect(text).not.toContain('Format data leads tidak valid.');

      const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
      expect(tableElement.props.dataState).toEqual({
        status: 'SUCCESS',
        data: validLeadsWithEdgeCases,
      });
    });

    it('AC-A07: provides authorized server-side retry action without business mutation', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
      });

      const pageJsx = await LeadsPage();
      const text = extractTextFromJsx(pageJsx);

      // Alert banner retry link
      expect(text).toContain('Coba Lagi');

      // Table component is rendered with unavailable action
      const tableElement = requireComponentInJsx(pageJsx, 'LeadListTable');
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

      await LeadsPage();

      expect(capturedUrl).toContain('organization_id=eq.org-tenant-123');
      expect(capturedOptions?.method).toBe('GET');
      expect(capturedOptions?.cache).toBe('no-store');
      const headers = capturedOptions?.headers as Record<string, string>;
      expect(headers['apikey']).toBe('test-service-key-leads-999');
      expect(headers['Authorization']).toBe(
        'Bearer test-service-key-leads-999',
      );
      expect(headers['Accept-Profile']).toBe('app');
    });
  });

  describe('Client-Side Filter Behavior: filterLeads (AC-A06)', () => {
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
      expect(
        filterLeads(sampleLeads, {
          search: 'LEAD-2026-0002',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      expect(
        filterLeads(sampleLeads, {
          search: 'Kaos Komunitas',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      expect(
        filterLeads(sampleLeads, {
          search: 'Siti Aminah',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

      expect(
        filterLeads(sampleLeads, {
          search: 'Maju Bersama',
          statusFilter: 'ALL',
          brandFilter: 'ALL',
          activeBrandCode: 'TS',
        }),
      ).toHaveLength(1);

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
