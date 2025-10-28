// D:\Alice\projects\chat-app\index.js
// FULL SERVER FILE — hardened to fix browser 500s and accept various front-end payloads.
// - Adds /chat-json alias
// - Accepts JSON or text bodies (handles odd Content-Type)
// - Logs requests + returns readable errors locally
// - Streams NDJSON from Ollama (/api/generate) with fallback to /api/chat

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_DIST = path.join(__dirname, 'client', 'dist');

const app = express();
app.disable('x-powered-by');

// —— Visibility: log unhandled errors
process.on('uncaughtException', (e) => console.error('UNCAUGHT', e));
process.on('unhandledRejection', (e) => console.error('UNHANDLED', e));

// —— Body parsers (order matters). We accept JSON *and* text to handle odd frontends.
app.use(express.json({ limit: '2mb' }));
app.use(express.text({ type: '*/*', limit: '2mb' })); // will set req.body to string for non-JSON content types

// —— Simple request logger (first 200 chars of body)
app.use((req, _res, next) => {
  const b =
    typeof req.body === 'string'
      ? req.body.slice(0, 200)
      : JSON.stringify(req.body)?.slice(0, 200);
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} ct=${req.headers['content-type']} body=${b}`,
  );
  next();
});

// —— Health
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// —— Debug: echo back what the server sees (useful if needed)
app.all('/debug/echo', (req, res) => {
  res.json({
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    typeofBody: typeof req.body,
  });
});

// —— Ollama version passthrough
app.get('/ollama/version', async (_req, res) => {
  try {
    const r = await fetch('http://127.0.0.1:11434/api/version');
    const text = await r.text();
    res.type(r.headers.get('content-type') || 'application/json').send(text);
  } catch (e) {
    console.error('VERSION ERROR', e);
    res.status(500).json({ error: String(e?.message || e) });
  }
});

// —— Helper: normalize incoming body to a string prompt
function extractInput(req) {
  const b = req.body;
  if (b == null) return null;

  // If frontend sent text/plain with just the prompt string
  if (typeof b === 'string') {
    // try to parse JSON-in-text if present, otherwise treat as raw prompt
    try {
      const maybe = JSON.parse(b);
      if (maybe && typeof maybe === 'object') {
        return maybe.prompt ?? maybe.message ?? null;
      }
    } catch {
      // not JSON; treat the whole string as the prompt
      return b.trim() || null;
    }
  }

  // If JSON already parsed
  if (typeof b === 'object') {
    return b.prompt ?? b.message ?? null;
  }

  return null;
}

// —— Chat handler: stream NDJSON from Ollama, robust to various inputs
async function chatHandler(req, res) {
  try {
    const input = extractInput(req);
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Missing prompt/message' });
    }

    // Optional config from body if present
    const b =
      typeof req.body === 'string'
        ? (() => {
            try {
              return JSON.parse(req.body);
            } catch {
              return {};
            }
          })()
        : req.body || {};
    const model = b.model || 'alice:latest';
    const temperature = typeof b.temperature === 'number' ? b.temperature : 0.7;
    const stop = Array.isArray(b.stop) ? b.stop : undefined;

    // Try /api/generate first
    let upstream = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: input,
        stream: true,
        options: { temperature, stop },
      }),
    });

    // If endpoint not found (older/newer setups), try /api/chat with messages format
    if (upstream.status === 404) {
      console.warn('Fallback: /api/generate 404, trying /api/chat');
      upstream = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: input }],
          stream: true,
          options: { temperature, stop },
        }),
      });
    }

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '');
      console.error('UPSTREAM ERROR', upstream.status, errText);
      return res.status(502).json({
        error: 'Upstream error',
        status: upstream.status,
        body: errText,
      });
    }

    // Stream NDJSON back to the browser unchanged
    res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value?.length) res.write(value);
    }
    res.write('\n');
    res.end();
  } catch (e) {
    console.error('CHAT ERROR', e);
    if (!res.headersSent) {
      res.status(500).json({ error: String(e?.message || e), stack: e?.stack });
    } else {
      try {
        res.end();
      } catch {}
    }
  }
}

// —— Routes
app.post('/chat', chatHandler);
app.post('/chat-json', chatHandler); // alias to match older/newer frontends

// —— Static client (built frontend)
app.use(express.static(CLIENT_DIST, { fallthrough: true }));

// —— SPA fallback (avoid catching API paths)
app.get('*', (req, res, next) => {
  if (req.method !== 'GET') return next();
  const p = req.path;
  if (
    p.startsWith('/api/') ||
    p.startsWith('/ollama/') ||
    p.startsWith('/chat')
  )
    return next();
  if (p.startsWith('/chat-json') || p.startsWith('/debug/')) return next();
  res.sendFile(path.join(CLIENT_DIST, 'index.html'));
});

// —— Start
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
