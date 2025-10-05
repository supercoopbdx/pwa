<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import CancelButton from '@/components/buttons/CancelButton.vue'
import { useStockStore } from '@/stores/stock'
import { QrCodeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

const router = useRouter()
const stockStore = useStockStore()
const { t } = useI18n()

const { products } = storeToRefs(stockStore)

if (!stockStore.zone) {
  router.push({ name: 'stock-landing' })
}

function removeItem(barcode: string) {
  stockStore.removeProduct(barcode)
}

function back() {
  router.push({ name: 'stock-landing' })
}

function reset() {
  if (confirm(t('stock.list.reset'))) {
    stockStore.reset()
  }
}

function send() {
  router.push({ name: 'stock-send' })
}
</script>

<template>
  <PageLayout :title="$t('stock.list.title', { zone: stockStore.zone })">
    <div class="flex flex-col h-full">
      <div class="flex justify-center max-w-screen mb-5">
        <RouterLink :to="{ name: 'stock-scan' }">
          <PrimaryButton class="text-2xl px-10 py-5">
            {{ $t('stock.button.start') }}
          </PrimaryButton>
        </RouterLink>
      </div>

      <div v-if="!products.size" class="text-center text-gray-500">
        {{ $t('stock.list.empty') }}
      </div>

      <ul class="max-w-lg divide-y divide-gray-200 mx-auto">
        <li v-for="product in products.values()" :key="product.barcode" class="pb-3 sm:pb-4">
          <div class="flex items-center space-x-4 rtl:space-x-reverse">
            <div class="shrink-0">
              <img
                class="w-15 h-15 rounded-lg"
                :src="product.found ? `${product.image}` : '/image-not-found-icon.svg'"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 text-clip">
                {{ product.name ?? $t('stock.form.errors.product_not_found') }}
              </p>
              <p class="text-sm text-gray-500">
                <QrCodeIcon src="/barcode_scan.svg" alt="barcode" class="h-6 inline align-middle" />
                {{ product.barcode }}
              </p>
            </div>
            <div class="inline-flex items-center text-base font-semibold text-gray-900">
              {{ product.quantity }}
            </div>

            <PrimaryButton @click="removeItem(product.barcode)">
              <TrashIcon class="w-7 h-7"></TrashIcon>
            </PrimaryButton>
          </div>
        </li>
      </ul>
    </div>

    <!-- Boutons fixes en bas -->
    <template #footer>
      <SecondaryButton @click="back()">{{ $t('stock.button.back') }}</SecondaryButton>
      <div class="flex gap-4">
        <CancelButton @click="reset()">{{ $t('stock.button.reset') }}</CancelButton>
        <PrimaryButton @click="send()" :disabled="!products.size">
          {{ $t('stock.button.finish') }}
        </PrimaryButton>
      </div>
    </template>
  </PageLayout>
</template>
