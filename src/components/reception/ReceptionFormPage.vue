<script setup lang="ts">
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import {
  CheckIcon,
  ExclamationTriangleIcon,
  QrCodeIcon,
  TruckIcon,
} from '@heroicons/vue/24/outline'
import { useReceptionStore } from '@/stores/reception.ts'
import AuthImage from '@/components/AuthImage.vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, ref, Ref } from 'vue'
import RedButton from '@/components/buttons/RedButton.vue'
import GreenButton from '@/components/buttons/GreenButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FormLayout from '@/components/forms/FormLayout.vue'
import FormInput from '@/components/forms/FormInput.vue'

const router = useRouter()
const { getProduct, productCountValid, productCountError } = useReceptionStore()
const { po, barcode } = useRoute().params
const product: Ref<ReceptionProduct | undefined> = ref()
const loading = ref(true)
const showErrorForm = ref(false)
const received = ref(0)
const comment = ref('')

onBeforeMount(async () => {
  product.value = await getProduct(po.toString(), barcode.toString())
  received.value = product.value?.reception?.received ?? 0
  comment.value = product.value?.reception?.comment ?? ''
  loading.value = false
})

function valid() {
  productCountValid(po.toString(), barcode.toString())
  router.push({ name: 'reception-products' })
}

function submit() {
  productCountError(po.toString(), barcode.toString(), received.value, comment.value)
  router.push({ name: 'reception-products' })
}
</script>

<template>
  <PageLayout :title="$t('reception.form.title')" :icon="TruckIcon">
    <div v-if="loading">
      <h3 class="text-center text-xl">{{ $t('reception.form.loading') }}</h3>
    </div>
    <div v-else-if="!product">{{ $t('reception.form.empty') }}</div>
    <div v-else class="flex flex-col gap-2">
      <div class="flex items-center space-x-2 rtl:space-x-reverse">
        <div class="shrink-0">
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
        </div>
      </div>
      <div class="text-center text-3xl font-semibold text-gray-900">
        {{ product.parcels * product.packSize }}
        {{ $t('reception.form.unit', product.parcels * product.packSize) }}
      </div>
      <div class="text-center text-lg font-semibold">
        {{ $t('reception.form.within') }}
        {{ product.parcels }} {{ $t('reception.form.parcel') }} {{ $t('reception.form.of') }}
        {{ product.packSize }} {{ $t('reception.form.unit', product.packSize) }}<br />
      </div>
      <FormLayout v-if="showErrorForm">
        <div>
          <FormInput type="number" :label="$t('reception.form.received')" v-model="received" />
          <p class="text-sm text-gray-500 mt-1">
            = {{ received * product.packSize }}
            {{ $t('reception.form.unit', received * product.packSize) }}
            ({{ product.packSize }} {{ $t('reception.form.unit', product.packSize) }}/{{ $t('reception.form.parcel') }})
          </p>
        </div>
        <FormInput type="textarea" :label="$t('reception.form.comment')" v-model="comment" />
      </FormLayout>
    </div>
    <template #footer>
      <RouterLink :to="{ name: 'reception-products' }">
        <SecondaryButton>{{ $t('reception.button.back') }}</SecondaryButton>
      </RouterLink>
      <RedButton v-if="!showErrorForm" :disabled="!product" @click="showErrorForm = true"
        ><ExclamationTriangleIcon class="inline-flex h-6 align-text-bottom" />
        {{ $t('reception.button.error') }}
      </RedButton>
      <GreenButton v-if="!showErrorForm" :disabled="!product" @click="valid()"
        ><CheckIcon class="inline-flex h-6 align-text-bottom" />
        {{ $t('reception.button.good') }}
      </GreenButton>
      <PrimaryButton v-if="showErrorForm"  @click="submit()">
        {{ $t('reception.button.submit') }}
      </PrimaryButton>
    </template>
  </PageLayout>
</template>
