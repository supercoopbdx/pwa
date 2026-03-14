<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import axios from 'axios'
import config from '@/config.ts'

const props = defineProps<{
  path: string
  imgClass?: string
}>()

const src = ref('/image-not-found-icon.svg')
let objectUrl: string | null = null

async function loadImage(path: string) {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl)
    objectUrl = null
  }

  if (!path) {
    src.value = '/image-not-found-icon.svg'
    return
  }

  try {
    const response = await axios.get(`${config.backend.baseURL}${path}`, {
      responseType: 'blob',
    })
    objectUrl = URL.createObjectURL(response.data)
    src.value = objectUrl
  } catch {
    src.value = '/image-not-found-icon.svg'
  }
}

watch(() => props.path, loadImage)
onMounted(() => loadImage(props.path))
onUnmounted(() => {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
})
</script>

<template>
  <img :src="src" :class="imgClass" />
</template>
