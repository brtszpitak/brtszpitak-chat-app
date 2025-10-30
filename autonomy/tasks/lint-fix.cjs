const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

function sh(cmd, args = [], opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { shell: true, stdio: 'inherit', ...opts });
    p.on('close', (code) => resolve(code));
  });
}

async function ensurePrettier(cwd) {
  const hasLocal = fs.existsSync(
    path.join(cwd, 'node_modules', '.bin', 'prettier'),
  );
  if (!hasLocal) {
    await sh('npm', ['i', '-D', 'prettier'], { cwd });
  }
}

async function maybeEnsureESLint(cwd) {
  const hasLocal = fs.existsSync(
    path.join(cwd, 'node_modules', '.bin', 'eslint'),
  );
  if (!hasLocal && fs.existsSync(path.join(cwd, 'package.json'))) {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'),
    );
    const need =
      (pkg.devDependencies && pkg.devDependencies.eslint) ||
      (pkg.dependencies && pkg.dependencies.eslint);
    if (need) await sh('npm', ['i', '-D', 'eslint'], { cwd });
  }
}

async function runPrettier(cwd) {
  const globs = ['**/*.{js,cjs,mjs,ts,tsx,json,md,css,scss,html}'];
  const code = await sh('npx', ['prettier', '--write', ...globs], { cwd });
  return code === 0;
}

async function runESLintFix(cwd) {
  if (!fs.existsSync(path.join(cwd, 'node_modules', '.bin', 'eslint')))
    return false;
  const code = await sh('npx', ['eslint', '.', '--fix'], { cwd });
  return code === 0;
}

module.exports = {
  name: 'lint-fix',
  run: async () => {
    const roots = [process.cwd()];
    for (const sub of ['server', 'client']) {
      const p = path.join(process.cwd(), sub);
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) roots.push(p);
    }

    let notes = [];
    for (const cwd of roots) {
      try {
        await ensurePrettier(cwd);
        await maybeEnsureESLint(cwd);
        const pOk = await runPrettier(cwd);
        const eOk = await runESLintFix(cwd);
        notes.push(
          `${path.basename(cwd) || 'root'}: prettier=${pOk}, eslintFix=${eOk}`,
        );
      } catch (e) {
        notes.push(`${path.basename(cwd) || 'root'}: error=${e.message}`);
      }
    }
    return { ok: true, note: notes.join(' | ') };
  },
};
