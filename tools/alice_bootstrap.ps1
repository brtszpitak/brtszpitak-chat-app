<#  Alice Bootstrap (Step 1 + Step 4) — 21 Oct 2025
    - Adds policy & safe /download route
    - Adds /admin routes + exec guard
    - ESM or CJS aware (auto-detects index.js style)
    - Safer backup (zip to %TEMP%, then move)
    - Safe index.js patch (no brittle regex)
#>

# -------------------------------
# 0) CONFIG
# -------------------------------
$Root          = 'D:\Alice\projects\chat-app'
$ServerFile    = Join-Path $Root 'index.js'
$ToolsDir      = Join-Path $Root 'tools'
$RoutesDir     = Join-Path $Root 'routes'
$PolicyDir     = Join-Path $Root 'policy'
$UtilsDir      = Join-Path $Root 'utils'
$DownloadsDir  = Join-Path $Root 'downloads'
$TempDir       = Join-Path $DownloadsDir '_temp'
$QuarDir       = Join-Path $DownloadsDir 'quarantine'
$LogsDir       = Join-Path $Root 'logs'
$BackupsDir    = Join-Path $Root 'backups'
$ManifestFile  = Join-Path $DownloadsDir 'manifest.jsonl'
$AutonomyFlag  = Join-Path $Root 'AUTONOMY_OFF'
$PolicyFile    = Join-Path $PolicyDir 'policy.json'
$AllowlistFile = Join-Path $PolicyDir 'allowlist.json'
$ExecAllowFile = Join-Path $PolicyDir 'exec-allowed.json'
$BootstrapTag  = '// [ALICE-BOOTSTRAP]'
$NowStamp      = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'
$TempZip       = Join-Path $env:TEMP "chat-app_pre_bootstrap_$NowStamp.zip"
$FinalZip      = Join-Path $BackupsDir "pre_bootstrap_$NowStamp.zip"

Write-Host "== Alice Bootstrap: prechecks =="

if (-not (Test-Path $Root)) { throw "Project root not found: $Root" }
if (-not (Test-Path $ServerFile)) { throw "Server entry not found: $ServerFile" }

$nodeVer = (& node -v) 2>$null
if (-not $nodeVer) { throw "Node.js not on PATH." }
Write-Host "Node: $nodeVer"

# -------------------------------
# 1) FOLDERS & FILES
# -------------------------------
Write-Host "== Creating folders =="
$dirs = @($ToolsDir,$RoutesDir,$PolicyDir,$UtilsDir,$DownloadsDir,$TempDir,$QuarDir,$LogsDir,$BackupsDir)
$dirs | ForEach-Object { New-Item -ItemType Directory -Force -Path $_ | Out-Null }
if (-not (Test-Path $ManifestFile)) { New-Item -ItemType File -Force -Path $ManifestFile | Out-Null }

# -------------------------------
# 2) BACKUP (zip to %TEMP%, then move)
# -------------------------------
Write-Host "== Backing up project to $FinalZip =="
Add-Type -AssemblyName System.IO.Compression.FileSystem
if (Test-Path $TempZip) { Remove-Item -Force $TempZip }
if (-not (Test-Path $BackupsDir)) { New-Item -ItemType Directory -Force -Path $BackupsDir | Out-Null }
try {
  [System.IO.Compression.ZipFile]::CreateFromDirectory($Root, $TempZip)
  Move-Item -Force $TempZip $FinalZip
} catch {
  Write-Warning "Backup warning: $($_.Exception.Message)"
}

# -------------------------------
# 3) POLICY FILES
# -------------------------------
Write-Host "== Writing policy files =="
@'
{
  "mode": "conservative",
  "download": {
    "httpsOnly": true,
    "maxBytes": 1073741824,
    "headTimeoutMs": 120000,
    "readTimeoutMs": 1800000,
    "maxRedirects": 5,
    "rateLimitPerHost": 3,
    "requireChecksumForExecutables": true
  },
  "exec": {
    "allowOnlyFromDownloads": true,
    "requireVerifiedSource": true
  },
  "budgets": {
    "maxToolCallsPerGoal": 50,
    "maxDiskMBPerGoal": 2048
  }
}
'@ | Set-Content -Path $PolicyFile -Encoding UTF8

@'
{
  "domains": [
    "github.com",
    "raw.githubusercontent.com",
    "objects.githubusercontent.com",
    "api.github.com",
    "models.githubusercontent.com",
    "npmjs.org",
    "registry.npmjs.org",
    "nodejs.org",
    "dl.google.com",
    "microsoft.com",
    "aka.ms",
    "huggingface.co",
    "cdn-lfs.huggingface.co",
    "ollama.com"
  ]
}
'@ | Set-Content -Path $AllowlistFile -Encoding UTF8

@'
{
  "binaries": [
    { "cmd": "node", "args": ".*" },
    { "cmd": "npm", "args": ".*" },
    { "cmd": "powershell", "args": "-ExecutionPolicy Bypass -File .*" },
    { "cmd": "tar", "args": ".*" }
  ],
  "extensionsExecutable": [".exe", ".msi", ".bat", ".cmd", ".ps1"]
}
'@ | Set-Content -Path $ExecAllowFile -Encoding UTF8

# -------------------------------
# 4) UTILS
# -------------------------------
Write-Host "== Writing utils =="
@'
const crypto = require("crypto");
module.exports.sha256 = (bufOrStr) => {
  const hash = crypto.createHash("sha256");
  hash.update(bufOrStr);
  return hash.digest("hex");
};
module.exports.sleep = (ms)=> new Promise(r=>setTimeout(r,ms));
'@ | Set-Content -Path (Join-Path $UtilsDir 'hash.js') -Encoding UTF8

@'
const fs = require("fs");
const path = require("path");
module.exports.safeJoin = (base, p) => {
  const resolved = path.resolve(base, p);
  if (!resolved.toLowerCase().startsWith(path.resolve(base).toLowerCase())) {
    throw new Error("Path escapes base");
  }
  return resolved;
};
module.exports.ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };
'@ | Set-Content -Path (Join-Path $UtilsDir 'paths.js') -Encoding UTF8

# -------------------------------
# 5) ROUTES: /download
# -------------------------------
Write-Host "== Writing routes/download.js =="
@'
const fs = require("fs");
const path = require("path");
const https = require("https");
const { sha256 } = require("../utils/hash");
const { ensureDir } = require("../utils/paths");

const ROOT = path.resolve(__dirname, "..");
const DL_ROOT = path.join(ROOT, "downloads");
const TEMP = path.join(DL_ROOT, "_temp");
const QUAR = path.join(DL_ROOT, "quarantine");
const MANIFEST = path.join(DL_ROOT, "manifest.jsonl");
const POLICY = require("../policy/policy.json");
const ALLOW = require("../policy/allowlist.json");
const EXEC_ALLOW = require("../policy/exec-allowed.json");

ensureDir(DL_ROOT); ensureDir(TEMP); ensureDir(QUAR);

const express = require("express");
const router = express.Router();

function extFromUrl(url) {
  const u = new URL(url);
  const base = path.basename(u.pathname);
  const dot = base.lastIndexOf(".");
  return dot >= 0 ? base.slice(dot).toLowerCase() : "";
}

function logManifest(entry) {
  fs.appendFileSync(MANIFEST, JSON.stringify(entry) + "\n");
}

function domainAllowed(u) {
  const host = new URL(u).hostname.toLowerCase();
  return ALLOW.domains.some(d => host === d || host.endsWith("." + d));
}

function head(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    if (u.protocol !== "https:") return reject(new Error("HTTPS_REQUIRED"));
    const req = https.request({ method: "HEAD", hostname: u.hostname, path: u.pathname + u.search, headers: { "User-Agent":"Alice/Bootstrap" }, timeout: timeoutMs }, res => {
      resolve({ status: res.statusCode, headers: res.headers });
    });
    req.on("error", reject);
    req.on("timeout", ()=>{ req.destroy(new Error("HEAD_TIMEOUT")); });
    req.end();
  });
}

async function fetchWithRedirects(url, maxRedirects, onResponse) {
  let current = url;
  for (let i = 0; i <= maxRedirects; i++) {
    const u = new URL(current);
    if (u.protocol !== "https:") throw new Error("HTTPS_REQUIRED");
    await new Promise((resolve, reject) => {
      const req = https.get(current, { headers: { "User-Agent":"Alice/Bootstrap" }}, res => {
        const status = res.statusCode || 0;
        if (status >= 300 && status < 400 && res.headers.location) {
          const next = new URL(res.headers.location, current).toString();
          res.resume();
          current = next;
          resolve();
        } else {
          onResponse(res, current);
          resolve();
        }
      });
      req.on("error", reject);
    });
    if (i < maxRedirects && current !== url) continue;
    else break;
  }
}

router.post("/", async (req, res) => {
  try {
    const { url, filename, checksum, checksum_alg = "sha256", max_bytes, category = "data", notes = "" } = req.body || {};
    if (!url) return res.status(400).json({ error: "MISSING_URL" });

    if (!domainAllowed(url)) return res.status(400).json({ error: "UNSAFE_DOMAIN" });

    const policy = POLICY.download;
    const maxBytes = Math.min(policy.maxBytes, Number.isFinite(max_bytes) ? max_bytes : policy.maxBytes);

    let headInfo;
    try {
      headInfo = await head(url, policy.headTimeoutMs);
    } catch (e) {
      return res.status(400).json({ error: e.message || "HEAD_FAILED" });
    }
    if (!headInfo || !headInfo.headers) return res.status(400).json({ error: "HEAD_NO_HEADERS" });

    const cl = headInfo.headers["content-length"] ? parseInt(headInfo.headers["content-length"], 10) : undefined;
    if (Number.isFinite(cl) && cl > maxBytes) return res.status(413).json({ error: "TOO_LARGE", limit: maxBytes, content_length: cl });

    const urlExt = extFromUrl(url);
    const outName = filename ? filename.replace(/[^\w.\-]/g, "_") : path.basename(new URL(url).pathname) || ("download" + urlExt || "");
    const tempPath = path.join(TEMP, outName + ".part");
    const finalPath = path.join(DL_ROOT, outName);

    if (fs.existsSync(finalPath)) {
      const existing = fs.readFileSync(finalPath);
      const h = sha256(existing);
      logManifest({ ts: Date.now(), requester: "bootstrap", url, final_url: url, path: finalPath, sha256: h, bytes: existing.length, category, cached: true, notes });
      return res.json({ status: "ok", path: finalPath, bytes: existing.length, sha256: h, mime: headInfo.headers["content-type"] || null, source_domain: new URL(url).hostname, cached: true });
    }

    await new Promise((resolve, reject) => {
      let responded = false;
      fetchWithRedirects(url, policy.maxRedirects, (incoming, finalUrl) => {
        if (responded) return;
        responded = true;

        if (!domainAllowed(finalUrl)) { incoming.destroy(); return reject(new Error("UNSAFE_DOMAIN_FINAL")); }

        let received = 0;
        const out = fs.createWriteStream(tempPath);
        const timer = setTimeout(()=>{ incoming.destroy(new Error("READ_TIMEOUT")); }, policy.readTimeoutMs);

        incoming.on("data", chunk => {
          received += chunk.length;
          if (received > maxBytes) { incoming.destroy(new Error("TOO_LARGE_STREAM")); }
        });
        incoming.on("error", (e)=>{ clearTimeout(timer); out.destroy(); reject(e); });
        out.on("error", (e)=>{ clearTimeout(timer); incoming.destroy(e); reject(e); });
        incoming.on("end", ()=>{ clearTimeout(timer); out.end(); });

        incoming.pipe(out).on("finish", ()=>{ resolve(); });
      }).catch(reject);
    });

    const data = fs.readFileSync(tempPath);
    const digest = sha256(data);
    if (checksum) {
      if (checksum_alg.toLowerCase() !== "sha256") {
        fs.unlinkSync(tempPath);
        return res.status(400).json({ error: "UNSUPPORTED_CHECKSUM_ALG" });
      }
      if (digest.toLowerCase() !== String(checksum).toLowerCase()) {
        const qpath = path.join(QUAR, path.basename(tempPath).replace(/\.part$/,""));
        fs.renameSync(tempPath, qpath);
        logManifest({ ts: Date.now(), requester: "bootstrap", url, path: qpath, sha256: digest, bytes: data.length, category, notes, outcome: "CHECKSUM_MISMATCH" });
        return res.status(400).json({ error: "CHECKSUM_MISMATCH", sha256: digest, quarantined: qpath });
      }
    }

    if ((filename||"").match(/\.(exe|msi|bat|cmd|ps1)$/i)) {
      if (POLICY.download.requireChecksumForExecutables && !checksum) {
        const qpath = path.join(QUAR, path.basename(tempPath).replace(/\.part$/,""));
        fs.renameSync(tempPath, qpath);
        logManifest({ ts: Date.now(), requester: "bootstrap", url, path: qpath, sha256: digest, bytes: data.length, category, notes, outcome: "EXEC_NO_CHECKSUM" });
        return res.status(400).json({ error: "EXECUTABLE_REQUIRES_CHECKSUM", quarantined: qpath, sha256: digest });
      }
    }

    fs.renameSync(tempPath, finalPath);
    logManifest({ ts: Date.now(), requester: "bootstrap", url, final_url: url, path: finalPath, sha256: digest, bytes: data.length, category, notes, outcome: "OK" });
    return res.json({ status: "ok", path: finalPath, bytes: data.length, sha256: digest, mime: null, source_domain: new URL(url).hostname, cached: false });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

module.exports = router;
'@ | Set-Content -Path (Join-Path $RoutesDir 'download.js') -Encoding UTF8

# -------------------------------
# 6) ROUTES: /admin + exec guard
# -------------------------------
Write-Host "== Writing routes/admin.js & exec-guard.js =="
@'
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const ROOT = path.resolve(__dirname, "..");
const POLICY_FILE = path.join(ROOT, "policy", "policy.json");
const AUTONOMY_FLAG = path.join(ROOT, "AUTONOMY_OFF");

router.get("/status", (req, res) => {
  const policy = JSON.parse(fs.readFileSync(POLICY_FILE, "utf8"));
  const paused = fs.existsSync(AUTONOMY_FLAG);
  res.json({ policy, autonomy_paused: paused });
});

router.post("/pause", (req, res) => {
  fs.writeFileSync(AUTONOMY_FLAG, "paused");
  res.json({ status: "paused" });
});

router.post("/resume", (req, res) => {
  if (fs.existsSync(AUTONOMY_FLAG)) fs.unlinkSync(AUTONOMY_FLAG);
  res.json({ status: "resumed" });
});

router.post("/set-policy", (req, res) => {
  const body = req.body || {};
  const curr = JSON.parse(fs.readFileSync(POLICY_FILE, "utf8"));
  const next = { ...curr, ...body };
  fs.writeFileSync(POLICY_FILE, JSON.stringify(next, null, 2));
  res.json({ status: "ok", policy: next });
});

module.exports = router;
'@ | Set-Content -Path (Join-Path $RoutesDir 'admin.js') -Encoding UTF8

@'
const fs = require("fs");
const path = require("path");
const POLICY = require("../policy/policy.json");
const EXEC_ALLOW = require("../policy/exec-allowed.json");

const ROOT = path.resolve(__dirname, "..");
const DL_ROOT = path.join(ROOT, "downloads");
const AUTONOMY_FLAG = path.join(ROOT, "AUTONOMY_OFF");

function isPaused() { return fs.existsSync(AUTONOMY_FLAG); }
function fromDownloads(targetPath) {
  const p = path.resolve(targetPath);
  return p.toLowerCase().startsWith(DL_ROOT.toLowerCase());
}
function execAllowed(cmd, args) {
  const entry = EXEC_ALLOW.binaries.find(b => b.cmd.toLowerCase() === String(cmd).toLowerCase());
  if (!entry) return false;
  const re = new RegExp(entry.args);
  return re.test(args.join(" "));
}

module.exports = function execGuard(req, res, next) {
  if (req.path !== "/exec" || req.method !== "POST") return next();

  if (isPaused()) return res.status(423).json({ error: "AUTONOMY_PAUSED" });

  const body = req.body || {};
  const cmd = body.command;
  const args = Array.isArray(body.args) ? body.args : [];

  if (!execAllowed(cmd, args)) {
    return res.status(403).json({ error: "EXEC_NOT_ALLOWED", cmd, args });
  }

  const maybePathArg = args.find(a => typeof a === "string" && (a.endsWith(".exe") || a.endsWith(".msi") || a.endsWith(".ps1") || a.endsWith(".bat") || a.endsWith(".cmd")));
  if (maybePathArg) {
    if (POLICY.exec.allowOnlyFromDownloads && !fromDownloads(maybePathArg)) {
      return res.status(403).json({ error: "EXEC_OUTSIDE_DOWNLOADS" });
    }
    if (POLICY.exec.requireVerifiedSource) {
      try {
        const manifest = fs.readFileSync(path.join(DL_ROOT,"manifest.jsonl"), "utf8").trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
        const abs = path.resolve(maybePathArg);
        const entry = manifest.reverse().find(e => path.resolve(e.path) === abs && e.outcome === "OK" && e.sha256);
        if (!entry) return res.status(403).json({ error: "EXEC_NOT_VERIFIED_IN_MANIFEST" });
      } catch {
        return res.status(403).json({ error: "EXEC_MANIFEST_MISSING" });
      }
    }
  }

  next();
};
'@ | Set-Content -Path (Join-Path $RoutesDir 'exec-guard.js') -Encoding UTF8

# -------------------------------
# 7) PATCH index.js safely (ESM or CJS)
# -------------------------------
Write-Host "== Patching index.js =="
$index = [IO.File]::ReadAllText($ServerFile)
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$usesESM = $index -match '^\s*import\s+.+?from\s+["''][^"'']+["''];'  # multiline
$hasJSON = $index -match 'app\.use\(\s*express\.json\(\)\s*\)'

# Insert body parser after app = express()
if (-not $hasJSON -and ($index -match '\b(app\s*=\s*express\(\)\s*;)')) {
  $index = $index -replace '(\bapp\s*=\s*express\(\)\s*;)', '$1' + "`r`napp.use(express.json());"
}

if ($usesESM) {
  # ESM imports
  if ($index -notmatch "from './routes/download\.js'") {
    $importsBlock = "import downloadRouter from './routes/download.js';`r`nimport adminRouter from './routes/admin.js';`r`nimport execGuard from './routes/exec-guard.js';`r`n"
    $imports = [regex]::Matches($index, '^[\s]*import\s+.+?;$', 'Multiline')
    if ($imports.Count -gt 0) {
      $last = $imports[$imports.Count-1]
      $pos = $last.Index + $last.Length
      $index = $index.Insert($pos, "`r`n" + $importsBlock)
    } else {
      $index = $importsBlock + "`r`n" + $index
    }
  }
} else {
  # CJS requires
  if ($index -notmatch "require\('\.\/routes\/download'\)") {
    $requireBlock = "const downloadRouter = require('./routes/download');`r`nconst adminRouter = require('./routes/admin');`r`nconst execGuard = require('./routes/exec-guard');`r`n"
    # after first const/var/let require or at top
    $firstLineBreak = $index.IndexOf("`r`n")
    if ($firstLineBreak -ge 0) {
      $index = $index.Insert($firstLineBreak+2, $requireBlock)
    } else {
      $index = $requireBlock + $index
    }
  }
}

# app.use(...) block before app.listen(...)
if ($index -notmatch "app\.use\(\s*'?/download'?\s*,\s*downloadRouter\s*\)") {
  $useBlock = "app.use(execGuard);`r`napp.use('/download', downloadRouter);`r`napp.use('/admin', adminRouter);`r`n"
  $listenMatch = [regex]::Match($index, '(?m)^[^\S\r\n]*app\.listen\(')
  if ($listenMatch.Success) {
    $index = $index.Insert($listenMatch.Index, $useBlock)
  } else {
    $index = $index + "`r`n" + $useBlock
  }
}

# Add BEGIN/END markers if missing
if ($index -notmatch [regex]::Escape("$BootstrapTag BEGIN")) {
  $index = "$BootstrapTag BEGIN`r`n" + $index + "`r`n$BootstrapTag END`r`n"
}

[IO.File]::WriteAllText($ServerFile, $index, $utf8NoBom)
Write-Host "index.js patched."

# -------------------------------
# 8) SMOKE TESTS
# -------------------------------
Write-Host "== Smoke tests =="
try {
  $p = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
  if ($p) { Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue }
} catch {}

Push-Location $Root
Start-Process -FilePath "node" -ArgumentList "index.js" -WindowStyle Minimized
Pop-Location
Start-Sleep -Seconds 3

try {
  $health = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3001/health" -TimeoutSec 5
  Write-Host "/health:" $health.StatusCode
} catch { Write-Host "Could not reach /health yet (continuing)"; }

try {
  $status = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3001/admin/status" -TimeoutSec 5
  Write-Host "/admin/status:" $status.StatusCode
} catch { Write-Host "Could not reach /admin/status yet (continuing)"; }

Write-Host "== Done. Backup at: $FinalZip =="
