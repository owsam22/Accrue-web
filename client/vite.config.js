import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // No proxy needed — VITE_API_URL in .env handles both local + production
  server: {
    port: 5173,
  },
});
