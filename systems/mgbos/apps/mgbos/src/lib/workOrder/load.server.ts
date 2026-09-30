import 'server-only';
import { getSession } from '@/lib/session.server';
import { hasPermission } from '@mgbos/auth';
import { serverEnvironment } from '@/lib/env.server';
import { publicEnvironment } from '@/lib/env.client';
import {
  buildWorkOrderDocument,
  type WorkOrderDocument,
  type WorkOrderSource,
  type WorkOrderVendorSource,
  type WorkOrderAssignmentSource,
} from '@mgbos/domain';

export class DocumentAccessError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function loadWorkOrder(
  jobId: string,
  assignmentId?: string | null,
): Promise<WorkOrderDocument> {
  const session = await getSession();
  if (!session) {
    throw new DocumentAccessError(401, 'Silakan masuk terlebih dahulu.');
  }

  if (!hasPermission(session.role.code, 'production:read')) {
    throw new DocumentAccessError(
      403,
      'Akun tidak memiliki hak akses melihat dokumen Surat Perintah Kerja (SPK).',
    );
  }

  const uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuid.test(jobId)) {
    throw new DocumentAccessError(404, 'Job produksi tidak ditemukan.');
  }

  if (assignmentId && !uuid.test(assignmentId)) {
    throw new DocumentAccessError(404, 'Penugasan tidak ditemukan.');
  }

  const base = publicEnvironment.NEXT_PUBLIC_SUPABASE_URL;
  const key = serverEnvironment.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) {
    throw new Error('Database belum dikonfigurasi.');
  }

  async function rows<T>(path: string): Promise<T[]> {
    const res = await fetch(base + '/rest/v1/' + path, {
      headers: {
        apikey: key!,
        Authorization: 'Bearer ' + key,
        'Accept-Profile': 'app',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Dokumen SPK belum dapat dimuat.');
    }
    return res.json() as Promise<T[]>;
  }

  // 1. Fetch production job strictly enforcing organization boundary (AC-02)
  const jobRows = await rows<{
    id: string;
    organization_id: string;
    job_number: string;
    title: string;
    job_type: string;
    status: string;
    priority: string;
    target_completion_date: string | null;
    notes: string | null;
    created_at: string;
    order_id: string;
    brand_id: string;
    specification: Record<string, unknown> | null;
  }>(
    `production_jobs?id=eq.${jobId}&organization_id=eq.${session.organization.id}&select=id,organization_id,job_number,title,job_type,status,priority,target_completion_date,notes,created_at,order_id,brand_id,specification`,
  );

  const job = jobRows[0];
  if (!job) {
    throw new DocumentAccessError(404, 'Job produksi tidak ditemukan.');
  }

  // 2. Fetch parent order reference (order_number)
  const orderRows = await rows<{
    id: string;
    order_number: string;
    brand_id: string;
  }>(
    `orders?id=eq.${job.order_id}&organization_id=eq.${session.organization.id}&select=id,order_number,brand_id`,
  );
  const order = orderRows[0];
  if (!order) {
    throw new DocumentAccessError(404, 'Pesanan induk tidak ditemukan.');
  }

  // 3. Fetch Brand info
  const brandRows = await rows<{
    id: string;
    code: string;
    name: string;
  }>(
    `brands?id=eq.${job.brand_id}&organization_id=eq.${session.organization.id}&select=id,code,name`,
  );
  const brand = brandRows[0];

  // 4. Fetch assignments for this job
  const assignmentRows = await rows<{
    id: string;
    production_job_id: string;
    executor_type: string;
    assigned_brand_id: string | null;
    vendor_id: string | null;
    vendor_name: string | null;
    assigned_cost: string;
    status: string;
    assigned_at: string;
    accepted_at: string | null;
    notes: string | null;
  }>(
    `production_assignments?production_job_id=eq.${job.id}&select=id,production_job_id,executor_type,assigned_brand_id,vendor_id,vendor_name,assigned_cost:assigned_cost::text,status,assigned_at,accepted_at,notes&order=assigned_at.desc`,
  );

  let selectedAssignment = assignmentRows[0] ?? null;
  let isLatestAssignment = true;

  if (assignmentId) {
    const found = assignmentRows.find((a) => a.id === assignmentId);
    if (!found) {
      throw new DocumentAccessError(
        404,
        'Penugasan historis yang diminta tidak ditemukan.',
      );
    }
    selectedAssignment = found;
    isLatestAssignment = assignmentRows[0]?.id === found.id;
  }

  // 5. If vendor-assigned, fetch vendor details
  let vendorData: WorkOrderVendorSource | null = null;
  if (selectedAssignment?.vendor_id) {
    const vendorRows = await rows<{
      id: string;
      code: string;
      name: string;
      category: string;
      contact_person: string | null;
      phone: string | null;
      email: string | null;
      address: string | null;
    }>(
      `vendors?id=eq.${selectedAssignment.vendor_id}&organization_id=eq.${session.organization.id}&select=id,code,name,category,contact_person,phone,email,address`,
    );
    const v = vendorRows[0];
    if (v) {
      vendorData = {
        id: v.id,
        code: v.code,
        name: v.name,
        category: v.category,
        contactPerson: v.contact_person,
        phone: v.phone,
        email: v.email,
        address: v.address,
      };
    }
  }

  // If internal-assigned, fetch internal brand details
  let internalBrand: { id: string; code: string; name: string } | null = null;
  if (selectedAssignment?.assigned_brand_id) {
    const intBrandRows = await rows<{
      id: string;
      code: string;
      name: string;
    }>(
      `brands?id=eq.${selectedAssignment.assigned_brand_id}&organization_id=eq.${session.organization.id}&select=id,code,name`,
    );
    internalBrand = intBrandRows[0] ?? null;
  }

  // 6. Fetch allocated items with specification snapshot from order items
  const jobItems = await rows<{
    id: string;
    quantity: number;
    notes: string | null;
    order_items: {
      id: string;
      description: string;
      unit: string;
      specification_snapshot: Record<string, unknown>;
    } | null;
  }>(
    `production_job_items?production_job_id=eq.${job.id}&select=id,quantity,notes,order_items(id,description,unit,specification_snapshot)`,
  );

  const items = jobItems.map((ji) => ({
    id: ji.id,
    allocatedQuantity: ji.quantity,
    description: ji.order_items?.description ?? 'Item Produksi',
    unit: ji.order_items?.unit ?? 'pcs',
    notes: ji.notes,
    specificationSnapshot: ji.order_items?.specification_snapshot ?? null,
  }));

  let assignmentSource: WorkOrderAssignmentSource | null = null;
  if (selectedAssignment) {
    assignmentSource = {
      id: selectedAssignment.id,
      status: selectedAssignment.status,
      executorType: selectedAssignment.executor_type,
      assignedCost: BigInt(selectedAssignment.assigned_cost || '0'),
      assignedAt: selectedAssignment.assigned_at,
      acceptedAt: selectedAssignment.accepted_at,
      notes: selectedAssignment.notes,
      vendor: vendorData,
      vendorName: selectedAssignment.vendor_name,
      brand: internalBrand,
    };
  }

  const source: WorkOrderSource = {
    job: {
      id: job.id,
      jobNumber: job.job_number,
      title: job.title,
      jobType: job.job_type,
      status: job.status,
      priority: job.priority,
      targetCompletionDate: job.target_completion_date,
      notes: job.notes,
      createdAt: job.created_at,
      specification: job.specification,
    },
    order: {
      id: order.id,
      orderNumber: order.order_number,
    },
    issuer: {
      organizationName: session.organization.displayName || 'MGBOS Holding',
      brandName: brand?.name ?? null,
      brandCode: brand?.code ?? null,
    },
    assignment: assignmentSource,
    items,
    isLatestAssignment,
  };

  return buildWorkOrderDocument(source);
}
