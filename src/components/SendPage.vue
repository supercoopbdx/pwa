<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { toRaw } from 'vue'
import { ref } from 'vue'

const SERVER_URL = 'https://backend.supercoop.fr/send-email'
const store = useInventoryStore()
const reportSent = ref(false)
const message = ref("")

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
  message.value = jso["email_status"]
  reportSent.value=true

  //TODO : if request fails, display error
}
</script>

<template>
  <PageLayout :title="$t('nav.send')">
    <p v-if="!reportSent" class="text-left m-auto mt-4 mb-30">{{ $t('send.confirmation') }}</p>
    <p v-if="reportSent" class="text-left m-auto mt-4 mb-30">{{ message }}</p>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton v-if="!reportSent" @click="submit()">{{ $t('button.send_confirm') }}</PrimaryButton>
      <RouterLink to="/">
      <PrimaryButton v-if="reportSent">{{ $t('button.back_to_home') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
