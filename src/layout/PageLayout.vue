<script lang="ts" setup>
import PageTitle from '@/components/titles/PageTitle.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <main class="flex flex-col text-center gap-6">
    <PageTitle>{{ props.title }}</PageTitle>
    <slot />
  </main>
</template>
