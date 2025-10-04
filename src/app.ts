import '@/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from '@/components/App.vue'
import routes from '@/routes'
import french from '@/lang/fr.json'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { checkAuth, login, loginCallback } = useAuthStore()

  // this route is a callback from auth portal with authorization code
  if (to.name === 'login-callback') {
    // we get the token and user from auth portal
    next(await loginCallback())
    return
  }

  // these routes are public, no auth required
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // other routes needs to be authenticated, so we check auth
  await checkAuth()
  const { isAuthenticated } = useAuthStore()

  // if no auth, then login
  if (!isAuthenticated) {
    login(to.fullPath)
    return false
  }

  // otherwise it's ok
  next()
})
createApp(App)
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
  .use(createPinia())
  .use(router)
  .mount('#app')
