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
      <div class="md:block hidden">
        <slot name="actions" />
      </div>
      <div class="md:hidden">
        <button @click="$emit('toggleAuth')" class="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5.121 17.804A12.066 12.066 0 0112 15c2.485 0 4.785.75 6.879 2.04M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Contenu -->
    <div class="text-left md:text-center">
      <slot />
    </div>
  </main>
</template>
