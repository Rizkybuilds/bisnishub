import 'server-only';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import { requireAuth } from '@/lib/session.server';
import { assertPermission } from '@mgbos/auth';
import type { Database } from '@mgbos/database';
import type { OperationalExceptionResourceType } from '@mgbos/domain';

type AppTables = Database['app']['Tables'];

export type OperationalExceptionRow =
  AppTables['operational_exceptions']['Row'];

export type OperationalExceptionAuditRow =
  AppTables['operational_exception_audit']['Row'];

export interface ResourceCandidate {
  id: string;
  resourceType: OperationalExceptionResourceType;
  identifier: string;
  label: string;
  status?: string;
  brandId?: string | null;
  orderId?: string | null;
}

export interface EligiblePrincipal {
  userId: string;
  name: string;
  email: string;
  roleCode: 'OWNER' | 'ADMIN';
  roleName: string;
}

export interface ExceptionCandidate {
  id: string;
  exceptionType: string;
  severity: string;
  status: string;
  summary: string;
  label: string;
}

export interface ResourceDisplayContext {
  resourceType: OperationalExceptionResourceType;
  resourceId: string;
  identifier: string;
  title?: string;
  status?: string;
  details?: Record<string, string | number | null>;
}

/**
 * Creates authenticated server-only context for operational exception operations.
 * Requires operational_exceptions:read permission.
 * Uses SUPABASE_SERVICE_ROLE_KEY strictly server-side with app schema profile.
 */
export async function exceptionsContext() {
  const session = await requireAuth();
  assertPermission(session, 'operational_exceptions:read');
  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) {
    throw new Error('Database belum dikonfigurasi.');
  }
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
    'Accept-Profile': 'app',
    'Content-Profile': 'app',
  };
  return {
    session,
    endpoint: base.replace(/\/+$/, '') + '/rest/v1',
    headers,
  };
}

/**
 * Resolves the authenticated session's active Brand UUID within the organization.
 * Enforces organization_id + active brand code + ACTIVE brand status.
 * Returns null if the brand cannot be resolved as an ACTIVE brand in the organization.
 */
async function resolveActiveBrandId(
  ctx: Awaited<ReturnType<typeof exceptionsContext>>,
): Promise<string | null> {
  const brandCode = ctx.session.activeBrand?.code;
  if (!brandCode) return null;
  const orgId = ctx.session.organization.id;
  const rows = await readRows<{ id: string }>(
    `brands?organization_id=eq.${encodeURIComponent(
      orgId,
    )}&code=eq.${encodeURIComponent(brandCode)}&status=eq.ACTIVE&select=id&limit=1`,
    ctx,
  );
  return rows[0]?.id || null;
}

/**
 * Internal scoped row fetcher for PostgREST endpoints within exceptions context.
 * Kept private to enforce that all external calls go through Organization-filtered helpers.
 */
async function readRows<T>(
  path: string,
  ctx: Awaited<ReturnType<typeof exceptionsContext>>,
): Promise<T[]> {
  const response = await fetch(`${ctx.endpoint}/${path}`, {
    headers: ctx.headers,
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(
      'Data operational exception tidak dapat dimuat. Coba lagi.',
    );
  }
  return response.json() as Promise<T[]>;
}

/**
 * Privileged read: list all operational exceptions for the authenticated organization.
 * Builds trusted server context internally.
 * Explicitly filters by organization_id to enforce organizational boundary.
 */
export async function listOperationalExceptions(): Promise<
  OperationalExceptionRow[]
> {
  const context = await exceptionsContext();
  const orgId = context.session.organization.id;
  const path = `operational_exceptions?organization_id=eq.${encodeURIComponent(
    orgId,
  )}&order=created_at.desc`;
  return readRows<OperationalExceptionRow>(path, context);
}

/**
 * Privileged read: get a single operational exception by ID within the authenticated organization.
 * Builds trusted server context internally.
 * Fails closed if the exception belongs to another organization.
 */
export async function getOperationalException(
  id: string,
): Promise<OperationalExceptionRow | null> {
  const context = await exceptionsContext();
  const orgId = context.session.organization.id;
  const path = `operational_exceptions?id=eq.${encodeURIComponent(
    id,
  )}&organization_id=eq.${encodeURIComponent(orgId)}&limit=1`;
  const rows = await readRows<OperationalExceptionRow>(path, context);
  return rows[0] ?? null;
}

/**
 * Privileged read: read audit/history log for an operational exception.
 * Builds trusted server context internally.
 * Requires explicit operational_exceptions:history_read permission.
 * Fails closed outside the authenticated organization.
 */
export async function getOperationalExceptionHistory(
  exceptionId: string,
): Promise<OperationalExceptionAuditRow[]> {
  const context = await exceptionsContext();
  assertPermission(context.session, 'operational_exceptions:history_read');
  const orgId = context.session.organization.id;
  const path = `operational_exception_audit?operational_exception_id=eq.${encodeURIComponent(
    exceptionId,
  )}&organization_id=eq.${encodeURIComponent(orgId)}&order=created_at.asc`;
  return readRows<OperationalExceptionAuditRow>(path, context);
}

/**
 * Privileged read: load candidate primary resources for the manual exception creation form.
 * Restricted to controlled resource types, with strict Organization filtering and limit <= 100.
 */
export async function loadResourceCandidates(
  resourceType: OperationalExceptionResourceType,
): Promise<ResourceCandidate[]> {
  const context = await exceptionsContext();
  const orgId = context.session.organization.id;
  const activeBrandId = await resolveActiveBrandId(context);

  // If the session-selected Brand cannot be resolved as an ACTIVE Brand inside the Organization:
  // fail closed / return no Brand-scoped candidates.
  if (!activeBrandId) {
    return [];
  }

  switch (resourceType) {
    case 'ORDER': {
      const rows = await readRows<{
        id: string;
        order_number: string;
        status: string;
        grand_total: number;
        brand_id: string;
      }>(
        `orders?organization_id=eq.${encodeURIComponent(
          orgId,
        )}&brand_id=eq.${encodeURIComponent(
          activeBrandId,
        )}&status=not.in.(COMPLETED,CANCELLED)&select=id,order_number,status,grand_total,brand_id&order=created_at.desc&limit=100`,
        context,
      );
      return rows.map((r) => ({
        id: r.id,
        resourceType: 'ORDER',
        identifier: r.order_number,
        label: `${r.order_number} (${r.status} · Rp ${Number(
          r.grand_total,
        ).toLocaleString('id-ID')})`,
        status: r.status,
        brandId: r.brand_id,
        orderId: r.id,
      }));
    }

    case 'PRODUCTION_JOB': {
      const rows = await readRows<{
        id: string;
        job_number: string;
        title: string;
        status: string;
        brand_id: string;
        order_id: string;
      }>(
        `production_jobs?organization_id=eq.${encodeURIComponent(
          orgId,
        )}&brand_id=eq.${encodeURIComponent(
          activeBrandId,
        )}&select=id,job_number,title,status,brand_id,order_id&order=created_at.desc&limit=100`,
        context,
      );
      return rows.map((r) => ({
        id: r.id,
        resourceType: 'PRODUCTION_JOB',
        identifier: r.job_number,
        label: `${r.job_number} - ${r.title} (${r.status})`,
        status: r.status,
        brandId: r.brand_id,
        orderId: r.order_id,
      }));
    }

    case 'PRODUCTION_ASSIGNMENT': {
      const rows = await readRows<{
        id: string;
        production_job_id: string;
        executor_type: string;
        vendor_name: string | null;
        status: string;
        assigned_cost: number | null;
        production_jobs?: {
          job_number: string;
          organization_id: string;
          brand_id: string;
        } | null;
      }>(
        `production_assignments?select=id,production_job_id,executor_type,vendor_name,status,assigned_cost,production_jobs!inner(job_number,organization_id,brand_id)&production_jobs.organization_id=eq.${encodeURIComponent(
          orgId,
        )}&production_jobs.brand_id=eq.${encodeURIComponent(
          activeBrandId,
        )}&status=in.(ASSIGNED,ACCEPTED)&order=created_at.desc&limit=100`,
        context,
      );
      return rows.map((r) => {
        const executor =
          r.executor_type === 'VENDOR'
            ? r.vendor_name || 'Vendor Eksternal'
            : 'Internal Workcenter';
        const jobNo = r.production_jobs?.job_number
          ? `[${r.production_jobs.job_number}] `
          : '';
        return {
          id: r.id,
          resourceType: 'PRODUCTION_ASSIGNMENT',
          identifier: `SPK-${r.id.substring(0, 8)}`,
          label: `${jobNo}${executor} (${r.status})`,
          status: r.status,
          brandId: activeBrandId,
          orderId: null,
        };
      });
    }

    case 'QC_INSPECTION': {
      const rows = await readRows<{
        id: string;
        inspection_number: string;
        result: string;
        defect_category: string | null;
        defect_count: number;
        production_jobs?: {
          job_number: string;
          organization_id: string;
          brand_id: string;
        } | null;
      }>(
        `qc_inspections?select=id,inspection_number,result,defect_category,defect_count,production_jobs!inner(job_number,organization_id,brand_id)&production_jobs.organization_id=eq.${encodeURIComponent(
          orgId,
        )}&production_jobs.brand_id=eq.${encodeURIComponent(
          activeBrandId,
        )}&result=in.(REWORK,REJECTED)&order=created_at.desc&limit=100`,
        context,
      );
      return rows.map((r) => {
        const jobNo = r.production_jobs?.job_number
          ? `[${r.production_jobs.job_number}] `
          : '';
        return {
          id: r.id,
          resourceType: 'QC_INSPECTION',
          identifier: r.inspection_number,
          label: `${jobNo}${r.inspection_number} (${r.result}${
            r.defect_count ? ` · ${r.defect_count} cacat` : ''
          })`,
          status: r.result,
          brandId: activeBrandId,
          orderId: null,
        };
      });
    }

    case 'SHIPMENT': {
      const rows = await readRows<{
        id: string;
        shipment_number: string;
        status: string;
        courier_name: string;
        brand_id: string;
        order_id: string;
      }>(
        `shipments?organization_id=eq.${encodeURIComponent(
          orgId,
        )}&brand_id=eq.${encodeURIComponent(
          activeBrandId,
        )}&status=not.in.(DELIVERED,CANCELLED)&select=id,shipment_number,status,courier_name,brand_id,order_id&order=created_at.desc&limit=100`,
        context,
      );
      return rows.map((r) => ({
        id: r.id,
        resourceType: 'SHIPMENT',
        identifier: r.shipment_number,
        label: `${r.shipment_number} (${r.status} · ${r.courier_name})`,
        status: r.status,
        brandId: r.brand_id,
        orderId: r.order_id,
      }));
    }

    case 'INVOICE': {
      const rows = await readRows<{
        id: string;
        invoice_number: string;
        status: string;
        amount_total: number;
        balance_due: number;
        brand_id: string;
        order_id: string;
      }>(
        `invoices?organization_id=eq.${encodeURIComponent(
          orgId,
        )}&brand_id=eq.${encodeURIComponent(
          activeBrandId,
        )}&balance_due=gt.0&status=in.(ISSUED,PARTIALLY_PAID,OVERDUE)&select=id,invoice_number,status,amount_total,balance_due,brand_id,order_id&order=created_at.desc&limit=100`,
        context,
      );
      return rows.map((r) => ({
        id: r.id,
        resourceType: 'INVOICE',
        identifier: r.invoice_number,
        label: `${r.invoice_number} (${r.status} · Rp ${Number(
          r.amount_total,
        ).toLocaleString('id-ID')})`,
        status: r.status,
        brandId: r.brand_id,
        orderId: r.order_id,
      }));
    }

    default:
      throw new Error(`Tipe resource tidak didukung: ${resourceType}`);
  }
}

/**
 * Privileged read: load eligible responsible principals for assigning operational exceptions.
 * Only active members in the same organization with OWNER or ADMIN roles are returned.
 */
export async function loadEligibleResponsiblePrincipals(): Promise<
  EligiblePrincipal[]
> {
  const context = await exceptionsContext();
  const orgId = context.session.organization.id;

  const rows = await readRows<{
    id: string;
    user_id: string;
    status: string;
    users?: {
      id: string;
      name: string;
      email: string;
      status: string;
    } | null;
    roles?: {
      id: string;
      code: string;
      name: string;
    } | null;
  }>(
    `organization_members?organization_id=eq.${encodeURIComponent(
      orgId,
    )}&status=eq.ACTIVE&select=id,user_id,status,users!inner(id,name,email,status),roles!inner(id,code,name)&users.status=eq.ACTIVE&order=created_at.asc`,
    context,
  );

  return rows
    .filter(
      (m) =>
        m.users &&
        m.roles &&
        (m.roles.code === 'OWNER' || m.roles.code === 'ADMIN'),
    )
    .map((m) => ({
      userId: m.users!.id,
      name: m.users!.name,
      email: m.users!.email,
      roleCode: m.roles!.code as 'OWNER' | 'ADMIN',
      roleName: m.roles!.name,
    }));
}

/**
 * Privileged read: load exception candidates for duplicate / superseded resolution selection.
 * Excludes self-target and strictly filters to the authenticated organization.
 * When mode === 'active_only', restricts candidates to OPEN and ACKNOWLEDGED status.
 */
export async function loadExceptionCandidates(
  excludeExceptionId?: string,
  mode: 'all' | 'active_only' = 'all',
): Promise<ExceptionCandidate[]> {
  const context = await exceptionsContext();
  const orgId = context.session.organization.id;

  const statusFilter =
    mode === 'active_only' ? '&status=in.(OPEN,ACKNOWLEDGED)' : '';

  const rows = await readRows<{
    id: string;
    exception_type: string;
    severity: string;
    status: string;
    summary: string;
  }>(
    `operational_exceptions?organization_id=eq.${encodeURIComponent(
      orgId,
    )}${statusFilter}&select=id,exception_type,severity,status,summary&order=created_at.desc&limit=100`,
    context,
  );

  return rows
    .filter((r) => r.id !== excludeExceptionId)
    .map((r) => ({
      id: r.id,
      exceptionType: r.exception_type,
      severity: r.severity,
      status: r.status,
      summary: r.summary,
      label: `[${r.severity}] ${r.summary} (${r.status})`,
    }));
}

/**
 * Privileged read: load display metadata for a specific primary resource.
 * Enforces organization boundary. Returns null if resource is missing or belongs to another organization.
 */
export async function loadResourceDisplayContext(
  resourceType: OperationalExceptionResourceType,
  resourceId: string,
): Promise<ResourceDisplayContext | null> {
  const context = await exceptionsContext();
  const orgId = context.session.organization.id;

  try {
    switch (resourceType) {
      case 'ORDER': {
        const rows = await readRows<{
          id: string;
          order_number: string;
          status: string;
          grand_total: number;
        }>(
          `orders?id=eq.${encodeURIComponent(
            resourceId,
          )}&organization_id=eq.${encodeURIComponent(orgId)}&limit=1`,
          context,
        );
        const r = rows[0];
        if (!r) return null;
        return {
          resourceType: 'ORDER',
          resourceId: r.id,
          identifier: r.order_number,
          title: `Kontrak Pesanan ${r.order_number}`,
          status: r.status,
          details: {
            'Nilai Total': `Rp ${Number(r.grand_total).toLocaleString('id-ID')}`,
            Status: r.status,
          },
        };
      }

      case 'PRODUCTION_JOB': {
        const rows = await readRows<{
          id: string;
          job_number: string;
          title: string;
          status: string;
          priority: string;
        }>(
          `production_jobs?id=eq.${encodeURIComponent(
            resourceId,
          )}&organization_id=eq.${encodeURIComponent(orgId)}&limit=1`,
          context,
        );
        const r = rows[0];
        if (!r) return null;
        return {
          resourceType: 'PRODUCTION_JOB',
          resourceId: r.id,
          identifier: r.job_number,
          title: `SPK Produksi ${r.job_number} - ${r.title}`,
          status: r.status,
          details: {
            Prioritas: r.priority,
            Status: r.status,
          },
        };
      }

      case 'PRODUCTION_ASSIGNMENT': {
        const rows = await readRows<{
          id: string;
          executor_type: string;
          vendor_name: string | null;
          status: string;
          assigned_cost: number | null;
          production_jobs?: {
            job_number: string;
            organization_id: string;
          } | null;
        }>(
          `production_assignments?id=eq.${encodeURIComponent(
            resourceId,
          )}&select=id,executor_type,vendor_name,status,assigned_cost,production_jobs!inner(job_number,organization_id)&production_jobs.organization_id=eq.${encodeURIComponent(
            orgId,
          )}&limit=1`,
          context,
        );
        const r = rows[0];
        if (!r) return null;
        const executor =
          r.executor_type === 'VENDOR'
            ? r.vendor_name || 'Vendor Eksternal'
            : 'Internal Workcenter';
        return {
          resourceType: 'PRODUCTION_ASSIGNMENT',
          resourceId: r.id,
          identifier: `Penugasan Produksi (${executor})`,
          title: `Penugasan SPK ${r.production_jobs?.job_number ?? ''}`,
          status: r.status,
          details: {
            Pelaksana: executor,
            Status: r.status,
          },
        };
      }

      case 'QC_INSPECTION': {
        const rows = await readRows<{
          id: string;
          inspection_number: string;
          result: string;
          defect_category: string | null;
          defect_count: number;
        }>(
          `qc_inspections?id=eq.${encodeURIComponent(
            resourceId,
          )}&organization_id=eq.${encodeURIComponent(orgId)}&limit=1`,
          context,
        );
        const r = rows[0];
        if (!r) return null;
        return {
          resourceType: 'QC_INSPECTION',
          resourceId: r.id,
          identifier: r.inspection_number,
          title: `Inspeksi QC ${r.inspection_number}`,
          status: r.result,
          details: {
            Hasil: r.result,
            'Jumlah Cacat': r.defect_count,
            Kategori: r.defect_category || '-',
          },
        };
      }

      case 'SHIPMENT': {
        const rows = await readRows<{
          id: string;
          shipment_number: string;
          status: string;
          courier_name: string;
          tracking_number: string | null;
        }>(
          `shipments?id=eq.${encodeURIComponent(
            resourceId,
          )}&organization_id=eq.${encodeURIComponent(orgId)}&limit=1`,
          context,
        );
        const r = rows[0];
        if (!r) return null;
        return {
          resourceType: 'SHIPMENT',
          resourceId: r.id,
          identifier: r.shipment_number,
          title: `Pengiriman ${r.shipment_number}`,
          status: r.status,
          details: {
            Kurir: r.courier_name,
            Resi: r.tracking_number || '-',
            Status: r.status,
          },
        };
      }

      case 'INVOICE': {
        const rows = await readRows<{
          id: string;
          invoice_number: string;
          status: string;
          amount_total: number;
          balance_due: number;
        }>(
          `invoices?id=eq.${encodeURIComponent(
            resourceId,
          )}&organization_id=eq.${encodeURIComponent(orgId)}&limit=1`,
          context,
        );
        const r = rows[0];
        if (!r) return null;
        return {
          resourceType: 'INVOICE',
          resourceId: r.id,
          identifier: r.invoice_number,
          title: `Faktur ${r.invoice_number}`,
          status: r.status,
          details: {
            'Total Tagihan': `Rp ${Number(r.amount_total).toLocaleString('id-ID')}`,
            'Sisa Tagihan': `Rp ${Number(r.balance_due).toLocaleString('id-ID')}`,
            Status: r.status,
          },
        };
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}
