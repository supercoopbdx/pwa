<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { toRaw } from 'vue'
import { ref } from 'vue'
import config from '@/config'

const SEND_URL = config.api.baseURL + '/send-email'
const store = useInventoryStore()
const reportSent = ref(false)
const isSending = ref(false)  
const message = ref("")

async function submit() {
  console.log("Sending report...")
  isSending.value = true  // Start loading
  
  try {
    const filteredProducts = Object.values(toRaw(store.products)).map(p => {
    const { image, ...rest } = p
    return rest
    }) //permet de supprimer l'image des produits afin de ne pas l'envoyer
    const response = await fetch(SEND_URL, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        zone: store.zone,
        products: filteredProducts,
      }),
    })
    const jso = await response.json()
    message.value = jso["email_status"]
    reportSent.value = true
    console.log("Report sent:", message.value)
  } catch (error) {
    console.error("Error sending report:", error)
    message.value = "Error sending report. Please try again."
  } finally {
    isSending.value = false  // Stop loading
  }
}

</script>
<template>
  <PageLayout :title="$t('nav.send')">
    <div v-if="!isSending && !reportSent" class="text-left m-auto mt-4 mb-30">
      {{ $t('send.confirmation') }}
    </div>
    
    <!-- Loading Spinner -->
    <div v-if="isSending" class="flex flex-col items-center justify-center my-8">
      <img 
        src="/carotte.svg" 
        alt="Loading..." 
        class="w-16 h-16 animate-spin"
      />
      <p class="text-center text-gray-600 mt-2">Sending...</p>
    </div>
    
    <p v-if="!isSending && reportSent" class="text-left m-auto mt-4 mb-30">
      {{ message }}
    </p>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton :disabled="isSending">{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton 
        v-if="!reportSent" 
        @click="submit()" 
        :disabled="isSending"
      >
        {{ isSending ? 'Sending...' : $t('button.send_confirm') }}
      </PrimaryButton>
    <div v-if="reportSent" class="flex items-center justify-center mt-4 mb-30">
      {{ $t('send.email_sent') }}
      </div>
      <RouterLink to="/" v-if="reportSent">
        <PrimaryButton>{{ $t('button.back_to_home') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>

<style scoped>
.animate-spin {
  animation: spin 2s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>