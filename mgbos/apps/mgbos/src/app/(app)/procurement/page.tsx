import Link from 'next/link';
import {
  procurementContext,
  readRows,
  listPurchaseOrders,
  VendorBillRow,
} from './data';
import {
  PurchaseOrderStatusBadge,
  VendorBillStatusBadge,
  CreatePurchaseOrderModal,
  PayVendorBillModal,
} from './components';

export const metadata = { title: 'Pengadaan & PO Vendor — MGBOS' };

function formatRupiah(amount: bigint | number | string) {
  const val = typeof amount === 'bigint' ? Number(amount) : Number(amount || 0);
  return 'Rp ' + val.toLocaleString('id-ID');
}

export default async function ProcurementPage() {
  const ctx = await procurementContext();

  const [procData, vendorRows, itemRows, billRows] = await Promise.all([
    listPurchaseOrders(),
    readRows<{ id: string; name: string; code: string }>(
      `vendors?organization_id=eq.${ctx.session.organization.id}&status=eq.ACTIVE&select=id,name,code&order=name.asc`,
      ctx,
    ),
    readRows<{
      id: string;
      sku: string;
      name: string;
      unit: string;
      cost_price: string;
    }>(
      `inventory_items?organization_id=eq.${ctx.session.organization.id}&is_active=eq.true&select=id,sku,name,unit,cost_price&order=sku.asc`,
      ctx,
    ),
    readRows<VendorBillRow>(
      `vendor_bills?organization_id=eq.${ctx.session.organization.id}&select=*,vendors(name)&order=created_at.desc&limit=50`,
      ctx,
    ),
  ]);

  const { orders, kpis } = procData;

  const vendors = vendorRows.map((v) => ({
    id: v.id,
    name: v.name,
    code: v.code,
  }));

  const inventoryItems = itemRows.map((i) => ({
    id: i.id,
    sku: i.sku,
    name: i.name,
    unit: i.unit,
    costPrice: i.cost_price,
  }));

  return (
    <div>
      {/* Header */}
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
            Pengadaan Bahan &amp; PO Vendor (Procurement)
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Purchase Order bahan baku,
            penerimaan fisik gudang (Goods Receipt), dan kas keluar tagihan
            vendor.
          </p>
        </div>
        <CreatePurchaseOrderModal
          vendors={vendors}
          inventoryItems={inventoryItems}
        />
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}
          >
            TOTAL PURCHASE ORDERS
          </div>
          <div
            style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '4px' }}
          >
            {kpis.totalOrders}{' '}
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>PO</span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}
          >
            PO AKTIF (MENUNGGU BARANG)
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginTop: '4px',
              color: kpis.activeOrders > 0 ? '#0369a1' : '#15803d',
            }}
          >
            {kpis.activeOrders}
            <span
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginLeft: '6px',
              }}
            >
              PO
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}
          >
            TOTAL BELANJA PENGADAAN
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '4px',
              color: '#0f172a',
            }}
          >
            {formatRupiah(kpis.totalAmountOrdered)}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}
          >
            SISA HUTANG TAGIHAN VENDOR
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '4px',
              color: kpis.totalBillsOutstanding > 0n ? '#b91c1c' : '#15803d',
            }}
          >
            {formatRupiah(kpis.totalBillsOutstanding)}
          </div>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
            Daftar Purchase Order (PO)
          </h2>
        </div>

        {orders.length === 0 ? (
          <div
            style={{
              padding: '48px 16px',
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
              Belum ada Purchase Order (PO) pengadaan bahan.
            </p>
            <p style={{ margin: '6px 0 16px 0', fontSize: '0.875rem' }}>
              Klik tombol &quot;+ Buat Purchase Order (PO)&quot; di atas untuk
              menerbitkan PO ke supplier kain/film.
            </p>
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  fontWeight: 600,
                }}
              >
                <th style={{ padding: '12px 16px' }}>No. PO</th>
                <th style={{ padding: '12px 16px' }}>Vendor / Supplier</th>
                <th style={{ padding: '12px 16px' }}>Tanggal PO</th>
                <th style={{ padding: '12px 16px' }}>Estimasi Tiba</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Total Nominal
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((po) => (
                <tr
                  key={po.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <Link
                      href={`/procurement/${po.id}`}
                      style={{
                        fontWeight: 700,
                        color: '#0284c7',
                        textDecoration: 'none',
                      }}
                    >
                      {po.po_number}
                    </Link>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                    {po.vendors?.name ?? '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {new Date(po.order_date).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {po.expected_delivery_date
                      ? new Date(po.expected_delivery_date).toLocaleDateString(
                          'id-ID',
                        )
                      : '-'}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    {formatRupiah(po.total_amount)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <PurchaseOrderStatusBadge status={po.status} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Link
                      href={`/procurement/${po.id}`}
                      style={{
                        padding: '5px 12px',
                        backgroundColor: '#f1f5f9',
                        color: '#0f172a',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      Lihat Rincian &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Vendor Bills Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              Tagihan Vendor (Vendor Bills &amp; Hutang Dagang)
            </h2>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.8rem',
                color: '#64748b',
              }}
            >
              Tagihan atas penerimaan barang PO yang harus dilunasi via kas
              keluar holding.
            </p>
          </div>
        </div>

        {billRows.length === 0 ? (
          <div
            style={{
              padding: '32px 16px',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.875rem',
            }}
          >
            Belum ada tagihan vendor yang tercatat.
          </div>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#475569',
                  fontWeight: 600,
                }}
              >
                <th style={{ padding: '12px 16px' }}>No. Tagihan</th>
                <th style={{ padding: '12px 16px' }}>Vendor</th>
                <th style={{ padding: '12px 16px' }}>Jatuh Tempo</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Total Tagihan
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Terbayar
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Sisa Hutang
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {billRows.map((bill) => (
                <tr key={bill.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td
                    style={{
                      padding: '12px 16px',
                      fontWeight: 700,
                      color: '#0f172a',
                    }}
                  >
                    {bill.bill_number}
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                    {bill.vendors?.name ?? '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {bill.due_date
                      ? new Date(bill.due_date).toLocaleDateString('id-ID')
                      : '-'}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    {formatRupiah(bill.total_amount)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      color: '#15803d',
                    }}
                  >
                    {formatRupiah(bill.amount_paid)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color:
                        BigInt(bill.balance_due) > 0n ? '#b91c1c' : '#15803d',
                    }}
                  >
                    {formatRupiah(bill.balance_due)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <VendorBillStatusBadge status={bill.status} />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {bill.status !== 'PAID' && bill.status !== 'VOID' ? (
                      <PayVendorBillModal
                        vendorBillId={bill.id}
                        billNumber={bill.bill_number}
                        vendorName={bill.vendors?.name ?? 'Vendor'}
                        balanceDue={Number(bill.balance_due)}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: '#15803d',
                          fontWeight: 600,
                        }}
                      >
                        LUNAS
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
