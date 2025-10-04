<script lang="ts" setup>
import PageTitle from '@/components/titles/PageTitle.vue'

const props = defineProps({
  title: { type: String, required: true },
})
</script>

<template>
  <main class="flex flex-col gap-6 px-4 md:px-8">
    <div class="flex justify-between items-center">
      <PageTitle class="text-left md:text-center">{{ props.title }}</PageTitle>
    </div>

    <div class="text-left md:text-left mt-10 mb-10">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-between items-center shadow-md"
    >
      <slot name="footer" />
    </div>
  </main>
</template>
