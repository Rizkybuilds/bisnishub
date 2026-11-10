/**
 * TeeStock WhatsApp Assisted Inquiry & Contact Helper
 *
 * Provides fail-closed generation of formatted WhatsApp messages for studio inquiries.
 * Does NOT generate commercial payment requests or transmit simulated pricing for preview items.
 */

const KNOWN_PLACEHOLDER_NUMBERS = new Set([
  '6281234567890',
  '081234567890',
  '1234567890',
]);

/**
 * Validates and normalizes an Indonesian WhatsApp contact number according to a
 * deterministic international contract (wa.me/<country-code><mobile-digits>):
 *
 * 1. Strips all non-digit characters.
 * 2. Safely normalizes national Indonesian mobile numbers starting with '08' to '628'.
 * 3. Requires the normalized number to start with '628' (Indonesian mobile prefix).
 * 4. Rejects local fixed-lines (e.g. 021), non-mobile prefixes, or other countries.
 * 5. Requires total normalized length between 11 and 15 digits (standard E.164 Indonesian mobile).
 * 6. Fails closed (returns null) for missing, invalid, malformed, or known placeholder numbers.
 */
export function getWhatsAppNumber(): string | null {
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!envNumber || typeof envNumber !== 'string') {
    return null;
  }

  const cleaned = envNumber.replace(/\D/g, '');
  if (!cleaned) {
    return null;
  }

  // Reject raw placeholder before normalization
  if (KNOWN_PLACEHOLDER_NUMBERS.has(cleaned)) {
    return null;
  }

  // Deterministic normalization of national Indonesian mobile (08... -> 628...)
  let normalized = cleaned;
  if (cleaned.startsWith('08')) {
    normalized = '62' + cleaned.slice(1);
  }

  // Enforce international Indonesian mobile prefix '628'
  if (!normalized.startsWith('628')) {
    return null;
  }

  // Indonesian mobile numbers in international 628 format are between 11 and 15 digits
  if (normalized.length < 11 || normalized.length > 15) {
    return null;
  }

  // Reject normalized placeholder (e.g. 081234567890 -> 6281234567890)
  if (KNOWN_PLACEHOLDER_NUMBERS.has(normalized)) {
    return null;
  }

  return normalized;
}

export function isWhatsAppConfigured(): boolean {
  return getWhatsAppNumber() !== null;
}

export interface WhatsAppInquiryDetails {
  productTitle: string;
  color: string;
  size: string;
  printTone?: string;
  quantity?: number;
}

/**
 * Generates an assisted inquiry URL for a preview product.
 * Returns null if WhatsApp is unconfigured/invalid.
 * Strictly avoids transmitting simulated pricing or requesting payment details.
 */
export function generateWhatsAppOrderUrl(
  details: WhatsAppInquiryDetails,
): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) {
    return null;
  }

  const qty = details.quantity && details.quantity > 0 ? details.quantity : 1;

  const lines = [
    `Halo TeeStock! Saya ingin menanyakan informasi & ketersediaan konsep apparel:`,
    ``,
    `* ${details.productTitle}`,
    `  • Warna: ${details.color}`,
    `  • Ukuran: ${details.size}`,
  ];

  if (details.printTone) {
    lines.push(`  • Varian: ${details.printTone}`);
  }

  lines.push(`  • Estimasi Kuantiti: ${qty} pcs`);

  lines.push(
    ``,
    `Catatan: Saya memahami produk ini berstatus studi desain/pratinjau. Mohon info apakah konsep ini nantinya akan dirilis secara resmi. Terima kasih!`,
  );

  const message = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export interface CartLineSummary {
  productTitle: string;
  colorName: string;
  size: string;
  printToneName?: string;
  quantity: number;
}

/**
 * Generates an inquiry URL for items selected in the demo cart.
 * Returns null if WhatsApp is unconfigured/invalid.
 */
export function generateWhatsAppCartOrderUrl(
  items: readonly CartLineSummary[],
): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) {
    return null;
  }

  if (!items || items.length === 0) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(
      'Halo TeeStock! Saya ingin menanyakan informasi seputar koleksi studi desain apparel.',
    )}`;
  }

  const lines = [
    `Halo TeeStock! Saya ingin menanyakan informasi dan konsultasi mengenai konsep desain berikut:`,
    ``,
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. *${item.productTitle}* (${item.quantity} pcs)`,
      `   • Warna: ${item.colorName}`,
      `   • Ukuran: ${item.size}`,
    );
    if (item.printToneName) {
      lines.push(`   • Varian: ${item.printToneName}`);
    }
  });

  lines.push(
    ``,
    `Catatan: Saya memahami ini merupakan konsultasi konsep studio dari keranjang simulasi dan bukan pesanan komersial langsung. Mohon info ketersediaan atau rencana rilisnya ya. Terima kasih!`,
  );

  const message = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates general support/contact WhatsApp URL.
 * Returns null if WhatsApp is unconfigured/invalid.
 */
export function getWhatsAppContactUrl(): string | null {
  const phone = getWhatsAppNumber();
  if (!phone) {
    return null;
  }
  const message = `Halo TeeStock! Saya ingin konsultasi seputar apparel atau informasi layanan.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
