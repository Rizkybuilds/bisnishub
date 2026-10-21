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
  previewOnly: true;
  availability: 'NOT_FOR_SALE';
  isCommerciallyApproved: false;
  materialPendingVerification: true;
  careGuidelinesPending: readonly string[];
}

export const ILLUSTRATIVE_UX_PRICE_IDR = 189000;

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
  'Petunjuk pencucian dan perawatan resmi belum diterbitkan.',
  'Instruksi perawatan akan disusun setelah pengujian ketahanan cuci pada sampel fisik garmen selesai.',
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
    illustrativePriceIdr: ILLUSTRATIVE_UX_PRICE_IDR,
    previewOnly: true,
    availability: 'NOT_FOR_SALE',
    isCommerciallyApproved: false,
    materialPendingVerification: true,
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
    illustrativePriceIdr: ILLUSTRATIVE_UX_PRICE_IDR,
    previewOnly: true,
    availability: 'NOT_FOR_SALE',
    isCommerciallyApproved: false,
    materialPendingVerification: true,
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
    illustrativePriceIdr: ILLUSTRATIVE_UX_PRICE_IDR,
    previewOnly: true,
    availability: 'NOT_FOR_SALE',
    isCommerciallyApproved: false,
    materialPendingVerification: true,
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
    illustrativePriceIdr: ILLUSTRATIVE_UX_PRICE_IDR,
    previewOnly: true,
    availability: 'NOT_FOR_SALE',
    isCommerciallyApproved: false,
    materialPendingVerification: true,
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
