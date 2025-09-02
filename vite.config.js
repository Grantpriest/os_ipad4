import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/os_ipad4/', // ← IMPORTANT: must match your GitHub repo name
  plugins: [react()],
});
