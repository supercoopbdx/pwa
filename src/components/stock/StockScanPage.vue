<script setup lang="ts">
import { ref } from 'vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import BarcodeScanner from '@/components/barcode/BarcodeScanner.vue'

const loading = ref(true)
const router = useRouter()

function decode(barcode: string) {
  alert(`scanned ${barcode}`)
  router.push({ name: 'stock-form', query: { barcode } })
}

function error(error: Error) {
  alert(error)
}
</script>

<template>
  <PageLayout :title="$t('stock.scan.title')" :icon="ClipboardDocumentCheckIcon">
    <div v-if="loading">
      <img alt="Barcode" src="/barcode_scan.svg" />
      <h3 class="text-center">{{ $t('stock.scan.loading') }}</h3>
    </div>
    <BarcodeScanner
      v-show="!loading"
      @loaded="loading = false"
      @scan="decode($event)"
      @error="error($event)"
    />
    <template #footer>
      <RouterLink :to="{ name: 'stock-list' }">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
      <div class="flex">
        <RouterLink :to="{ name: 'stock-form' }" class="m-auto">
          <PrimaryButton class="text-sm">{{ $t('stock.button.manual_input') }}</PrimaryButton>
        </RouterLink>
      </div>
    </template>
  </PageLayout>
</template>
