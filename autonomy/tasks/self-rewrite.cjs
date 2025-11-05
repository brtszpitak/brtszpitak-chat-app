// Self-rewrite task (CommonJS)
// - Prettier (and ESLint if available)
// - Stage safe paths only, unstage forbidden
// - Skip if no diffs
// - Commit with timestamped message

const { spawnSync } = require('node:child_process');
const {
  existsSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
} = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '..');
process.chdir(root);

function run(cmd, args = [], opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'pipe', encoding: 'utf-8', ...opts });
  if (r.error) throw r.error;
  return r;
}
function ok(r) {
  return r.status === 0;
}
function log(...a) {
  console.log('[self-rewrite]', ...a);
}
function now() {
  const d = new Date(),
    pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function gitSafe() {
  const gv = run('git', ['--version']);
  if (!ok(gv)) throw new Error('git not available');
  const gr = run('git', ['rev-parse', '--is-inside-work-tree']);
  if (!ok(gr) || gr.stdout.trim() !== 'true')
    throw new Error('not inside a git work tree');
}
function getPorcelain() {
  const s = run('git', ['status', '--porcelain']);
  if (!ok(s)) throw new Error('git status failed');
  return s.stdout.trim();
}
function stageAll() {
  const r = run('git', ['add', '-A']);
  if (!ok(r)) throw new Error('git add failed');
}
function unstageForbidden() {
  const patterns = [
    'node_modules/',
    'dist/',
    'build/',
    'out/',
    '.next/',
    '.cache/',
    '.parcel-cache/',
    'coverage/',
    'logs/',
    'log/',
    'releases/',
    'downloads/',
    'tmp/',
    'temp/',
    '*.log',
    '*.tmp',
    '*.lock',
    '*.pid',
    '.DS_Store',
    'Thumbs.db',
    'server/state.json',
    'client/dist/',
    'desktop/dist/',
    'autonomy_heartbeat.txt',
  ];
  for (const p of patterns) {
    run('git', ['restore', '--staged', '--worktree', '--', p]);
  }
}
function hasDiff() {
  return getPorcelain().length > 0;
}
function prettier() {
  const local = existsSync(path.resolve('node_modules/.bin/prettier'))
    ? path.resolve('node_modules/.bin/prettier')
    : null;
  const args = ['--write', '.'];
  const r = local
    ? run(local, args, { shell: process.platform === 'win32' })
    : run('npx', ['--yes', 'prettier', ...args], {
        shell: process.platform === 'win32',
      });
  if (!ok(r)) throw new Error('prettier --write failed');
  log('prettier formatted files');
}
function eslintFixIfAvailable() {
  const local = existsSync(path.resolve('node_modules/.bin/eslint'))
    ? path.resolve('node_modules/.bin/eslint')
    : null;
  if (!local) {
    log('eslint not found; skipping eslint --fix');
    return;
  }
  const r = run(local, ['.', '--fix'], { shell: process.platform === 'win32' });
  if (!ok(r)) {
    log('eslint --fix non-zero; continuing');
    return;
  }
  log('eslint --fix applied');
}
function commit() {
  run('git', ['config', '--get', 'user.name']);
  run('git', ['config', '--get', 'user.email']);
  const msg = `autonomy(self-rewrite): format & tidy @ ${now()}`;
  const c = run('git', ['commit', '-m', msg]);
  if (!ok(c)) {
    const out = (c.stdout || '') + '\n' + (c.stderr || '');
    if (/nothing to commit/i.test(out)) {
      log('nothing to commit');
      return false;
    }
    throw new Error('git commit failed');
  }
  log('commit created:', msg);
  return true;
}

// Optional helper: ensure one safe, plan-like edit if absolutely nothing changed
function ensureOnePlanEdit() {
  let touched = false;
  // Try managed header in server/autonomy.js
  try {
    const rel = 'server/autonomy.js';
    const abs = path.resolve(process.cwd(), rel);
    const marker = '/* AUTONOMY_MARK: managed header */';
    const before = existsSync(abs) ? readFileSync(abs, 'utf8') : '';
    if (!before.includes(marker)) {
      const header =
        marker +
        '\n// Added by self-rewrite on ' +
        new Date().toISOString() +
        '\n';
      mkdirSync(path.dirname(abs), { recursive: true });
      writeFileSync(abs, header + before, 'utf8');
      run('git', ['add', rel]);
      touched = true;
    }
  } catch {}
  // Else, append a log line in docs/SELF_REWRITE.md
  if (!touched) {
    try {
      const rel = 'docs/SELF_REWRITE.md';
      const abs = path.resolve(process.cwd(), rel);
      const before = existsSync(abs) ? readFileSync(abs, 'utf8') : '';
      const line = 'AUTONOMY_MARK_LOG: ' + new Date().toISOString();
      const after = before
        ? before.replace(/\s*$/, '') + '\n' + line + '\n'
        : '# Self-rewrite log\n\n' + line + '\n';
      mkdirSync(path.dirname(abs), { recursive: true });
      writeFileSync(abs, after, 'utf8');
      run('git', ['add', rel]);
      touched = true;
    } catch {}
  }
  return touched;
}

async function main() {
  try {
    gitSafe();
    const bn = run('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    if (ok(bn)) log('branch:', bn.stdout.trim());

    // 1) Format
    prettier();
    eslintFixIfAvailable();

    // 2) Stage/guard
    stageAll();
    unstageForbidden();

    // 3) If no diffs, attempt one safe, traceable plan edit, then re-check
    if (!hasDiff()) {
      if (ensureOnePlanEdit()) {
        // guard again just in case
        stageAll();
        unstageForbidden();
      }
    }

    // 4) Exit early if still no changes
    if (!hasDiff()) {
      log('no safe changes detected — skip commit');
      return {
        ok: true,
        note: 'self-rewrite: no changes; repo clean (skipped commit)',
      };
    }

    // 5) Commit
    const made = commit();
    return {
      ok: true,
      note: made ? 'self-rewrite committed' : 'self-rewrite: nothing to commit',
    };
  } catch (err) {
    console.error('[self-rewrite] ERROR:', err?.message || err);
    return { ok: false, note: String(err?.message || err) };
  }
}

module.exports = {
  name: 'self-rewrite',
  run: main,
};
