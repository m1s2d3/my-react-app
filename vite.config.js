import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png'], // or add favicon if needed
      manifest: {
        short_name: 'TicTacToe',
        name: 'Tic Tac Toe Game',
        icons: [
          {
            src: 'icon-192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            "src": "icon-developer.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "app-icon.png",
            "type": "image/png",
            "sizes": "192x192"
          }
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
      },
    }),
  ],
});
