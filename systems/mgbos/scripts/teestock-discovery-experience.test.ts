import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { conceptDesigns } from '../apps/teestock/src/components/RetailShowcase';
import {
  getAllPreviewProducts,
  getPreviewProductBySlug,
} from '../apps/teestock/src/data/products';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../apps/teestock/src');
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('TeeStock Premium Homepage & Curated Discovery Experience (TS-WEB-NOV26-03)', () => {
  it('communicates curated apparel discovery clearly on Homepage and routes to /shop', () => {
    const home = read('app/page.tsx');
    const cleanHome = home.replace(/\s+/g, ' ');

    // Editorial overline & headline hierarchy
    expect(cleanHome).toContain('A CURATED APPAREL HOUSE / INDONESIA');
    expect(cleanHome).toContain(
      'Everyday <br /> <em>wear,</em> <br /> extraordinary <br /> feeling.',
    );

    // Primary CTA routes directly to /shop ("The Edit")
    expect(home).toContain('href="/shop"');
    expect(home).toContain('Jelajahi koleksi');

    // Secondary navigation to brand story anchor
    expect(home).toContain('href="#retail-story"');
    expect(home).toContain('Kenali TeeStock');

    // Featured preview collection section
    expect(cleanHome).toContain('THE EDIT / PREVIEW 001');
    expect(cleanHome).toContain('Made to <em>feel</em> like you.');
    expect(home).toContain('<ConceptGallery compact />');

    // Distinct service pathways
    expect(home).toContain('href="/custom"');
    expect(home).toContain('href="/business"');
    expect(home).toContain('01 / CUSTOM APPAREL');
    expect(home).toContain('02 / FOR BUSINESS');
  });

  it('accurately represents all six concept studies across series taxonomy', () => {
    expect(conceptDesigns).toHaveLength(6);

    const ids = conceptDesigns.map((c) => c.id);
    expect(ids).toEqual([
      'slow-sunday',
      'making-things',
      'ordinary-magic',
      'stay-curious',
      'daylight-hours',
      'work-in-motion',
    ]);

    // Studio Notes series (3 concepts)
    const studioNotes = conceptDesigns.filter(
      (c) => c.series === 'Studio Notes',
    );
    expect(studioNotes).toHaveLength(3);
    expect(studioNotes.map((c) => c.id)).toEqual([
      'making-things',
      'stay-curious',
      'work-in-motion',
    ]);

    // Off-Duty series (3 concepts)
    const offDuty = conceptDesigns.filter((c) => c.series === 'Off-Duty');
    expect(offDuty).toHaveLength(3);
    expect(offDuty.map((c) => c.id)).toEqual([
      'slow-sunday',
      'ordinary-magic',
      'daylight-hours',
    ]);

    // Distinct palettes and motifs
    const palettes = new Set(conceptDesigns.map((c) => c.palette));
    expect(palettes.size).toBe(6);
    expect(palettes).toEqual(
      new Set(['clay', 'sage', 'lilac', 'sky', 'butter', 'rose']),
    );
  });

  it('safeguards link integrity: exactly 4 concepts have PDPs and 2 editorial concepts have no broken links', () => {
    const previewProducts = getAllPreviewProducts();
    expect(previewProducts).toHaveLength(4);

    const pdpSlugs = new Set(previewProducts.map((p) => p.slug));
    expect(pdpSlugs).toEqual(
      new Set([
        'slow-sunday',
        'making-things',
        'ordinary-magic',
        'stay-curious',
      ]),
    );

    // Verify editorial-only concepts do not have backing product records
    expect(getPreviewProductBySlug('daylight-hours')).toBeUndefined();
    expect(getPreviewProductBySlug('work-in-motion')).toBeUndefined();

    // Verify showcase source code guards against broken PDP links
    const showcase = read('components/RetailShowcase.tsx');
    expect(showcase).toContain('previewProduct ? (');
    expect(showcase).toContain('retail-product-pdp-link');
    expect(showcase).toContain('retail-concept-editorial-badge');
    expect(showcase).toContain('Studi Editorial');

    // Editorial concepts must not render a Link to /shop/daylight-hours or /shop/work-in-motion
    expect(showcase).not.toContain("href={'/shop/daylight-hours'}");
    expect(showcase).not.toContain("href={'/shop/work-in-motion'}");
  });

  it('presents illustrative prices with clear simulation disclaimers and never claims official release prices', () => {
    const showcase = read('components/RetailShowcase.tsx').replace(/\s+/g, ' ');
    const shop = read('app/shop/page.tsx').replace(/\s+/g, ' ');
    const home = read('app/page.tsx').replace(/\s+/g, ' ');

    // Format illustrative short price is used
    expect(showcase).toContain('formatIllustrativeShortPrice');
    expect(showcase).toContain('(Simulasi UX)');

    // Truth statements
    expect(showcase).toContain('Belum merupakan produk terverifikasi');
    expect(showcase).toContain('Visual warna adalah simulasi');
    expect(shop).toContain('Tahap Pratinjau Desain Studio');
    expect(home).toContain('Pratinjau Kurasi Desain');

    // Negative commercial protections
    for (const source of [showcase, shop, home]) {
      expect(source).not.toContain('Harga Resmi Rilis');
      expect(source).not.toContain('Beli Sekarang');
      expect(source).not.toContain('href="/cart"');
      expect(source).not.toContain('href="/checkout"');
    }
  });

  it('provides accessible filter controls and live announcement of matching concepts', () => {
    const showcase = read('components/RetailShowcase.tsx');

    // Filter group with accessible role and label
    expect(showcase).toContain('role="group"');
    expect(showcase).toContain(
      'aria-label="Saring konsep berdasarkan koleksi"',
    );

    // Filter button states
    expect(showcase).toContain('aria-pressed={filter === option}');
    expect(showcase).toContain('is-selected');

    // Live count
    expect(showcase).toContain('aria-live="polite"');
    expect(showcase).toContain('konsep ditampilkan');
  });

  it('provides accessible color preview swatches and detail disclosure toggles', () => {
    const showcase = read('components/RetailShowcase.tsx');

    // Accessible swatches
    expect(showcase).toContain('role="group"');
    expect(showcase).toContain('retail-swatch-row');
    expect(showcase).toContain("'retail-swatch retail-swatch-' +");
    expect(showcase).toContain("['ink', 'chalk']");
    expect(showcase).toContain('aria-pressed={tone === color}');
    expect(showcase).toContain('aria-label=');

    // Detail disclosure controls
    expect(showcase).toContain('retail-detail-toggle');
    expect(showcase).toContain('aria-expanded={open}');
    expect(showcase).toContain("aria-controls={'detail-' + design.id}");
  });

  it('embodies "Quiet Structure / Loud Art" in CSS without global grayscale or filter distortion', () => {
    const retail = read('app/retail.css');
    const globals = read('app/globals.css');

    // Invariant: Artwork colors are 100% original designed colors
    expect(retail).toContain('.retail-product-art.art-clay {');
    expect(retail).toContain('.retail-product-art.art-sage {');
    expect(retail).toContain('.retail-product-art.art-lilac {');
    expect(retail).toContain('.retail-product-art.art-sky {');
    expect(retail).toContain('.retail-product-art.art-butter {');
    expect(retail).toContain('.retail-product-art.art-rose {');

    // Invariant: No global grayscale or inversion filters
    expect(retail).not.toContain('grayscale(');
    expect(globals).not.toContain('grayscale(');
    expect(retail).not.toContain('filter: invert');
    expect(globals).not.toContain('filter: invert');

    // Monochromatic Quiet Structure for UI chrome
    expect(retail).toContain('.retail-hero-art {');
    expect(retail).toContain('background: var(--color-surface, #f7f7f7);');
    expect(retail).toContain('.retail-story-section {');
    expect(retail).toContain('background: var(--color-surface, #f7f7f7);');
    expect(retail).toContain('.retail-filter.is-selected {');
    expect(retail).toContain('background: var(--color-ink, #111111);');
  });

  it('guarantees responsive layout rules and reduced-motion support across breakpoints', () => {
    const retail = read('app/retail.css');

    // Breakpoint queries
    expect(retail).toContain('@media (max-width: 820px)');
    expect(retail).toContain('@media (max-width: 580px)');
    expect(retail).toContain('@media (max-width: 360px)');

    // Text wrapping and safe clamp typography
    expect(retail).toContain('overflow-wrap: break-word');
    expect(retail).toContain('clamp(34px, 10.5vw, 68px)');
    expect(retail).toContain('clamp(28px, 9.2vw, 34px)');

    // Reduced motion support
    expect(retail).toContain('@media (prefers-reduced-motion: reduce)');
    expect(retail).toContain('transition: none');
  });
});
