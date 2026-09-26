import Link from 'next/link';
import { inventoryContext, listInventoryItems } from './data';
import {
  InventoryCategoryBadge,
  StockStatusBadge,
  CreateInventoryItemModal,
  AdjustStockModal,
  StockOpnameModal,
} from './components';

export const metadata = { title: 'Persediaan & Stok (Inventory) — MGBOS' };

function formatRupiah(amount: bigint | number | string) {
  const val = typeof amount === 'bigint' ? Number(amount) : Number(amount || 0);
  return 'Rp ' + val.toLocaleString('id-ID');
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const currentCategory = params.category || 'ALL';

  const ctx = await inventoryContext();
  const { items, kpis } = await listInventoryItems(currentCategory);

  const categories = [
    { key: 'ALL', label: 'Semua Kategori' },
    { key: 'BLANK_GARMENT', label: 'Kaos Polos (Blanks)' },
    { key: 'PRINT_MATERIAL', label: 'Bahan Cetak (DTF)' },
    { key: 'PACKAGING', label: 'Kemasan & Plastik' },
    { key: 'FINISHED_GOOD', label: 'Barang Jadi' },
    { key: 'OTHER', label: 'Lainnya' },
  ];

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
          <h1 style={{ margin: 0 }}>Persediaan &amp; Stok Bahan (Inventory)</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Master SKU, stok multi-lokasi,
            reservasi pesanan otomatis, dan audit mutasi fisik.
          </p>
        </div>
        <CreateInventoryItemModal />
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            TOTAL SKU AKTIF
          </div>
          <div
            style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '4px' }}
          >
            {kpis.totalSkus}{' '}
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>SKU</span>
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
            STOK TERSEDIA (FREE)
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginTop: '4px',
              color: '#15803d',
            }}
          >
            {kpis.totalUnitsAvailable.toLocaleString('id-ID')}
            <span
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginLeft: '6px',
              }}
            >
              (Fisik: {kpis.totalUnitsOnHand.toLocaleString('id-ID')})
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
            STOK TER-RESERVASI
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginTop: '4px',
              color: '#0369a1',
            }}
          >
            {kpis.totalUnitsReserved.toLocaleString('id-ID')}
            <span
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginLeft: '6px',
              }}
            >
              unit
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
            NILAI ASET PERSEDIAAN
          </div>
          <div
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginTop: '4px',
              color: '#0f172a',
            }}
          >
            {formatRupiah(kpis.totalValuation)}
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
            SKU MENIPIS / PERLU RESTOCK
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginTop: '4px',
              color: kpis.lowStockSkusCount > 0 ? '#b91c1c' : '#15803d',
            }}
          >
            {kpis.lowStockSkusCount}
            <span
              style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginLeft: '6px',
              }}
            >
              SKU
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '16px',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        {categories.map((c) => {
          const isActive = currentCategory === c.key;
          return (
            <Link
              key={c.key}
              href={`/inventory${c.key === 'ALL' ? '' : `?category=${c.key}`}`}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                backgroundColor: isActive ? '#0f172a' : '#f8fafc',
                color: isActive ? '#ffffff' : '#475569',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                border: '1px solid',
                borderColor: isActive ? '#0f172a' : '#e2e8f0',
              }}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              padding: '48px 16px',
              textAlign: 'center',
              color: '#64748b',
            }}
          >
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>
              Belum ada data SKU pada kategori ini.
            </p>
            <p style={{ margin: '6px 0 16px 0', fontSize: '0.875rem' }}>
              Klik tombol &quot;+ Tambah SKU Baru&quot; di atas untuk
              mendaftarkan bahan baku kaos polos atau print.
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
                <th style={{ padding: '12px 16px' }}>SKU &amp; Nama Barang</th>
                <th style={{ padding: '12px 16px' }}>Kategori</th>
                <th style={{ padding: '12px 16px' }}>Lokasi / Bin</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Fisik
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Reservasi
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Tersedia
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  HPP Satuan
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                  Nilai Aset
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
              {items.map((item) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <Link
                      href={`/inventory/${item.id}`}
                      style={{
                        fontWeight: 700,
                        color: '#0284c7',
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      {item.sku}
                    </Link>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {item.name}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <InventoryCategoryBadge category={item.category} />
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {item.levels.map((l) => (
                      <div key={l.id}>
                        {l.location_code}{' '}
                        {l.bin_location ? `(${l.bin_location})` : ''}
                      </div>
                    ))}
                    {item.levels.length === 0 && '-'}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    {item.totalOnHand.toLocaleString('id-ID')} {item.unit}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      color: item.totalReserved > 0 ? '#0369a1' : '#64748b',
                      fontWeight: item.totalReserved > 0 ? 600 : 400,
                    }}
                  >
                    {item.totalReserved.toLocaleString('id-ID')} {item.unit}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 700,
                      color: item.totalAvailable > 0 ? '#15803d' : '#b91c1c',
                    }}
                  >
                    {item.totalAvailable.toLocaleString('id-ID')} {item.unit}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {formatRupiah(item.cost_price)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    {formatRupiah(item.totalValuation)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <StockStatusBadge
                      quantityOnHand={item.totalOnHand}
                      quantityReserved={item.totalReserved}
                      minStockAlert={item.min_stock_alert}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        gap: '6px',
                        alignItems: 'center',
                      }}
                    >
                      <AdjustStockModal
                        inventoryItemId={item.id}
                        sku={item.sku}
                        name={item.name}
                      />
                      <StockOpnameModal
                        inventoryItemId={item.id}
                        sku={item.sku}
                        name={item.name}
                        currentOnHand={item.totalOnHand}
                      />
                    </div>
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
