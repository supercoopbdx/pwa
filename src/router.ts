import StockLandingPage from '@/components/stock/StockLandingPage.vue'
import StockListPage from '@/components/stock/StockListPage.vue'
import StockScanPage from '@/components/stock/StockScanPage.vue'
import StockFormPage from '@/components/stock/StockFormPage.vue'
import StockSendPage from '@/components/stock/StockSendPage.vue'
import HomePage from '@/components/HomePage.vue'
import LoginCallbackPage from '@/components/LoginCallbackPage.vue'
import NotFound from '@/components/NotFound.vue'
import InboundLandingPage from '@/components/inbound/InboundLandingPage.vue'
import InboundOrdersPage from '@/components/inbound/InboundOrdersPage.vue'
import InboundProductsPage from '@/components/inbound/InboundProductsPage.vue'
import InboundScanPage from '@/components/inbound/InboundScanPage.vue'
import InboundFormPage from '@/components/inbound/InboundFormPage.vue'
import InboundSendPage from '@/components/inbound/InboundSendPage.vue'

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
    path: '/stock/list/',
    name: 'stock-list',
    component: StockListPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/stock/scan',
    name: 'stock-scan',
    component: StockScanPage,
    // meta: { requiresAuth: true },
  },
  {
    path: '/stock/form',
    name: 'stock-form',
    component: StockFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/stock/send',
    name: 'stock-send',
    component: StockSendPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/inbound',
    name: 'inbound-landing',
    component: InboundLandingPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/inbound/orders',
    name: 'inbound-orders',
    component: InboundOrdersPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/inbound/orders/:po/products',
    name: 'inbound-products',
    component: InboundProductsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/inbound/orders/:po/products/scan',
    name: 'inbound-scan',
    component: InboundScanPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/inbound/orders/:po/products/:barcode',
    name: 'inbound-form',
    component: InboundFormPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/inbound/orders/:po/send',
    name: 'inbound-send',
    component: InboundSendPage,
    meta: { requiresAuth: true },
  },
  { path: '/:pathMatch(.*)*', component: NotFound },
]
