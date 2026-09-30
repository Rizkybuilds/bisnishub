/**
 * MultiGraph Business OS — Work Order / SPK Domain Service (MGBOS-015 / P0-06)
 * Pure domain contracts, security allowlist, and artifact generators for shop-floor and vendor instructions.
 */

export interface WorkOrderJobSource {
  id: string;
  jobNumber: string;
  title: string;
  jobType: string;
  status: string;
  priority: string;
  targetCompletionDate?: string | null;
  notes?: string | null;
  createdAt: string;
  specification?: Record<string, unknown> | null;
}

export interface WorkOrderOrderSource {
  id: string;
  orderNumber: string;
}

export interface WorkOrderIssuerSource {
  organizationName: string;
  brandName?: string | null;
  brandCode?: string | null;
}

export interface WorkOrderVendorSource {
  id: string;
  code: string;
  name: string;
  category?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  contactPerson?: string | null;
}

export interface WorkOrderAssignmentSource {
  id: string;
  status: string;
  executorType: 'INTERNAL' | 'VENDOR' | string;
  assignedCost: bigint | string | number;
  assignedAt: string;
  acceptedAt?: string | null;
  notes?: string | null;
  vendor?: WorkOrderVendorSource | null;
  brand?: {
    id: string;
    code: string;
    name: string;
  } | null;
  vendorName?: string | null;
}

export interface WorkOrderItemSource {
  id: string;
  allocatedQuantity: number;
  description: string;
  unit: string;
  notes?: string | null;
  specificationSnapshot?: Record<string, unknown> | null;
}

export interface WorkOrderFileRef {
  name: string;
  url?: string | null;
  type?: string | null;
}

export interface WorkOrderSource {
  job: WorkOrderJobSource;
  order: WorkOrderOrderSource;
  issuer: WorkOrderIssuerSource;
  assignment?: WorkOrderAssignmentSource | null;
  items: WorkOrderItemSource[];
  fileReferences?: WorkOrderFileRef[];
  isLatestAssignment?: boolean;
}

export interface WorkOrderDocument {
  spkNumber: string;
  orderNumber: string;
  jobNumber: string;
  jobType: string;
  title: string;
  status: string;
  priority: string;
  targetDeadline: string;
  issuer: {
    organizationName: string;
    brandName: string;
  };
  executor: {
    type: 'INTERNAL' | 'VENDOR' | 'UNASSIGNED';
    name: string;
    code?: string | null;
    category?: string | null;
    contactPerson?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  };
  assignment: {
    id?: string;
    status: string;
    isHistorical: boolean;
    assignedCostFormatted: string;
    assignedCostRaw: bigint;
    assignedAt?: string | null;
    acceptedAt?: string | null;
    notes?: string | null;
  } | null;
  items: {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    specifications: string[];
    notes?: string | null;
  }[];
  totalQuantity: number;
  instructions: string[];
  fileReferences: WorkOrderFileRef[];
  issuedAt: string;
  notice: string;
}

const rupiah = (val: bigint | string | number | null | undefined): string => {
  if (val === null || val === undefined) return 'Rp 0';
  const b = typeof val === 'bigint' ? val : BigInt(val);
  return 'Rp ' + b.toLocaleString('id-ID');
};

const cleanText = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const toRecord = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

/**
 * Technical specification extractor for shop-floor & vendor execution.
 * Strictly allowlists physical/technical dimensions while stripping commercial, pricing, and margin details (AC-08).
 */
export function extractTechnicalSpecifications(
  spec: Record<string, unknown> | null | undefined,
): string[] {
  if (!spec || typeof spec !== 'object') return [];

  const lines: string[] = [];

  // Schema-specific parser for custom atelier
  if (spec.schemaCode === 'teestock.custom_atelier.v1') {
    const garment = toRecord(spec.garment);
    if (cleanText(garment.type)) lines.push(`Pakaian: ${cleanText(garment.type)}`);
    if (cleanText(garment.fit)) lines.push(`Fit: ${cleanText(garment.fit)}`);
    if (cleanText(garment.material)) lines.push(`Bahan: ${cleanText(garment.material)}`);
    if (cleanText(garment.color)) lines.push(`Warna: ${cleanText(garment.color)}`);
    if (typeof garment.gsm === 'number') lines.push(`GSM: ${garment.gsm}`);
    if (cleanText(garment.blankPreference))
      lines.push(`Blank: ${cleanText(garment.blankPreference)}`);

    const sizes = toRecord(spec.sizes);
    const sizeKeys = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const sizeBreakdown = sizeKeys
      .filter((k) => typeof sizes[k] === 'number')
      .map((k) => `${k}: ${sizes[k]}`)
      .join(', ');
    if (sizeBreakdown) lines.push(`Breakdown Ukuran: ${sizeBreakdown}`);

    if (Array.isArray(spec.decorations)) {
      for (const dec of spec.decorations) {
        const d = toRecord(dec);
        const loc = cleanText(d.location) || 'Posisi Kustom';
        const method = cleanText(d.method) || 'Dekorasi';
        const w = typeof d.widthCm === 'number' ? `${d.widthCm}cm` : null;
        const h = typeof d.heightCm === 'number' ? `${d.heightCm}cm` : null;
        const dim = w && h ? ` (${w} x ${h})` : '';
        const artwork = cleanText(d.artworkReference)
          ? ` · Ref File: ${cleanText(d.artworkReference)}`
          : '';
        const decNotes = cleanText(d.notes) ? ` · Catatan: ${cleanText(d.notes)}` : '';
        lines.push(`Dekorasi: ${loc} · ${method}${dim}${artwork}${decNotes}`);
      }
    }

    if (cleanText(spec.customization)) {
      lines.push(`Kustomisasi: ${cleanText(spec.customization)}`);
    }

    return lines;
  }

  // Generic key-value technical spec parser with explicit sensitive-key suppression
  const forbiddenTokens = [
    'price',
    'cost',
    'profit',
    'margin',
    'discount',
    'total',
    'subtotal',
    'fee',
    'customer',
    'billing',
    'secret',
    'token',
    'apikey',
  ];

  for (const [key, value] of Object.entries(spec)) {
    const normalized = key.toLowerCase().replace(/[^a-z]/g, '');
    if (forbiddenTokens.some((token) => normalized.includes(token))) continue;
    if (typeof value === 'string' && value.trim()) {
      lines.push(`${key}: ${value.trim()}`);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    }
  }

  return lines;
}

/**
 * Builds a governed, sanitized Work Order / SPK Document artifact.
 * Conforms to AC-01 through AC-11.
 */
export function buildWorkOrderDocument(
  source: WorkOrderSource,
  generatedAt?: Date,
): WorkOrderDocument {
  const job = source.job;
  const order = source.order;
  const issuer = source.issuer;
  const assignment = source.assignment;
  const now = generatedAt ?? new Date();

  const isHistorical =
    source.isLatestAssignment === false ||
    (assignment !== null &&
      assignment !== undefined &&
      ['DECLINED', 'CANCELLED'].includes(assignment.status));

  // Determine executor details
  let executor: WorkOrderDocument['executor'];
  if (!assignment) {
    executor = {
      type: 'UNASSIGNED',
      name: 'BELUM DITUGASKAN',
    };
  } else if (assignment.executorType === 'INTERNAL') {
    executor = {
      type: 'INTERNAL',
      name: assignment.brand?.name ?? issuer.brandName ?? 'Unit Produksi Internal',
      code: assignment.brand?.code ?? issuer.brandCode ?? null,
      category: 'In-House Studio',
    };
  } else {
    // External Vendor
    const v = assignment.vendor;
    executor = {
      type: 'VENDOR',
      name: v?.name ?? assignment.vendorName ?? 'Mitra Vendor Eksternal',
      code: v?.code ?? null,
      category: v?.category ?? null,
      contactPerson: v?.contactPerson ?? null,
      phone: v?.phone ?? null,
      email: v?.email ?? null,
      address: v?.address ?? null,
    };
  }

  // Format notice
  let notice: string;
  if (!assignment) {
    notice = 'DRAF SPK — Job produksi ini belum memiliki penugasan pelaksana aktif.';
  } else if (isHistorical) {
    notice = `DOKUMEN HISTORIS — Penugasan ini berstatus ${assignment.status} dan bukan penugasan aktif saat ini. Diterbitkan untuk arsip audit.`;
  } else if (assignment.status === 'ACCEPTED') {
    notice =
      'SPK RESMI (TERKONFIRMASI) — Pelaksana telah menerima penugasan ini. Patuhi toleransi mutu QC dan tenggat penyelesaian.';
  } else {
    notice =
      'SPK RESMI — Harap verifikasi rincian spesifikasi teknis dan konfirmasi penerimaan pekerjaan.';
  }

  // Raw and formatted committed cost (only for this assignment, AC-07)
  const rawCost = assignment ? BigInt(assignment.assignedCost) : 0n;
  const formattedCost = rupiah(rawCost);

  // Formatted items breakdown
  const items = source.items.map((it) => {
    const specs = extractTechnicalSpecifications(it.specificationSnapshot);
    return {
      id: it.id,
      description: it.description,
      quantity: it.allocatedQuantity,
      unit: it.unit,
      specifications: specs,
      notes: it.notes ?? null,
    };
  });

  const totalQuantity = items.reduce((acc, it) => acc + it.quantity, 0);

  // Consolidated instructions
  const instructions: string[] = [];
  if (job.notes && job.notes.trim()) {
    instructions.push(`Instruksi Job Produksi: ${job.notes.trim()}`);
  }
  if (assignment?.notes && assignment.notes.trim()) {
    instructions.push(`Instruksi Khusus Penugasan: ${assignment.notes.trim()}`);
  }

  // File references (artwork, attachments)
  const fileReferences: WorkOrderFileRef[] = [...(source.fileReferences ?? [])];
  // Collect any artwork references from items specifications
  for (const it of source.items) {
    if (it.specificationSnapshot?.schemaCode === 'teestock.custom_atelier.v1') {
      const decs = it.specificationSnapshot.decorations;
      if (Array.isArray(decs)) {
        for (const dec of decs) {
          const d = toRecord(dec);
          const artRef = cleanText(d.artworkReference);
          if (artRef && !fileReferences.some((f) => f.name === artRef)) {
            fileReferences.push({
              name: artRef,
              type: 'Artwork File Reference',
            });
          }
        }
      }
    }
  }

  const spkNumber = assignment?.id && isHistorical
    ? `SPK-${job.jobNumber}-${assignment.id.slice(0, 8)}`
    : `SPK-${job.jobNumber}`;

  const formattedIssuedAt = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(now);

  return {
    spkNumber,
    orderNumber: order.orderNumber,
    jobNumber: job.jobNumber,
    jobType: job.jobType,
    title: job.title,
    status: job.status,
    priority: job.priority,
    targetDeadline: job.targetCompletionDate || 'Tidak Ditentukan',
    issuer: {
      organizationName: issuer.organizationName,
      brandName: issuer.brandName || 'Holding',
    },
    executor,
    assignment: assignment
      ? {
          id: assignment.id,
          status: assignment.status,
          isHistorical,
          assignedCostFormatted: formattedCost,
          assignedCostRaw: rawCost,
          assignedAt: assignment.assignedAt,
          acceptedAt: assignment.acceptedAt ?? null,
          notes: assignment.notes ?? null,
        }
      : null,
    items,
    totalQuantity,
    instructions,
    fileReferences,
    issuedAt: formattedIssuedAt,
    notice,
  };
}

/**
 * Formats a clean, structured text message for WhatsApp/messaging to vendor or shop-floor.
 * Eliminates "Rizky memory + WhatsApp hallucination" (Section 69).
 */
export function workOrderVendorMessage(doc: WorkOrderDocument): string {
  const lines: string[] = [
    `*${doc.notice.startsWith('DOKUMEN HISTORIS') ? 'ARSIP SPK' : 'SURAT PERINTAH KERJA (SPK)'}*`,
    `No. SPK: *${doc.spkNumber}*`,
    `No. Pesanan: ${doc.orderNumber}`,
    `Job Produksi: ${doc.jobNumber} · ${doc.title} (${doc.jobType})`,
    `Prioritas: ${doc.priority}`,
    `Penerbit: ${doc.issuer.organizationName}${doc.issuer.brandName ? ` (${doc.issuer.brandName})` : ''}`,
    '',
    `*Penerima Tugas:*`,
    `Pelaksana: *${doc.executor.name}*${doc.executor.code ? ` [${doc.executor.code}]` : ''}`,
    doc.executor.phone ? `Kontak: ${doc.executor.phone}` : '',
    doc.assignment ? `Status Penugasan: *${doc.assignment.status}*` : '',
    doc.assignment ? `Biaya Komitmen Pengerjaan: *${doc.assignment.assignedCostFormatted}*` : '',
    `Tenggat Penyelesaian: *${doc.targetDeadline}*`,
    '',
    `*Rincian Item Pengerjaan (Total: ${doc.totalQuantity} pcs):*`,
  ].filter(Boolean);

  doc.items.forEach((item, idx) => {
    lines.push(`${idx + 1}. *${item.description}* — ${item.quantity} ${item.unit}`);
    if (item.specifications.length > 0) {
      item.specifications.forEach((spec) => lines.push(`   • ${spec}`));
    }
    if (item.notes) {
      lines.push(`   • Catatan Item: ${item.notes}`);
    }
  });

  if (doc.instructions.length > 0) {
    lines.push('', '*Instruksi Khusus:*');
    doc.instructions.forEach((ins) => lines.push(`- ${ins}`));
  }

  if (doc.fileReferences.length > 0) {
    lines.push('', '*Lampiran & Referensi Artwork:*');
    doc.fileReferences.forEach((f) => {
      lines.push(`- ${f.name}${f.url ? `: ${f.url}` : ''}`);
    });
  }

  lines.push(
    '',
    `Diterbitkan pada: ${doc.issuedAt}`,
    'Mohon konfirmasi penerimaan pekerjaan dan patuhi toleransi spesifikasi QC. Terima kasih!',
  );

  return lines.join('\n');
}
