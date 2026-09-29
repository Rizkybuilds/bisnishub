import Link from 'next/link';
import { invoiceContext, readRows, InvoiceRow, rupiah } from './data';

interface InvoiceWithOrder extends InvoiceRow {
  orders?: {
    id: string;
    order_number: string;
  } | null;
}

export default async function InvoicesPage() {
  const ctx = await invoiceContext();

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

  const invoices = brand
    ? await readRows<InvoiceWithOrder>(
        `invoices?organization_id=eq.${ctx.session.organization.id}&brand_id=eq.${brand.id}&select=*,orders(id,order_number)&order=created_at.desc&limit=100`,
        ctx,
      )
    : [];

  const activeInvoices = invoices.filter(
    (i) => i.status !== 'VOID' && i.status !== 'CANCELLED',
  );
  const totalBilled = activeInvoices.reduce(
    (acc, i) => acc + BigInt(i.amount_total),
    0n,
  );
  const totalPaid = activeInvoices.reduce(
    (acc, i) => acc + BigInt(i.amount_paid),
    0n,
  );
  const totalBalanceDue = activeInvoices.reduce(
    (acc, i) => acc + BigInt(i.balance_due),
    0n,
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
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Faktur Komersial &amp; Piutang (Commercial Invoices)
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Pengelolaan termin penagihan (DP
            50%, Pelunasan, Full Payment) dan pelacakan piutang resmi.
          </p>
        </div>
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
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            TOTAL TAGIHAN AKTIF
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginTop: '4px',
            }}
          >
            {rupiah(totalBilled)}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#fb923c' }}>
            SISA PIUTANG (BALANCE DUE)
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#fb923c',
              marginTop: '4px',
            }}
          >
            {rupiah(totalBalanceDue)}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>
            TOTAL TERBAYAR (CASH-IN)
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#4ade80',
              marginTop: '4px',
            }}
          >
            {rupiah(totalPaid)}
          </div>
        </div>
        <div className="card" style={{ padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
            FAKTUR RESMI TERBIT
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#38bdf8',
              marginTop: '4px',
            }}
          >
            {invoices.filter((i) => i.status === 'ISSUED').length} Faktur
          </div>
        </div>
      </div>

      <section className="card">
        <h2>Daftar Faktur Tagihan</h2>

        {invoices.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Belum ada faktur komersial yang dibuat.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              Buka menu{' '}
              <Link href="/orders" style={{ color: '#38bdf8' }}>
                Order Contracts
              </Link>{' '}
              dan terbitkan invoice termin DP atau pelunasan untuk pesanan yang
              telah dikonfirmasi.
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
                  <th style={{ padding: '10px 12px' }}>NO. INVOICE</th>
                  <th style={{ padding: '10px 12px' }}>PESANAN INDUK</th>
                  <th style={{ padding: '10px 12px' }}>PELANGGAN</th>
                  <th style={{ padding: '10px 12px' }}>TERMIN</th>
                  <th style={{ padding: '10px 12px' }}>JATUH TEMPO</th>
                  <th style={{ padding: '10px 12px' }}>TOTAL TAGIHAN</th>
                  <th style={{ padding: '10px 12px' }}>SISA PIUTANG</th>
                  <th style={{ padding: '10px 12px' }}>STATUS</th>
                  <th style={{ padding: '10px 12px' }}>TINDAKAN</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    style={{ borderBottom: '1px solid #1e293b' }}
                  >
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      <Link
                        href={`/invoices/${inv.id}`}
                        style={{ color: '#38bdf8' }}
                      >
                        {inv.invoice_number}
                      </Link>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {inv.orders?.order_number ? (
                        <Link
                          href={`/orders/${inv.order_id}`}
                          style={{ color: '#cbd5e1', fontSize: '0.85rem' }}
                        >
                          {inv.orders.order_number}
                        </Link>
                      ) : (
                        <span style={{ color: '#64748b' }}>-</span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        color: '#f8fafc',
                        fontWeight: 500,
                      }}
                    >
                      <div>
                        {inv.customer_snapshot.display_name ?? 'Pelanggan'}
                      </div>
                      {inv.customer_snapshot.phone && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {inv.customer_snapshot.phone}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          background: '#1e293b',
                          color: '#facc15',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: '1px solid #854d0e',
                        }}
                      >
                        {inv.invoice_type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        color: '#94a3b8',
                        fontSize: '0.85rem',
                      }}
                    >
                      {inv.due_date}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontWeight: 700,
                        color: '#f8fafc',
                      }}
                    >
                      {rupiah(inv.amount_total)}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontWeight: 700,
                        color: '#fb923c',
                      }}
                    >
                      {rupiah(inv.balance_due)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        className="badge"
                        style={{
                          background: getStatusColor(inv.status),
                          color: '#f8fafc',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                      >
                        Buka Faktur
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
