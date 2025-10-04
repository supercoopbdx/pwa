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

  if (to.name === 'login-callback') {
    next(await loginCallback())
    return
  }

  if (!to.meta.requiresAuth) {
    next()
    return
  }

  await checkAuth()
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) {
    login(to.fullPath)
    return false
  }

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
