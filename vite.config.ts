import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
    define: {
        // Polyfill VITE_API_KEY with GEMINI_API_KEY if available (for AI Studio Preview)
        // This ensures the app works in the preview environment while using the standard VITE_ pattern
        'import.meta.env.VITE_API_KEY': JSON.stringify(env.VITE_API_KEY || env.GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
