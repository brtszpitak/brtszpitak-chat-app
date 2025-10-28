Write-Host "🚀 Upgrading Alice to creative-autonomy mode..." -ForegroundColor Cyan

$root   = "D:\Alice\projects\chat-app"
$server = Join-Path $root "server"
$scrDir = Join-Path $server "scripts"
New-Item -ItemType Directory -Force -Path $scrDir | Out-Null

# Safety snapshot
if (-not (Test-Path "$root\.git")) {
  git init
  git add .
  git commit -m "Pre-upgrade snapshot"
  git branch autonomy
}

# Minimal creative placeholders
$plan  = 'console.log("Planning creative features...");'
$write = 'console.log("Writing new code...");'
$test  = 'console.log("Testing all components...");'

Set-Content -Encoding UTF8 "$scrDir\plan-feature.cjs"  $plan
Set-Content -Encoding UTF8 "$scrDir\write-feature.cjs" $write
Set-Content -Encoding UTF8 "$scrDir\test-all.cjs"      $test

Set-Content -Encoding UTF8 "$root\docs\ROADMAP.md" @"
# Alice Creative Roadmap
- Improve voice & avatar integration
- Expand TTS and emotion engine
- Add self-update and modular plugin design
"@

Write-Host "✅ Creative scripts and roadmap written."
Write-Host "Restarting backend..."
& "$root\Stop-Alice.ps1"
& "$root\Start-Alice.ps1"
Write-Host "✨ Done. Alice ready for creative extensions."
