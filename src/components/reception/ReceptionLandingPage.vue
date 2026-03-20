<script setup lang="ts">
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { TruckIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <PageLayout :title="$t('reception.home.title')" :icon="TruckIcon">
    <div class="text-center">
      <div class="mb-10">
        <p class="">{{ $t('reception.home.instructions') }}</p>
      </div>

      <RouterLink :to="{ name: 'reception-orders' }">
        <PrimaryButton class="mt-6">
          {{ $t('reception.home.start') }}
        </PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
