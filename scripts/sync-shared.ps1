<#
.SYNOPSIS
    BisnisHub Shared Package Integrity Verifier
    Verifies that @shared files live in packages/shared/src/ and
    no stale duplicates remain in app directories.

.DESCRIPTION
    Post-Phase 2 verification script. Checks:
    1. All 36 shared files exist in packages/shared/src/
    2. No duplicate copies remain in apps/bisnishub-web/src/ or bisnis/teestock/web/src/

.EXAMPLE
    .\sync-shared.ps1 -Verify
#>

[CmdletBinding()]
param(
    [switch]$Verify
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$SharedSrc = Join-Path $Root 'packages\shared\src'
$BHSrc = Join-Path $Root 'apps\bisnishub-web\src'
$TSSrc = Join-Path $Root 'bisnis\teestock\web\src'

$sharedFiles = @(
    'services/supabase.js',
    'services/ordersApi.js',
    'services/inventoryApi.js',
    'services/ledgerApi.js',
    'services/productsApi.js',
    'services/settingsApi.js',
    'services/procurementsApi.js',
    'services/vouchersApi.js',
    'services/paymentAdapter.js',
    'services/shippingApi.js',
    'services/assetsApi.js',
    'services/cloudinary.js',
    'services/subscribersApi.js',
    'constants/pricing.js',
    'constants/garments.js',
    'constants/colors.js',
    'constants/series.js',
    'constants/seedData.js',
    'utils/dtfPlanner.js',
    'utils/formatters.js',
    'utils/garmentStockRouting.js',
    'utils/orderNumber.js',
    'utils/productImages.js',
    'utils/whatsappTemplates.js',
    'context/AuthContext.jsx',
    'context/StoreContext.jsx',
    'context/ThemeContext.jsx',
    'components/ui/Badge.jsx',
    'components/ui/Button.jsx',
    'components/ui/Card.jsx',
    'components/ui/Input.jsx',
    'components/ui/Modal.jsx',
    'components/ui/Toast.jsx',
    'components/common/SEOHead.jsx',
    'components/common/TeeStockLogo.jsx',
    'components/common/ThemeToggle.jsx'
)

if (-not $Verify) {
    Write-Host ''
    Write-Host '  BisnisHub Shared Package Verifier' -ForegroundColor Cyan
    Write-Host '  Usage: .\sync-shared.ps1 -Verify' -ForegroundColor Yellow
    Write-Host ''
    Write-Host '  Phase 2 Completed: All @shared files now live in packages/shared/src/' -ForegroundColor DarkGray
    Write-Host '  This script verifies integrity — no sync needed anymore.' -ForegroundColor DarkGray
    Write-Host ''
    exit 0
}

Write-Host ''
Write-Host "  BisnisHub Shared Package Integrity Check" -ForegroundColor Cyan
Write-Host "  Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host ''

$total = $sharedFiles.Count
$presentCount = 0
$missingCount = 0
$staleCount = 0
$errors = @()

foreach ($f in $sharedFiles) {
    $sharedPath = Join-Path $SharedSrc ($f -replace '/', '\')
    $bhPath = Join-Path $BHSrc ($f -replace '/', '\')
    $tsPath = Join-Path $TSSrc ($f -replace '/', '\')

    # Check shared package has the file
    if (Test-Path $sharedPath) {
        $presentCount++
    } else {
        $missingCount++
        $errors += "MISSING from shared: $f"
        Write-Host "  [MISS]  $f -- not in packages/shared/src/" -ForegroundColor Red
    }

    # Check no stale copies in apps
    if (Test-Path $bhPath) {
        $staleCount++
        Write-Host "  [STALE] $f -- duplicate in BisnisHub OS" -ForegroundColor Yellow
    }
    if (Test-Path $tsPath) {
        $staleCount++
        Write-Host "  [STALE] $f -- duplicate in TeeStock" -ForegroundColor Yellow
    }
}

Write-Host ''
Write-Host '  ---------------------------------------------------' -ForegroundColor DarkGray
Write-Host "  Total @shared files  : $total" -ForegroundColor White
Write-Host "  In packages/shared/  : $presentCount" -ForegroundColor $(if ($presentCount -eq $total) { 'Green' } else { 'Red' })
Write-Host "  Missing              : $missingCount" -ForegroundColor $(if ($missingCount -eq 0) { 'Green' } else { 'Red' })
Write-Host "  Stale duplicates     : $staleCount" -ForegroundColor $(if ($staleCount -eq 0) { 'Green' } else { 'Yellow' })
Write-Host '  ---------------------------------------------------' -ForegroundColor DarkGray

if ($missingCount -eq 0 -and $staleCount -eq 0) {
    Write-Host ''
    Write-Host '  All @shared files verified. Single source of truth intact.' -ForegroundColor Green
    Write-Host ''
    exit 0
} else {
    if ($staleCount -gt 0) {
        Write-Host ''
        Write-Host "  WARNING: $staleCount stale duplicate(s) found in app directories." -ForegroundColor Yellow
        Write-Host '  These should be deleted. Apps should import from @bisnishub/shared/' -ForegroundColor Yellow
    }
    Write-Host ''
    exit 1
}
