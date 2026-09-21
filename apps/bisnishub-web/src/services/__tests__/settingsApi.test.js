import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_STORE_SETTINGS,
  getStoreSettings,
  saveStoreSettings,
  getAppEnvironment,
  setAppEnvironment,
  getSecurityAuditChecklist,
  calculateSettingsKpis,
  exportSettingsSnapshotJson,
  importSettingsSnapshotJson
} from '@bisnishub/shared/services/settingsApi';

const storageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

globalThis.localStorage = storageMock;

describe('⚙️ Settings API Services (Store & System Hardening)', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('memiliki konfigurasi pengaturan toko default yang valid', () => {
    expect(DEFAULT_STORE_SETTINGS.storeWhatsapp).toBe('085220274968');
    expect(DEFAULT_STORE_SETTINGS.qrisMerchantName).toBe('TeeStock Apparel');
    expect(DEFAULT_STORE_SETTINGS.bankName).toBe('BCA');
  });

  it('mengambil pengaturan default saat cache kosong', async () => {
    const settings = await getStoreSettings();
    expect(settings.storeWhatsapp).toBe('085220274968');
    expect(settings.qrisMerchantName).toBe('TeeStock Apparel');
  });

  it('mengelola mode lingkungan aplikasi (sandbox vs production)', () => {
    expect(getAppEnvironment()).toBe('production');
    setAppEnvironment('sandbox');
    expect(getAppEnvironment()).toBe('sandbox');
    setAppEnvironment('production');
    expect(getAppEnvironment()).toBe('production');
  });

  it('menyediakan 5 guardrails pada security audit checklist', () => {
    const checklist = getSecurityAuditChecklist();
    expect(checklist).toHaveLength(5);
    const ids = checklist.map(c => c.id);
    expect(ids).toContain('rls_protection');
    expect(ids).toContain('idempotency_guard');
    expect(ids).toContain('env_isolation');
    expect(ids).toContain('phone_sanitizer');
    expect(ids).toContain('zero_gateway_fee');
    checklist.forEach(item => {
      expect(item.status).toBe('pass');
    });
  });

  it('menghitung 4 Executive KPI Ribbon Cards untuk pengaturan sistem', () => {
    const kpis = calculateSettingsKpis(DEFAULT_STORE_SETTINGS, 'production', true);
    expect(kpis.cloudDatabase.title).toBe('Cloud Supabase PostgreSQL');
    expect(kpis.cloudDatabase.status).toBe('active');
    expect(kpis.paymentGateway.title).toBe('Metode Pembayaran QRIS & Bank');
    expect(kpis.mediaCdn.title).toBe('Cloudinary Media CDN');
    expect(kpis.environment.mode).toBe('production');
  });

  it('mengekspor dan mengimpor snapshot JSON konfigurasi toko', () => {
    const testSettings = {
      ...DEFAULT_STORE_SETTINGS,
      qrisMerchantName: 'TeeStock Studio Utama',
      bankAccountNo: '8830123456'
    };

    const jsonStr = exportSettingsSnapshotJson(testSettings, 'production');
    expect(typeof jsonStr).toBe('string');
    expect(jsonStr).toContain('TeeStock Studio Utama');
    expect(jsonStr).toContain('8830123456');

    // Test import
    const result = importSettingsSnapshotJson(jsonStr);
    expect(result.success).toBe(true);
    expect(result.settings.qrisMerchantName).toBe('TeeStock Studio Utama');
    expect(result.settings.bankAccountNo).toBe('8830123456');
    expect(result.environment).toBe('production');
  });

  it('menolak impor JSON yang korup dengan pesan kesalahan', () => {
    const corrupted = '{ "settings": invalid_json }';
    const result = importSettingsSnapshotJson(corrupted);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
