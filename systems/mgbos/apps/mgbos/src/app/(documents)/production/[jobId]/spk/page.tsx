import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  loadWorkOrder,
  DocumentAccessError,
} from '@/lib/workOrder/load.server';
import { workOrderVendorMessage, type WorkOrderDocument } from '@mgbos/domain';
import { WorkOrderActions } from './WorkOrderActions';
import './spk.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Surat Perintah Kerja (SPK) — MGBOS',
  robots: { index: false, follow: false },
};

export default async function WorkOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ assignmentId?: string }>;
}) {
  const { jobId } = await params;
  const { assignmentId } = await searchParams;

  let doc: WorkOrderDocument;
  try {
    doc = await loadWorkOrder(jobId, assignmentId);
  } catch (error) {
    if (error instanceof DocumentAccessError) {
      if (error.status === 401) redirect('/login');
      if (error.status === 404) notFound();
    }
    return (
      <main className="spk-sheet">
        <h1>Dokumen SPK Belum Tersedia</h1>
        <p>
          {error instanceof Error
            ? error.message
            : 'Terjadi kendala saat memuat dokumen.'}
        </p>
        <Link href={`/production/${jobId}`}>
          Kembali ke Detail Job Produksi
        </Link>
      </main>
    );
  }

  const isHistorical = doc.assignment?.isHistorical ?? false;
  const isUnassigned = doc.executor.type === 'UNASSIGNED';

  let noticeClass = 'active';
  if (isUnassigned) noticeClass = 'unassigned';
  else if (isHistorical) noticeClass = 'historical';

  return (
    <main className="spk-sheet">
      <nav className="spk-nav no-print">
        <Link href={`/production/${jobId}`}>
          &larr; Kembali ke Detail Job Produksi
        </Link>
        {isHistorical && (
          <Link href={`/production/${jobId}/spk`}>
            📄 Lihat SPK Penugasan Terkini
          </Link>
        )}
      </nav>

      <WorkOrderActions
        message={workOrderVendorMessage(doc)}
        spkNumber={doc.spkNumber}
      />

      <div className={`spk-notice ${noticeClass}`}>{doc.notice}</div>

      <header className="spk-header">
        <div className="spk-header-top">
          <div>
            <h1>SURAT PERINTAH KERJA (SPK)</h1>
            <div className="issuer-brand">
              {doc.issuer.organizationName}
              {doc.issuer.brandName ? ` · ${doc.issuer.brandName}` : ''}
            </div>
          </div>
          <div className="spk-meta-box">
            <span className="spk-badge">{doc.spkNumber}</span>
            <div className="spk-date">Diterbitkan: {doc.issuedAt}</div>
          </div>
        </div>

        <div className="spk-parties-grid">
          <div className="spk-party">
            <h3>Pemberi Perintah Kerja</h3>
            <div className="party-name">{doc.issuer.organizationName}</div>
            <p>Unit Brand: {doc.issuer.brandName}</p>
            <p>
              No. Kontrak Pesanan: <strong>{doc.orderNumber}</strong>
            </p>
            <p>
              ID Job Produksi: <strong>{doc.jobNumber}</strong>
            </p>
          </div>

          <div className="spk-party">
            <h3>Penerima Tugas / Pelaksana</h3>
            <div className="party-name">{doc.executor.name}</div>
            {doc.executor.code && <p>Kode Mitra: {doc.executor.code}</p>}
            {doc.executor.category && <p>Kategori: {doc.executor.category}</p>}
            {doc.executor.contactPerson && (
              <p>Kontak PIC: {doc.executor.contactPerson}</p>
            )}
            {doc.executor.phone && <p>Telepon: {doc.executor.phone}</p>}
            {doc.executor.address && <p>Alamat: {doc.executor.address}</p>}
            {doc.assignment && (
              <p>
                Status Penugasan:{' '}
                <strong style={{ color: isHistorical ? '#92400e' : '#059669' }}>
                  {doc.assignment.status}
                </strong>
              </p>
            )}
          </div>
        </div>
      </header>

      <section className="spk-job-banner">
        <div>
          <h2>
            {doc.jobNumber} — {doc.title}
          </h2>
          <p className="job-sub">
            Kategori: <strong>{doc.jobType}</strong> · Prioritas:{' '}
            <strong>{doc.priority}</strong> · Status Job:{' '}
            <strong>{doc.status}</strong>
          </p>
        </div>
        <div className="deadline-box">
          <div className="deadline-label">Tenggat Waktu Selesai</div>
          <div className="deadline-value">{doc.targetDeadline}</div>
        </div>
      </section>

      <section>
        <h2>Rincian Item Produksi</h2>
        <table className="spk-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No.</th>
              <th>Deskripsi Item &amp; Spesifikasi Teknis</th>
              <th className="qty-col" style={{ width: '120px' }}>
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}.</td>
                <td>
                  <strong>{item.description}</strong>
                  {item.specifications.length > 0 && (
                    <ul className="spk-specs-list">
                      {item.specifications.map((spec, sIdx) => (
                        <li key={sIdx}>{spec}</li>
                      ))}
                    </ul>
                  )}
                  {item.notes && (
                    <p
                      style={{
                        margin: '6px 0 0',
                        fontSize: '0.8rem',
                        color: '#64748b',
                        fontStyle: 'italic',
                      }}
                    >
                      Catatan: {item.notes}
                    </p>
                  )}
                </td>
                <td className="qty-col">
                  {item.quantity} {item.unit}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={2}
                style={{ textAlign: 'right', fontWeight: 700, padding: '12px' }}
              >
                TOTAL KUANTITAS PRODUKSI:
              </td>
              <td
                className="qty-col"
                style={{ fontSize: '1rem', color: '#0284c7' }}
              >
                {doc.totalQuantity} pcs
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {doc.assignment && (
        <section className="spk-commercial-box">
          <div>
            <div className="cost-label">
              Biaya Komitmen Pengerjaan (PO/SPK Terbit):
            </div>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '2px',
              }}
            >
              🔒 Biaya komitmen disepakati per-SPK dan menjadi dasar verifikasi
              faktur vendor.
            </div>
          </div>
          <div className="cost-value">
            {doc.assignment.assignedCostFormatted}
          </div>
        </section>
      )}

      {doc.instructions.length > 0 && (
        <section className="spk-instructions-box">
          <h3>Instruksi Teknis &amp; Catatan Khusus Pengerjaan</h3>
          <ul>
            {doc.instructions.map((ins, i) => (
              <li key={i}>{ins}</li>
            ))}
          </ul>
        </section>
      )}

      {doc.fileReferences.length > 0 && (
        <section
          style={{
            marginBottom: '24px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '14px 18px',
          }}
        >
          <h3
            style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#334155' }}
          >
            Referensi File &amp; Lampiran Artwork
          </h3>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem' }}>
            {doc.fileReferences.map((f, i) => (
              <li key={i}>
                <strong>{f.name}</strong>
                {f.type && ` (${f.type})`}
                {f.url && (
                  <>
                    {' '}
                    —{' '}
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#0284c7' }}
                    >
                      Buka Tautan
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="spk-sign-off-grid">
        <div className="spk-sign-box">
          <div className="sign-role">Pemberi Perintah Kerja</div>
          <div className="sign-name">( {doc.issuer.organizationName} )</div>
          <div className="sign-date">Tanggal: _______________</div>
        </div>

        <div className="spk-sign-box">
          <div className="sign-role">Penerima Tugas / Pelaksana</div>
          <div className="sign-name">( {doc.executor.name} )</div>
          <div className="sign-date">Tanggal: _______________</div>
        </div>

        <div className="spk-sign-box">
          <div className="sign-role">Pemeriksa Mutu (QC)</div>
          <div className="sign-name">( Tim Quality Control )</div>
          <div className="sign-date">Tanggal: _______________</div>
        </div>
      </section>

      <footer className="spk-footer">
        <div>
          MGBOS Phase 1 Governed Work Order · Dokumen sah instruksi lantai
          produksi.
        </div>
        <div>Halaman 1 dari 1</div>
      </footer>
    </main>
  );
}
