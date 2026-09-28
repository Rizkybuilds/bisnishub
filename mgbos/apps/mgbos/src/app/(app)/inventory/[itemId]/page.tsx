import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInventoryItemDetail } from '../data';
import {
  InventoryCategoryBadge,
  StockStatusBadge,
  MutationTypeBadge,
  AdjustStockModal,
  StockOpnameModal,
} from '../components';

export const metadata = { title: 'Detail SKU Persediaan — MGBOS' };

function formatRupiah(amount: bigint | number | string) {
  const val = typeof amount === 'bigint' ? Number(amount) : Number(amount || 0);
  return 'Rp ' + val.toLocaleString('id-ID');
}

export default async function InventoryItemDetailPage({
  params,
}: {
  params: Promise<{ itemId: string }>;
}) {
  const { itemId } = await params;
  const detail = await getInventoryItemDetail(itemId);

  if (!detail) {
    notFound();
  }

  const {
    item,
    levels,
    mutations,
    reservations,
    totalOnHand,
    totalReserved,
    totalAvailable,
    totalValuation,
  } = detail;

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/inventory"
          style={{
            fontSize: '0.875rem',
            color: '#0284c7',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          &larr; Kembali ke Daftar Persediaan
        </Link>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '6px',
            }}
          >
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
              {item.sku}
            </h1>
            <InventoryCategoryBadge category={item.category} />
            <StockStatusBadge
              quantityOnHand={totalOnHand}
              quantityReserved={totalReserved}
              minStockAlert={item.min_stock_alert}
            />
          </div>
          <p style={{ margin: 0, fontSize: '1rem', color: '#475569' }}>
            {item.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <AdjustStockModal
            inventoryItemId={item.id}
            sku={item.sku}
            name={item.name}
          />
          <StockOpnameModal
            inventoryItemId={item.id}
            sku={item.sku}
            name={item.name}
            currentOnHand={totalOnHand}
          />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
            style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
          >
            FISIK ON-HAND
          </div>
          <div
            style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px' }}
          >
            {totalOnHand.toLocaleString('id-ID')}{' '}
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {item.unit}
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
            style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
          >
            TER-RESERVASI
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '4px',
              color: totalReserved > 0 ? '#0369a1' : '#64748b',
            }}
          >
            {totalReserved.toLocaleString('id-ID')}{' '}
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {item.unit}
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
            style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
          >
            TERSEDIA UNTUK ORDER
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '4px',
              color: totalAvailable > 0 ? '#15803d' : '#b91c1c',
            }}
          >
            {totalAvailable.toLocaleString('id-ID')}{' '}
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {item.unit}
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
            style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
          >
            HPP / HARGA POKOK
          </div>
          <div
            style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '4px' }}
          >
            {formatRupiah(item.cost_price)}
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
            style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}
          >
            TOTAL NILAI ASET
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '4px',
              color: '#0f172a',
            }}
          >
            {formatRupiah(totalValuation)}
          </div>
        </div>
      </div>

      {/* Multi-Location Stock Breakdown */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 700 }}>
          Alokasi Lokasi Workshop &amp; Rak (Bin)
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                color: '#64748b',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px 12px' }}>Kode Lokasi</th>
              <th style={{ padding: '8px 12px' }}>Bin / Rak</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Fisik</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                Reservasi
              </th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                Tersedia
              </th>
            </tr>
          </thead>
          <tbody>
            {levels.map((l) => (
              <tr key={l.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600 }}>
                  {l.location_code}
                </td>
                <td style={{ padding: '8px 12px', color: '#64748b' }}>
                  {l.bin_location || '-'}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                  {l.quantity_on_hand} {item.unit}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                  {l.quantity_reserved} {item.unit}
                </td>
                <td
                  style={{
                    padding: '8px 12px',
                    textAlign: 'right',
                    fontWeight: 700,
                    color:
                      l.quantity_on_hand - l.quantity_reserved > 0
                        ? '#15803d'
                        : '#b91c1c',
                  }}
                >
                  {l.quantity_on_hand - l.quantity_reserved} {item.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Active Reservations */}
      {reservations.length > 0 && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            marginBottom: '24px',
          }}
        >
          <h3
            style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 700 }}
          >
            Antrean Reservasi Pesanan
          </h3>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#64748b',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '8px 12px' }}>Order ID</th>
                <th style={{ padding: '8px 12px' }}>Lokasi</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                  Jumlah
                </th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>
                  Status
                </th>
                <th style={{ padding: '8px 12px' }}>Waktu Reservasi</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px' }}>
                    <Link
                      href={`/orders/${r.order_id}`}
                      style={{
                        color: '#0284c7',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      {r.order_id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td style={{ padding: '8px 12px' }}>{r.location_code}</td>
                  <td
                    style={{
                      padding: '8px 12px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    {r.quantity} {item.unit}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor:
                          r.status === 'ACTIVE'
                            ? '#e0f2fe'
                            : r.status === 'CONSUMED'
                              ? '#ede9fe'
                              : '#f1f5f9',
                        color:
                          r.status === 'ACTIVE'
                            ? '#0369a1'
                            : r.status === 'CONSUMED'
                              ? '#6d28d9'
                              : '#64748b',
                      }}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>
                    {new Date(r.created_at).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Append-Only Mutation Audit Trail */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '20px',
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 700 }}>
          Buku Mutasi Fisik &amp; Log Reservasi (Append-Only Ledger)
        </h3>
        {mutations.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Belum ada catatan mutasi stok untuk SKU ini.
          </p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  color: '#64748b',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '8px 12px' }}>Waktu</th>
                <th style={{ padding: '8px 12px' }}>Tipe Mutasi</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                  Perubahan
                </th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                  Fisik Akhir
                </th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>
                  Reservasi Akhir
                </th>
                <th style={{ padding: '8px 12px' }}>Catatan / Referensi</th>
              </tr>
            </thead>
            <tbody>
              {mutations.map((m) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>
                    {new Date(m.created_at).toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <MutationTypeBadge type={m.mutation_type} />
                  </td>
                  <td
                    style={{
                      padding: '8px 12px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color:
                        m.quantity_change > 0
                          ? '#15803d'
                          : m.quantity_change < 0
                            ? '#b91c1c'
                            : '#64748b',
                    }}
                  >
                    {m.quantity_change > 0
                      ? `+${m.quantity_change}`
                      : m.quantity_change}{' '}
                    {item.unit}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    {m.quantity_on_hand_after} {item.unit}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    {m.quantity_reserved_after} {item.unit}
                  </td>
                  <td style={{ padding: '8px 12px', color: '#475569' }}>
                    {m.notes || '-'}
                    {m.reference_type && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginLeft: '6px',
                        }}
                      >
                        [{m.reference_type}]
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
