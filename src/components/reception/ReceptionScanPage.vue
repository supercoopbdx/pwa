<script setup lang="ts">
import { useRouter } from 'vue-router'
import { TruckIcon } from '@heroicons/vue/24/outline'
import BarcodeScanPage from '@/components/barcode/BarcodeScanPage.vue'

const router = useRouter()

function decode(barcode: string) {
  router.push({ name: 'reception-form', params: { barcode } })
}
</script>

<template>
  <BarcodeScanPage
    :title="$t('stock.scan.title')"
    :icon="TruckIcon"
    :back-route="{ name: 'reception-products' }"
    :manual-input="true"
    @scan="decode($event)"
  />
</template>
