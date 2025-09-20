<script lang="ts" setup>
import PageTitle from '@/components/titles/PageTitle.vue'

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

      <!-- Desktop: texte AuthButtons, Mobile: icône -->
      <div>
        <AuthButtons />
      </div>
    </div>

    <!-- Contenu -->
    <div class="text-left md:text-center">
      <slot />
    </div>
  </main>
</template>
