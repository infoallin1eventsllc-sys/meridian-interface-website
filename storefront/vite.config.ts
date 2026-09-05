import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // Set DEMO_BASE when this is hosted under a sub-path on meridianinterface.com
    // (e.g. DEMO_BASE=/demos/storefront/). Defaults to root for standalone hosting.
    base: process.env.DEMO_BASE || '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') },
    },
  };
});
