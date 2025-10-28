import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src/desktop/renderer'),
  plugins: [react()],
  server: { port: 5174, strictPort: true },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
