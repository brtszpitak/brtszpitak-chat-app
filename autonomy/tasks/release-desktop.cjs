'use strict';
const fs = require('fs'),
  cp = require('child_process');
function shOut(c) {
  return cp.execSync(c, { stdio: 'pipe' }).toString().trim();
}
function run(c) {
  cp.execSync(c, { stdio: 'inherit' });
}
try {
  let tag = shOut('git describe --tags --abbrev=0 2>NUL || echo v3.0.1');
  let m = tag.match(/^v(\d+)\.(\d+)\.(\d+)$/);
  let maj = 3,
    minor = 0,
    patch = 1;
  if (m) {
    maj = +m[1];
    minor = +m[2];
    patch = +m[3];
  }
  const next = `v${maj}.${minor}.${patch + 1}`;

  if (!fs.existsSync('dist') && !fs.existsSync('desktop/dist')) {
    run('node autonomy/tasks/build-desktop.cjs');
  }

  const note = `Release ${next} — desktop build + learn cycle\n`;
  fs.appendFileSync('docs/NEXT_PHASE_LOG.md', note);
  try {
    run('git add docs/NEXT_PHASE_LOG.md');
    run(`git commit -m "docs: ${note.replace(/\n$/, '')}"`);
  } catch (_) {}

  run(`git tag ${next} -m "Alice ${next}"`);

  try {
    run('gh --version');
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
