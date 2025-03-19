<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    type: {
        type: String,
        default: 'text'
    }
})

const emit = defineEmits(['update:modelValue'])

const proxyValue = computed({
    get () {
        return props.modelValue
    },
    set (value) {
        emit('update:modelValue', value)
    }
})
</script>

<template>
    <input
        class="block rounded-md border-1 border-gray-300 p-2 text-base focus:border-blue-600 focus:outline-none focus:ring-blue-600 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
        v-model="proxyValue"
        :type="type"
    />
</template>
