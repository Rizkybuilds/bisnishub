import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from 'pdf-lib';
import type { QuotationDocument } from './document';
const clean = (s: string) =>
  s
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/\t/g, '  ')
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '');
export async function renderQuotationPdf(
  doc: QuotationDocument,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const normal = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  pdf.setTitle(`${doc.number} - Versi ${doc.version}`);
  pdf.setAuthor(doc.issuer);
  pdf.setSubject('Dokumen penawaran pelanggan');
  const pageWidth = 595.28,
    pageHeight = 841.89,
    margin = 46,
    width = pageWidth - 2 * margin;
  let page: PDFPage;
  let y = 0;
  const pages: PDFPage[] = [];
  const newPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    pages.push(page);
    y = pageHeight - margin;
    page.drawRectangle({
      x: margin,
      y: y - 5,
      width,
      height: 3,
      color: rgb(0.05, 0.3, 0.4),
    });
    y -= 28;
    for (const line of wrap(doc.issuer, bold, 15)) {
      page.drawText(line, {
        x: margin,
        y,
        size: 15,
        font: bold,
        color: rgb(0.05, 0.2, 0.3),
      });
      y -= 19;
    }
    page.drawText(`${doc.number} / v${doc.version}`, {
      x: margin,
      y,
      size: 10,
      font: normal,
    });
    y -= 27;
  };
  const wrap = (value: string, font: PDFFont, size: number): string[] => {
    const result: string[] = [];
    for (const paragraph of clean(value).split('\n')) {
      let line = '';
      for (const word of paragraph.split(/\s+/)) {
        if (
          font.widthOfTextAtSize((line ? line + ' ' : '') + word, size) <= width
        ) {
          line += (line ? ' ' : '') + word;
          continue;
        }
        if (line) {
          result.push(line);
          line = '';
        }
        for (const char of word) {
          if (font.widthOfTextAtSize(line + char, size) > width) {
            result.push(line);
            line = '';
          }
          line += char;
        }
      }
      result.push(line);
    }
    return result;
  };
  const draw = (text: string, heading = false) => {
    if (heading && y < 110) newPage();
    const size = heading ? 12 : 10;
    const font = heading ? bold : normal;
    for (const line of wrap(text, font, size)) {
      if (y < 68) newPage();
      page.drawText(line, {
        x: margin,
        y,
        size,
        font,
        color: rgb(0.12, 0.16, 0.2),
      });
      y -= heading ? 19 : 15;
    }
    y -= 5;
  };
  try {
    newPage();
    draw(doc.notice, true);
    draw(doc.organization);
    draw(`Tanggal: ${doc.date}   |   Berlaku sampai: ${doc.validUntil}`);
    draw('Kepada: ' + doc.customer, true);
    for (const [index, item] of doc.items.entries()) {
      draw(`${index + 1}. ${item.description}`, true);
      draw(`${item.quantity} x ${item.unitPrice}`);
      draw('Jumlah setelah diskon: ' + item.subtotal);
      for (const line of item.specifications) draw(line);
    }
    draw('RINGKASAN HARGA', true);
    draw('Subtotal produk: ' + doc.subtotal);
    draw('Diskon: ' + doc.discount);
    draw('Ongkir pelanggan: ' + doc.shipping);
    draw('TOTAL: ' + doc.total, true);
    draw('KETENTUAN', true);
    draw('Estimasi pengerjaan: ' + doc.leadTime);
    draw('Pembayaran: ' + doc.terms);
    if (doc.notes) draw(doc.notes);
    draw('Konfirmasi pesanan dengan menyebutkan nomor dan versi penawaran.');
    for (const [index, p] of pages.entries()) {
      p.drawText(
        `${doc.number} / v${doc.version} - ${doc.notice} - ${index + 1} / ${pages.length}`,
        { x: margin, y: 32, size: 8, font: normal, color: rgb(0.4, 0.4, 0.4) },
      );
    }
    return pdf.save();
  } catch (error) {
    if (error instanceof Error && /encode|WinAnsi/.test(error.message))
      throw new Error(
        'PDF belum mendukung sebagian karakter pada teks. Gunakan dokumen cetak browser atau ubah karakter tersebut.',
      );
    throw error;
  }
}
