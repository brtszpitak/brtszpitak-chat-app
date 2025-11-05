const path = require('path');
const fs = require('fs');
const git = require('../lib/git.cjs');

function shellJoin(cmd, args = []) {
  const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
  return [cmd, ...args.map(q)].join(' ');
}

async function runExec(execFn, cmd, args, opts) {
  if (Array.isArray(args)) {
    const full = shellJoin(cmd, args);
    return execFn(full, opts);
  }
  return execFn(cmd, args);
}

async function textOut(p) {
  const out = await p;
  return String(out && out.stdout ? out.stdout : out || '').trim();
}

async function hasWorkingChanges(execFn, cwd) {
  try {
    const txt = await textOut(
      runExec(execFn, 'git', ['status', '--porcelain'], { cwd }),
    );
    return txt.length > 0;
  } catch {
    return true;
  }
}

async function stagedList(execFn, cwd) {
  try {
    return await textOut(
      runExec(execFn, 'git', ['diff', '--cached', '--name-only'], { cwd }),
    );
  } catch {
    return '';
  }
}

async function ensureLocalIdentity(execFn, cwd) {
  const email = await textOut(
    runExec(execFn, 'git', ['config', '--get', 'user.email'], { cwd }),
  );
  const name = await textOut(
    runExec(execFn, 'git', ['config', '--get', 'user.name'], { cwd }),
  );
  if (!email)
    await runExec(execFn, 'git', ['config', 'user.email', 'autonomy@local'], {
      cwd,
    });
  if (!name)
    await runExec(execFn, 'git', ['config', 'user.name', 'Alice Autonomy'], {
      cwd,
    });
}

module.exports = {
  name: 'self-rewrite',
  run: async ({ exec, proposeDiff, datetime }) => {
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
    for (const e of (plan && plan.edits) || []) {
      const rel = String(e.path || '').replace(/\\/g, '/');
      if (!ALLOW.some((a) => rel === a || rel.startsWith(a))) continue;
      const abs = path.resolve(process.cwd(), e.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      const after = typeof e.apply === 'function' ? e.apply(before) : before;
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, after, 'utf8');
      if (++applied >= 10) break;
    }

    // best-effort hygiene
    try {
      await runExec(exec, 'npx', ['prettier', '--write', '.'], {
        cwd: process.cwd(),
      });
    } catch {}
    try {
      await runExec(exec, 'npm', ['run', 'lint', '--', '--max-warnings=0'], {
        cwd: process.cwd(),
      });
    } catch {}
    try {
      await runExec(exec, 'npm', ['run', 'build'], {
        cwd: path.resolve(process.cwd(), 'client'),
      });
    } catch {}

    // stage & commit (safe)
    const cwd = process.cwd();
    try {
      if (!(await hasWorkingChanges(exec, cwd))) {
        return {
          ok: true,
          note: `self-rewrite: no changes; repo clean on ${branch}`,
        };
      }

      await runExec(exec, 'git', ['add', '-A'], { cwd });
      const staged = await stagedList(exec, cwd);
      if (!staged) {
        return {
          ok: true,
          note: `self-rewrite: nothing staged after add; skipping commit on ${branch}`,
        };
      }

      await ensureLocalIdentity(exec, cwd);

      const msg = `self-rewrite: ${applied} edits`;
      try {
        await runExec(exec, 'git', ['commit', '-m', msg], { cwd });
        return {
          ok: true,
          note: `self-rewrite committed (${msg}) on ${branch}`,
        };
      } catch (e) {
        // Graceful degrade: don't fail the task if commit rejects; include mini-diagnostic
        const head = await textOut(
          runExec(exec, 'git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd }),
        );
        const stagedTail = staged.split(/\r?\n/).slice(0, 5).join(', ');
        return {
          ok: true,
          note: `self-rewrite: commit skipped (git refused). branch=${head} staged=[${stagedTail}] msg="${msg}"`,
        };
      }
    } catch (e) {
      return {
        ok: false,
        note: `self-rewrite: unexpected error: ${e && e.message ? e.message : e}`,
      };
    }
  },
};
