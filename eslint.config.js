/** Root ESLint v9 flat config — JS only */
export default [
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'logs/**',
      'releases/**',
      'out/**',
      'backups/**',
      'client/**', // client has its own config
      'server/scripts/failed/**',
      'server/scripts/generated-*.cjs',
      'server/index.before-*.js',
    ],
  },
];
