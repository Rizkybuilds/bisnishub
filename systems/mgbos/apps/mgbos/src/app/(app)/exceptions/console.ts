import {
  EXCEPTION_TYPE_TO_RESOURCE,
  isOperationalExceptionActive,
  type OperationalExceptionResolutionType,
  type OperationalExceptionResourceType,
  type OperationalExceptionStatus,
  type OperationalExceptionType,
} from '@mgbos/domain';
import type { OperationalExceptionErrorCode } from './actions';

export interface BadgeStyle {
  label: string;
  color: string;
  bg: string;
  border: string;
}

/**
 * Returns human-readable label in Indonesian for an exception type.
 */
export function formatExceptionType(type: string): string {
  switch (type) {
    case 'production.deadline_breached':
      return 'Batas Waktu Produksi Terlewati';
    case 'vendor.commitment_problem':
      return 'Kendala Komitmen Vendor / SPK';
    case 'quality.qc_failed':
      return 'Kegagalan Inspeksi QC';
    case 'fulfillment.delivery_problem':
      return 'Kendala Pengiriman / Logistik';
    case 'financial.receivable_past_due':
      return 'Piutang Melewati Jatuh Tempo';
    case 'financial.actual_cost_missing':
      return 'Biaya Aktual Belum Tercatat';
    case 'financial.margin_exception':
      return 'Penyimpangan Margin Keuntungan';
    case 'other.operational_abnormality':
      return 'Abnormalitas Operasional Lainnya';
    default:
      return type;
  }
}

/**
 * Returns human-readable label in Indonesian for an exception category.
 */
export function formatCategoryLabel(cat: string): string {
  switch (cat) {
    case 'COMMERCIAL':
      return 'Komersial';
    case 'FINANCIAL':
      return 'Keuangan';
    case 'PRODUCTION':
      return 'Produksi';
    case 'VENDOR':
      return 'Vendor & Mitra';
    case 'QUALITY':
      return 'Kualitas / QC';
    case 'FULFILLMENT':
      return 'Fulfillment & Ekspedisi';
    case 'INVENTORY_PROCUREMENT':
      return 'Persediaan & Pengadaan';
    case 'DATA_INTEGRITY':
      return 'Integritas Data';
    case 'AUTOMATION_IMPACT':
      return 'Dampak Otomasi';
    case 'POLICY_COMPLIANCE':
      return 'Kepatuhan Kebijakan';
    case 'OTHER':
      return 'Lainnya';
    default:
      return cat;
  }
}

/**
 * Returns badge styling and label for an exception severity.
 */
export function formatSeverityBadge(severity: string): BadgeStyle {
  switch (severity) {
    case 'CRITICAL':
      return {
        label: 'KRITIS',
        color: '#f87171',
        bg: '#450a0a',
        border: '#dc2626',
      };
    case 'HIGH':
      return {
        label: 'TINGGI',
        color: '#fb923c',
        bg: '#431407',
        border: '#ea580c',
      };
    case 'MEDIUM':
      return {
        label: 'SEDANG',
        color: '#facc15',
        bg: '#422006',
        border: '#ca8a04',
      };
    case 'LOW':
      return {
        label: 'RENDAH',
        color: '#34d399',
        bg: '#064e3b',
        border: '#059669',
      };
    default:
      return {
        label: severity,
        color: '#cbd5e1',
        bg: '#1e293b',
        border: '#475569',
      };
  }
}

/**
 * Returns badge styling and label for an exception status.
 */
export function formatStatusBadge(status: string): BadgeStyle {
  switch (status) {
    case 'OPEN':
      return {
        label: 'TERBUKA (OPEN)',
        color: '#fca5a5',
        bg: '#450a0a',
        border: '#b91c1c',
      };
    case 'ACKNOWLEDGED':
      return {
        label: 'DIKETAHUI (ACK)',
        color: '#93c5fd',
        bg: '#1e1b4b',
        border: '#3b82f6',
      };
    case 'RESOLVED':
      return {
        label: 'SELESAI (RESOLVED)',
        color: '#86efac',
        bg: '#052e16',
        border: '#16a34a',
      };
    case 'DISMISSED':
      return {
        label: 'DITOLAK (DISMISSED)',
        color: '#94a3b8',
        bg: '#1e293b',
        border: '#475569',
      };
    default:
      return {
        label: status,
        color: '#cbd5e1',
        bg: '#1e293b',
        border: '#475569',
      };
  }
}

/**
 * Returns human-readable label in Indonesian for source kind.
 */
export function formatSourceKind(kind: string): string {
  switch (kind) {
    case 'HUMAN_REPORT':
      return 'Laporan Manual Operator';
    case 'RECONCILIATION':
      return 'Rekonsiliasi Operasional';
    case 'DETERMINISTIC_RULE':
      return 'Aturan Deterministik';
    case 'AUTOMATION_SIGNAL':
      return 'Sinyal Otomasi';
    case 'EXTERNAL_SIGNAL':
      return 'Sinyal Eksternal';
    default:
      return kind;
  }
}

/**
 * Returns human-readable label in Indonesian for resolution type.
 */
export function formatResolutionType(res: string): string {
  switch (res) {
    case 'REMEDIATED':
      return 'Telah Diperbaiki (Remediated)';
    case 'WORKAROUND':
      return 'Solusi Sementara (Workaround)';
    case 'SOURCE_CORRECTED':
      return 'Koreksi Sumber Data (Source Corrected)';
    case 'ACCEPTED_RISK':
      return 'Risiko Diterima Owner (Accepted Risk)';
    case 'SUPERSEDED':
      return 'Digantikan Exception Lain (Superseded)';
    default:
      return res;
  }
}

/**
 * Returns human-readable label in Indonesian for dismissal reason.
 */
export function formatDismissalReason(reason: string): string {
  switch (reason) {
    case 'FALSE_POSITIVE':
      return 'Bukan Masalah Sebenarnya (False Positive)';
    case 'DUPLICATE':
      return 'Duplikasi dari Exception Lain (Duplicate)';
    case 'NOT_APPLICABLE':
      return 'Tidak Berlaku (Not Applicable)';
    case 'OPENED_IN_ERROR':
      return 'Salah Input / Kesalahan Pembukaan (Opened in Error)';
    default:
      return reason;
  }
}

/**
 * Returns human-readable label in Indonesian for primary resource type.
 */
export function formatResourceType(res: string): string {
  switch (res) {
    case 'ORDER':
      return 'Kontrak Pesanan (Order)';
    case 'PRODUCTION_JOB':
      return 'SPK Produksi (Job)';
    case 'PRODUCTION_ASSIGNMENT':
      return 'Penugasan Produksi (Assignment)';
    case 'QC_INSPECTION':
      return 'Inspeksi QC';
    case 'SHIPMENT':
      return 'Pengiriman / Ekspedisi';
    case 'INVOICE':
      return 'Faktur / Piutang (Invoice)';
    default:
      return res;
  }
}

/**
 * Returns the default primary resource type for a given exception type based on domain mapping.
 */
export function getResourceTypeForExceptionType(
  type: string,
): OperationalExceptionResourceType | null {
  if (type === 'other.operational_abnormality') {
    return null;
  }
  return (
    EXCEPTION_TYPE_TO_RESOURCE[
      type as Exclude<OperationalExceptionType, 'other.operational_abnormality'>
    ] ?? null
  );
}

/**
 * Computes lifecycle action visibility flags based on exception state and operator role.
 * Both OWNER and ADMIN have operational exception command permissions, but only active states allow mutations.
 */
export function getAvailableActions(
  exception: { status: string },
  roleCode: string,
): {
  canAcknowledge: boolean;
  canAssign: boolean;
  canReassign: boolean;
  canChangeSeverity: boolean;
  canResolve: boolean;
  canDismiss: boolean;
  canReopen: boolean;
} {
  const isAuthorizedRole = roleCode === 'OWNER' || roleCode === 'ADMIN';
  if (!isAuthorizedRole) {
    return {
      canAcknowledge: false,
      canAssign: false,
      canReassign: false,
      canChangeSeverity: false,
      canResolve: false,
      canDismiss: false,
      canReopen: false,
    };
  }

  const isOpen = exception.status === 'OPEN';
  const isActive = isOperationalExceptionActive(
    exception.status as OperationalExceptionStatus,
  );
  const isClosed =
    exception.status === 'RESOLVED' || exception.status === 'DISMISSED';

  return {
    canAcknowledge: isOpen,
    canAssign: isActive,
    canReassign: isActive,
    canChangeSeverity: isActive,
    canResolve: isActive,
    canDismiss: isActive,
    canReopen: isClosed,
  };
}

/**
 * Invariant: ACCEPTED_RISK is strictly offered to OWNER only.
 * ADMIN role may not see or select ACCEPTED_RISK.
 */
export function getAvailableResolutionTypes(
  roleCode: string,
): OperationalExceptionResolutionType[] {
  if (roleCode === 'OWNER') {
    return [
      'REMEDIATED',
      'WORKAROUND',
      'SOURCE_CORRECTED',
      'ACCEPTED_RISK',
      'SUPERSEDED',
    ];
  }
  return ['REMEDIATED', 'WORKAROUND', 'SOURCE_CORRECTED', 'SUPERSEDED'];
}

/**
 * Maps bounded error codes into human-readable Indonesian operator messages.
 */
export function translateErrorCode(
  code: OperationalExceptionErrorCode | string | undefined,
): string {
  switch (code) {
    case 'UNAUTHORIZED':
      return 'Akses ditolak: Anda tidak memiliki wewenang untuk menjalankan aksi ini.';
    case 'NOT_FOUND':
      return 'Data exception tidak ditemukan dalam organisasi ini.';
    case 'CROSS_ORG':
      return 'Pelanggaran batas organisasi: akses lintas organisasi ditolak.';
    case 'INVALID_STATE':
      return 'Status exception tidak valid untuk transisi yang diminta.';
    case 'STALE_REVISION':
      return 'Data telah diperbarui oleh pengguna lain. Silakan muat ulang halaman untuk melihat revisi terbaru.';
    case 'IDEMPOTENCY_CONFLICT':
      return 'Konflik permintaan: aksi serupa sedang atau telah diproses dengan parameter berbeda.';
    case 'BUSINESS_DUPLICATE':
      return 'Exception serupa yang masih aktif sudah ada untuk resource ini.';
    case 'INVALID_RESOURCE':
      return 'Resource yang dipilih tidak valid atau tidak ditemukan dalam organisasi.';
    case 'VALIDATION_ERROR':
      return 'Data masukan tidak valid. Periksa kembali form isian.';
    case 'UNKNOWN_FAILURE':
    default:
      return 'Terjadi kesalahan sistem. Silakan coba kembali beberapa saat lagi.';
  }
}

/**
 * Generates a stable UUID for client request idempotency.
 */
export function generateClientRequestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback for environments where crypto.randomUUID is not available
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Formats an ISO date-time string into standard Indonesian format.
 */
export function formatTimestamp(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
