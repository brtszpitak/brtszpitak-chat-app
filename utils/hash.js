import crypto from 'crypto';
export function sha256(bufOrStr) {
  const hash = crypto.createHash('sha256');
  hash.update(bufOrStr);
  return hash.digest('hex');
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
