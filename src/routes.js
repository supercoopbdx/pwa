import HomePage from './components/HomePage.vue'
import ListPage from './components/ListPage.vue'
import ScanPage from './components/ScanPage.vue'
import FormPage from './components/FormPage.vue'
import SendPage from './components/SendPage.vue'

export default [
  { path: '/', component: HomePage },
  { path: '/list', component: ListPage },
  { path: '/scan', component: ScanPage },
  { path: '/form', component: FormPage },
  { path: '/send', component: SendPage },
]
