<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import FormLayout from '@/layout/FormLayout.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const store = useInventoryStore()

const barcode = ref(route.query.barcode ?? null)
const amount = ref(store.itemList[barcode.value]?.amount ?? null)

const valid = computed(() => barcode.value && amount.value)

function submit() {
  store.addItem(barcode.value, amount.value)
  router.push({ path: '/list' })
}

function barcodeChange() {
  router.replace({ path: '/form', query: { barcode: barcode.value }, replace: true })
  amount.value = store.itemList[barcode.value]?.amount ?? null
}
</script>

<template>
  <PageLayout :title="$t('nav.form')">
    <FormLayout>
      <div>
        <FormInput
          v-model="barcode"
          :label="$t('form.barcode')"
          type="text"
          @input="barcodeChange()"
        ></FormInput>
      </div>
      <div>
        <FormInput v-model="amount" :label="$t('form.amount')" type="number"></FormInput>
      </div>
    </FormLayout>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton @click="submit()" :disabled="!valid">
        {{ $t('button.submit') }}
      </PrimaryButton>
    </div>
  </PageLayout>
</template>
