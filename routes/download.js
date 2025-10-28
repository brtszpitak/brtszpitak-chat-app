import fs from 'fs';
import path from 'path';
import https from 'https';
import express from 'express';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { sha256 } from '../utils/hash.js';
import { ensureDir } from '../utils/paths.js';
import POLICY from '../policy/policy.json' with { type: 'json' };
import ALLOW from '../policy/allowlist.json' with { type: 'json' };

const ROOT = path.resolve(__dirname, '..');
const DL_ROOT = path.join(ROOT, 'downloads');
const TEMP = path.join(DL_ROOT, '_temp');
const QUAR = path.join(DL_ROOT, 'quarantine');
const MANIFEST = path.join(DL_ROOT, 'manifest.jsonl');

ensureDir(DL_ROOT);
ensureDir(TEMP);
ensureDir(QUAR);

const router = express.Router();

function logManifest(entry) {
  fs.appendFileSync(MANIFEST, JSON.stringify(entry) + '\n');
}
function domainAllowed(u) {
  const host = new URL(u).hostname.toLowerCase();
  return ALLOW.domains.some((d) => host === d || host.endsWith('.' + d));
}
function head(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    if (u.protocol !== 'https:') return reject(new Error('HTTPS_REQUIRED'));
    const req = https.request(
      {
        method: 'HEAD',
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: { 'User-Agent': 'Alice/Bootstrap' },
        timeout: timeoutMs,
      },
      (res) => {
        resolve({ status: res.statusCode, headers: res.headers });
      },
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error('HEAD_TIMEOUT'));
    });
    req.end();
  });
}
async function fetchWithRedirects(url, maxRedirects, onResponse) {
  let current = url;
  for (let i = 0; i <= maxRedirects; i++) {
    const u = new URL(current);
    if (u.protocol !== 'https:') throw new Error('HTTPS_REQUIRED');
    await new Promise((resolve, reject) => {
      const req = https.get(
        current,
        { headers: { 'User-Agent': 'Alice/Bootstrap' } },
        (res) => {
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
        },
      );
      req.on('error', reject);
    });
    if (i < maxRedirects && current !== url) continue;
    else break;
  }
}

router.post('/', async (req, res) => {
  try {
    const {
      url,
      filename,
      checksum,
      checksum_alg = 'sha256',
      max_bytes,
      category = 'data',
      notes = '',
    } = req.body || {};
    if (!url) return res.status(400).json({ error: 'MISSING_URL' });
    if (!domainAllowed(url))
      return res.status(400).json({ error: 'UNSAFE_DOMAIN' });

    const policy = POLICY.download;
    const maxBytes = Math.min(
      policy.maxBytes,
      Number.isFinite(max_bytes) ? max_bytes : policy.maxBytes,
    );

    let headInfo;
    try {
      headInfo = await head(url, policy.headTimeoutMs);
    } catch (e) {
      return res.status(400).json({ error: e.message || 'HEAD_FAILED' });
    }
    if (!headInfo || !headInfo.headers)
      return res.status(400).json({ error: 'HEAD_NO_HEADERS' });

    const cl = headInfo.headers['content-length']
      ? parseInt(headInfo.headers['content-length'], 10)
      : undefined;
    if (Number.isFinite(cl) && cl > maxBytes)
      return res
        .status(413)
        .json({ error: 'TOO_LARGE', limit: maxBytes, content_length: cl });

    const outName = filename
      ? filename.replace(/[^\w.\-]/g, '_')
      : path.basename(new URL(url).pathname) || 'download';
    const tempPath = path.join(TEMP, outName + '.part');
    const finalPath = path.join(DL_ROOT, outName);

    if (fs.existsSync(finalPath)) {
      const existing = fs.readFileSync(finalPath);
      const h = sha256(existing);
      logManifest({
        ts: Date.now(),
        requester: 'bootstrap',
        url,
        final_url: url,
        path: finalPath,
        sha256: h,
        bytes: existing.length,
        category,
        cached: true,
        notes,
      });
      return res.json({
        status: 'ok',
        path: finalPath,
        bytes: existing.length,
        sha256: h,
        mime: headInfo.headers['content-type'] || null,
        source_domain: new URL(url).hostname,
        cached: true,
      });
    }

    await new Promise((resolve, reject) => {
      let responded = false;
      fetchWithRedirects(url, policy.maxRedirects, (incoming, finalUrl) => {
        if (responded) return;
        responded = true;

        if (!domainAllowed(finalUrl)) {
          incoming.destroy();
          return reject(new Error('UNSAFE_DOMAIN_FINAL'));
        }

        let received = 0;
        const out = fs.createWriteStream(tempPath);
        const timer = setTimeout(() => {
          incoming.destroy(new Error('READ_TIMEOUT'));
        }, policy.readTimeoutMs);

        incoming.on('data', (chunk) => {
          received += chunk.length;
          if (received > maxBytes) {
            incoming.destroy(new Error('TOO_LARGE_STREAM'));
          }
        });
        incoming.on('error', (e) => {
          clearTimeout(timer);
          out.destroy();
          reject(e);
        });
        out.on('error', (e) => {
          clearTimeout(timer);
          incoming.destroy(e);
          reject(e);
        });
        incoming.on('end', () => {
          clearTimeout(timer);
          out.end();
        });

        incoming.pipe(out).on('finish', () => resolve());
      }).catch(reject);
    });

    const data = fs.readFileSync(tempPath);
    const digest = sha256(data);
    if (checksum) {
      if (checksum_alg.toLowerCase() !== 'sha256') {
        fs.unlinkSync(tempPath);
        return res.status(400).json({ error: 'UNSUPPORTED_CHECKSUM_ALG' });
      }
      if (digest.toLowerCase() !== String(checksum).toLowerCase()) {
        const qpath = path.join(
          QUAR,
          path.basename(tempPath).replace(/\.part$/, ''),
        );
        fs.renameSync(tempPath, qpath);
        logManifest({
          ts: Date.now(),
          requester: 'bootstrap',
          url,
          path: qpath,
          sha256: digest,
          bytes: data.length,
          category,
          notes,
          outcome: 'CHECKSUM_MISMATCH',
        });
        return res.status(400).json({
          error: 'CHECKSUM_MISMATCH',
          sha256: digest,
          quarantined: qpath,
        });
      }
    }

    if ((filename || '').match(/\.(exe|msi|bat|cmd|ps1)$/i)) {
      if (POLICY.download.requireChecksumForExecutables && !checksum) {
        const qpath = path.join(
          QUAR,
          path.basename(tempPath).replace(/\.part$/, ''),
        );
        fs.renameSync(tempPath, qpath);
        logManifest({
          ts: Date.now(),
          requester: 'bootstrap',
          url,
          path: qpath,
          sha256: digest,
          bytes: data.length,
          category,
          notes,
          outcome: 'EXEC_NO_CHECKSUM',
        });
        return res.status(400).json({
          error: 'EXECUTABLE_REQUIRES_CHECKSUM',
          quarantined: qpath,
          sha256: digest,
        });
      }
    }

    fs.renameSync(tempPath, finalPath);
    logManifest({
      ts: Date.now(),
      requester: 'bootstrap',
      url,
      final_url: url,
      path: finalPath,
      sha256: digest,
      bytes: data.length,
      category,
      notes,
      outcome: 'OK',
    });
    return res.json({
      status: 'ok',
      path: finalPath,
      bytes: data.length,
      sha256: digest,
      mime: null,
      source_domain: new URL(url).hostname,
      cached: false,
    });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
});

export default router;
