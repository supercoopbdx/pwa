import StockLandingPage from '@/components/stock/StockLandingPage.vue';
import StockListPage from '@/components/stock/StockListPage.vue';
import StockScanPage from '@/components/stock/StockScanPage.vue';
import StockFormPage from '@/components/stock/StockFormPage.vue';
import StockSendPage from '@/components/stock/StockSendPage.vue';
import HomePage from '@/components/HomePage.vue';
import LoginCallbackPage from '@/components/LoginCallbackPage.vue';
import NotFound from '@/components/NotFound.vue';
import InboundLandingPage from '@/components/inbound/InboundLandingPage.vue';
import InboundOrdersPage from '@/components/inbound/InboundOrdersPage.vue';
import InboundProductsPage from '@/components/inbound/InboundProductsPage.vue';
import InboundScanPage from '@/components/inbound/InboundScanPage.vue';
import InboundFormPage from '@/components/inbound/InboundFormPage.vue';
import InboundSendPage from '@/components/inbound/InboundSendPage.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authentication.ts';
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
    ],
});
router.beforeEach(async (to, _from, next) => {
    const { checkAuth, login, loginCallback } = useAuthStore();
    // this route is a callback from auth portal with authorization code
    if (to.name === 'login-callback') {
        // we get the token and user from auth portal
        next(await loginCallback());
        return;
    }
    // these routes are public, no auth required
    if (!to.meta.requiresAuth) {
        next();
        return;
    }
    // other routes needs to be authenticated, so we check auth
    await checkAuth();
    const { isAuthenticated } = useAuthStore();
    // if no auth, then login
    if (!isAuthenticated) {
        await login(to.fullPath);
        return false;
    }
    // otherwise it's ok
    next();
});
export default router;
