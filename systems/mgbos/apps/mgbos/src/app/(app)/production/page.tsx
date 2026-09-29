import Link from 'next/link';
import { productionContext, readRows, ProductionJobRow, rupiah } from './data';

interface ProductionJobWithOrder extends ProductionJobRow {
  orders?: {
    id: string;
    order_number: string;
  } | null;
}

export default async function ProductionJobsPage() {
  const ctx = await productionContext();

  const brand = (
    await readRows<{ id: string }>(
      'brands?organization_id=eq.' +
        ctx.session.organization.id +
        '&code=eq.' +
        encodeURIComponent(ctx.session.activeBrand.code) +
        '&status=eq.ACTIVE&select=id',
      ctx,
    )
  )[0];

  const jobs = brand
    ? await readRows<ProductionJobWithOrder>(
        `production_jobs?organization_id=eq.${ctx.session.organization.id}&brand_id=eq.${brand.id}&select=*,orders(id,order_number)&order=created_at.desc&limit=100`,
        ctx,
      )
    : [];

  const inProductionCount = jobs.filter(
    (j) => j.status === 'IN_PRODUCTION',
  ).length;
  const qcCount = jobs.filter(
    (j) => j.status === 'AWAITING_QC' || j.status === 'READY_FOR_HANDOFF',
  ).length;
  const completedCount = jobs.filter((j) => j.status === 'COMPLETED').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return '#475569';
      case 'READY':
        return '#0284c7';
      case 'ASSIGNED':
        return '#7c3aed';
      case 'ACCEPTED':
        return '#4f46e5';
      case 'IN_PRODUCTION':
        return '#ca8a04';
      case 'AWAITING_QC':
        return '#ea580c';
      case 'REWORK':
        return '#dc2626';
      case 'READY_FOR_HANDOFF':
        return '#0d9488';
      case 'COMPLETED':
        return '#16a34a';
      case 'ON_HOLD':
        return '#d97706';
      case 'CANCELLED':
        return '#991b1b';
      default:
        return '#334155';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return '#ef4444';
      case 'HIGH':
        return '#f97316';
      case 'NORMAL':
        return '#38bdf8';
      case 'LOW':
        return '#64748b';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Surat Perintah Kerja (Shop-Floor SPK)</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Penguraian kontrak pesanan ke alur
            kerja produksi (garmen, sablon, bordir, packaging).
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TOTAL SPK</div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginTop: '4px',
            }}
          >
            {jobs.length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#facc15' }}>
            DALAM PRODUKSI
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#facc15',
              marginTop: '4px',
            }}
          >
            {inProductionCount}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#fb923c' }}>
            QC &amp; SERAH TERIMA
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fb923c',
              marginTop: '4px',
            }}
          >
            {qcCount}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>
            SELESAI (COMPLETED)
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#4ade80',
              marginTop: '4px',
            }}
          >
            {completedCount}
          </div>
        </div>
      </div>

      <section className="card">
        <h2>Daftar Job Produksi Aktif</h2>

        {jobs.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Belum ada surat perintah kerja (SPK) yang dibuat.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Buka kontrak pesanan di menu{' '}
              <Link href="/orders" style={{ color: '#38bdf8' }}>
                Order Contracts
              </Link>{' '}
              dan pecah pesanan menjadi sub-job produksi (GARMENT, PRINTING,
              PACKAGING, dll).
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              className="data-table"
              style={{ width: '100%', borderCollapse: 'collapse' }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid #334155',
                    textAlign: 'left',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                  }}
                >
                  <th style={{ padding: '10px 12px' }}>NO. SPK</th>
                  <th style={{ padding: '10px 12px' }}>KONTRAK PESANAN</th>
                  <th style={{ padding: '10px 12px' }}>KATEGORI</th>
                  <th style={{ padding: '10px 12px' }}>JUDUL PEKERJAAN</th>
                  <th style={{ padding: '10px 12px' }}>PRIORITAS</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px' }}>ESTIMASI BIAYA</th>
                  <th style={{ padding: '10px 12px' }}>TARGET SELESAI</th>
                  <th style={{ padding: '10px 12px' }}>TINDAKAN</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <Link
                        href={`/production/${j.id}`}
                        style={{ color: '#38bdf8' }}
                      >
                        {j.job_number}
                      </Link>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {j.orders?.order_number ? (
                        <Link
                          href={`/orders/${j.order_id}`}
                          style={{ color: '#cbd5e1', fontSize: '0.85rem' }}
                        >
                          {j.orders.order_number}
                        </Link>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          -
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          background: '#1e293b',
                          color: '#93c5fd',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid #3b82f6',
                        }}
                      >
                        {j.job_type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        color: '#f1f5f9',
                        fontWeight: 500,
                      }}
                    >
                      {j.title}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          color: getPriorityColor(j.priority),
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}
                      >
                        {j.priority}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        className="badge"
                        style={{
                          background: getStatusColor(j.status),
                          color: '#f8fafc',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {j.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        color: '#cbd5e1',
                        fontSize: '0.9rem',
                      }}
                    >
                      <div>{rupiah(j.estimated_cost)}</div>
                      {j.committed_cost && (
                        <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                          Komitmen: {rupiah(j.committed_cost)}
                        </div>
                      )}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                      }}
                    >
                      {j.target_completion_date ?? '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Link
                        href={`/production/${j.id}`}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        Buka SPK
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
