<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'

function sendZone() {

}
</script>

<template>
  <PageLayout :title="$t('nav.send')">
    <p class="text-left m-auto mt-4 mb-30">{{ $t('send.confirmation') }}</p>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <PrimaryButton @click="sendZone()">{{ $t('button.send_confirm') }}</PrimaryButton>
    </div>
  </PageLayout>
</template>
