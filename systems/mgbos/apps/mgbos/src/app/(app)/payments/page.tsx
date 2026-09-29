import Link from 'next/link';
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
  rupiah,
  getUnallocated,
} from './data';
import { RecordPaymentModal } from './components';

interface PaymentWithCustomer extends PaymentRow {
  customer_accounts?: {
    id: string;
    display_name: string;
  } | null;
}

export default async function PaymentsPage() {
  const ctx = await paymentContext();

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

  const orgBilling = (
    await readRows<{
      billing_settings: {
        bank_accounts?: Array<{
          bank_name: string;
          account_number: string;
          account_name: string;
        }>;
      };
    }>(
      `organizations?id=eq.${ctx.session.organization.id}&select=billing_settings`,
      ctx,
    )
  )[0];

  const defaultBank = orgBilling?.billing_settings?.bank_accounts?.[0];

  const payments = brand
    ? await readRows<PaymentWithCustomer>(
        `payments?organization_id=eq.${ctx.session.organization.id}&brand_id=eq.${brand.id}&select=*,customer_accounts(id,display_name)&order=payment_date.desc,created_at.desc&limit=100`,
        ctx,
      )
    : [];

  const confirmedPayments = payments.filter((p) => p.status === 'CONFIRMED');
  const totalReceived = confirmedPayments.reduce(
    (acc, p) => acc + BigInt(p.amount),
    0n,
  );
  const totalAllocated = confirmedPayments.reduce(
    (acc, p) => acc + BigInt(p.allocated_amount),
    0n,
  );
  const totalUnallocated = confirmedPayments.reduce(
    (acc, p) => acc + getUnallocated(p),
    0n,
  );

  const canRecord = hasPermission(ctx.session.role.code, 'payments:record');

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
          <h1 style={{ margin: 0 }}>Penerimaan Kas &amp; Alokasi Pembayaran</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Pencatatan mutasi kas masuk,
            rekonsiliasi transfer/QRIS, dan alokasi piutang faktur komersial.
          </p>
        </div>

        {canRecord && brand && (
          <RecordPaymentModal
            brandId={brand.id}
            defaultDestinationBank={defaultBank?.bank_name}
            defaultDestinationAccount={defaultBank?.account_number}
          />
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}
          >
            TOTAL KAS MASUK (CONFIRMED)
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#4ade80',
              marginTop: '4px',
            }}
          >
            {rupiah(totalReceived)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            {confirmedPayments.length} mutasi terverifikasi
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
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#38bdf8',
              marginTop: '4px',
            }}
          >
            {rupiah(totalAllocated)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            Mengurangi saldo piutang
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: 600 }}
          >
            SISA DANA BELUM TERALOKASI
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#fb923c',
              marginTop: '4px',
            }}
          >
            {rupiah(totalUnallocated)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            Deposit / kelebihan bayar
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}
          >
            TOTAL TRANSAKSI KAS
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginTop: '4px',
            }}
          >
            {payments.length} Mutasi
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            {payments.filter((p) => p.status === 'REVERSED').length} dibatalkan
            (reversed)
          </div>
        </div>
      </div>

      <section className="card">
        <h2>Daftar Mutasi Kas Masuk</h2>

        {payments.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Belum ada mutasi penerimaan kas tercatat.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              {canRecord
                ? 'Klik tombol "+ Catat Pembayaran Masuk" di pojok kanan atas untuk mencatat setoran kas atau pembayaran invoice pelanggan.'
                : 'Penerimaan kas akan muncul di sini setelah dicatat oleh tim Keuangan.'}
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
                  <th style={{ padding: '10px 12px' }}>NO. BUKTI KAS</th>
                  <th style={{ padding: '10px 12px' }}>TANGGAL</th>
                  <th style={{ padding: '10px 12px' }}>PELANGGAN / PENGIRIM</th>
                  <th style={{ padding: '10px 12px' }}>
                    METODE &amp; REK TUJUAN
                  </th>
                  <th style={{ padding: '10px 12px' }}>NO. REFERENSI</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    NOMINAL MASUK
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    TERALOKASI
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    SISA DANA
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                    STATUS
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const badge = getStatusBadge(p.status);
                  const unallocated = getUnallocated(p);
                  const isReversed = p.status === 'REVERSED';

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid #1e293b',
                        opacity: isReversed ? 0.6 : 1,
                      }}
                    >
                      <td style={{ padding: '12px' }}>
                        <Link
                          href={`/payments/${p.id}`}
                          style={{
                            fontWeight: 700,
                            color: '#38bdf8',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                          }}
                        >
                          {p.payment_number}
                        </Link>
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          fontSize: '0.85rem',
                          color: '#cbd5e1',
                        }}
                      >
                        {new Date(p.payment_date).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: '#f8fafc',
                            fontSize: '0.9rem',
                          }}
                        >
                          {p.customer_accounts?.display_name ||
                            p.payer_name ||
                            'Pelanggan Umum'}
                        </div>
                        {p.payer_name && p.customer_accounts?.display_name && (
                          <div
                            style={{ fontSize: '0.75rem', color: '#64748b' }}
                          >
                            A/N {p.payer_name}{' '}
                            {p.payer_bank ? `(${p.payer_bank})` : ''}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px', fontSize: '0.85rem' }}>
                        <div style={{ color: '#cbd5e1', fontWeight: 500 }}>
                          {PAYMENT_METHOD_LABELS[
                            p.payment_method as PaymentMethod
                          ] ?? p.payment_method}
                        </div>
                        {p.destination_bank && (
                          <div
                            style={{ fontSize: '0.75rem', color: '#64748b' }}
                          >
                            {p.destination_bank}{' '}
                            {p.destination_account_number
                              ? `(${p.destination_account_number})`
                              : ''}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          fontSize: '0.85rem',
                          color: '#94a3b8',
                          fontFamily: 'monospace',
                        }}
                      >
                        {p.reference_number || '-'}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          fontWeight: 700,
                          color: '#4ade80',
                        }}
                      >
                        {rupiah(p.amount)}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          color: '#38bdf8',
                          fontWeight: 600,
                        }}
                      >
                        {rupiah(p.allocated_amount)}
                      </td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          color: unallocated > 0n ? '#fb923c' : '#64748b',
                          fontWeight: unallocated > 0n ? 700 : 400,
                        }}
                      >
                        {rupiah(unallocated)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <Link
                          href={`/payments/${p.id}`}
                          className="btn-secondary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '0.8rem',
                            display: 'inline-block',
                          }}
                        >
                          Detail &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
