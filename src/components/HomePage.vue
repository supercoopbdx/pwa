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
    <div class="text-left mt-4 mb-30">
      <p class="mb-5">{{ $t('home.introduction') }}</p>
      {{ $t('home.instructions.title') }}
      <ul class="list-outside list-disc ml-10">
        <li>{{ $t('home.instructions.zone_number') }}</li>
        <li>{{ $t('home.instructions.scan') }}</li>
        <li>{{ $t('home.instructions.manual') }}</li>
        <li>{{ $t('home.instructions.send') }}</li>
      </ul>
      <p class="mt-10">{{ $t('home.good_luck') }}</p>
    </div>

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
