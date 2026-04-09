import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,  // expose sur le réseau local (0.0.0.0)
    https: {},   // certificat auto-signé via basicSsl()
    // Proxy : les appels API sont forwarded vers le backend Flask local.
    // Le téléphone ne parle qu'à Vite (HTTPS) → pas de mixed-content.
    proxy: {
      // Mock OIDC — doit être avant le backend pour que /auth ne soit pas capturé
      '/.well-known': { target: 'http://localhost:5556', changeOrigin: true },
      '/oauth':       { target: 'http://localhost:5556', changeOrigin: true },
      '/authorize':   { target: 'http://localhost:5556', changeOrigin: true },
      '/token':       { target: 'http://localhost:5556', changeOrigin: true },
      '/userinfo':    { target: 'http://localhost:5556', changeOrigin: true },
      '/endsession':  { target: 'http://localhost:5556', changeOrigin: true },
      // API Flask backend
      '/product':    { target: 'http://localhost:8000', changeOrigin: true },
      '/zone':       { target: 'http://localhost:8000', changeOrigin: true },
      '/commandes':  { target: 'http://localhost:8000', changeOrigin: true },
      '/commande':   { target: 'http://localhost:8000', changeOrigin: true },
      '/auth':       { target: 'http://localhost:8000', changeOrigin: true },
      '/admin':      { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  base: '/',
  plugins: [
    tailwindcss(),
    basicSsl(),
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: 'Supercoop App',
        short_name: 'SuperApp',
        description: "App pour faire l'inventaire et la réception produit supercoop",
        theme_color: '#ffffff',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
