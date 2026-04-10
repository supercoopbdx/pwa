<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const { login, checkAuth } = useAuthStore()
const { user } = storeToRefs(useAuthStore())
const router = useRouter()

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
    <PrimaryButton class="text-lg px-8 py-4" @click="login($route.fullPath)">
      {{ $t('auth.login') }}
    </PrimaryButton>
  </main>
</template>
