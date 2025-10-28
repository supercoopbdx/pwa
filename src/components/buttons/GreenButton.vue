<script setup lang="ts">
import ButtonBase from '@/components/buttons/ButtonBase.vue'
</script>

<template>
  <ButtonBase class="bg-green-600 text-white hover:bg-green-800">
    <slot />
  </ButtonBase>
</template>
