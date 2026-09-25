import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import {
  buildQuotationDocument,
  quotationMessage,
  type QuotationSource,
} from '../apps/mgbos/src/lib/quotation/document';
import { renderQuotationPdf } from '../apps/mgbos/src/lib/quotation/pdf';
const source: QuotationSource = {
  quoteNumber: 'TS-QUO-2026-000123',
  versionId: '99999999-0000-4000-8000-000000000001',
  versionNumber: 2,
  isCurrent: true,
  status: 'SENT',
  createdAt: '2026-09-25T09:00:00Z',
  validUntil: '2026-10-02',
  issuer: { brand_name: 'TeeStock', organization_name: 'MultiGraph Group' },
  customer: { display_name: 'Pelanggan Contoh - DATA UJI' },
  terms: {
    payment_terms: 'DP 50%, pelunasan sebelum pengiriman.',
    lead_time: '7 hari kerja setelah persetujuan desain.',
    notes:
      'Harga sesuai rincian pesanan. Dokumen contoh pengujian, bukan penawaran nyata.',
  },
  subtotal: '5000000',
  discount: '100000',
  shipping: '50000',
  total: '4950000',
  items: [
    {
      description: 'Kaos komunitas - Cotton Combed 24s',
      quantity: 50,
      unit: 'PCS',
      unitPrice: '100000',
      subtotal: '4900000',
      specification: {
        schemaCode: 'teestock.custom_atelier.v1',
        garment: {
          type: 'T-Shirt',
          fit: 'Regular',
          material: 'Cotton Combed 24s',
          color: 'Hitam',
        },
        sizes: { S: 10, M: 15, L: 15, XL: 10, XXL: 0 },
        decorations: [
          {
            location: 'Front',
            method: 'DTF',
            widthCm: 20,
            heightCm: 25,
            notes: 'INTERNAL_SECRET_SENTINEL',
            artworkReference: 'INTERNAL_ASSET_SENTINEL',
          },
        ],
        customization: 'Polybag satuan',
        vendorCost: 'INTERNAL_COST_SENTINEL',
      },
    },
  ],
};
describe('Customer quotation projection', () => {
  it('uses the Jakarta business date across UTC midnight boundaries', () => {
    expect(
      buildQuotationDocument(
        { ...source, createdAt: '2026-09-24T18:00:00Z' },
        '2026-09-25',
      ).date,
    ).toBe('2026-09-25');
  });
  it('does not mark an already accepted current version expired', () => {
    expect(
      buildQuotationDocument({ ...source, status: 'ACCEPTED' }, '2026-10-03')
        .notice,
    ).toBe('PENAWARAN DISETUJUI');
  });
  it('uses explicit public fields and drops private specification fields', () => {
    const doc = buildQuotationDocument(
      {
        ...source,
        estimated_cost_total: 'INTERNAL_HPP_SENTINEL',
      } as QuotationSource,
      '2026-09-25',
    );
    const output = JSON.stringify(doc) + quotationMessage(doc);
    expect(output).toContain('Rp 4.950.000');
    expect(output).not.toContain('INTERNAL_');
    expect(output).not.toContain('estimated_cost');
  });
  it('retains source snapshots rather than consulting current catalog data', () => {
    const doc = buildQuotationDocument(source, '2026-09-25');
    expect(doc.issuer).toBe('TeeStock');
    expect(doc.version).toBe(2);
    expect(doc.items[0]?.specifications).toContain('Bahan: Cotton Combed 24s');
  });
  it.each([
    ['DRAFT', true, '2026-09-25', 'DRAF'],
    ['SENT', false, '2026-09-25', 'ARSIP'],
    ['SENT', true, '2026-10-03', 'KEDALUWARSA'],
    ['SENT', true, '2026-10-02', 'PENAWARAN'],
  ])('labels %s safely', (status, current, today, prefix) => {
    expect(
      buildQuotationDocument(
        { ...source, status: String(status), isCurrent: Boolean(current) },
        String(today),
      ).notice,
    ).toContain(String(prefix));
  });
  it('requires a captured issuer for legacy versions', () =>
    expect(() =>
      buildQuotationDocument({ ...source, issuer: {} }, '2026-09-25'),
    ).toThrow('Identitas penerbit'));
  it('does not expose unknown specification schemas', () => {
    const doc = buildQuotationDocument(
      {
        ...source,
        items: [
          { ...source.items[0]!, specification: { privateNotes: 'SECRET' } },
        ],
      },
      '2026-09-25',
    );
    expect(doc.items[0]?.specifications).toEqual([]);
  });
  it('renders PDF with wrapped long text and repeatable headers', async () => {
    const doc = buildQuotationDocument(source, '2026-09-25');
    const short = await renderQuotationPdf(doc);
    const long = await renderQuotationPdf({
      ...doc,
      notice: 'DRAF - BELUM UNTUK PELANGGAN',
      notes: Array.from(
        { length: 60 },
        (_, i) =>
          `Ketentuan contoh ${i + 1}: rincian pengerjaan disepakati berdasarkan versi penawaran yang tercatat.`,
      ).join('\n'),
    });
    expect(Buffer.from(short).subarray(0, 4).toString()).toBe('%PDF');
    expect(long.length).toBeGreaterThan(short.length);
    if (process.env.MGBOS_PDF_QA_DIR) {
      mkdirSync(process.env.MGBOS_PDF_QA_DIR, { recursive: true });
      writeFileSync(
        process.env.MGBOS_PDF_QA_DIR + '/quotation-example.pdf',
        short,
      );
      writeFileSync(process.env.MGBOS_PDF_QA_DIR + '/quotation-long.pdf', long);
    }
  });
  it('fails clearly for unsupported glyphs instead of silently corrupting text', async () => {
    const doc = buildQuotationDocument(source, '2026-09-25');
    await expect(
      renderQuotationPdf({ ...doc, customer: '漢字' }),
    ).rejects.toThrow('PDF belum mendukung');
  });
});
