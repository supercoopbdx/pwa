<script setup>
import { ref } from 'vue'
import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useRouter } from 'vue-router'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const loading = ref(true)
const router = useRouter()

function decode(barcode) {
  router.push({ path: '/form', query: { barcode } })
}
</script>

<template>
  <PageLayout :title="$t('nav.scan')">
    <div v-if="loading">
      <img alt="Barcode" class="max-w-md m-auto" src="/barcode_scan.svg" />
      <h3>{{ $t('scan.loading') }}</h3>
    </div>

    <StreamBarcodeReader
      torch
      no-front-cameras
      class="bg-gray-300 max-w-md"
      @decode="decode"
      @loaded="loading = false"
    />
    <template #footer>
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <div class="flex"> 
        <RouterLink to="/form" class="m-auto">
            <PrimaryButton class="text-sm">{{ $t('button.manual_input') }}</PrimaryButton>
          </RouterLink>
      </div>
    </template>  
  </PageLayout>
</template>
