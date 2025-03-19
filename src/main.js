import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Home from './components/Home.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createI18n } from 'vue-i18n'
import fr from './lang/fr.js'

createApp(App)
  .use(createI18n({
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: { fr }
  }))
  .use(createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: Home }
    ]
  }))
  .mount('#app')
