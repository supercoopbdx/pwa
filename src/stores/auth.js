import { computed } from 'vue';
import { authService } from '@/services/authService.ts';
import { defineStore } from 'pinia';
import { useRoute } from 'vue-router';
export const useAuthStore = defineStore('auth', () => {
    const route = useRoute();
    function login(redirectAfterLogin) {
        if (!redirectAfterLogin)
            redirectAfterLogin = computed(() => route).value.fullPath;
        sessionStorage.setItem('redirectAfterLogin', redirectAfterLogin);
        return authService.signinRedirect();
    }
    async function loginCallback() {
        await authService.signinRedirectCallback();
        return sessionStorage.getItem('redirectAfterLogin') ?? '/';
    }
    async function logout() {
        await authService.signoutRedirect();
    }
    return {
        getUser: authService.getUser,
        login,
        loginCallback,
        logout,
    };
});
