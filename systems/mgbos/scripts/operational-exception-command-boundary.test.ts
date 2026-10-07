import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  context: vi.fn(),
  invalidate: vi.fn(),
}));

vi.mock('../apps/mgbos/src/app/(app)/exceptions/data', () => ({
  exceptionsContext: mocks.context,
}));

vi.mock('next/cache', () => ({
  revalidatePath: mocks.invalidate,
}));

import {
  openOperationalExceptionAction,
  acknowledgeOperationalExceptionAction,
  assignOperationalExceptionAction,
  reassignOperationalExceptionAction,
  changeOperationalExceptionSeverityAction,
  resolveOperationalExceptionAction,
  dismissOperationalExceptionAction,
  reopenOperationalExceptionAction,
} from '../apps/mgbos/src/app/(app)/exceptions/actions';

const VALID_UUID_EX = '00000000-0000-4000-8000-000000000001';
const VALID_UUID_RES = '00000000-0000-4000-8000-000000000002';
const VALID_UUID_USER = '00000000-0000-4000-8000-000000000003';
const VALID_UUID_REQ = '11111111-1111-4111-8111-111111111111';

const trustedSession = {
  organization: { id: 'trusted-org-uuid-001' },
  user: { id: 'trusted-actor-uuid-002' },
  role: { code: 'OWNER' },
};

describe('Operational Exception Command Boundary Actions (P2-A / WP02)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.context.mockResolvedValue({
      session: trustedSession,
      endpoint: 'http://127.0.0.1:55431/rest/v1',
      headers: {
        apikey: 'service-role-test-key',
        Authorization: 'Bearer service-role-test-key',
        'Content-Type': 'application/json',
        'Accept-Profile': 'app',
        'Content-Profile': 'app',
      },
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            exception_id: VALID_UUID_EX,
            status: 'OPEN',
            severity: 'HIGH',
            current_revision: 1,
            is_retry: false,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );
  });

  describe('openOperationalExceptionAction', () => {
    const validOpenInput = {
      requestId: VALID_UUID_REQ,
      exceptionType: 'production.deadline_breached',
      primaryResourceType: 'PRODUCTION_JOB',
      primaryResourceId: VALID_UUID_RES,
      severity: 'HIGH',
      sourceKind: 'HUMAN_REPORT',
      responsibleRoleCode: 'OPERATIONS',
      summary: 'Keterlambatan proses jahit pada pesanan TS-O-2026-0001',
      businessImpact: 'Potensi penalti keterlambatan pengiriman ke pelanggan',
    };

    it('calls open_operational_exception RPC with session org and actor', async () => {
      const res = await openOperationalExceptionAction(validOpenInput);

      expect(res.success).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(1);

      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/open_operational_exception',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_organization_id).toBe('trusted-org-uuid-001');
      expect(body.p_actor_id).toBe('trusted-actor-uuid-002');
      expect(body.p_request_id).toBe(VALID_UUID_REQ);
      expect(body.p_exception_type).toBe('production.deadline_breached');
      expect(body.p_primary_resource_type).toBe('PRODUCTION_JOB');
      expect(body.p_primary_resource_id).toBe(VALID_UUID_RES);
      expect(body.p_responsible_role_code).toBe('OPERATIONS');
      expect(body.p_summary).toBe(
        'Keterlambatan proses jahit pada pesanan TS-O-2026-0001',
      );

      expect(mocks.invalidate).toHaveBeenCalledWith('/exceptions');
      expect(mocks.invalidate).toHaveBeenCalledWith(
        `/exceptions/${VALID_UUID_EX}`,
      );
    });

    it('rejects invalid input before fetch is called', async () => {
      const res = await openOperationalExceptionAction({
        ...validOpenInput,
        requestId: 'invalid-uuid',
      });

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('VALIDATION_ERROR');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('rejects unauthorized role before RPC fetch is called', async () => {
      mocks.context.mockResolvedValue({
        session: {
          ...trustedSession,
          role: { code: 'SALES' },
        },
        endpoint: 'http://127.0.0.1:55431/rest/v1',
        headers: {},
      });

      const res = await openOperationalExceptionAction(validOpenInput);

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('UNAUTHORIZED');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('correctly maps conditional otherCategoryReason for other exception type', async () => {
      const res = await openOperationalExceptionAction({
        requestId: VALID_UUID_REQ,
        exceptionType: 'other.operational_abnormality',
        primaryResourceType: 'ORDER',
        primaryResourceId: VALID_UUID_RES,
        severity: 'MEDIUM',
        sourceKind: 'HUMAN_REPORT',
        responsibleRoleCode: 'ADMIN',
        summary: 'Kendala operasional tak terduga',
        businessImpact: 'Perlu verifikasi manual admin',
        otherCategoryReason:
          'Kendala operasional tak terduga pada gudang transit',
      });

      expect(res.success).toBe(true);
      const [, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      const body = JSON.parse(init.body as string);
      expect(body.p_other_category_reason).toBe(
        'Kendala operasional tak terduga pada gudang transit',
      );
    });

    it('classifies database duplicate error as BUSINESS_DUPLICATE', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              code: 'P0001',
              message:
                'Active exception already exists for this resource and abnormality',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const res = await openOperationalExceptionAction(validOpenInput);

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('BUSINESS_DUPLICATE');
    });

    it('classifies idempotency conflict error as IDEMPOTENCY_CONFLICT', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              code: 'P0001',
              message:
                'Idempotency conflict: request_id already used with different payload or command',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const res = await openOperationalExceptionAction(validOpenInput);

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('IDEMPOTENCY_CONFLICT');
    });
  });

  describe('acknowledgeOperationalExceptionAction', () => {
    const validAckInput = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_EX,
      expectedRevision: 1,
      note: 'Dikonfirmasi oleh supervisor shift',
    };

    it('calls acknowledge_operational_exception RPC and forwards expectedRevision and requestId', async () => {
      const res = await acknowledgeOperationalExceptionAction(validAckInput);

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/acknowledge_operational_exception',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_organization_id).toBe('trusted-org-uuid-001');
      expect(body.p_actor_id).toBe('trusted-actor-uuid-002');
      expect(body.p_request_id).toBe(VALID_UUID_REQ);
      expect(body.p_exception_id).toBe(VALID_UUID_EX);
      expect(body.p_expected_revision).toBe(1);
      expect(body.p_note).toBe('Dikonfirmasi oleh supervisor shift');

      expect(mocks.invalidate).toHaveBeenCalledWith('/exceptions');
      expect(mocks.invalidate).toHaveBeenCalledWith(
        `/exceptions/${VALID_UUID_EX}`,
      );
    });

    it('classifies stale revision DB error as STALE_REVISION', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              message: 'Stale revision: expected 1, got 2',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const res = await acknowledgeOperationalExceptionAction(validAckInput);

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('STALE_REVISION');
    });
  });

  describe('assignOperationalExceptionAction', () => {
    const validAssignInput = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_EX,
      expectedRevision: 1,
      responsibleRoleCode: 'OPERATIONS',
      responsibleUserId: VALID_UUID_USER,
      reason: 'Penugasan investigasi mesin',
    };

    it('calls assign_operational_exception RPC with correct payload', async () => {
      const res = await assignOperationalExceptionAction(validAssignInput);

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/assign_operational_exception',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_exception_id).toBe(VALID_UUID_EX);
      expect(body.p_expected_revision).toBe(1);
      expect(body.p_responsible_role_code).toBe('OPERATIONS');
      expect(body.p_responsible_user_id).toBe(VALID_UUID_USER);

      expect(mocks.invalidate).toHaveBeenCalledWith('/exceptions');
      expect(mocks.invalidate).toHaveBeenCalledWith(
        `/exceptions/${VALID_UUID_EX}`,
      );
    });
  });

  describe('reassignOperationalExceptionAction', () => {
    const validReassignInput = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_EX,
      expectedRevision: 2,
      newResponsibleRoleCode: 'ADMIN',
      newResponsibleUserId: VALID_UUID_USER,
      reason: 'Eskalasi masalah ke Admin',
    };

    it('calls reassign_operational_exception RPC with correct payload', async () => {
      const res = await reassignOperationalExceptionAction(validReassignInput);

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/reassign_operational_exception',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_exception_id).toBe(VALID_UUID_EX);
      expect(body.p_expected_revision).toBe(2);
      expect(body.p_new_responsible_role_code).toBe('ADMIN');
      expect(body.p_new_responsible_user_id).toBe(VALID_UUID_USER);
      expect(body.p_reason).toBe('Eskalasi masalah ke Admin');
    });

    it('classifies invalid status error as INVALID_STATE', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              message:
                'Cannot reassign exception with status RESOLVED: only OPEN or ACKNOWLEDGED exceptions can be reassigned',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const res = await reassignOperationalExceptionAction(validReassignInput);

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('INVALID_STATE');
    });
  });

  describe('changeOperationalExceptionSeverityAction', () => {
    const validChangeInput = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_EX,
      expectedRevision: 2,
      newSeverity: 'CRITICAL',
      reason: 'Dampak meluas ke pesanan prioritas',
    };

    it('calls change_operational_exception_severity RPC with correct payload', async () => {
      const res =
        await changeOperationalExceptionSeverityAction(validChangeInput);

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/change_operational_exception_severity',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_exception_id).toBe(VALID_UUID_EX);
      expect(body.p_expected_revision).toBe(2);
      expect(body.p_new_severity).toBe('CRITICAL');
      expect(body.p_reason).toBe('Dampak meluas ke pesanan prioritas');
    });
  });

  describe('resolveOperationalExceptionAction', () => {
    const validResolveInput = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_EX,
      expectedRevision: 3,
      resolutionType: 'REMEDIATED',
      resolutionSummary: 'Dinamo mesin jahit telah diganti dengan suku cadang',
    };

    it('calls resolve_operational_exception RPC with correct payload', async () => {
      const res = await resolveOperationalExceptionAction(validResolveInput);

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/resolve_operational_exception',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_exception_id).toBe(VALID_UUID_EX);
      expect(body.p_expected_revision).toBe(3);
      expect(body.p_resolution_type).toBe('REMEDIATED');
      expect(body.p_resolution_summary).toBe(
        'Dinamo mesin jahit telah diganti dengan suku cadang',
      );
      expect(body.p_superseded_by_exception_id).toBeNull();
    });

    it('forwards supersededByExceptionId for SUPERSEDED resolution', async () => {
      const res = await resolveOperationalExceptionAction({
        ...validResolveInput,
        resolutionType: 'SUPERSEDED',
        supersededByExceptionId: VALID_UUID_RES,
      });

      expect(res.success).toBe(true);
      const [, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      const body = JSON.parse(init.body as string);
      expect(body.p_resolution_type).toBe('SUPERSEDED');
      expect(body.p_superseded_by_exception_id).toBe(VALID_UUID_RES);
    });

    it('classifies Accepted Risk by non-owner DB error as UNAUTHORIZED', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              message: 'Accepted risk resolution requires OWNER authority',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const res = await resolveOperationalExceptionAction({
        ...validResolveInput,
        resolutionType: 'ACCEPTED_RISK',
      });

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('UNAUTHORIZED');
    });
  });

  describe('dismissOperationalExceptionAction', () => {
    const validDismissInput = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_EX,
      expectedRevision: 1,
      dismissalReason: 'NOT_APPLICABLE',
      reasonSummary: 'Kondisi telah terselesaikan sebelum laporan resmi dibuka',
    };

    it('calls dismiss_operational_exception RPC with correct payload', async () => {
      const res = await dismissOperationalExceptionAction(validDismissInput);

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/dismiss_operational_exception',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_exception_id).toBe(VALID_UUID_EX);
      expect(body.p_expected_revision).toBe(1);
      expect(body.p_dismissal_reason).toBe('NOT_APPLICABLE');
      expect(body.p_reason_summary).toBe(
        'Kondisi telah terselesaikan sebelum laporan resmi dibuka',
      );
      expect(body.p_duplicate_of_exception_id).toBeNull();
    });

    it('forwards duplicateOfExceptionId for DUPLICATE dismissal', async () => {
      const res = await dismissOperationalExceptionAction({
        ...validDismissInput,
        dismissalReason: 'DUPLICATE',
        duplicateOfExceptionId: VALID_UUID_RES,
      });

      expect(res.success).toBe(true);
      const [, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
      const body = JSON.parse(init.body as string);
      expect(body.p_dismissal_reason).toBe('DUPLICATE');
      expect(body.p_duplicate_of_exception_id).toBe(VALID_UUID_RES);
    });
  });

  describe('reopenOperationalExceptionAction', () => {
    const validReopenInput = {
      requestId: VALID_UUID_REQ,
      exceptionId: VALID_UUID_EX,
      expectedRevision: 4,
      reason: 'Kerusakan dinamo berulang kembali',
    };

    it('calls reopen_operational_exception RPC with correct payload', async () => {
      const res = await reopenOperationalExceptionAction(validReopenInput);

      expect(res.success).toBe(true);
      const [url, init] = vi.mocked(fetch).mock.calls[0] as [
        string,
        RequestInit,
      ];
      expect(url).toBe(
        'http://127.0.0.1:55431/rest/v1/rpc/reopen_operational_exception',
      );

      const body = JSON.parse(init.body as string);
      expect(body.p_exception_id).toBe(VALID_UUID_EX);
      expect(body.p_expected_revision).toBe(4);
      expect(body.p_reason).toBe('Kerusakan dinamo berulang kembali');
    });

    it('classifies active exception duplicate on reopen as BUSINESS_DUPLICATE', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              message:
                'Cannot reopen: another active operational exception already exists for this resource and abnormality',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const res = await reopenOperationalExceptionAction(validReopenInput);

      expect(res.success).toBe(false);
      expect(res.error?.code).toBe('BUSINESS_DUPLICATE');
    });
  });

  describe('Cross-cutting invariants', () => {
    it('no action uses direct table POST/PATCH/DELETE endpoints', async () => {
      const actions = [
        () =>
          openOperationalExceptionAction({
            requestId: VALID_UUID_REQ,
            exceptionType: 'production.deadline_breached',
            primaryResourceType: 'PRODUCTION_JOB',
            primaryResourceId: VALID_UUID_RES,
            severity: 'HIGH',
            sourceKind: 'HUMAN_REPORT',
            responsibleRoleCode: 'OPERATIONS',
            summary: 'Valid summary text',
            businessImpact: 'Valid impact text',
          }),
        () =>
          acknowledgeOperationalExceptionAction({
            requestId: VALID_UUID_REQ,
            exceptionId: VALID_UUID_EX,
            expectedRevision: 1,
          }),
        () =>
          assignOperationalExceptionAction({
            requestId: VALID_UUID_REQ,
            exceptionId: VALID_UUID_EX,
            expectedRevision: 1,
            responsibleRoleCode: 'OPERATIONS',
            responsibleUserId: VALID_UUID_USER,
          }),
        () =>
          reassignOperationalExceptionAction({
            requestId: VALID_UUID_REQ,
            exceptionId: VALID_UUID_EX,
            expectedRevision: 1,
            newResponsibleRoleCode: 'ADMIN',
            newResponsibleUserId: VALID_UUID_USER,
            reason: 'Valid reason here',
          }),
        () =>
          changeOperationalExceptionSeverityAction({
            requestId: VALID_UUID_REQ,
            exceptionId: VALID_UUID_EX,
            expectedRevision: 1,
            newSeverity: 'CRITICAL',
            reason: 'Valid reason here',
          }),
        () =>
          resolveOperationalExceptionAction({
            requestId: VALID_UUID_REQ,
            exceptionId: VALID_UUID_EX,
            expectedRevision: 1,
            resolutionType: 'REMEDIATED',
            resolutionSummary: 'Valid resolution text',
          }),
        () =>
          dismissOperationalExceptionAction({
            requestId: VALID_UUID_REQ,
            exceptionId: VALID_UUID_EX,
            expectedRevision: 1,
            dismissalReason: 'NOT_APPLICABLE',
            reasonSummary: 'Valid dismissal text',
          }),
        () =>
          reopenOperationalExceptionAction({
            requestId: VALID_UUID_REQ,
            exceptionId: VALID_UUID_EX,
            expectedRevision: 1,
            reason: 'Valid reopen text',
          }),
      ];

      for (const runAction of actions) {
        vi.clearAllMocks();
        mocks.context.mockResolvedValue({
          session: trustedSession,
          endpoint: 'http://127.0.0.1:55431/rest/v1',
          headers: {},
        });
        vi.stubGlobal(
          'fetch',
          vi.fn().mockResolvedValue(
            new Response(
              JSON.stringify({
                exception_id: VALID_UUID_EX,
                status: 'OPEN',
                severity: 'HIGH',
                current_revision: 1,
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            ),
          ),
        );

        const res = await runAction();
        expect(res.success).toBe(true);

        const [url, init] = vi.mocked(fetch).mock.calls[0] as [
          string,
          RequestInit,
        ];
        expect(url).toContain('/rest/v1/rpc/');
        expect(url).not.toContain('/rest/v1/operational_exceptions');
        expect(url).not.toContain('/rest/v1/operational_exception_audit');
        expect(init.method).toBe('POST');
      }
    });
  });
});
