import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasPermission } from '@mgbos/auth';
import {
  invoiceContext,
  readRows,
  InvoiceRow,
  InvoiceItemRow,
  InvoiceAuditRow,
  rupiah,
} from '../data';
import { IssueInvoiceButton, VoidInvoiceButton } from '../InvoiceActionButtons';
import { RecordPaymentModal } from '../../payments/components';

interface InvoiceWithOrder extends InvoiceRow {
  orders?: {
    id: string;
    order_number: string;
  } | null;
}

interface AllocationWithPayment {
  id: string;
  amount: string;
  notes: string | null;
  created_at: string;
  payment_id: string;
  payments?: {
    id: string;
    payment_number: string;
    payment_method: string;
    payment_date: string;
    status: string;
    reference_number: string | null;
  } | null;
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const ctx = await invoiceContext();

  const invoices = await readRows<InvoiceWithOrder>(
    `invoices?organization_id=eq.${ctx.session.organization.id}&id=eq.${invoiceId}&select=*,orders(id,order_number)&limit=1`,
    ctx,
  );

  const invoice = invoices[0];
  if (!invoice) {
    notFound();
  }

  const items = await readRows<InvoiceItemRow>(
    `invoice_items?invoice_id=eq.${invoice.id}&select=*&order=created_at.asc`,
    ctx,
  );

  const audits = await readRows<InvoiceAuditRow>(
    `invoice_audit?invoice_id=eq.${invoice.id}&select=*&order=created_at.asc`,
    ctx,
  );

  const allocations = await readRows<AllocationWithPayment>(
    `payment_allocations?invoice_id=eq.${invoice.id}&select=*,payments(id,payment_number,payment_method,payment_date,status,reference_number)&order=created_at.asc`,
    ctx,
  );

  const canIssue = hasPermission(ctx.session.role.code, 'invoices:issue');
  const canVoid = hasPermission(ctx.session.role.code, 'invoices:void');
  const canRecordPayment = hasPermission(
    ctx.session.role.code,
    'payments:record',
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return '#475569';
      case 'ISSUED':
        return '#0284c7';
      case 'PARTIALLY_PAID':
        return '#d97706';
      case 'PAID':
        return '#16a34a';
      case 'OVERDUE':
        return '#dc2626';
      case 'VOID':
        return '#64748b';
      case 'CANCELLED':
        return '#991b1b';
      default:
        return '#334155';
    }
  };

  return (
    <div>
      <div
        style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}
      >
        <Link href="/invoices" style={{ color: '#38bdf8' }}>
          &larr; Kembali ke Daftar Faktur Tagihan
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
            <h1 style={{ margin: 0 }}>{invoice.invoice_number}</h1>
            <span
              style={{
                background: '#1e293b',
                color: '#facc15',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: '1px solid #854d0e',
              }}
            >
              {invoice.invoice_type}
            </span>
            <span
              className="badge"
              style={{
                background: getStatusColor(invoice.status),
                color: '#f8fafc',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {invoice.status}
            </span>
          </div>
          <p
            style={{ color: '#94a3b8', margin: '6px 0 0', fontSize: '0.9rem' }}
          >
            Dibuat pada {new Date(invoice.created_at).toLocaleString('id-ID')} ·
            Jatuh Tempo: <strong>{invoice.due_date}</strong>
            {invoice.issued_at && (
              <>
                {' '}
                · Diterbitkan:{' '}
                {new Date(invoice.issued_at).toLocaleString('id-ID')}
              </>
            )}
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
        {/* Left Column: Items & Banking Snapshot */}
        <div>
          <section className="card">
            <h2>Rincian Pos Tagihan (Line Items)</h2>
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
                    <th style={{ padding: '8px 10px' }}>DESKRIPSI TAGIHAN</th>
                    <th style={{ padding: '8px 10px' }}>QTY</th>
                    <th style={{ padding: '8px 10px' }}>HARGA SATUAN</th>
                    <th style={{ padding: '8px 10px' }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr
                      key={it.id}
                      style={{ borderBottom: '1px solid #1e293b' }}
                    >
                      <td
                        style={{
                          padding: '12px 10px',
                          fontWeight: 600,
                          color: '#f8fafc',
                        }}
                      >
                        <div>{it.description}</div>
                        {it.notes && (
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {it.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>
                        {it.quantity}
                      </td>
                      <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>
                        {rupiah(it.unit_price)}
                      </td>
                      <td
                        style={{
                          padding: '12px 10px',
                          fontWeight: 700,
                          color: '#f1f5f9',
                        }}
                      >
                        {rupiah(it.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Rekening Pembayaran Resmi Terkunci (Payment Freezing)</h2>
            <div
              style={{
                background: '#0f172a',
                padding: '1.25rem',
                borderRadius: '8px',
                border: '1px solid #1e293b',
              }}
            >
              <div
                style={{
                  fontSize: '0.85rem',
                  color: '#38bdf8',
                  fontWeight: 600,
                }}
              >
                REKENING PERUSAHAAN TUJUAN
              </div>
              {invoice.bank_account_snapshot.bank_name ? (
                <>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#f8fafc',
                      marginTop: '4px',
                    }}
                  >
                    {invoice.bank_account_snapshot.bank_name}
                  </div>
                  <div
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: '#4ade80',
                      letterSpacing: '1px',
                      marginTop: '4px',
                    }}
                  >
                    {invoice.bank_account_snapshot.account_number}
                  </div>
                  <div
                    style={{
                      color: '#cbd5e1',
                      fontSize: '0.9rem',
                      marginTop: '2px',
                    }}
                  >
                    Atas Nama:{' '}
                    <strong>
                      {invoice.bank_account_snapshot.account_name}
                    </strong>
                  </div>
                  {invoice.bank_account_snapshot.branch && (
                    <div
                      style={{
                        color: '#94a3b8',
                        fontSize: '0.8rem',
                        marginTop: '2px',
                      }}
                    >
                      Cabang: {invoice.bank_account_snapshot.branch}
                    </div>
                  )}
                </>
              ) : (
                <div
                  style={{
                    color: '#f87171',
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    marginTop: '4px',
                  }}
                >
                  Rekening pembayaran belum dikonfigurasi pada pengaturan
                  organisasi.
                </div>
              )}
              {invoice.payment_instructions && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    background: '#1e293b',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: '#facc15',
                  }}
                >
                  💡 {invoice.payment_instructions}
                </div>
              )}
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginTop: '8px',
                marginBottom: 0,
              }}
            >
              🔒 Rekening ini dibekukan secara permanen dalam database audit
              saat faktur diterbitkan.
            </p>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <h2 style={{ margin: 0 }}>
                Riwayat Pembayaran &amp; Kas Masuk ({allocations.length})
              </h2>
              {(invoice.status === 'ISSUED' ||
                invoice.status === 'PARTIALLY_PAID') &&
                canRecordPayment && (
                  <RecordPaymentModal
                    brandId={invoice.brand_id}
                    customerAccountId={invoice.customer_account_id}
                    prefilledInvoice={{
                      id: invoice.id,
                      invoiceNumber: invoice.invoice_number,
                      balanceDue: invoice.balance_due,
                    }}
                    defaultDestinationBank={
                      invoice.bank_account_snapshot?.bank_name
                    }
                    defaultDestinationAccount={
                      invoice.bank_account_snapshot?.account_number
                    }
                    buttonLabel="+ Catat Bayar"
                  />
                )}
            </div>

            {allocations.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                Belum ada pembayaran yang dialokasikan ke faktur ini.
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
                      <th style={{ padding: '8px 10px' }}>NO. BUKTI KAS</th>
                      <th style={{ padding: '8px 10px' }}>TANGGAL</th>
                      <th style={{ padding: '8px 10px' }}>METODE</th>
                      <th style={{ padding: '8px 10px' }}>NO. REF</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>
                        DANA DIALOKASIKAN
                      </th>
                      <th style={{ padding: '8px 10px', textAlign: 'center' }}>
                        STATUS KAS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((a) => (
                      <tr
                        key={a.id}
                        style={{ borderBottom: '1px solid #1e293b' }}
                      >
                        <td style={{ padding: '10px' }}>
                          {a.payments ? (
                            <Link
                              href={`/payments/${a.payments.id}`}
                              style={{
                                color: '#38bdf8',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                              }}
                            >
                              {a.payments.payment_number}
                            </Link>
                          ) : (
                            <span style={{ fontFamily: 'monospace' }}>
                              {a.payment_id}
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            fontSize: '0.85rem',
                            color: '#cbd5e1',
                          }}
                        >
                          {a.payments?.payment_date
                            ? new Date(
                                a.payments.payment_date,
                              ).toLocaleDateString('id-ID')
                            : '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            fontSize: '0.85rem',
                            color: '#cbd5e1',
                          }}
                        >
                          {a.payments?.payment_method || '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            fontSize: '0.85rem',
                            color: '#94a3b8',
                            fontFamily: 'monospace',
                          }}
                        >
                          {a.payments?.reference_number || '-'}
                        </td>
                        <td
                          style={{
                            padding: '10px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: '#4ade80',
                          }}
                        >
                          {rupiah(a.amount)}
                        </td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background:
                                a.payments?.status === 'CONFIRMED'
                                  ? '#052e16'
                                  : '#1e293b',
                              color:
                                a.payments?.status === 'CONFIRMED'
                                  ? '#4ade80'
                                  : '#94a3b8',
                            }}
                          >
                            {a.payments?.status || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {invoice.notes && (
            <section className="card" style={{ marginTop: '1.5rem' }}>
              <h2>Catatan Khusus</h2>
              <div
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {invoice.notes}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Financial Summary, Actions & Audit */}
        <div>
          <section className="card">
            <h2>Ringkasan Finansial Tagihan</h2>
            <dl style={{ margin: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <dt style={{ color: '#94a3b8' }}>Pokok Tagihan</dt>
                <dd style={{ margin: 0, fontWeight: 500, color: '#f8fafc' }}>
                  {rupiah(invoice.amount_subtotal)}
                </dd>
              </div>

              {BigInt(invoice.amount_shipping) > 0n && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
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
                      Pass-through escrow
                    </span>
                  </dt>
                  <dd style={{ margin: 0, fontWeight: 500 }}>
                    {rupiah(invoice.amount_shipping)}
                  </dd>
                </div>
              )}

              {BigInt(invoice.amount_tax) > 0n && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid #1e293b',
                  }}
                >
                  <dt style={{ color: '#94a3b8' }}>Pajak / PPN</dt>
                  <dd style={{ margin: 0 }}>{rupiah(invoice.amount_tax)}</dd>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid #334155',
                }}
              >
                <dt style={{ fontWeight: 700, color: '#f8fafc' }}>
                  Total Tagihan Faktur
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    color: '#f8fafc',
                    fontSize: '1.1rem',
                  }}
                >
                  {rupiah(invoice.amount_total)}
                </dd>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  color: '#4ade80',
                  borderBottom: '1px solid #1e293b',
                }}
              >
                <dt>Terbayar (Cash-In)</dt>
                <dd style={{ margin: 0, fontWeight: 600 }}>
                  {rupiah(invoice.amount_paid)}
                </dd>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                }}
              >
                <dt
                  style={{
                    fontWeight: 700,
                    color: '#fb923c',
                    fontSize: '1.05rem',
                  }}
                >
                  Sisa Piutang (Balance Due)
                </dt>
                <dd
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    color: '#fb923c',
                    fontSize: '1.25rem',
                  }}
                >
                  {rupiah(invoice.balance_due)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Aksi &amp; Otorisasi Faktur</h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {invoice.status === 'DRAFT' && canIssue && (
                <IssueInvoiceButton
                  invoiceId={invoice.id}
                  invoiceNumber={invoice.invoice_number}
                />
              )}

              {(invoice.status === 'DRAFT' || invoice.status === 'ISSUED') &&
                canVoid && (
                  <VoidInvoiceButton
                    invoiceId={invoice.id}
                    invoiceNumber={invoice.invoice_number}
                  />
                )}

              {(invoice.status === 'ISSUED' ||
                invoice.status === 'PARTIALLY_PAID') &&
                canRecordPayment && (
                  <RecordPaymentModal
                    brandId={invoice.brand_id}
                    customerAccountId={invoice.customer_account_id}
                    prefilledInvoice={{
                      id: invoice.id,
                      invoiceNumber: invoice.invoice_number,
                      balanceDue: invoice.balance_due,
                    }}
                    defaultDestinationBank={
                      invoice.bank_account_snapshot?.bank_name
                    }
                    defaultDestinationAccount={
                      invoice.bank_account_snapshot?.account_number
                    }
                    buttonLabel="💳 Catat Pembayaran Masuk"
                  />
                )}

              {invoice.status === 'PAID' && (
                <p style={{ color: '#4ade80', fontWeight: 600, margin: 0 }}>
                  ✅ Tagihan ini telah LUNAS terbayar.
                </p>
              )}

              {invoice.status === 'VOID' && (
                <p style={{ color: '#f87171', fontWeight: 600, margin: 0 }}>
                  ❌ Tagihan ini telah DIBATALKAN (VOID).
                </p>
              )}
            </div>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Kontrak Pesanan Induk</h2>
            {invoice.orders ? (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Nomor Kontrak:
                </div>
                <Link
                  href={`/orders/${invoice.order_id}`}
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                  }}
                >
                  {invoice.orders.order_number} &rarr;
                </Link>
              </div>
            ) : (
              <span style={{ color: '#94a3b8' }}>ID: {invoice.order_id}</span>
            )}
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Snapshot Pelanggan</h2>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9' }}>
                {invoice.customer_snapshot.display_name}
              </div>
              {invoice.customer_snapshot.legal_name && (
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {invoice.customer_snapshot.legal_name}
                </div>
              )}
              {invoice.customer_snapshot.email && (
                <div style={{ color: '#64748b', marginTop: '4px' }}>
                  ✉️ {invoice.customer_snapshot.email}
                </div>
              )}
              {invoice.customer_snapshot.phone && (
                <div style={{ color: '#64748b' }}>
                  📱 {invoice.customer_snapshot.phone}
                </div>
              )}
            </div>
          </section>

          <section className="card" style={{ marginTop: '1.5rem' }}>
            <h2>Riwayat Audit Faktur</h2>
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
