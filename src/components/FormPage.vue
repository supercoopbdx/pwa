<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import FormLayout from '@/layout/FormLayout.vue'

const route = useRoute()
const router = useRouter()
const store = useInventoryStore()

const barcode = ref(route.query.barcode ?? null)
const quantity = ref(store.products[barcode.value]?.quantity ?? null)
const productName = ref('')
const productImage = ref('')
const errorMessage = ref('')
const loading = ref(false)

const valid = computed(() => !errors.value.barcode && !errors.value.quantity)

const errors = computed(() => {
  return {
    barcode: isNaN(barcode.value) || barcode.value?.length !== 13,
    quantity: isNaN(quantity.value),
  }
})


watch(barcode, (newVal) => {
  if (newVal && newVal.length === 13 && !isNaN(newVal)) {
    fetchProductInfo(newVal)
  } else {
    productName.value = ''
    productImage.value = ''
    errorMessage.value = ''
  }
}, { immediate: true }) // Avec { immediate: true }, le watcher s’exécute aussi au montage avec la valeur initiale (celle qui vient du scan via route.query).

async function fetchProductInfo(barcode) {
  loading.value = true
  errorMessage.value = ''
  try {
    const productInfo = await store.fetchProductInfo(barcode)
    productName.value = productInfo.name
    productImage.value = productInfo.image
  } catch (error) {
    errorMessage.value = 'Produit non trouvé dans la base de données'
    productName.value = 'Produit inconnu'
    productImage.value = '/image-not-found-icon.svg'
  } finally {
    loading.value = false
  }
}

function submit() {
  if (!valid.value) return
  store.setItem(
    barcode.value,
    quantity.value ?? 0,
    route.query.barcode,
    productName.value,
    productImage.value
  )
  router.push({ path: '/list' })
}

</script>

<template>
  <PageLayout :title="$t('nav.form')">
    <FormLayout>
      <div v-if="loading" class="text-center">{{ $t('loading') }}...</div>
      <div v-if="errorMessage" class="text-red-600 font-bold">{{ errorMessage }}</div>
      <div v-if="productName">
        <h3 class="font-bold text-lg">{{ productName }}</h3>
        <div class="flex items-center justify-center">
          <img :src="`data:image/png;base64,${productImage}`" alt="Product Image" class="max-w-md h-32" />
        </div>
        <FormInput
          v-model="quantity"
          :error="errors.quantity"
          :error-message="$t('form.quantity_error')"
          :label="$t('form.quantity')"
          :placeholder="$t('form.quantity_placeholder')"
          type="number"
          min="0"
        />
        <PrimaryButton @click="submit" :disabled="!valid">Validé</PrimaryButton>
      </div>
      <div v-else>
        <FormInput
          v-model="barcode"
          :error="errors.barcode"
          :error-message="$t('form.barcode_error')"
          :label="$t('form.barcode')"
          :placeholder="$t('form.barcode_placeholder')"
          type="text"
          maxlength="13"
        />
        <FormInput
          v-model="quantity"
          :error="errors.quantity"
          :error-message="$t('form.quantity_error')"
          :label="$t('form.quantity')"
          :placeholder="$t('form.quantity_placeholder')"
          type="number"
          min="0"
        />
      </div>
    </FormLayout>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
