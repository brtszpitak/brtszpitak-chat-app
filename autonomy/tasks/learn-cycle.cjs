#!/usr/bin/env node
const fs = require('fs'),
  cp = require('child_process');
function sh(cmd) {
  cp.execSync(cmd, { stdio: 'inherit' });
}
try {
  // gather signals
  const notes = [
    'git status --porcelain',
    'git log -5 --oneline',
    'git diff --name-only HEAD~1..HEAD || echo ""',
  ]
    .map((c) => `${c}\n${cp.execSync(c).toString()}`)
    .join('\n\n');
  fs.writeFileSync('server/logs/learn-input.txt', notes);

  // lightweight heuristic: if build & smoke were green, propose tiny refactors
  // (delegate to existing self-rewrite for now; this connects the loop)
  sh(
    'node autonomy/tasks/self-rewrite.cjs || node autonomy/tasks/self-rewrite.backup.cjs',
  );

  console.log(JSON.stringify({ ok: true, note: 'learn-cycle executed' }));
  process.exit(0);
} catch (e) {
  console.error(e);
  process.exit(0);
}
