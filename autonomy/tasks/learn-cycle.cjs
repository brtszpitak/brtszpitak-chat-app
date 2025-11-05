'use strict';
const fs = require('fs'),
  cp = require('child_process');
function sh(cmd) {
  cp.execSync(cmd, { stdio: 'inherit' });
}
try {
  const notes = [
    'git status --porcelain',
    'git log -5 --oneline',
    'git diff --name-only HEAD~1..HEAD || echo ""',
  ]
    .map((c) => `${c}\n${cp.execSync(c).toString()}`)
    .join('\n\n');
  fs.writeFileSync('server/logs/learn-input.txt', notes);

  // delegate to existing self-rewrite
  try {
    sh('node autonomy/tasks/self-rewrite.cjs');
  } catch (_) {
    sh('node autonomy/tasks/self-rewrite.backup.cjs');
  }

  console.log(JSON.stringify({ ok: true, note: 'learn-cycle executed' }));
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(0);
}
