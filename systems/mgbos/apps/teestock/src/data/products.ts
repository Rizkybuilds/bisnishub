export type PreviewSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type PreviewGarmentColor = {
  id: 'forest-ink' | 'chalk-bone';
  name: string;
  tone: 'ink' | 'chalk';
  hex: string;
  description: string;
};

export type PreviewPrintTone = {
  id: 'standard-screen' | 'vintage-wash';
  name: string;
  description: string;
};

export interface PromoRule {
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'BUNDLE';
  value: number;
  description: string;
}

export interface PreviewProduct {
  id: string;
  slug: string;
  title: string;
  series: 'Studio Notes' | 'Off-Duty';
  tagline: string;
  story: string;
  conceptDesignId: string;
  lineOne: string;
  lineTwo: string;
  motif: 'sun' | 'orbit' | 'flower' | 'waves' | 'spark' | 'grid';
  palette: 'clay' | 'sage' | 'lilac' | 'sky' | 'butter' | 'rose';
  previewSizes: readonly PreviewSize[];
  previewColors: readonly PreviewGarmentColor[];
  previewPrintTones: readonly PreviewPrintTone[];
  illustrativePriceIdr: number;
  compareAtPriceIdr?: number;
  previewOnly: boolean;
  availability: 'AVAILABLE' | 'NOT_FOR_SALE';
  isCommerciallyApproved: boolean;
  materialPendingVerification: boolean;
  careGuidelinesPending: readonly string[];
}

// Default dynamic baseline price set by Founder
export const DEFAULT_DYNAMIC_PRICE_IDR = 99000;
export const DEFAULT_COMPARE_AT_PRICE_IDR = 129000;
export const ILLUSTRATIVE_UX_PRICE_IDR = DEFAULT_DYNAMIC_PRICE_IDR;

// Pre-configured active promotional vouchers
export const ACTIVE_PROMO_VOUCHERS: readonly PromoRule[] = [
  {
    code: 'HEMAT10',
    type: 'PERCENTAGE',
    value: 10,
    description: 'Diskon 10% Spesial Peluncuran Toko',
  },
  {
    code: 'BELI2HEMAT',
    type: 'BUNDLE',
    value: 20000,
    description: 'Potongan Rp 20.000 untuk pembelian 2 kaos atau lebih',
  },
] as const;

export function evaluatePromoDiscount(
  subtotal: number,
  quantity: number,
  promoCode?: string | null,
): { discountAmount: number; appliedPromo?: PromoRule; error?: string } {
  if (!promoCode || !promoCode.trim()) {
    return { discountAmount: 0 };
  }

  const cleanCode = promoCode.trim().toUpperCase();
  const promo = ACTIVE_PROMO_VOUCHERS.find((p) => p.code === cleanCode);

  if (!promo) {
    return { discountAmount: 0, error: 'Kode voucher tidak valid.' };
  }

  if (promo.type === 'PERCENTAGE') {
    const discount = Math.round((subtotal * promo.value) / 100);
    return { discountAmount: discount, appliedPromo: promo };
  }

  if (promo.type === 'FIXED') {
    const discount = Math.min(subtotal, promo.value);
    return { discountAmount: discount, appliedPromo: promo };
  }

  if (promo.type === 'BUNDLE') {
    if (quantity < 2) {
      return {
        discountAmount: 0,
        error: 'Voucher ini berlaku minimal pembelian 2 kaos.',
      };
    }
    const discount = Math.min(subtotal, promo.value);
    return { discountAmount: discount, appliedPromo: promo };
  }

  return { discountAmount: 0 };
}

export function formatIllustrativePrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatIllustrativeShortPrice(price: number): string {
  return `Rp ${Math.round(price / 1000)}rb`;
}

export function buildWhatsAppOrderUrl(params: {
  productTitle: string;
  colorName: string;
  size: string;
  quantity?: number;
  unitPriceIdr?: number;
  promoCode?: string | null;
  discountAmount?: number;
  refCode?: string | null;
  whatsappNumber?: string;
}): string {
  const number =
    params.whatsappNumber ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER) ||
    '6281200000000';
  const cleanNumber = number.replace(/[^0-9]/g, '');
  const qty = params.quantity ?? 1;
  const unitPrice = params.unitPriceIdr ?? DEFAULT_DYNAMIC_PRICE_IDR;
  const subtotal = unitPrice * qty;
  const discount = params.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const subtotalStr = subtotal.toLocaleString('id-ID');
  const totalStr = total.toLocaleString('id-ID');
  const discountStr = discount > 0 ? discount.toLocaleString('id-ID') : null;

  let promoSection = '';
  if (params.promoCode && discountStr) {
    promoSection = `🧾 Subtotal: Rp ${subtotalStr}\n🎟️ Voucher: ${params.promoCode.toUpperCase()} (-Rp ${discountStr})\n`;
  }

  const refSection = params.refCode ? `\n[Ref Mitra: ${params.refCode}]` : '';

  const message =
    `Halo TeeStock, saya mau order kaos ini:\n\n` +
    `👕 Artikel: ${params.productTitle}\n` +
    `🎨 Warna: ${params.colorName}\n` +
    `📏 Ukuran: ${params.size}\n` +
    `📦 Jumlah: ${qty} pcs\n` +
    `💵 Harga Satuan: Rp ${unitPrice.toLocaleString('id-ID')}\n` +
    promoSection +
    `💰 Total Belanja: Rp ${totalStr}${refSection}\n\n` +
    `Mohon info ketersediaan stok, estimasi ongkir, dan instruksi rekening/QRIS untuk pembayarannya. Terima kasih!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export const PREVIEW_GARMENT_COLORS: readonly PreviewGarmentColor[] = [
  {
    id: 'forest-ink',
    name: 'Forest Ink',
    tone: 'ink',
    hex: '#263129',
    description:
      'Hijau gelap earthy khas TeeStock, bernuansa tenang dan teduh.',
  },
  {
    id: 'chalk-bone',
    name: 'Chalk Bone',
    tone: 'chalk',
    hex: '#f4f0e5',
    description:
      'Krem natural berkarakter raw, tidak mencolok dan mudah dipadukan.',
  },
] as const;

export const PREVIEW_SIZES: readonly PreviewSize[] = [
  'S',
  'M',
  'L',
  'XL',
  'XXL',
] as const;

export const PREVIEW_PRINT_TONES: readonly PreviewPrintTone[] = [
  {
    id: 'standard-screen',
    name: 'Standard Contrast',
    description:
      'Arah palet kontras studio standar. Opsi konseptual, tidak mengubah rendering simulasi visual.',
  },
  {
    id: 'vintage-wash',
    name: 'Subtle Accent',
    description:
      'Arah palet washed vintage yang lembut. Opsi konseptual, tidak mengubah rendering simulasi visual.',
  },
] as const;

export const PREVIEW_CARE_GUIDELINES_PENDING: readonly string[] = [
  'Cuci menggunakan air dingin atau suhu normal bersama pakaian sewarna.',
  'Hindari menyikat langsung di atas permukaan sablon DTF.',
  'Setrika dari bagian dalam pakaian; jangan setrika langsung permukaan gambar.',
  'Jangan gunakan pemutih berbahan klorin keras.',
] as const;

export const previewProducts: readonly PreviewProduct[] = [
  {
    id: 'study-001-slow-sunday',
    slug: 'slow-sunday',
    title: 'Slow Sunday Heavyweight Tee',
    series: 'Off-Duty',
    tagline: 'Ruang untuk bergerak lebih pelan.',
    story:
      'Sebuah pengingat visual untuk mengambil jeda di tengah ritme keseharian yang serba cepat. Grafis matahari terbit sederhana di atas siluet apparel yang santai namun berstruktur.',
    conceptDesignId: 'slow-sunday',
    lineOne: 'SLOW',
    lineTwo: 'SUNDAY',
    motif: 'sun',
    palette: 'clay',
    previewSizes: PREVIEW_SIZES,
    previewColors: PREVIEW_GARMENT_COLORS,
    previewPrintTones: PREVIEW_PRINT_TONES,
    illustrativePriceIdr: DEFAULT_DYNAMIC_PRICE_IDR,
    compareAtPriceIdr: DEFAULT_COMPARE_AT_PRICE_IDR,
    previewOnly: false,
    availability: 'AVAILABLE',
    isCommerciallyApproved: true,
    materialPendingVerification: false,
    careGuidelinesPending: PREVIEW_CARE_GUIDELINES_PENDING,
  },
  {
    id: 'study-002-making-things',
    slug: 'making-things',
    title: 'Making Things Studio Tee',
    series: 'Studio Notes',
    tagline: 'Ide kecil, hari yang panjang.',
    story:
      'Didedikasikan untuk proses berkarya: eksplorasi, trial-and-error, dan kegembiraan melihat ide sederhana di atas meja kerja berubah menjadi karya nyata yang berarti.',
    conceptDesignId: 'making-things',
    lineOne: 'MAKING',
    lineTwo: 'THINGS',
    motif: 'orbit',
    palette: 'sage',
    previewSizes: PREVIEW_SIZES,
    previewColors: PREVIEW_GARMENT_COLORS,
    previewPrintTones: PREVIEW_PRINT_TONES,
    illustrativePriceIdr: DEFAULT_DYNAMIC_PRICE_IDR,
    compareAtPriceIdr: DEFAULT_COMPARE_AT_PRICE_IDR,
    previewOnly: false,
    availability: 'AVAILABLE',
    isCommerciallyApproved: true,
    materialPendingVerification: false,
    careGuidelinesPending: PREVIEW_CARE_GUIDELINES_PENDING,
  },
  {
    id: 'study-003-ordinary-magic',
    slug: 'ordinary-magic',
    title: 'Ordinary Magic Relaxed Tee',
    series: 'Off-Duty',
    tagline: 'Menemukan cerita di keseharian.',
    story:
      'Melihat keindahan pada momen-momen kecil yang sering terlewatkan. Ilustrasi floral geometris dengan sentuhan palet lembut yang menghidupkan suasana tanpa berlebihan.',
    conceptDesignId: 'ordinary-magic',
    lineOne: 'ORDINARY',
    lineTwo: 'MAGIC',
    motif: 'flower',
    palette: 'lilac',
    previewSizes: PREVIEW_SIZES,
    previewColors: PREVIEW_GARMENT_COLORS,
    previewPrintTones: PREVIEW_PRINT_TONES,
    illustrativePriceIdr: DEFAULT_DYNAMIC_PRICE_IDR,
    compareAtPriceIdr: DEFAULT_COMPARE_AT_PRICE_IDR,
    previewOnly: false,
    availability: 'AVAILABLE',
    isCommerciallyApproved: true,
    materialPendingVerification: false,
    careGuidelinesPending: PREVIEW_CARE_GUIDELINES_PENDING,
  },
  {
    id: 'study-004-stay-curious',
    slug: 'stay-curious',
    title: 'Stay Curious Boxy Tee',
    series: 'Studio Notes',
    tagline: 'Rasa ingin tahu tidak pernah usang.',
    story:
      'Eksplorasi garis ombak berulang yang melambangkan pencarian tanpa henti. Dibuat untuk mereka yang selalu penasaran dan berani mengajukan pertanyaan baru.',
    conceptDesignId: 'stay-curious',
    lineOne: 'STAY',
    lineTwo: 'CURIOUS',
    motif: 'waves',
    palette: 'sky',
    previewSizes: PREVIEW_SIZES,
    previewColors: PREVIEW_GARMENT_COLORS,
    previewPrintTones: PREVIEW_PRINT_TONES,
    illustrativePriceIdr: DEFAULT_DYNAMIC_PRICE_IDR,
    compareAtPriceIdr: DEFAULT_COMPARE_AT_PRICE_IDR,
    previewOnly: false,
    availability: 'AVAILABLE',
    isCommerciallyApproved: true,
    materialPendingVerification: false,
    careGuidelinesPending: PREVIEW_CARE_GUIDELINES_PENDING,
  },
] as const;

export function getAllPreviewProducts(): readonly PreviewProduct[] {
  return previewProducts;
}

export function getPreviewProductBySlug(
  slug: string,
): PreviewProduct | undefined {
  return previewProducts.find((p) => p.slug === slug);
}
