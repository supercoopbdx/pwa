<template>
  <button
    ref="btnRef"
    :type="type || 'button'"
    class="font-bold p-3 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  type: {
    type: String,
    default: 'button' // évite que ce soit "submit" par défaut
  }
})

const btnRef = ref<HTMLButtonElement | null>(null)
defineExpose({ focus: () => btnRef.value?.focus() })
</script>
