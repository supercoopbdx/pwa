<script setup lang="ts">
import { useInboundStore } from '@/stores/inbound.ts'
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

const { getOrder } = useInboundStore()

const po = useRoute().params.po.toString()
const order: Ref<InboundOrderLines | undefined> = ref()
const loading = ref(true)

const isOrderComplete = computed(() => {
  if (!order || !order.value?.products) return false
  for (let [, product] of order.value?.products) {
    if (!product.inbound) return false
  }
  return true
})

onBeforeMount(async () => {
  order.value = await getOrder(po)
  loading.value = false
})
</script>

<template>
  <PageLayout :title="po" :icon="TruckIcon">
    <div v-if="loading">
      <h3 class="text-center text-xl">{{ $t('inbound.products-list.loading') }}</h3>
    </div>
    <div v-else-if="!order?.products?.size">{{ $t('inbound.products-list.empty') }}</div>
    <div v-else>
      <div class="flex justify-center mb-5">
        <RouterLink :to="{ name: 'inbound-scan' }">
          <PrimaryButton class="text-2xl px-10 py-5">
            {{ $t('stock.button.start') }}
          </PrimaryButton>
        </RouterLink>
      </div>

      <ul v-if="order" class="divide-y divide-gray-200 mx-auto max-h-full flex flex-col my-5">
        <li v-for="[barcode, product] in order.products" :key="barcode">
          <div class="flex items-center space-x-2 rtl:space-x-reverse py-2">
            <div class="shrink-0">
              <img
                class="w-15 h-15 rounded-lg"
                :src="product.image ? `${product.image}` : '/image-not-found-icon.svg'"
              />
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
                {{ product.parcels * product.packSize }}
                {{ $t('inbound.products-list.unit', product.parcels * product.packSize) }}
              </div>
            </div>
            <div class="flex flex-col">
              <RouterLink :to="{ name: 'inbound-form', params: { barcode: product.barcode } }">
                <PrimaryButton v-if="!product.inbound">
                  <ChevronRightIcon class="w-7 h-7" />
                </PrimaryButton>
                <GreenButton v-else-if="product.inbound.ok">
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
      <RouterLink :to="{ name: 'inbound-orders' }">
        <SecondaryButton>{{ $t('inbound.button.back') }}</SecondaryButton>
      </RouterLink>
      <RouterLink v-if="isOrderComplete" :to="{ name: 'inbound-send' }">
        <PrimaryButton>{{ $t('inbound.button.complete') }}</PrimaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
