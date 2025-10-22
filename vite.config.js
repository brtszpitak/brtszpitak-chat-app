import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  root: 'src/desktop/renderer',
  build: { outDir: '../../../dist', emptyOutDir: true },
  server: { port: Number(process.env.VITE_PORT) || 5174, strictPort: true, host: true }
});
