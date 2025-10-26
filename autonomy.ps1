param(
  [string]$ApiBase = "http://localhost:3001",
  [string]$LogDir = ".\logs"
)

$ErrorActionPreference = "Stop"
if (!(Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir | Out-Null }
$stamp = (Get-Date -Format "yyyyMMdd-HHmmss")
$logFile = Join-Path $LogDir "autonomy-$stamp.log"

function Write-Log([string]$msg) {
  $line = "[{0}] {1}" -f (Get-Date -Format o), $msg
  $line | Tee-Object -FilePath $logFile -Append | Out-Null
}

try {
  Write-Log "Starting autonomy cycle…"
  $payload = @{ reason = "scheduled cycle" } | ConvertTo-Json
  $resp = Invoke-RestMethod -Method Post -Uri "$ApiBase/runOnce" -ContentType "application/json" -Body $payload
  Write-Log ("runOnce: status={0} msg={1}" -f $resp.status, $resp.message)

  if ($resp.nextTask) {
    $t = $resp.nextTask
    Write-Log ("Next task: {0} {1}" -f $t.action, $t.title)
    switch ($t.action) {
      "download" {
        $b = @{ url = $t.url }
        if ($t.expectedSha256) { $b.expectedSha256 = $t.expectedSha256 }
        $j = $b | ConvertTo-Json
        $d = Invoke-RestMethod -Method Post -Uri "$ApiBase/download" -ContentType "application/json" -Body $j
        Write-Log ("download -> ok={0} file={1} bytes={2}" -f $d.ok, $d.filename, $d.bytes)
      }
      "exec" {
        $j = @{ cmd = $t.cmd } | ConvertTo-Json
        $e = Invoke-RestMethod -Method Post -Uri "$ApiBase/exec" -ContentType "application/json" -Body $j
        Write-Log ("exec -> completed (see server logs for NDJSON stream)")
      }
      default {
        Write-Log ("no handler for action '{0}'" -f $t.action)
      }
    }
  } else {
    Write-Log "Idle: no tasks"
  }

  Write-Log "Autonomy cycle complete."
} catch {
  Write-Log ("ERROR: {0}" -f $_)
  exit 1
}
