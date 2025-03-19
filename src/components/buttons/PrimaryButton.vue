<script setup>
defineProps({
    disabled: Boolean
})
</script>

<template>
    <button
        v-bind="$attrs"
        :disabled="disabled"
        class="rounded-md border-2 border-solid p-1.5 text-sm font-bold text-white shadow-lg cursor-pointer"
        :class="[
            disabled
                ? 'border-gray-300 bg-gray-300'
                : 'border-blue-600 bg-blue-600 hover:bg-blue-700 hover:border-blue-700 focus:bg-blue-700',
        ]"
    >
        <slot />
    </button>
</template>
