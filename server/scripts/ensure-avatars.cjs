/* ensure-avatars.cjs */
const fs = require("fs"),
  path = require("path");
const root = process.argv[2],
  client = path.join(root, "client");
const dist = fs.existsSync(path.join(client, "dist"))
  ? path.join(client, "dist")
  : fs.existsSync(path.join(client, "public"))
    ? path.join(client, "public")
    : client;
const avDir = path.join(dist, "avatars");
fs.mkdirSync(avDir, { recursive: true });

function svg(c, text) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c}"/><stop offset="100%" stop-color="#111"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="64" ry="64" fill="url(#g)"/>
  <circle cx="128" cy="96" r="56" fill="rgba(255,255,255,0.85)"/>
  <rect x="48" y="156" width="160" height="64" rx="32" fill="rgba(255,255,255,0.75)"/>
  <text x="128" y="112" font-family="Segoe UI, Arial" font-weight="700" font-size="64" fill="#222" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
}

const files = [
  ["avatar-bot.svg", svg("#6EA8FE", "A")],
  ["avatar-user.svg", svg("#9CF6A6", "U")],
  ["avatar-dev.svg", svg("#F6D36F", "D")],
  ["avatar-guest.svg", svg("#FF9DBB", "G")],
];

for (const [name, data] of files) {
  const p = path.join(avDir, name);
  if (!fs.existsSync(p)) fs.writeFileSync(p, data, "utf8");
}

const manifest = {
  bot: "avatars/avatar-bot.svg",
  user: "avatars/avatar-user.svg",
  dev: "avatars/avatar-dev.svg",
  guest: "avatars/avatar-guest.svg",
};
fs.writeFileSync(
  path.join(avDir, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
  "utf8"
);

const notePath = path.join(root, "docs", "NEXT_PHASE_LOG.md");
try {
  fs.mkdirSync(path.dirname(notePath), { recursive: true });
  fs.appendFileSync(
    notePath,
    `- ${new Date().toISOString()} – avatars ensured (4 SVGs + manifest)\n`,
    "utf8"
  );
} catch {}
process.stdout.write("avatars ok\n");
