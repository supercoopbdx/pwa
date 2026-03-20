<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useInventaireStore } from '@/stores/inventaire'
import { ref } from 'vue'

const reportSent = ref(false)
const message = ref('')

const { send } = useInventaireStore()

async function submit() {
  console.log('send exists?', send)  // doit afficher la fonction
  const jso = await send()
  console.log(jso)
  message.value = jso["email_status"]  
  reportSent.value = true
}
</script>

<template>
  <PageLayout :title="$t('inventaire.send.title')">
    <p v-if="!reportSent" class="text-left m-auto mt-4 mb-10">
      {{ $t('inventaire.send.confirmation') }}
    </p>
    <p v-else class="text-left m-auto mt-4">{{ message }}</p>

    <template #footer>
      <RouterLink :to="{ name: 'inventaire-liste' }">
        <SecondaryButton>{{ $t('inventaire.button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton v-if="!reportSent" @click="submit()">{{
        $t('inventaire.button.send_confirm')
      }}</PrimaryButton>
      <RouterLink v-else :to="{ name: 'inventaire-landing' }">
        <PrimaryButton>{{ $t('inventaire.button.back_to_home') }}</PrimaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
