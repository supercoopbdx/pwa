<script setup>
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FormLayout from '@/layout/FormLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useInventoryStore } from '@/stores/inventory.js'

const store = useInventoryStore()
const router = useRouter()

function start() {
  store.saveZone()
  router.push('/list')
}
</script>

<template>
  <PageLayout :title="$t('nav.home')">
    <p class="text-left mt-4 mb-30">{{ $t('home.introduction') }}</p>

    <FormLayout>
      <FormInput
        :label="$t('home.zone_number')"
        type="number"
        v-model="store.zone"
        :required="true"
      ></FormInput>
    </FormLayout>

    <PrimaryButton class="mt-10" @click="start" :disabled="!store.zone">
      {{ !Object.values(store.itemList).length ? $t('home.start') : $t('home.continue') }}
    </PrimaryButton>
  </PageLayout>
</template>
