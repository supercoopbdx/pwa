<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'

const { checkAuth } = useAuthStore()

onBeforeMount(async () => {
  await checkAuth()
})
</script>

<template>
  <RouterView />
</template>
