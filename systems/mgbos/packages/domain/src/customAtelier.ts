export const ATELIER_SCHEMA = 'teestock.custom_atelier.v1' as const;
export const GARMENT_TYPES = [
  'T-Shirt',
  'Oversized T-Shirt',
  'Polo Shirt',
  'Hoodie',
  'Crewneck',
  'Jersey',
  'Shirt',
  'Other',
] as const;
export const GARMENT_FITS = [
  'Regular',
  'Oversized',
  'Slim',
  'Custom',
  'N/A',
] as const;
export const GARMENT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export const DECORATION_METHODS = [
  'Screen Printing',
  'DTF',
  'DTG',
  'Embroidery',
  'Heat Transfer',
  'Other',
] as const;
export const DECORATION_LOCATIONS = [
  'Front',
  'Back',
  'Left Chest',
  'Right Chest',
  'Left Sleeve',
  'Right Sleeve',
  'Custom',
] as const;
export interface CustomAtelierSpecification {
  schemaCode: typeof ATELIER_SCHEMA;
  garment: {
    type: (typeof GARMENT_TYPES)[number];
    fit: (typeof GARMENT_FITS)[number];
    material: string;
    color: string;
    gsm: number | null;
    blankPreference: string;
  };
  sizes: Record<(typeof GARMENT_SIZES)[number], number> | null;
  decorations: {
    location: (typeof DECORATION_LOCATIONS)[number];
    method: (typeof DECORATION_METHODS)[number];
    widthCm: number | null;
    heightCm: number | null;
    colors: number | null;
    artworkReference: string;
    notes: string;
  }[];
  customization: string;
}
export function atelierMissingInformation(
  spec: CustomAtelierSpecification,
): string[] {
  const missing: string[] = [];
  if (!spec.sizes) missing.push('Rincian ukuran');
  if (!spec.decorations.length)
    missing.push('Konfirmasi dekorasi / tanpa dekorasi');
  for (const item of spec.decorations) {
    if (item.widthCm === null || item.heightCm === null)
      missing.push(`Dimensi ${item.location}`);
    if (!item.artworkReference)
      missing.push(`Referensi artwork ${item.location}`);
  }
  return missing;
}
