'use client';

import type { OperationalExceptionAuditRow } from './data';
import {
  formatSeverityBadge,
  formatStatusBadge,
  formatTimestamp,
} from './console';

export function StatusBadge({ status }: { status: string }) {
  const style = formatStatusBadge(status);
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: style.color,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        padding: '2px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    >
      {style.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const style = formatSeverityBadge(severity);
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '0.72rem',
        fontWeight: 700,
        color: style.color,
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        padding: '2px 8px',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
      }}
    >
      {style.label}
    </span>
  );
}

export function KpiCard({
  title,
  value,
  color,
  subtitle,
}: {
  title: string;
  value: number;
  color?: string;
  subtitle?: string;
}) {
  return (
    <div
      className="card"
      style={{
        flex: '1 1 200px',
        padding: '1rem 1.25rem',
        marginBottom: 0,
        borderLeft: color ? `4px solid ${color}` : undefined,
      }}
    >
      <div
        style={{
          fontSize: '0.78rem',
          color: '#94a3b8',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          color: color || '#f8fafc',
          margin: '4px 0',
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{subtitle}</div>
      )}
    </div>
  );
}

export function ExceptionAuditTimeline({
  auditLogs,
}: {
  auditLogs: OperationalExceptionAuditRow[];
}) {
  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.88rem',
        }}
      >
        Belum ada riwayat audit tercatat.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {auditLogs.map((log, idx) => {
        const details = (log.details as Record<string, unknown> | null) ?? {};
        const resultSnapshot =
          (log.result_snapshot as Record<string, unknown> | null) ?? {};
        const revision =
          resultSnapshot.current_revision ?? details.revision ?? null;
        const reason =
          (details.reason as string) ||
          (details.note as string) ||
          (details.action_reason as string) ||
          (details.reassignment_reason as string) ||
          (details.reopening_reason as string) ||
          null;
        const payload =
          (log.request_payload as Record<string, unknown> | null) ?? {};

        return (
          <div
            key={log.id || idx}
            style={{
              display: 'flex',
              gap: '1rem',
              position: 'relative',
              paddingLeft: '1.25rem',
              borderLeft: '2px solid #334155',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '-6px',
                top: '4px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
                border: '2px solid #0f172a',
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div>
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                    }}
                  >
                    {log.action}
                  </span>
                  {revision !== null && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        marginLeft: '0.5rem',
                      }}
                    >
                      Revisi #{String(revision)}
                    </span>
                  )}
                  {log.from_status && log.to_status && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#38bdf8',
                        marginLeft: '0.5rem',
                      }}
                    >
                      ({log.from_status} → {log.to_status})
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {formatTimestamp(log.created_at)}
                </span>
              </div>

              {reason && (
                <div
                  style={{
                    margin: '6px 0',
                    fontSize: '0.84rem',
                    color: '#e2e8f0',
                    background: '#1e293b',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    borderLeft: '3px solid #38bdf8',
                  }}
                >
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>
                    Alasan / Catatan:{' '}
                  </span>
                  {reason}
                </div>
              )}

              {payload && Object.keys(payload).length > 0 && (
                <div style={{ marginTop: '4px' }}>
                  <details style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    <summary
                      style={{
                        cursor: 'pointer',
                        color: '#38bdf8',
                        userSelect: 'none',
                      }}
                    >
                      Detail Payload
                    </summary>
                    <pre
                      style={{
                        background: '#090d16',
                        padding: '8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        overflowX: 'auto',
                        color: '#cbd5e1',
                        fontSize: '0.75rem',
                      }}
                    >
                      {JSON.stringify(payload, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
