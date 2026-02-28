import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    // Para GitHub Pages, si el repo es 'diosmasgym-records', la base debe ser '/diosmasgym-records/'
    // Pero si usamos un dominio personalizado o queremos que funcione en cualquier subcarpeta, './' es más seguro.
    const isProduction = mode === 'production';
    
    return {
      base: isProduction ? './' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.SPOTIFY_CLIENT_ID': JSON.stringify(env.SPOTIFY_CLIENT_ID || ''),
        'process.env.SPOTIFY_CLIENT_SECRET': JSON.stringify(env.SPOTIFY_CLIENT_SECRET || ''),
        'process.env.YOUTUBE_API_KEY': JSON.stringify(env.YOUTUBE_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
