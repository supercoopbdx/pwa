import '@/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from '@/components/App.vue'
import routes from '@/routes.js'
import { useAuthStore } from '@/stores/auth.js'
import french from '@/lang/fr.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirection vers la page d'accueil avec un message
    next({ name: 'home', query: { authMessage: 'Connection requise' } })
  } else {
    next()
  }
})

createApp(App)
  .use(createPinia())
  .use(router)
  .use(
    createI18n({
      legacy: false,
      locale: 'fr',
      fallbackLocale: 'fr',
      messages: {
        fr: french,
      },
    }),
  )
  .mount('#app')
