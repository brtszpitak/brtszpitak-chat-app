/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
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
  {
    files: ["server/**/*.js", "server/**/*.cjs"],
    languageOptions: { ecmaVersion: 2022, sourceType: "commonjs" },
    rules: {}
  }
];
