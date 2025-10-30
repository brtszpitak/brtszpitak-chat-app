/**
 * server/downloadRoute.mjs
 * Secure /download route with HTTPS-only, allowlist, size cap, and SHA-256 verification.
 */
import fs from "fs";
import path from "path";
import https from "https";
import { pipeline } from "stream";
import { createHash } from "crypto";
import { URL } from "url";

const ALLOWLIST = new Set([
  "github.com",
  "raw.githubusercontent.com",
  "objects.githubusercontent.com",
  "nodejs.org",
  "registry.npmjs.org",
  "huggingface.co",
  "cdn.jsdelivr.net",
  "aka.ms",
  "learn.microsoft.com",
]);

const MAX_SIZE = 500 * 1024 * 1024; // 500 MB
const DOWNLOAD_DIR = path.resolve(process.cwd(), "downloads");
fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

export function registerDownloadRoute(app) {
  app.post("/download", async (req, res) => {
    try {
      const { url: target, sha256 } = req.body || {};
      if (!target || typeof target !== "string") {
        return res.status(400).json({ error: "missing URL" });
      }

      const u = new URL(target);
      if (u.protocol !== "https:") {
        return res.status(400).json({ error: "HTTPS required" });
      }
      if (!ALLOWLIST.has(u.hostname)) {
        return res.status(403).json({ error: `Domain ${u.hostname} not allowed` });
      }

      const safeName = (u.pathname.split("/").pop() || "download.bin").replace(
        /[^A-Za-z0-9._-]/g,
        "_"
      );
      const tmpPath = path.join(DOWNLOAD_DIR, `${Date.now()}-${safeName}.part`);
      const finalPath = path.join(DOWNLOAD_DIR, `${Date.now()}-${safeName}`);

      let total = 0;
      const hash = createHash("sha256");

      const request = https.get(u, (response) => {
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          // follow one redirect if within allowlist & https
          try {
            const nu = new URL(response.headers.location, u);
            if (nu.protocol !== "https:" || !ALLOWLIST.has(nu.hostname)) {
              res.status(403).json({ error: "Redirect blocked (domain or scheme not allowed)" });
              request.destroy();
              return;
            }
            https.get(nu, handleResponse).on("error", (err) => {
              res.status(500).json({ error: err.message });
            });
          } catch (e) {
            res.status(500).json({ error: "Bad redirect" });
          }
          return;
        }
        handleResponse(response);
      });

      function handleResponse(response) {
        if (response.statusCode !== 200) {
          res.status(response.statusCode || 500).json({ error: `HTTP ${response.statusCode}` });
          return;
        }
        const out = fs.createWriteStream(tmpPath);
        response.on("data", (chunk) => {
          total += chunk.length;
          if (total > MAX_SIZE) {
            try {
              out.close();
            } catch {}
            try {
              fs.unlinkSync(tmpPath);
            } catch {}
            res.status(413).json({ error: "File too large" });
            request.destroy();
            return;
          }
          hash.update(chunk);
        });
        pipeline(response, out, (err) => {
          if (err) {
            try {
              fs.unlinkSync(tmpPath);
            } catch {}
            return res.status(500).json({ error: "Pipeline failed" });
          }
          const digest = hash.digest("hex");
          if (sha256 && sha256 !== digest) {
            const badPath = finalPath + ".bad";
            fs.renameSync(tmpPath, badPath);
            return res.status(400).json({ error: "Checksum mismatch", got: digest, file: badPath });
          }
          fs.renameSync(tmpPath, finalPath);
          return res.json({ ok: true, file: finalPath, size: total, sha256: digest });
        });
      }

      request.on("error", (err) => {
        try {
          fs.unlinkSync(tmpPath);
        } catch {}
        res.status(500).json({ error: err.message });
      });
    } catch (err) {
      res.status(500).json({ error: "Unexpected error" });
    }
  });
}
