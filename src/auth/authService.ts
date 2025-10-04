import { UserManager, User } from 'oidc-client-ts';
import config from '@/config.ts'

const userManager = new UserManager({
    authority: config.oidc.authority,
    client_id: config.oidc.client_id,
    client_secret: config.oidc.client_secret,
    redirect_uri: `${window.location.origin}/login_callback`,
    response_type: 'code',
    scope: config.oidc.scope,
    post_logout_redirect_uri: `${window.location.origin}/`,
    silent_redirect_uri: window.location.origin + '/silent-renew.html',
    automaticSilentRenew: true,
    loadUserInfo: true,
  }
);

export const authService = {
  async signinRedirect() {
    return userManager.signinRedirect({
      nonce: Math.random().toString().substring(2)
    });
  },

  async signinRedirectCallback() {
    return userManager.signinRedirectCallback();
  },

  async signoutRedirect() {
    return userManager.signoutRedirect();
  },

  async getUser(): Promise<User | null> {
    return userManager.getUser();
  },

  async signinSilent() {
    return userManager.signinSilent();
  },

  async signinSilentCallback() {
    return userManager.signinSilentCallback();
  },
};
