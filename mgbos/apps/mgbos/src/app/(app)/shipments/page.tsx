import Link from 'next/link';
import { shipmentContext, readRows, ShipmentRow } from './data';
import { ShipmentStatusBadge } from './components';
import { COURIER_LABELS, CourierName } from '@mgbos/domain';

interface ShipmentWithOrder extends ShipmentRow {
  orders?: {
    id: string;
    order_number: string;
  } | null;
}

export default async function ShipmentsPage() {
  const ctx = await shipmentContext();

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

  const shipments = brand
    ? await readRows<ShipmentWithOrder>(
        `shipments?organization_id=eq.${ctx.session.organization.id}&brand_id=eq.${brand.id}&select=*,orders(id,order_number)&order=created_at.desc&limit=100`,
        ctx,
      )
    : [];

  const totalShipments = shipments.length;
  const readyToDispatch = shipments.filter(
    (s) => s.status === 'READY_TO_DISPATCH' || s.status === 'DRAFT',
  ).length;
  const inTransit = shipments.filter(
    (s) => s.status === 'DISPATCHED' || s.status === 'IN_TRANSIT',
  ).length;
  const delivered = shipments.filter((s) => s.status === 'DELIVERED').length;

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
          <h1 style={{ margin: 0 }}>
            Pengiriman &amp; Logistik (Delivery Orders)
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Pengelolaan Surat Jalan (DO), serah
            terima kurir ekspedisi, pelacakan nomor resi, dan cetak label
            thermal A6.
          </p>
        </div>
        <div>
          <Link
            href="/orders"
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            📋 Buka Daftar Pesanan untuk Kirim
          </Link>
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
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            TOTAL SURAT JALAN
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, margin: '4px 0' }}>
            {totalShipments}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Dokumen terdaftar
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
            SIAP DISERAHKAN (READY)
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '4px 0',
              color: '#38bdf8',
            }}
          >
            {readyToDispatch}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Menunggu kurir pickup
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
            DALAM PERJALANAN
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '4px 0',
              color: '#fbbf24',
            }}
          >
            {inTransit}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Sedang diantar kurir
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>
            SELESAI / DELIVERED
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: '4px 0',
              color: '#4ade80',
            }}
          >
            {delivered}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Diterima pelanggan (Locked)
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0' }}>
          Daftar Surat Jalan &amp; Pengiriman
        </h2>

        {shipments.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#64748b',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
            <p style={{ margin: 0, fontWeight: 500 }}>
              Belum ada pengiriman dibuat.
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>
              Buka pesanan yang berstatus <code>CONFIRMED</code> atau dalam
              produksi untuk menerbitkan Surat Jalan (DO).
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              className="table"
              style={{ width: '100%', fontSize: '0.875rem' }}
            >
              <thead>
                <tr>
                  <th>No. Surat Jalan (DO)</th>
                  <th>Pesanan</th>
                  <th>Kurir / Ekspedisi</th>
                  <th>No. Resi (AWB)</th>
                  <th>Penerima &amp; Kota</th>
                  <th>Koli / Berat</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => {
                  const courierLabel =
                    COURIER_LABELS[s.courier_name as CourierName] ??
                    s.courier_name;
                  const recipient = s.shipping_address_snapshot;

                  return (
                    <tr key={s.id}>
                      <td>
                        <Link
                          href={`/shipments/${s.id}`}
                          style={{
                            fontWeight: 600,
                            fontFamily: 'monospace',
                            color: '#38bdf8',
                            textDecoration: 'none',
                          }}
                        >
                          {s.shipment_number}
                        </Link>
                      </td>
                      <td>
                        {s.orders ? (
                          <Link
                            href={`/orders/${s.orders.id}`}
                            style={{
                              fontFamily: 'monospace',
                              color: '#94a3b8',
                              textDecoration: 'none',
                            }}
                          >
                            {s.orders.order_number}
                          </Link>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        <strong>{courierLabel}</strong>
                        {s.courier_service && (
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              color: '#94a3b8',
                            }}
                          >
                            {s.courier_service}
                          </span>
                        )}
                      </td>
                      <td>
                        {s.tracking_number ? (
                          <code
                            style={{
                              backgroundColor: '#1e293b',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              color: '#f8fafc',
                            }}
                          >
                            {s.tracking_number}
                          </code>
                        ) : (
                          <span
                            style={{ color: '#64748b', fontStyle: 'italic' }}
                          >
                            Belum diserahkan
                          </span>
                        )}
                      </td>
                      <td>
                        <div>{recipient.recipient_name ?? '-'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {recipient.city ?? '-'}
                        </div>
                      </td>
                      <td>
                        <div>{s.package_count} koli</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                          {s.package_weight_grams
                            ? `${s.package_weight_grams / 1000} kg`
                            : '-'}
                        </div>
                      </td>
                      <td>
                        <ShipmentStatusBadge status={s.status} />
                      </td>
                      <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                        {new Date(s.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/shipments/${s.id}`}
                          className="btn-secondary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                          }}
                        >
                          Kelola / Cetak →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
