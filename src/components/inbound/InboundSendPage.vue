<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { ref } from 'vue'
import { useInboundStore } from '@/stores/inbound.ts'
import { useRoute } from 'vue-router'

const reportSent = ref(false)
const message = ref('')
const loading = ref(false)  // État de chargement
const { sendOrder } = useInboundStore()
const { po } = useRoute().params

async function submit() {
  loading.value = true

  try {
    const response = await sendOrder(po.toString())
    message.value = response?.email_status ?? 'Commande traitée avec succès'
    reportSent.value = true
  } catch (error: any) {
    console.error(error)
    message.value = "Erreur lors de l'envoi. Veuillez réessayer."
    reportSent.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PageLayout :title="$t('stock.send.title')">
    <div v-if="!reportSent" class="text-left m-auto mt-4 mb-10">
      <p v-if="!loading">{{ $t('stock.send.confirmation') }}</p>
      <div v-else class="flex items-center justify-center py-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    </div>
    <p v-if="reportSent" class="text-left m-auto mt-4">{{ message }}</p>

    <div class="flex flex-row justify-between">
      <RouterLink :to="{ name: 'inbound-products' }">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton v-if="!reportSent" @click="submit() " :disabled="loading">{{
        $t('stock.button.send_confirm')
      }}</PrimaryButton>
      <RouterLink to="/" v-if="reportSent">
        <PrimaryButton>{{ $t('stock.button.back_to_home') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
