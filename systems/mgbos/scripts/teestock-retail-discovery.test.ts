import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../apps/teestock/src');
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('TeeStock retail-first discovery guardrails', () => {
  it('has a separate concept gallery, clear navigation and a retail-first home', () => {
    expect(fs.existsSync(path.join(root, 'app/shop/page.tsx'))).toBe(true);
    expect(read('app/page.tsx')).toContain('Jelajahi koleksi');
    expect(read('components/Header.tsx')).toContain("href: '/shop'");
    expect(read('components/RetailShowcase.tsx')).toContain('ConceptGallery');
  });

  it('marks concept art as unavailable and never offers unverified checkout', () => {
    const shop = read('app/shop/page.tsx');
    const home = read('app/page.tsx');
    const gallery = read('components/RetailShowcase.tsx');
    expect(shop.replace(/\s+/g, ' ')).toContain(
      'belum katalog produk yang dapat dibeli',
    );
    expect(home).toContain('Belum Tersedia');
    expect(gallery.replace(/\s+/g, ' ')).toContain(
      'Belum merupakan produk terverifikasi',
    );
    for (const source of [shop, home, gallery]) {
      expect(source).not.toContain('href="/cart"');
      expect(source).not.toContain('href="/checkout"');
      expect(source).not.toContain('wa.me/');
    }
  });

  it('allows previews, filters and color variations without persisting fictional stock', () => {
    const gallery = read('components/RetailShowcase.tsx');
    expect(gallery).toContain('aria-pressed');
    expect(gallery).toContain('aria-expanded');
    expect(gallery).toContain('Studio Notes');
    expect(gallery).toContain('Off-Duty');
    expect(gallery).not.toContain('localStorage');
    expect(gallery).not.toContain('fetch(');
  });

  it('preserves keyboard focus and reduced-motion styling', () => {
    const globals = read('app/globals.css');
    const theme = read('app/retail.css');
    expect(globals).toContain(':focus-visible');
    expect(globals).toContain('prefers-reduced-motion');
    expect(theme).toContain('prefers-reduced-motion');
    expect(read('components/Header.tsx')).toContain("event.key === 'Escape'");
  });
});
