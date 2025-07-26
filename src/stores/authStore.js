import { defineStore } from 'pinia';
import AuthService from '@/services/AuthServices';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isInitialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async initialize() {
      if (!this.isInitialized) {
        try {
          await this.fetchUser();
        } finally {
          this.isInitialized = true;
        }
      }
    },

    async fetchUser() {
      try {
        const user = await AuthService.getUser();
        this.user = user;
        return user;
      } catch (error) {
        this.user = null;
        throw error;
      }
    },

    login() {
      return AuthService.login(); // redirection
    },

    async logout() {
      try {
        await AuthService.logout();
      } finally {
        this.user = null;
      }
    }
  },
  
  // Persist the auth state
  persist: true
});
