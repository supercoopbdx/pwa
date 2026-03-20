<script setup lang="ts">
import { computed, ref } from 'vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import BarcodeScanner from '@/components/barcode/BarcodeScanner.vue'
import FormInput from '@/components/forms/FormInput.vue'
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  title: string
  icon: Component
  backRoute: RouteLocationRaw
  manualInput?: boolean
}>()

const emit = defineEmits<{
  scan: [barcode: string]
}>()

const loading = ref(true)
const showManual = ref(false)
const manualBarcode = ref('')

const manualValid = computed(() => /^\d{13}$/.test(manualBarcode.value))

function openManual() {
  showManual.value = true
  loading.value = true
}

function cancelManual() {
  showManual.value = false
  manualBarcode.value = ''
}

function submitManual() {
  if (manualValid.value) {
    emit('scan', manualBarcode.value)
  }
}
</script>

<template>
  <PageLayout :title="title" :icon="icon">
    <template v-if="!showManual">
      <div v-if="loading">
        <img alt="Barcode" src="/barcode_scan.svg" />
        <h3 class="text-center">{{ $t('stock.scan.loading') }}</h3>
      </div>
      <BarcodeScanner
        v-show="!loading"
        @loaded="loading = false"
        @scan="emit('scan', $event)"
        @error="console.error($event)"
      />
    </template>
    <div v-else>
      <FormInput v-model="manualBarcode" :label="$t('stock.form.barcode')" type="text" />
      <div v-if="manualBarcode.length > 0 && !manualValid" class="text-red-600">
        {{ $t('stock.form.errors.barcode') }}
      </div>
    </div>

    <template #footer>
      <template v-if="!showManual">
        <RouterLink :to="backRoute">
          <SecondaryButton>{{ $t('stock.button.back') }}</SecondaryButton>
        </RouterLink>
        <div v-if="manualInput" class="flex">
          <PrimaryButton class="text-sm m-auto" @click="openManual">
            {{ $t('stock.button.manual_input') }}
          </PrimaryButton>
        </div>
      </template>
      <template v-else>
        <SecondaryButton @click="cancelManual">{{ $t('stock.button.back') }}</SecondaryButton>
        <PrimaryButton :disabled="!manualValid" @click="submitManual">
          {{ $t('stock.button.submit') }}
        </PrimaryButton>
      </template>
    </template>
  </PageLayout>
</template>
