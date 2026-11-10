/**
 * TeeStock Product Action & Truth Eligibility Policy
 *
 * Provides a single, centralized truth source deriving whether a product
 * is eligible for commercial purchase, studio inquiry, or preview-only exploration.
 *
 * Fail-Closed Rule:
 * Any product with previewOnly=true, availability='NOT_FOR_SALE',
 * isCommerciallyApproved=false, or materialPendingVerification=true
 * MUST NEVER permit a commercial buy or payment action.
 */

import type { PreviewProduct } from '../data/products';

export const ILLUSTRATIVE_PRICE_BADGE_LABEL =
  'Simulasi Harga UX — Bukan Harga Rilis';

export interface ProductPresentationPolicy {
  canBuy: false;
  canInquire: boolean;
  priceBadgeLabel: string;
  statusBadgeLabel: string;
  statusHeading: string;
  statusDescription: string;
  actionButtonLabel: string;
  actionDisclaimer: string;
  isSimulatedOnly: true;
}

export function getProductPresentationPolicy(
  product: Pick<
    PreviewProduct,
    | 'previewOnly'
    | 'availability'
    | 'isCommerciallyApproved'
    | 'materialPendingVerification'
  >,
  isContactConfigured: boolean = false,
): ProductPresentationPolicy {
  const isPreviewOnly =
    product.previewOnly ||
    product.availability === 'NOT_FOR_SALE' ||
    !product.isCommerciallyApproved ||
    product.materialPendingVerification;

  if (isPreviewOnly) {
    return {
      canBuy: false,
      canInquire: isContactConfigured,
      priceBadgeLabel: ILLUSTRATIVE_PRICE_BADGE_LABEL,
      statusBadgeLabel: 'STUDI DESAIN',
      statusHeading: 'Tahap Pratinjau Desain Studio',
      statusDescription:
        'Produk ini merupakan studi eksplorasi visual dan belum tersedia untuk pemesanan komersial.',
      actionButtonLabel: isContactConfigured
        ? 'Tanya Ketersediaan via WhatsApp'
        : 'Pemesanan Belum Dibuka',
      actionDisclaimer: isContactConfigured
        ? 'Layanan konsultasi studio. Produk ini berstatus pratinjau dan belum menerima pembayaran atau pesanan komersial langsung.'
        : 'Produk berstatus studi kurasi desain studio. Saluran kontak pemesanan langsung belum dibuka untuk publik.',
      isSimulatedOnly: true,
    };
  }

  // Fail closed if an unverified commercial state is encountered
  throw new Error(
    'Commercial products require authoritative verification contract before presentation.',
  );
}
