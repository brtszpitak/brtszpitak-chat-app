/* eslint flat config (ESLint v9) */
module.exports = [
  // Global ignores (flat config doesn't read .eslintignore by default)
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

  // Lint only JS/CJS in server/
  {
    files: ["server/**/*.js", "server/**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs"
    },
    rules: {
      // keep rules light here; autonomy shouldn't get blocked by style
    }
  }
];
