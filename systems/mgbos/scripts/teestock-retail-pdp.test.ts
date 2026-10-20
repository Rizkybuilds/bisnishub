import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getAllPreviewProducts,
  getPreviewProductBySlug,
} from '../apps/teestock/src/data/products';

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

      // Must provide size and color choices
      expect(p.previewSizes.length).toBeGreaterThanOrEqual(4);
      expect(p.previewColors.length).toBeGreaterThanOrEqual(2);
    }
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

  it('ensures PDP viewer strictly enforces non-transactional preview status', () => {
    const viewer = read('components/ProductDetailViewer.tsx');

    // Non-commercial status and disclaimers
    expect(viewer).toContain('Tahap Preview Desain');
    expect(viewer).toContain('Belum Menerima Pesanan');
    expect(viewer).toContain('disabled');
    expect(viewer).toContain('aria-disabled="true"');

    // Variant selection controls
    expect(viewer).toContain('role="radiogroup"');
    expect(viewer).toContain('aria-checked');
    expect(viewer).toContain('aria-label');
    expect(viewer).toContain('Panduan ukuran');

    // Negative protections: strictly no cart or checkout links or WhatsApp direct ordering
    expect(viewer).not.toContain('href="/cart"');
    expect(viewer).not.toContain('href="/checkout"');
    expect(viewer).not.toContain('wa.me/');
    expect(viewer).not.toContain('localStorage');
    expect(viewer).not.toContain('fetch(');
  });

  it('links from catalog showcase to PDP routes with honest preview labels', () => {
    const showcase = read('components/RetailShowcase.tsx');
    expect(showcase).toContain("href={'/shop/' + design.id}");
    expect(showcase).toContain('Detail Studi Produk');
    expect(showcase).toContain('getPreviewProductBySlug(design.id)');
  });

  it('includes accessible responsive styles for PDP in retail.css', () => {
    const css = read('app/retail.css');
    expect(css).toContain('.retail-pdp');
    expect(css).toContain('.retail-pdp-grid');
    expect(css).toContain('.retail-color-btn');
    expect(css).toContain('.retail-size-btn');
    expect(css).toContain('.retail-action-disabled');
    expect(css).toContain('@media (max-width: 960px)');
    expect(css).toContain('@media (max-width: 360px)');
    expect(css).toContain('overflow-wrap: break-word');
  });
});
