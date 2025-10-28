// server/memory.js
// JSONL-based memory store with embedding search via Ollama

import fs from "fs";
import fsp from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "server", "data");
const MEM_FILE = path.join(DATA_DIR, "memories.jsonl");

// You can change these if you want different models
export const OLLAMA_BASE = process.env.OLLAMA_BASE || "http://127.0.0.1:11434";
export const EMBEDDING_MODEL = process.env.EMBED_MODEL || "nomic-embed-text";

// ---- helpers ----
async function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    await fsp.mkdir(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MEM_FILE)) {
    await fsp.writeFile(MEM_FILE, "", "utf8");
  }
}

function parseLines(buf) {
  return buf
    .toString("utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

async function writeAll(items) {
  const lines = items.map((o) => JSON.stringify(o));
  await fsp.writeFile(MEM_FILE, lines.join("\n") + "\n", "utf8");
}

// ---- Embeddings ----
export async function embed(text) {
  const res = await fetch(`${OLLAMA_BASE}/api/embeddings`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model: EMBEDDING_MODEL, prompt: text }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Embedding failed: ${res.status} ${t}`);
  }
  const json = await res.json();
  return json?.embedding;
}

function cosineSim(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length && i < b.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ---- API ----
export async function loadAll() {
  await ensureDirs();
  const buf = await fsp.readFile(MEM_FILE).catch(() => Buffer.from(""));
  if (!buf.length) return [];
  return parseLines(buf);
}

export async function list({ limit = 50 } = {}) {
  const items = await loadAll();
  return items.slice(-limit).reverse();
}

export async function add({ type = "note", text, source = "manual" }) {
  if (!text || typeof text !== "string") throw new Error("text is required");
  const items = await loadAll();
  const id = (items.at(-1)?.id || 0) + 1;
  const now = new Date().toISOString();
  const embedding = await embed(text).catch(() => null);
  const obj = {
    id,
    type,
    text,
    source,
    created_at: now,
    last_used_at: null,
    uses: 0,
    embedding,
  };
  items.push(obj);
  await writeAll(items);
  return obj;
}

export async function remove(id) {
  const items = await loadAll();
  const before = items.length;
  const filtered = items.filter((x) => x.id !== Number(id));
  await writeAll(filtered);
  return before - filtered.length; // count removed
}

export async function clearAll() {
  await ensureDirs();
  await fsp.writeFile(MEM_FILE, "", "utf8");
}

export async function exportFileStream() {
  await ensureDirs();
  return fs.createReadStream(MEM_FILE);
}

export async function importItems(items = []) {
  if (!Array.isArray(items)) throw new Error("items must be an array");
  const existing = await loadAll();
  let nextId = (existing.at(-1)?.id || 0) + 1;

  const normalized = await Promise.all(
    items.map(async (it) => {
      if (typeof it === "string") {
        const emb = await embed(it).catch(() => null);
        return {
          id: nextId++,
          type: "note",
          text: it,
          source: "manual-import",
          created_at: new Date().toISOString(),
          last_used_at: null,
          uses: 0,
          embedding: emb,
        };
      } else {
        const base = {
          id: nextId++,
          type: it.type || "note",
          text: it.text || "",
          source: it.source || "manual-import",
          created_at: new Date().toISOString(),
          last_used_at: null,
          uses: 0,
        };
        base.embedding = await embed(base.text).catch(() => null);
        return base;
      }
    })
  );

  const all = existing.concat(normalized);
  await writeAll(all);
  return normalized.length;
}

export async function search({ query, topK = 5 }) {
  if (!query) throw new Error("query is required");
  const items = await loadAll();
  const qemb = await embed(query).catch(() => null);
  // If embedding failed, just return latest text matches
  if (!qemb) {
    return items
      .filter((m) => (m.text || "").toLowerCase().includes(query.toLowerCase()))
      .slice(-topK)
      .reverse();
  }
  const scored = items
    .filter((m) => Array.isArray(m.embedding))
    .map((m) => ({ item: m, score: cosineSim(qemb, m.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.item);

  // bump usage metadata
  const ids = new Set(scored.map((x) => x.id));
  const now = new Date().toISOString();
  const updated = items.map((m) =>
    ids.has(m.id) ? { ...m, uses: (m.uses || 0) + 1, last_used_at: now } : m
  );
  await writeAll(updated);

  return scored;
}
