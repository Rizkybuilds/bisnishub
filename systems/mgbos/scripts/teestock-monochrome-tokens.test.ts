import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../apps/teestock/src');
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

/* WCAG 2.2 AA Relative Luminance & Contrast Ratio calculation */
function sRGBtoLin(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relLuminance(r: number, g: number, b: number): number {
  return 0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
}

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  return [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
  ];
}

function calculateContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = relLuminance(r1, g1, b1);
  const l2 = relLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('TeeStock Premium Monochrome Design System & Site Shell (TS-WEB-NOV26-02)', () => {
  it('defines coherent monochrome tokens in globals.css without color ambiguity', () => {
    const globals = read('app/globals.css');

    // Core Canvas & Surfaces
    expect(globals).toContain('--color-canvas: #ffffff;');
    expect(globals).toContain('--color-surface: #f7f7f7;');
    expect(globals).toContain('--color-surface-elevated: #ffffff;');

    // Neutral Ink Hierarchy (Remediated F02)
    expect(globals).toContain('--color-ink: #111111;');
    expect(globals).toContain('--color-ink-secondary: #404040;');
    expect(globals).toContain('--color-ink-muted: #525252;');
    expect(globals).toContain('--color-ink-subtle: #595959;');

    // Restrained Inverse Surfaces & Text
    expect(globals).toContain('--color-inverse-bg: #111111;');
    expect(globals).toContain('--color-inverse-text: #ffffff;');
    expect(globals).toContain('--color-inverse-text-muted: #a3a3a3;');
    expect(globals).toContain('--color-inverse-border: #262626;');

    // Quiet Rules & Borders
    expect(globals).toContain('--color-border: #e5e5e5;');

    // Focus controls for light and dark surfaces
    expect(globals).toContain('--color-focus: #111111;');
    expect(globals).toContain('--color-focus-inverse: #ffffff;');
  });

  it('preserves essential operational status semantic colors without decorative misuse', () => {
    const globals = read('app/globals.css');

    // Warning status (e.g. preview disclaimer, unconfigured notice)
    expect(globals).toContain('--color-warning-bg: #fffbeb;');
    expect(globals).toContain('--color-warning-border: #fde68a;');
    expect(globals).toContain('--color-warning-text: #92400e;');

    // Info status
    expect(globals).toContain('--color-info-bg: #f8fafc;');
    expect(globals).toContain('--color-info-border: #cbd5e1;');
    expect(globals).toContain('--color-info-text: #1e293b;');

    // Error and Success states
    expect(globals).toContain('--color-error-bg: #fef2f2;');
    expect(globals).toContain('--color-success-bg: #f0fdf4;');
  });

  it('strictly preserves expressive product artwork colors without global grayscale filters', () => {
    const globals = read('app/globals.css');
    const retail = read('app/retail.css');

    // Invariant: No indiscriminate global grayscale or filter applied to artwork
    expect(globals).not.toContain('grayscale(');
    expect(retail).not.toContain('grayscale(');
    expect(globals).not.toContain('filter: invert');
    expect(retail).not.toContain('filter: invert');
  });

  it('establishes "The Edit / Shop" as the primary navigation job with active affordance', () => {
    const header = read('components/Header.tsx');
    const retail = read('app/retail.css');

    // Header component marks /shop with primary navigation class
    expect(header).toContain(
      "href === '/shop' ? ' retail-nav-link-primary' : ''",
    );
    expect(header).toContain(
      "href === '/shop' ? ' mobile-nav-link-primary' : ''",
    );

    // CSS rules define primary navigation weight and active indicator
    expect(retail).toContain('.retail-nav-link-primary');
    expect(retail).toContain('.retail-nav-link.nav-link-active::after');
  });

  it('remediates F01: guarantees accessible keyboard focus visibility against actual adjacent surfaces', () => {
    const globals = read('app/globals.css');
    const retail = read('app/retail.css');

    // Default light canvas controls use --color-focus (#111111)
    expect(globals).toContain('outline: 2px solid var(--color-focus)');

    // Dark buttons placed on light canvas (.retail-header-cta, .retail-action-primary, .btn-primary, .retail-btn-demo-cart)
    // MUST use --color-focus (#111111) with offset and canvas separation shadow, NOT invisible white outline
    expect(globals).toContain('.retail-header-cta:focus-visible');
    expect(globals).toContain('.retail-action-primary:focus-visible');
    expect(globals).toContain('.retail-btn-demo-cart:focus-visible');
    expect(globals).toContain('box-shadow: 0 0 0 1px var(--color-canvas)');

    // Skip link must have high contrast outline against white page canvas
    expect(globals).toContain('.skip-link:focus');
    expect(globals).toContain('outline: 2px solid var(--color-focus)');

    // Truly inverse surfaces (footer, announcement bar) use --color-focus-inverse (#ffffff)
    expect(globals).toContain('.site-footer a:focus-visible');
    expect(globals).toContain('.retail-footer a:focus-visible');
    expect(globals).toContain('.retail-announcement a:focus-visible');

    // Contrast of focus indicators against their actual adjacent background must meet WCAG 3:1 minimum
    const darkFocusOnCanvasRatio = calculateContrastRatio('#111111', '#ffffff');
    expect(darkFocusOnCanvasRatio).toBeGreaterThanOrEqual(3.0);
    expect(darkFocusOnCanvasRatio).toBeCloseTo(18.88, 1);

    const whiteFocusOnInverseRatio = calculateContrastRatio(
      '#ffffff',
      '#111111',
    );
    expect(whiteFocusOnInverseRatio).toBeGreaterThanOrEqual(3.0);
    expect(whiteFocusOnInverseRatio).toBeCloseTo(18.88, 1);

    // Demo cart button focus in retail.css must use monochrome focus
    expect(retail).toContain('outline: 2px solid var(--color-focus, #111111)');
  });

  it('remediates F02: verifies numeric text contrast >= 4.5:1 across all rendered contexts', () => {
    const globals = read('app/globals.css');
    const retail = read('app/retail.css');

    // 1. Subtle text (#595959) over quiet surface (#f7f7f7) — previously failing #8a8a8a was 3.22:1
    const subtleOnSurfaceRatio = calculateContrastRatio('#595959', '#f7f7f7');
    expect(subtleOnSurfaceRatio).toBeGreaterThanOrEqual(4.5);
    expect(subtleOnSurfaceRatio).toBeCloseTo(6.54, 1);

    // 2. Inverse muted text (#a3a3a3) over inverse bg (#111111) — previously failing #737373 was 3.98:1
    const inverseMutedOnDarkRatio = calculateContrastRatio(
      '#a3a3a3',
      '#111111',
    );
    expect(inverseMutedOnDarkRatio).toBeGreaterThanOrEqual(4.5);
    expect(inverseMutedOnDarkRatio).toBeCloseTo(7.49, 1);

    // 3. Muted text (#525252) over canvas (#ffffff) and surface (#f7f7f7)
    const mutedOnCanvasRatio = calculateContrastRatio('#525252', '#ffffff');
    expect(mutedOnCanvasRatio).toBeGreaterThanOrEqual(4.5);
    expect(mutedOnCanvasRatio).toBeCloseTo(7.81, 1);

    const mutedOnSurfaceRatio = calculateContrastRatio('#525252', '#f7f7f7');
    expect(mutedOnSurfaceRatio).toBeGreaterThanOrEqual(4.5);
    expect(mutedOnSurfaceRatio).toBeCloseTo(7.29, 1);

    // 4. Secondary ink (#404040) over canvas (#ffffff)
    const secondaryOnCanvasRatio = calculateContrastRatio('#404040', '#ffffff');
    expect(secondaryOnCanvasRatio).toBeGreaterThanOrEqual(4.5);
    expect(secondaryOnCanvasRatio).toBeCloseTo(10.37, 1);

    // 5. Unavailable badge in globals.css uses --color-surface and --color-ink-subtle
    expect(globals).toContain('.badge-unavailable {');
    expect(globals).toContain('background-color: var(--color-surface);');
    expect(globals).toContain('color: var(--color-ink-subtle);');

    // 6. Footer bottom in retail.css uses --color-inverse-text-muted (#a3a3a3)
    expect(retail).toContain('.retail-footer-bottom {');
    expect(retail).toContain(
      'color: var(--color-inverse-text-muted, #a3a3a3);',
    );
    expect(retail).not.toContain('color: #737373;');
  });

  it('remediates F03: eliminates legacy chrome colors on shared interactive controls', () => {
    const retail = read('app/retail.css');

    // .retail-detail-toggle must be monochromatic
    expect(retail).toContain('.retail-detail-toggle {');
    expect(retail).toContain('color: var(--color-ink, #111111);');
    expect(retail).toContain(
      'border-top: 1px solid var(--color-border, #e5e5e5);',
    );
    expect(retail).not.toContain('color: #40533f;');
    expect(retail).not.toContain('color: #b9614e;');

    // .retail-btn-demo-cart:hover must use monochrome dark hover #262626, not forest green #172a20
    expect(retail).toContain('background: var(--color-signal-hover, #262626);');
    expect(retail).not.toContain('background: #172a20;');

    // .retail-btn-clear in demo cart must be monochromatic, not terracotta #9c4d3c
    expect(retail).toContain('.retail-btn-clear {');
    expect(retail).toContain('color: var(--color-ink-muted, #525252);');
    expect(retail).not.toContain('color: #9c4d3c;');
    expect(retail).not.toContain('color: #7a3224;');

    // .retail-swatch.selected must use monochrome focus
    expect(retail).toContain('outline: 2px solid var(--color-focus, #111111);');
    expect(retail).not.toContain('outline: 2px solid #4a654d;');
  });

  it('prevents sticky header from obscuring anchor navigation targets', () => {
    const globals = read('app/globals.css');
    expect(globals).toContain('scroll-margin-top: 120px');
    expect(globals).toContain('#main-content');
  });

  it('refines site footer to premium inverse monochrome while maintaining truth statements', () => {
    const footer = read('components/Footer.tsx');
    const retail = read('app/retail.css');

    // Footer component retains commercial safety disclosures
    expect(footer).toContain('Retail collection preview');
    expect(footer).toContain('Pemesanan belum dibuka');

    // Retail stylesheet styles footer with inverse monochrome tokens
    expect(retail).toContain('.retail-footer {');
    expect(retail).toContain('background: var(--color-inverse-bg, #111111);');
    expect(retail).toContain('color: var(--color-inverse-text, #ffffff);');
  });
});
