'use strict';

const path = require('node:path');
const { execSync, exec: _exec } = require('node:child_process');
const { promisify } = require('node:util');
const http = require('node:http');
const https = require('node:https');

const exec = promisify(_exec);

const datetime = () => new Date();
// Minimal fetch polyfill for Node (supports GET/POST, text/json helpers)
async function nodeFetch(url, opts = {}) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const lib = u.protocol === 'https:' ? https : http;
      const req = lib.request(
        url,
        {
          method: opts.method || 'GET',
          headers: opts.headers || {},
        },
        (res) => {
          let data = '';
          res.on('data', (d) => {
            data += d;
          });
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers,
              text: async () => data,
              json: async () => JSON.parse(data || '{}'),
            });
          });
        },
      );
      req.on('error', reject);
      if (opts.body) req.write(opts.body);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

// make it available globally for tasks that use global fetch
if (!globalThis.fetch) globalThis.fetch = nodeFetch;

function commitIfDirty(msg = 'chore: auto-baseline after note-progress') {
  const out = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (out) {
    execSync('git add -A', { stdio: 'inherit' });
    const safe = String(msg).replace(/"/g, '\\"');
    try {
      execSync('git commit -m "' + safe + '"', { stdio: 'inherit' });
    } catch {}
  }
}

async function runTask(name) {
  console.log(`=== RUN ${name} ===`);
  const modPath = path.join(__dirname, 'tasks', `${name}.cjs`);
  const mod = require(modPath);
  // Provide helpers to tasks (both patterns work: destructured or global fetch)
  const res = await mod.run({ exec, fetch: nodeFetch, datetime, ...git });
  console.log(`[task ${name}]`, res);
  return res;
}

(async () => {
  await runTask('lint-fix');
  await runTask('audit-server');
  await runTask('build-client');
  await runTask('smoke-endpoints');
  await runTask('note-progress');
  commitIfDirty(); // keep tree clean before self-rewrite
  await runTask('self-rewrite');
  console.log('All tasks complete.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

