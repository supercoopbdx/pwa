import '@/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from '@/components/App.vue'
import routes from '@/routes'
import french from '@/lang/fr.json'
import { authService } from '@/auth/authService';
import { useAuth } from '@/composables/useAuth.ts'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  console.log('before each', to, from, next)
  if (to.name === 'login-callback') {
    console.log('redirect callback')
    await authService.signinRedirectCallback()
    next('/')
  } else if (to.meta.requiresAuth && !useAuth().isAuthenticated) {
    useAuth().login()
  } else {
    next()
  }
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
