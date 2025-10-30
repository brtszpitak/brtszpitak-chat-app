param(
  [int]$TickSeconds = 30
)

$ErrorActionPreference = "Stop"
Set-Location "D:\Alice\projects\chat-app"

Write-Host "=== Alice 3.0 - Autonomy Launch ==="

# 0) Stop any running backend
if (Test-Path .\Stop-Alice.ps1) {
  & .\Stop-Alice.ps1 | Out-Null
}

# 1) Folders
@(".\downloads",".\server\logs",".\docs",".\scripts") | ForEach-Object {
  if (-not (Test-Path $_)) { New-Item -ItemType Directory $_ | Out-Null }
}

# 2) Guardrails (allow-list + exec rules)
$guardPath = "server\autonomy\guard.json"
$guardDir  = Split-Path $guardPath
if (-not (Test-Path $guardDir)) { New-Item -ItemType Directory $guardDir | Out-Null }

$guard = @{
  allowPaths = @(".", "server","client","downloads","docs","scripts","tests","config")
  denyGlobs = @("**\node_modules\**","**\.git\**",".git","**\*.lock")
  maxWriteBytesPerTick = 2097152
  maxExecSecondsPerTick = 90
  allowExec = @("node","npm","npx","powershell","pwsh","cmd","git","where","curl")
  env = @{ NODE_OPTIONS = "--max_old_space_size=4096" }
} | ConvertTo-Json -Depth 100

$enc = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText((Join-Path (Resolve-Path ".") $guardPath), $guard, $enc)
Write-Host "✔ guard.json refreshed"

# 3) Mission plan - focused, build-first, self-improve always
$plan = @{
  version = "3.0"
  tickSeconds = $TickSeconds
  goals = @(
    "Ship a stable, fast local app with token streaming + TTS",
    "Continuously improve code quality, reliability, and DX",
    "Stay safe: write only in allowed paths, verify before commit"
  )
  tasks = @(
    @{
      id="deps-audit"; priority=10; kind="exec"
      run="npm ci && npx npm-check-updates -u --target minor || exit 0"
      accept="package.json and lockfile valid; server starts"
    },
    @{
      id="format-all"; priority=20; kind="exec"
      run="npx prettier . --write"
      accept="no prettier changes remaining"
    },
    @{
      id="lint-fix"; priority=30; kind="exec"
      run="npx eslint . --ext .js,.jsx,.cjs --fix || exit 0"
      accept="eslint passes or only warnings remain"
    },
    @{
      id="streaming-ui"; priority=40; kind="code"
      note="Implement real token streaming in web UI (client). Ensure graceful fallback."
      accept="visible streaming; no console errors; /health OK"
    },
    @{
      id="tts-voice"; priority=45; kind="code"
      note="Hook TTS toggle in web UI; use local SAPI or configured voice. Non-blocking."
      accept="voice toggle works, plays last assistant reply"
    },
    @{
      id="avatar-scaffold"; priority=50; kind="code"
      note="Add minimal avatar component + lip-sync stub. Disabled by default."
      accept="avatar mounts cleanly behind a feature flag"
    },
    @{
      id="router-hardening"; priority=55; kind="code"
      note="Keep /download HTTPS-only, host whitelist, 50MB cap, checksum. Add tests."
      accept="download self-test passes; tests cover redirect + checksum mismatch"
    },
    @{
      id="health-selftest"; priority=60; kind="code"
      note="Per-tick self-test: verify /health, /download smoke, tick heartbeat"
      accept="heartbeat file updates each tick; errors logged"
    },
    @{
      id="docs-notes"; priority=70; kind="docs"
      note="Write docs/NEXT_PHASE_LOG.md with progress + next steps"
      accept="doc updated each tick with short entry"
    }
  )
} | ConvertTo-Json -Depth 100

[IO.File]::WriteAllText((Resolve-Path ".").Path + "\plan.json", $plan, $enc)
Write-Host "✔ plan.json written (tick = $TickSeconds s)"

# 4) Start backend
& .\Start-Alice.ps1 | Out-Null

# 5) Wait for /health
$ok = $false
for ($i=1; $i -le 15; $i++) {
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:3001/health" -TimeoutSec 2
    if ($resp.Content -match '"ok":\s*true') { $ok = $true; break }
  } catch {
    Start-Sleep -Seconds 1
  }
}
if (-not $ok) {
  Write-Warning "Backend /health not responding yet - continuing cautiously."
} else {
  Write-Host "✔ /health OK"
}

# 6) Sanity: /download smoke (and checksum)
$body = @{ url = "https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore"; filename = "alice-selfcheck.gitignore" } | ConvertTo-Json
try {
  $d = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:3001/download" -ContentType "application/json" -Body $body -TimeoutSec 60
  $local = (Get-FileHash ".\downloads\alice-selfcheck.gitignore" -Algorithm SHA256).Hash.ToLower()
  if ($d.sha256 -ne $local) {
    Write-Warning ("Download checksum mismatch (server={0}, local={1})" -f $d.sha256, $local)
  } else {
    Write-Host ("✔ /download OK (sha256 {0})" -f $local)
  }
} catch {
  Write-Warning ("Download smoke test failed: {0}" -f $_.Exception.Message)
}

# 7) Kick the autonomy tick (try several route names)
function Invoke-AliceTick {
  param([int]$Tries = 2)
  $routes = @(
    @{ method="POST"; url="http://127.0.0.1:3001/autonomy/tick" },
    @{ method="POST"; url="http://127.0.0.1:3001/autonomy/start" },
    @{ method="GET" ; url="http://127.0.0.1:3001/autonomy/tick" },
    @{ method="GET" ; url="http://127.0.0.1:3001/autonomy/start" }
  )
  foreach ($r in $routes) {
    for ($i=1; $i -le $Tries; $i++) {
      try {
        if ($r.method -eq "POST") {
          Invoke-RestMethod -Method Post -Uri $r.url -TimeoutSec 10 | Out-Null
        } else {
          Invoke-RestMethod -Method Get -Uri $r.url -TimeoutSec 10 | Out-Null
        }
        return $true
      } catch {
        Start-Sleep -Seconds 1
      }
    }
  }
  return $false
}

$kicked = Invoke-AliceTick
if ($kicked) { Write-Host "✔ Autonomy tick signalled" } else { Write-Warning "Could not hit autonomy tick endpoint (it may be scheduled already)" }

# 8) Status peek
try {
  $status = Invoke-RestMethod -Method Get -Uri "http://127.0.0.1:3001/autonomy/status" -TimeoutSec 5
  Write-Host ("Status: " + ($status | ConvertTo-Json -Depth 10))
} catch {
  Write-Host "i status endpoint not available (ok if older build); check logs instead."
}

Write-Host ""
Write-Host "=== RUNNING ==="
Write-Host ("Tick interval: {0} s" -f $TickSeconds)
Write-Host ("Plan file    : {0}" -f (Resolve-Path .\plan.json))
Write-Host ("Guard file   : {0}" -f (Join-Path (Resolve-Path ".") $guardPath))
Write-Host ("Logs folder  : {0}" -f (Resolve-Path .\server\logs))
Write-Host "Heartbeat    : .\client\dist\autonomy_heartbeat.txt (if enabled)"
Write-Host "Next steps   : Watch logs while Alice formats/lints/builds and implements streaming + TTS."