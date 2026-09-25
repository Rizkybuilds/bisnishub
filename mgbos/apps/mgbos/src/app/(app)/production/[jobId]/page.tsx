import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasPermission } from '@mgbos/auth';
import {
  productionContext,
  readRows,
  ProductionJobRow,
  ProductionAssignmentRow,
  ProductionJobAuditRow,
  QcInspectionRow,
  rupiah,
} from '../data';
import { JobTransitionButton } from '../JobTransitionButton';
import { JobAssignForm } from '../JobAssignForm';
import { QcInspectionModal } from '../QcInspectionModal';

interface JobItemJoined {
  id: string;
  production_job_id: string;
  order_item_id: string;
  quantity: number;
  notes: string | null;
  order_items?: {
    id: string;
    description: string;
    quantity: number;
    unit: string;
  } | null;
}

interface AssignmentJoined extends ProductionAssignmentRow {
  brands?: {
    id: string;
    code: string;
    name: string;
  } | null;
}

interface JobWithOrder extends ProductionJobRow {
  orders?: {
    id: string;
    order_number: string;
  } | null;
}

export default async function ProductionJobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const ctx = await productionContext();

  const jobs = await readRows<JobWithOrder>(
    `production_jobs?organization_id=eq.${ctx.session.organization.id}&id=eq.${jobId}&select=*,orders(id,order_number)&limit=1`,
    ctx,
  );

  const job = jobs[0];
  if (!job) {
    notFound();
  }

  const items = await readRows<JobItemJoined>(
    `production_job_items?production_job_id=eq.${job.id}&select=*,order_items(id,description,quantity,unit)`,
    ctx,
  );

  const assignments = await readRows<AssignmentJoined>(
    `production_assignments?production_job_id=eq.${job.id}&select=*,brands(id,code,name)&order=assigned_at.desc`,
    ctx,
  );

  const audits = await readRows<ProductionJobAuditRow>(
    `production_job_audit?production_job_id=eq.${job.id}&select=*&order=created_at.asc`,
    ctx,
  );

  const holdingBrands = await readRows<{
    id: string;
    code: string;
    name: string;
  }>(
    `brands?organization_id=eq.${ctx.session.organization.id}&status=eq.ACTIVE&select=id,code,name&order=code.asc`,
    ctx,
  );

  const canUpdate = hasPermission(ctx.session.role.code, 'production:update');
  const canAssign = hasPermission(ctx.session.role.code, 'production:assign');
  const canInspect = hasPermission(ctx.session.role.code, 'qc:create');

  const qcInspections = await readRows<QcInspectionRow>(
    `qc_inspections?production_job_id=eq.${job.id}&select=*&order=inspected_at.desc`,
    ctx,
  );

  const latestAssignment = assignments[0];

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

  return (
    <div>
      <div
        style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}
      >
        <Link href="/production" style={{ color: '#38bdf8' }}>
          &larr; Kembali ke Daftar Job Produksi
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <h1 style={{ margin: 0 }}>{job.job_number}</h1>
            <span
              style={{
                background: '#1e293b',
                color: '#93c5fd',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid #3b82f6',
              }}
            >
              {job.job_type}
            </span>
            <span
              className="badge"
              style={{
                background: getStatusColor(job.status),
                color: '#f8fafc',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {job.status}
            </span>
            <span
              style={{
                background: '#0f172a',
                color:
                  job.priority === 'URGENT'
                    ? '#ef4444'
                    : job.priority === 'HIGH'
                      ? '#f97316'
                      : '#38bdf8',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.8rem',
                border: '1px solid #334155',
              }}
            >
              PRIORITAS: {job.priority}
            </span>
          </div>
          <p
            style={{
              color: '#cbd5e1',
              margin: '6px 0 0',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          >
            {job.title}
          </p>
          <p
            style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.85rem' }}
          >
            Dibuat pada {new Date(job.created_at).toLocaleString('id-ID')}
            {job.target_completion_date && (
              <>
                {' '}
                · Target Selesai: <strong>{job.target_completion_date}</strong>
              </>
            )}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Left Column: Details & Shop Floor Execution */}
        <div>
          <section className="card">
            <h2>Item Pesanan Teralokasi (Allocated Items)</h2>
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
                    <th style={{ padding: '8px 10px' }}>DESKRIPSI PRODUK</th>
                    <th style={{ padding: '8px 10px' }}>QTY PESANAN INDUK</th>
                    <th style={{ padding: '8px 10px' }}>QTY JOB PRODUKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr
                      key={it.id}
                      style={{ borderBottom: '1px solid #1e293b' }}
                    >
                      <td
                        style={{
                          padding: '12px 10px',
                          fontWeight: 600,
                          color: '#f8fafc',
                        }}
                      >
                        {it.order_items?.description ?? 'Item Pesanan'}
                      </td>
                      <td style={{ padding: '12px 10px', color: '#94a3b8' }}>
                        {it.order_items?.quantity ?? '-'}{' '}
                        {it.order_items?.unit ?? 'pcs'}
                      </td>
                      <td
                        style={{
                          padding: '12px 10px',
                          fontWeight: 700,
                          color: '#38bdf8',
                        }}
                      >
                        {it.quantity} {it.order_items?.unit ?? 'pcs'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {job.notes && (
            <section className="card" style={{ marginTop: '1.5rem' }}>
              <h2>Instruksi Teknis &amp; Catatan Khusus</h2>
              <div
                style={{
                  background: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #1e293b',
                  color: '#e2e8f0',
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {job.notes}
              </div>
            </section>
          )}

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Penugasan Pelaksana (Shop-Floor Assignment)</h2>

            {latestAssignment ? (
              <div
                style={{
                  background: '#0f172a',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    PELAKSANA TERPILIH
                  </div>
                  <span
                    style={{
                      background: '#064e3b',
                      color: '#4ade80',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    STATUS: {latestAssignment.status}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                    marginTop: '6px',
                  }}
                >
                  {latestAssignment.executor_type === 'INTERNAL'
                    ? `Unit Internal: ${latestAssignment.brands?.name ?? 'Brand Holding'} (${latestAssignment.brands?.code ?? ''})`
                    : `Mitra Vendor: ${latestAssignment.vendor_name}`}
                </div>

                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '0.9rem',
                    color: '#cbd5e1',
                  }}
                >
                  Biaya Komitmen Pengerjaan:{' '}
                  <strong style={{ color: '#38bdf8' }}>
                    {rupiah(latestAssignment.assigned_cost)}
                  </strong>
                </div>

                {latestAssignment.notes && (
                  <div
                    style={{
                      marginTop: '6px',
                      fontSize: '0.85rem',
                      color: '#94a3b8',
                      fontStyle: 'italic',
                    }}
                  >
                    &ldquo;{latestAssignment.notes}&rdquo;
                  </div>
                )}

                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '0.75rem',
                    color: '#64748b',
                  }}
                >
                  Ditugaskan:{' '}
                  {new Date(latestAssignment.assigned_at).toLocaleString(
                    'id-ID',
                  )}
                  {latestAssignment.accepted_at && (
                    <>
                      {' '}
                      · Diterima:{' '}
                      {new Date(latestAssignment.accepted_at).toLocaleString(
                        'id-ID',
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  Job produksi ini belum memiliki pelaksana yang ditugaskan.
                </p>
              </div>
            )}

            {canAssign &&
              (job.status === 'READY' || job.status === 'ASSIGNED') && (
                <div style={{ marginTop: '1rem' }}>
                  <h3
                    style={{
                      fontSize: '0.95rem',
                      color: '#38bdf8',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {latestAssignment
                      ? 'Tugaskan Ulang Pelaksana'
                      : 'Tugaskan Pelaksana Sekarang'}
                  </h3>
                  <JobAssignForm
                    jobId={job.id}
                    brands={holdingBrands}
                    defaultEstimatedCost={job.estimated_cost}
                  />
                </div>
              )}

            {job.status === 'PLANNED' && (
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#f59e0b',
                  marginTop: '0.5rem',
                }}
              >
                ⚠️ SPK harus diverifikasi ke status READY terlebih dahulu
                sebelum dapat ditugaskan ke studio internal atau vendor.
              </p>
            )}
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <h2 style={{ margin: 0 }}>
                Inspeksi Mutu &amp; QC (Quality Control)
              </h2>
              {canInspect && job.status === 'AWAITING_QC' && (
                <QcInspectionModal jobId={job.id} />
              )}
            </div>

            {job.status === 'IN_PRODUCTION' && (
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                }}
              >
                🏭 SPK sedang dalam pengerjaan produksi. Ajukan ke status{' '}
                <strong style={{ color: '#ea580c' }}>AWAITING_QC</strong>{' '}
                setelah seluruh pengerjaan selesai untuk membuka formulir
                inspeksi QC.
              </div>
            )}

            {job.status === 'REWORK' && (
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid #ea580c',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  color: '#fdba74',
                }}
              >
                ⚠️ SPK sedang dalam proses perbaikan (Rework). Setelah perbaikan
                selesai dilakukan, pindahkan status ke{' '}
                <strong style={{ color: '#ea580c' }}>AWAITING_QC</strong> untuk
                menjalankan verifikasi inspeksi mutu ulang.
              </div>
            )}

            {qcInspections.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Belum ada catatan inspeksi QC digital untuk job produksi ini.
              </p>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {qcInspections.map((qc) => (
                  <div
                    key={qc.id}
                    style={{
                      background: '#0f172a',
                      padding: '1rem',
                      borderRadius: '8px',
                      border:
                        qc.result === 'PASS'
                          ? '1px solid #16a34a'
                          : qc.result === 'REWORK'
                            ? '1px solid #ea580c'
                            : '1px solid #dc2626',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>
                          {qc.inspection_number}
                        </span>
                        <span
                          className="badge"
                          style={{
                            background:
                              qc.result === 'PASS'
                                ? '#064e3b'
                                : qc.result === 'REWORK'
                                  ? '#7c2d12'
                                  : '#7f1d1d',
                            color: '#f8fafc',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          HASIL: {qc.result}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(qc.inspected_at).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: '6px',
                        fontSize: '0.85rem',
                        color: '#cbd5e1',
                      }}
                    >
                      Sample: <strong>{qc.sample_size} pcs</strong> · Defect:{' '}
                      <strong>{qc.defect_count} pcs</strong>
                      {qc.defect_category && (
                        <>
                          {' '}
                          · Cacat:{' '}
                          <span style={{ color: '#f59e0b' }}>
                            {qc.defect_category}
                          </span>{' '}
                          ({qc.defect_severity})
                        </>
                      )}
                    </div>

                    {qc.rework_instructions && (
                      <div
                        style={{
                          marginTop: '6px',
                          fontSize: '0.85rem',
                          color: '#fb923c',
                          fontStyle: 'italic',
                        }}
                      >
                        Instruksi Rework: &ldquo;{qc.rework_instructions}&rdquo;
                      </div>
                    )}

                    {qc.notes && (
                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '0.8rem',
                          color: '#94a3b8',
                        }}
                      >
                        Catatan: {qc.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Cost Trilogy, Actions & Audit */}
        <div>
          <section className="card">
            <h2>The Cost Trilogy (Isolasi Biaya)</h2>
            <dl style={{ margin: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <dt style={{ color: '#94a3b8' }}>
                  Estimasi Biaya (HPP Target)
                </dt>
                <dd style={{ margin: 0, fontWeight: 600, color: '#f8fafc' }}>
                  {rupiah(job.estimated_cost)}
                </dd>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <dt style={{ color: '#94a3b8' }}>Biaya Komitmen (PO Terbit)</dt>
                <dd style={{ margin: 0, fontWeight: 600, color: '#38bdf8' }}>
                  {rupiah(job.committed_cost)}
                </dd>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                }}
              >
                <dt style={{ color: '#94a3b8' }}>Biaya Aktual (Faktur Real)</dt>
                <dd style={{ margin: 0, fontWeight: 700, color: '#4ade80' }}>
                  {rupiah(job.actual_cost)}
                </dd>
              </div>
            </dl>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '8px',
                marginBottom: 0,
              }}
            >
              🔒 Zero-Float rupiah integer. Biaya diikat per-SPK untuk mencegah
              kebocoran margin pesanan.
            </p>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Kontrak Induk Terkait</h2>
            {job.orders ? (
              <div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  Nomor Pesanan:
                </div>
                <Link
                  href={`/orders/${job.order_id}`}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                  }}
                >
                  {job.orders.order_number} &rarr;
                </Link>
              </div>
            ) : (
              <span style={{ color: '#94a3b8' }}>ID: {job.order_id}</span>
            )}
          </section>

          {canUpdate && (
            <section className="card" style={{ marginTop: '1.5rem' }}>
              <h2>Aksi Status Produksi</h2>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {job.status === 'PLANNED' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="READY"
                      label="✅ Verifikasi & Setujui SPK (READY)"
                      variant="primary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="CANCELLED"
                      label="❌ Batalkan SPK"
                      variant="danger"
                      confirmPrompt="Yakin ingin membatalkan job produksi ini?"
                    />
                  </>
                )}

                {job.status === 'READY' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="PLANNED"
                      label="↩️ Kembalikan ke PLANNED"
                      variant="secondary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="CANCELLED"
                      label="❌ Batalkan SPK"
                      variant="danger"
                      confirmPrompt="Yakin ingin membatalkan job produksi ini?"
                    />
                  </>
                )}

                {job.status === 'ASSIGNED' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="ACCEPTED"
                      label="🤝 Konfirmasi Terima Pekerjaan (ACCEPTED)"
                      variant="primary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="READY"
                      label="↩️ Batalkan Penugasan (Kembali ke READY)"
                      variant="secondary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="CANCELLED"
                      label="❌ Batalkan SPK"
                      variant="danger"
                      confirmPrompt="Yakin ingin membatalkan job produksi ini?"
                    />
                  </>
                )}

                {job.status === 'ACCEPTED' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="IN_PRODUCTION"
                      label="🏭 Mulai Produksi (IN_PRODUCTION)"
                      variant="primary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="ON_HOLD"
                      label="⏸️ Tunda Pekerjaan (ON_HOLD)"
                      variant="secondary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="CANCELLED"
                      label="❌ Batalkan SPK"
                      variant="danger"
                      confirmPrompt="Yakin ingin membatalkan job produksi ini?"
                    />
                  </>
                )}

                {job.status === 'IN_PRODUCTION' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="AWAITING_QC"
                      label="🔍 Selesai & Ajukan QC (AWAITING_QC)"
                      variant="primary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="ON_HOLD"
                      label="⏸️ Tunda Sementara (ON_HOLD)"
                      variant="secondary"
                    />
                  </>
                )}

                {job.status === 'AWAITING_QC' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="READY_FOR_HANDOFF"
                      label="✨ Lolos QC & Siap Serah Terima"
                      variant="primary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="REWORK"
                      label="⚠️ Tolak QC & Butuh Rework"
                      variant="danger"
                      confirmPrompt="Yakin ingin meminta rework untuk job produksi ini?"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="ON_HOLD"
                      label="⏸️ Tunda Pekerjaan (ON_HOLD)"
                      variant="secondary"
                    />
                  </>
                )}

                {job.status === 'REWORK' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="AWAITING_QC"
                      label="🔍 Selesai Rework & Ajukan QC (AWAITING_QC)"
                      variant="primary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="IN_PRODUCTION"
                      label="🏭 Mulai Ulang Produksi (IN_PRODUCTION)"
                      variant="secondary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="CANCELLED"
                      label="❌ Batalkan SPK"
                      variant="danger"
                    />
                  </>
                )}

                {job.status === 'READY_FOR_HANDOFF' && (
                  <JobTransitionButton
                    jobId={job.id}
                    toStatus="COMPLETED"
                    label="🎉 Selesaikan SPK (COMPLETED)"
                    variant="primary"
                  />
                )}

                {job.status === 'ON_HOLD' && (
                  <>
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="AWAITING_QC"
                      label="🔍 Lanjutkan ke QC (AWAITING_QC)"
                      variant="primary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="IN_PRODUCTION"
                      label="▶️ Lanjutkan Produksi (IN_PRODUCTION)"
                      variant="secondary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="ACCEPTED"
                      label="↩️ Kembalikan ke ACCEPTED"
                      variant="secondary"
                    />
                    <JobTransitionButton
                      jobId={job.id}
                      toStatus="CANCELLED"
                      label="❌ Batalkan SPK"
                      variant="danger"
                    />
                  </>
                )}

                {job.status === 'COMPLETED' && (
                  <p
                    style={{ color: '#4ade80', fontSize: '0.85rem', margin: 0 }}
                  >
                    ✅ SPK telah selesai dikerjakan dan diserahterimakan.
                  </p>
                )}

                {job.status === 'CANCELLED' && (
                  <p
                    style={{ color: '#f87171', fontSize: '0.85rem', margin: 0 }}
                  >
                    ❌ SPK telah dibatalkan.
                  </p>
                )}
              </div>
            </section>
          )}

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Riwayat Audit SPK</h2>
            <ul
              style={{
                paddingLeft: '1.2rem',
                margin: 0,
                fontSize: '0.8rem',
                color: '#94a3b8',
              }}
            >
              {audits.map((a) => (
                <li key={a.id} style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>{a.action}</span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}
                  >
                    {new Date(a.created_at).toLocaleString('id-ID')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
