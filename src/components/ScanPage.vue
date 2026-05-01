<script setup lang="ts">
import { ref } from 'vue'
import { QrCodeIcon } from '@heroicons/vue/24/outline'
import BarcodeScanPage from '@/components/barcode/BarcodeScanPage.vue'
import PageLayout from '@/layout/PageLayout.vue'
import AuthImage from '@/components/AuthImage.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import axios from 'axios'
import config from '@/config.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

type ProductInfo = {
  found: boolean
  barcode: string
  name?: string
  brand?: string
  image_url?: string
  qty_available?: number
  uom_label?: string
  lst_price?: number
}

const scanning = ref(true)
const loading = ref(false)
const product = ref<ProductInfo | null>(null)
const notFound = ref(false)

async function onScan(barcode: string) {
  scanning.value = false
  loading.value = true
  notFound.value = false
  product.value = null

  try {
    const response = await axios.get(`${config.backend.baseURL}/product/info?barcode=${barcode}`)
    product.value = response.data
    notFound.value = !response.data.found
  } catch {
    product.value = { found: false, barcode }
    notFound.value = true
  } finally {
    loading.value = false
  }
}

function scanAgain() {
  product.value = null
  notFound.value = false
  scanning.value = true
}
</script>

<template>
  <BarcodeScanPage
    v-if="scanning"
    :title="$t('scan.title')"
    :icon="QrCodeIcon"
    :back-route="{ name: 'home' }"
    :manual-input="true"
    @scan="onScan($event)"
  />

  <PageLayout v-else :title="$t('scan.title')" :icon="QrCodeIcon">
    <div v-if="loading" class="text-center text-gray-500 mt-8">
      {{ $t('scan.loading') }}
    </div>

    <div v-else-if="notFound" class="text-center mt-8 space-y-2">
      <p class="text-gray-400 text-sm font-mono">{{ product?.barcode }}</p>
      <p class="text-red-500 font-medium">{{ $t('scan.not_found') }}</p>
    </div>

    <div v-else-if="product" class="mt-4 space-y-4">
      <div class="flex items-center gap-4">
        <AuthImage :path="product.image_url ?? ''" img-class="w-20 h-20 rounded-xl shrink-0 object-cover" />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-gray-900 text-base leading-snug">{{ product.name }}</p>
          <p v-if="product.brand" class="text-sm text-gray-500 mt-0.5">{{ product.brand }}</p>
          <p class="text-xs text-gray-400 font-mono mt-1">{{ product.barcode }}</p>
          <div class="flex gap-4 mt-2 text-sm">
            <span v-if="product.lst_price != null" class="font-semibold text-gray-900">
              {{ product.lst_price.toFixed(2) }} €
            </span>
            <span v-if="product.qty_available != null" class="text-gray-500">
              Stock : {{ product.qty_available }} {{ product.uom_label ?? '' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <SecondaryButton @click="scanAgain">{{ $t('scan.scan_again') }}</SecondaryButton>
    </template>
  </PageLayout>
</template>
