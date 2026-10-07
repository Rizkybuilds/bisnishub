import { beforeEach, describe, expect, it, vi } from 'vitest';

const sessionMock = vi.fn();

vi.mock('@/lib/session.server', () => ({
  requireAuth: () => sessionMock(),
}));

vi.mock('@/lib/env.server', () => ({
  serverEnvironment: {
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-test-key',
  },
}));

vi.mock('@/lib/env.client', () => ({
  publicEnvironment: {
    NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:55431',
  },
}));

import * as dataModule from '../apps/mgbos/src/app/(app)/exceptions/data';
import {
  listOperationalExceptions,
  getOperationalException,
  getOperationalExceptionHistory,
  loadResourceCandidates,
  loadEligibleResponsiblePrincipals,
  loadExceptionCandidates,
  loadResourceDisplayContext,
} from '../apps/mgbos/src/app/(app)/exceptions/data';
import {
  formatExceptionType,
  formatCategoryLabel,
  formatSeverityBadge,
  formatStatusBadge,
  formatSourceKind,
  formatResolutionType,
  formatDismissalReason,
  formatResourceType,
  getResourceTypeForExceptionType,
  getAvailableActions,
  getAvailableResolutionTypes,
  translateErrorCode,
  generateClientRequestId,
  formatTimestamp,
} from '../apps/mgbos/src/app/(app)/exceptions/console';

const TRUSTED_ORG_ID = '00000000-0000-4000-8000-000000000001';
const TRUSTED_ACTOR_ID = '00000000-0000-4000-8000-000000000002';
const TRUSTED_BRAND_ID = '00000000-0000-4000-8000-000000000009';
const TEST_EXCEPTION_ID = '11111111-1111-4111-8111-111111111111';
const OTHER_EXCEPTION_ID = '22222222-2222-4222-8222-222222222222';

const trustedSession = {
  organization: { id: TRUSTED_ORG_ID, displayName: 'TeeStock Solo' },
  user: { id: TRUSTED_ACTOR_ID, name: 'Rizky Owner' },
  role: { code: 'OWNER' },
  activeBrand: { code: 'TEESTOCK', name: 'TeeStock' },
};

describe('Operational Exception Console (P2-A / WP03)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMock.mockResolvedValue(trustedSession);

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((input: string | URL | Request) => {
        const url = String(input);
        if (url.includes('/rest/v1/brands')) {
          return Promise.resolve(
            new Response(JSON.stringify([{ id: TRUSTED_BRAND_ID }]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        return Promise.resolve(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }),
    );
  });

  // ==========================================================================
  // 1. Type → Resource Mapping
  // ==========================================================================
  describe('Type → Resource Mapping', () => {
    it('maps all 7 standard abnormality types to governed resource types deterministically', () => {
      expect(
        getResourceTypeForExceptionType('production.deadline_breached'),
      ).toBe('PRODUCTION_JOB');
      expect(getResourceTypeForExceptionType('vendor.commitment_problem')).toBe(
        'PRODUCTION_ASSIGNMENT',
      );
      expect(getResourceTypeForExceptionType('quality.qc_failed')).toBe(
        'QC_INSPECTION',
      );
      expect(
        getResourceTypeForExceptionType('fulfillment.delivery_problem'),
      ).toBe('SHIPMENT');
      expect(
        getResourceTypeForExceptionType('financial.receivable_past_due'),
      ).toBe('INVOICE');
      expect(
        getResourceTypeForExceptionType('financial.actual_cost_missing'),
      ).toBe('PRODUCTION_JOB');
      expect(
        getResourceTypeForExceptionType('financial.margin_exception'),
      ).toBe('ORDER');
    });

    it('returns null for other.operational_abnormality requiring operator resource selection', () => {
      expect(
        getResourceTypeForExceptionType('other.operational_abnormality'),
      ).toBeNull();
    });
  });

  // ==========================================================================
  // 2. Candidate Query Boundedness & Organization Filtering
  // ==========================================================================
  describe('Candidate Queries Boundedness & Security', () => {
    function mockFetchForResource(
      resourcePath: string,
      resourceRows: unknown[],
    ) {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation((input: string | URL | Request) => {
          const url = String(input);
          if (url.includes('/rest/v1/brands')) {
            return Promise.resolve(
              new Response(JSON.stringify([{ id: TRUSTED_BRAND_ID }]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            );
          }
          if (url.includes(resourcePath)) {
            return Promise.resolve(
              new Response(JSON.stringify(resourceRows), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            );
          }
          return Promise.resolve(
            new Response(JSON.stringify([]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }),
      );
    }

    it('loadResourceCandidates enforces organization_id, active brand, lifecycle status, and limit=100 for ORDER', async () => {
      mockFetchForResource('/rest/v1/orders?', [
        {
          id: 'ord-1',
          order_number: 'TS-O-2026-0001',
          status: 'CONFIRMED',
          grand_total: 1500000,
          brand_id: TRUSTED_BRAND_ID,
        },
      ]);

      const candidates = await loadResourceCandidates('ORDER');
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.identifier).toBe('TS-O-2026-0001');
      expect(candidates[0]!.resourceType).toBe('ORDER');
      expect(candidates[0]!.brandId).toBe(TRUSTED_BRAND_ID);
      expect(candidates[0]!.orderId).toBe('ord-1');

      const resourceCall = vi
        .mocked(fetch)
        .mock.calls.find(([u]) => String(u).includes('/rest/v1/orders?'));
      expect(resourceCall).toBeDefined();
      const url = String(resourceCall![0]);
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain(
        `brand_id=eq.${encodeURIComponent(TRUSTED_BRAND_ID)}`,
      );
      expect(url).toContain('status=not.in.(COMPLETED,CANCELLED)');
      expect(url).toContain('limit=100');
    });

    it('loadResourceCandidates enforces organization_id, active brand, and limit=100 for PRODUCTION_JOB', async () => {
      mockFetchForResource('/rest/v1/production_jobs?', [
        {
          id: 'job-1',
          job_number: 'JOB-2026-001',
          title: 'Sablon DTF Kaos Komunitas',
          status: 'IN_PROGRESS',
          brand_id: TRUSTED_BRAND_ID,
          order_id: 'ord-1',
        },
      ]);

      const candidates = await loadResourceCandidates('PRODUCTION_JOB');
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.identifier).toBe('JOB-2026-001');
      expect(candidates[0]!.resourceType).toBe('PRODUCTION_JOB');
      expect(candidates[0]!.orderId).toBe('ord-1');

      const resourceCall = vi
        .mocked(fetch)
        .mock.calls.find(([u]) =>
          String(u).includes('/rest/v1/production_jobs?'),
        );
      expect(resourceCall).toBeDefined();
      const url = String(resourceCall![0]);
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain(
        `brand_id=eq.${encodeURIComponent(TRUSTED_BRAND_ID)}`,
      );
      expect(url).toContain('limit=100');
    });

    it('loadResourceCandidates enforces inner job organization_id, active brand, status, and limit=100 for PRODUCTION_ASSIGNMENT', async () => {
      mockFetchForResource('/rest/v1/production_assignments?', [
        {
          id: 'assign-1',
          production_job_id: 'job-1',
          executor_type: 'VENDOR',
          vendor_name: 'Mitra DTF Solo',
          status: 'ASSIGNED',
          assigned_cost: 500000,
          production_jobs: {
            job_number: 'JOB-2026-001',
            organization_id: TRUSTED_ORG_ID,
            brand_id: TRUSTED_BRAND_ID,
          },
        },
      ]);

      const candidates = await loadResourceCandidates('PRODUCTION_ASSIGNMENT');
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.resourceType).toBe('PRODUCTION_ASSIGNMENT');
      expect(candidates[0]!.label).toContain('Mitra DTF Solo');

      const resourceCall = vi
        .mocked(fetch)
        .mock.calls.find(([u]) =>
          String(u).includes('/rest/v1/production_assignments?'),
        );
      expect(resourceCall).toBeDefined();
      const url = String(resourceCall![0]);
      expect(url).toContain(
        `production_jobs.organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain(
        `production_jobs.brand_id=eq.${encodeURIComponent(TRUSTED_BRAND_ID)}`,
      );
      expect(url).toContain('status=in.(ASSIGNED,ACCEPTED)');
      expect(url).toContain('limit=100');
    });

    it('loadResourceCandidates enforces inner job organization_id, active brand, result filter, and limit=100 for QC_INSPECTION', async () => {
      mockFetchForResource('/rest/v1/qc_inspections?', [
        {
          id: 'qc-1',
          inspection_number: 'QC-2026-001',
          result: 'REWORK',
          defect_category: 'PRINTING',
          defect_count: 3,
          production_jobs: {
            job_number: 'JOB-2026-001',
            organization_id: TRUSTED_ORG_ID,
            brand_id: TRUSTED_BRAND_ID,
          },
        },
      ]);

      const candidates = await loadResourceCandidates('QC_INSPECTION');
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.identifier).toBe('QC-2026-001');

      const resourceCall = vi
        .mocked(fetch)
        .mock.calls.find(([u]) =>
          String(u).includes('/rest/v1/qc_inspections?'),
        );
      expect(resourceCall).toBeDefined();
      const url = String(resourceCall![0]);
      expect(url).toContain(
        `production_jobs.organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain(
        `production_jobs.brand_id=eq.${encodeURIComponent(TRUSTED_BRAND_ID)}`,
      );
      expect(url).toContain('result=in.(REWORK,REJECTED)');
      expect(url).toContain('limit=100');
    });

    it('loadResourceCandidates enforces organization_id, active brand, status, and limit=100 for SHIPMENT', async () => {
      mockFetchForResource('/rest/v1/shipments?', [
        {
          id: 'shp-1',
          shipment_number: 'SHP-2026-001',
          status: 'DISPATCHED',
          courier_name: 'JNE Trucking',
          brand_id: TRUSTED_BRAND_ID,
          order_id: 'ord-1',
        },
      ]);

      const candidates = await loadResourceCandidates('SHIPMENT');
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.identifier).toBe('SHP-2026-001');

      const resourceCall = vi
        .mocked(fetch)
        .mock.calls.find(([u]) => String(u).includes('/rest/v1/shipments?'));
      expect(resourceCall).toBeDefined();
      const url = String(resourceCall![0]);
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain(
        `brand_id=eq.${encodeURIComponent(TRUSTED_BRAND_ID)}`,
      );
      expect(url).toContain('status=not.in.(DELIVERED,CANCELLED)');
      expect(url).toContain('limit=100');
    });

    it('loadResourceCandidates enforces organization_id, active brand, balance_due, status, and limit=100 for INVOICE', async () => {
      mockFetchForResource('/rest/v1/invoices?', [
        {
          id: 'inv-1',
          invoice_number: 'INV-2026-001',
          status: 'OVERDUE',
          amount_total: 2500000,
          balance_due: 2500000,
          brand_id: TRUSTED_BRAND_ID,
          order_id: 'ord-1',
        },
      ]);

      const candidates = await loadResourceCandidates('INVOICE');
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.identifier).toBe('INV-2026-001');

      const resourceCall = vi
        .mocked(fetch)
        .mock.calls.find(([u]) => String(u).includes('/rest/v1/invoices?'));
      expect(resourceCall).toBeDefined();
      const url = String(resourceCall![0]);
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain(
        `brand_id=eq.${encodeURIComponent(TRUSTED_BRAND_ID)}`,
      );
      expect(url).toContain('balance_due=gt.0');
      expect(url).toContain('status=in.(ISSUED,PARTIALLY_PAID,OVERDUE)');
      expect(url).toContain('limit=100');
    });

    it('loadResourceCandidates fails closed and returns empty array if activeBrand cannot be resolved', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockImplementation((input: string | URL | Request) => {
          const url = String(input);
          if (url.includes('/rest/v1/brands')) {
            return Promise.resolve(
              new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            );
          }
          return Promise.resolve(
            new Response(JSON.stringify([{ id: 'unreachable' }]), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }),
      );

      const candidates = await loadResourceCandidates('ORDER');
      expect(candidates).toEqual([]);
    });

    it('loadResourceCandidates rejects arbitrary unsupported resource types', async () => {
      // @ts-expect-error Testing invalid resource type rejection
      await expect(loadResourceCandidates('ARBITRARY_TABLE')).rejects.toThrow(
        /Tipe resource tidak didukung/,
      );
    });
  });

  // ==========================================================================
  // 3. Assignee Candidate Eligibility
  // ==========================================================================
  describe('Assignee Candidate Eligibility', () => {
    it('returns only ACTIVE same-Organization members with OWNER or ADMIN roles', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify([
              {
                id: 'mem-1',
                user_id: 'usr-1',
                status: 'ACTIVE',
                users: {
                  id: 'usr-1',
                  name: 'Owner Rizky',
                  email: 'rizky@teestock.id',
                  status: 'ACTIVE',
                },
                roles: { id: 'r-1', code: 'OWNER', name: 'Founder & Owner' },
              },
              {
                id: 'mem-2',
                user_id: 'usr-2',
                status: 'ACTIVE',
                users: {
                  id: 'usr-2',
                  name: 'Admin Budi',
                  email: 'budi@teestock.id',
                  status: 'ACTIVE',
                },
                roles: { id: 'r-2', code: 'ADMIN', name: 'General Admin' },
              },
              {
                id: 'mem-3',
                user_id: 'usr-3',
                status: 'ACTIVE',
                users: {
                  id: 'usr-3',
                  name: 'Staff Sewing',
                  email: 'sewing@teestock.id',
                  status: 'ACTIVE',
                },
                roles: { id: 'r-3', code: 'OPERATIONS', name: 'Operations' },
              },
            ]),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const principals = await loadEligibleResponsiblePrincipals();
      expect(principals).toHaveLength(2);
      expect(principals.map((p) => p.roleCode)).toEqual(['OWNER', 'ADMIN']);

      const [url] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain('status=eq.ACTIVE');
    });
  });

  // ==========================================================================
  // 4. Duplicate / Superseded Target Exclusion
  // ==========================================================================
  describe('Duplicate and Superseded Target Handling', () => {
    it('excludes self-target from exception candidates and supports mode=all', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify([
              {
                id: TEST_EXCEPTION_ID,
                exception_type: 'production.deadline_breached',
                severity: 'HIGH',
                status: 'OPEN',
                summary: 'Keterlambatan sablon',
              },
              {
                id: OTHER_EXCEPTION_ID,
                exception_type: 'production.deadline_breached',
                severity: 'HIGH',
                status: 'RESOLVED',
                summary: 'Keterlambatan jahit',
              },
            ]),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const candidates = await loadExceptionCandidates(
        TEST_EXCEPTION_ID,
        'all',
      );
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.id).toBe(OTHER_EXCEPTION_ID);

      const [url] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).not.toContain('status=in.(OPEN,ACKNOWLEDGED)');
      expect(url).toContain('limit=100');
    });

    it('filters status=in.(OPEN,ACKNOWLEDGED) when mode=active_only for SUPERSEDED targets', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify([
              {
                id: OTHER_EXCEPTION_ID,
                exception_type: 'production.deadline_breached',
                severity: 'HIGH',
                status: 'OPEN',
                summary: 'Keterlambatan jahit',
              },
            ]),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const candidates = await loadExceptionCandidates(
        TEST_EXCEPTION_ID,
        'active_only',
      );
      expect(candidates).toHaveLength(1);
      expect(candidates[0]!.id).toBe(OTHER_EXCEPTION_ID);

      const [url] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
      expect(url).toContain('status=in.(OPEN,ACKNOWLEDGED)');
      expect(url).toContain('limit=100');
    });
  });

  // ==========================================================================
  // 5. Public Read API Trusted Context Hardening
  // ==========================================================================
  describe('Public Read API Trusted Context Hardening', () => {
    it('exported UI read functions take zero caller-controlled context parameters', () => {
      expect(listOperationalExceptions.length).toBe(0);
      expect(getOperationalException.length).toBe(1);
      expect(getOperationalExceptionHistory.length).toBe(1);
      expect('readRows' in dataModule).toBe(false);
      expect('internalContextHolder' in dataModule).toBe(false);
    });

    it('loadResourceDisplayContext enforces organization_id and fails closed on foreign org', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      const display = await loadResourceDisplayContext(
        'ORDER',
        'foreign-order-id',
      );
      expect(display).toBeNull();

      const [url] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      expect(url).toContain(
        `organization_id=eq.${encodeURIComponent(TRUSTED_ORG_ID)}`,
      );
    });
  });

  // ==========================================================================
  // 6. Lifecycle Action Visibility & Permission Matrix
  // ==========================================================================
  describe('Lifecycle Action Visibility', () => {
    it('allows full active actions for OWNER on OPEN exception', () => {
      const actions = getAvailableActions({ status: 'OPEN' }, 'OWNER');
      expect(actions.canAcknowledge).toBe(true);
      expect(actions.canAssign).toBe(true);
      expect(actions.canReassign).toBe(true);
      expect(actions.canChangeSeverity).toBe(true);
      expect(actions.canResolve).toBe(true);
      expect(actions.canDismiss).toBe(true);
      expect(actions.canReopen).toBe(false);
    });

    it('allows full active actions for ADMIN on ACKNOWLEDGED exception except acknowledge', () => {
      const actions = getAvailableActions({ status: 'ACKNOWLEDGED' }, 'ADMIN');
      expect(actions.canAcknowledge).toBe(false);
      expect(actions.canAssign).toBe(true);
      expect(actions.canReassign).toBe(true);
      expect(actions.canChangeSeverity).toBe(true);
      expect(actions.canResolve).toBe(true);
      expect(actions.canDismiss).toBe(true);
      expect(actions.canReopen).toBe(false);
    });

    it('allows only reopen for OWNER/ADMIN on RESOLVED exception', () => {
      const actions = getAvailableActions({ status: 'RESOLVED' }, 'OWNER');
      expect(actions.canAcknowledge).toBe(false);
      expect(actions.canAssign).toBe(false);
      expect(actions.canReassign).toBe(false);
      expect(actions.canChangeSeverity).toBe(false);
      expect(actions.canResolve).toBe(false);
      expect(actions.canDismiss).toBe(false);
      expect(actions.canReopen).toBe(true);
    });

    it('denies all actions for staff roles across all statuses', () => {
      const staffRoles = ['SALES', 'OPERATIONS', 'FINANCE', 'QC'];
      for (const role of staffRoles) {
        const openActions = getAvailableActions({ status: 'OPEN' }, role);
        expect(openActions.canAcknowledge).toBe(false);
        expect(openActions.canAssign).toBe(false);
        expect(openActions.canResolve).toBe(false);
        expect(openActions.canDismiss).toBe(false);

        const closedActions = getAvailableActions({ status: 'RESOLVED' }, role);
        expect(closedActions.canReopen).toBe(false);
      }
    });
  });

  // ==========================================================================
  // 7. Accepted Risk OWNER-Only Invariant
  // ==========================================================================
  describe('Accepted Risk OWNER-Only Invariant', () => {
    it('offers ACCEPTED_RISK resolution type to OWNER role', () => {
      const resolutions = getAvailableResolutionTypes('OWNER');
      expect(resolutions).toContain('ACCEPTED_RISK');
      expect(resolutions).toHaveLength(5);
    });

    it('strictly denies ACCEPTED_RISK resolution type to ADMIN role', () => {
      const resolutions = getAvailableResolutionTypes('ADMIN');
      expect(resolutions).not.toContain('ACCEPTED_RISK');
      expect(resolutions).toEqual([
        'REMEDIATED',
        'WORKAROUND',
        'SOURCE_CORRECTED',
        'SUPERSEDED',
      ]);
    });

    it('denies ACCEPTED_RISK to all other non-owner roles', () => {
      expect(getAvailableResolutionTypes('OPERATIONS')).not.toContain(
        'ACCEPTED_RISK',
      );
      expect(getAvailableResolutionTypes('FINANCE')).not.toContain(
        'ACCEPTED_RISK',
      );
    });
  });

  // ==========================================================================
  // 8. Error Presentation & Translation
  // ==========================================================================
  describe('Error Presentation Mapping', () => {
    it('maps all bounded WP02 error codes to clear Indonesian messages', () => {
      expect(translateErrorCode('UNAUTHORIZED')).toContain('Akses ditolak');
      expect(translateErrorCode('NOT_FOUND')).toContain('tidak ditemukan');
      expect(translateErrorCode('CROSS_ORG')).toContain(
        'lintas organisasi ditolak',
      );
      expect(translateErrorCode('INVALID_STATE')).toContain(
        'Status exception tidak valid',
      );
      expect(translateErrorCode('STALE_REVISION')).toContain(
        'diperbarui oleh pengguna lain',
      );
      expect(translateErrorCode('IDEMPOTENCY_CONFLICT')).toContain(
        'Konflik permintaan',
      );
      expect(translateErrorCode('BUSINESS_DUPLICATE')).toContain(
        'sudah ada untuk resource ini',
      );
      expect(translateErrorCode('INVALID_RESOURCE')).toContain(
        'Resource yang dipilih tidak valid',
      );
      expect(translateErrorCode('VALIDATION_ERROR')).toContain(
        'Data masukan tidak valid',
      );
      expect(translateErrorCode('UNKNOWN_FAILURE')).toContain(
        'Terjadi kesalahan sistem',
      );
    });

    it('does not expose raw database errors, tokens, or credentials', () => {
      const msg = translateErrorCode('UNKNOWN_FAILURE');
      expect(msg).not.toContain('postgresql');
      expect(msg).not.toContain('supabase');
      expect(msg).not.toContain('service_role');
      expect(msg).not.toContain('Bearer');
    });
  });

  // ==========================================================================
  // 9. Pure Presentation Helpers
  // ==========================================================================
  describe('Pure Presentation Helpers', () => {
    it('formats badges and labels correctly', () => {
      expect(formatExceptionType('production.deadline_breached')).toContain(
        'Batas Waktu',
      );
      expect(formatSeverityBadge('CRITICAL').label).toBe('KRITIS');
      expect(formatStatusBadge('OPEN').label).toBe('TERBUKA (OPEN)');
      expect(formatCategoryLabel('PRODUCTION')).toBe('Produksi');
      expect(formatSourceKind('HUMAN_REPORT')).toBe('Laporan Manual Operator');
      expect(formatResolutionType('REMEDIATED')).toContain('Remediated');
      expect(formatDismissalReason('DUPLICATE')).toContain('Duplicate');
      expect(formatResourceType('ORDER')).toContain('Order');
      expect(formatTimestamp(null)).toBe('-');
    });

    it('generates valid RFC4122 client request IDs', () => {
      const id1 = generateClientRequestId();
      const id2 = generateClientRequestId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });
  });
});
