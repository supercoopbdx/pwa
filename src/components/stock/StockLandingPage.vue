<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FormLayout from '@/layout/FormLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useStockStore } from '@/stores/stock'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

const stockStore = useStockStore()
const router = useRouter()

const { zone, products } = storeToRefs(stockStore)

const errors = computed(() => ({
  zone: !zone.value?.match(/^\d{3}$/),
}))

function submitZone() {
  stockStore.saveZone()
  router.push({ name: 'stock-list' })
}
</script>

<template>
  <PageLayout :title="$t('stock.home.title')">
    <div class="mb-10 max-w-md mx-auto">
      <h3 class="font-semibold mb-2">{{ $t('stock.home.instructions.title') }}</h3>
      <ul class="flex flex-col gap-2">
        <li>{{ $t('stock.home.instructions.zone_number') }}</li>
        <li>{{ $t('stock.home.instructions.scan') }}</li>
        <li>{{ $t('stock.home.instructions.manual') }}</li>
        <li>{{ $t('stock.home.instructions.count') }}</li>
        <li>{{ $t('stock.home.instructions.send') }}</li>
      </ul>
      <p class="mt-6">{{ $t('stock.home.good_luck') }}</p>
    </div>

    <FormLayout>
      <FormInput
        type="text"
        v-model="zone"
        :label="$t('stock.home.zone_number')"
        :required="true"
      />
      <div v-if="errors.zone && zone?.length > 0" class="text-red-600">
        {{ $t('stock.home.zone_error') }}
      </div>
    </FormLayout>

    <div class="text-center">
      <PrimaryButton class="mt-6" @click="submitZone()" :disabled="!zone || errors.zone">
        {{ !products.size ? $t('stock.home.start') : $t('stock.home.continue') }}
      </PrimaryButton>
    </div>
  </PageLayout>
</template>
