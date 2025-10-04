<script lang="ts" setup>
import PageLayout from '@/layout/PageLayout.vue'
</script>

<template>
  <PageLayout :title="$t('home.title')">
    <p>{{ $t('home.description') }}</p>
  </PageLayout>
</template>
