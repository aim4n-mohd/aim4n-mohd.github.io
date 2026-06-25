import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages at https://username.github.io/repo-name/, set base to '/repo-name/'.
  base: process.env.VITE_BASE_PATH || '/',
  test: {
    environment: 'jsdom',
    globals: true
  }
});
