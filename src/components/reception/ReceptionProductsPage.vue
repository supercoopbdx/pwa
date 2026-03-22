<script setup lang="ts">
import { useReceptionStore } from '@/stores/reception.ts'
import PageLayout from '@/layout/PageLayout.vue'
import {
  CheckIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  TruckIcon,
} from '@heroicons/vue/24/outline'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, ref, Ref } from 'vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import GreenButton from '@/components/buttons/GreenButton.vue'
import RedButton from '@/components/buttons/RedButton.vue'
import AuthImage from '@/components/AuthImage.vue'

const { getCommande } = useReceptionStore()

const po = useRoute().params.po.toString()
const commande: Ref<ReceptionCommandeLines | undefined> = ref()
const loading = ref(true)

const isCommandeComplete = computed(() => {
  if (!commande || !commande.value?.products) return false
  for (let [, product] of commande.value?.products) {
    if (!product.reception) return false
  }
  return true
})

const productsWithoutBarcode = computed(() => {
  if (!commande.value?.products) return []
  return Array.from(commande.value.products.values()).filter((p) => !p.barcode)
})

const allHaveBarcodes = computed(() => productsWithoutBarcode.value.length === 0)

onBeforeMount(async () => {
  commande.value = await getCommande(po)
  loading.value = false
})
</script>

<template>
  <PageLayout :title="po" :icon="TruckIcon">
    <div v-if="loading">
      <h3 class="text-center text-xl">{{ $t('reception.products-list.loading') }}</h3>
    </div>
    <div v-else-if="!commande?.products?.size">{{ $t('reception.products-list.empty') }}</div>
    <div v-else>
      <!-- Alerte : produits sans code barre -->
      <div v-if="!allHaveBarcodes" class="mb-5">
        <p class="text-red-600 font-semibold mb-3">
          {{ $t('reception.products-list.missing-barcode-warning') }}
        </p>
        <ul class="divide-y divide-gray-200 mb-4">
          <li v-for="product in productsWithoutBarcode" :key="product.name" class="py-2">
            <div class="flex items-center space-x-2">
              <div class="shrink-0 w-15 h-15 rounded-lg bg-gray-200">
                <AuthImage :path="product.image_url" img-class="w-15 h-15 rounded-lg" />
              </div>
              <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
            </div>
          </li>
        </ul>
        <p class="text-gray-600 italic">{{ $t('reception.products-list.missing-barcode-contact') }}</p>
      </div>

      <!-- Cas nominal : tous les produits ont un code barre -->
      <template v-if="allHaveBarcodes">
        <p class="text-green-600 font-semibold mb-3">{{ $t('reception.products-list.all-barcodes-ok') }}</p>
        <div class="flex justify-center mb-5">
          <RouterLink :to="{ name: 'reception-scan' }">
            <PrimaryButton class="text-2xl px-10 py-5">
              {{ $t('inventaire.button.start') }}
            </PrimaryButton>
          </RouterLink>
        </div>
      </template>

      <ul v-if="commande && allHaveBarcodes" class="divide-y divide-gray-200 mx-auto max-h-full flex flex-col my-5">
        <li v-for="[barcode, product] in commande.products" :key="barcode">
          <div class="flex items-center space-x-2 rtl:space-x-reverse py-2">
            <div class="shrink-0 w-15 h-15 rounded-lg bg-gray-200">
              <AuthImage :path="product.image_url" img-class="w-15 h-15 rounded-lg" />
            </div>
            <div class="flex-1 min-w-0 grow">
              <p class="text-sm font-medium text-gray-900 text-clip">
                {{ product.name }}
              </p>
              <p class="text-sm text-gray-500">
                <QrCodeIcon class="h-5 inline align-text-bottom" />
                {{ product.barcode }}
              </p>
              <div class="items-center text-l font-semibold text-gray-900">
                {{ product.parcels }} x {{ product.packSize }} =
                {{ product.parcels * product.packSize }} {{ product.unit }}
              </div>
            </div>
            <div class="flex flex-col">
              <RouterLink :to="{ name: 'reception-form', params: { barcode: product.barcode } }">
                <PrimaryButton v-if="!product.reception">
                  <ChevronRightIcon class="w-7 h-7" />
                </PrimaryButton>
                <GreenButton v-else-if="product.reception.ok">
                  <CheckIcon class="w-7 h-7" />
                </GreenButton>
                <RedButton v-else>
                  <ExclamationTriangleIcon class="w-7 h-7" />
                </RedButton>
              </RouterLink>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <template #footer>
      <RouterLink :to="{ name: 'reception-commandes' }">
        <SecondaryButton>{{ $t('reception.button.back') }}</SecondaryButton>
      </RouterLink>
      <RouterLink v-if="isCommandeComplete" :to="{ name: 'reception-send' }">
        <PrimaryButton>{{ $t('reception.button.complete') }}</PrimaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
