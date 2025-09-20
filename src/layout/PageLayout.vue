<script lang="ts" setup>
import PageTitle from '@/components/titles/PageTitle.vue'
import AuthButtons from '@/components/AuthButtons.vue'

const props = defineProps({
  title: { type: String, required: true },
})
const emit = defineEmits(['toggleAuth'])
</script>

<template>
  <main class="flex flex-col gap-6 px-4 md:px-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <PageTitle class="text-left md:text-center">{{ props.title }}</PageTitle>
      <AuthButtons />
    </div>

    <!-- Contenu -->
    <div class="text-left md:text-left">
      <slot />
    </div>
  </main>
</template>
