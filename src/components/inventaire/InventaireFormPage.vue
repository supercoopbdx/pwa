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

const barcode = ref((route.query.barcode as string) ?? null)
const quantity = ref(stockStore.products.get(barcode.value)?.quantity ?? 0)
const infos: Ref<StockProductInfo | undefined> = ref(undefined)
const loading = ref(false)

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
    if (newVal && !errors.value.barcode) {
      loading.value = true
      infos.value = await stockStore.getProductInfo(barcode.value)
      loading.value = false
    } else {
      infos.value = undefined
    }
  },
  { immediate: true },
)

function submit() {
  if (!valid.value) return
  stockStore.addProduct(barcode.value, quantity.value ?? 0, infos.value?.found ?? false, infos.value?.name ?? '', infos.value?.image_url ?? '')
  router.push({ name: 'inventaire-scan' })
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
          </div>
        </div>
      </div>
      <div>
        <FormInput
          v-if="!loading && !infos"
          v-model="barcode"
          :label="$t('inventaire.form.barcode')"
          type="text"
          maxlength="13"
        />
        <div v-if="barcode?.length >= 13 && errors.barcode" class="text-red-600">
          {{ $t('inventaire.form.errors.barcode') }}
        </div>
      </div>
      <div>
        <FormInput
          v-model="quantity"
          :label="$t('inventaire.form.quantity')"
          :placeholder="$t('inventaire.form.quantity_placeholder')"
          type="number"
          min="0"
        />
        <div v-if="errors.quantity" class="text-red-600">
          {{ $t('inventaire.form.errors.quantity') }}
        </div>
      </div>
    </FormLayout>

    <template #footer>
      <RouterLink :to="{ name: 'inventaire-liste' }">
        <SecondaryButton>{{ $t('inventaire.button.cancel') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton @click="submit()">{{ $t('inventaire.button.submit') }}</PrimaryButton>
    </template>
  </PageLayout>
</template>
