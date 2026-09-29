/** Customer-facing allowlist. Never pass whole database rows to PDF/share renderers. */
export interface QuotationSource {
  quoteNumber: string;
  versionId: string;
  versionNumber: number;
  isCurrent: boolean;
  status: string;
  createdAt: string;
  validUntil: string;
  issuer: {
    brand_name?: string;
    brand_code?: string;
    organization_name?: string;
  };
  customer: { display_name?: string; legal_name?: string | null };
  terms: { payment_terms?: string; lead_time?: string; notes?: string };
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  items: {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: string;
    subtotal: string;
    specification: Record<string, unknown>;
  }[];
}
export interface QuotationDocument {
  number: string;
  versionId: string;
  version: number;
  date: string;
  validUntil: string;
  issuer: string;
  organization: string;
  customer: string;
  notice: string;
  items: {
    description: string;
    quantity: string;
    unitPrice: string;
    subtotal: string;
    specifications: string[];
  }[];
  subtotal: string;
  discount: string;
  shipping: string;
  total: string;
  terms: string;
  leadTime: string;
  notes: string;
}
const money = (n: string) => 'Rp ' + BigInt(n).toLocaleString('id-ID');
const text = (v: unknown) => (typeof v === 'string' ? v : '');
const object = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
export function customerSpecifications(
  spec: Record<string, unknown>,
): string[] {
  // Known commercial fields only. Arbitrary JSON may contain vendor costs or internal notes.
  if (spec.schemaCode !== 'teestock.custom_atelier.v1') return [];
  const garment = object(spec.garment);
  const lines: string[] = [];
  for (const [key, label] of [
    ['type', 'Pakaian'],
    ['fit', 'Fit'],
    ['material', 'Bahan'],
    ['color', 'Warna'],
  ] as const)
    if (text(garment[key])) lines.push(label + ': ' + text(garment[key]));
  if (typeof garment.gsm === 'number') lines.push('GSM: ' + garment.gsm);
  const sizes = object(spec.sizes);
  const sizeText = ['S', 'M', 'L', 'XL', 'XXL']
    .filter((k) => typeof sizes[k] === 'number')
    .map((k) => k + ': ' + sizes[k])
    .join(', ');
  if (sizeText) lines.push('Ukuran: ' + sizeText);
  if (Array.isArray(spec.decorations))
    for (const raw of spec.decorations) {
      const d = object(raw);
      const width = typeof d.widthCm === 'number' ? d.widthCm : '?';
      const height = typeof d.heightCm === 'number' ? d.heightCm : '?';
      if (text(d.location) && text(d.method))
        lines.push(
          'Dekorasi: ' +
            text(d.location) +
            ' / ' +
            text(d.method) +
            ' / ' +
            width +
            ' x ' +
            height +
            ' cm',
        );
    }
  if (text(spec.customization))
    lines.push('Tambahan: ' + text(spec.customization));
  return lines;
}
export function buildQuotationDocument(
  source: QuotationSource,
  today: string,
): QuotationDocument {
  if (!source.issuer.brand_name || !source.issuer.organization_name)
    throw new Error(
      'Identitas penerbit belum tersimpan. Buat revisi penawaran terlebih dahulu.',
    );
  if (!source.items.length) throw new Error('Penawaran tidak memiliki item.');
  const notice = !source.isCurrent
    ? 'ARSIP - VERSI TIDAK BERLAKU'
    : source.status === 'DRAFT'
      ? 'DRAF - BELUM UNTUK PELANGGAN'
      : source.status === 'ACCEPTED'
        ? 'PENAWARAN DISETUJUI'
        : source.status !== 'SENT'
          ? 'ARSIP - VERSI TIDAK BERLAKU'
          : source.validUntil < today
            ? 'KEDALUWARSA - PERLU PENAWARAN BARU'
            : 'PENAWARAN';
  return {
    number: source.quoteNumber,
    versionId: source.versionId,
    version: source.versionNumber,
    date: new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(source.createdAt)),
    validUntil: source.validUntil,
    issuer: source.issuer.brand_name,
    organization: source.issuer.organization_name,
    customer:
      source.customer.legal_name || source.customer.display_name || 'Pelanggan',
    notice,
    items: source.items.map((item) => ({
      description: item.description,
      quantity: item.quantity + ' ' + item.unit,
      unitPrice: money(item.unitPrice),
      subtotal: money(item.subtotal),
      specifications: customerSpecifications(item.specification),
    })),
    subtotal: money(source.subtotal),
    discount: money(source.discount),
    shipping: money(source.shipping),
    total: money(source.total),
    terms: source.terms.payment_terms ?? '',
    leadTime: source.terms.lead_time ?? '',
    notes: source.terms.notes ?? '',
  };
}
export function quotationMessage(doc: QuotationDocument): string {
  return [
    doc.notice,
    `${doc.issuer} | ${doc.organization}`,
    `Penawaran ${doc.number} / versi ${doc.version}`,
    `Untuk: ${doc.customer}`,
    `Tanggal: ${doc.date}`,
    `Berlaku sampai: ${doc.validUntil}`,
    '',
    ...doc.items.flatMap((item, i) => [
      `${i + 1}. ${item.description}`,
      `${item.quantity} x ${item.unitPrice}`,
      `Jumlah setelah diskon: ${item.subtotal}`,
      ...item.specifications,
    ]),
    '',
    `Subtotal: ${doc.subtotal}`,
    `Diskon: ${doc.discount}`,
    `Ongkir: ${doc.shipping}`,
    `Total: ${doc.total}`,
    `Estimasi pengerjaan: ${doc.leadTime}`,
    `Pembayaran: ${doc.terms}`,
    doc.notes,
    '',
    'Silakan konfirmasi nomor dan versi penawaran ini. Konfirmasi akan dicatat oleh tim.',
  ]
    .filter((line) => line !== undefined)
    .join('\n');
}
