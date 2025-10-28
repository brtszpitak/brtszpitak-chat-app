// server/fs-readonly.js — full replacement (read-only FS with default deny)

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root even if this runs before index.js
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ---------- Config ----------
const driveRoot = path.resolve(process.env.DRIVE_ROOT || "D:\\");
const maxRead = Number(process.env.MAX_READ_BYTES || 5 * 1024 * 1024);

// Default denylist ALWAYS includes SteamLibrary unless you override it explicitly.
// You can add more in .env with ; separators, e.g. D:\SteamLibrary;D:\Private
const envDenyRaw = (process.env.DENYLIST_PATHS || "").trim();
const defaultDeny = ["D:\\SteamLibrary"];
const rawDeny = envDenyRaw
  ? envDenyRaw
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean)
  : defaultDeny;

// Normalize denylist (absolute, case-insensitive for Windows)
const denyResolved = rawDeny.map((p) => path.resolve(p));
const denyLower = denyResolved.map((p) => p.replaceAll("/", "\\").toLowerCase());
const denyLowerWithSlash = denyLower.map((p) => (p.endsWith("\\") ? p : p + "\\"));

function normalizeWin(p) {
  return p.replaceAll("/", "\\").toLowerCase();
}

function isDenied(candidateAbsPath) {
  const cand = normalizeWin(path.resolve(candidateAbsPath));
  if (denyLower.includes(cand)) return true; // exact match
  for (const d of denyLowerWithSlash) {
    if (cand.startsWith(d)) return true; // any descendant
  }
  return false;
}

function safeResolve(userRel = "") {
  const rel = (userRel ?? "").toString().replaceAll("\\", "/");
  const candidate = path.resolve(driveRoot, "." + path.sep + rel);

  const rootNorm = normalizeWin(path.resolve(driveRoot));
  const candNorm = normalizeWin(candidate);

  if (!candNorm.startsWith(rootNorm)) {
    const err = new Error("Path escapes DRIVE_ROOT");
    err.status = 400;
    throw err;
  }
  if (isDenied(candidate)) {
    const err = new Error("Path is denied");
    err.status = 403;
    throw err;
  }
  return candidate;
}

export async function listDir(rel = "") {
  const target = safeResolve(rel);
  const st = await fs.stat(target).catch(() => null);
  if (!st) {
    const err = new Error("Not found");
    err.status = 404;
    throw err;
  }
  if (!st.isDirectory()) {
    const err = new Error("Not a directory");
    err.status = 400;
    throw err;
  }

  const entries = await fs.readdir(target, { withFileTypes: true });
  const filtered = [];
  for (const e of entries) {
    const full = path.join(target, e.name);
    if (isDenied(full)) continue;

    const s = await fs.stat(full);
    filtered.push({
      name: e.name,
      path: path.relative(driveRoot, full).replaceAll("\\", "/"),
      type: e.isDirectory() ? "dir" : "file",
      size: e.isDirectory() ? null : s.size,
      mtime: s.mtimeMs,
    });
  }
  return filtered;
}

export async function readFile(rel) {
  const target = safeResolve(rel);
  const st = await fs.stat(target).catch(() => null);
  if (!st || !st.isFile()) {
    const err = new Error("File not found");
    err.status = 404;
    throw err;
  }
  if (st.size > maxRead) {
    const err = new Error(`File too large to read (>${maxRead} bytes)`);
    err.status = 413;
    throw err;
  }
  return fs.readFile(target, "utf8");
}

// Debug data so index.js can show effective config at runtime
export function getFsConfig() {
  return {
    driveRoot,
    maxRead,
    envDenyRaw,
    denyResolved,
  };
}
