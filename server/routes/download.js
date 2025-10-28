const express = require("express");
const fs = require("fs");
const path = require("path");
const https = require("https");
const { URL } = require("url");

const router = express.Router();

const DOWNLOAD_DIR = path.join(__dirname, "..", "..", "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

// Small strict whitelist — add hosts as needed
const WHITELIST = new Set([
  "raw.githubusercontent.com",
  "github.com",
  "objects.githubusercontent.com",
  "registry.npmjs.org",
  "npmjs.com",
  "nodejs.org",
  "huggingface.co",
  "files.pythonhosted.org",
  "aka.ms",
  "go.microsoft.com",
  "download.visualstudio.microsoft.com",
]);

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

router.post("/", async (req, res) => {
  const { url, filename } = req.body || {};
  try {
    if (!url) return res.status(400).json({ ok: false, error: "url required" });
    const u = new URL(url);
    if (u.protocol !== "https:")
      return res.status(400).json({ ok: false, error: "https required" });
    if (!WHITELIST.has(u.hostname)) {
      return res.status(400).json({ ok: false, error: "host not allowed", host: u.hostname });
    }

    const safeName = (filename || path.basename(u.pathname) || "download.bin").replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );
    const dest = path.join(DOWNLOAD_DIR, safeName);

    const bytes = await new Promise((resolve, reject) => {
      const out = fs.createWriteStream(dest);
      let received = 0;

      https
        .get(url, { headers: { "User-Agent": "AliceDownloader/1.0" } }, (r) => {
          if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
            return reject(new Error("redirects not allowed"));
          }
          if (r.statusCode !== 200) return reject(new Error("HTTP " + r.statusCode));
          const cl = parseInt(r.headers["content-length"] || "0", 10);
          if (cl && cl > MAX_BYTES) return reject(new Error("file too large (content-length)"));

          r.on("data", (chunk) => {
            received += chunk.length;
            if (received > MAX_BYTES) {
              r.destroy(new Error("file too large (stream)"));
            }
          });

          r.on("error", (e) => reject(e));
          out.on("error", (e) => reject(e));
          out.on("finish", () => resolve(received));
          r.pipe(out);
        })
        .on("error", reject);
    });

    const stat = fs.statSync(dest);
    return res.json({ ok: true, path: path.relative(process.cwd(), dest), bytes: stat.size });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e && e.message ? e.message : e) });
  }
});

module.exports = router;
