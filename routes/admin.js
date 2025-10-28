import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const ROOT = path.resolve(__dirname, '..');
const POLICY_FILE = path.join(ROOT, 'policy', 'policy.json');
const AUTONOMY_FLAG = path.join(ROOT, 'AUTONOMY_OFF');

router.get('/status', (req, res) => {
  const policy = JSON.parse(fs.readFileSync(POLICY_FILE, 'utf8'));
  const paused = fs.existsSync(AUTONOMY_FLAG);
  res.json({ policy, autonomy_paused: paused });
});

router.post('/pause', (req, res) => {
  fs.writeFileSync(AUTONOMY_FLAG, 'paused');
  res.json({ status: 'paused' });
});

router.post('/resume', (req, res) => {
  if (fs.existsSync(AUTONOMY_FLAG)) fs.unlinkSync(AUTONOMY_FLAG);
  res.json({ status: 'resumed' });
});

router.post('/set-policy', (req, res) => {
  const body = req.body || {};
  const curr = JSON.parse(fs.readFileSync(POLICY_FILE, 'utf8'));
  const next = { ...curr, ...body };
  fs.writeFileSync(POLICY_FILE, JSON.stringify(next, null, 2));
  res.json({ status: 'ok', policy: next });
});

export default router;
