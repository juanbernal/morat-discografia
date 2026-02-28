import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    const isProduction = mode === 'production';
    
    return {
      base: isProduction ? './' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        tailwindcss(),
      ],
      define: {
        'process.env.SPOTIFY_CLIENT_ID': JSON.stringify(env.SPOTIFY_CLIENT_ID || ''),
        'process.env.SPOTIFY_CLIENT_SECRET': JSON.stringify(env.SPOTIFY_CLIENT_SECRET || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
        'global': 'window',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
