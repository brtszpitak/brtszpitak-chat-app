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

async function maybeEnsureeslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
  const hasLocal = fs.existsSync(
    path.join(cwd, 'node_modules', '.bin', 'eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
  );
  if (!hasLocal && fs.existsSync(path.join(cwd, 'package.json'))) {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'),
    );
    const need =
      (pkg.devDependencies && pkg.devDependencies.eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
      (pkg.dependencies && pkg.dependencies.eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
    if (need) await sh('npm', ['i', '-D', 'eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
  }
}

async function runPrettier(cwd) {
  const globs = ['**/*.{js,cjs,mjs,ts,tsx,json,md,css,scss,html}'];
  const code = await sh('npx', ['prettier', '--write', ...globs], { cwd });
  return code === 0;
}

async function runeslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
  if (!fs.existsSync(path.join(cwd, 'node_modules', '.bin', 'eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
    return false;
  const code = await sh('npx', ['eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
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
        await maybeEnsureeslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
        const pOk = await runPrettier(cwd);
        const eOk = await runeslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
        notes.push(
          `${path.basename(cwd) || 'root'}: prettier=${pOk}, eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0
        );
      } catch (e) {
        notes.push(`${path.basename(cwd) || 'root'}: error=${e.message}`);
      }
    }
    return { ok: true, note: notes.join(' | ') };
  },
};

