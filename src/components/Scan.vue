<script setup>
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { ref } from 'vue'

const loading = ref(true)

</script>

<template>
    <div class="flex flex-col gap-2 text-center">
        <h1 class="text-4xl">{{ $t('nav.scan') }}</h1>
        <div v-if="loading">
            <img src="/barcode_scan.svg" alt="Barcode" class="w-100 m-auto" />
            <h3>{{ $t('scan.loading') }}</h3>
        </div>

        <StreamBarcodeReader @decode="alert" @loaded="loading=false" class="bg-gray-300 w-150 m-auto my-10" />
        <RouterLink to="/list">
            <button class="secondary">{{ $t('button.back') }}</button>
        </RouterLink>
    </div>
</template>
