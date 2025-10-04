import '@/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from '@/components/App.vue'
import routes from '@/routes'
import french from '@/lang/fr.json'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

createApp(App)
  .use(createPinia())
  .use(router)
  .use(
    createI18n({
      locale: 'fr',
      fallbackLocale: 'fr',
      messages: {
        fr: french,
      },
    }),
  )
  .mount('#app')
