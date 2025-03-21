<script setup>
import { ref } from 'vue'

const zone = ref('')

const list = ref([
    { barcode: 1234567890, amount: 123 },
    { barcode: 1234567890, amount: 123 },
    { barcode: 1234567890, amount: 123 },
    { barcode: 1234567890, amount: 123 }
])

</script>

<template>
    <main class="page gap-2">
        <h1>{{ $t('nav.list') }}</h1>
        <form class="my-5">
            <label for="number-input">{{ $t('list.zone_number')}} :</label>
            <input type="number" id="number-input" required v-model="zone" />
        </form>
        <RouterLink to="/scan">
            <button class="primary big">{{ $t('button.scan_barcode') }}</button>
        </RouterLink>
        <RouterLink to="/form">
            <button class="secondary text-sm">{{ $t('button.manual_input') }}</button>
        </RouterLink>

        <table class="my-5">
            <thead>
            <tr>
                <th>{{ $t('list.barcode') }}</th>
                <th>{{ $t('list.amount') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in list" :key="item.barcode">
                <td>
                    <RouterLink :to="{path: '/form', query: { barcode: item.barcode }}"> {{ item.barcode }}</RouterLink>
                </td>
                <td>{{ item.amount }}</td>
            </tr>
            </tbody>
        </table>

        <div class="flex flex-row gap-2 justify-between">
            <RouterLink to="/">
                <button class="secondary">{{ $t('button.back') }}</button>
            </RouterLink>
            <RouterLink to="/send">
                <button class="primary">{{ $t('button.send_list') }}</button>
            </RouterLink>
        </div>
    </main>
</template>
