<script setup lang="ts">
import ButtonBase from '@/components/buttons/ButtonBase.vue'
</script>

<template>
  <ButtonBase class="text-red-500 font-semibold hover:bg-red-500 hover:text-white">
    <slot />
  </ButtonBase>
</template>
