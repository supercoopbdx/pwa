<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/AuthService'
import PageLayout from '@/layout/PageLayout.vue'

const router = useRouter()

onMounted(async () => {
  try {
    await authService.handleCallback()
    await router.push('/')
  } catch (error) {
    console.error('Error handling callback:', error)
    await router.push('/login')
  }
})
</script>

<template>
  <PageLayout :title="$t('stock.nav.home')">
    <p>HOME PAGE</p>
  </PageLayout>
  <div>Loading...</div>
</template>
