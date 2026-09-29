<#
.SYNOPSIS
    BisnisHub External SSD 1TB Directory Setup Automation
.DESCRIPTION
    Menyiapkan seluruh hierarki folder penyimpanan terstruktur di External SSD (Default Drive: D:\)
    untuk menampung file master desain, gang sheet DTF 58 cm, video mentah 4K, invoice, dan backup
    tanpa membebani kapasitas SSD laptop lokal.
.PARAMETER TargetDrive
    Huruf drive external SSD (contoh: D: atau E:). Default adalah 'D:'
#>

param (
    [string]$TargetDrive = "D:"
)

# Format drive letter
$Drive = $TargetDrive.TrimEnd('\').TrimEnd(':') + ":"
$RootPath = "$Drive\"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   BISNISHUB EXTERNAL SSD 1TB - DIRECTORY SETUP AUTOMATION  " -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Target Drive : $RootPath" -ForegroundColor White

# Validasi keberadaan Drive
if (-not (Test-Path $RootPath)) {
    Write-Warning "Drive $RootPath tidak terdeteksi! Pastikan External SSD sudah terpasang."
    $response = Read-Host "Apakah Anda ingin membuat folder simulasi di direktori lokal untuk pengujian? (y/n)"
    if ($response -eq 'y') {
        $RootPath = ".\test_external_ssd\"
        Write-Host "Mengalihkan pembuatan ke: $RootPath" -ForegroundColor Yellow
    } else {
        Write-Error "Operasi dibatalkan."
        exit 1
    }
}

# Daftar hierarki folder terstruktur
$directories = @(
    "00_INBOX_DROPZONE",
    "01_BRAND_MASTER_IDENTITIES\TEESTOCK\Logos_Vector",
    "01_BRAND_MASTER_IDENTITIES\TEESTOCK\Typography_Fonts",
    "01_BRAND_MASTER_IDENTITIES\TEESTOCK\Brand_Guidelines",
    "01_BRAND_MASTER_IDENTITIES\MULTIGRAPH\Logos_Vector",
    "01_BRAND_MASTER_IDENTITIES\MULTIGRAPH\Packaging_Templates",
    "01_BRAND_MASTER_IDENTITIES\KASKITA\Logos_Vector",
    "01_BRAND_MASTER_IDENTITIES\TITIK_BUTA\Logos_Vector",
    "02_TEESTOCK_PRODUCTION\01_ARTICLES_CATALOG\DROP_01_RAW_IDENTITY\ART_01_ORIGINS\01_SOURCE_PSD_AI",
    "02_TEESTOCK_PRODUCTION\01_ARTICLES_CATALOG\DROP_01_RAW_IDENTITY\ART_01_ORIGINS\02_PREFLIGHT_300DPI",
    "02_TEESTOCK_PRODUCTION\01_ARTICLES_CATALOG\DROP_01_RAW_IDENTITY\ART_01_ORIGINS\03_MOCKUPS_WEB",
    "02_TEESTOCK_PRODUCTION\01_ARTICLES_CATALOG\DROP_01_RAW_IDENTITY\ART_02_MONOCHROME\01_SOURCE_PSD_AI",
    "02_TEESTOCK_PRODUCTION\01_ARTICLES_CATALOG\DROP_01_RAW_IDENTITY\ART_02_MONOCHROME\02_PREFLIGHT_300DPI",
    "02_TEESTOCK_PRODUCTION\01_ARTICLES_CATALOG\DROP_01_RAW_IDENTITY\ART_02_MONOCHROME\03_MOCKUPS_WEB",
    "02_TEESTOCK_PRODUCTION\02_GANG_SHEETS_DTF_58CM",
    "02_TEESTOCK_PRODUCTION\03_RAW_FOOTAGE_VIDEO\2026-09_HEAT_PRESS_BTS",
    "02_TEESTOCK_PRODUCTION\03_RAW_FOOTAGE_VIDEO\2026-09_UNBOXING_PROCESS",
    "03_MULTIGRAPH_COLLATERAL\01_TEESTOCK_PACKAGING_PRINTS",
    "03_MULTIGRAPH_COLLATERAL\02_CLIENT_B2B_PROJECTS",
    "03_MULTIGRAPH_COLLATERAL\03_PRINT_TEMPLATES",
    "04_LEGAL_INVOICE_FINANCIAL\Invoices_Vendor_Cititex",
    "04_LEGAL_INVOICE_FINANCIAL\Invoices_Vendor_DTF",
    "04_LEGAL_INVOICE_FINANCIAL\Rekening_Koran_Bank",
    "99_SYSTEM_SNAPSHOTS_BACKUP\Obsidian_Vault_Backups",
    "99_SYSTEM_SNAPSHOTS_BACKUP\Supabase_DB_Dumps"
)

# Panduan dan aturan penamaan per folder
$readmeGuides = @{
    "00_INBOX_DROPZONE" = "PANDUAN INBOX DROPZONE:`nFolder transit kilat saat transfer foto produk dari HP/kamera sebelum disortir ke folder drop masing-masing. Bersihkan folder ini setiap akhir pekan."
    
    "01_BRAND_MASTER_IDENTITIES" = "PANDUAN MASTER IDENTITAS:`nMenyimpan aset vector asli (SVG/AI/EPS), typography font lisensi resmi, dan guideline warna (hex code) master untuk semua pilar bisnis BisnisHub."
    
    "02_TEESTOCK_PRODUCTION\01_ARTICLES_CATALOG" = "PANDUAN KATALOG ARTIKEL TEESTOCK:`nStruktur penamaan standar:`n[TANGGAL]_[BISNIS]_[NAMA_ITEM]_[VERSI/RESOLUSI].[EXT]`nContoh:`n- 20260920_TS_ART01_ORIGINS_300DPI_A3.png (File siap gang DTF)`n- 20260920_TS_ART01_ORIGINS_MASTER.psd (File desain layer mentah)"
    
    "02_TEESTOCK_PRODUCTION\02_GANG_SHEETS_DTF_58CM" = "PANDUAN GANG SHEET DTF 58 CM:`nRoll cetak DTF lebar 58 cm. Safe margin 1.5 cm di kiri dan kanan (efektif cetak 55 cm).`nStandar format: TIFF atau PNG 300 DPI Transparent Background.`nFormat nama file: YYYY-MM-DD_GANG_58x[PANJANG_CM]_BATCH[NO].tif"
    
    "02_TEESTOCK_PRODUCTION\03_RAW_FOOTAGE_VIDEO" = "PANDUAN VIDEO MENTAH TIKTOK & REELS:`nArsip klip mentah 4K 60fps/1080p: proses heat press, unboxing paket, b-roll garmen NSA, dan review kaos. Jangan simpan footage mentah di laptop lokal."
    
    "03_MULTIGRAPH_COLLATERAL\01_TEESTOCK_PACKAGING_PRINTS" = "PANDUAN KEMASAN TEESTOCK (MULTIGRAPH):`nFile master siap cetak untuk unboxing pack TeeStock:`n1. Stiker Vinyl Die-cut (Art Carton / Vinyl Doff)`n2. Hangtag Kaos 4x9 cm (Art Carton 310 gsm)`n3. Polymailer Sablon 30x40 cm (1 warna terracotta/putih)`n4. Care Card & Founder Note A6"
    
    "04_LEGAL_INVOICE_FINANCIAL" = "PANDUAN ARSIP INVOICE & PAJAK:`nSimpan struk belanja bahan baku Cititex, nota vendor DTF, bukti transfer ekspedisi, dan rekening koran bulanan untuk audit keuangan CFO."
    
    "99_SYSTEM_SNAPSHOTS_BACKUP" = "PANDUAN SYSTEM BACKUP:`nArsip kompresi (.zip) berkala untuk Obsidian Vault BisnisHub dan export data PostgreSQL Supabase."
}

# Eksekusi pembuatan direktori
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

# Tulis file petunjuk README di subfolder utama
foreach ($key in $readmeGuides.Keys) {
    $targetDir = Join-Path $RootPath $key
    if (Test-Path $targetDir) {
        $readmeFile = Join-Path $targetDir "PANDUAN_FOLDER.txt"
        Set-Content -Path $readmeFile -Value $readmeGuides[$key] -Encoding UTF8
    }
}

# Buat file root README master di External SSD
$masterReadmeContent = @"
============================================================
       BISNISHUB EXTERNAL SSD 1TB - ASSET MASTER VAULT      
============================================================
Owner       : Rizky (Executive Sole Founder)
Organized By: Dewan Co-Founders BisnisHub
Created Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Drive       : $RootPath

ATURAN PENYIMPANAN:
1. Laptop lokal hanya untuk kode web, catatan Obsidian, dan file yang sedang aktif dikerjakan hari ini.
2. File resolusi tinggi (>50MB, PSD, AI, Video 4K, Gang Sheet DTF) wajib disimpan di SSD ini.
3. Selalu gunakan penamaan file baku: YYYYMMDD_[BRAND]_[NAMA_ITEM]_[VERSI].[EXT]

PETA FOLDER UTAMA:
- 00_INBOX_DROPZONE            : Drop sementara dari smartphone/kamera
- 01_BRAND_MASTER_IDENTITIES   : Logo vector & font master resmi
- 02_TEESTOCK_PRODUCTION       : Desain artikel kaos, gang sheet 58cm, footage video
- 03_MULTIGRAPH_COLLATERAL     : File cetak kemasan, hangtag, stiker, proyek maklon
- 04_LEGAL_INVOICE_FINANCIAL   : Nota belanja Cititex, DTF, dan rekening bank
- 99_SYSTEM_SNAPSHOTS_BACKUP   : Backup mingguan Obsidian & Supabase

Tetap rapi, jaga arus kas, dan terus bertumbuh!
============================================================
"@

Set-Content -Path (Join-Path $RootPath "README_MASTER_VAULT.txt") -Value $masterReadmeContent -Encoding UTF8

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " [SUCCESS] Setup direktori selesai!" -ForegroundColor Green
Write-Host " Total folder dibuat/diverifikasi: $($directories.Count)" -ForegroundColor White
Write-Host " Panduan operasional tersimpan di: $RootPath\README_MASTER_VAULT.txt" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan
