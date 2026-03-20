<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FormLayout from '@/components/forms/FormLayout.vue'
import FormInput from '@/components/forms/FormInput.vue'
import { useInventaireStore } from '@/stores/inventaire'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'

const stockStore = useInventaireStore()
const router = useRouter()

const { zone, products } = storeToRefs(stockStore)

const errors = computed(() => ({
  zone: !zone.value?.match(/^\d{3}$/),
}))

function submitZone() {
  stockStore.saveZone()
  router.push({ name: 'inventaire-liste' })
}
</script>

<template>
  <PageLayout :title="$t('inventaire.home.title')" :icon="ClipboardDocumentCheckIcon">
    <div class="mb-10 mx-auto">
      <h3 class="font-semibold mb-2">{{ $t('inventaire.home.instructions.title') }}</h3>
      <ul class="flex flex-col gap-2">
        <li>{{ $t('inventaire.home.instructions.zone_number') }}</li>
        <li>{{ $t('inventaire.home.instructions.scan') }}</li>
        <li>{{ $t('inventaire.home.instructions.count') }}</li>
        <li>{{ $t('inventaire.home.instructions.restart') }}</li>
        <li>{{ $t('inventaire.home.instructions.send') }}</li>
      </ul>
      <p class="mt-6">{{ $t('inventaire.home.good_luck') }}</p>
    </div>

    <FormLayout class="mx-auto max-w-40">
      <FormInput
        type="text"
        v-model="zone"
        :label="$t('inventaire.home.zone_number')"
        :required="true"
      />
      <div v-if="errors.zone && zone?.length > 0" class="text-red-600">
        {{ $t('inventaire.home.zone_error') }}
      </div>
    </FormLayout>

    <div class="text-center">
      <PrimaryButton class="mt-6" @click="submitZone()" :disabled="!zone || errors.zone">
        {{ !products.size ? $t('inventaire.home.start') : $t('inventaire.home.continue') }}
      </PrimaryButton>
    </div>
  </PageLayout>
</template>
