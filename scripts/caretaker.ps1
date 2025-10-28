param(
  [string]$Root,
  [int]$Minutes=1440,
  [int]$HealthEvery=5,
  [int]$TaskEvery=60
)
$ErrorActionPreference = "Stop"
$logDir = Join-Path $Root "logs"
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }
$logPath = Join-Path $logDir ("caretaker-{0}.log" -f (Get-Date -UFormat "%Y%m%d-%H%M%S"))

function Log($m){ Add-Content -Path $logPath -Value ("[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $m) }

Log "Caretaker started"
$nextHealth = Get-Date
$nextTask = Get-Date

for ($i=0; $i -lt $Minutes; $i++) {
  $now = Get-Date
  if ($now -ge $nextHealth) {
    try { $r = Invoke-RestMethod http://127.0.0.1:3001/health -TimeoutSec 5
      if ($r.ok) { Log "HEALTH OK" } else { Log "HEALTH WARN" } }
    catch { Log ("HEALTH ERROR: {0}" -f $_.Exception.Message) }
    $nextHealth = $now.AddMinutes($HealthEvery)
  }
  if ($now -ge $nextTask) {
    try {
      Log "TASK START: self-improve (lint/format if available)"
      if (Test-Path (Join-Path $Root 'server\package.json')) {
        try { npm --prefix (Join-Path $Root 'server') run lint 2>&1 | Out-String | ForEach-Object { Log $_ } } catch {}
        try { npm --prefix (Join-Path $Root 'server') run format 2>&1 | Out-String | ForEach-Object { Log $_ } } catch {}
      }
      if (Test-Path (Join-Path $Root 'client\package.json')) {
        try { npm --prefix (Join-Path $Root 'client') run lint 2>&1 | Out-String | ForEach-Object { Log $_ } } catch {}
        try { npm --prefix (Join-Path $Root 'client') run format 2>&1 | Out-String | ForEach-Object { Log $_ } } catch {}
      }
      Log "TASK END"
    } catch { Log ("TASK ERROR: {0}" -f $_.Exception.Message) }
    $nextTask = $now.AddMinutes($TaskEvery)
  }
  Start-Sleep -Seconds 60
}
Log "Caretaker finished"