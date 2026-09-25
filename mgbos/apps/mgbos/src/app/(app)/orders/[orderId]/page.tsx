import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasPermission } from '@mgbos/auth';
import {
  orderContext,
  readRows,
  OrderRow,
  OrderItemRow,
  OrderAuditRow,
  rupiah,
} from '../data';
import { JobCreateModal } from '../../production/JobCreateModal';
import { ProductionJobRow } from '../../production/data';
import { InvoiceCreateModal } from '../../invoices/InvoiceCreateModal';
import { InvoiceRow } from '../../invoices/data';
import { OrderFinancialSummaryRow, percent } from '../../ledger/data';
import {
  MarginHealthBadge,
  RecordActualCostModal,
} from '../../ledger/components';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const ctx = await orderContext();

  const orders = await readRows<OrderRow>(
    `orders?organization_id=eq.${ctx.session.organization.id}&id=eq.${orderId}&select=*`,
    ctx,
  );

  const order = orders[0];
  if (!order) {
    notFound();
  }

  const items = await readRows<OrderItemRow>(
    `order_items?order_id=eq.${order.id}&select=*&order=position.asc`,
    ctx,
  );

  const audits = await readRows<OrderAuditRow>(
    `order_audit?order_id=eq.${order.id}&select=*&order=created_at.asc`,
    ctx,
  );

  const jobs = await readRows<ProductionJobRow>(
    `production_jobs?order_id=eq.${order.id}&select=*&order=created_at.asc`,
    ctx,
  );

  const canCreateJob = hasPermission(
    ctx.session.role.code,
    'production:create',
  );

  const canReadInvoices = hasPermission(ctx.session.role.code, 'invoices:read');

  const canCreateInvoice = hasPermission(
    ctx.session.role.code,
    'invoices:create',
  );

  const invoices = canReadInvoices
    ? await readRows<InvoiceRow>(
        `invoices?order_id=eq.${order.id}&select=*&order=created_at.asc`,
        ctx,
      )
    : [];

  const activeInvoices = invoices.filter(
    (inv) => inv.status !== 'VOID' && inv.status !== 'CANCELLED',
  );

  const totalInvoiced = activeInvoices.reduce(
    (acc, inv) => acc + BigInt(inv.amount_total),
    0n,
  );

  const remainingInvoicingQuota = BigInt(order.grand_total) - totalInvoiced;

  const canReadLedger = hasPermission(ctx.session.role.code, 'ledger:read');

  const [financialSummary] = canReadLedger
    ? await readRows<OrderFinancialSummaryRow>(
        `order_financial_summaries?order_id=eq.${order.id}&limit=1`,
        ctx,
      )
    : [];

  const canManageCost = hasPermission(
    ctx.session.role.code,
    'ledger:manage_cost',
  );

  const netProductRevenue =
    BigInt(order.subtotal) - BigInt(order.discount_total);

  return (
    <div>
      <div
        style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}
      >
        <Link href="/orders" style={{ color: '#38bdf8' }}>
          &larr; Kembali ke Daftar Kontrak Pesanan
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
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <h1 style={{ margin: 0 }}>{order.order_number}</h1>
            <span
              className="badge"
              style={{
                background:
                  order.status === 'CONFIRMED'
                    ? '#064e3b'
                    : order.status === 'ACTIVE'
                      ? '#0284c7'
                      : order.status === 'COMPLETED'
                        ? '#15803d'
                        : '#334155',
                color: '#f8fafc',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {order.status}
            </span>
          </div>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            Dikonfirmasi pada{' '}
            {new Date(order.confirmed_at).toLocaleString('id-ID')} · Kontrak
            Komersial Sah
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
        {/* Left Column: Items & Specifications */}
        <div>
          <section className="card">
            <h2>Rincian Item Manufaktur (Frozen Specification)</h2>
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
                    <th style={{ padding: '8px 10px' }}>DESKRIPSI PRODUK</th>
                    <th style={{ padding: '8px 10px' }}>QTY</th>
                    <th style={{ padding: '8px 10px' }}>HARGA SATUAN</th>
                    <th style={{ padding: '8px 10px' }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const spec = item.specification_snapshot as {
                      sizing_breakdown?: Record<string, number>;
                      custom_atelier?: {
                        sizing?: Record<string, number>;
                        fabric?: string;
                        fit?: string;
                      };
                    };
                    const sizes =
                      spec.custom_atelier?.sizing ?? spec.sizing_breakdown;

                    return (
                      <tr
                        key={item.id}
                        style={{ borderBottom: '1px solid #1e293b' }}
                      >
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ fontWeight: 600, color: '#f8fafc' }}>
                            {item.description}
                          </div>
                          {sizes && (
                            <div
                              style={{
                                fontSize: '0.8rem',
                                color: '#94a3b8',
                                marginTop: '4px',
                              }}
                            >
                              Breakdown Ukuran:{' '}
                              {Object.entries(sizes)
                                .map(([k, v]) => `${k.toUpperCase()}: ${v} pcs`)
                                .join(' · ')}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {item.quantity} {item.unit}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          {rupiah(item.unit_price)}
                        </td>
                        <td
                          style={{
                            padding: '12px 10px',
                            fontWeight: 600,
                            color: '#f1f5f9',
                          }}
                        >
                          {rupiah(item.subtotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
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
              <h2 style={{ margin: 0 }}>Surat Perintah Kerja (SPK Produksi)</h2>
              {canCreateJob && (
                <JobCreateModal
                  orderId={order.id}
                  orderItems={items.map((i) => ({
                    id: i.id,
                    description: i.description,
                    quantity: i.quantity,
                  }))}
                />
              )}
            </div>

            {jobs.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                Belum ada sub-job produksi yang dipecah untuk pesanan ini.
                Gunakan tombol di atas untuk menerbitkan SPK (Garment, Printing,
                Packaging, dll).
              </p>
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
                      <th style={{ padding: '8px 10px' }}>NO. SPK</th>
                      <th style={{ padding: '8px 10px' }}>KATEGORI</th>
                      <th style={{ padding: '8px 10px' }}>JUDUL PEKERJAAN</th>
                      <th style={{ padding: '8px 10px' }}>STATUS</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>
                        ESTIMASI
                      </th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>
                        KOMITMEN
                      </th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>
                        AKTUAL RIIL
                      </th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>
                        AKSI
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((j) => (
                      <tr
                        key={j.id}
                        style={{ borderBottom: '1px solid #1e293b' }}
                      >
                        <td style={{ padding: '10px', fontWeight: 600 }}>
                          <Link
                            href={`/production/${j.id}`}
                            style={{ color: '#38bdf8' }}
                          >
                            {j.job_number}
                          </Link>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span
                            style={{
                              background: '#1e293b',
                              color: '#93c5fd',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              border: '1px solid #3b82f6',
                            }}
                          >
                            {j.job_type}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            color: '#f8fafc',
                            fontWeight: 500,
                          }}
                        >
                          {j.title}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span
                            className="badge"
                            style={{
                              background: '#334155',
                              color: '#f8fafc',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            {j.status}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            textAlign: 'right',
                            color: '#cbd5e1',
                          }}
                        >
                          {rupiah(j.estimated_cost)}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            textAlign: 'right',
                            color: '#38bdf8',
                          }}
                        >
                          {j.committed_cost ? rupiah(j.committed_cost) : '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: j.actual_cost ? '#4ade80' : '#64748b',
                          }}
                        >
                          {j.actual_cost
                            ? rupiah(j.actual_cost)
                            : 'Belum Settled'}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <div
                            style={{
                              display: 'inline-flex',
                              gap: '6px',
                              alignItems: 'center',
                            }}
                          >
                            <Link
                              href={`/production/${j.id}`}
                              className="btn-secondary"
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.75rem',
                              }}
                            >
                              Buka SPK
                            </Link>
                            {canManageCost && (
                              <RecordActualCostModal
                                jobId={j.id}
                                jobNumber={j.job_number}
                                estimatedCost={j.estimated_cost}
                                committedCost={j.committed_cost}
                                currentActualCost={j.actual_cost}
                                buttonLabel="Catat Aktual"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {canReadInvoices && (
            <section className="card" style={{ marginTop: '1.5rem' }}>
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
                <div>
                  <h2 style={{ margin: 0 }}>Tagihan Komersial &amp; Termin</h2>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      marginTop: '2px',
                    }}
                  >
                    Kontrak: {rupiah(order.grand_total)} · Ditagih:{' '}
                    {rupiah(totalInvoiced)} · Sisa Kuota:{' '}
                    {rupiah(
                      remainingInvoicingQuota > 0n
                        ? remainingInvoicingQuota
                        : 0n,
                    )}
                  </div>
                </div>

                {canCreateInvoice && remainingInvoicingQuota > 0n && (
                  <InvoiceCreateModal
                    orderId={order.id}
                    orderNumber={order.order_number}
                    grandTotal={order.grand_total}
                    alreadyInvoiced={totalInvoiced.toString()}
                    defaultType={
                      invoices.length === 0 ? 'DOWN_PAYMENT' : 'FINAL_PAYMENT'
                    }
                    suggestedSubtotal={
                      invoices.length === 0
                        ? (BigInt(order.subtotal) / 2n).toString()
                        : remainingInvoicingQuota > BigInt(order.shipping_total)
                          ? (
                              remainingInvoicingQuota -
                              BigInt(order.shipping_total)
                            ).toString()
                          : remainingInvoicingQuota.toString()
                    }
                    suggestedShipping={
                      invoices.length === 0 ? '0' : order.shipping_total
                    }
                  />
                )}
              </div>

              {invoices.length === 0 ? (
                <p
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.9rem',
                    margin: 0,
                  }}
                >
                  Belum ada faktur tagihan yang diterbitkan untuk pesanan ini.
                  Klik tombol &ldquo;+ Buat Faktur Tagihan&rdquo; di atas untuk
                  menerbitkan Down Payment (DP) atau Pelunasan.
                </p>
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
                        <th style={{ padding: '8px 10px' }}>NO. FAKTUR</th>
                        <th style={{ padding: '8px 10px' }}>TERMIN</th>
                        <th style={{ padding: '8px 10px' }}>STATUS</th>
                        <th style={{ padding: '8px 10px' }}>JATUH TEMPO</th>
                        <th style={{ padding: '8px 10px' }}>TOTAL</th>
                        <th style={{ padding: '8px 10px' }}>TERBAYAR</th>
                        <th style={{ padding: '8px 10px' }}>SISA</th>
                        <th style={{ padding: '8px 10px' }}>AKSI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr
                          key={inv.id}
                          style={{ borderBottom: '1px solid #1e293b' }}
                        >
                          <td style={{ padding: '10px', fontWeight: 600 }}>
                            <Link
                              href={`/invoices/${inv.id}`}
                              style={{ color: '#38bdf8' }}
                            >
                              {inv.invoice_number}
                            </Link>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <span
                              style={{
                                background: '#1e293b',
                                color: '#cbd5e1',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              {inv.invoice_type.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <span
                              className="badge"
                              style={{
                                background:
                                  inv.status === 'PAID'
                                    ? '#064e3b'
                                    : inv.status === 'PARTIALLY_PAID'
                                      ? '#78350f'
                                      : inv.status === 'ISSUED'
                                        ? '#075985'
                                        : inv.status === 'VOID'
                                          ? '#7f1d1d'
                                          : '#334155',
                                color: '#f8fafc',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '10px',
                              fontSize: '0.85rem',
                              color: '#94a3b8',
                            }}
                          >
                            {inv.due_date}
                          </td>
                          <td
                            style={{
                              padding: '10px',
                              fontWeight: 600,
                              color: '#f8fafc',
                            }}
                          >
                            {rupiah(inv.amount_total)}
                          </td>
                          <td
                            style={{
                              padding: '10px',
                              color: '#4ade80',
                              fontSize: '0.85rem',
                            }}
                          >
                            {rupiah(inv.amount_paid)}
                          </td>
                          <td
                            style={{
                              padding: '10px',
                              color:
                                BigInt(inv.balance_due) > 0n
                                  ? '#f87171'
                                  : '#94a3b8',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                            }}
                          >
                            {rupiah(inv.balance_due)}
                          </td>
                          <td style={{ padding: '10px' }}>
                            <Link
                              href={`/invoices/${inv.id}`}
                              className="btn-secondary"
                              style={{
                                padding: '3px 8px',
                                fontSize: '0.75rem',
                                textDecoration: 'none',
                                display: 'inline-block',
                              }}
                            >
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Alamat Pengiriman Terkunci (Address Freezing)</h2>
            <div
              style={{
                background: '#0f172a',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #1e293b',
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  color: '#f8fafc',
                  fontSize: '1.05rem',
                  marginBottom: '4px',
                }}
              >
                {order.shipping_address_snapshot.recipient_name}
              </div>
              <div
                style={{
                  color: '#38bdf8',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                📞 {order.shipping_address_snapshot.phone}
              </div>
              <div style={{ color: '#cbd5e1', lineHeight: '1.4' }}>
                {order.shipping_address_snapshot.street}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {order.shipping_address_snapshot.city}
                {order.shipping_address_snapshot.province &&
                  `, ${order.shipping_address_snapshot.province}`}
                {order.shipping_address_snapshot.postal_code &&
                  ` ${order.shipping_address_snapshot.postal_code}`}
              </div>

              {order.shipping_address_snapshot.courier_service && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '0.85rem',
                    color: '#fbbf24',
                  }}
                >
                  🚚 Kurir / Kargo:{' '}
                  <strong>
                    {order.shipping_address_snapshot.courier_service}
                  </strong>
                </div>
              )}

              {order.shipping_address_snapshot.notes && (
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                  }}
                >
                  Instruksi: &ldquo;{order.shipping_address_snapshot.notes}
                  &rdquo;
                </div>
              )}
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#64748b',
                marginTop: '8px',
                marginBottom: 0,
              }}
            >
              🔒 Snapshot ini bersifat permanen dan tidak dapat diubah
              (append-only database guard).
            </p>
          </section>
        </div>

        {/* Right Column: Financial Summary & Snapshots */}
        <div>
          <section className="card">
            <h2>Kompilasi Finansial Kontrak</h2>
            <dl style={{ margin: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <dt style={{ color: '#94a3b8' }}>Bruto Subtotal</dt>
                <dd style={{ margin: 0, fontWeight: 500 }}>
                  {rupiah(order.subtotal)}
                </dd>
              </div>

              {BigInt(order.discount_total) > 0n && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid #1e293b',
                    color: '#f87171',
                  }}
                >
                  <dt>Potongan Diskon</dt>
                  <dd style={{ margin: 0 }}>-{rupiah(order.discount_total)}</dd>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <dt style={{ color: '#94a3b8' }}>Net Produk</dt>
                <dd style={{ margin: 0, fontWeight: 600, color: '#f1f5f9' }}>
                  {rupiah(netProductRevenue)}
                </dd>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '6px 0',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <dt style={{ color: '#94a3b8' }}>
                  Ongkir Kurir
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.7rem',
                      color: '#64748b',
                    }}
                  >
                    Pass-through Escrow
                  </span>
                </dt>
                <dd style={{ margin: 0, fontWeight: 500 }}>
                  {rupiah(order.shipping_total)}
                </dd>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  marginTop: '4px',
                }}
              >
                <dt
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#f8fafc',
                  }}
                >
                  Grand Total
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#4ade80',
                  }}
                >
                  {rupiah(order.grand_total)}
                </dd>
              </div>

              {canReadInvoices && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '6px 0',
                      marginTop: '8px',
                      borderTop: '1px dashed #334155',
                      fontSize: '0.85rem',
                    }}
                  >
                    <dt style={{ color: '#94a3b8' }}>Total Ditagih</dt>
                    <dd
                      style={{ margin: 0, fontWeight: 600, color: '#38bdf8' }}
                    >
                      {rupiah(totalInvoiced)}
                    </dd>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      fontSize: '0.85rem',
                    }}
                  >
                    <dt style={{ color: '#94a3b8' }}>Sisa Belum Ditagih</dt>
                    <dd
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        color:
                          remainingInvoicingQuota > 0n ? '#fbbf24' : '#94a3b8',
                      }}
                    >
                      {rupiah(
                        remainingInvoicingQuota > 0n
                          ? remainingInvoicingQuota
                          : 0n,
                      )}
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </section>

          {canReadLedger && financialSummary && (
            <section className="card" style={{ marginTop: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <h2 style={{ margin: 0 }}>Cost Trilogy & Margin</h2>
                <MarginHealthBadge
                  health={financialSummary.margin_health}
                  marginPct={financialSummary.realized_margin_pct}
                />
              </div>

              <dl style={{ margin: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid #1e293b',
                  }}
                >
                  <dt style={{ color: '#94a3b8' }}>1. Estimasi Biaya (BOM)</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>
                    {rupiah(financialSummary.estimated_cost)}
                  </dd>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid #1e293b',
                  }}
                >
                  <dt style={{ color: '#94a3b8' }}>2. Komitmen SPK (Vendor)</dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>
                    {rupiah(financialSummary.committed_cost)}
                  </dd>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '6px 0',
                    borderBottom: '1px solid #1e293b',
                  }}
                >
                  <dt style={{ color: '#94a3b8' }}>
                    3. Biaya Aktual
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.7rem',
                        color: financialSummary.is_cost_settled
                          ? '#4ade80'
                          : '#fbbf24',
                      }}
                    >
                      {financialSummary.is_cost_settled
                        ? '✓ Settled'
                        : '⏳ Belum Lengkap'}
                    </span>
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      fontWeight: 600,
                      color: financialSummary.is_cost_settled
                        ? '#f1f5f9'
                        : '#94a3b8',
                    }}
                  >
                    {rupiah(financialSummary.actual_cost)}
                  </dd>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    marginTop: '4px',
                    borderBottom: '1px solid #1e293b',
                  }}
                >
                  <dt style={{ color: '#94a3b8' }}>Laba Kotor Terealisasi</dt>
                  <dd
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      color:
                        BigInt(financialSummary.realized_gross_profit) >= 0n
                          ? '#4ade80'
                          : '#f87171',
                    }}
                  >
                    {rupiah(financialSummary.realized_gross_profit)}
                  </dd>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                  }}
                >
                  <dt style={{ color: '#94a3b8' }}>Realisasi Margin %</dt>
                  <dd
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      color:
                        financialSummary.realized_margin_pct >= 35
                          ? '#4ade80'
                          : financialSummary.realized_margin_pct >= 20
                            ? '#fbbf24'
                            : '#f87171',
                    }}
                  >
                    {percent(financialSummary.realized_margin_pct)}
                  </dd>
                </div>
              </dl>

              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px dashed #334155',
                  fontSize: '0.75rem',
                  color: '#64748b',
                }}
              >
                🛡️ Isolasi Ongkir:{' '}
                {rupiah(financialSummary.courier_shipping_fee)} (margin Rp 0 /
                pass-through).
              </div>
            </section>
          )}

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Snapshot Pelanggan</h2>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9' }}>
                {order.customer_snapshot.display_name}
              </div>
              {order.customer_snapshot.legal_name && (
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {order.customer_snapshot.legal_name}
                </div>
              )}
              {order.customer_snapshot.email && (
                <div style={{ color: '#64748b', marginTop: '4px' }}>
                  ✉️ {order.customer_snapshot.email}
                </div>
              )}
              {order.customer_snapshot.phone && (
                <div style={{ color: '#64748b' }}>
                  📱 {order.customer_snapshot.phone}
                </div>
              )}
            </div>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Riwayat Audit</h2>
            <ul
              style={{
                paddingLeft: '1.2rem',
                margin: 0,
                fontSize: '0.8rem',
                color: '#94a3b8',
              }}
            >
              {audits.map((a) => (
                <li key={a.id} style={{ marginBottom: '6px' }}>
                  <span style={{ color: '#cbd5e1' }}>{a.action}</span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}
                  >
                    {new Date(a.created_at).toLocaleString('id-ID')}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
