<script setup>
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { ref } from 'vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'

const loading = ref(true)
</script>

<template>
  <PageLayout :title="$t('nav.scan')">
    <div v-if="loading">
      <img alt="Barcode" class="max-w-md m-auto" src="/barcode_scan.svg" />
      <h3>{{ $t('scan.loading') }}</h3>
    </div>

    <StreamBarcodeReader
      class="bg-gray-300 max-w-md m-auto my-10"
      @decode="alert"
      @loaded="loading = false"
    />
    <RouterLink to="/list">
      <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
    </RouterLink>
  </PageLayout>
</template>
