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
      console.log('Début de initialize, isInitialized =', this.isInitialized);
      
      if (!this.isInitialized) {
        try {
          const user = await this.fetchUser();
          console.log('fetchUser réussi dans initialize, user =', user);
        } catch (error) {
          console.error('Erreur dans initialize lors de fetchUser:', error, error.stack);
        } finally {
          this.isInitialized = true;
          console.log('initialize terminé, isInitialized =', this.isInitialized);
        }
      } else {
        console.log('initialize ignoré car déjà initialisé');
      }
    },

    async fetchUser() {
      console.log('Début de fetchUser'); // log au début
      try {
        const user = await AuthService.getUser();
        console.log('Résultat de getUser:', user); // log après récupération
        this.user = user;
        return user;
      } catch (error) {
        this.user = null;
        console.error('Erreur dans fetchUser:', error, error.stack); // log complet de l'erreur
        throw error; // on relance pour que l'appelant sache qu'il y a eu un problème
      } finally {
        console.log('fetchUser terminé'); // log dans tous les cas
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
