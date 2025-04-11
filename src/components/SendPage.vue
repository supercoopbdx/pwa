<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { toRaw } from 'vue'

const SERVER_URL = 'https://backend.supercoop.fr/send-email'
const store = useInventoryStore()

async function submit() {
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      zone: store.zone,
      products: Object.values(toRaw(store.products)),
    }),
  })

  //TODO : if request fails, display error
}
</script>

<template>
  <PageLayout :title="$t('nav.send')">
    <p class="text-left m-auto mt-4 mb-30">{{ $t('send.confirmation') }}</p>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton @click="submit()">{{ $t('button.send_confirm') }}</PrimaryButton>
    </div>
  </PageLayout>
</template>
