<#
.SYNOPSIS
    Phase 2 Import Migration Script — Direct Pattern Matching
    Rewrites relative imports of @shared files to @bisnishub/shared alias.

.PARAMETER DryRun
    Preview changes without modifying files.

.PARAMETER Execute
    Actually rewrite the imports.

.EXAMPLE
    .\migrate-imports.ps1 -DryRun
    .\migrate-imports.ps1 -Execute
#>

[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$Execute
)

$ErrorActionPreference = 'Stop'

if (-not $DryRun -and -not $Execute) {
    Write-Host '  Usage: .\migrate-imports.ps1 -DryRun | -Execute'
    exit 0
}

$Root = Split-Path -Parent $PSScriptRoot

# Known shared modules — map from filename to shared path
$sharedMap = @{
    # Services
    'supabase'       = 'services/supabase'
    'ordersApi'      = 'services/ordersApi'
    'inventoryApi'   = 'services/inventoryApi'
    'ledgerApi'      = 'services/ledgerApi'
    'productsApi'    = 'services/productsApi'
    'settingsApi'    = 'services/settingsApi'
    'procurementsApi'= 'services/procurementsApi'
    'vouchersApi'    = 'services/vouchersApi'
    'paymentAdapter' = 'services/paymentAdapter'
    'shippingApi'    = 'services/shippingApi'
    'assetsApi'      = 'services/assetsApi'
    'cloudinary'     = 'services/cloudinary'
    'subscribersApi' = 'services/subscribersApi'
    # Constants
    'pricing'        = 'constants/pricing'
    'garments'       = 'constants/garments'
    'colors'         = 'constants/colors'
    'series'         = 'constants/series'
    'seedData'       = 'constants/seedData'
    # Utils
    'dtfPlanner'     = 'utils/dtfPlanner'
    'formatters'     = 'utils/formatters'
    'garmentStockRouting' = 'utils/garmentStockRouting'
    'orderNumber'    = 'utils/orderNumber'
    'productImages'  = 'utils/productImages'
    'whatsappTemplates' = 'utils/whatsappTemplates'
    # Context
    'AuthContext'    = 'context/AuthContext'
    'StoreContext'   = 'context/StoreContext'
    'ThemeContext'   = 'context/ThemeContext'
    # UI Components
    'Badge'          = 'components/ui/Badge'
    'Button'         = 'components/ui/Button'
    'Card'           = 'components/ui/Card'
    'Input'          = 'components/ui/Input'
    'Modal'          = 'components/ui/Modal'
    'Toast'          = 'components/ui/Toast'
    # Common Components
    'SEOHead'        = 'components/common/SEOHead'
    'TeeStockLogo'   = 'components/common/TeeStockLogo'
    'ThemeToggle'    = 'components/common/ThemeToggle'
}

Write-Host "  Registered $($sharedMap.Count) shared modules" -ForegroundColor Cyan

# Define apps to process
$apps = @(
    @{
        Name = 'BisnisHub OS'
        SrcDir = Join-Path $Root 'apps\bisnishub-web\src'
        Extensions = @('*.jsx', '*.tsx', '*.js', '*.ts')
    },
    @{
        Name = 'TeeStock WebClient'
        SrcDir = Join-Path $Root 'bisnis\teestock\web\src'
        Extensions = @('*.jsx', '*.js')
    }
)

$totalRewrites = 0
$totalFiles = 0

foreach ($app in $apps) {
    Write-Host ''
    Write-Host "  Processing: $($app.Name)" -ForegroundColor Yellow

    $appRewrites = 0

    $files = Get-ChildItem -Path $app.SrcDir -Recurse -Include $app.Extensions -File |
        Where-Object {
            $_.FullName -notmatch '\\node_modules\\' -and
            $_.FullName -notmatch '\\dist\\' -and
            $_.FullName -notmatch '\\__tests__\\'
        }

    foreach ($file in $files) {
        $lines = Get-Content -Path $file.FullName -Encoding UTF8
        $modified = $false
        $fileRewrites = 0
        $newLines = @()

        foreach ($line in $lines) {
            $newLine = $line

            # Match: import ... from '...(relative path to shared module)...'
            # or: export ... from '...'
            if ($line -match "^(.*from\s+['""])(\.\./[^'""]+|\.\/[^'""]+)(['""].*)$") {
                $before = $Matches[1]
                $relPath = $Matches[2]
                $after = $Matches[3]

                # Extract the last segment (module name) from the relative path
                $cleanPath = $relPath -replace '\.(js|jsx|ts|tsx)$', ''
                $segments = $cleanPath -split '/'
                $moduleName = $segments[-1]

                # Check if this module is in our shared map
                if ($sharedMap.ContainsKey($moduleName)) {
                    $sharedPath = $sharedMap[$moduleName]

                    # Verify the path context matches (e.g., services/ordersApi not some other ordersApi)
                    $pathCategory = $segments[-2]
                    $sharedCategory = ($sharedPath -split '/')[0]

                    # Handle cases where the relative path includes the category
                    $categoryMatch = $false
                    if ($pathCategory -eq $sharedCategory) {
                        $categoryMatch = $true
                    }
                    # Handle UI components: ../ui/Button -> components/ui/Button
                    elseif ($pathCategory -eq 'ui' -and $sharedCategory -eq 'components') {
                        $categoryMatch = $true
                    }
                    # Handle common components: ../common/SEOHead -> components/common/SEOHead
                    elseif ($pathCategory -eq 'common' -and $sharedCategory -eq 'components') {
                        $categoryMatch = $true
                    }
                    # Handle deep relative: ../../components/ui/Button
                    elseif ($relPath -match "components/(ui|common)/$moduleName") {
                        $categoryMatch = $true
                    }

                    if ($categoryMatch) {
                        $newLine = "${before}@bisnishub/shared/${sharedPath}${after}"
                        $modified = $true
                        $fileRewrites++
                    }
                }
            }

            $newLines += $newLine
        }

        if ($modified) {
            $relFile = $file.FullName.Substring($app.SrcDir.Length + 1) -replace '\\', '/'
            if ($DryRun) {
                Write-Host "    [DRY] $relFile ($fileRewrites rewrites)" -ForegroundColor Cyan
            }
            if ($Execute) {
                $newLines | Set-Content -Path $file.FullName -Encoding UTF8
                Write-Host "    [OK]  $relFile ($fileRewrites rewrites)" -ForegroundColor Green
            }
            $appRewrites += $fileRewrites
            $totalFiles++
        }
    }

    Write-Host "  Subtotal: $appRewrites rewrites in $($app.Name)" -ForegroundColor $(if ($appRewrites -gt 0) { 'Yellow' } else { 'Green' })
    $totalRewrites += $appRewrites
}

Write-Host ''
Write-Host '  ---------------------------------------------------' -ForegroundColor DarkGray
Write-Host "  Total files modified : $totalFiles" -ForegroundColor White
Write-Host "  Total imports rewritten : $totalRewrites" -ForegroundColor White
Write-Host '  ---------------------------------------------------' -ForegroundColor DarkGray

if ($DryRun) {
    Write-Host ''
    Write-Host '  DRY RUN complete. No files modified.' -ForegroundColor Yellow
    Write-Host '  Run with -Execute to apply changes.' -ForegroundColor Yellow
}

if ($Execute -and $totalRewrites -gt 0) {
    Write-Host ''
    Write-Host "  Done! $totalRewrites imports rewritten. Verify builds:" -ForegroundColor Green
    Write-Host '    cd bisnis\teestock\web && npx vite build' -ForegroundColor Cyan
    Write-Host '    cd apps\bisnishub-web && npx vite build' -ForegroundColor Cyan
}
