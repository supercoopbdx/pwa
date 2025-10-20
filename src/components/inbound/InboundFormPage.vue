<script setup lang="ts">
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { CheckCircleIcon, ExclamationTriangleIcon, QrCodeIcon, TruckIcon } from '@heroicons/vue/24/outline'
import { useInboundStore } from '@/stores/inbound.ts'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, ref, Ref } from 'vue'
import CancelButton from '@/components/buttons/CancelButton.vue'

const router = useRouter()
const { getProduct, validateCount } = useInboundStore()
const { po, barcode } = useRoute().params
const product: Ref<InboundProduct | undefined> = ref()
const loading = ref(true)

onBeforeMount(async () => {
  product.value = await getProduct(po.toString(), barcode.toString())
  loading.value = false
})

function correct() {
  validateCount(po.toString(), barcode.toString())
  router.push({name: 'inbound-products'})
}
</script>

<template>
  <PageLayout :title="$t('inbound.form.title')" :icon="TruckIcon">
    <div v-if="loading">
      <h3 class="text-center text-xl">{{ $t('inbound.form.loading') }}</h3>
    </div>
    <div v-else-if="!product">{{ $t('inbound.products-list.empty') }}</div>
    <div v-else class="flex flex-col gap-2">
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
        </div>
      </div>
      <div class="text-center text-3xl font-semibold text-gray-900">
        {{ product.parcels * product.packSize }}
        {{ $t('inbound.form.unit', product.parcels * product.packSize) }}
      </div>
      <div class="text-center text-lg font-semibold">
        {{ $t('inbound.form.within') }}
        {{ product.parcels }} {{ $t('inbound.form.parcel') }} {{ $t('inbound.form.of') }}
        {{ product.packSize }} {{ $t('inbound.form.unit', product.packSize) }}<br />
      </div>
    </div>
    <template #footer>
      <RouterLink :to="{ name: 'inbound-products' }">
        <SecondaryButton>{{ $t('inbound.button.back') }}</SecondaryButton>
      </RouterLink>
      <CancelButton
        ><ExclamationTriangleIcon class="inline-flex h-6 align-text-bottom" />
        {{ $t('inbound.button.good') }}
      </CancelButton>
      <PrimaryButton @click="correct()"
        ><CheckCircleIcon class="inline-flex h-6 align-text-bottom" />
        {{ $t('inbound.button.good') }}
      </PrimaryButton>
    </template>
  </PageLayout>
</template>
