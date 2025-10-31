const { execSync } = require('node:child_process');
function commitIfDirty(msg = 'chore: auto-baseline after note-progress') {
  const out = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
  if (out) {
    execSync('git add -A', { stdio: 'inherit' });
    const safe = String(msg).replace(/"/g, '\\"');
    try { execSync('git commit -m "' + safe + '"', { stdio: 'inherit' }); } catch {}
  }
}
    await runTask(t);
  }
  console.log('All tasks complete.');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});




