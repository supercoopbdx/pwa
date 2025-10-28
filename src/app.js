import '@/style.css';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { createPinia } from 'pinia';
import App from '@/components/App.vue';
import router from '@/router.ts';
import french from '@/lang/fr.json';
createApp(App)
    .use(createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'fr',
    messages: {
        fr: french,
    },
}))
    .use(createPinia())
    .use(router)
    .mount('#app');
