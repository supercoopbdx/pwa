<script setup>
import TextInput from './inputs/TextInput.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PrimaryButton from './buttons/PrimaryButton.vue'
import SecondaryButton from './buttons/SecondaryButton.vue'

const zone = ref('')
const router = useRouter()

const list = ref([
    { barcode: 1234567890, amount: 123 },
    { barcode: 1234567890, amount: 123 },
    { barcode: 1234567890, amount: 123 },
    { barcode: 1234567890, amount: 123 }
])

</script>

<template>
    <div class="flex flex-col gap-3 text-center">
        <div class="flex flex-row gap-2 m-auto">
            <label for="zoneInput"> {{ $t('list.zone') }} : </label>
            <TextInput type="number" v-model="zone" class="w-20" />
        </div>
        <RouterLink to="/scan">
            <PrimaryButton class="p-8 text-xl">{{ $t('button.scan_barcode') }}</PrimaryButton>
        </RouterLink>
        <SecondaryButton class="p-3 text-xl m-auto">{{ $t('button.manual_input') }}</SecondaryButton>

        <table class="table-auto border-1 m-auto ">
            <thead>
            <tr class="border-1">
                <th class="p-2">{{ $t('list.barcode') }}</th>
                <th class="p-2">{{ $t('list.amount') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in list"
                :key="item.barcode"
                @click="router.push({path: '/form', query: { barcode: item.barcode } })"
                class="cursor-pointer"
            >
                <td class="p-2">{{ item.barcode }}</td>
                <td class="p-2">{{ item.amount }}</td>
            </tr>
            </tbody>
        </table>

        <div class="flex flex-row gap-2 m-auto">
            <RouterLink to="/">
                <SecondaryButton class="p-3 text-xl">{{ $t('button.back') }}</SecondaryButton>
            </RouterLink>
            <RouterLink to="/send">
                <PrimaryButton class="p-3 text-xl">{{ $t('button.send') }}</PrimaryButton>
            </RouterLink>
        </div>
    </div>
</template>
