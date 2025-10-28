$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
function Save-JsonNoBom { param([string]$Path,[object]$Obj) $enc = New-Object System.Text.UTF8Encoding($false); [IO.File]::WriteAllText($Path, ($Obj | ConvertTo-Json -Depth 100), $enc) }
function Get-TextNoBom { param([string]$Path) $b=[IO.File]::ReadAllBytes($Path); if($b.Length -ge 3 -and $b[0]-eq 0xEF -and $b[1]-eq 0xBB -and $b[2]-eq 0xBF){ $b=$b[3..($b.Length-1)] }; [Text.Encoding]::UTF8.GetString($b) }
New-Item -ItemType Directory -Force -Path (Join-Path $root 'scripts') | Out-Null
$after = @('exports.default = async function (context) {','  const fs = require("fs");','  const path = require("path");','  const keep = new Set(["en-GB","en-US"]);','  const localesDir = path.join(context.appOutDir, "locales");','  if (fs.existsSync(localesDir)) {','    for (const f of fs.readdirSync(localesDir)) {','      if (f.endsWith(".pak") && !keep.has(f.replace(".pak",""))) {','        try { fs.unlinkSync(path.join(localesDir, f)); } catch {}','      }','    }','  }','};' )
$enc = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText((Join-Path $root 'scripts\afterPack-prune.js'), ($after -join "`r`n"), $enc)
$pkgPath = Join-Path $root 'package.json'
$pkg = (Get-TextNoBom $pkgPath) | ConvertFrom-Json
if(-not $pkg.PSObject.Properties.Match('build')){ $pkg | Add-Member -NotePropertyName build -NotePropertyValue ([pscustomobject]@{}) }
if(-not $pkg.build.PSObject.Properties.Match('win')){ $pkg.build | Add-Member -NotePropertyName win -NotePropertyValue ([pscustomobject]@{}) }
$pkg.build.electronLanguages = @('en-GB','en-US')
$pkg.build.compression = 'maximum'
$pkg.build.artifactName = '${productName}-${version}-${os}-${arch}.${ext}'
$pkg.build.asar = $true
$pkg.build.asarUnpack = @('**/*.node')
$pkg.build.afterPack = 'scripts/afterPack-prune.js'
$pkg.build.win.target = 'nsis'
if (Test-Path (Join-Path $root 'build\icon.ico')) { $pkg.build.win.icon = 'build/icon.ico' }
if(-not $pkg.build.PSObject.Properties.Match('productName'))   { $pkg.build.productName   = 'Alice Chat' }
if(-not $pkg.build.PSObject.Properties.Match('appId'))         { $pkg.build.appId         = 'com.alice.chatapp' }
if(-not $pkg.build.PSObject.Properties.Match('publisherName')) { $pkg.build.publisherName = 'Bartosz' }
Save-JsonNoBom -Path $pkgPath -Obj $pkg
Remove-Item -Recurse -Force (Join-Path $root 'dist') -ErrorAction SilentlyContinue
$nsis = Join-Path $env:LOCALAPPDATA 'electron-builder\Cache\nsis'
if(Test-Path $nsis){ Remove-Item -Recurse -Force $nsis }
Push-Location $root
npm install
npx electron-builder --dir --publish never
npx electron-builder --win nsis --publish never
Get-ChildItem (Join-Path $root 'dist') -Recurse -File | Sort-Object Length -Desc | Select-Object -First 25 FullName,Length,LastWriteTime | Format-Table -AutoSize
Pop-Location