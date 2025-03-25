<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import FormLayout from '@/layout/FormLayout.vue'
import FormInput from '@/components/inputs/FormInput.vue'

const zone = ref('')
const router = useRouter()

function start() {
  router.push('/list')
}
</script>

<template>
  <PageLayout :title="$t('nav.home')">
    <p class="text-left mt-4 mb-30">{{ $t('home.introduction') }}</p>

    <FormLayout>
      <FormInput
        :label="$t('home.zone_number')"
        type="number"
        v-model="zone"
        :required="true"
      ></FormInput>
    </FormLayout>

    <PrimaryButton class="mt-10" @click="start">{{ $t('home.start') }}</PrimaryButton>
  </PageLayout>
</template>
