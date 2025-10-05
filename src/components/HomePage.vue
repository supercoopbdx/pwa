<script setup lang="ts">
import PageLayout from '@/layout/PageLayout.vue'
</script>

<template>
  <PageLayout :title="$t('app.title')">
    <p class="max-w-lg mx-auto">{{ $t('app.description') }}</p>
  </PageLayout>
</template>
