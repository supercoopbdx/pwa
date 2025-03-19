<script setup>
import PrimaryButton from './buttons/PrimaryButton.vue'
import TextInput from './inputs/TextInput.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const zone = ref('')
const router = useRouter();

function start () {
    router.push('/list')
}
</script>

<template>
    <div class="flex flex-col gap-3 text-center">
        <h1 class="text-4xl">{{ $t('nav.home') }}</h1>
        <p class="m-10">{{ $t('home.introduction') }}</p>
        <div class="flex flex-row gap-2 m-auto">
            <label for="zoneInput"> {{ $t('input.zone_number') }} : </label>
            <TextInput type="number" v-model="zone" />
        </div>

        <PrimaryButton @click="start" class="p-3 m-3 text-xl">{{ $t('home.start') }}</PrimaryButton>
    </div>
</template>
