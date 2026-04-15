<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useInventaireStore } from '@/stores/inventaire'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const store = useInventaireStore()
const { zone } = storeToRefs(store)

const reportSent = ref(false)
const submitting = ref(false)
const submissionCount = ref(0)
const canCompare = ref(false)
const error = ref('')

async function submit() {
  if (submitting.value) return
  submitting.value = true
  const result = await store.send()
  submitting.value = false
  if (!result.success) {
    error.value = result.error ?? 'Erreur inconnue'
  } else {
    submissionCount.value = result.submission_count ?? 1
    canCompare.value = result.can_compare ?? false
    store.reset()
  }
  reportSent.value = true
}
</script>

<template>
  <!-- Overlay de chargement -->
  <Teleport to="body">
    <div v-if="submitting" class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/50">
      <svg class="animate-spin h-12 w-12 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
      </svg>
      <p class="text-white text-lg font-medium">{{ $t('inventaire.send.sending') }}</p>
    </div>
  </Teleport>

  <PageLayout :title="$t('inventaire.send.title')">
    <div v-if="!reportSent" class="text-left m-auto mt-4 mb-10">
      <p>{{ $t('inventaire.send.confirmation') }}</p>
    </div>

    <div v-else-if="error" class="mt-4 text-red-600">
      {{ error }}
    </div>

    <div v-else class="mt-4 space-y-3">
      <p>
        {{ $t('inventaire.send.nth_submission', { count: submissionCount, zone: zone }) }}
      </p>
      <p v-if="canCompare" class="text-green-700 font-medium">
        {{ $t('inventaire.send.can_compare') }}
      </p>
    </div>

    <template #footer>
      <RouterLink :to="{ name: 'inventaire-liste' }">
        <SecondaryButton>{{ $t('inventaire.button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton v-if="!reportSent" @click="submit()">
        {{ $t('inventaire.button.send_confirm') }}
      </PrimaryButton>
      <RouterLink v-else :to="{ name: 'inventaire-landing' }">
        <PrimaryButton>{{ $t('inventaire.button.back_to_zones') }}</PrimaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
