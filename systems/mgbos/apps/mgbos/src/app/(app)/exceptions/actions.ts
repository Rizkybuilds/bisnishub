'use server';

import { revalidatePath } from 'next/cache';
import { checkPermission } from '@mgbos/auth';
import {
  openOperationalExceptionSchema,
  acknowledgeOperationalExceptionSchema,
  assignOperationalExceptionSchema,
  reassignOperationalExceptionSchema,
  changeOperationalExceptionSeveritySchema,
  resolveOperationalExceptionSchema,
  dismissOperationalExceptionSchema,
  reopenOperationalExceptionSchema,
} from '@mgbos/validation';
import { exceptionsContext } from './data';

// ============================================================================
// Error Model & Structured Result Types
// ============================================================================

export type OperationalExceptionErrorCode =
  | 'UNAUTHORIZED'
  | 'NOT_FOUND'
  | 'CROSS_ORG'
  | 'INVALID_STATE'
  | 'STALE_REVISION'
  | 'IDEMPOTENCY_CONFLICT'
  | 'BUSINESS_DUPLICATE'
  | 'INVALID_RESOURCE'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_FAILURE';

export interface OperationalExceptionActionResult<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: {
    code: OperationalExceptionErrorCode;
    message: string;
  };
}

/**
 * Classifies PostgREST and PostgreSQL database errors into bounded WP02 error codes.
 * Ensures internal database connection credentials and raw SQL traces are never leaked.
 */
export function classifyDatabaseError(err: unknown): {
  code: OperationalExceptionErrorCode;
  message: string;
} {
  const rawMessage =
    typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message)
      : typeof err === 'string'
        ? err
        : '';

  const lower = rawMessage.toLowerCase();

  // 1. Authorization
  if (
    lower.includes('not authorized') ||
    lower.includes('requires owner authority') ||
    lower.includes('reserved for active owner') ||
    lower.includes('must be an active owner or admin') ||
    lower.includes('active organization membership required') ||
    lower.includes('akses ditolak')
  ) {
    return {
      code: 'UNAUTHORIZED',
      message:
        'Operasi tidak diizinkan untuk peran atau otoritas pengguna saat ini.',
    };
  }

  // 2. Cross-Org
  if (
    lower.includes('cross-organization') ||
    lower.includes('cross-org') ||
    lower.includes('does not belong to organization')
  ) {
    return {
      code: 'CROSS_ORG',
      message: 'Akses atau mutasi lintas organisasi ditolak.',
    };
  }

  // 3. Not Found
  if (
    lower.includes('not found in organization') ||
    lower.includes('exception not found')
  ) {
    return {
      code: 'NOT_FOUND',
      message: 'Operational exception tidak ditemukan dalam organisasi.',
    };
  }

  // 4. Stale Revision
  if (
    lower.includes('stale revision') ||
    lower.includes('concurrency conflict') ||
    lower.includes('expected revision')
  ) {
    return {
      code: 'STALE_REVISION',
      message:
        'Revisi data telah kedaluwarsa. Muat ulang data terbaru sebelum mencoba kembali.',
    };
  }

  // 5. Idempotency Conflict
  if (
    lower.includes('idempotency conflict') ||
    lower.includes('request_id already used')
  ) {
    return {
      code: 'IDEMPOTENCY_CONFLICT',
      message:
        'Request ID telah digunakan dengan payload atau perintah yang berbeda.',
    };
  }

  // 6. Business Duplicate
  if (
    lower.includes('active exception already exists') ||
    lower.includes('another active operational exception already exists') ||
    lower.includes('business duplicate') ||
    lower.includes('idx_operational_exceptions_active_dedup')
  ) {
    return {
      code: 'BUSINESS_DUPLICATE',
      message:
        'Pengecualian operasional aktif sudah ada untuk sumber daya dan abnormalitas ini.',
    };
  }

  // 7. Invalid State
  if (
    lower.includes('cannot acknowledge exception with status') ||
    lower.includes('cannot assign exception with status') ||
    lower.includes('cannot reassign exception with status') ||
    lower.includes('cannot change severity of exception with status') ||
    lower.includes('cannot resolve exception with status') ||
    lower.includes('cannot dismiss exception with status') ||
    lower.includes('cannot reopen exception with status') ||
    lower.includes(
      'exception already has an assigned principal; use reassign instead',
    ) ||
    lower.includes('new severity must be different from current severity') ||
    lower.includes('invalid state transition') ||
    lower.includes('must be in active status')
  ) {
    return {
      code: 'INVALID_STATE',
      message:
        'Status operational exception saat ini tidak mendukung transisi yang diminta.',
    };
  }

  // 8. Invalid Resource
  if (
    lower.includes('primary_resource') ||
    lower.includes('primary resource') ||
    lower.includes('superseding exception') ||
    lower.includes('duplicate target exception') ||
    lower.includes('cannot supersede itself') ||
    lower.includes('cannot be duplicate of itself') ||
    lower.includes('requires primary_resource_type') ||
    lower.includes('responsible principal must be an active owner or admin') ||
    lower.includes('foreign key') ||
    lower.includes('violates foreign key constraint')
  ) {
    return {
      code: 'INVALID_RESOURCE',
      message: 'Sumber daya yang dituju tidak valid atau tidak sesuai.',
    };
  }

  // 9. Validation Error (known WP01 argument constraint failures)
  if (
    lower.includes('validation error') ||
    lower.includes('is required') ||
    lower.includes('invalid severity') ||
    lower.includes('invalid source kind') ||
    lower.includes('invalid responsible role code') ||
    lower.includes('invalid resolution type') ||
    lower.includes('invalid dismissal reason') ||
    lower.includes('unknown exception type') ||
    lower.includes('exceeds maximum allowed') ||
    lower.includes('cannot be in the future')
  ) {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Parameter data yang diberikan tidak memenuhi batasan validasi.',
    };
  }

  return {
    code: 'UNKNOWN_FAILURE',
    message: 'Terjadi kesalahan sistem saat memproses operational exception.',
  };
}

// ============================================================================
// Server Actions
// ============================================================================

export async function openOperationalExceptionAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(ctx.session, 'operational_exceptions:open');
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = openOperationalExceptionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data pembukaan operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/open_operational_exception`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_type: d.exceptionType,
          p_severity: d.severity,
          p_source_kind: d.sourceKind,
          p_primary_resource_type: d.primaryResourceType,
          p_primary_resource_id: d.primaryResourceId,
          p_responsible_role_code: d.responsibleRoleCode,
          p_summary: d.summary,
          p_business_impact: d.businessImpact,
          p_observation: d.observation ?? null,
          p_responsible_user_id: d.responsibleUserId ?? null,
          p_root_cause: d.rootCause ?? null,
          p_detected_at: d.detectedAt ?? null,
          p_other_category_reason: d.otherCategoryReason ?? null,
          p_supplementary_evidence: d.supplementaryEvidence ?? {},
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    const data = resJson as Record<string, unknown>;
    revalidatePath('/exceptions');
    if (typeof data.exception_id === 'string') {
      revalidatePath(`/exceptions/${data.exception_id}`);
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}

export async function acknowledgeOperationalExceptionAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(
      ctx.session,
      'operational_exceptions:acknowledge',
    );
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = acknowledgeOperationalExceptionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data konfirmasi operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/acknowledge_operational_exception`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_id: d.exceptionId,
          p_expected_revision: d.expectedRevision,
          p_note: d.note ?? null,
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    revalidatePath('/exceptions');
    revalidatePath(`/exceptions/${d.exceptionId}`);

    return {
      success: true,
      data: resJson as Record<string, unknown>,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}

export async function assignOperationalExceptionAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(ctx.session, 'operational_exceptions:assign');
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = assignOperationalExceptionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data penugasan operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/assign_operational_exception`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_id: d.exceptionId,
          p_expected_revision: d.expectedRevision,
          p_responsible_role_code: d.responsibleRoleCode,
          p_responsible_user_id: d.responsibleUserId,
          p_reason: d.reason ?? null,
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    revalidatePath('/exceptions');
    revalidatePath(`/exceptions/${d.exceptionId}`);

    return {
      success: true,
      data: resJson as Record<string, unknown>,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}

export async function reassignOperationalExceptionAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(
      ctx.session,
      'operational_exceptions:reassign',
    );
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = reassignOperationalExceptionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data pengalihan penugasan operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/reassign_operational_exception`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_id: d.exceptionId,
          p_expected_revision: d.expectedRevision,
          p_new_responsible_role_code: d.newResponsibleRoleCode,
          p_new_responsible_user_id: d.newResponsibleUserId,
          p_reason: d.reason,
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    revalidatePath('/exceptions');
    revalidatePath(`/exceptions/${d.exceptionId}`);

    return {
      success: true,
      data: resJson as Record<string, unknown>,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}

export async function changeOperationalExceptionSeverityAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(
      ctx.session,
      'operational_exceptions:change_severity',
    );
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = changeOperationalExceptionSeveritySchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data perubahan tingkat keparahan operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/change_operational_exception_severity`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_id: d.exceptionId,
          p_expected_revision: d.expectedRevision,
          p_new_severity: d.newSeverity,
          p_reason: d.reason,
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    revalidatePath('/exceptions');
    revalidatePath(`/exceptions/${d.exceptionId}`);

    return {
      success: true,
      data: resJson as Record<string, unknown>,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}

export async function resolveOperationalExceptionAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(ctx.session, 'operational_exceptions:resolve');
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = resolveOperationalExceptionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data penyelesaian operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/resolve_operational_exception`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_id: d.exceptionId,
          p_expected_revision: d.expectedRevision,
          p_resolution_type: d.resolutionType,
          p_resolution_summary: d.resolutionSummary,
          p_superseded_by_exception_id: d.supersededByExceptionId ?? null,
          p_closure_evidence: d.closureEvidence ?? {},
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    revalidatePath('/exceptions');
    revalidatePath(`/exceptions/${d.exceptionId}`);

    return {
      success: true,
      data: resJson as Record<string, unknown>,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}

export async function dismissOperationalExceptionAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(ctx.session, 'operational_exceptions:dismiss');
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = dismissOperationalExceptionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data dismissal operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/dismiss_operational_exception`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_id: d.exceptionId,
          p_expected_revision: d.expectedRevision,
          p_dismissal_reason: d.dismissalReason,
          p_reason_summary: d.reasonSummary,
          p_duplicate_of_exception_id: d.duplicateOfExceptionId ?? null,
          p_closure_evidence: d.closureEvidence ?? {},
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    revalidatePath('/exceptions');
    revalidatePath(`/exceptions/${d.exceptionId}`);

    return {
      success: true,
      data: resJson as Record<string, unknown>,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}

export async function reopenOperationalExceptionAction(
  input: unknown,
): Promise<OperationalExceptionActionResult> {
  try {
    const ctx = await exceptionsContext();
    const perm = checkPermission(ctx.session, 'operational_exceptions:reopen');
    if (!perm.allowed) {
      return {
        success: false,
        error: { code: 'UNAUTHORIZED', message: perm.error },
      };
    }

    const parsed = reopenOperationalExceptionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            parsed.error.issues[0]?.message ??
            'Data pembukaan kembali operational exception tidak valid.',
        },
      };
    }

    const d = parsed.data;
    const response = await fetch(
      `${ctx.endpoint}/rpc/reopen_operational_exception`,
      {
        method: 'POST',
        headers: ctx.headers,
        body: JSON.stringify({
          p_organization_id: ctx.session.organization.id,
          p_actor_id: ctx.session.user.id,
          p_request_id: d.requestId,
          p_exception_id: d.exceptionId,
          p_expected_revision: d.expectedRevision,
          p_reason: d.reason,
          p_supporting_evidence: d.supportingEvidence ?? {},
        }),
      },
    );

    const resJson: unknown = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: classifyDatabaseError(resJson),
      };
    }

    revalidatePath('/exceptions');
    revalidatePath(`/exceptions/${d.exceptionId}`);

    return {
      success: true,
      data: resJson as Record<string, unknown>,
    };
  } catch (err) {
    return {
      success: false,
      error: classifyDatabaseError(err),
    };
  }
}
