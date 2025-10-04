<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useStockStore } from '@/stores/stock'
import { ref, toRaw } from 'vue'

const SERVER_URL = 'https://backend.supercoop.fr/send-email'
const store = useStockStore()
const reportSent = ref(false)
const message = ref('')

async function submit() {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      zone: store.zone,
      products: Object.values(toRaw(store.products)),
    }),
  })
  const jso = await response.json()
  message.value = jso['email_status']
  reportSent.value = true

  //TODO : if request fails, display error
}
</script>

<template>
  <PageLayout :title="$t('stock.send.title')">
    <p v-if="!reportSent" class="text-left m-auto mt-4 mb-30">
      {{ $t('stock.send.confirmation') }}
    </p>
    <p v-if="reportSent" class="text-left m-auto mt-4 mb-30">{{ message }}</p>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink :to="{ name: 'stock-list' }">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton v-if="!reportSent" @click="submit()">{{
        $t('stock.button.send_confirm')
      }}</PrimaryButton>
      <RouterLink to="/">
        <PrimaryButton v-if="reportSent">{{ $t('stock.button.back_to_home') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
