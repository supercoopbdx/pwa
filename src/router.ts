import InventaireLandingPage from '@/components/inventaire/InventaireLandingPage.vue'
import InventaireListPage from '@/components/inventaire/InventaireListPage.vue'
import InventaireScanPage from '@/components/inventaire/InventaireScanPage.vue'
import InventaireFormPage from '@/components/inventaire/InventaireFormPage.vue'
import InventaireSendPage from '@/components/inventaire/InventaireSendPage.vue'
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
      path: '/inventaire',
      name: 'inventaire-landing',
      component: InventaireLandingPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventaire/list/',
      name: 'inventaire-liste',
      component: InventaireListPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventaire/scan',
      name: 'inventaire-scan',
      component: InventaireScanPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventaire/form',
      name: 'inventaire-form',
      component: InventaireFormPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventaire/send',
      name: 'inventaire-send',
      component: InventaireSendPage,
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
