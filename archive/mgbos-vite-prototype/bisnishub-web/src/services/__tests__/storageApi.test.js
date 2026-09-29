import { describe, it, expect, beforeEach } from 'vitest';
import {
  STORAGE_ZONES,
  DIRECTORY_TREE,
  FILE_NAMING_PRESETS,
  DEFAULT_DRIVE,
  getSelectedDrive,
  setSelectedDrive,
  resolvePath,
  getExplorerCommand,
  generateFileName,
  calculateStorageKpis,
  generateSetupScript,
  exportDirectoryCsv
} from '../storageApi';

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

describe('💾 Storage API (External SSD 1TB D:\\ Asset Vault)', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it('memiliki konfigurasi 6 zona direktori master dengan alokasi kapasitas', () => {
    expect(STORAGE_ZONES).toHaveLength(6);
    const zoneIds = STORAGE_ZONES.map(z => z.id);
    expect(zoneIds).toContain('00_INBOX_DROPZONE');
    expect(zoneIds).toContain('01_BRAND_MASTER_IDENTITIES');
    expect(zoneIds).toContain('02_TEESTOCK_PRODUCTION');
    expect(zoneIds).toContain('03_MULTIGRAPH_COLLATERAL');
    expect(zoneIds).toContain('04_LEGAL_INVOICE_FINANCIAL');
    expect(zoneIds).toContain('99_SYSTEM_SNAPSHOTS_BACKUP');

    const totalAllocated = STORAGE_ZONES.reduce((acc, z) => acc + z.allocatedGb, 0);
    expect(totalAllocated).toBe(800); // 800 GB teralokasi, 200 GB buffer bebas
  });

  it('memiliki 24 subdirektori baku yang terhubung ke zona master yang sah', () => {
    expect(DIRECTORY_TREE.length).toBeGreaterThanOrEqual(24);
    DIRECTORY_TREE.forEach(dir => {
      expect(STORAGE_ZONES.some(z => z.id === dir.zoneId)).toBe(true);
      expect(dir.relPath).toBeTruthy();
      expect(dir.recommendedFormat).toBeTruthy();
    });
  });

  it('mengelola pembacaan dan penyimpanan drive letter di localStorage', () => {
    expect(getSelectedDrive()).toBe('D:');
    setSelectedDrive('E:');
    expect(getSelectedDrive()).toBe('E:');
    setSelectedDrive('f');
    expect(getSelectedDrive()).toBe('F:');
  });

  it('menghasilkan resolvePath Windows dengan format yang benar', () => {
    const pathD = resolvePath('02_TEESTOCK_PRODUCTION\\02_GANG_SHEETS_DTF_58CM', 'D:');
    expect(pathD).toBe('D:\\02_TEESTOCK_PRODUCTION\\02_GANG_SHEETS_DTF_58CM');

    const pathE = resolvePath('\\00_INBOX_DROPZONE', 'E:');
    expect(pathE).toBe('E:\\00_INBOX_DROPZONE');
  });

  it('menghasilkan command explorer Windows untuk dialog Run (Win+R)', () => {
    const cmd = getExplorerCommand('01_BRAND_MASTER_IDENTITIES\\TEESTOCK\\Logos_Vector', 'D:');
    expect(cmd).toBe('explorer "D:\\01_BRAND_MASTER_IDENTITIES\\TEESTOCK\\Logos_Vector"');
  });

  it('menghasilkan format nama file baku terstandarisasi (Naming Convention)', () => {
    const fileName = generateFileName({
      date: '2026-09-20',
      brand: 'ts',
      itemName: 'art01-origins',
      spec: '300dpi-a3',
      ext: 'png'
    });

    expect(fileName).toBe('20260920_TS_ART01_ORIGINS_300DPI_A3.png');
  });

  it('memiliki preset nama file untuk skenario produksi apparel & kemasan', () => {
    expect(FILE_NAMING_PRESETS.length).toBeGreaterThanOrEqual(5);
    const dtfPreset = FILE_NAMING_PRESETS.find(p => p.id === 'dtf_print_ready');
    expect(dtfPreset).toBeDefined();
    expect(dtfPreset.ext).toBe('png');
    expect(dtfPreset.destRelPath).toContain('02_PREFLIGHT_300DPI');
  });

  it('menghitung KPI eksekutif penyimpanan SSD secara akurat', () => {
    const kpis = calculateStorageKpis('D:');
    expect(kpis.driveLetter).toBe('D:');
    expect(kpis.totalDirectories).toBe(DIRECTORY_TREE.length);
    expect(kpis.masterZones).toBe(6);
    expect(kpis.totalCapacityGb).toBe(1000);
    expect(kpis.totalAllocatedGb).toBe(800);
    expect(kpis.freeBufferGb).toBe(200);
    expect(kpis.allocationPercent).toBe(80);
  });

  it('menghasilkan skrip otomasi PowerShell yang memuat target drive dan subfolder', () => {
    const script = generateSetupScript('D:');
    expect(script).toContain('Target Drive: D:\\');
    expect(script).toContain('$RootPath = "$Drive\\"');
    expect(script).toContain('02_TEESTOCK_PRODUCTION\\02_GANG_SHEETS_DTF_58CM');
    expect(script).toContain('New-Item -ItemType Directory');
  });

  it('menghasilkan ekspor CSV direktori ber-BOM UTF-8 dengan 8 kolom', () => {
    const csv = exportDirectoryCsv('D:');
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('Kode Zona');
    expect(csv).toContain('Path Windows Lengkap');
    expect(csv).toContain('D:\\00_INBOX_DROPZONE');
  });
});
