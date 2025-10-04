import StockLandingPage from '@/components/stock/StockLandingPage.vue'
import StockListPage from '@/components/stock/StockListPage.vue'
import StockScanPage from '@/components/stock/StockScanPage.vue'
import StockFormPage from '@/components/stock/StockFormPage.vue'
import StockSendPage from '@/components/stock/StockSendPage.vue'
import HomePage from '@/components/HomePage.vue'
import LoginCallbackPage from '@/components/auth/LoginCallbackPage.vue'
import NotFound from '@/components/NotFound.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/login_callback',
    name: 'login-callback',
    component: LoginCallbackPage,
  },
  {
    path: '/stock',
    name: 'stock-landing',
    component: StockLandingPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/stock/list',
    name: 'stock-list',
    component: StockListPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/stock/scan',
    name: 'stock-scan',
    component: StockScanPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/form',
    name: 'stock-form',
    component: StockFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/send',
    name: 'stock-send',
    component: StockSendPage,
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
]
