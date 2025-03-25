<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import CancelButton from '@/components/buttons/CancelButton.vue'
import FormLayout from '@/layout/FormLayout.vue'
import PageLayout from '@/layout/PageLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'
</script>

<template>
  <PageLayout :title="$t('nav.form')">
    <FormLayout>
      <div>
        <FormInput v-model="barcode" :label="$t('form.barcode')" type="number"></FormInput>
      </div>
      <div>
        <FormInput v-model="zone" :label="$t('form.amount')" type="number"></FormInput>
      </div>
    </FormLayout>

    <CancelButton>{{ $t('button.remove') }}</CancelButton>

    <div class="flex flex-row gap-2 justify-between">
      <RouterLink to="/list">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <RouterLink to="/list">
        <PrimaryButton>{{ $t('button.submit') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
