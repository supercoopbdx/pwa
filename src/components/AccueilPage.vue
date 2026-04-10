<script setup lang="ts">
import PageLayout from '@/layout/PageLayout.vue'
import { HomeIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/auth.ts'
import { storeToRefs } from 'pinia'

const { user } = storeToRefs(useAuthStore())
</script>

<template>
  <PageLayout :title="$t('accueil.title')" :icon="HomeIcon">
    <div class="flex flex-col items-center text-center gap-6 mt-8">
      <p class="text-xl font-semibold text-gray-800">
        {{ $t('accueil.welcome', { name: user?.profile.name }) }}
      </p>
      <p class="text-gray-500">
        {{ $t('accueil.message') }}
      </p>
    </div>
  </PageLayout>
</template>
