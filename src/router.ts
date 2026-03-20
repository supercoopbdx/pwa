import StockLandingPage from '@/components/stock/StockLandingPage.vue'
import StockListPage from '@/components/stock/StockListPage.vue'
import StockScanPage from '@/components/stock/StockScanPage.vue'
import StockFormPage from '@/components/stock/StockFormPage.vue'
import StockSendPage from '@/components/stock/StockSendPage.vue'
import HomePage from '@/components/HomePage.vue'
import LoginCallbackPage from '@/components/LoginCallbackPage.vue'
import NotFound from '@/components/NotFound.vue'
import ReceptionLandingPage from '@/components/reception/ReceptionLandingPage.vue'
import ReceptionCommandesPage from '@/components/reception/ReceptionCommandesPage.vue'
import ReceptionProductsPage from '@/components/reception/ReceptionProductsPage.vue'
import ReceptionScanPage from '@/components/reception/ReceptionScanPage.vue'
import ReceptionFormPage from '@/components/reception/ReceptionFormPage.vue'
import ReceptionSendPage from '@/components/reception/ReceptionSendPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.ts'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      meta: { requiresAuth: true },
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
      path: '/reception',
      name: 'reception-landing',
      component: ReceptionLandingPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/reception/commandes',
      name: 'reception-commandes',
      component: ReceptionCommandesPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/reception/commandes/:po/products',
      name: 'reception-products',
      component: ReceptionProductsPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/reception/commandes/:po/products/scan',
      name: 'reception-scan',
      component: ReceptionScanPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/reception/commandes/:po/products/:barcode',
      name: 'reception-form',
      component: ReceptionFormPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/reception/commandes/:po/send',
      name: 'reception-send',
      component: ReceptionSendPage,
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
})

router.beforeEach(async (to, _from, next) => {
  const { checkAuth, login, loginCallback } = useAuthStore()

  // this route is a callback from auth portal with authorization code
  if (to.name === 'login-callback') {
    // we get the token and user from auth portal
    next(await loginCallback())
    return
  }

  // these routes are public, no auth required
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // other routes needs to be authenticated, if no auth, then login
  await checkAuth()
  const { user } = useAuthStore()
  console.log('auth required', user)
  if (!user) {
    await login(to.fullPath)
    return false
  }

  // otherwise it's ok
  next()
})

export default router
