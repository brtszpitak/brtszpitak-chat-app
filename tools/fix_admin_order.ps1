param(
  [string]$ServerFile = "D:\Alice\projects\chat-app\index.js"
)

if (-not (Test-Path $ServerFile)) { throw "index.js not found at $ServerFile" }

# Backup first
$backup = "$ServerFile.bak_{0}.txt" -f (Get-Date -Format 'yyyyMMdd_HHmmss')
Copy-Item -Force $ServerFile $backup

# Read file
$text = Get-Content -Raw -Path $ServerFile

# Define the three lines we want together
$useBlock = "app.use(execGuard);`r`napp.use('/download', downloadRouter);`r`napp.use('/admin', adminRouter);`r`n"

# Remove any existing copies (idempotent)
$patterns = @(
  '(?m)^\s*app\.use\(\s*execGuard\s*\)\s*;\s*\r?\n?',
  '(?m)^\s*app\.use\(\s*["'']/download["'']\s*,\s*downloadRouter\s*\)\s*;\s*\r?\n?',
  '(?m)^\s*app\.use\(\s*["'']/admin["'']\s*,\s*adminRouter\s*\)\s*;\s*\r?\n?'
)
foreach ($p in $patterns) { $text = [regex]::Replace($text, $p, '') }

# Find SPA catch-all (first match wins)
$regexes = @(
  '(?m)^\s*app\.get\(\s*["'']\*["'']',             # app.get('*', ...)
  '(?m)^\s*app\.get\(\s*["'']/\*["'']',            # app.get('/*', ...)
  '(?m)^\s*app\.use\(\s*\(\s*req\s*,\s*res',       # app.use((req,res)=>...)
  '(?m)^\s*app\.use\(\s*["''][^"'']*["'']\s*,\s*\(\s*req\s*,\s*res'  # app.use('/(.*)', (req,res)=>...)
)

$pos = -1
foreach ($rx in $regexes) {
  $m = [regex]::Match($text, $rx)
  if ($m.Success) { $pos = $m.Index; break }
}

# If no catch-all found, insert before app.listen(...); else append at end
if ($pos -lt 0) {
  $m = [regex]::Match($text, '(?m)^\s*app\.listen\(')
  $pos = if ($m.Success) { $m.Index } else { $text.Length }
}

# Insert our block
$text = $text.Insert($pos, $useBlock + "`r`n")

# Save (UTF-8 no BOM)
[IO.File]::WriteAllText($ServerFile, $text, (New-Object System.Text.UTF8Encoding($false)))

"✅ Fixed. Backup saved to: $backup"
