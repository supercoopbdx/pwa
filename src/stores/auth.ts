import { computed, onMounted, ref } from 'vue'
import { authService } from '@/services/authService.ts'
import { User } from 'oidc-client-ts'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const route = useRoute()

  function login(redirectAfterLogin?: string) {
    if (!redirectAfterLogin) redirectAfterLogin = computed(() => route).value.fullPath

    sessionStorage.setItem('redirectAfterLogin', redirectAfterLogin)
    return authService.signinRedirect()
  }

  async function loginCallback(): Promise<string> {
    await authService.signinRedirectCallback()
    await checkAuth()
    return sessionStorage.getItem('redirectAfterLogin') ?? '/'
  }

  async function logout() {
    await authService.signoutRedirect()
    await checkAuth()
  }

  async function checkAuth() {
    user.value = await authService.getUser()
    isAuthenticated.value = !!user.value
  }

  onMounted(async () => {
    await checkAuth()
  })

  return {
    user,
    isAuthenticated,
    checkAuth,
    login,
    loginCallback,
    logout,
  }
})
