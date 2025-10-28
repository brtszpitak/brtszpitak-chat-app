Write-Host "🚀 Upgrading Alice to full creative-autonomy mode..." -ForegroundColor Cyan

$root   = "D:\Alice\projects\chat-app"
$server = Join-Path $root "server"
$scrDir = Join-Path $server "scripts"
New-Item -ItemType Directory -Force -Path $scrDir | Out-Null

# --- snapshot (safety)
if (-not (Test-Path "$root\.git")) {
  git init; git add .; git commit -m "Pre-creative snapshot"; git branch creative-autonomy
}

# --- core creative scripts
$plan = @'
import fs from "fs";
console.log("🧠 Planning creative upgrades...");
const roadmap = `# Alice Creative Roadmap
- Voice and avatar link integration
- TTS emotion engine
- Auto-update modules
- UI animation + expression sync`;
fs.writeFileSync("D:/Alice/projects/chat-app/docs/ROADMAP.md", roadmap);
