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
  });

  it('restores focus to mobile navigation toggle on Escape without focus trap (UX-81-01)', () => {
    const header = read('components/Header.tsx');
    // Stable reference to the hamburger control
    expect(header).toContain('useRef<HTMLButtonElement>(null)');
    expect(header).toContain('ref={toggleRef}');
    // Escape event closes navigation and restores focus
    expect(header).toContain("if (event.key === 'Escape')");
    expect(header).toContain('setOpen(false)');
    expect(header).toContain('toggleRef.current?.focus()');
    // Accessible disclosure controls
    expect(header).toContain('aria-expanded={open}');
    expect(header).toContain('aria-controls="mobile-navigation"');
    expect(header).toContain(
      "aria-label={open ? 'Tutup navigasi' : 'Buka navigasi'}",
    );
    // Link navigation dismisses menu without stealing focus on route transition
    expect(header).toContain('onClick={() => setOpen(false)}');
    expect(header).toContain('if (previousPath !== pathname)');
    // Desktop navigation remains distinct
    expect(header).toContain('nav-desktop');
    expect(header).toContain('retail-mobile-toggle');
  });

  it('renders homepage hero garments and ensures compact mobile heading geometry (UX-81-03, UX-81-04)', () => {
    const home = read('app/page.tsx');
    const showcase = read('components/RetailShowcase.tsx');
    const theme = read('app/retail.css');

    // UX-81-04: Hero garments component boundary
    expect(home).toContain('<HeroGarments />');
    expect(showcase).toContain('export function HeroGarments()');
    expect(showcase).toContain('retail-hero-tee-back');
    expect(showcase).toContain('retail-hero-tee-front');

    // UX-81-03: Responsive heading geometry without 320px clipping
    expect(theme).toContain('overflow-wrap: break-word');
    expect(theme).toContain('clamp(34px, 10.5vw, 68px)');
    expect(theme).toContain('@media (max-width: 360px)');
    expect(theme).toContain('clamp(28px, 9.2vw, 34px)');
  });
});
