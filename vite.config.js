VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['icon-192.png','app-icon.png', 'icon-developer.png', 'draw.png', 'win.png', 'lose.png'],
  manifest: {
    short_name: 'TicTacToe',
    name: 'Tic Tac Toe Game',
    icons: [
      { src: 'icon-192.png', type: 'image/png', sizes: '192x192' }
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: '#4f46e5',
    background_color: '#ffffff',
  },
})
