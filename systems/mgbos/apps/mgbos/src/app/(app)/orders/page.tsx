import Link from 'next/link';
import { hasPermission } from '@mgbos/auth';
import {
  orderContext,
  readRows,
  OrderRow,
  rupiah,
  RetailItemOption,
} from './data';
import {
  RetailOrderCreateModal,
  CustomerOption,
} from './RetailOrderCreateModal';

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

  const canCreateOrder = hasPermission(ctx.session.role.code, 'orders:create');

  let customers: CustomerOption[] = [];
  let inventoryItems: RetailItemOption[] = [];

  if (canCreateOrder) {
    const [fetchedCustomers, rawItems, levels] = await Promise.all([
      readRows<CustomerOption>(
        `customer_accounts?organization_id=eq.${ctx.session.organization.id}&status=eq.ACTIVE&select=id,display_name,primary_phone&order=display_name.asc`,
        ctx,
      ),
      readRows<{
        id: string;
        sku: string;
        name: string;
        unit: string;
        category: string;
        cost_price: string;
        is_active: boolean;
      }>(
        `inventory_items?organization_id=eq.${ctx.session.organization.id}&is_active=eq.true&order=sku.asc`,
        ctx,
      ),
      readRows<{
        inventory_item_id: string;
        quantity_on_hand: number;
        quantity_reserved: number;
      }>(
        `inventory_levels?organization_id=eq.${ctx.session.organization.id}`,
        ctx,
      ),
    ]);

    customers = fetchedCustomers;

    const levelsByItemId = new Map<
      string,
      { onHand: number; reserved: number }
    >();
    for (const lvl of levels) {
      const current = levelsByItemId.get(lvl.inventory_item_id) ?? {
        onHand: 0,
        reserved: 0,
      };
      current.onHand += lvl.quantity_on_hand;
      current.reserved += lvl.quantity_reserved;
      levelsByItemId.set(lvl.inventory_item_id, current);
    }

    inventoryItems = rawItems.map((item) => {
      const lvl = levelsByItemId.get(item.id) ?? { onHand: 0, reserved: 0 };
      return {
        id: item.id,
        sku: item.sku,
        name: item.name,
        unit: item.unit,
        category: item.category,
        cost_price: item.cost_price,
        quantity_on_hand: lvl.onHand,
        quantity_reserved: lvl.reserved,
        quantity_available: Math.max(0, lvl.onHand - lvl.reserved),
      };
    });
  }

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
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Kontrak Pesanan (Order Contracts)</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Komitmen komersial resmi (B2B
            Kontrak &amp; Penjualan Ritel Langsung POS).
          </p>
        </div>
        {canCreateOrder && brand && (
          <RetailOrderCreateModal
            brandId={brand.id}
            customers={customers}
            inventoryItems={inventoryItems}
          />
        )}
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
              </Link>{' '}
              atau dibuat langsung melalui kasir ritel (POS).
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
                      <div style={{ marginTop: '4px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '1px 6px',
                            borderRadius: '3px',
                            background:
                              o.order_type === 'RETAIL_DIRECT'
                                ? '#042f2e'
                                : '#1e293b',
                            color:
                              o.order_type === 'RETAIL_DIRECT'
                                ? '#2dd4bf'
                                : '#94a3b8',
                            border: `1px solid ${
                              o.order_type === 'RETAIL_DIRECT'
                                ? '#0d9488'
                                : '#334155'
                            }`,
                          }}
                        >
                          {o.order_type === 'RETAIL_DIRECT'
                            ? '⚡ Ritel (POS)'
                            : '🏢 B2B Custom'}
                        </span>
                      </div>
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
