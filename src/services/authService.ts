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
  /**
   * Initiates a redirect-based sign-in process for the user.
   * It uses a nonce for additional security during the sign-in process.
   *
   * @return {Promise<void>} A promise that resolves once the redirect process has started successfully.
   */
  async signinRedirect() {
    return userManager.signinRedirect({
      nonce: Math.random().toString().substring(2)
    });
  },

  /**
   * Handles the callback after a user signs in through a redirect flow.
   * Processes the response from the identity provider and returns the authenticated user.
   *
   * @return {Promise<Object>} A promise that resolves with the authenticated user's information.
   */
  async signinRedirectCallback() {
    return userManager.signinRedirectCallback();
  },

  /**
   * Signs out the current user by redirecting them to the appropriate sign-out endpoint.
   *
   * This method initiates the sign-out process and navigates the user to the sign-out redirect URL configured
   * in the user manager.
   *
   * @return {Promise<void>} A promise that resolves when the sign-out redirection is successfully initiated.
   */
  async signoutRedirect() {
    return userManager.signoutRedirect();
  },

  /**
   * Fetches the user information from the user manager.
   *
   * @return {Promise<User | null>} A promise that resolves to the user object if found, otherwise null.
   */
  async getUser(): Promise<User | null> {
    return userManager.getUser();
  },
};
