import config from '@/config.js';

const AuthService = {
  login() {
    // Redirige vers le backend Flask pour déclencher le flow OIDC
    window.location.href = `${config.api.baseURL}/auth/login`;
  },

  logout() {
    // Déclenche la déconnexion via le backend
    window.location.href = `${config.api.baseURL}/auth/logout`;
  },

  async getUser() {
    try {
      const response = await fetch(`${config.api.baseURL}/auth/user-info`, {
        method: 'GET',
        credentials: 'include', // Important pour envoyer les cookies de session
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        // Loguer le status et le texte de réponse pour plus de détails
        const text = await response.text();
        console.error('Fetch non ok:', response.status, text);
        throw new Error('Erreur lors de la récupération des informations utilisateur');
      }

      const data = await response.json();
      return data && !data.error ? data : null;

    } catch (error) {
      // Loguer l'erreur complète pour debugger
      console.error('Erreur dans getUser (détail complet):', error);
      return null;
    }
  },


  async isAuthenticated() {
    const user = await this.getUser();
    return !!user;
  }
};

export default AuthService;
