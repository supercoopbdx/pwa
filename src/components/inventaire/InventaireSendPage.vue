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
const submissionCount = ref(0)
const error = ref('')

async function submit() {
  const result = await store.send()
  if (!result.success) {
    error.value = result.error ?? 'Erreur inconnue'
  } else {
    submissionCount.value = result.submission_count ?? 1
    store.reset()
  }
  reportSent.value = true
}
</script>

<template>
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
      <p v-if="submissionCount >= 2" class="text-green-700 font-medium">
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
