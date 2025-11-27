<script setup lang="ts">
import ButtonBase from '@/components/buttons/ButtonBase.vue'
</script>

<template>
  <ButtonBase class="hover:text-red-500 hover:bg-red-200 font-semibold bg-red-500 text-white">
    <slot />
  </ButtonBase>
</template>
