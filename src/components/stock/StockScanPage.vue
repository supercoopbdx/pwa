<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import BarcodeScanPage from '@/components/barcode/BarcodeScanPage.vue'

const router = useRouter()

function decode(barcode: string) {
  router.push({ name: 'stock-form', query: { barcode } })
}
</script>

<template>
  <BarcodeScanPage
    :title="$t('stock.scan.title')"
    :icon="ClipboardDocumentCheckIcon"
    :back-route="{ name: 'stock-list' }"
    :manual-input="true"
    @scan="decode($event)"
  />
</template>
