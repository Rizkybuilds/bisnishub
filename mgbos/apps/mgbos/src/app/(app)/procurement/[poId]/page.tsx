import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPurchaseOrderDetail } from '../data';
import {
  PurchaseOrderStatusBadge,
  VendorBillStatusBadge,
  ReceiveGoodsReceiptModal,
  PayVendorBillModal,
} from '../components';

export const metadata = { title: 'Detail Purchase Order — MGBOS' };

function formatRupiah(amount: bigint | number | string) {
  const val = typeof amount === 'bigint' ? Number(amount) : Number(amount || 0);
  return 'Rp ' + val.toLocaleString('id-ID');
}

export default async function PurchaseOrderDetailPage({
  params,
}: {
  params: Promise<{ poId: string }>;
}) {
  const { poId } = await params;
  const detail = await getPurchaseOrderDetail(poId);

  if (!detail) {
    notFound();
  }

  const { order, items, receipts, bill } = detail;

  return (
    <div>
      {/* Breadcrumb & Navigation */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          href="/procurement"
          style={{
            fontSize: '0.875rem',
            color: '#0284c7',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: 500,
          }}
        >
          &larr; Kembali ke Daftar Pengadaan (PO)
        </Link>
      </div>

      {/* Header Card */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
                {order.po_number}
              </h1>
              <PurchaseOrderStatusBadge status={order.status} />
            </div>
            <p
              style={{
                margin: '6px 0 0',
                color: '#64748b',
                fontSize: '0.9rem',
              }}
            >
              Supplier / Vendor: <strong>{order.vendors?.name ?? '-'}</strong> (
              {order.vendors?.code ?? '-'})
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              TOTAL NILAI PO
            </div>
            <div
              style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}
            >
              {formatRupiah(order.total_amount)}
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <div
              style={{
                color: '#64748b',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Tanggal PO Diterbitkan
            </div>
            <div style={{ marginTop: '2px', fontWeight: 500 }}>
              {new Date(order.order_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>

          <div>
            <div
              style={{
                color: '#64748b',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Estimasi Pengiriman (Lead Time)
            </div>
            <div style={{ marginTop: '2px', fontWeight: 500 }}>
              {order.expected_delivery_date
                ? new Date(order.expected_delivery_date).toLocaleDateString(
                    'id-ID',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )
                : '-'}
            </div>
          </div>

          <div>
            <div
              style={{
                color: '#64748b',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Termin Pembayaran
            </div>
            <div style={{ marginTop: '2px', fontWeight: 500 }}>
              {order.payment_terms || 'COD'}
            </div>
          </div>

          <div>
            <div
              style={{
                color: '#64748b',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Ongkos Kirim Bahan
            </div>
            <div style={{ marginTop: '2px', fontWeight: 500 }}>
              {formatRupiah(order.shipping_cost)}
            </div>
          </div>
        </div>

        {order.notes && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '0.85rem',
              color: '#334155',
            }}
          >
            <strong>Catatan PO:</strong> {order.notes}
          </div>
        )}
      </div>

      {/* PO Line Items */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          marginBottom: '24px',
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
              Rincian Item Bahan Baku Yang Dipesan
            </h2>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.8rem',
                color: '#64748b',
              }}
            >
              Daftar SKU, kuota pesanan, kuantiti diterima gudang, dan aksi
              penerimaan.
            </p>
          </div>
        </div>

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
              <th style={{ padding: '12px 16px' }}>SKU / Bahan Baku</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                Dipesan
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                Diterima
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                Sisa Kuota
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                Harga Beli (HPP)
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                Subtotal
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>
                Aksi Gudang
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const remaining = Math.max(
                0,
                item.quantity_ordered - item.quantity_received,
              );
              const isFullyReceived = remaining === 0;

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>
                      {item.inventory_items?.name ?? 'Item'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      SKU: {item.inventory_items?.sku ?? '-'} · Satuan:{' '}
                      {item.inventory_items?.unit ?? 'pcs'}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {item.quantity_ordered}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: item.quantity_received > 0 ? '#15803d' : '#64748b',
                    }}
                  >
                    {item.quantity_received}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: remaining > 0 ? '#0284c7' : '#94a3b8',
                    }}
                  >
                    {remaining}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {formatRupiah(item.unit_cost)}
                  </td>
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    {formatRupiah(item.subtotal)}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    {!isFullyReceived && order.status !== 'CANCELLED' ? (
                      <ReceiveGoodsReceiptModal
                        purchaseOrderId={order.id}
                        poNumber={order.po_number}
                        poItemId={item.id}
                        itemName={item.inventory_items?.name ?? 'Bahan'}
                        sku={item.inventory_items?.sku ?? '-'}
                        remainingQuantity={remaining}
                      />
                    ) : (
                      <span
                        style={{
                          fontSize: '0.8rem',
                          color: '#15803d',
                          fontWeight: 600,
                        }}
                      >
                        Lengkap
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Two Column Layout: Goods Receipts & Vendor Bill */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Goods Receipts Section */}
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
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              Riwayat Penerimaan Gudang (Goods Receipts)
            </h2>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.8rem',
                color: '#64748b',
              }}
            >
              Bukti fisik masuk gudang, pengecekan surat jalan, dan mutasi
              otomatis ke stok bahan.
            </p>
          </div>

          {receipts.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.875rem',
              }}
            >
              Belum ada riwayat penerimaan barang untuk PO ini.
            </div>
          ) : (
            <div style={{ padding: '16px' }}>
              {receipts.map((gr) => (
                <div
                  key={gr.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '12px',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>
                      {gr.receipt_number}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {new Date(gr.received_date).toLocaleDateString('id-ID')} ·
                      Lokasi: {gr.location_code}
                    </div>
                  </div>

                  {gr.vendor_delivery_note_number && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#475569',
                        marginBottom: '8px',
                      }}
                    >
                      Surat Jalan Vendor:{' '}
                      <strong>{gr.vendor_delivery_note_number}</strong>
                    </div>
                  )}

                  <div style={{ fontSize: '0.8rem', color: '#334155' }}>
                    {gr.goods_receipt_items?.map((gri) => (
                      <div
                        key={gri.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '4px 0',
                          borderTop: '1px dashed #e2e8f0',
                        }}
                      >
                        <span>
                          {gri.inventory_items?.name ?? 'Item'} (
                          {gri.inventory_items?.sku ?? '-'})
                        </span>
                        <span>
                          <strong style={{ color: '#15803d' }}>
                            +{gri.quantity_accepted} diterima
                          </strong>
                          {gri.quantity_rejected > 0 && (
                            <span
                              style={{ color: '#b91c1c', marginLeft: '6px' }}
                            >
                              ({gri.quantity_rejected} afkir:{' '}
                              {gri.rejection_reason ?? '-'})
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  {gr.notes && (
                    <div
                      style={{
                        marginTop: '8px',
                        fontSize: '0.75rem',
                        color: '#64748b',
                        fontStyle: 'italic',
                      }}
                    >
                      Catatan: {gr.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendor Bill Section */}
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
                Tagihan Vendor (Vendor Bill)
              </h2>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '0.8rem',
                  color: '#64748b',
                }}
              >
                Hutang dagang dan kas keluar holding.
              </p>
            </div>
            {bill && <VendorBillStatusBadge status={bill.status} />}
          </div>

          {!bill ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: '0.875rem',
              }}
            >
              Tagihan vendor belum diterbitkan. Tagihan dibuat otomatis saat PO
              diterbitkan atau barang diterima.
            </div>
          ) : (
            <div style={{ padding: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    NOMOR TAGIHAN
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    {bill.bill_number}
                  </div>
                  {bill.vendor_invoice_number && (
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#475569',
                        marginTop: '2px',
                      }}
                    >
                      Faktur Supplier: {bill.vendor_invoice_number}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    JATUH TEMPO
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {bill.due_date
                      ? new Date(bill.due_date).toLocaleDateString('id-ID')
                      : '-'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.875rem',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#64748b' }}>Total Tagihan:</span>
                  <span style={{ fontWeight: 600 }}>
                    {formatRupiah(bill.total_amount)}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: '#64748b' }}>Total Terbayar:</span>
                  <span style={{ fontWeight: 600, color: '#15803d' }}>
                    {formatRupiah(bill.amount_paid)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #e2e8f0',
                    fontSize: '1rem',
                  }}
                >
                  <span style={{ fontWeight: 700 }}>Sisa Hutang:</span>
                  <span
                    style={{
                      fontWeight: 700,
                      color:
                        BigInt(bill.balance_due) > 0n ? '#b91c1c' : '#15803d',
                    }}
                  >
                    {formatRupiah(bill.balance_due)}
                  </span>
                </div>
              </div>

              {bill.status !== 'PAID' && bill.status !== 'VOID' ? (
                <div>
                  <PayVendorBillModal
                    vendorBillId={bill.id}
                    billNumber={bill.bill_number}
                    vendorName={order.vendors?.name ?? 'Vendor'}
                    balanceDue={Number(bill.balance_due)}
                  />
                </div>
              ) : (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '6px',
                    color: '#15803d',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  ✓ Tagihan ini telah LUNAS dibayar via kas holding.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
