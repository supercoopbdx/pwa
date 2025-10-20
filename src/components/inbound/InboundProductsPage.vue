<script setup lang="ts">
import { useInboundStore } from '@/stores/inbound.ts'
import PageLayout from '@/layout/PageLayout.vue'
import { ChevronRightIcon, QrCodeIcon, TruckIcon } from '@heroicons/vue/24/outline'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useRoute } from 'vue-router'
import { onBeforeMount, ref, Ref } from 'vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const { getOrder } = useInboundStore()

const po = useRoute().params.po.toString()
const order: Ref<InboundOrder | undefined> = ref()
const loading = ref(true)

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

      <ul v-if="order" class="divide-y divide-gray-200 mx-auto max-h-full flex flex-col gap-2 my-5">
        <li v-for="[barcode, product] in order.products" :key="barcode" class="sm:pb-4">
          <div class="flex items-center space-x-2 rtl:space-x-reverse">
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
                <PrimaryButton>
                  <ChevronRightIcon class="w-7 h-7" />
                </PrimaryButton>
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
    </template>
  </PageLayout>
</template>
