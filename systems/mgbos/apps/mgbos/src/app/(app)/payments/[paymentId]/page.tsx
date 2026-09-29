import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasPermission } from '@mgbos/auth';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  PaymentMethod,
  PaymentStatus,
} from '@mgbos/domain';
import {
  paymentContext,
  readRows,
  PaymentRow,
  PaymentAllocationRow,
  PaymentAuditRow,
  rupiah,
  getUnallocated,
} from '../data';
import { RevertPaymentButton } from '../components';

interface PaymentDetailWithCustomer extends PaymentRow {
  customer_accounts?: {
    id: string;
    display_name: string;
    legal_name: string | null;
    primary_email: string | null;
    primary_phone: string | null;
  } | null;
}

interface AllocationWithInvoice extends PaymentAllocationRow {
  invoices?: {
    id: string;
    invoice_number: string;
    invoice_type: string;
    status: string;
    amount_total: string;
    amount_paid: string;
    balance_due: string;
  } | null;
}

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;
  const ctx = await paymentContext();

  const payments = await readRows<PaymentDetailWithCustomer>(
    `payments?organization_id=eq.${ctx.session.organization.id}&id=eq.${paymentId}&select=*,customer_accounts(id,display_name,legal_name,primary_email,primary_phone)&limit=1`,
    ctx,
  );

  const payment = payments[0];
  if (!payment) {
    notFound();
  }

  const allocations = await readRows<AllocationWithInvoice>(
    `payment_allocations?payment_id=eq.${payment.id}&select=*,invoices(id,invoice_number,invoice_type,status,amount_total,amount_paid,balance_due)&order=created_at.asc`,
    ctx,
  );

  const audits = await readRows<PaymentAuditRow>(
    `payment_audit?payment_id=eq.${payment.id}&select=*&order=created_at.asc`,
    ctx,
  );

  const canRevert = hasPermission(ctx.session.role.code, 'payments:revert');
  const unallocated = getUnallocated(payment);
  const isReversed = payment.status === 'REVERSED';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          bg: '#052e16',
          color: '#4ade80',
          border: '#166534',
          label: PAYMENT_STATUS_LABELS.CONFIRMED,
        };
      case 'REVERSED':
        return {
          bg: '#1e293b',
          color: '#94a3b8',
          border: '#475569',
          label: PAYMENT_STATUS_LABELS.REVERSED,
        };
      case 'REJECTED':
        return {
          bg: '#450a0a',
          color: '#f87171',
          border: '#991b1b',
          label: PAYMENT_STATUS_LABELS.REJECTED,
        };
      case 'DRAFT':
      default:
        return {
          bg: '#1e293b',
          color: '#cbd5e1',
          border: '#334155',
          label: PAYMENT_STATUS_LABELS[status as PaymentStatus] ?? status,
        };
    }
  };

  const badge = getStatusBadge(payment.status);

  return (
    <div>
      <div
        style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#94a3b8' }}
      >
        <Link href="/payments" style={{ color: '#38bdf8' }}>
          &larr; Kembali ke Daftar Kas Masuk &amp; Pembayaran
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
            <h1 style={{ margin: 0, fontFamily: 'monospace' }}>
              {payment.payment_number}
            </h1>
            <span
              style={{
                background: badge.bg,
                color: badge.color,
                border: `1px solid ${badge.border}`,
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {badge.label}
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                background: '#1e293b',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              {PAYMENT_METHOD_LABELS[payment.payment_method as PaymentMethod] ??
                payment.payment_method}
            </span>
          </div>

          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            Diterima pada{' '}
            {new Date(payment.received_at).toLocaleString('id-ID', {
              dateStyle: 'full',
              timeStyle: 'short',
            })}
          </p>
        </div>

        {payment.status === 'CONFIRMED' && canRevert && (
          <RevertPaymentButton
            paymentId={payment.id}
            paymentNumber={payment.payment_number}
          />
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}
          >
            NOMINAL KAS MASUK
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: isReversed ? '#94a3b8' : '#4ade80',
              marginTop: '4px',
            }}
          >
            {rupiah(payment.amount)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            Mata uang: {payment.currency}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}
          >
            TERALOKASI KE FAKTUR
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#38bdf8',
              marginTop: '4px',
            }}
          >
            {rupiah(payment.allocated_amount)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            {allocations.length} alokasi faktur
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: 600 }}
          >
            SISA BELUM TERALOKASI
          </div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: unallocated > 0n ? '#fb923c' : '#64748b',
              marginTop: '4px',
            }}
          >
            {rupiah(unallocated)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            {unallocated > 0n
              ? 'Tersedia untuk alokasi faktur mendatang'
              : 'Seluruh dana telah dialokasikan'}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <section className="card" style={{ marginBottom: '1.5rem' }}>
            <h2>Alokasi Pembayaran ke Faktur Tagihan</h2>

            {allocations.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: '#94a3b8',
                }}
              >
                <p style={{ margin: 0 }}>
                  Pembayaran ini belum dialokasikan ke faktur komersial manapun
                  (tersimpan sebagai deposit / unallocated cash).
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
                      <th style={{ padding: '10px 12px' }}>NO. FAKTUR</th>
                      <th style={{ padding: '10px 12px' }}>TIPE</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                        TOTAL FAKTUR
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                        ALOKASI KAS
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                        SISA PIUTANG
                      </th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                        STATUS FAKTUR
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((a) => (
                      <tr
                        key={a.id}
                        style={{ borderBottom: '1px solid #1e293b' }}
                      >
                        <td style={{ padding: '12px' }}>
                          {a.invoices ? (
                            <Link
                              href={`/invoices/${a.invoices.id}`}
                              style={{
                                color: '#38bdf8',
                                fontWeight: 700,
                                fontFamily: 'monospace',
                              }}
                            >
                              {a.invoices.invoice_number}
                            </Link>
                          ) : (
                            <span style={{ fontFamily: 'monospace' }}>
                              {a.invoice_id}
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            fontSize: '0.85rem',
                            color: '#cbd5e1',
                          }}
                        >
                          {a.invoices?.invoice_type || '-'}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            textAlign: 'right',
                            color: '#cbd5e1',
                          }}
                        >
                          {rupiah(a.invoices?.amount_total)}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: '#4ade80',
                          }}
                        >
                          {rupiah(a.amount)}
                        </td>
                        <td
                          style={{
                            padding: '12px',
                            textAlign: 'right',
                            color: '#fb923c',
                          }}
                        >
                          {rupiah(a.invoices?.balance_due)}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background:
                                a.invoices?.status === 'PAID'
                                  ? '#052e16'
                                  : '#1e293b',
                              color:
                                a.invoices?.status === 'PAID'
                                  ? '#4ade80'
                                  : '#f8fafc',
                            }}
                          >
                            {a.invoices?.status || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="card">
            <h2>Data Detail Pembayaran &amp; Rekening</h2>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                margin: 0,
                fontSize: '0.9rem',
              }}
            >
              <div>
                <dt style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  No. Referensi Bank
                </dt>
                <dd
                  style={{
                    margin: '2px 0 0',
                    fontWeight: 600,
                    color: '#f8fafc',
                    fontFamily: 'monospace',
                  }}
                >
                  {payment.reference_number || '-'}
                </dd>
              </div>

              <div>
                <dt style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Tanggal Mutasi
                </dt>
                <dd
                  style={{
                    margin: '2px 0 0',
                    fontWeight: 600,
                    color: '#f8fafc',
                  }}
                >
                  {new Date(payment.payment_date).toLocaleDateString('id-ID', {
                    dateStyle: 'long',
                  })}
                </dd>
              </div>

              <div>
                <dt style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Rekening Tujuan (Holding)
                </dt>
                <dd
                  style={{
                    margin: '2px 0 0',
                    fontWeight: 600,
                    color: '#f8fafc',
                  }}
                >
                  {payment.destination_bank || '-'}
                  {payment.destination_account_number && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                        fontFamily: 'monospace',
                      }}
                    >
                      {payment.destination_account_number}
                    </span>
                  )}
                </dd>
              </div>

              <div>
                <dt style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  Rekening Pengirim (Payer)
                </dt>
                <dd
                  style={{
                    margin: '2px 0 0',
                    fontWeight: 600,
                    color: '#f8fafc',
                  }}
                >
                  {payment.payer_name || '-'}
                  {(payment.payer_bank || payment.payer_account_number) && (
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                        fontFamily: 'monospace',
                      }}
                    >
                      {payment.payer_bank} {payment.payer_account_number}
                    </span>
                  )}
                </dd>
              </div>

              {payment.notes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <dt style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    Catatan
                  </dt>
                  <dd style={{ margin: '2px 0 0', color: '#cbd5e1' }}>
                    {payment.notes}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>

        <div>
          <section className="card" style={{ marginBottom: '1.5rem' }}>
            <h2>Pelanggan Terkait</h2>
            {payment.customer_accounts ? (
              <div style={{ fontSize: '0.9rem' }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: '#f8fafc',
                    fontSize: '1rem',
                  }}
                >
                  {payment.customer_accounts.display_name}
                </div>
                {payment.customer_accounts.legal_name && (
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                    {payment.customer_accounts.legal_name}
                  </div>
                )}
                {payment.customer_accounts.primary_email && (
                  <div style={{ color: '#64748b', marginTop: '6px' }}>
                    ✉️ {payment.customer_accounts.primary_email}
                  </div>
                )}
                {payment.customer_accounts.primary_phone && (
                  <div style={{ color: '#64748b' }}>
                    📱 {payment.customer_accounts.primary_phone}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                {payment.payer_name
                  ? `Pembayar Langsung: ${payment.payer_name}`
                  : 'Pelanggan Umum / Direct Cash-In'}
              </p>
            )}
          </section>

          <section className="card">
            <h2>Riwayat Audit Pembayaran</h2>
            <ul
              style={{
                paddingLeft: '1.2rem',
                margin: 0,
                fontSize: '0.8rem',
                color: '#94a3b8',
              }}
            >
              {audits.map((a) => (
                <li key={a.id} style={{ marginBottom: '8px' }}>
                  <div style={{ color: '#cbd5e1', fontWeight: 600 }}>
                    {a.action}
                  </div>
                  {a.details &&
                    typeof a.details === 'object' &&
                    'reason' in a.details && (
                      <div
                        style={{
                          color: '#f87171',
                          fontSize: '0.75rem',
                          marginTop: '2px',
                        }}
                      >
                        Alasan: {String(a.details.reason)}
                      </div>
                    )}
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginTop: '2px',
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
