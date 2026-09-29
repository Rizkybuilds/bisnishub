import {
  loadQuotation,
  DocumentAccessError,
} from '@/lib/quotation/load.server';
import { renderQuotationPdf } from '@/lib/quotation/pdf';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const headers = {
  'Cache-Control': 'private, no-store',
  'X-Robots-Tag': 'noindex, noarchive',
  'X-Content-Type-Options': 'nosniff',
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ quoteId: string; versionId: string }> },
) {
  try {
    const { quoteId, versionId } = await params;
    const doc = await loadQuotation(quoteId, versionId);
    const bytes = await renderQuotationPdf(doc);
    const name =
      doc.number.replace(/[^a-z0-9_-]/gi, '_') + '-v' + doc.version + '.pdf';
    return new Response(new Uint8Array(bytes), {
      headers: {
        ...headers,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="' + name + '"',
      },
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof DocumentAccessError
            ? error.message
            : error instanceof Error &&
                /Identitas penerbit|PDF belum mendukung/.test(error.message)
              ? error.message
              : 'Dokumen belum dapat dibuat.',
      },
      {
        status: error instanceof DocumentAccessError ? error.status : 422,
        headers,
      },
    );
  }
}
