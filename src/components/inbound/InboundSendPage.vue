<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import { ref } from 'vue'
import { useInboundStore } from '@/stores/inbound.ts'
import { useRoute } from 'vue-router'

const reportSent = ref(false)
const message = ref('')

const { sendOrder } = useInboundStore()
const { po } = useRoute().params

async function submit() {
  const response = await sendOrder(po.toString())
  message.value = response['email_status']
  reportSent.value = true

  //TODO : if request fails, display error
}
</script>

<template>
  <PageLayout :title="$t('stock.send.title')">
    <p v-if="!reportSent" class="text-left m-auto mt-4 mb-10">
      {{ $t('stock.send.confirmation') }}
    </p>
    <p v-if="reportSent" class="text-left m-auto mt-4">{{ message }}</p>

    <div class="flex flex-row justify-between">
      <RouterLink :to="{ name: 'inbound-products' }">
        <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton v-if="!reportSent" @click="submit()">{{
        $t('stock.button.send_confirm')
      }}</PrimaryButton>
      <RouterLink to="/" v-if="reportSent">
        <PrimaryButton>{{ $t('stock.button.back_to_home') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
