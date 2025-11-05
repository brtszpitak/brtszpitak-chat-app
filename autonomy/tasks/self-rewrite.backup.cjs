const path = require('path');
const fs = require('fs');
const git = require('../lib/git.cjs');

// Prefer execFile(signature) when args[] is provided; otherwise fall back to a single command string.
async function runExec(execFn, cmd, args, opts) {
  if (Array.isArray(args)) {
    try {
      return await execFn(cmd, args, opts); // execFile-style
    } catch (e) {
      const full = [cmd, ...args].join(' ');
      return execFn(full, opts); // fallback to exec-style
    }
  }
  return execFn(cmd, args); // plain exec-style
}

module.exports = {
  name: 'self-rewrite',
  run: async ({ exec, proposeDiff, datetime }) => {
    // Fallback if runner didn't inject proposeDiff yet
    if (typeof proposeDiff !== 'function') {
      proposeDiff = async () => ({
        ok: true,
        note: 'fallback proposeDiff',
        edits: [],
      });
    }

    await git.assertClean();
    const branch =
      'autonomy/rewrite-' + datetime().toISOString().replace(/[:.]/g, '-');
    await git.checkoutNew(branch);

    // Only allow safe areas
    const ALLOW = [
      'server/',
      'client/',
      'autonomy/',
      'package.json',
      'package-lock.json',
    ];

    // Ask model (or fallback) for suggested edits with strict guards
    const plan = await proposeDiff({
      goals: ['improve reliability', 'reduce warnings', 'enhance logs'],
      hard_guards: {
        path_allowlist: ALLOW,
        max_files: 10,
        max_total_change_bytes: 120000,
      },
    });

    let applied = 0;
    for (const e of (plan && plan.edits) || []) {
      const rel = String(e.path || '').replace(/\\/g, '/');
      if (!ALLOW.some((a) => rel === a || rel.startsWith(a))) continue;

      const abs = path.resolve(process.cwd(), e.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      const after = typeof e.apply === 'function' ? e.apply(before) : before;

      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, after, 'utf8');

      applied += 1;
      if (applied >= 10) break;
    }

    // Format (best-effort)
    try {
      await runExec(exec, 'npx', ['prettier', '--write', '.'], {
        cwd: process.cwd(),
      });
    } catch {
      try {
        const bin = path.resolve(
          process.cwd(),
          'node_modules',
          '.bin',
          process.platform === 'win32' ? 'prettier.cmd' : 'prettier',
        );
        await runExec(exec, bin, ['--write', '.'], { cwd: process.cwd() });
      } catch {}
    }

    // Lint (best-effort)
    try {
      await runExec(exec, 'npm', ['run', 'lint', '--', '--max-warnings=0'], {
        cwd: process.cwd(),
      });
    } catch {}

    // Build client (best-effort)
    try {
      const client = path.resolve(process.cwd(), 'client');
      await runExec(exec, 'npm', ['run', 'build'], { cwd: client });
    } catch {}

    await git.addAll();
    await git.commit(`self-rewrite: ${applied} edits`);

    return {
      ok: true,
      note: `self-rewrite committed ${applied} edits on ${branch}`,
    };
  },
};
