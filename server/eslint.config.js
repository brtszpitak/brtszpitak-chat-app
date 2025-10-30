/** Server ESLint v9 flat config — JS only */
export default [
  {
    files: ["**/*.{js,cjs,mjs}"],
    ignores: [
      "node_modules/**",
      "dist/**",
      "logs/**",
      "scripts/failed/**",
      "scripts/generated-*.cjs",
      "index.before-*.js",
    ],
  },
];
