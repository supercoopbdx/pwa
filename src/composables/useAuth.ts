import { onMounted, ref } from 'vue'
import { authService } from '@/auth/authService'
import { User } from 'oidc-client-ts'

export function useAuth() {
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(false)

  function login() {
    authService.signinRedirect()
  }

  function logout() {
    authService.signoutRedirect()
  }

  async function checkAuth() {
    console.log('check auth')
    user.value = await authService.getUser()
    isAuthenticated.value = !!user.value
  }

  onMounted(() => {
    checkAuth()
  })

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
}
