<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const { login, checkAuth } = useAuthStore()
const { user } = storeToRefs(useAuthStore())
const router = useRouter()
const route = useRoute()

// Le portail de connexion peut être injoignable (réseau du téléphone) :
// sans retour visuel, on croit que le bouton ne marche pas.
const connecting = ref(false)
const loginError = ref(route.query.erreur === 'connexion')

async function onLogin() {
  connecting.value = true
  loginError.value = false
  try {
    await login(route.fullPath)
  } catch (e) {
    console.error('Connexion impossible', e)
    loginError.value = true
    connecting.value = false
  }
}

onMounted(async () => {
  await checkAuth()
  if (user.value) {
    router.replace({ name: 'accueil' })
  }
})
</script>

<template>
  <main class="fixed top-0 left-0 h-full w-full flex flex-col items-center justify-center gap-8 p-8">
    <h1 class="text-4xl font-bold text-center">{{ $t('app.title') }}</h1>
    <p class="text-gray-500 text-center max-w-sm">{{ $t('app.description') }}</p>
    <PrimaryButton class="text-lg px-8 py-4" :disabled="connecting" @click="onLogin">
      {{ connecting ? $t('auth.loggingIn') : $t('auth.login') }}
    </PrimaryButton>
    <p v-if="loginError" class="text-red-600 text-center max-w-sm">{{ $t('auth.loginFailed') }}</p>
  </main>
</template>
