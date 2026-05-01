<script setup lang="ts">
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/forms/FormInput.vue'
import { useInventaireStore } from '@/stores/inventaire'
import { useRoute, useRouter } from 'vue-router'
import { computed, Ref, ref, watch } from 'vue'
import FormLayout from '@/components/forms/FormLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { ClipboardDocumentCheckIcon, QrCodeIcon } from '@heroicons/vue/24/outline'
import AuthImage from '@/components/AuthImage.vue'

const route = useRoute()
const router = useRouter()
const stockStore = useInventaireStore()

const scannedBarcode = ref((route.query.barcode as string) ?? null)
const barcode = computed(() => infos.value?.barcode ?? scannedBarcode.value)
const isMultiBarcode = computed(() =>
  !!infos.value?.barcode && infos.value.barcode !== scannedBarcode.value
)
const quantity = ref<number | ''>(stockStore.products.get(scannedBarcode.value)?.quantity ?? '')
const quantityTouched = ref(false)
const submitButtonRef = ref<{ focus: () => void } | null>(null)
const infos: Ref<StockProductInfo | undefined> = ref(undefined)
const loading = ref(false)

const allowsDecimal = computed(() => infos.value?.uom_is_decimal ?? false)

const unitLabel = computed(() => {
  if (!infos.value?.uom_is_decimal) return null
  return infos.value?.uom_label ?? null
})

const valid = computed(() => !errors.value.barcode && !errors.value.quantity)
const errors = computed(() => {
  const qty = Number(quantity.value)
  const quantityInvalid =
    quantity.value.toString() === '' ||
    isNaN(qty) ||
    qty < 0 ||
    (!allowsDecimal.value && !Number.isInteger(qty))
  return {
    barcode: !/^\d{13}$/.test(scannedBarcode.value),
    quantity: quantityInvalid,
  }
})

watch(
  scannedBarcode,
  async (newVal) => {
    if (newVal && !errors.value.barcode) {
      loading.value = true
      infos.value = await stockStore.getProductInfo(scannedBarcode.value)
      loading.value = false
    } else {
      infos.value = undefined
    }
  },
  { immediate: true },
)

function submit() {
  if (!valid.value) {
    quantityTouched.value = true
    return
  }
  submitButtonRef.value?.focus()
  stockStore.addProduct(barcode.value, Number(quantity.value) ?? 0, infos.value?.found ?? false, infos.value?.name ?? '', infos.value?.image_url ?? '', infos.value?.uom_id, infos.value?.uom_label, infos.value?.uom_is_decimal)
  router.push({ name: 'inventaire-scan' })
}

function modifyBarcode() {
  infos.value = undefined
  scannedBarcode.value = ''
}
</script>

<template>
  <PageLayout :title="$t('inventaire.form.title')" :icon="ClipboardDocumentCheckIcon">
    <FormLayout>
      <div v-if="loading">
        <h3 class="text-center text-xl">{{ $t('inventaire.form.loading') }}</h3>
      </div>
      <div v-if="!loading">
        <div v-if="infos" class="flex items-center space-x-2 rtl:space-x-reverse">
          <div class="shrink-0">
            <AuthImage :path="infos.image_url ?? ''" img-class="w-15 h-15 rounded-lg" />
          </div>
          <div class="flex-1 min-w-0 grow">
            <p class="text-sm font-medium text-gray-900 text-clip">
              {{ infos?.found ? infos.name : $t('inventaire.form.errors.product_not_found') }}
            </p>
            <p class="text-sm text-gray-500">
              <QrCodeIcon class="h-5 inline align-text-bottom" />
              {{ barcode }}
            </p>
<p v-if="isMultiBarcode" class="text-xs text-amber-600 mt-1">
              {{ $t('inventaire.form.multi_barcode', { scanned: scannedBarcode, main: barcode }) }}
            </p>
          </div>
        </div>
      </div>
      <div>
        <FormInput
          v-if="!loading && !infos"
          v-model="scannedBarcode"
          :label="$t('inventaire.form.barcode')"
          type="text"
          maxlength="13"
        />
        <div v-if="scannedBarcode?.length >= 13 && errors.barcode" class="text-red-600">
          {{ $t('inventaire.form.errors.barcode') }}
        </div>
      </div>
      <div>
        <FormInput
          v-model="quantity"
          :label="unitLabel ? `${$t('inventaire.form.quantity')} (${unitLabel})` : $t('inventaire.form.quantity')"
          type="number"
          min="0"
          placeholder="0"
          :step="allowsDecimal ? 'any' : '1'"
          @blur="quantityTouched = true"
          @keydown.enter="submit"
        />
        <div v-if="errors.quantity && quantityTouched" class="text-red-600">
          {{ quantity === '' ? $t('inventaire.form.errors.quantity_empty') : allowsDecimal ? $t('inventaire.form.errors.quantity_decimal') : $t('inventaire.form.errors.quantity') }}
        </div>
      </div>
    </FormLayout>

    <template #footer>
      <RouterLink :to="{ name: 'inventaire-liste' }">
        <SecondaryButton>{{ $t('inventaire.button.cancel') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton ref="submitButtonRef" @click="submit()">{{ $t('inventaire.button.submit') }}</PrimaryButton>
    </template>
  </PageLayout>
</template>
