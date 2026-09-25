import Link from 'next/link';
import { orderContext, readRows, OrderRow, rupiah } from './data';

export default async function OrdersPage() {
  const ctx = await orderContext();

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

  const orders = brand
    ? await readRows<OrderRow>(
        `orders?organization_id=eq.${ctx.session.organization.id}&brand_id=eq.${brand.id}&select=*&order=created_at.desc&limit=100`,
        ctx,
      )
    : [];

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
          <h1 style={{ margin: 0 }}>Kontrak Pesanan (Order Contracts)</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Komitmen komersial resmi yang
            dibekukan dari penawaran harga yang disetujui (ACCEPTED).
          </p>
        </div>
      </div>

      <section className="card">
        <h2>Daftar Pesanan Resmi</h2>

        {orders.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Belum ada kontrak pesanan yang dibekukan.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Kontrak pesanan dibuat secara otomatis atau 1-klik dari penawaran
              harga yang telah disetujui pelanggan di menu{' '}
              <Link href="/quotes" style={{ color: '#38bdf8' }}>
                Penawaran &amp; HPP
              </Link>
              .
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
                  <th style={{ padding: '10px 12px' }}>NOMOR PESANAN</th>
                  <th style={{ padding: '10px 12px' }}>PELANGGAN</th>
                  <th style={{ padding: '10px 12px' }}>KOTA PENGIRIMAN</th>
                  <th style={{ padding: '10px 12px' }}>PRODUK</th>
                  <th style={{ padding: '10px 12px' }}>ONGKIR KURIR</th>
                  <th style={{ padding: '10px 12px' }}>TOTAL KONTRAK</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px' }}>TINDAKAN</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <Link
                        href={`/orders/${o.id}`}
                        style={{ color: '#38bdf8' }}
                      >
                        {o.order_number}
                      </Link>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 500, color: '#f1f5f9' }}>
                        {o.customer_snapshot.display_name}
                      </div>
                      {o.customer_snapshot.phone && (
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {o.customer_snapshot.phone}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>
                      {o.shipping_address_snapshot.city ?? '-'}
                    </td>
                    <td style={{ padding: '12px', color: '#cbd5e1' }}>
                      {rupiah(BigInt(o.subtotal) - BigInt(o.discount_total))}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        color: '#94a3b8',
                        fontSize: '0.9rem',
                      }}
                    >
                      {rupiah(o.shipping_total)}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontWeight: 700,
                        color: '#4ade80',
                      }}
                    >
                      {rupiah(o.grand_total)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        className="badge"
                        style={{
                          background:
                            o.status === 'CONFIRMED'
                              ? '#064e3b'
                              : o.status === 'ACTIVE'
                                ? '#0284c7'
                                : o.status === 'COMPLETED'
                                  ? '#15803d'
                                  : '#334155',
                          color: '#f8fafc',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Link
                        href={`/orders/${o.id}`}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        Lihat Kontrak
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
