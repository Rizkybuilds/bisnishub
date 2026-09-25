import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasPermission } from '@mgbos/auth';
import {
  vendorContext,
  readRows,
  VendorRow,
  VendorRateCardRow,
  rupiah,
} from '../data';
import { RateCardModal } from '../RateCardModal';

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;
  const ctx = await vendorContext();

  const vendors = await readRows<VendorRow>(
    `vendors?organization_id=eq.${ctx.session.organization.id}&id=eq.${vendorId}&select=*&limit=1`,
    ctx,
  );

  const vendor = vendors[0];
  if (!vendor) {
    notFound();
  }

  const rateCards = await readRows<VendorRateCardRow>(
    `vendor_rate_cards?vendor_id=eq.${vendor.id}&select=*&order=service_code.asc`,
    ctx,
  );

  const canManage = hasPermission(ctx.session.role.code, 'vendors:update');

  return (
    <div>
      <div
        style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}
      >
        <Link href="/vendors" style={{ color: '#38bdf8' }}>
          &larr; Kembali ke Direktori Vendor
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
            <h1 style={{ margin: 0 }}>{vendor.name}</h1>
            <span
              style={{
                background: '#1e293b',
                color: '#38bdf8',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid #0284c7',
              }}
            >
              {vendor.code}
            </span>
            <span
              className="badge"
              style={{
                background: vendor.status === 'ACTIVE' ? '#064e3b' : '#334155',
                color: '#f8fafc',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {vendor.status}
            </span>
          </div>
          <p
            style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.9rem' }}
          >
            Kategori: <strong>{vendor.category}</strong> · Lead time:{' '}
            <strong>{vendor.lead_time_days} hari kerja</strong> · Termin:{' '}
            <strong>{vendor.payment_terms}</strong>
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
        {/* Left Column: Rate Cards Table */}
        <div>
          <section className="card">
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
              <h2 style={{ margin: 0 }}>Daftar Tarif Layanan (Rate Cards)</h2>
              {canManage && <RateCardModal vendorId={vendor.id} />}
            </div>

            {rateCards.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}
              >
                <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Belum ada rate card yang dikonfigurasi untuk vendor ini.
                </p>
                <p style={{ fontSize: '0.85rem' }}>
                  Tambahkan tarif layanan per meter/pcs/cm untuk mempercepat
                  kalkulasi komitmen biaya produksi SPK.
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
                      <th style={{ padding: '8px 10px' }}>KODE LAYANAN</th>
                      <th style={{ padding: '8px 10px' }}>DESKRIPSI</th>
                      <th style={{ padding: '8px 10px' }}>SATUAN</th>
                      <th style={{ padding: '8px 10px' }}>TARIF SATUAN</th>
                      <th style={{ padding: '8px 10px' }}>MOQ</th>
                      <th style={{ padding: '8px 10px' }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rateCards.map((rc) => (
                      <tr
                        key={rc.id}
                        style={{ borderBottom: '1px solid #1e293b' }}
                      >
                        <td
                          style={{
                            padding: '10px',
                            fontWeight: 600,
                            color: '#38bdf8',
                          }}
                        >
                          {rc.service_code}
                        </td>
                        <td style={{ padding: '10px', color: '#f8fafc' }}>
                          <div>{rc.description}</div>
                          {rc.notes && (
                            <div
                              style={{ fontSize: '0.75rem', color: '#64748b' }}
                            >
                              {rc.notes}
                            </div>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            color: '#94a3b8',
                            fontSize: '0.85rem',
                          }}
                        >
                          {rc.unit}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            fontWeight: 700,
                            color: '#4ade80',
                          }}
                        >
                          {rupiah(rc.unit_cost)}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            color: '#cbd5e1',
                            fontSize: '0.85rem',
                          }}
                        >
                          {rc.min_order_quantity} {rc.unit}
                        </td>
                        <td style={{ padding: '10px' }}>
                          {canManage && (
                            <RateCardModal
                              vendorId={vendor.id}
                              initialServiceCode={rc.service_code}
                              initialDescription={rc.description}
                              initialUnit={rc.unit}
                              initialUnitCost={rc.unit_cost}
                              initialMinQty={rc.min_order_quantity}
                              initialNotes={rc.notes ?? undefined}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {vendor.notes && (
            <section className="card" style={{ marginTop: '1.5rem' }}>
              <h2>Catatan &amp; Kemampuan Khusus</h2>
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
                {vendor.notes}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Contact & Commercial Profile */}
        <div>
          <section className="card">
            <h2>Profil &amp; Kontak Vendor</h2>
            <div style={{ fontSize: '0.9rem' }}>
              <div
                style={{ padding: '8px 0', borderBottom: '1px solid #1e293b' }}
              >
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  PIC / KONTAK
                </span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                  {vendor.contact_person ?? '-'}
                </span>
              </div>
              <div
                style={{ padding: '8px 0', borderBottom: '1px solid #1e293b' }}
              >
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  TELEPON / WA
                </span>
                <span style={{ color: '#38bdf8' }}>
                  {vendor.phone ? `📞 ${vendor.phone}` : '-'}
                </span>
              </div>
              <div
                style={{ padding: '8px 0', borderBottom: '1px solid #1e293b' }}
              >
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  EMAIL
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  {vendor.email ? `✉️ ${vendor.email}` : '-'}
                </span>
              </div>
              <div
                style={{ padding: '8px 0', borderBottom: '1px solid #1e293b' }}
              >
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  ALAMAT
                </span>
                <span style={{ color: '#cbd5e1' }}>
                  {vendor.address ?? '-'}
                </span>
              </div>
              <div
                style={{ padding: '8px 0', borderBottom: '1px solid #1e293b' }}
              >
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  TERMIN PEMBAYARAN
                </span>
                <span style={{ color: '#facc15', fontWeight: 700 }}>
                  {vendor.payment_terms}
                </span>
              </div>
              <div style={{ padding: '8px 0' }}>
                <span
                  style={{
                    color: '#94a3b8',
                    display: 'block',
                    fontSize: '0.75rem',
                  }}
                >
                  LEAD TIME ESTIMASI
                </span>
                <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                  {vendor.lead_time_days} Hari Kerja
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
