<script setup>
import { useRouter, useRoute } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FormLayout from '@/layout/FormLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
import AuthButtons from '@/components/AuthButtons.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { computed, ref, onMounted, watch } from 'vue'

const store = useInventoryStore()
const router = useRouter()
const route = useRoute()
const showAuthAlert = ref(false)
const authMessage = ref('')

const errors = computed(() => {
  return {
    zone: isNaN(store.zone) || store.zone?.length !== 3,
  }
})

onMounted(() => {
  // Vérifier si un message d'authentification est présent dans l'URL
  if (route.query.authMessage) {
    authMessage.value = route.query.authMessage
    showAuthAlert.value = true
    
    // Nettoyer l'URL après avoir affiché le message
    router.replace({ query: {} })
  }
})
// 🔁 Écoute aussi les changements de query après le premier montage
watch(() => route.query.authMessage, (newVal) => {
  if (newVal) {
    authMessage.value = newVal
    showAuthAlert.value = true
    router.replace({ query: {} })
  }
})
function submitZone() {
  store.saveZone()
  router.push('/list')
}
</script>

<template>
  <PageLayout :title="$t('nav.home')">
    <template #actions>
      <AuthButtons />
    </template>

    <!-- Message d'alerte -->
    <div v-if="showAuthAlert" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
      <p class="font-bold">{{ authMessage }}</p>
    </div>

    <div class="text-left mt-4 mb-6">
      <p class="mb-5">{{ $t('home.introduction') }}</p>
      {{ $t('home.instructions.title') }}
      <ul class="list-outside list-disc ml-6">
        <li>{{ $t('home.instructions.zone_number') }}</li>
        <li>{{ $t('home.instructions.scan') }}</li>
        <li>{{ $t('home.instructions.manual') }}</li>
        <li>{{ $t('home.instructions.send') }}</li>
      </ul>
      <p class="mt-6">{{ $t('home.good_luck') }}</p>
    </div>

    <FormLayout>
      <FormInput
        type="text"
        v-model="store.zone"
        :label="$t('home.zone_number')"
        :required="true"
      />
      <div v-if="errors.zone && store.zone?.length > 0" class="text-red-600">{{ $t('home.zone_error') }}</div>
    </FormLayout>

    <PrimaryButton class="w-full mt-6" @click="submitZone" :disabled="!store.zone || errors.zone">
      {{ !Object.values(store.products).length ? $t('home.start') : $t('home.continue') }}
    </PrimaryButton>
  </PageLayout>
  </template>
