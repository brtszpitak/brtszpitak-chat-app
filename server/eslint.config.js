/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Global ignores for this subtree (flat config doesn't use .eslintignore)
  {
    ignores: [
      "client/**",
      "desktop/**",
      "desktop-app/**",
      "dist/**",
      "client/dist/**",
      "releases/**",
      "out/**",
      "logs/**",
      "backups/**",
      "server/logs/**",
      "server/index.before-*.js",
      "server/scripts/failed/**",
      "server/scripts/generated-*.cjs"
    ]
  },

  // Lint only JS/CJS under server/
  {
    files: ["server/**/*.js", "server/**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs"
    },
    rules: {
      // keep minimal; autonomy shouldn't be blocked by style
    }
  }
];
