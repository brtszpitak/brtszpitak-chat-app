import { Router } from "express";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import https from "node:https";
import { URL } from "node:url";

const router = Router();

// ===== Config =====
const MAX_BYTES = 600 * 1024 * 1024; // 600 MB
const DOWNLOAD_DIR = path.resolve(process.cwd(), "downloads");
const ALLOWED_HOSTS = new Set([
  "raw.githubusercontent.com",
  "github.com",
  "objects.githubusercontent.com",
  "registry.npmjs.org",
  "nodejs.org",
  "huggingface.co",
  "cdn-lfs.huggingface.co",
  "files.pythonhosted.org",
  "download.visualstudio.microsoft.com",
  "aka.ms",
  "dl.google.com",
  "storage.googleapis.com"
]);

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

function safeFileName(fromUrl, overrideName) {
  if (overrideName) {
    const cleaned = String(overrideName).replace(/[^a-zA-Z0-9._-]/g, "_");
    return cleaned || "download.bin";
  }
  const u = new URL(fromUrl);
  const base = path.basename(u.pathname) || "download.bin";
  return base.replace(/[^a-zA-Z0-9._-]/g, "_");
}

router.post("/", async (req, res) => {
  try {
    const { url, filename, expectedSha256 } = req.body || {};
    if (!url || typeof url !== "string") {
      return res.status(400).json({ ok: false, error: "Missing url" });
    }
    let u;
    try { u = new URL(url); } catch { return res.status(400).json({ ok: false, error: "Invalid URL" }); }

    if (u.protocol !== "https:") {
      return res.status(400).json({ ok: false, error: "Only HTTPS is allowed" });
    }
    if (!ALLOWED_HOSTS.has(u.hostname)) {
      return res.status(403).json({ ok: false, error: `Host not allowed: ${u.hostname}` });
    }

    await ensureDir(DOWNLOAD_DIR);
    const outName = safeFileName(url, filename);
    const destPath = path.join(DOWNLOAD_DIR, outName);

    // HEAD check (if server provides Content-Length)
    const headSize = await new Promise((resolve) => {
      const reqH = https.request(u, { method: "HEAD", headers: { "User-Agent": "Alice-Downloader/1.0" } }, (r) => {
        const len = parseInt(r.headers["content-length"] || "0", 10);
        resolve(Number.isFinite(len) ? len : 0);
      });
      reqH.on("error", () => resolve(0));
      reqH.end();
    });
    if (headSize > MAX_BYTES) {
      return res.status(413).json({ ok: false, error: `File too large (HEAD ${headSize} > ${MAX_BYTES})` });
    }

    const hasher = crypto.createHash("sha256");
    let total = 0;

    const doGet = (targetUrl) => new Promise((resolve, reject) => {
      https.get(targetUrl, { headers: { "User-Agent": "Alice-Downloader/1.0" } }, (resp) => {
        // Disallow redirect chains to avoid host-bypass
        if (resp.statusCode && resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location) {
          try {
            const redirectUrl = new URL(resp.headers.location, targetUrl);
            if (redirectUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(redirectUrl.hostname)) {
              reject(new Error("Redirected to disallowed host or protocol"));
              resp.resume();
              return;
            }
            // single allowed redirect
            https.get(redirectUrl, { headers: { "User-Agent": "Alice-Downloader/1.0" } }, (r2) => {
              resolve(r2);
            }).on("error", reject);
          } catch (e) {
            reject(e);
          }
          return;
        }
        if (resp.statusCode && resp.statusCode >= 400) {
          reject(new Error(`Upstream HTTP ${resp.statusCode}`));
          resp.resume();
          return;
        }
        resolve(resp);
      }).on("error", reject);
    });

    const resp = await doGet(u);
    const lenHeader = resp.headers["content-length"];
    if (lenHeader && Number(lenHeader) > MAX_BYTES) {
      resp.destroy();
      return res.status(413).json({ ok: false, error: `Content-Length exceeds 600MB (${lenHeader} bytes)` });
    }

    const out = fs.createWriteStream(destPath, { flags: "w" });

    resp.on("data", (chunk) => {
      total += chunk.length;
      if (total > MAX_BYTES) {
        resp.destroy(new Error("Downloaded data exceeded 600MB cap"));
        return;
      }
      hasher.update(chunk);
    });

    resp.on("error", (e) => {
      if (!res.headersSent) res.status(500).json({ ok: false, error: e.message });
    });

    out.on("finish", async () => {
      const digest = hasher.digest("hex");
      if (expectedSha256 && expectedSha256.toLowerCase() !== digest) {
        try { await fsp.unlink(destPath); } catch {}
        return res.status(400).json({ ok: false, error: "SHA-256 mismatch", got: digest });
      }
      return res.json({ ok: true, filename: outName, path: `downloads/${outName}`, bytes: total, sha256: digest });
    });

    out.on("error", (e) => {
      if (!res.headersSent) res.status(500).json({ ok: false, error: e.message });
    });

    resp.pipe(out);
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ ok: false, error: e.message });
  }
});

export default router;
