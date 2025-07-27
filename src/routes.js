import HomePage from './components/HomePage.vue'
import ListPage from './components/ListPage.vue'
import ScanPage from './components/ScanPage.vue'
import FormPage from './components/FormPage.vue'
import SendPage from './components/SendPage.vue'

export default [
  { 
    path: '/', 
    name: 'home',
    component: HomePage,
    meta: { requiresAuth: false }
  },
  { 
    path: '/list', 
    component: ListPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/scan', 
    component: ScanPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/form', 
    component: FormPage,
    meta: { requiresAuth: true }
  },
  { 
    path: '/send', 
    component: SendPage,
    meta: { requiresAuth: true }
  },
  // Redirection pour les routes inconnues vers la page d'accueil
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]
