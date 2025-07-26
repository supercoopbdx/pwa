import '@/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from '@/components/App.vue'
import routes from '@/routes.js'
import messages from '@/i18n/messages.js'

// Création de l'application et des plugins
const app = createApp(App)
const pinia = createPinia()
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Configuration de l'I18n
const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  messages,
})

// Utilisation des plugins
app.use(router)
app.use(pinia)
app.use(i18n)

// Initialisation du store d'authentification
import { useAuthStore } from '@/stores/authStore'

// Fonction d'initialisation asynchrone
const initApp = async () => {
  try {
    const authStore = useAuthStore()
    await authStore.initialize()
    
    // Protection des routes
    router.beforeEach(async (to, from, next) => {
      console.log('Authentification:', authStore.isAuthenticated)
      if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        // Redirection vers la page d'accueil avec un message
        next({ name: 'home', query: { authMessage: 'Connection requise' } });
      } else {
        next();
      }
    })
    
    // Montage de l'application
    app.mount('#app')
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de l\'application:', error)
  }
}

// Lancement de l'initialisation
initApp()
