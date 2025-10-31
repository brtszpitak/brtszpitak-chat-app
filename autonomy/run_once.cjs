const { execSync } = require('node:child_process');
function commitIfDirty(msg = 'chore: auto-baseline after note-progress') {
  const out = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (out) {
    execSync('git add -A', { stdio: 'inherit' });
    try { execSync(git commit -m "", { stdio: 'inherit' }); } catch {}
  }
}
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

function sh(cmd, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { shell: true, stdio: 'inherit', ...opts });
    p.on('close', (c) =>
      c === 0 ? resolve() : reject(new Error(cmd + ' exit ' + c)),
    );
  });
}

const helpers = {
  exec: async (cmd, args = [], opts = {}) => sh(cmd, args, opts),
  fetch,
  datetime: () => new Date(),
  proposeDiff: async (ctx) => {
    // Placeholder — your autonomy engine can replace this; we no-op for now
    return { edits: [] };
  },
};

async function runTask(name) {
  const mod = require(path.resolve('autonomy/tasks', name + '.cjs'));
  const res = await mod.run(helpers);
  console.log(`[task ${name}]`, res);
}

(async () => {
  const order = [
    'lint-fix',
    'audit-server',
    'build-client',
    'smoke-endpoints',
    'note-progress',
    'self-rewrite',
  ];
  for (const t of order) {
    console.log('=== RUN', t, '===');
    await runTask(t);
  }
  console.log('All tasks complete.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});



