/** Minimal flat config so ESLint v9 stops complaining in server/ */
export default [
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: ["node_modules/**", "dist/**", "logs/**"]
  }
];
