<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import RedButton from '@/components/buttons/RedButton.vue'
import { useInventaireStore } from '@/stores/inventaire'
import AuthImage from '@/components/AuthImage.vue'
import { ClipboardDocumentCheckIcon, QrCodeIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

const router = useRouter()
const stockStore = useInventaireStore()
const { t } = useI18n()

const { products, zone, sessionCourante } = storeToRefs(stockStore)

if (!stockStore.zone) {
  // if zone is not set, we go back to landing page
  router.push({ name: 'inventaire-landing' })
}

function removeItem(barcode: string) {
  stockStore.removeProduct(barcode)
}

function reset() {
  if (confirm(t('inventaire.list.reset'))) {
    stockStore.reset()
  }
}

async function annulerComptage() {
  if (!confirm(t('inventaire.list.cancel_confirm'))) return
  const zoneId = parseInt(zone.value)
  await stockStore.annulerComptage(zoneId)
  stockStore.reset()
  router.push({ name: 'inventaire-landing' })
}
</script>

<template>
  <PageLayout
    :title="$t('inventaire.list.title', { zone: stockStore.zone })"
    :icon="ClipboardDocumentCheckIcon"
  >
    <div class="flex justify-center mb-5">
      <RouterLink :to="{ name: 'inventaire-scan' }">
        <PrimaryButton class="text-2xl px-10 py-5">
          {{ $t('inventaire.button.start') }}
        </PrimaryButton>
      </RouterLink>
    </div>

    <div v-if="!products.size" class="text-center text-gray-500 my-5">
      {{ $t('inventaire.list.empty') }}
    </div>

    <ul class="divide-y divide-gray-200 mx-auto flex flex-col gap-2">
      <li v-for="[barcode, product] in products" :key="barcode" class="pb-2">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="shrink-0">
            <AuthImage :path="product.image_url ?? ''" img-class="w-15 h-15 rounded-lg" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 text-clip">
              {{ product.name ?? $t('inventaire.form.errors.product_not_found') }}
            </p>
            <p class="text-sm text-gray-500">
              <QrCodeIcon class="h-5 inline align-text-bottom" />
              {{ product.barcode }}
            </p>
          </div>
          <div class="inline-flex items-center text-base font-semibold text-gray-900">
            {{ product.quantity }}
            <span v-if="product.uom_label && product.uom_is_decimal" class="ml-1 text-sm font-normal text-gray-500">{{ product.uom_label }}</span>
          </div>

          <PrimaryButton @click="removeItem(product.barcode)">
            <TrashIcon class="w-7 h-7"></TrashIcon>
          </PrimaryButton>
        </div>
      </li>
    </ul>

    <!-- Boutons fixes en bas -->
    <template #footer>
      <div class="flex flex-col gap-2 w-full">
        <PrimaryButton
          class="w-full"
          @click="$router.push({ name: 'inventaire-send' })"
          :disabled="!products.size"
        >
          {{ $t('inventaire.button.finish') }}
        </PrimaryButton>
        <div class="flex justify-between gap-2">
          <SecondaryButton @click="$router.push({ name: 'inventaire-landing' })">
            {{ $t('inventaire.button.back') }}
          </SecondaryButton>
          <div class="flex gap-2">
            <RedButton v-if="sessionCourante" @click="annulerComptage()">
              {{ $t('inventaire.button.cancel_count') }}
            </RedButton>
            <RedButton @click="reset()" :disabled="!products.size">
              {{ $t('inventaire.button.reset') }}
            </RedButton>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>
