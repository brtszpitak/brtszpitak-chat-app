import fs from 'fs';
import path from 'path';
export function safeJoin(base, p) {
  const resolved = path.resolve(base, p);
  if (!resolved.toLowerCase().startsWith(path.resolve(base).toLowerCase())) {
    throw new Error('Path escapes base');
  }
  return resolved;
}
export function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
