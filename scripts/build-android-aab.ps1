# Build release AAB on Windows (short-path workaround).
# Best: copy repo to C:\toolverse first, then run from there.
#
# Usage: .\scripts\build-android-aab.ps1

$ErrorActionPreference = "Stop"
$DriveLetter = "T:"
$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

if (Test-Path "${DriveLetter}\") {
  subst "${DriveLetter}" /d 2>$null
  Start-Sleep -Seconds 1
}

subst $DriveLetter $RepoRoot
try {
  Push-Location "${DriveLetter}\android"
  Write-Host "Building from ${DriveLetter}\android ..." -ForegroundColor Cyan
  .\gradlew.bat bundleRelease
  $aab = Get-ChildItem "app\build\outputs\bundle\release\*.aab" -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($aab) {
    Write-Host "`nAAB ready (versionCode 8):" -ForegroundColor Green
    Write-Host $aab.FullName
  }
} finally {
  Pop-Location
  subst $DriveLetter /d 2>$null
}
