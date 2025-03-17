<script setup>
import { StreamBarcodeReader } from 'vue-barcode-reader'

function onDecode(text) {
    alert(text)
}
</script>

<template>
    <StreamBarcodeReader @decode="onDecode" />
</template>

