// server/fs-write.js — write/edit with denylist

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root explicitly
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ---- Config ----
const driveRoot = path.resolve(process.env.DRIVE_ROOT || "D:\\");
const maxWrite = Number(process.env.MAX_WRITE_BYTES || 5 * 1024 * 1024);

// Denylist (default blocks SteamLibrary if env isn’t set)
const envDenyRaw = (process.env.DENYLIST_PATHS || "").trim();
const defaultDeny = ["D:\\SteamLibrary"];
const rawDeny = envDenyRaw
  ? envDenyRaw.split(";").map((p) => p.trim()).filter(Boolean)
  : defaultDeny;

const denyResolved = rawDeny.map((p) => path.resolve(p));
const denyLower = denyResolved.map((p) => p.replaceAll("/", "\\").toLowerCase());
const denyLowerWithSlash = denyLower.map((p) => (p.endsWith("\\") ? p : p + "\\"));

function normalizeWin(p) {
  return p.replaceAll("/", "\\").toLowerCase();
}

function isDenied(absPath) {
  const cand = normalizeWin(path.resolve(absPath));
  if (denyLower.includes(cand)) return true; // exact
  for (const d of denyLowerWithSlash) {
    if (cand.startsWith(d)) return true; // descendant
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
    err.status = 400; throw err;
  }
  if (isDenied(candidate)) {
    const err = new Error("Path is denied");
    err.status = 403; throw err;
  }
  return candidate;
}

// ---- Ops ----
export async function writeTextFile(rel, content, { createDirs = true } = {}) {
  if (typeof content !== "string") {
    const err = new Error("Content must be a UTF-8 string");
    err.status = 400; throw err;
  }
  const target = safeResolve(rel);
  const size = Buffer.byteLength(content, "utf8");
  if (size > maxWrite) {
    const err = new Error(`File too large to write (>${maxWrite} bytes)`);
    err.status = 413; throw err;
  }
  const dir = path.dirname(target);
  if (createDirs) await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(target, content, "utf8");
  return { ok: true, bytes: size };
}

export async function makeDir(rel) {
  const target = safeResolve(rel);
  await fs.mkdir(target, { recursive: true });
  return { ok: true };
}

export async function renamePath(fromRel, toRel) {
  const from = safeResolve(fromRel);
  const to = safeResolve(toRel);
  await fs.mkdir(path.dirname(to), { recursive: true });
  await fs.rename(from, to);
  return { ok: true };
}

export async function removePath(rel) {
  const target = safeResolve(rel);
  const st = await fs.stat(target).catch(() => null);
  if (!st) { const err = new Error("Path not found"); err.status = 404; throw err; }
  if (st.isDirectory()) {
    await fs.rm(target, { recursive: true, force: true });
  } else {
    await fs.unlink(target);
  }
  return { ok: true };
}

// Debug
export function getWriteConfig() {
  return { driveRoot, maxWrite, denyResolved };
}
