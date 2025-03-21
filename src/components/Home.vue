<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const zone = ref('')
const router = useRouter()

function start () {
    router.push('/list')
}
</script>

<template>
    <div class="page gap-2">
        <h1>{{ $t('nav.home') }}</h1>
        <p class="text-left mt-4 mb-30">{{ $t('home.introduction') }}</p>

        <form>
            <label for="number-input">{{ $t('home.zone_number')}} :</label>
            <input type="number" id="number-input" required v-model="zone" />
        </form>

        <button @click="start" class="primary mt-10">{{ $t('home.start') }}</button>
    </div>
</template>
