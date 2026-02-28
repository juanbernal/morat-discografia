import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Si estás en GitHub Pages, la base suele ser '/nombre-del-repo/'
    // Si es un dominio propio (musica.diosmasgym.com), la base es '/'
    const isGitHubPages = process.env.NODE_ENV === 'production'; 
    
    return {
      base: isGitHubPages ? './' : '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env': JSON.stringify(process.env),
        'import.meta.env.VITE_SPOTIFY_CLIENT_ID': JSON.stringify(process.env.SPOTIFY_CLIENT_ID || env.SPOTIFY_CLIENT_ID),
        'import.meta.env.VITE_SPOTIFY_CLIENT_SECRET': JSON.stringify(process.env.SPOTIFY_CLIENT_SECRET || env.SPOTIFY_CLIENT_SECRET),
        'import.meta.env.VITE_YOUTUBE_API_KEY': JSON.stringify(process.env.YOUTUBE_API_KEY || env.YOUTUBE_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
