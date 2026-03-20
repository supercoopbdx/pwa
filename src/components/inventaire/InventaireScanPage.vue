<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import BarcodeScanPage from '@/components/barcode/BarcodeScanPage.vue'

const router = useRouter()

function decode(barcode: string) {
  router.push({ name: 'inventaire-form', query: { barcode } })
}
</script>

<template>
  <BarcodeScanPage
    :title="$t('inventaire.scan.title')"
    :icon="ClipboardDocumentCheckIcon"
    :back-route="{ name: 'inventaire-liste' }"
    :manual-input="true"
    @scan="decode($event)"
  />
</template>
