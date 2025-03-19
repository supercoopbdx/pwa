import './style.css'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import fr from './lang/fr.js'
import App from './App.vue'
import Home from './components/Home.vue'
import List from './components/List.vue'
import Scanner from './components/Scanner.vue'
import BarcodeForm from './components/BarcodeForm.vue'

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
      { path: '/scan', component: Scanner },
      { path: '/form', component: BarcodeForm },
    ]
  }))
  .mount('#app')
