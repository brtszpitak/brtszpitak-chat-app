# D:\Alice\projects\chat-app\server\scripts\backup-memory.ps1
$ErrorActionPreference = 'Stop'

$DataDir    = 'D:\Alice\projects\chat-app\server\data'
$SourceFile = Join-Path $DataDir 'memories.jsonl'

# Timestamps
$nowLocal = Get-Date
$nowUtc   = [DateTime]::UtcNow

# Use UTC in filename to avoid timezone/DST confusion
$stampUtc = $nowUtc.ToString('yyyyMMdd_HHmmss')
$BackupFile = Join-Path $DataDir ("memories.backup_UTC_{0}.jsonl" -f $stampUtc)

# Log file (rotates daily-ish)
$LogFile = Join-Path $DataDir 'backup-memory.log'

# Ensure data dir exists
if (-not (Test-Path $DataDir)) {
  New-Item -ItemType Directory -Path $DataDir | Out-Null
}

# Write a header line to the log with both Local and UTC
$logEntry = @"
[$($nowLocal.ToString('o')) / Local | $($nowUtc.ToString('o')) / UTC]
User: $env:USERNAME  | Machine: $env:COMPUTERNAME
TimeZone (Local): $([System.TimeZoneInfo]::Local.Id)
Source: $SourceFile
Dest:   $BackupFile
"@

Add-Content -Path $LogFile -Value $logEntry

# Perform the copy
Copy-Item -Path $SourceFile -Destination $BackupFile -Force

Add-Content -Path $LogFile -Value "[OK] Copied -> $BackupFile`r`n"

# Optional: keep last 30 backups to avoid piling up
Get-ChildItem $DataDir -Filter 'memories.backup_UTC_*.jsonl' |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 30 |
  Remove-Item -Force -ErrorAction SilentlyContinue
