import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasPermission } from '@mgbos/auth';
import { COURIER_LABELS, CourierName } from '@mgbos/domain';
import {
  shipmentContext,
  readRows,
  ShipmentRow,
  ShipmentItemRow,
  ShipmentAuditRow,
  rupiah,
} from '../data';
import {
  ShipmentStatusBadge,
  DispatchShipmentModal,
  MarkDeliveredModal,
  CancelShipmentModal,
  PrintableSuratJalanA4,
  PrintableThermalLabelA6,
} from '../components';

interface ShipmentDetailItem extends ShipmentItemRow {
  order_items?: {
    id: string;
    description: string;
    quantity: number;
    unit?: string;
  } | null;
}

interface ShipmentDetailData extends ShipmentRow {
  orders?: {
    id: string;
    order_number: string;
    grand_total: string;
    subtotal: string;
    shipping_total: string;
  } | null;
}

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ shipmentId: string }>;
}) {
  const { shipmentId } = await params;
  const ctx = await shipmentContext();

  const shipments = await readRows<ShipmentDetailData>(
    `shipments?organization_id=eq.${ctx.session.organization.id}&id=eq.${shipmentId}&select=*,orders(id,order_number,grand_total,subtotal,shipping_total)&limit=1`,
    ctx,
  );

  const shipment = shipments[0];
  if (!shipment) {
    notFound();
  }

  const items = await readRows<ShipmentDetailItem>(
    `shipment_items?shipment_id=eq.${shipment.id}&select=*,order_items(id,description,quantity,unit)&order=created_at.asc`,
    ctx,
  );

  const audits = await readRows<ShipmentAuditRow>(
    `shipment_audit?shipment_id=eq.${shipment.id}&select=*&order=created_at.asc`,
    ctx,
  );

  const canDispatch = hasPermission(
    ctx.session.role.code,
    'shipments:dispatch',
  );
  const canCancel = hasPermission(ctx.session.role.code, 'shipments:cancel');

  const courierLabel =
    COURIER_LABELS[shipment.courier_name as CourierName] ??
    shipment.courier_name;
  const addr = shipment.shipping_address_snapshot;

  const printableItems = items.map((it) => ({
    id: it.id,
    description: it.order_items?.description ?? 'Item Pesanan',
    quantity: it.quantity,
    notes: it.notes,
  }));

  const orderNumber = shipment.orders?.order_number ?? '-';

  return (
    <div>
      {/* Breadcrumb & Navigation */}
      <div style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
        <Link
          href="/shipments"
          style={{ color: '#94a3b8', textDecoration: 'none' }}
        >
          ← Kembali ke Daftar Surat Jalan
        </Link>
        {shipment.orders && (
          <span style={{ color: '#64748b', marginLeft: '12px' }}>
            | Pesanan:{' '}
            <Link
              href={`/orders/${shipment.orders.id}`}
              style={{ color: '#38bdf8', textDecoration: 'none' }}
            >
              {shipment.orders.order_number}
            </Link>
          </span>
        )}
      </div>

      {/* Main Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid #334155',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '6px',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontFamily: 'monospace',
              }}
            >
              {shipment.shipment_number}
            </h1>
            <ShipmentStatusBadge status={shipment.status} />
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Dibuat pada{' '}
            {new Date(shipment.created_at).toLocaleDateString('id-ID', {
              dateStyle: 'full',
            })}{' '}
            · Kurir: <strong>{courierLabel}</strong>
            {shipment.courier_service && ` (${shipment.courier_service})`}
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {(shipment.status === 'DRAFT' ||
            shipment.status === 'READY_TO_DISPATCH') &&
            canDispatch && (
              <DispatchShipmentModal
                shipmentId={shipment.id}
                shipmentNumber={shipment.shipment_number}
                courierName={shipment.courier_name}
                defaultShippingCost={shipment.actual_shipping_cost}
              />
            )}

          {(shipment.status === 'DISPATCHED' ||
            shipment.status === 'IN_TRANSIT') &&
            canDispatch && (
              <MarkDeliveredModal
                shipmentId={shipment.id}
                shipmentNumber={shipment.shipment_number}
              />
            )}

          {shipment.status !== 'DELIVERED' &&
            shipment.status !== 'CANCELLED' &&
            canCancel && (
              <CancelShipmentModal
                shipmentId={shipment.id}
                shipmentNumber={shipment.shipment_number}
              />
            )}

          {shipment.status === 'DELIVERED' && (
            <div
              style={{
                padding: '6px 12px',
                backgroundColor: '#064e3b',
                color: '#6ee7b7',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              🔒 Selesai &amp; Terkunci Permanen
            </div>
          )}
        </div>
      </div>

      {/* Info Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Tujuan Pengiriman */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.95rem',
              color: '#94a3b8',
              letterSpacing: '0.5px',
            }}
          >
            TUJUAN PENGIRIMAN
          </h3>
          <div
            style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}
          >
            {addr.recipient_name ?? 'Pelanggan'}
          </div>
          <div style={{ color: '#38bdf8', marginBottom: '8px' }}>
            📞 {addr.phone ?? '-'}
          </div>
          <div
            style={{ color: '#cbd5e1', lineHeight: 1.4, fontSize: '0.9rem' }}
          >
            {addr.street ?? '-'}
            <br />
            {addr.city ? `${addr.city}, ` : ''}
            {addr.province ?? ''}
            {addr.postal_code ? ` ${addr.postal_code}` : ''}
          </div>
        </div>

        {/* Info Logistik & Resi */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.95rem',
              color: '#94a3b8',
              letterSpacing: '0.5px',
            }}
          >
            INFO LOGISTIK &amp; KURIR
          </h3>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Ekspedisi:
            </span>{' '}
            <strong>{courierLabel}</strong>
            {shipment.courier_service && ` · ${shipment.courier_service}`}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              No. Resi (AWB):
            </span>{' '}
            {shipment.tracking_number ? (
              <code
                style={{
                  backgroundColor: '#1e293b',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#38bdf8',
                }}
              >
                {shipment.tracking_number}
              </code>
            ) : (
              <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>
                Menunggu serah terima kurir
              </span>
            )}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Jumlah Koli / Berat:
            </span>{' '}
            <strong>
              {shipment.package_count} koli
              {shipment.package_weight_grams
                ? ` (${shipment.package_weight_grams / 1000} kg)`
                : ''}
            </strong>
          </div>
          {shipment.dispatch_date && (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Diserahkan pada:{' '}
              {new Date(shipment.dispatch_date).toLocaleString('id-ID')}
            </div>
          )}
          {shipment.delivered_date && (
            <div
              style={{
                fontSize: '0.85rem',
                color: '#4ade80',
                marginTop: '2px',
              }}
            >
              Diterima pada:{' '}
              {new Date(shipment.delivered_date).toLocaleString('id-ID')}
            </div>
          )}
        </div>

        {/* Finansial Pass-Through Escrow */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.95rem',
              color: '#94a3b8',
              letterSpacing: '0.5px',
            }}
          >
            BIAYA ONGKIR &amp; BUKU KAS
          </h3>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Ongkir Riil Dibayarkan:
            </span>{' '}
            <strong style={{ fontSize: '1.1rem', color: '#f8fafc' }}>
              {rupiah(shipment.actual_shipping_cost)}
            </strong>
          </div>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '0.8rem',
              color: '#94a3b8',
              lineHeight: 1.4,
            }}
          >
            🛡️ <strong>Aturan CFO (Pass-Through Escrow):</strong> Biaya kurir
            riil adalah dana titipan (zero-margin pass-through) yang otomatis
            dibukukan ke Ledger sebagai <code>COURIER_EXPENSE_DISBURSED</code>{' '}
            dan diisolasi dari laba kotor produk.
          </p>
        </div>
      </div>

      {/* Tabel Item yang Dikirim */}
      <div
        className="card"
        style={{ padding: '1.25rem', marginBottom: '1.5rem' }}
      >
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0' }}>
          Item dalam Pengiriman Ini ({items.reduce((a, b) => a + b.quantity, 0)}{' '}
          pcs)
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table
            className="table"
            style={{ width: '100%', fontSize: '0.875rem' }}
          >
            <thead>
              <tr>
                <th style={{ width: '40px' }}>No</th>
                <th>Deskripsi Item</th>
                <th style={{ width: '120px', textAlign: 'center' }}>
                  Jumlah Kirim
                </th>
                <th style={{ width: '100px', textAlign: 'center' }}>Satuan</th>
                <th>Catatan Item</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td style={{ color: '#64748b' }}>{idx + 1}</td>
                  <td>
                    <strong>
                      {it.order_items?.description ?? 'Item Pesanan'}
                    </strong>
                  </td>
                  <td
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#38bdf8',
                    }}
                  >
                    {it.quantity}
                  </td>
                  <td style={{ textAlign: 'center', color: '#94a3b8' }}>
                    {it.order_items?.unit ?? 'pcs'}
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    {it.notes ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 700, borderTop: '2px solid #334155' }}>
                <td colSpan={2} style={{ textAlign: 'right' }}>
                  Total Kuantitas:
                </td>
                <td style={{ textAlign: 'center', color: '#38bdf8' }}>
                  {items.reduce((a, b) => a + b.quantity, 0)}
                </td>
                <td style={{ textAlign: 'center' }}>pcs</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Dokumen Cetak: Surat Jalan & Label Thermal */}
      <div
        className="card"
        style={{ padding: '1.25rem', marginBottom: '1.5rem' }}
      >
        <h2 style={{ fontSize: '1.1rem', margin: '0 0 1rem 0' }}>
          Dokumen &amp; Label Pengiriman
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Printable A4 Surat Jalan */}
          <PrintableSuratJalanA4
            shipment={shipment}
            items={printableItems}
            brandName={ctx.session.activeBrand.name}
            orderNumber={orderNumber}
          />

          {/* Printable A6 Thermal Label */}
          <PrintableThermalLabelA6
            shipment={shipment}
            items={printableItems}
            brandName={ctx.session.activeBrand.name}
            orderNumber={orderNumber}
          />
        </div>
      </div>

      {/* Audit History */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1rem', margin: '0 0 0.75rem 0' }}>
          Riwayat Audit Dokumen Pengiriman
        </h3>
        {audits.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Belum ada catatan riwayat audit.
          </p>
        ) : (
          <div style={{ fontSize: '0.8rem' }}>
            {audits.map((a) => (
              <div
                key={a.id}
                style={{
                  padding: '8px 0',
                  borderBottom: '1px solid #1e293b',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontWeight: 600, color: '#38bdf8' }}>
                    {a.action}
                  </span>
                  {a.metadata && Object.keys(a.metadata).length > 0 && (
                    <span style={{ color: '#94a3b8', marginLeft: '8px' }}>
                      ({JSON.stringify(a.metadata)})
                    </span>
                  )}
                </div>
                <div style={{ color: '#64748b' }}>
                  {new Date(a.created_at).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
