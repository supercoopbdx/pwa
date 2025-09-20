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
  <main class="flex flex-col gap-6 px-4 md:px-8">
    <!-- Header : titre + actions -->
    <div class="flex flex-col items-center gap-2 md:flex-row md:justify-between md:items-center">
      <PageTitle>{{ props.title }}</PageTitle>
      <div>
        <slot name="actions" />
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="text-left md:text-center">
      <slot />
    </div>
  </main>
</template>
