<script setup>
defineProps({
    elem: {
        type: [String, Function, Object],
        default: 'button'
    }
})
</script>

<template>
    <button
        v-bind="$attrs"
        class="rounded-md border-2 bg-white p-1.5 sm:px-3 text-sm font-bold text-blue-600 shadow-lg hover:bg-gray-100 focus:bg-gray-100 cursor-pointer"
    >
        <slot />
    </button>
</template>
