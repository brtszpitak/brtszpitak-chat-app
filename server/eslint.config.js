/** ESLint v9 flat config (server) */
export default [
  { ignores: ["scripts/failed/**"] },
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
    },
    rules: {},
  },
];
