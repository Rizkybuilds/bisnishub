import Link from 'next/link';
import { requireAuth } from '@/lib/session.server';
import { assertPermission, hasPermission } from '@mgbos/auth';
import {
  listOperationalExceptions,
  loadResourceCandidates,
  loadEligibleResponsiblePrincipals,
} from './data';
import { StatusBadge, SeverityBadge, KpiCard } from './components';
import { ManualOpenModal } from './forms';
import {
  formatExceptionType,
  formatResourceType,
  formatTimestamp,
} from './console';

export default async function OperationalExceptionsPage() {
  const session = await requireAuth();
  assertPermission(session, 'operational_exceptions:read');

  const exceptions = await listOperationalExceptions();

  // Load candidate resources in parallel for the manual open modal
  const [
    orders,
    jobs,
    assignments,
    qcInspections,
    shipments,
    invoices,
    principals,
  ] = await Promise.all([
    loadResourceCandidates('ORDER').catch(() => []),
    loadResourceCandidates('PRODUCTION_JOB').catch(() => []),
    loadResourceCandidates('PRODUCTION_ASSIGNMENT').catch(() => []),
    loadResourceCandidates('QC_INSPECTION').catch(() => []),
    loadResourceCandidates('SHIPMENT').catch(() => []),
    loadResourceCandidates('INVOICE').catch(() => []),
    loadEligibleResponsiblePrincipals().catch(() => []),
  ]);

  const candidatesByResource = {
    ORDER: orders,
    PRODUCTION_JOB: jobs,
    PRODUCTION_ASSIGNMENT: assignments,
    QC_INSPECTION: qcInspections,
    SHIPMENT: shipments,
    INVOICE: invoices,
  };

  const totalCount = exceptions.length;
  const openCount = exceptions.filter((e) => e.status === 'OPEN').length;
  const ackCount = exceptions.filter((e) => e.status === 'ACKNOWLEDGED').length;
  const criticalCount = exceptions.filter(
    (e) =>
      e.severity === 'CRITICAL' &&
      (e.status === 'OPEN' || e.status === 'ACKNOWLEDGED'),
  ).length;
  const closedCount = exceptions.filter(
    (e) => e.status === 'RESOLVED' || e.status === 'DISMISSED',
  ).length;

  const canCreate = hasPermission(
    session.role.code,
    'operational_exceptions:open',
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#f8fafc' }}>
            Operational Exceptions (Pusat Abnormalitas)
          </h1>
          <p
            style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.9rem' }}
          >
            {session.organization.displayName} · Kendali dan resolusi
            penyimpangan operasional lintas pesanan, produksi, vendor, QC, dan
            keuangan.
          </p>
        </div>

        {canCreate && (
          <ManualOpenModal
            candidatesByResource={candidatesByResource}
            eligiblePrincipals={principals}
          />
        )}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
      >
        <KpiCard
          title="Total Exceptions"
          value={totalCount}
          subtitle="Semua catatan"
        />
        <KpiCard
          title="Terbuka (Open)"
          value={openCount}
          color="#f87171"
          subtitle="Memerlukan tindakan"
        />
        <KpiCard
          title="Diakui (Acknowledged)"
          value={ackCount}
          color="#93c5fd"
          subtitle="Dalam penanganan"
        />
        <KpiCard
          title="Aktif Kritis"
          value={criticalCount}
          color="#fb923c"
          subtitle="Prioritas tertinggi"
        />
        <KpiCard
          title="Selesai / Ditutup"
          value={closedCount}
          color="#86efac"
          subtitle="Resolved / Dismissed"
        />
      </div>

      <section className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>
            Daftar Abnormalitas Operasional
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {exceptions.length} rekaman ditemukan
          </span>
        </div>

        {exceptions.length === 0 ? (
          <div
            style={{
              padding: '3rem 1rem',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>
              Tidak ada operational exception yang tercatat
            </p>
            <p
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginTop: '4px',
              }}
            >
              Semua proses operasional berjalan normal tanpa ada abnormalitas
              aktif.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ width: '90px' }}>Keparahan</th>
                  <th style={{ width: '130px' }}>Status</th>
                  <th>Ringkasan Abnormalitas</th>
                  <th>Resource Terkait</th>
                  <th style={{ width: '120px' }}>Penanggung Jawab</th>
                  <th style={{ width: '140px' }}>Waktu Terbuka</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Rev</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {exceptions.map((ex) => (
                  <tr key={ex.id}>
                    <td>
                      <SeverityBadge severity={ex.severity} />
                    </td>
                    <td>
                      <StatusBadge status={ex.status} />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                        {ex.summary}
                      </div>
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#94a3b8',
                          marginTop: '2px',
                        }}
                      >
                        {formatExceptionType(ex.exception_type)}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                        {formatResourceType(ex.primary_resource_type)}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          fontFamily: 'monospace',
                        }}
                      >
                        ID: {ex.primary_resource_id.substring(0, 8)}...
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#38bdf8',
                          backgroundColor: '#0c4a6e',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        {ex.responsible_role_code || 'UNASSIGNED'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {formatTimestamp(ex.opened_at)}
                    </td>
                    <td
                      style={{
                        fontSize: '0.78rem',
                        color: '#94a3b8',
                        textAlign: 'center',
                      }}
                    >
                      #{ex.current_revision}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link
                        href={`/exceptions/${ex.id}`}
                        className="btn-secondary"
                        style={{
                          padding: '4px 10px',
                          fontSize: '0.78rem',
                          textDecoration: 'none',
                          display: 'inline-block',
                        }}
                      >
                        Detail →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
