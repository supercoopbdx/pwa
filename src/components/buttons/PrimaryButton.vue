<script setup lang="ts">
import ButtonBase from '@/components/buttons/ButtonBase.vue'
</script>

<template>
  <ButtonBase class="bg-blue-500 text-white hover:bg-blue-700">
    <slot />
  </ButtonBase>
</template>
