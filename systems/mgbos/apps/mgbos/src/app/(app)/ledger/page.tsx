import Link from 'next/link';
import {
  LEDGER_ENTRY_TYPE_LABELS,
  LEDGER_CATEGORY_LABELS,
  LedgerEntryType,
  LedgerCategory,
} from '@mgbos/domain';
import {
  ledgerContext,
  readRows,
  OrderFinancialSummaryRow,
  FinancialLedgerEntryRow,
  rupiah,
  percent,
} from './data';
import { MarginHealthBadge } from './components';

export default async function LedgerPage() {
  const ctx = await ledgerContext();

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

  const summaries = brand
    ? await readRows<OrderFinancialSummaryRow>(
        `order_financial_summaries?organization_id=eq.${ctx.session.organization.id}&brand_id=eq.${brand.id}&order=confirmed_at.desc&limit=100`,
        ctx,
      )
    : [];

  const ledgerEntries = brand
    ? await readRows<FinancialLedgerEntryRow>(
        `financial_ledger_entries?organization_id=eq.${ctx.session.organization.id}&brand_id=eq.${brand.id}&order=created_at.desc&limit=50`,
        ctx,
      )
    : [];

  // Aggregated KPIs
  const totalNetRevenue = summaries.reduce(
    (acc, s) => acc + BigInt(s.net_product_revenue),
    0n,
  );
  const totalRealizedProfit = summaries.reduce(
    (acc, s) => acc + BigInt(s.realized_gross_profit),
    0n,
  );
  const totalShippingEscrow = summaries.reduce(
    (acc, s) => acc + BigInt(s.courier_shipping_fee),
    0n,
  );
  const totalCashReceived = summaries.reduce(
    (acc, s) => acc + BigInt(s.total_cash_received),
    0n,
  );
  const totalBalanceDue = summaries.reduce(
    (acc, s) => acc + BigInt(s.total_balance_due),
    0n,
  );

  const holdingMarginPct =
    totalNetRevenue > 0n
      ? Math.round(
          (Number(totalRealizedProfit) / Number(totalNetRevenue)) * 10000,
        ) / 100
      : 0;

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
            Buku Kas &amp; Analitik Realisasi Margin (Analytical Ledger)
          </h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0' }}>
            {ctx.session.activeBrand.name} · Rekonsiliasi The Cost Trilogy
            (Estimasi vs Komitmen vs Aktual), pemisahan dana titipan ongkir
            kurir, dan pelacakan laba bersih.
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
          <div
            style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}
          >
            NET PRODUCT REVENUE
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#38bdf8',
              marginTop: '4px',
            }}
          >
            {rupiah(totalNetRevenue)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            Murni bruto produk - diskon
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 600 }}
          >
            REALIZED GROSS PROFIT
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#4ade80',
              marginTop: '4px',
            }}
          >
            {rupiah(totalRealizedProfit)}
          </div>
          <div
            style={{
              fontSize: '0.75rem',
              color: holdingMarginPct >= 35 ? '#4ade80' : '#fb923c',
              marginTop: '2px',
              fontWeight: 600,
            }}
          >
            Holding Margin: {percent(holdingMarginPct)}
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#a78bfa', fontWeight: 600 }}
          >
            TITIPAN ONGKIR KURIR (ESCROW)
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#a78bfa',
              marginTop: '4px',
            }}
          >
            {rupiah(totalShippingEscrow)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}
          >
            Pass-Through (Margin Rp 0)
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <div
            style={{ fontSize: '0.8rem', color: '#fb923c', fontWeight: 600 }}
          >
            KAS TERKOLEKSI VS PIUTANG
          </div>
          <div
            style={{
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#f8fafc',
              marginTop: '4px',
            }}
          >
            {rupiah(totalCashReceived)}
          </div>
          <div
            style={{ fontSize: '0.75rem', color: '#fb923c', marginTop: '2px' }}
          >
            Sisa Piutang: {rupiah(totalBalanceDue)}
          </div>
        </div>
      </div>

      <section className="card" style={{ marginBottom: '1.5rem' }}>
        <h2>Performa Finansial Kontrak Pesanan</h2>

        {summaries.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#94a3b8',
            }}
          >
            <p style={{ margin: 0 }}>
              Belum ada pesanan aktif untuk brand ini. Buat pesanan baru di{' '}
              <Link href="/orders" style={{ color: '#38bdf8' }}>
                Order Contracts
              </Link>
              .
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
                  <th style={{ padding: '10px 12px' }}>NO. ORDER</th>
                  <th style={{ padding: '10px 12px' }}>PELANGGAN</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    NET REVENUE
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    ONGKIR (ESCROW)
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    BIAYA EFEKTIF (HPP)
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    LABA BERSIH
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                    REALISASI MARGIN
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                    STATUS KAS
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((s) => (
                  <tr
                    key={s.order_id}
                    style={{ borderBottom: '1px solid #1e293b' }}
                  >
                    <td style={{ padding: '12px' }}>
                      <Link
                        href={`/orders/${s.order_id}`}
                        style={{
                          fontWeight: 700,
                          color: '#38bdf8',
                          fontFamily: 'monospace',
                        }}
                      >
                        {s.order_number}
                      </Link>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        fontSize: '0.85rem',
                        color: '#f8fafc',
                      }}
                    >
                      {s.customer_name}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontWeight: 600,
                        color: '#f8fafc',
                      }}
                    >
                      {rupiah(s.net_product_revenue)}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontSize: '0.85rem',
                        color: '#a78bfa',
                      }}
                    >
                      {rupiah(s.courier_shipping_fee)}
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.7rem',
                          color: '#64748b',
                        }}
                      >
                        Pass-through
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontSize: '0.85rem',
                        color: s.is_cost_settled ? '#4ade80' : '#fb923c',
                      }}
                    >
                      {rupiah(s.effective_cost)}
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.7rem',
                          color: s.is_cost_settled ? '#4ade80' : '#64748b',
                        }}
                      >
                        {s.is_cost_settled ? 'Aktual settled' : 'Estimasi/SPK'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color:
                          BigInt(s.realized_gross_profit) > 0n
                            ? '#4ade80'
                            : '#f87171',
                      }}
                    >
                      {rupiah(s.realized_gross_profit)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <MarginHealthBadge
                        health={s.margin_health}
                        marginPct={s.realized_margin_pct}
                      />
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background:
                            s.billing_status === 'PAID'
                              ? '#052e16'
                              : s.billing_status === 'PARTIALLY_PAID'
                                ? '#0c4a6e'
                                : '#1e293b',
                          color:
                            s.billing_status === 'PAID'
                              ? '#4ade80'
                              : s.billing_status === 'PARTIALLY_PAID'
                                ? '#38bdf8'
                                : '#94a3b8',
                        }}
                      >
                        {s.billing_status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <Link
                        href={`/orders/${s.order_id}`}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Jurnal Mutasi Finansial Terkini (Financial Ledger Audit Trail)</h2>

        {ledgerEntries.length === 0 ? (
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
            Belum ada mutasi finansial tercatat pada buku kas.
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
                  <th style={{ padding: '10px 12px' }}>NO. JURNAL</th>
                  <th style={{ padding: '10px 12px' }}>WAKTU</th>
                  <th style={{ padding: '10px 12px' }}>TIPE EVENT</th>
                  <th style={{ padding: '10px 12px' }}>KATEGORI</th>
                  <th style={{ padding: '10px 12px' }}>DOKUMEN RUJUKAN</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>
                    NOMINAL (RP)
                  </th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>
                    ARAH
                  </th>
                  <th style={{ padding: '10px 12px' }}>KETERANGAN</th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.map((e) => (
                  <tr key={e.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td
                      style={{
                        padding: '10px 12px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: '#38bdf8',
                      }}
                    >
                      {e.entry_number}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                      }}
                    >
                      {new Date(e.created_at).toLocaleString('id-ID')}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#f8fafc',
                      }}
                    >
                      {LEDGER_ENTRY_TYPE_LABELS[
                        e.entry_type as LedgerEntryType
                      ] ?? e.entry_type}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.8rem',
                        color: '#cbd5e1',
                      }}
                    >
                      {LEDGER_CATEGORY_LABELS[e.category as LedgerCategory] ??
                        e.category}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        color: '#38bdf8',
                      }}
                    >
                      {e.reference_document || '-'}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: e.direction === 'CREDIT' ? '#4ade80' : '#f87171',
                      }}
                    >
                      {e.direction === 'CREDIT' ? '+' : '-'}
                      {rupiah(e.amount)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background:
                            e.direction === 'CREDIT' ? '#052e16' : '#450a0a',
                          color:
                            e.direction === 'CREDIT' ? '#4ade80' : '#f87171',
                        }}
                      >
                        {e.direction}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        fontSize: '0.8rem',
                        color: '#94a3b8',
                      }}
                    >
                      {e.notes || '-'}
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
