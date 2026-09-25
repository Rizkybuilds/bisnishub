import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import {
  loadQuotation,
  DocumentAccessError,
} from '@/lib/quotation/load.server';
import { quotationMessage } from '@/lib/quotation/document';
import { DocumentActions } from './DocumentActions';
import './document.css';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Dokumen Penawaran — MGBOS',
  robots: { index: false, follow: false },
};
export default async function QuotationPage({
  params,
}: {
  params: Promise<{ quoteId: string; versionId: string }>;
}) {
  const { quoteId, versionId } = await params;
  let doc;
  try {
    doc = await loadQuotation(quoteId, versionId);
  } catch (error) {
    if (error instanceof DocumentAccessError) {
      if (error.status === 401) redirect('/login');
      if (error.status === 404) notFound();
    }
    return (
      <main className="quotation-sheet">
        <h1>Dokumen belum tersedia</h1>
        <p>{error instanceof Error ? error.message : 'Coba kembali nanti.'}</p>
        <Link href="/quotes">Kembali ke penawaran</Link>
      </main>
    );
  }
  return (
    <main className="quotation-sheet">
      <nav className="quotation-actions">
        <Link href={'/quotes?id=' + quoteId}>Kembali ke penawaran</Link>
      </nav>
      <DocumentActions
        message={quotationMessage(doc)}
        pdfUrl={'/quotes/' + quoteId + '/versions/' + versionId + '/pdf'}
      />
      <header>
        <p className="quotation-notice">{doc.notice}</p>
        <h1>{doc.issuer}</h1>
        <p>{doc.organization}</p>
        <h2>
          {doc.number} / versi {doc.version}
        </h2>
        <p>
          Tanggal: {doc.date} · Berlaku sampai: {doc.validUntil}
        </p>
        <p>
          Kepada: <strong>{doc.customer}</strong>
        </p>
      </header>
      <section>
        <h2>Rincian penawaran</h2>
        {doc.items.map((item, i) => (
          <article key={i}>
            <h3>
              {i + 1}. {item.description}
            </h3>
            <p>
              {item.quantity} × {item.unitPrice}
            </p>
            <p>
              Jumlah setelah diskon: <strong>{item.subtotal}</strong>
            </p>
            {item.specifications.length > 0 && (
              <ul>
                {item.specifications.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
      <section className="quotation-totals">
        <dl>
          <dt>Subtotal produk</dt>
          <dd>{doc.subtotal}</dd>
          <dt>Diskon</dt>
          <dd>{doc.discount}</dd>
          <dt>Ongkir pelanggan</dt>
          <dd>{doc.shipping}</dd>
          <dt>Total</dt>
          <dd>
            <strong>{doc.total}</strong>
          </dd>
        </dl>
      </section>
      <section>
        <h2>Ketentuan</h2>
        <p>Estimasi pengerjaan: {doc.leadTime}</p>
        <p>Pembayaran: {doc.terms}</p>
        {doc.notes && <p>{doc.notes}</p>}
      </section>
      <footer>
        Konfirmasi pesanan dengan menyebutkan nomor dan versi penawaran.
      </footer>
    </main>
  );
}
