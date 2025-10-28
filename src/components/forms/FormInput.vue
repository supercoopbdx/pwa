<script setup lang="ts">
defineProps({
  label: { type: String, required: true },
  required: { type: Boolean },
  type: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
})

const emit = defineEmits(['update:modelValue'])

function updateValue(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="mb-2 w-full">
    <label class="block text-gray-700 font-medium mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      v-if="type === 'textarea'"
      :value="modelValue"
      @input="updateValue"
      class="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :required="required"
    />
    <input
      v-else
      :type="type"
      :value="modelValue"
      @input="updateValue"
      class="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :required="required"
    />
  </div>
</template>
