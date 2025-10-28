param(
  [string]$Root,
  [string]$LogFile = "logs\\client-start.log"
)
$ErrorActionPreference = "SilentlyContinue"
$full = Join-Path $Root $LogFile
if (-not (Test-Path $full)) { exit 0 }
$txt = Get-Content $full -Raw
if ($txt -match '(http://localhost:\d{3,5})') {
  $url = $Matches[1]
  $desk = [Environment]::GetFolderPath("Desktop")
  $dest = Join-Path $desk "Chat App.url"
  @"
[InternetShortcut]
URL=$url
IconIndex=0
"@ | Set-Content -Path $dest -Encoding ASCII
}
exit 0
