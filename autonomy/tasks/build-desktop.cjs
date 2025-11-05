#!/usr/bin/env node
const cp = require('child_process');
function sh(c) {
  cp.execSync(c, { stdio: 'inherit' });
}
try {
  // ensure client is built
  sh('node autonomy/tasks/build-client.cjs');
  // pack desktop (you already have scripts/pack-desktop.cjs)
  sh('node server/scripts/pack-desktop.cjs');
  console.log(JSON.stringify({ ok: true, note: 'desktop packed' }));
} catch (e) {
  console.error(JSON.stringify({ ok: false, err: String(e) }));
  process.exit(1);
}
