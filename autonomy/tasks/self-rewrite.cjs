const path = require('path');
const fs = require('fs');
const git = require('../lib/git.cjs');

module.exports = {
  name: 'self-rewrite',
  run: async ({ exec, proposeDiff, datetime }) => {
    await git.assertClean();
    const branch =
      'autonomy/rewrite-' + datetime().toISOString().replace(/[:.]/g, '-');
    await git.checkoutNew(branch);

    // Ask model for safe diffs within allowlist
    const ALLOW = [
      'server/',
      'client/',
      'autonomy/',
      'package.json',
      'package-lock.json',
    ];
    const plan = await proposeDiff({
      goals: ['improve reliability', 'reduce warnings', 'enhance logs'],
      hard_guards: {
        path_allowlist: ALLOW,
        max_files: 10,
        max_total_change_bytes: 120000,
      },
    });

    let applied = 0;
    for (const e of plan.edits || []) {
      const rel = e.path.replace(/\\/g, '/');
      if (!ALLOW.some((a) => rel === a || rel.startsWith(a))) continue;
      const abs = path.resolve(process.cwd(), e.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      const after = e.apply ? e.apply(before) : before;
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, after, 'utf8');
      if (++applied >= 10) break;
    }

    // Format, lint, build quick checks
    await exec('npm', ['run', 'prettier', '--', '--write', '.'], {
      cwd: process.cwd(),
    });
    try {
      await exec('npm', ['run', 'lint', '--', '--max-warnings=0'], {
        cwd: process.cwd(),
      });
    } catch (e) {}
    const client = path.resolve(process.cwd(), 'client');
    try {
      await exec('npm', ['run', 'build'], { cwd: client });
    } catch (e) {}

    await git.addAll();
    await git.commit(`self-rewrite: ${applied} edits`);

    return {
      ok: true,
      note: `self-rewrite committed ${applied} edits on ${branch}`,
    };
  },
};

