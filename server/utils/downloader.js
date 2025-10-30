const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const { URL } = require("url");

const cfg = require("../config/download.json");

function sha256OfFile(filePath) {
  const hash = crypto.createHash("sha256");
  const stream = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    stream.on("data", (d) => hash.update(d));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

function ensureHttpsAndAllowed(url) {
  const u = new URL(url);
  if (u.protocol !== "https:") throw new Error("Only HTTPS URLs are allowed.");
  const host = u.hostname.toLowerCase();
  if (!cfg.allowedDomains.some((d) => host === d || host.endsWith("." + d))) {
    throw new Error(`Domain not allowed: ${host}`);
  }
  return u;
}

async function downloadToFile({ url, destDir, filename, expectedSha256 }) {
  const u = ensureHttpsAndAllowed(url);
  const safeName = filename || path.basename(u.pathname) || "download.bin";
  const fullPath = path.join(destDir, safeName);

  // Axios buffer download — avoids stream/keep-alive edge cases
  const resp = await axios.get(u.toString(), {
    responseType: "arraybuffer",
    maxRedirects: 5,
    timeout: 60000,
    validateStatus: (s) => s >= 200 && s < 400, // treat 3xx as handled by axios
    // Enforce size while downloading via transform (best effort)
    transformResponse: [
      (data, headers) => {
        const len = parseInt(headers["content-length"] || "0", 10);
        if (len && len > cfg.maxBytes)
          throw new Error(`File too large: ${len} > ${cfg.maxBytes} bytes`);
        if (data && data.byteLength && data.byteLength > cfg.maxBytes)
          throw new Error(`File exceeded size limit ${cfg.maxBytes} bytes`);
        return data;
      },
    ],
  });

  const buf = Buffer.from(resp.data);
  if (buf.byteLength > cfg.maxBytes)
    throw new Error(`File exceeded size limit ${cfg.maxBytes} bytes`);

  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(fullPath, buf);

  const actualSha = await sha256OfFile(fullPath);
  if (expectedSha256 && actualSha.toLowerCase() !== expectedSha256.toLowerCase()) {
    fs.unlinkSync(fullPath);
    throw new Error(`SHA256 mismatch: expected ${expectedSha256}, got ${actualSha}`);
  }

  return { path: fullPath, bytes: buf.byteLength, sha256: actualSha };
}

module.exports = { downloadToFile, ensureHttpsAndAllowed, sha256OfFile };
