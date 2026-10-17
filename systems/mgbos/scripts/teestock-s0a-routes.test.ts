import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GET as healthHandler } from '../apps/teestock/src/app/health/route';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const teestockAppDir = path.resolve(__dirname, '../apps/teestock');

describe('TeeStock S0-A Route & Content Invariant Tests', () => {
  it('health endpoint returns valid status, application name, and version', async () => {
    const res = healthHandler();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({
      status: 'ok',
      application: 'teestock',
      version: '0.5.4',
    });
  });

  it('verifies that all expected S0-A routes exist on disk', () => {
    const routes = [
      'src/app/page.tsx',
      'src/app/layout.tsx',
      'src/app/globals.css',
      'src/app/not-found.tsx',
      'src/app/custom/page.tsx',
      'src/app/custom-atelier/page.tsx',
      'src/app/business/page.tsx',
      'src/app/support/contact/page.tsx',
      'src/app/health/route.ts',
    ];

    for (const route of routes) {
      const fullPath = path.join(teestockAppDir, route);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it('ensures no secret tokens, service role keys, or private credentials exist in client source', () => {
    const srcDir = path.join(teestockAppDir, 'src');
    const files = fs.readdirSync(srcDir, { recursive: true }) as string[];

    for (const file of files) {
      const fullPath = path.join(srcDir, file);
      if (fs.statSync(fullPath).isFile() && /\.(tsx?|css|json)$/.test(file)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        expect(content).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
        expect(content).not.toContain('service_role');
        expect(content).not.toContain('SECRET_KEY');
      }
    }
  });

  it('ensures unverified contact routes are NOT present as active external URLs', () => {
    const contactPage = fs.readFileSync(
      path.join(teestockAppDir, 'src/app/support/contact/page.tsx'),
      'utf8',
    );

    // Must NOT link to unverified phone numbers or unmanaged WhatsApp inboxes
    expect(contactPage).not.toContain('wa.me/');
    expect(contactPage).not.toContain('api.whatsapp.com');
    expect(contactPage).not.toContain('tel:');
    expect(contactPage).not.toContain('mailto:');

    // Must communicate clearly that online contact is not active yet without developer jargon
    expect(contactPage).toContain('Saluran Kontak Daring Sedang Disiapkan');
    expect(contactPage).toContain('belum dibuka untuk umum');
    expect(contactPage).not.toContain('repositori ini');
    expect(contactPage).not.toContain('public-activation gate');
    expect(contactPage).not.toContain('tombol inert');
  });

  it('ensures Shop and Build Merch are marked unavailable and do not offer purchase actions', () => {
    const homePage = fs.readFileSync(
      path.join(teestockAppDir, 'src/app/page.tsx'),
      'utf8',
    );

    // Shop is marked unavailable and informational
    expect(homePage).toContain('Belum Tersedia');
    expect(homePage).toContain('Shop (Katalog Ritel)');
    expect(homePage).not.toContain('Beli Sekarang');
    expect(homePage).not.toContain('Checkout');
    expect(homePage).not.toContain('/checkout');
    expect(homePage).not.toContain('/cart');

    // Build Merch is marked in development
    expect(homePage).toContain('Pengembangan');
    expect(homePage).toContain('Build Merch');
  });

  it('preserves /custom-atelier deep link with integration banner and navigation to /custom', () => {
    const atelierPage = fs.readFileSync(
      path.join(teestockAppDir, 'src/app/custom-atelier/page.tsx'),
      'utf8',
    );

    expect(atelierPage).toContain('/custom');
    expect(atelierPage).toContain(
      'Layanan kustomisasi atelier kini terpadu bersama',
    );
    expect(atelierPage).toContain('/support/contact');
    expect(atelierPage).not.toContain('deep-link');
  });

  it('ensures customer-facing interface does not expose internal engineering jargon or /health in footer', () => {
    const footer = fs.readFileSync(
      path.join(teestockAppDir, 'src/components/Footer.tsx'),
      'utf8',
    );
    const homePage = fs.readFileSync(
      path.join(teestockAppDir, 'src/app/page.tsx'),
      'utf8',
    );

    // Footer must not expose /health, MGBOS, Deep Link, or CX-S0-A to customers
    expect(footer).not.toContain('/health');
    expect(footer).not.toContain('MGBOS');
    expect(footer).not.toContain('Deep Link');
    expect(footer).not.toContain('CX-S0-A');

    // Home must not expose engineering phase codes
    expect(homePage).not.toContain('CX-S0-A');
  });

  it('ensures accessibility invariants are present in layout and styles', () => {
    const layout = fs.readFileSync(
      path.join(teestockAppDir, 'src/app/layout.tsx'),
      'utf8',
    );
    const globalsCss = fs.readFileSync(
      path.join(teestockAppDir, 'src/app/globals.css'),
      'utf8',
    );

    // RootLayout includes lang="id", skip-link and semantic main landmark
    expect(layout).toContain('lang="id"');
    expect(layout).toContain('skip-link');
    expect(layout).toContain('Menuju ke konten utama');
    expect(layout).toContain('id="main-content"');

    // Globals.css includes focus-visible, skip-link, and reduced-motion rules
    expect(globalsCss).toContain(':focus-visible');
    expect(globalsCss).toContain('.skip-link');
    expect(globalsCss).toContain('prefers-reduced-motion');
  });
});
