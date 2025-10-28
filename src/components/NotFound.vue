<script setup lang="ts">
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
</script>

<template>
  <PageLayout :title="$t('app.pagenotfound')">
    <div class="w-full text-center">
      <p class="mb-5">Il n'y a rien ici...</p>
      <RouterLink :to="{ name: 'home' }">
        <PrimaryButton>{{ $t('menu.home') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
