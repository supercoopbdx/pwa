<script setup lang="ts">
import { ref } from 'vue'
import ButtonBase from '@/components/buttons/ButtonBase.vue'

const baseRef = ref<InstanceType<typeof ButtonBase> | null>(null)
defineExpose({ focus: () => baseRef.value?.focus() })
</script>

<template>
  <ButtonBase ref="baseRef" class="bg-blue-500 text-white hover:bg-blue-700">
    <slot />
  </ButtonBase>
</template>
