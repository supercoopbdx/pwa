<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useStockStore } from '@/stores/stock'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import FormLayout from '@/layout/FormLayout.vue'

const route = useRoute()
const router = useRouter()
const store = useStockStore()

const barcode = ref(route.query.barcode as string ?? null)
const quantity = ref(store.products[barcode.value]?.quantity ?? null)
const productName = ref('')
const productImage = ref('')
const errorMessage = ref('')
const loading = ref(false)

const valid = computed(() => !errors.value.barcode && !errors.value.quantity)

const errors = computed(() => {
  return {
    barcode: barcode.value?.length !== 13,
    quantity: isNaN(quantity.value),
  }
})

watch(
  barcode,
  (newVal) => {
    if (newVal && newVal.length === 13) {
      fetchProductInfo(newVal)
    } else {
      productName.value = ''
      productImage.value = ''
      errorMessage.value = ''
    }
  },
  { immediate: true },
) // Avec { immediate: true }, le watcher s’exécute aussi au montage avec la valeur initiale (celle qui vient du scan via route.query).

async function fetchProductInfo(barcode: string) {
  loading.value = true
  errorMessage.value = ''
  await store
    .fetchProductInfo(barcode)
    .then((response) => {
      productName.value = response.name
      productImage.value = response.image
    })
    .catch(() => {
      // TODO : clean this
      errorMessage.value = 'Produit non trouvé dans la base de données'
      productName.value = 'Produit inconnu'
      productImage.value = '/image-not-found-icon.svg'
    })
    .finally(() => {
      loading.value = false
    })
}

function submit() {
  if (!valid.value) return
  store.setItem(
    barcode.value,
    quantity.value ?? 0,
    route.query.barcode as string,
    productName.value,
    productImage.value,
  )
  router.push({ name: 'stock-list' })
}
</script>

<template>
  <PageLayout :title="$t('stock.form.title')">
    <FormLayout>
      <div v-if="loading" class="text-center">{{ $t('stock.loading') }}...</div>
      <div v-if="errorMessage" class="text-red-600 font-bold">{{ errorMessage }}</div>
      <div v-if="productName">
        <h3 class="font-bold text-lg">{{ productName }}</h3>
        <div class="flex items-center justify-center">
          <img
            :src="`data:image/png;base64,${productImage}`"
            alt="Product Image"
            class="max-w-md h-32"
          />
        </div>
        <FormInput
          v-model="quantity"
          :error="errors.quantity"
          :error-message="$t('stock.form.quantity_error')"
          :label="$t('stock.form.quantity')"
          :placeholder="$t('stock.form.quantity_placeholder')"
          type="number"
          min="0"
        />
        <PrimaryButton @click="submit" :disabled="!valid">
          {{ $t('stock.button.submit') }}
        </PrimaryButton>
      </div>
      <div v-else>
        <FormInput
          v-model="barcode"
          :error="errors.barcode"
          :error-message="$t('stock.form.barcode_error')"
          :label="$t('stock.form.barcode')"
          :placeholder="$t('stock.form.barcode_placeholder')"
          type="text"
          maxlength="13"
        />
        <FormInput
          v-model="quantity"
          :error="errors.quantity"
          :error-message="$t('stock.form.quantity_error')"
          :label="$t('stock.form.quantity')"
          :placeholder="$t('stock.form.quantity_placeholder')"
          type="number"
          min="0"
        />
      </div>
    </FormLayout>

    <template #footer>
      <RouterLink :to="{name: 'stock-list'}">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
