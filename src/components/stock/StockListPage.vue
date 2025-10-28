<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import RedButton from '@/components/buttons/RedButton.vue'
import { useStockStore } from '@/stores/stock'
import { ClipboardDocumentCheckIcon, QrCodeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

const router = useRouter()
const stockStore = useStockStore()
const { t } = useI18n()

const { products } = storeToRefs(stockStore)

if (!stockStore.zone) {
  // if zone is not set, we go back to landing page
  router.push({ name: 'stock-landing' })
}

function removeItem(barcode: string) {
  stockStore.removeProduct(barcode)
}

function reset() {
  if (confirm(t('stock.list.reset'))) {
    stockStore.reset()
  }
}
</script>

<template>
  <PageLayout
    :title="$t('stock.list.title', { zone: stockStore.zone })"
    :icon="ClipboardDocumentCheckIcon"
  >
    <div class="flex justify-center mb-5">
      <RouterLink :to="{ name: 'stock-scan' }">
        <PrimaryButton class="text-2xl px-10 py-5">
          {{ $t('stock.button.start') }}
        </PrimaryButton>
      </RouterLink>
    </div>

    <div v-if="!products.size" class="text-center text-gray-500 my-5">
      {{ $t('stock.list.empty') }}
    </div>

    <ul class="divide-y divide-gray-200 mx-auto flex flex-col gap-2">
      <li v-for="[barcode, product] in products" :key="barcode" class="pb-2">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="shrink-0">
            <img
              class="w-15 h-15 rounded-lg"
              :src="product.found ? `${product.image}` : '/image-not-found-icon.svg'"
              alt="product image" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 text-clip">
              {{ product.name ?? $t('stock.form.errors.product_not_found') }}
            </p>
            <p class="text-sm text-gray-500">
              <QrCodeIcon class="h-5 inline align-text-bottom" />
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

    <!-- Boutons fixes en bas -->
    <template #footer>
      <SecondaryButton @click="$router.push({ name: 'stock-landing' })">
        {{ $t('stock.button.back') }}
      </SecondaryButton>
      <div class="flex gap-4">
        <RedButton @click="reset()" :disabled="!products.size">{{ $t('stock.button.reset') }}</RedButton>
        <PrimaryButton @click="$router.push({ name: 'stock-send' })" :disabled="!products.size">
          {{ $t('stock.button.finish') }}
        </PrimaryButton>
      </div>
    </template>
  </PageLayout>
</template>
