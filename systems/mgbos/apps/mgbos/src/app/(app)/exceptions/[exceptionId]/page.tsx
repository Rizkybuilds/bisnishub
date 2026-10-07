import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAuth } from '@/lib/session.server';
import { assertPermission, hasPermission } from '@mgbos/auth';
import type { OperationalExceptionResourceType } from '@mgbos/domain';
import type { OperationalExceptionAuditRow } from '../data';
import {
  getOperationalException,
  getOperationalExceptionHistory,
  loadResourceDisplayContext,
  loadEligibleResponsiblePrincipals,
  loadExceptionCandidates,
} from '../data';
import {
  StatusBadge,
  SeverityBadge,
  ExceptionAuditTimeline,
} from '../components';
import {
  AcknowledgeModal,
  AssignModal,
  ChangeSeverityModal,
  ResolveModal,
  DismissModal,
  ReopenModal,
} from '../forms';
import {
  formatExceptionType,
  formatCategoryLabel,
  formatSourceKind,
  formatResourceType,
  formatResolutionType,
  formatDismissalReason,
  formatTimestamp,
  getAvailableActions,
} from '../console';

export default async function OperationalExceptionDetailPage({
  params,
}: {
  params: Promise<{ exceptionId: string }>;
}) {
  const { exceptionId } = await params;
  const session = await requireAuth();
  assertPermission(session, 'operational_exceptions:read');

  // Privileged read within authenticated Organization
  const exception = await getOperationalException(exceptionId);

  // Cross-org or missing exception fails closed with 404
  if (!exception) {
    notFound();
  }

  // Read audit history if permitted
  const canReadHistory = hasPermission(
    session.role.code,
    'operational_exceptions:history_read',
  );

  let auditLogs: OperationalExceptionAuditRow[] = [];
  if (canReadHistory) {
    try {
      auditLogs = await getOperationalExceptionHistory(exceptionId);
    } catch {
      auditLogs = [];
    }
  }

  // Load resource display details, principals, and candidates in parallel
  const [resourceContext, eligiblePrincipals, exceptionCandidates] =
    await Promise.all([
      loadResourceDisplayContext(
        exception.primary_resource_type as OperationalExceptionResourceType,
        exception.primary_resource_id,
      ),
      loadEligibleResponsiblePrincipals().catch(() => []),
      loadExceptionCandidates(exception.id).catch(() => []),
    ]);

  const actions = getAvailableActions(exception, session.role.code);

  const assignedPrincipal = eligiblePrincipals.find(
    (p) => p.userId === exception.responsible_user_id,
  );

  const openingEvidence =
    (exception.opening_evidence as Record<string, unknown> | null) ?? {};
  const observationText =
    (openingEvidence.observation_text as string) || exception.summary;

  const closureEvidence =
    (exception.closure_evidence as Record<string, unknown> | null) ?? {};
  const dismissalNote =
    (closureEvidence.dismissal_note as string) ||
    (closureEvidence.reason as string) ||
    (closureEvidence.note as string) ||
    null;

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1rem' }}>
        <Link
          href="/exceptions"
          style={{
            color: '#38bdf8',
            textDecoration: 'none',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          ← Kembali ke Daftar Operational Exceptions
        </Link>
      </div>

      {/* Main Header & Lifecycle Toolbar */}
      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
          padding: '1.25rem 1.5rem',
          borderLeft: '4px solid #38bdf8',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ flex: '1 1 400px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '6px',
              }}
            >
              <SeverityBadge severity={exception.severity} />
              <StatusBadge status={exception.status} />
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  background: '#1e293b',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid #334155',
                }}
              >
                Revisi #{exception.current_revision}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                ID: {exception.id}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.35rem', color: '#f8fafc' }}>
              {exception.summary}
            </h1>
            <p
              style={{
                color: '#94a3b8',
                margin: '4px 0 0',
                fontSize: '0.88rem',
              }}
            >
              {formatExceptionType(exception.exception_type)} · Kategori:{' '}
              {formatCategoryLabel(exception.exception_category)}
            </p>
          </div>

          {/* Action Toolbar */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {actions.canAcknowledge && (
              <AcknowledgeModal
                exceptionId={exception.id}
                currentRevision={exception.current_revision}
              />
            )}

            {actions.canAssign && (
              <AssignModal
                exceptionId={exception.id}
                currentRevision={exception.current_revision}
                eligiblePrincipals={eligiblePrincipals}
                isReassign={Boolean(exception.responsible_user_id)}
                currentRoleCode={exception.responsible_role_code}
                currentUserId={exception.responsible_user_id}
              />
            )}

            {actions.canChangeSeverity && (
              <ChangeSeverityModal
                exceptionId={exception.id}
                currentRevision={exception.current_revision}
                currentSeverity={exception.severity}
              />
            )}

            {actions.canResolve && (
              <ResolveModal
                exceptionId={exception.id}
                currentRevision={exception.current_revision}
                roleCode={session.role.code}
                exceptionCandidates={exceptionCandidates}
              />
            )}

            {actions.canDismiss && (
              <DismissModal
                exceptionId={exception.id}
                currentRevision={exception.current_revision}
                exceptionCandidates={exceptionCandidates}
              />
            )}

            {actions.canReopen && (
              <ReopenModal
                exceptionId={exception.id}
                currentRevision={exception.current_revision}
              />
            )}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Main Content vs Metadata Sidebar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '1.5rem',
        }}
      >
        {/* Left Column: Details & Audit Trail */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Card: Abnormality Details */}
          <section className="card" style={{ marginBottom: 0 }}>
            <h2
              style={{
                fontSize: '1.05rem',
                color: '#f8fafc',
                marginBottom: '1rem',
              }}
            >
              Fakta &amp; Dampak Abnormalitas
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                }}
              >
                Dampak Bisnis
              </div>
              <div
                style={{
                  fontSize: '0.92rem',
                  color: '#fca5a5',
                  marginTop: '2px',
                  lineHeight: 1.5,
                }}
              >
                {exception.business_impact}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                }}
              >
                Observasi &amp; Catatan Lapangan
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#e2e8f0',
                  marginTop: '4px',
                  whiteSpace: 'pre-wrap',
                  backgroundColor: '#1e293b',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  lineHeight: 1.6,
                }}
              >
                {observationText}
              </div>
            </div>

            {exception.root_cause && (
              <div style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                  }}
                >
                  Penyebab Utama (Root Cause)
                </div>
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: '#cbd5e1',
                    marginTop: '2px',
                  }}
                >
                  {exception.root_cause}
                </div>
              </div>
            )}

            {exception.other_category_reason && (
              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                  }}
                >
                  Alasan Kategori Lainnya (OTHER)
                </div>
                <div
                  style={{
                    fontSize: '0.88rem',
                    color: '#cbd5e1',
                    marginTop: '2px',
                  }}
                >
                  {exception.other_category_reason}
                </div>
              </div>
            )}
          </section>

          {/* Card: Closure / Dismissal Info (if closed) */}
          {(exception.status === 'RESOLVED' ||
            exception.status === 'DISMISSED') && (
            <section
              className="card"
              style={{
                marginBottom: 0,
                borderLeft:
                  exception.status === 'RESOLVED'
                    ? '4px solid #16a34a'
                    : '4px solid #dc2626',
              }}
            >
              <h2
                style={{
                  fontSize: '1.05rem',
                  color: '#f8fafc',
                  marginBottom: '1rem',
                }}
              >
                {exception.status === 'RESOLVED'
                  ? 'Informasi Resolusi'
                  : 'Informasi Penolakan (Dismissal)'}
              </h2>

              {exception.resolution_type && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Tipe Resolusi
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#86efac',
                      fontWeight: 600,
                      marginTop: '2px',
                    }}
                  >
                    {formatResolutionType(exception.resolution_type)}
                  </div>
                </div>
              )}

              {exception.resolution_summary && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Ringkasan Tindakan Resolusi
                  </div>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      color: '#e2e8f0',
                      marginTop: '2px',
                    }}
                  >
                    {exception.resolution_summary}
                  </div>
                </div>
              )}

              {exception.superseded_by_exception_id && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Digantikan Oleh Exception
                  </div>
                  <Link
                    href={`/exceptions/${exception.superseded_by_exception_id}`}
                    style={{
                      fontSize: '0.85rem',
                      color: '#38bdf8',
                      textDecoration: 'none',
                    }}
                  >
                    Buka Exception Pengganti (
                    {exception.superseded_by_exception_id.substring(0, 8)}...) →
                  </Link>
                </div>
              )}

              {exception.dismissal_reason && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Alasan Penolakan
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#fca5a5',
                      fontWeight: 600,
                      marginTop: '2px',
                    }}
                  >
                    {formatDismissalReason(exception.dismissal_reason)}
                  </div>
                </div>
              )}

              {dismissalNote && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Catatan Penolakan
                  </div>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      color: '#e2e8f0',
                      marginTop: '2px',
                    }}
                  >
                    {dismissalNote}
                  </div>
                </div>
              )}

              {exception.duplicate_of_exception_id && (
                <div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                    }}
                  >
                    Duplikasi Dari Exception
                  </div>
                  <Link
                    href={`/exceptions/${exception.duplicate_of_exception_id}`}
                    style={{
                      fontSize: '0.85rem',
                      color: '#38bdf8',
                      textDecoration: 'none',
                    }}
                  >
                    Buka Exception Asli (
                    {exception.duplicate_of_exception_id.substring(0, 8)}...) →
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Card: Audit Timeline */}
          <section className="card" style={{ marginBottom: 0 }}>
            <h2
              style={{
                fontSize: '1.05rem',
                color: '#f8fafc',
                marginBottom: '1rem',
              }}
            >
              Jejak Audit Lifecycle (Audit Trail)
            </h2>
            <ExceptionAuditTimeline auditLogs={auditLogs} />
          </section>
        </div>

        {/* Right Column: Resource Context & System Metadata */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {/* Card: Primary Resource Context */}
          <section className="card" style={{ marginBottom: 0 }}>
            <h2
              style={{
                fontSize: '1.05rem',
                color: '#f8fafc',
                marginBottom: '1rem',
              }}
            >
              Resource Terkait
            </h2>

            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Tipe Resource
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#f8fafc',
                  marginTop: '2px',
                }}
              >
                {formatResourceType(exception.primary_resource_type)}
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Identitas Resource
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#38bdf8',
                  fontWeight: 600,
                  marginTop: '2px',
                }}
              >
                {resourceContext?.identifier ||
                  exception.primary_resource_id.substring(0, 12)}
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: '#64748b',
                  fontFamily: 'monospace',
                }}
              >
                UUID: {exception.primary_resource_id}
              </div>
            </div>

            {resourceContext?.details && (
              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #334155',
                }}
              >
                {Object.entries(resourceContext.details).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#94a3b8' }}>{k}:</span>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Card: Ownership & System Metadata */}
          <section className="card" style={{ marginBottom: 0 }}>
            <h2
              style={{
                fontSize: '1.05rem',
                color: '#f8fafc',
                marginBottom: '1rem',
              }}
            >
              Penanggung Jawab &amp; Sistem
            </h2>

            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Peran Bertanggung Jawab
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#38bdf8',
                  fontWeight: 700,
                  marginTop: '2px',
                }}
              >
                {exception.responsible_role_code || 'BELUM DITETAPKAN'}
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Petugas Ditugaskan
              </div>
              <div
                style={{
                  fontSize: '0.88rem',
                  color: '#f8fafc',
                  marginTop: '2px',
                }}
              >
                {assignedPrincipal
                  ? `${assignedPrincipal.name} (${assignedPrincipal.roleCode})`
                  : exception.responsible_user_id
                    ? `User ID: ${exception.responsible_user_id.substring(0, 8)}...`
                    : 'Belum ditugaskan ke personil spesifik'}
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                Sumber Deteksi
              </div>
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#cbd5e1',
                  marginTop: '2px',
                }}
              >
                {formatSourceKind(exception.source_kind)}
              </div>
            </div>

            <div
              style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Dibuka:</span>
                <span style={{ color: '#f8fafc' }}>
                  {formatTimestamp(exception.opened_at)}
                </span>
              </div>
              {exception.detected_at && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#94a3b8' }}>Terdeteksi:</span>
                  <span style={{ color: '#f8fafc' }}>
                    {formatTimestamp(exception.detected_at)}
                  </span>
                </div>
              )}
              {exception.acknowledged_at && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#94a3b8' }}>Diakui:</span>
                  <span style={{ color: '#f8fafc' }}>
                    {formatTimestamp(exception.acknowledged_at)}
                  </span>
                </div>
              )}
              {exception.closed_at && (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#94a3b8' }}>Ditutup:</span>
                  <span style={{ color: '#f8fafc' }}>
                    {formatTimestamp(exception.closed_at)}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
