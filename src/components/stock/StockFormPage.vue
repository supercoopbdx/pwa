<script setup lang="ts">
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useStockStore } from '@/stores/stock'
import { useRoute, useRouter } from 'vue-router'
import { computed, Ref, ref, watch } from 'vue'
import FormLayout from '@/layout/FormLayout.vue'
import { storeToRefs } from 'pinia'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const route = useRoute()
const router = useRouter()
const stockStore = useStockStore()
const { getProduct, getProductInfo, saveProduct } = stockStore

const barcode = ref((route.query.barcode as string) ?? null)
const quantity = ref(getProduct(barcode.value)?.quantity ?? 0)
const infos: Ref<StockProductInfo | undefined> = ref(undefined)
const { loading } = storeToRefs(stockStore)

const valid = computed(() => !errors.value.barcode && !errors.value.quantity)
const errors = computed(() => {
  return {
    barcode: barcode.value?.length !== 13 || isNaN(parseInt(barcode.value)),
    quantity: quantity.value.toString() === '' || quantity.value < 0,
  }
})

watch(
  barcode,
  async (newVal) => {
    if (newVal && !errors.value.barcode) {
      infos.value = await getProductInfo(barcode.value)
      router.push({ name: router.currentRoute.value.name, query: { barcode: barcode.value } })
    } else {
      infos.value = undefined
    }
  },
  { immediate: true },
)

function cancel() {
  console.log('cancel')
  infos.value = undefined
}

function submit() {
  if (!valid.value) return
  saveProduct(barcode.value, quantity.value ?? 0, route.query.barcode as string)
  router.push({ name: 'stock-list' })
}
</script>

<template>
  <PageLayout :title="$t('stock.form.title')">
    <FormLayout>
      <div v-if="loading">
        <h3 class="text-center text-xl">{{ $t('stock.form.loading') }}</h3>
      </div>
      <div v-if="!loading">
        <div v-if="infos" class="flex flex-col gap-2">
          <h3 class="text-lg font-semibold text-center">
            {{ infos?.error ? $t('stock.form.errors.product_not_found') : infos.name }}
          </h3>
          <h4 class="text-center">{{ $t('stock.form.barcode') }} : {{ barcode }}</h4>
          <div class="flex items-center justify-center">
            <img
              :src="infos?.error ? '/image-not-found-icon.svg' : `data:image/png;base64,${infos?.image}`"
              alt="Product image"
              class="max-w-md max-h-32"
            />
          </div>
          <SecondaryButton @click="cancel()">{{ $t('stock.form.modify')}}</SecondaryButton>
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
        <div v-if="errors.barcode && barcode?.length" class="text-red-600">
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
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton @click="submit()">{{ $t('stock.button.submit') }}</PrimaryButton>
    </template>
  </PageLayout>
</template>
