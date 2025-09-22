<script lang="ts" setup>
defineProps({
  label: { type: String, required: true },
  required: { type: Boolean },
  type: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' }, // expose modelValue
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="mb-4 w-full">
    <label class="block text-gray-700 font-medium mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :type="type"
      :value="modelValue"
      @input="updateValue"
      class="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      :required="required"
    />
  </div>
</template>
