<script setup lang="ts">
import { ref } from 'vue'
import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useRouter } from 'vue-router'
import { TruckIcon } from '@heroicons/vue/24/outline'

const loading = ref(true)
const router = useRouter()

function decode(barcode: string) {
  router.push({ name: 'inbound-form', params: { barcode } })
}
</script>

<template>
  <PageLayout :title="$t('stock.scan.title')" :icon="TruckIcon">
    <div v-if="loading">
      <img alt="Barcode" src="/barcode_scan.svg" />
      <h3 class="text-center">{{ $t('stock.scan.loading') }}</h3>
    </div>

    <StreamBarcodeReader
      torch
      no-front-cameras
      class="bg-gray-300"
      @decode="decode"
      @loaded="loading = false"
    />
    <template #footer>
      <RouterLink :to="{ name: 'inbound-products' }">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
