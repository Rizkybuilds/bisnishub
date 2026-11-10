import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getAllPreviewProducts,
  getPreviewProductBySlug,
  ILLUSTRATIVE_UX_PRICE_IDR,
  formatIllustrativePrice,
  formatIllustrativeShortPrice,
} from '../apps/teestock/src/data/products';
import {
  getWhatsAppNumber,
  generateWhatsAppOrderUrl,
  isWhatsAppConfigured,
} from '../apps/teestock/src/lib/whatsapp';
import {
  getProductPresentationPolicy,
  ILLUSTRATIVE_PRICE_BADGE_LABEL,
} from '../apps/teestock/src/lib/product-policy';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../apps/teestock/src');
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('TeeStock retail product preview & PDP (NOV15-01)', () => {
  it('defines valid preview product fixtures with stable unique slugs', () => {
    const products = getAllPreviewProducts();
    expect(products.length).toBeGreaterThanOrEqual(3);
    expect(products.length).toBeLessThanOrEqual(5);

    const slugs = new Set<string>();
    const ids = new Set<string>();

    for (const p of products) {
      // Slugs must be lowercase URL-safe strings
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugs.has(p.slug)).toBe(false);
      slugs.add(p.slug);

      // IDs must be clearly synthetic and distinguishable from live SKUs
      expect(p.id).toMatch(/^study-\d{3}-[a-z0-9-]+$/);
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);

      // Must be explicitly marked preview-only & not for sale
      expect(p.previewOnly).toBe(true);
      expect(p.availability).toBe('NOT_FOR_SALE');
      expect(p.isCommerciallyApproved).toBe(false);
      expect(p.materialPendingVerification).toBe(true);

      // Shared single-source price
      expect(p.illustrativePriceIdr).toBe(ILLUSTRATIVE_UX_PRICE_IDR);

      // Care guidelines must disclaim unverified status
      expect(p.careGuidelinesPending.length).toBeGreaterThanOrEqual(1);
      expect(p.careGuidelinesPending[0]).toContain('belum diterbitkan');

      // Must provide size and color choices
      expect(p.previewSizes.length).toBeGreaterThanOrEqual(4);
      expect(p.previewColors.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('provides single-source illustrative price formatters', () => {
    expect(formatIllustrativePrice(189000)).toMatch(/189/);
    expect(formatIllustrativeShortPrice(189000)).toBe('Rp 189rb');
  });

  it('resolves every product slug correctly and handles unknown slugs via notFound', () => {
    const products = getAllPreviewProducts();
    for (const p of products) {
      const resolved = getPreviewProductBySlug(p.slug);
      expect(resolved).toBeDefined();
      expect(resolved?.id).toBe(p.id);
      expect(resolved?.title).toBe(p.title);
    }

    // Unknown slug returns undefined (triggering notFound() in page component)
    expect(getPreviewProductBySlug('non-existent-product')).toBeUndefined();
    expect(getPreviewProductBySlug('random-12345')).toBeUndefined();
  });

  it('implements PDP route with notFound call on unknown slug', () => {
    const pdpPage = read('app/shop/[slug]/page.tsx');
    expect(pdpPage).toContain('notFound()');
    expect(pdpPage).toContain('getPreviewProductBySlug(slug)');
    expect(pdpPage).toContain('ProductDetailViewer');
  });

  it('ensures PDP viewer provides truthful preview details without claiming release pricing or active buying (R2-PDP-01, TS-WEB-G01)', () => {
    const viewer = read('components/ProductDetailViewer.tsx');

    // Fail-Closed: Never claim official release price or active direct buying for preview products
    expect(viewer).not.toContain('Harga Resmi Rilis');
    expect(viewer).not.toContain('Beli via WhatsApp Sekarang');
    expect(viewer).not.toContain('Pemesanan Terbuka via WhatsApp');

    // Positive presentation: Truthful illustrative UX price badge & studio preview notice
    expect(viewer).toContain('presentationPolicy.priceBadgeLabel');
    expect(viewer).toContain('presentationPolicy.statusHeading');
    expect(viewer).toContain('retail-btn-whatsapp-order');
    expect(viewer).toContain('generateWhatsAppOrderUrl');
    expect(viewer).toContain('retail-action-disabled');
    expect(viewer).toContain('Pemesanan Belum Dibuka');

    // Product Truth: Clearly qualified specifications and release pricing
    expect(viewer).toContain('Spesifikasi Bahan');
    expect(viewer).toContain('Belum Ditetapkan');
    expect(viewer).toContain('Rencana Kurasi Studio');
    expect(viewer).toContain('Belum ada vendor, sampel fisik');
    expect(viewer).not.toContain('100% Cotton Combed');
    expect(viewer).not.toContain('Direct-to-Film (DTF) High-Definition');

    // Conceptual print treatment clarification (R2-PDP-04)
    expect(viewer).toContain(
      'Eksplorasi Konseptual (Tidak Dirender pada Pratinjau)',
    );

    // Negative protections: strictly no unverified checkout links or client persistence
    expect(viewer).not.toContain('href="/cart"');
    expect(viewer).not.toContain('href="/checkout"');
    expect(viewer).not.toContain('localStorage');
    expect(viewer).not.toContain('fetch(');
  });

  it('enforces fail-closed WhatsApp contact resolution without fake or placeholder phone numbers (TS-WEB-G02)', () => {
    const originalEnv = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    try {
      // 1. Unset env fails closed to null (no fallback to 6281234567890)
      delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      expect(getWhatsAppNumber()).toBeNull();
      expect(isWhatsAppConfigured()).toBe(false);
      expect(
        generateWhatsAppOrderUrl({
          productTitle: 'Slow Sunday Tee',
          color: 'Forest Ink',
          size: 'L',
        }),
      ).toBeNull();

      // 2. Known example number fails closed to null
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '6281234567890';
      expect(getWhatsAppNumber()).toBeNull();
      expect(isWhatsAppConfigured()).toBe(false);

      // 3. Invalid format (<10 digits) fails closed
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '12345';
      expect(getWhatsAppNumber()).toBeNull();

      // 4. Valid configured number produces inquiry URL without payment requests
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = '6289988776655';
      expect(getWhatsAppNumber()).toBe('6289988776655');
      expect(isWhatsAppConfigured()).toBe(true);

      const url = generateWhatsAppOrderUrl({
        productTitle: 'Slow Sunday Tee',
        color: 'Forest Ink',
        size: 'L',
        priceFormatted: 'Rp 189.000',
      });
      expect(url).toBeDefined();
      expect(url).toContain('https://wa.me/6289988776655?text=');
      // Crucial: Must be inquiry, must NOT ask for bank account or payment transfer
      expect(decodeURIComponent(url!)).toContain(
        'Saya ingin menanyakan informasi & ketersediaan',
      );
      expect(decodeURIComponent(url!)).not.toContain(
        'nomor rekening pembayarannya',
      );
      expect(decodeURIComponent(url!)).not.toContain(
        'Beli via WhatsApp Sekarang',
      );
    } finally {
      if (originalEnv !== undefined) {
        process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = originalEnv;
      } else {
        delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
      }
    }
  });

  it('enforces centralized product presentation policy that marks all preview fixtures as non-sellable (TS-WEB-G01)', () => {
    const products = getAllPreviewProducts();
    for (const p of products) {
      const policyUnconfigured = getProductPresentationPolicy(p, false);
      expect(policyUnconfigured.canBuy).toBe(false);
      expect(policyUnconfigured.canInquire).toBe(false);
      expect(policyUnconfigured.priceBadgeLabel).toBe(
        ILLUSTRATIVE_PRICE_BADGE_LABEL,
      );
      expect(policyUnconfigured.actionButtonLabel).toBe(
        'Pemesanan Belum Dibuka',
      );
      expect(policyUnconfigured.isSimulatedOnly).toBe(true);

      const policyConfigured = getProductPresentationPolicy(p, true);
      expect(policyConfigured.canBuy).toBe(false);
      expect(policyConfigured.canInquire).toBe(true);
      expect(policyConfigured.actionButtonLabel).toBe(
        'Tanya Ketersediaan via WhatsApp',
      );
    }
  });

  it('implements accessible native radio pattern with valid fieldset/legend structure (R2-PDP-02)', () => {
    const viewer = read('components/ProductDetailViewer.tsx');

    // Native radio inputs
    expect(viewer).toContain('type="radio"');
    expect(viewer).toContain('className="retail-sr-radio"');

    // Valid fieldset and legend structure without invalid nesting
    expect(viewer).toContain('<fieldset className="retail-variant-group">');
    expect(viewer).toContain('<legend className="retail-variant-label">');
    expect(viewer).not.toMatch(/<div[^>]*>\s*<legend/); // No legend nested inside div

    // Size guide disclosure button
    expect(viewer).toContain('aria-expanded={isSizeGuideOpen}');
    expect(viewer).toContain('aria-controls="size-guide-panel"');
  });

  it('links from catalog showcase to PDP routes with single-source price badges', () => {
    const showcase = read('components/RetailShowcase.tsx');
    expect(showcase).toContain("href={'/shop/' + design.id}");
    expect(showcase).toContain('Detail Studi Produk');
    expect(showcase).toContain('getPreviewProductBySlug(design.id)');
    expect(showcase).toContain('formatIllustrativeShortPrice');
    expect(showcase).toContain('(Simulasi UX)');
  });

  it('includes accessible responsive styles for PDP in retail.css', () => {
    const css = read('app/retail.css');
    expect(css).toContain('.retail-pdp');
    expect(css).toContain('.retail-pdp-grid');
    expect(css).toContain('.retail-color-btn');
    expect(css).toContain('.retail-size-btn');
    expect(css).toContain('.retail-action-disabled');
    expect(css).toContain('.retail-sr-radio');
    expect(css).toContain(':has(.retail-sr-radio:focus-visible)');
    expect(css).toContain('@media (max-width: 960px)');
    expect(css).toContain('@media (max-width: 360px)');
    expect(css).toContain('overflow-wrap: break-word');
  });
});
