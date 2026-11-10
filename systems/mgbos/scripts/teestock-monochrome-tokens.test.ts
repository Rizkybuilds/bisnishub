import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../apps/teestock/src');
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

describe('TeeStock Premium Monochrome Design System & Site Shell (TS-WEB-NOV26-02)', () => {
  it('defines coherent monochrome tokens in globals.css without color ambiguity', () => {
    const globals = read('app/globals.css');

    // Core Canvas & Surfaces
    expect(globals).toContain('--color-canvas: #ffffff;');
    expect(globals).toContain('--color-surface: #f7f7f7;');
    expect(globals).toContain('--color-surface-elevated: #ffffff;');

    // Neutral Ink Hierarchy
    expect(globals).toContain('--color-ink: #111111;');
    expect(globals).toContain('--color-ink-secondary: #404040;');
    expect(globals).toContain('--color-ink-muted: #646464;');

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

  it('guarantees accessible keyboard focus visibility on both canvas and inverse surfaces', () => {
    const globals = read('app/globals.css');

    // Canvas focus
    expect(globals).toContain('outline: 2px solid var(--color-focus)');

    // Inverse surface focus (footer, dark buttons, announcement)
    expect(globals).toContain('outline: 2px solid var(--color-focus-inverse)');
    expect(globals).toContain('.site-footer a:focus-visible');
    expect(globals).toContain('.retail-header-cta:focus-visible');
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
