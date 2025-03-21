<script setup>
import { StreamBarcodeReader } from 'vue-barcode-reader'
import { ref } from 'vue'

const loading = ref(true)

</script>

<template>
    <div class="page gap-2">
        <h1>{{ $t('nav.scan') }}</h1>
        <div v-if="loading">
            <img src="/barcode_scan.svg" alt="Barcode" class="max-w-md m-auto" />
            <h3>{{ $t('scan.loading') }}</h3>
        </div>

        <StreamBarcodeReader @decode="alert" @loaded="loading=false" class="bg-gray-300 max-w-md m-auto my-10" />
        <RouterLink to="/list">
            <button class="secondary">{{ $t('button.back') }}</button>
        </RouterLink>
    </div>
</template>
