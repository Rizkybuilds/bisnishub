/**
 * TeeStock WhatsApp Direct Commerce & Assisted Sales Helper
 *
 * Provides single-source generation of formatted WhatsApp order messages,
 * ensuring seamless direct purchasing without requiring third-party payment gateways.
 */

export const DEFAULT_WHATSAPP_NUMBER = '6281234567890';

export function getWhatsAppNumber(): string {
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!envNumber) {
    return DEFAULT_WHATSAPP_NUMBER;
  }
  // Sanitize: strip non-digits (e.g., +62 812-3456 -> 628123456)
  const cleaned = envNumber.replace(/\D/g, '');
  return cleaned || DEFAULT_WHATSAPP_NUMBER;
}

export interface WhatsAppOrderDetails {
  productTitle: string;
  color: string;
  size: string;
  printTone?: string;
  quantity?: number;
  priceFormatted?: string;
}

export function generateWhatsAppOrderUrl(
  details: WhatsAppOrderDetails,
): string {
  const phone = getWhatsAppNumber();
  const qty = details.quantity && details.quantity > 0 ? details.quantity : 1;

  const lines = [
    `Halo TeeStock! Saya ingin memesan:`,
    ``,
    `* ${details.productTitle}`,
    `  • Warna: ${details.color}`,
    `  • Ukuran: ${details.size}`,
  ];

  if (details.printTone) {
    lines.push(`  • Varian: ${details.printTone}`);
  }

  lines.push(`  • Jumlah: ${qty} pcs`);

  if (details.priceFormatted) {
    lines.push(`  • Harga: ${details.priceFormatted}`);
  }

  lines.push(
    ``,
    `Mohon info ketersediaan stok, total ongkos kirim, dan nomor rekening pembayarannya ya. Terima kasih!`,
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
  unitPriceIdr?: number;
}

export function generateWhatsAppCartOrderUrl(
  items: readonly CartLineSummary[],
): string {
  const phone = getWhatsAppNumber();

  if (!items || items.length === 0) {
    return `https://wa.me/${phone}?text=${encodeURIComponent('Halo TeeStock! Saya ingin menanyakan koleksi apparel yang tersedia.')}`;
  }

  const lines = [
    `Halo TeeStock! Saya ingin memesan koleksi berikut dari website:`,
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
    `Mohon info ketersediaan stok, total ongkos kirim, dan nomor rekening pembayarannya ya. Terima kasih!`,
  );

  const message = lines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppContactUrl(): string {
  const phone = getWhatsAppNumber();
  const message = `Halo TeeStock! Saya ingin konsultasi seputar apparel, pemesanan kaos, atau solusi merchandise kustom.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
