<script setup lang="ts">
import PageLayout from '@/layout/PageLayout.vue'
</script>

<template>
  <PageLayout :title="$t('app.title')">
    <p>{{ $t('app.description') }}</p>
  </PageLayout>
</template>
