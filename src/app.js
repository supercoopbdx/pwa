import '@/style.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from '@/components/App.vue'
import routes from '@/routes.js'
import messages from '@/i18n/messages.js'

createApp(App)
  .use(
    createI18n({
      legacy: false,
      locale: 'fr',
      fallbackLocale: 'fr',
      messages,
    }),
  )
  .use(
    createRouter({
      history: createWebHashHistory(),
      routes: routes,
    }),
  )
  .use(createPinia())
  .mount('#app')
