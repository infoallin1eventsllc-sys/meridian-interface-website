import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// DEMO_BASE lets this be served from a sub-folder of the main site
// (meridianinterface.com/demos/stack-planner/) with no project of its own.
export default defineConfig({
  base: process.env.DEMO_BASE || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
