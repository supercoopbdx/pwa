<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FormLayout from '@/layout/FormLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useStockStore } from '@/stores/stock'
import { computed } from 'vue'

const store = useStockStore()
const router = useRouter()

const errors = computed(() => ({
  zone: isNaN(store.zone) || store.zone?.length !== 3,
}))

function submitZone() {
  store.saveZone()
  router.push('/list')
}
</script>

<template>
  <PageLayout :title="$t('stock.nav.home')">
    <div class="text-left md:text-left">
      <p class="mb-5">{{ $t('stock.home.introduction') }}</p>
      <h3 class="font-semibold mb-2">{{ $t('stock.home.instructions.title') }}</h3>
      <ul class="list-disc list-inside md:list-outside ml-0 md:ml-6">
        <li>{{ $t('stock.home.instructions.zone_number') }}</li>
        <li>{{ $t('stock.home.instructions.scan') }}</li>
        <li>{{ $t('stock.home.instructions.manual') }}</li>
        <li>{{ $t('stock.home.instructions.send') }}</li>
      </ul>
      <p class="mt-6">{{ $t('stock.home.good_luck') }}</p>
    </div>

    <FormLayout>
      <FormInput
        type="text"
        v-model="store.zone"
        :label="$t('stock.home.zone_number')"
        :required="true"
      />
      <div v-if="errors.zone && store.zone?.length > 0" class="text-red-600">
        {{ $t('stock.home.zone_error') }}
      </div>
    </FormLayout>

    <PrimaryButton class="w-full mt-6" @click="submitZone" :disabled="!store.zone || errors.zone">
      {{
        !Object.values(store.products).length ? $t('stock.home.start') : $t('stock.home.continue')
      }}
    </PrimaryButton>
  </PageLayout>
</template>
