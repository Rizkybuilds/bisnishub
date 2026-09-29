import Link from 'next/link';
import { hasPermission } from '@mgbos/auth';
import { vendorContext, readRows, VendorRow } from './data';
import { VendorCreateModal } from './VendorCreateModal';

export default async function VendorsPage() {
  const ctx = await vendorContext();

  const vendors = await readRows<VendorRow>(
    `vendors?organization_id=eq.${ctx.session.organization.id}&select=*&order=created_at.desc&limit=100`,
    ctx,
  );

  const canCreate = hasPermission(ctx.session.role.code, 'vendors:create');

  const garmentCount = vendors.filter(
    (v) => v.category === 'GARMENT_SUPPLIER',
  ).length;
  const printCount = vendors.filter(
    (v) => v.category === 'PRINT_STUDIO',
  ).length;
  const packagingCount = vendors.filter(
    (v) => v.category === 'PACKAGING',
  ).length;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'GARMENT_SUPPLIER':
        return { label: 'Garmen Polos', bg: '#1e3a8a', text: '#93c5fd' };
      case 'PRINT_STUDIO':
        return { label: 'Sablon & DTF', bg: '#4c1d95', text: '#c4b5fd' };
      case 'EMBROIDERY':
        return { label: 'Bordir', bg: '#701a75', text: '#f0abfc' };
      case 'PACKAGING':
        return { label: 'Kemasan Box', bg: '#78350f', text: '#fde047' };
      case 'TRIMS_LABELS':
        return { label: 'Woven & Label', bg: '#134e4a', text: '#5eead4' };
      case 'LOGISTICS':
        return { label: 'Logistik', bg: '#064e3b', text: '#86efac' };
      default:
        return { label: category, bg: '#334155', text: '#cbd5e1' };
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
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Direktori Mitra Vendor &amp; Subkontraktor
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            Jaringan pemasok bahan baku kaos, studio sablon DTF/manual,
            packaging, dan mitra spesialis terkurasi.
          </p>
        </div>
        {canCreate && <VendorCreateModal />}
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
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            TOTAL MITRA VENDOR
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginTop: '4px',
            }}
          >
            {vendors.length}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#93c5fd' }}>
            PEMASOK GARMEN
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#93c5fd',
              marginTop: '4px',
            }}
          >
            {garmentCount}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#c4b5fd' }}>
            STUDIO CETAK &amp; SABLON
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#c4b5fd',
              marginTop: '4px',
            }}
          >
            {printCount}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#fde047' }}>
            KEMASAN &amp; LAINNYA
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fde047',
              marginTop: '4px',
            }}
          >
            {packagingCount}
          </div>
        </div>
      </div>

      <section className="card">
        <h2>Daftar Mitra Terverifikasi</h2>

        {vendors.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Belum ada mitra vendor yang terdaftar.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Gunakan tombol di atas untuk mendaftarkan mitra vendor baru dan
              menetapkan daftar tarif (rate card) layanan.
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
                  <th style={{ padding: '10px 12px' }}>KODE VENDOR</th>
                  <th style={{ padding: '10px 12px' }}>NAMA VENDOR</th>
                  <th style={{ padding: '10px 12px' }}>KATEGORI</th>
                  <th style={{ padding: '10px 12px' }}>KONTAK / PIC</th>
                  <th style={{ padding: '10px 12px' }}>LEAD TIME</th>
                  <th style={{ padding: '10px 12px' }}>TERMIN BAYAR</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px' }}>TINDAKAN</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => {
                  const badge = getCategoryBadge(v.category);
                  return (
                    <tr
                      key={v.id}
                      style={{ borderBottom: '1px solid #1e293b' }}
                    >
                      <td style={{ padding: '12px', fontWeight: 600 }}>
                        <Link
                          href={`/vendors/${v.id}`}
                          style={{ color: '#38bdf8' }}
                        >
                          {v.code}
                        </Link>
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          fontWeight: 500,
                          color: '#f8fafc',
                        }}
                      >
                        <div>{v.name}</div>
                        {v.address && (
                          <div
                            style={{ fontSize: '0.75rem', color: '#64748b' }}
                          >
                            {v.address}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.text,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          color: '#cbd5e1',
                          fontSize: '0.85rem',
                        }}
                      >
                        {v.contact_person && <div>{v.contact_person}</div>}
                        {v.phone && (
                          <div style={{ color: '#38bdf8' }}>{v.phone}</div>
                        )}
                        {!v.contact_person && !v.phone && (
                          <span style={{ color: '#64748b' }}>-</span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          color: '#cbd5e1',
                          fontSize: '0.85rem',
                        }}
                      >
                        {v.lead_time_days} hari
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          color: '#facc15',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        {v.payment_terms}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          className="badge"
                          style={{
                            background:
                              v.status === 'ACTIVE' ? '#064e3b' : '#334155',
                            color: '#f8fafc',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Link
                          href={`/vendors/${v.id}`}
                          className="btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                        >
                          Detail &amp; Tarif
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
