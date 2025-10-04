<script setup lang="ts">
import ButtonBase from '@/components/buttons/ButtonBase.vue'
</script>

<template>
  <ButtonBase class="text-blue-500 font-semibold hover:bg-blue-500 hover:text-white">
    <slot />
  </ButtonBase>
</template>
