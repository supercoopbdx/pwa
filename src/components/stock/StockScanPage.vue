<script setup lang="ts">
import { ref } from 'vue'
import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const loading = ref(true)
const router = useRouter()

function decode(barcode: string) {
  router.push({ name: 'stock-form', query: { barcode } })
}
</script>

<template>
  <PageLayout :title="$t('stock.scan.title')">
    <div v-if="loading">
      <img alt="Barcode" class="max-w-md m-auto" src="/barcode_scan.svg" />
      <h3 class="text-center">{{ $t('stock.scan.loading') }}</h3>
    </div>

    <StreamBarcodeReader
      torch
      no-front-cameras
      class="bg-gray-300 max-w-md"
      @decode="decode"
      @loaded="loading = false"
    />
    <template #footer>
      <RouterLink :to="{ name: 'stock-list' }">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
      <div class="flex">
        <RouterLink :to="{name: 'stock-form'}" class="m-auto">
          <PrimaryButton class="text-sm">{{ $t('stock.button.manual_input') }}</PrimaryButton>
        </RouterLink>
      </div>
    </template>
  </PageLayout>
</template>
