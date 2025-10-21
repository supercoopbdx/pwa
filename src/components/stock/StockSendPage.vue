<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { useStockStore } from '@/stores/stock'
import { ref } from 'vue'

const reportSent = ref(false)
const message = ref('')

const { send } = useStockStore()

async function submit() {
  const jso = await send()
  message.value = jso['email_status']
  reportSent.value = true
}
</script>

<template>
  <PageLayout :title="$t('stock.send.title')">
    <p v-if="!reportSent" class="text-left m-auto mt-4 mb-10">
      {{ $t('stock.send.confirmation') }}
    </p>
    <p v-else class="text-left m-auto mt-4">{{ message }}</p>

    <template #footer>
      <RouterLink :to="{ name: 'stock-list' }">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton v-if="!reportSent" @click="submit()">{{
        $t('stock.button.send_confirm')
      }}</PrimaryButton>
      <RouterLink v-else :to="{ name: 'stock-landing' }">
        <PrimaryButton>{{ $t('stock.button.back_to_home') }}</PrimaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
