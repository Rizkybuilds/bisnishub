/**
 * 💾 BisnisHub External SSD 1TB & Asset Storage API
 * Mengelola arsitektur direktori master Drive D:\, generator penamaan file baku,
 * skrip otomasi PowerShell, dan kebijakan Hot vs Cold Storage.
 */

const LOCAL_STORAGE_DRIVE_KEY = 'bh_storage_drive';
export const DEFAULT_DRIVE = 'D:';

/**
 * 7 Zona Direktori Utama Master SSD 1TB
 */
export const STORAGE_ZONES = [
  {
    id: '00_INBOX_DROPZONE',
    code: '00',
    name: '00_INBOX_DROPZONE',
    label: 'Inbox & Dropzone Kilat',
    desc: 'Folder transit kilat transfer foto & video mentah dari kamera/HP sebelum disortir ke folder drop masing-masing.',
    badge: 'Hot Drop',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    allocatedGb: 50,
    formats: 'JPG, MP4, MOV, HEIC',
    policy: 'Wajib dibersihkan setiap akhir pekan setelah sortir.'
  },
  {
    id: '01_BRAND_MASTER_IDENTITIES',
    code: '01',
    name: '01_BRAND_MASTER_IDENTITIES',
    label: 'Brand Master Identities',
    desc: 'Master vector logo asli (SVG/AI/EPS), typography font lisensi resmi, dan panduan identitas visual untuk seluruh pilar bisnis.',
    badge: 'Master Asset',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    allocatedGb: 30,
    formats: 'AI, EPS, SVG, OTF, TTF, PDF',
    policy: 'Hanya founder yang boleh mengedit aset vector master.'
  },
  {
    id: '02_TEESTOCK_PRODUCTION',
    code: '02',
    name: '02_TEESTOCK_PRODUCTION',
    label: 'TeeStock Apparel Production',
    desc: 'Produksi harian apparel: PSD layer artikel per drop, file preflight 300 DPI 1:1, mockups katalog, roll gang sheet DTF 58 cm, dan raw video 4K.',
    badge: 'Apparel Core',
    badgeColor: 'bg-[#F15A24]/10 text-[#F15A24] border-[#F15A24]/30',
    allocatedGb: 450,
    formats: 'PSD, TIFF, PNG 300 DPI, MOV 4K',
    policy: 'File DTF wajib transparent background & safe margin 1.5 cm.'
  },
  {
    id: '03_MULTIGRAPH_COLLATERAL',
    code: '03',
    name: '03_MULTIGRAPH_COLLATERAL',
    label: 'MultiGraph Packaging & Collateral',
    desc: 'Cetak kemasan unboxing pack TeeStock (hangtag 310gsm, stiker vinyl die-cut, polymailer sablon), arsip proyek B2B, dan pola pisau die-line.',
    badge: 'Packaging & B2B',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    allocatedGb: 120,
    formats: 'AI, PDF Print-Ready, CDR, TIFF',
    policy: 'Seluruh artwork cetak offset/sablon wajib mode warna CMYK.'
  },
  {
    id: '04_LEGAL_INVOICE_FINANCIAL',
    code: '04',
    name: '04_LEGAL_INVOICE_FINANCIAL',
    label: 'Legal, Invoices & Financial Audit',
    desc: 'Scan struk belanja bahan baku Cititex, nota vendor cetak DTF meteran, bukti transfer ekspedisi, rekening koran bank, dan audit keuangan CFO.',
    badge: 'Financial Audit',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    allocatedGb: 50,
    formats: 'PDF, JPG, XLSX, CSV',
    policy: 'Disimpan kronologis per bulan untuk audit pajak tahunan.'
  },
  {
    id: '99_SYSTEM_SNAPSHOTS_BACKUP',
    code: '99',
    name: '99_SYSTEM_SNAPSHOTS_BACKUP',
    label: 'System Snapshots & Cloud Mirror',
    desc: 'Arsip cadangan berkala (.zip) untuk Obsidian Vault BisnisHub dan export data skema & relasi database PostgreSQL Supabase.',
    badge: 'Disaster Recovery',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    allocatedGb: 100,
    formats: 'ZIP, TAR.GZ, SQL DUMP',
    policy: 'Backup otomatis setiap hari Minggu pukul 22:00 WIB.'
  }
];

/**
 * 24 Subdirektori Baku Berdasarkan Panduan Arsitektur & Script Setup
 */
export const DIRECTORY_TREE = [
  // 00 Inbox
  {
    zoneId: '00_INBOX_DROPZONE',
    relPath: '00_INBOX_DROPZONE',
    name: '00_INBOX_DROPZONE',
    desc: 'Transit kilat foto/video kamera & smartphone sebelum disortir.',
    recommendedFormat: 'RAW, JPG, MP4, MOV',
    critical: true
  },
  // 01 Brand Identities
  {
    zoneId: '01_BRAND_MASTER_IDENTITIES',
    relPath: '01_BRAND_MASTER_IDENTITIES\\TEESTOCK\\Logos_Vector',
    name: 'Logos_Vector (TeeStock)',
    desc: 'Master vector logo "The Tee & The Stock" & varian ikon terracotta.',
    recommendedFormat: 'AI, SVG, EPS, PDF',
    critical: true
  },
  {
    zoneId: '01_BRAND_MASTER_IDENTITIES',
    relPath: '01_BRAND_MASTER_IDENTITIES\\TEESTOCK\\Typography_Fonts',
    name: 'Typography_Fonts (TeeStock)',
    desc: 'Lisensi font headline & body text resmi TeeStock.',
    recommendedFormat: 'OTF, TTF, WOFF2',
    critical: false
  },
  {
    zoneId: '01_BRAND_MASTER_IDENTITIES',
    relPath: '01_BRAND_MASTER_IDENTITIES\\TEESTOCK\\Brand_Guidelines',
    name: 'Brand_Guidelines (TeeStock)',
    desc: 'Buku panduan identitas visual, tone of voice, dan palet warna.',
    recommendedFormat: 'PDF',
    critical: false
  },
  {
    zoneId: '01_BRAND_MASTER_IDENTITIES',
    relPath: '01_BRAND_MASTER_IDENTITIES\\MULTIGRAPH\\Logos_Vector',
    name: 'Logos_Vector (MultiGraph)',
    desc: 'Master vector logo holding percetakan MultiGraph.',
    recommendedFormat: 'AI, SVG, EPS',
    critical: false
  },
  {
    zoneId: '01_BRAND_MASTER_IDENTITIES',
    relPath: '01_BRAND_MASTER_IDENTITIES\\MULTIGRAPH\\Packaging_Templates',
    name: 'Packaging_Templates (MultiGraph)',
    desc: 'Master template pola pisau (dieline) packaging box & pouch.',
    recommendedFormat: 'AI, PDF Dieline',
    critical: true
  },
  {
    zoneId: '01_BRAND_MASTER_IDENTITIES',
    relPath: '01_BRAND_MASTER_IDENTITIES\\KASKITA\\Logos_Vector',
    name: 'Logos_Vector (KasKita)',
    desc: 'Master logo SaaS manajemen finansial KasKita.',
    recommendedFormat: 'SVG, AI',
    critical: false
  },
  {
    zoneId: '01_BRAND_MASTER_IDENTITIES',
    relPath: '01_BRAND_MASTER_IDENTITIES\\TITIK_BUTA\\Logos_Vector',
    name: 'Logos_Vector (Titik Buta)',
    desc: 'Master aset visual media edukasi Titik Buta.',
    recommendedFormat: 'SVG, AI',
    critical: false
  },
  // 02 TeeStock Production
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_01_ORIGINS\\01_SOURCE_PSD_AI',
    name: 'ART_01_ORIGINS / 01_SOURCE_PSD_AI',
    desc: 'File layer mentah Photoshop artikel 01 Origins.',
    recommendedFormat: 'PSD Multi-Layer (RGB)',
    critical: true
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_01_ORIGINS\\02_PREFLIGHT_300DPI',
    name: 'ART_01_ORIGINS / 02_PREFLIGHT_300DPI',
    desc: 'Artwork transparan 300 DPI 1:1 siap masuk gang sheet DTF.',
    recommendedFormat: 'PNG 300 DPI Transparent',
    critical: true
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_01_ORIGINS\\03_MOCKUPS_WEB',
    name: 'ART_01_ORIGINS / 03_MOCKUPS_WEB',
    desc: 'Foto mockup garmen NSA untuk display katalog storefront web.',
    recommendedFormat: 'JPG/WEBP Web-Optimized',
    critical: false
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_02_MONOCHROME\\01_SOURCE_PSD_AI',
    name: 'ART_02_MONOCHROME / 01_SOURCE_PSD_AI',
    desc: 'File layer mentah artikel 02 Monochrome.',
    recommendedFormat: 'PSD Multi-Layer',
    critical: false
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_02_MONOCHROME\\02_PREFLIGHT_300DPI',
    name: 'ART_02_MONOCHROME / 02_PREFLIGHT_300DPI',
    desc: 'Artwork siap gang sheet artikel 02 Monochrome skala 1:1.',
    recommendedFormat: 'PNG 300 DPI Transparent',
    critical: false
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_02_MONOCHROME\\03_MOCKUPS_WEB',
    name: 'ART_02_MONOCHROME / 03_MOCKUPS_WEB',
    desc: 'Mockup katalog web artikel 02 Monochrome.',
    recommendedFormat: 'JPG/WEBP',
    critical: false
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\02_GANG_SHEETS_DTF_58CM',
    name: '02_GANG_SHEETS_DTF_58CM',
    desc: 'Roll meteran siap kirim ke vendor DTF. Lebar 58 cm, margin 1.5 cm.',
    recommendedFormat: 'TIFF Uncompressed / PNG 300 DPI',
    critical: true
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\03_RAW_FOOTAGE_VIDEO\\2026-09_HEAT_PRESS_BTS',
    name: 'RAW_FOOTAGE / HEAT_PRESS_BTS',
    desc: 'Video mentah 4K 60fps proses heat press 155°C untuk TikTok Reels.',
    recommendedFormat: 'MOV, MP4 4K 60fps',
    critical: false
  },
  {
    zoneId: '02_TEESTOCK_PRODUCTION',
    relPath: '02_TEESTOCK_PRODUCTION\\03_RAW_FOOTAGE_VIDEO\\2026-09_UNBOXING_PROCESS',
    name: 'RAW_FOOTAGE / UNBOXING_PROCESS',
    desc: 'Footage unboxing pack, pengemasan polymailer, dan detail jahitan.',
    recommendedFormat: 'MOV, MP4 4K',
    critical: false
  },
  // 03 MultiGraph Collateral
  {
    zoneId: '03_MULTIGRAPH_COLLATERAL',
    relPath: '03_MULTIGRAPH_COLLATERAL\\01_TEESTOCK_PACKAGING_PRINTS',
    name: '01_TEESTOCK_PACKAGING_PRINTS',
    desc: 'File cetak hangtag 310gsm, stiker vinyl, polymailer sablon, dan care card.',
    recommendedFormat: 'PDF CMYK 300 DPI, AI',
    critical: true
  },
  {
    zoneId: '03_MULTIGRAPH_COLLATERAL',
    relPath: '03_MULTIGRAPH_COLLATERAL\\02_CLIENT_B2B_PROJECTS',
    name: '02_CLIENT_B2B_PROJECTS',
    desc: 'Arsip pesanan maklon kemasan dan stiker dari klien bisnis eksternal.',
    recommendedFormat: 'AI, PDF, ZIP',
    critical: false
  },
  {
    zoneId: '03_MULTIGRAPH_COLLATERAL',
    relPath: '03_MULTIGRAPH_COLLATERAL\\03_PRINT_TEMPLATES',
    name: '03_PRINT_TEMPLATES',
    desc: 'Pola pisau die-line kardus die-cut, ukuran pouch, dan stiker toples.',
    recommendedFormat: 'AI, EPS, PDF Dieline',
    critical: true
  },
  // 04 Legal & Financial
  {
    zoneId: '04_LEGAL_INVOICE_FINANCIAL',
    relPath: '04_LEGAL_INVOICE_FINANCIAL\\Invoices_Vendor_Cititex',
    name: 'Invoices_Vendor_Cititex',
    desc: 'Nota & invoice pembelian kaos polos NSA Heavyweight.',
    recommendedFormat: 'PDF, JPG Scan',
    critical: true
  },
  {
    zoneId: '04_LEGAL_INVOICE_FINANCIAL',
    relPath: '04_LEGAL_INVOICE_FINANCIAL\\Invoices_Vendor_DTF',
    name: 'Invoices_Vendor_DTF',
    desc: 'Kwitansi & nota cetak roll DTF meteran dari vendor print.',
    recommendedFormat: 'PDF, JPG Scan',
    critical: true
  },
  {
    zoneId: '04_LEGAL_INVOICE_FINANCIAL',
    relPath: '04_LEGAL_INVOICE_FINANCIAL\\Rekening_Koran_Bank',
    name: 'Rekening_Koran_Bank',
    desc: 'Rekap mutasi rekening koran BCA bisnis & pencatatan treasury.',
    recommendedFormat: 'PDF, CSV Rekening Koran',
    critical: true
  },
  // 99 System Backups
  {
    zoneId: '99_SYSTEM_SNAPSHOTS_BACKUP',
    relPath: '99_SYSTEM_SNAPSHOTS_BACKUP\\Obsidian_Vault_Backups',
    name: 'Obsidian_Vault_Backups',
    desc: 'Kompresi arsip (.zip) mingguan seluruh catatan Obsidian BisnisHub.',
    recommendedFormat: 'ZIP Archive',
    critical: true
  },
  {
    zoneId: '99_SYSTEM_SNAPSHOTS_BACKUP',
    relPath: '99_SYSTEM_SNAPSHOTS_BACKUP\\Supabase_DB_Dumps',
    name: 'Supabase_DB_Dumps',
    desc: 'Dump SQL skema tabel, RLS policies, dan data cadangan Supabase.',
    recommendedFormat: 'SQL, JSON Dump',
    critical: true
  }
];

/**
 * File Naming Protocol Presets
 */
export const FILE_NAMING_PRESETS = [
  {
    id: 'dtf_print_ready',
    label: 'File Siap Cetak DTF (PNG 300 DPI)',
    brand: 'TS',
    item: 'ART01_ORIGINS',
    spec: '300DPI_A3',
    ext: 'png',
    destRelPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_01_ORIGINS\\02_PREFLIGHT_300DPI'
  },
  {
    id: 'master_psd',
    label: 'Desain Mentah Layer (Master PSD)',
    brand: 'TS',
    item: 'ART01_ORIGINS',
    spec: 'MASTER',
    ext: 'psd',
    destRelPath: '02_TEESTOCK_PRODUCTION\\01_ARTICLES_CATALOG\\DROP_01_RAW_IDENTITY\\ART_01_ORIGINS\\01_SOURCE_PSD_AI'
  },
  {
    id: 'gang_sheet_58cm',
    label: 'Gang Sheet Roll DTF 58 cm (TIFF)',
    brand: 'TS',
    item: 'GANGSHEET_58x150cm',
    spec: 'BATCH01',
    ext: 'tif',
    destRelPath: '02_TEESTOCK_PRODUCTION\\02_GANG_SHEETS_DTF_58CM'
  },
  {
    id: 'packaging_hangtag',
    label: 'Hangtag Kemasan TeeStock (PDF)',
    brand: 'MG',
    item: 'HANGTAG_TEESTOCK',
    spec: '310GSM_READY',
    ext: 'pdf',
    destRelPath: '03_MULTIGRAPH_COLLATERAL\\01_TEESTOCK_PACKAGING_PRINTS'
  },
  {
    id: 'video_4k_bts',
    label: 'Video Mentah BTS Heat Press (4K60)',
    brand: 'TS',
    item: 'BTS_HEATPRESS_155C',
    spec: '4K60',
    ext: 'mov',
    destRelPath: '02_TEESTOCK_PRODUCTION\\03_RAW_FOOTAGE_VIDEO\\2026-09_HEAT_PRESS_BTS'
  },
  {
    id: 'invoice_cititex',
    label: 'Invoice Nota Belanja NSA Cititex',
    brand: 'FIN',
    item: 'INV_CITITEX_RAWAMANGUN',
    spec: '120PCS_NSA',
    ext: 'pdf',
    destRelPath: '04_LEGAL_INVOICE_FINANCIAL\\Invoices_Vendor_Cititex'
  },
  {
    id: 'backup_vault',
    label: 'Backup Mingguan Obsidian Vault',
    brand: 'SYS',
    item: 'OBSIDIAN_VAULT_BACKUP',
    spec: 'WEEKLY',
    ext: 'zip',
    destRelPath: '99_SYSTEM_SNAPSHOTS_BACKUP\\Obsidian_Vault_Backups'
  }
];

/**
 * Ambil drive letter aktif dari localStorage atau default 'D:'
 */
export function getSelectedDrive() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_DRIVE_KEY);
      if (saved && typeof saved === 'string') {
        const clean = saved.trim().toUpperCase().replace(/[\/\\:]/g, '');
        if (clean.length > 0) return `${clean}:`;
      }
    }
  } catch (e) {}
  return DEFAULT_DRIVE;
}

/**
 * Simpan drive letter aktif ke localStorage
 */
export function setSelectedDrive(driveLetter) {
  const clean = (driveLetter || DEFAULT_DRIVE).trim().toUpperCase().replace(/[\/\\:]/g, '');
  const formatted = `${clean || 'D'}:`;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_DRIVE_KEY, formatted);
    }
  } catch (e) {}
  return formatted;
}

/**
 * Format drive letter secara konsisten (contoh: 'D:' atau 'E:')
 */
export function formatDrive(driveLetter = DEFAULT_DRIVE) {
  const clean = String(driveLetter || DEFAULT_DRIVE).trim().toUpperCase().replace(/[\/\\:]+$/g, '');
  return `${clean || 'D'}:`;
}

/**
 * Gabungkan drive letter dengan relative path Windows
 */
export function resolvePath(relPath = '', driveLetter = DEFAULT_DRIVE) {
  const drive = formatDrive(driveLetter);
  const cleanRel = (relPath || '').replace(/^[\\\/]+/, '');
  return `${drive}\\${cleanRel}`;
}

/**
 * Buat Explorer Command untuk dialog Run (Win+R) atau terminal
 */
export function getExplorerCommand(relPath = '', driveLetter = DEFAULT_DRIVE) {
  const fullPath = resolvePath(relPath, driveLetter);
  return `explorer "${fullPath}"`;
}

/**
 * Format nama file sesuai Aturan Baku Penamaan File:
 * YYYYMMDD_[BRAND]_[NAMA_ITEM]_[VERSI/RESOLUSI].[EXT]
 */
export function generateFileName({
  date = new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  brand = 'TS',
  itemName = 'ART01_ORIGINS',
  spec = '300DPI_A3',
  ext = 'png'
} = {}) {
  const cleanDate = String(date).replace(/[^0-9]/g, '').slice(0, 8);
  const cleanBrand = String(brand).trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const cleanItem = String(itemName).trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const cleanSpec = String(spec).trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');
  const cleanExt = String(ext).trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  return `${cleanDate}_${cleanBrand}_${cleanItem}_${cleanSpec}.${cleanExt}`;
}

/**
 * Hitung 4 KPI Executive Storage
 */
export function calculateStorageKpis(driveLetter = DEFAULT_DRIVE) {
  const totalDirectories = DIRECTORY_TREE.length;
  const masterZones = STORAGE_ZONES.length;
  const criticalDirs = DIRECTORY_TREE.filter(d => d.critical).length;
  
  const totalAllocatedGb = STORAGE_ZONES.reduce((acc, z) => acc + (z.allocatedGb || 0), 0);
  const totalCapacityGb = 1000; // 1 TB SSD
  const freeBufferGb = Math.max(0, totalCapacityGb - totalAllocatedGb);

  return {
    driveLetter: formatDrive(driveLetter),
    totalDirectories,
    masterZones,
    criticalDirs,
    totalCapacityGb,
    totalAllocatedGb,
    freeBufferGb,
    allocationPercent: Math.round((totalAllocatedGb / totalCapacityGb) * 100)
  };
}

/**
 * Buat Skrip Otomasi PowerShell Lengkap untuk Setup Folder SSD
 */
export function generateSetupScript(driveLetter = DEFAULT_DRIVE) {
  const drive = formatDrive(driveLetter);
  const dirsCode = DIRECTORY_TREE.map(d => `    "${d.relPath}"`).join(',\r\n');

  return `<#
.SYNOPSIS
    BisnisHub External SSD 1TB Directory Setup Automation
    Target Drive: ${drive}\\
.DESCRIPTION
    Menyiapkan seluruh hierarki folder terstruktur di External SSD ${drive}\\
    untuk master PSD/AI, gang sheet DTF 58 cm, video 4K, dan backup sistem
    tanpa membebani kapasitas laptop lokal C:\\.
#>

param (
    [string]$TargetDrive = "${drive}"
)

$Drive = $TargetDrive.TrimEnd('\\').TrimEnd(':') + ":"
$RootPath = "$Drive\\"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   BISNISHUB EXTERNAL SSD 1TB - DIRECTORY SETUP AUTOMATION  " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Target Drive : $RootPath" -ForegroundColor White

if (-not (Test-Path $RootPath)) {
    Write-Warning "Drive $RootPath tidak terdeteksi! Pastikan External SSD sudah terpasang."
    $response = Read-Host "Apakah Anda ingin membuat folder simulasi di direktori lokal untuk pengujian? (y/n)"
    if ($response -eq 'y') {
        $RootPath = ".\\test_external_ssd\\"
        Write-Host "Mengalihkan pembuatan ke: $RootPath" -ForegroundColor Yellow
    } else {
        Write-Error "Operasi dibatalkan."
        exit 1
    }
}

$directories = @(
${dirsCode}
)

$createdCount = 0
foreach ($dir in $directories) {
    $fullPath = Join-Path $RootPath $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host " [+] Created: $dir" -ForegroundColor Green
        $createdCount++
    } else {
        Write-Host " [=] Exists : $dir" -ForegroundColor DarkGray
    }
}

Write-Host "------------------------------------------------------------" -ForegroundColor Cyan
Write-Host "Selesai! $createdCount direktori baru berhasil disiapkan di $RootPath" -ForegroundColor Green
Write-Host "Laptop C:\\ kini bersih dari penumpukan file raksasa (>50MB)." -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
`;
}

/**
 * Ekspor Struktur Direktori ke CSV 8-Kolom dengan UTF-8 BOM
 */
export function exportDirectoryCsv(driveLetter = DEFAULT_DRIVE) {
  const headers = [
    'Kode Zona',
    'Zona Master',
    'Nama Direktori',
    'Path Windows Lengkap',
    'Peran & Deskripsi',
    'Format File Rekomendasi',
    'Tingkat Kritis',
    'Command Run Explorer'
  ];

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = DIRECTORY_TREE.map(d => {
    const zone = STORAGE_ZONES.find(z => z.id === d.zoneId) || {};
    const fullPath = resolvePath(d.relPath, driveLetter);
    const explorerCmd = getExplorerCommand(d.relPath, driveLetter);

    return [
      escapeCsv(zone.code || '-'),
      escapeCsv(zone.name || d.zoneId),
      escapeCsv(d.name),
      escapeCsv(fullPath),
      escapeCsv(d.desc),
      escapeCsv(d.recommendedFormat),
      escapeCsv(d.critical ? 'Kritis (Master)' : 'Pendukung'),
      escapeCsv(explorerCmd)
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return csvContent;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Struktur-Direktori-SSD-BisnisHub-${(driveLetter || 'D').replace(':', '')}-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return csvContent;
}
