<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import FormLayout from '@/layout/FormLayout.vue'

const route = useRoute()
const router = useRouter()
const store = useInventoryStore()

const barcode = ref(route.query.barcode ?? null)
const quantity = ref(store.products[barcode.value]?.quantity ?? null)

const valid = computed(() => !errors.value.barcode && !errors.value.quantity)

const errors = computed(() => {
  return {
    barcode: isNaN(barcode.value) || barcode.value?.length !== 13,
    quantity: isNaN(quantity.value),
  }
})

function submit() {
  store.setItem(barcode.value, quantity.value ?? 0, route.query.barcode)

  router.push({ path: '/list' })
}

</script>

<template>
  <PageLayout :title="$t('nav.form')">
    <FormLayout>
      {{ quantity?.length }}
      <div class="flex flex-col gap-2">
        <FormInput
          type="text"
          v-model="barcode"
          :label="$t('form.barcode')"
        ></FormInput>
        <div v-if="errors.barcode" class="text-red-600">
          {{ $t('form.barcode_error') }}
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <FormInput v-model="quantity" :label="$t('form.quantity')" type="number"></FormInput>
        <div v-if="errors.quantity" class="text-red-600">
          {{ $t('form.quantity_error') }}
        </div>
      </div>
    </FormLayout>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton @click="submit()" :disabled="!valid || errors.barcode || errors.quantity">
        {{ $t('button.submit') }}
      </PrimaryButton>
    </div>
  </PageLayout>
</template>
