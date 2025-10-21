<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { onBeforeMount } from 'vue'
import axios from 'axios'
import { storeToRefs } from 'pinia'

const { checkAuth } = useAuthStore()
const { user } = storeToRefs(useAuthStore())

onBeforeMount(async () => {
  await checkAuth()

  axios.interceptors.request.use(function (config) {
    config.headers.set('Content-Type', 'application/json')
    config.headers.set('Authorization', `Bearer ${user.value?.access_token}`)
    return config
  })
})
</script>
<template>
  <RouterView />
</template>
