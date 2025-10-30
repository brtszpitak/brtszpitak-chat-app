/** ESLint v9 flat config (root) */
export default [
  // Global ignores (replacement for .eslintignore)
  {
    ignores: [
      'client/**',
      'dist/**',
      'client/dist/**',
      'desktop/**',
      'desktop-app/**',
      'releases/**',
      'out/**',
      'logs/**',
      'backups/**',
      'server/index.before-*.js',
      'server/index.js.before-*.js',
      'server/scripts/failed/**',
    ],
  },

  // Only lint server JS/CJS/MJS here (client has its own TS config)
  {
    files: ['server/**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
    rules: {
      // put any rule overrides you want here
    },
  },
];
