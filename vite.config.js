import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'
import { readFileSync } from 'node:fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  base: '/',
  plugins: [
    mkcert(),
    tailwindcss(),
    vue(),
    vueDevTools(),
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
