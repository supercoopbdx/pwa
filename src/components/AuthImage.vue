<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useImageCache } from '@/composables/useImageCache.ts'

const props = defineProps<{
  path: string
  imgClass?: string
}>()

const { fetchImage } = useImageCache()
const src = ref('/image-not-found-icon.svg')

async function loadImage(path: string) {
  src.value = await fetchImage(path)
}

watch(() => props.path, loadImage)
onMounted(() => loadImage(props.path))
</script>

<template>
  <img :src="src" :class="imgClass" />
</template>
