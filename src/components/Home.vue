<script setup>
import { StreamBarcodeReader } from 'vue-barcode-reader'
</script>

<template>
    <h1>{{ $t('nav.home') }}</h1>
    <p>{{ $t('home.introduction') }}</p>
    <StreamBarcodeReader @decode="alert" />
</template>

<style scoped>

</style>
