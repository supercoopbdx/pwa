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
  if (!commande.value?.allProducts?.length) return false
  return commande.value.allProducts.every((p) => !!p.reception)
})

const productsWithoutBarcode = computed(() => {
  return commande.value?.allProducts.filter((p) => !p.barcode) ?? []
})

const allHaveBarcodes = computed(() => productsWithoutBarcode.value.length === 0)

onBeforeMount(async () => {
  commande.value = await getCommande(po)
  loading.value = false
})

function orderedQty(product: ReceptionProduct): number {
  return product.parcels * product.packSize
}

function receivedQty(product: ReceptionProduct): number {
  if (!product.reception) return 0
  if (product.reception.ok) return orderedQty(product)
  return product.reception.received ?? 0
}

/** Abréviation d'unité pour l'affichage compact dans les parenthèses */
function shortUnit(unit: string): string {
  if (unit === 'unité') return 'u'
  return unit  // kg, L → déjà courts
}
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
        <li
          v-for="product in commande.allProducts"
          :key="product.barcode"
          :class="{
            'bg-green-50':  product.reception?.ok,
            'bg-amber-50':  product.reception && !product.reception.ok,
          }"
          class="rounded-lg my-0.5"
        >
          <div class="flex items-center gap-3 px-2 py-2">
            <!-- Image -->
            <div class="shrink-0 w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
              <AuthImage :path="product.image_url" img-class="w-12 h-12 rounded-lg" />
            </div>

            <!-- Infos produit -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-gray-400 flex items-center gap-1">
                <QrCodeIcon class="h-3.5 inline" />{{ product.barcode }}
              </p>

              <!-- Quantités -->
              <div class="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm">
                <!-- Commandé (toujours visible) -->
                <span class="text-gray-500">
                  {{ $t('reception.products-list.ordered') }} :
                  <template v-if="product.packSize > 1">
                    <span class="font-semibold text-gray-700">{{ product.parcels }} {{ $t('reception.form.parcel') }}</span>{{ ' ' }}<span class="text-xs text-gray-400">({{ product.packSize }} {{ shortUnit(product.unit) }})</span>{{ ' ' }}<span class="text-gray-400">soit</span>{{ ' ' }}<span class="font-semibold text-gray-700">{{ orderedQty(product) }} {{ product.unit }}</span>
                  </template>
                  <template v-else>
                    <span class="font-semibold text-gray-700">{{ orderedQty(product) }} {{ product.unit }}</span>
                  </template>
                </span>

                <!-- Reçu : uniquement si scanné -->
                <span v-if="product.reception?.ok" class="text-green-700 font-semibold flex items-center gap-0.5">
                  <CheckIcon class="h-4 inline" />
                  {{ $t('reception.products-list.received') }} : {{ receivedQty(product) }} {{ product.unit }}
                </span>
                <span v-else-if="product.reception && !product.reception.ok" class="text-amber-700 font-semibold flex items-center gap-0.5">
                  <ExclamationTriangleIcon class="h-4 inline" />
                  {{ $t('reception.products-list.received') }} : {{ receivedQty(product) }} / {{ orderedQty(product) }} {{ product.unit }}
                </span>
              </div>

              <!-- Commentaire anomalie -->
              <p v-if="product.reception?.comment" class="text-xs text-amber-600 mt-0.5 italic truncate">
                {{ product.reception.comment }}
              </p>
            </div>

            <!-- Bouton action -->
            <div class="shrink-0">
              <RouterLink :to="{ name: 'reception-form', params: { barcode: product.barcode } }">
                <PrimaryButton v-if="!product.reception">
                  <ChevronRightIcon class="w-6 h-6" />
                </PrimaryButton>
                <GreenButton v-else-if="product.reception.ok">
                  <CheckIcon class="w-6 h-6" />
                </GreenButton>
                <RedButton v-else>
                  <ExclamationTriangleIcon class="w-6 h-6" />
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
