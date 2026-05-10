<#
PowerShell script to convert images in ./graphics to WebP using cwebp or ImageMagick.
Usage: Open PowerShell in the `36-website` folder and run:
    powershell -ExecutionPolicy Bypass -File .\scripts\convert_images.ps1

This script tries to use `cwebp` (from libwebp). If not found, it will try ImageMagick `magick`.
It converts JPG/PNG files to WebP alongside the originals.
#>

$graphicsDir = Join-Path $PSScriptRoot "..\graphics"
Set-Location $graphicsDir

$useCwebp = (Get-Command cwebp -ErrorAction SilentlyContinue) -ne $null
$useMagick = (Get-Command magick -ErrorAction SilentlyContinue) -ne $null

if (-not $useCwebp -and -not $useMagick) {
    Write-Host "Neither 'cwebp' nor 'magick' found in PATH. Install libwebp (cwebp) or ImageMagick and re-run." -ForegroundColor Yellow
    Write-Host "Example (choco): choco install webp imagemagick" -ForegroundColor Gray
    exit 1
}

Get-ChildItem -File -Include *.jpg,*.jpeg,*.png | ForEach-Object {
    $src = $_.FullName
    $dest = [System.IO.Path]::ChangeExtension($src, ".webp")
    if (Test-Path $dest) {
        Write-Host "Skipping existing: $($_.Name) -> $(Split-Path $dest -Leaf)"
        return
    }

    if ($useCwebp) {
        # cwebp -q 85 infile -o outfile
        & cwebp -q 85 "$src" -o "$dest"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Converted (cwebp): $($_.Name) -> $(Split-Path $dest -Leaf)"
        } else {
            Write-Host "Failed (cwebp) for $($_.Name)" -ForegroundColor Red
        }
    } elseif ($useMagick) {
        # magick input -quality 85 output.webp
        & magick "$src" -quality 85 "$dest"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Converted (magick): $($_.Name) -> $(Split-Path $dest -Leaf)"
        } else {
            Write-Host "Failed (magick) for $($_.Name)" -ForegroundColor Red
        }
    }
}

Write-Host "Done. WebP files written next to original images in 'graphics' folder." -ForegroundColor Green
