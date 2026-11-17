import { ref } from 'vue'
import { defineStore } from 'pinia'
import { User, UserManager } from 'oidc-client-ts'
import config from '@/config.ts'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const router = useRouter()
  const userManager = new UserManager({
    authority: config.oidc.authority,
    client_id: config.oidc.client_id,
    client_secret: config.oidc.client_secret,
    redirect_uri: `${window.location.origin}${router.resolve({name: 'login-callback'}).fullPath}`,
    response_type: 'code',
    scope: config.oidc.scope,
    post_logout_redirect_uri: `${window.location.origin}/`,
    silent_redirect_uri: window.location.origin + '/silent-renew.html',
    automaticSilentRenew: true,
    loadUserInfo: true,
  })

  async function checkAuth() {
    user.value = await userManager.getUser()
  }

  function login(redirectAfterLogin: string) {
    sessionStorage.setItem('redirectAfterLogin', redirectAfterLogin)
    return userManager.signinRedirect({
      nonce: Math.random().toString().substring(2),
    })
  }

  async function loginCallback(): Promise<string> {
    try {
      await userManager.signinCallback()
    } catch (e) {
      // Code déjà utilisé : l'app installée a été rouverte sur /login_callback
      // (Android reprend la dernière page). Sans ce rattrapage : page blanche.
      console.warn('Retour de connexion invalide, retour à l\'accueil', e)
    }
    user.value = await userManager.getUser()
    if (!user.value) return '/'
    const target = sessionStorage.getItem('redirectAfterLogin') ?? '/accueil'
    sessionStorage.removeItem('redirectAfterLogin')
    return target
  }

  async function logout() {
    await userManager.signoutRedirect()
    user.value = await userManager.getUser()
  }

  return {
    user,
    checkAuth,
    login,
    loginCallback,
    logout,
  }
})
