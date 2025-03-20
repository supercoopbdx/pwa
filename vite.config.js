import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/pwa/',
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true
      },

      manifest: {
        name: 'Inventaire Supercoop',
        short_name: 'inventaire',
        description: 'App pour faire l\'inventaire supercoop',
        theme_color: '#ffffff'
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true
      },

      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module'
      }
    })
  ]
})
