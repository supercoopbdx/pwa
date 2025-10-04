import config from '@/config'

import { UserManager, WebStorageStateStore } from 'oidc-client-ts'

const userManager = new UserManager({
  authority: 'https://auth.supercoop.fr',
  client_id: '1buOEbmriZJcLbYcmh4nSbXF',
  redirect_uri: `${window.location.origin}/login`,
  response_type: 'code', // Use 'code' for PKCE
  scope: 'openid profile email',
  post_logout_redirect_uri: `${window.location.origin}`,
  silent_redirect_uri: `${window.location.origin}/silent-renew.html`,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  // Ensure the library generates a nonce
  includeIdTokenInSilentRenew: true,
})

const AuthService = {
  login() {
    return userManager.signinRedirect({
      extraQueryParams: {
        nonce: Math.random(),
      },
    })
  },
  async handleCallback() {
    return userManager.signinRedirectCallback()
  },
  async getUser() {
    return userManager.getUser()
  },

  logout() {
    // Déclenche la déconnexion via le backend
    window.location.href = `${config.backend.baseURL}/auth/logout`
  },

  async isAuthenticated() {
    const user = await this.getUser()
    return !!user
  },
}

export default AuthService
