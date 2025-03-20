import './style.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import fr from './lang/fr.js'
import App from './App.vue'
import Home from './components/Home.vue'
import List from './components/List.vue'
import Scan from './components/Scan.vue'
import Form from './components/Form.vue'
import Send from './components/Send.vue'

createApp(App)
  .use(createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: { fr }
  }))
  .use(createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', component: Home },
      { path: '/list', component: List },
      { path: '/scan', component: Scan },
      { path: '/form', component: Form },
      { path: '/send', component: Send },
    ]
  }))
  .mount('#app')
