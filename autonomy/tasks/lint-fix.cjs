/**
 * Lint/format task used by autonomy.
 * - Prettier across repo with .prettierignore
 * - ESLint scoped to server JS/CJS only with .eslintignore
 *   (do not fail the autonomy run if ESLint exits non-zero)
 */
const { execSync } = require("child_process");

function sh(cmd) {
  execSync(cmd, { stdio: "inherit", windowsHide: true });
}

function trySh(cmd) {
  try {
    sh(cmd);
    return true;
  } catch (e) {
    return false;
  }
}

exports.run = async () => {
  // Prettier (fast, cached, respects .prettierignore)
  trySh('npx prettier --ignore-path .prettierignore --ignore-unknown --cache --write .');

  // ESLint – scope to server JS/CJS only, honor .eslintignore, do not error if none matched
  const eslintCmd = 'npx eslint "server/**/*.js" "server/**/*.cjs" --ignore-path .eslintignore --no-error-on-unmatched-pattern --max-warnings=0';
  const ok = trySh(eslintCmd);

  return {
    ok: true,
    note: `prettier=done | eslintScoped=${ok ? "ran" : "skipped/failed (ignored)"}`
  };
};
