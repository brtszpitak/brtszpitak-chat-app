#!/usr/bin/env node
const fs = require('fs'),
  cp = require('child_process');
function sh(c) {
  return cp.execSync(c, { stdio: 'pipe' }).toString().trim();
}
function run(c) {
  cp.execSync(c, { stdio: 'inherit' });
}
try {
  // bump patch (lightweight): vX.Y.Z -> vX.Y.(Z+1)
  let tag = sh('git describe --tags --abbrev=0 2>NUL || echo v3.0.1');
  let [v, maj, minor, patch] = tag.match(/^v(\d+)\.(\d+)\.(\d+)$/)
    ? [true, ...tag.slice(1).split('.').map(Number)]
    : [false, 3, 0, 1];
  if (!v) {
    tag = 'v3.0.1';
    maj = 3;
    minor = 0;
    patch = 1;
  }
  const next = `v${maj}.${minor}.${patch + 1}`;
  // ensure desktop artifacts exist
  if (!fs.existsSync('dist') && !fs.existsSync('desktop/dist'))
    run('node autonomy/tasks/build-desktop.cjs');

  // commit changelog note
  const note = `Release ${next} — desktop build + learn cycle\n`;
  fs.appendFileSync('docs/NEXT_PHASE_LOG.md', note);
  run('git add docs/NEXT_PHASE_LOG.md');
  run(`git commit -m "docs: ${note.replace(/\n$/, '')}" || echo .`);

  // tag locally
  run(`git tag ${next} -m "Alice ${next}"`);

  // try GitHub CLI if available
  try {
    run('gh --version');
    // create draft release and upload artifacts if present
    let asset = fs.existsSync('releases')
      ? 'releases'
      : fs.existsSync('desktop/dist')
        ? 'desktop/dist'
        : null;
    if (asset) {
      run(
        `gh release create ${next} ${asset}/* -t "${next}" -n "Auto release" --draft`,
      );
    } else {
      run(
        `gh release create ${next} -t "${next}" -n "Auto release (no assets found)" --draft`,
      );
    }
    console.log(
      JSON.stringify({ ok: true, note: `release prepared ${next} (draft)` }),
    );
  } catch (_) {
    console.log(
      JSON.stringify({ ok: true, note: `tagged ${next} (gh not configured)` }),
    );
  }
} catch (e) {
  console.error(JSON.stringify({ ok: false, err: String(e) }));
  process.exit(0);
}
