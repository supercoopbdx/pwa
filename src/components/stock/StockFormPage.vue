<script setup lang="ts">
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/forms/FormInput.vue'
import { useStockStore } from '@/stores/stock'
import { useRoute, useRouter } from 'vue-router'
import { computed, Ref, ref, watch } from 'vue'
import FormLayout from '@/components/forms/FormLayout.vue'
import { storeToRefs } from 'pinia'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { ClipboardDocumentCheckIcon, QrCodeIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()

const barcode = ref((route.query.barcode as string) ?? null)
const quantity = ref(stockStore.products.get(barcode.value)?.quantity ?? 0)
const infos: Ref<StockProductInfo | undefined> = ref(undefined)
const { loading } = storeToRefs(stockStore)

const valid = computed(() => !errors.value.barcode && !errors.value.quantity)
const errors = computed(() => {
  return {
    barcode: !/^\d{13}$/.test(barcode.value),
    quantity: quantity.value.toString() === '' || quantity.value < 0,
  }
})

watch(
  barcode,
  async (newVal) => {
    console.log('newVal', newVal, errors.value)
    if (newVal && !errors.value.barcode) {
      infos.value = await stockStore.getProductInfo(barcode.value)
    } else {
      infos.value = undefined
    }
  },
  { immediate: true },
)

function submit() {
  if (!valid.value) return
  stockStore.addProduct(barcode.value, quantity.value ?? 0, route.query.barcode as string)
  router.push({ name: 'stock-list' })
}
</script>

<template>
  <PageLayout :title="$t('stock.form.title')" :icon="ClipboardDocumentCheckIcon">
    <FormLayout>
      <div v-if="loading">
        <h3 class="text-center text-xl">{{ $t('stock.form.loading') }}</h3>
      </div>
      <div v-if="!loading">
        <div v-if="infos" class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold text-center">
            {{ infos?.found ? infos.name : $t('stock.form.errors.product_not_found') }}
          </h3>
          <h4 class="text-center">
            <QrCodeIcon class="h-6 inline align-text-bottom" /> {{ barcode }}
          </h4>
          <div class="flex items-center justify-center">
            <img :src="infos.image ?? '/image-not-found-icon.svg'" class="max-h-32" />
          </div>
        </div>
      </div>
      <div>
        <FormInput
          v-if="!loading && !infos"
          v-model="barcode"
          :label="$t('stock.form.barcode')"
          type="text"
          maxlength="13"
        />
        <div v-if="barcode?.length >= 13 && errors.barcode" class="text-red-600">
          {{ $t('stock.form.errors.barcode') }}
        </div>
      </div>
      <div>
        <FormInput
          v-model="quantity"
          :label="$t('stock.form.quantity')"
          :placeholder="$t('stock.form.quantity_placeholder')"
          type="number"
          min="0"
        />
        <div v-if="errors.quantity" class="text-red-600">
          {{ $t('stock.form.errors.quantity') }}
        </div>
      </div>
    </FormLayout>

    <template #footer>
      <RouterLink :to="{ name: 'stock-list' }">
        <SecondaryButton>{{ $t('stock.button.cancel') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton @click="submit()">{{ $t('stock.button.submit') }}</PrimaryButton>
    </template>
  </PageLayout>
</template>
