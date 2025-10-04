<template>
  <button
    :type="type || 'button'"
    class="font-bold py-2 px-4 rounded cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'button' // évite que ce soit "submit" par défaut
  }
})
</script>
