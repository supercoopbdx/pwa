<script setup>
import { StreamBarcodeReader } from 'vue-barcode-reader'
</script>

<template>
    <StreamBarcodeReader @decode="alert" class="w-100 m-auto" />
</template>
