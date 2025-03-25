<script lang="ts" setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
  },
  type: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel({
  type: Number,
  required: true,
})
</script>
<template>
  <label>
    {{ label }} :&nbsp;
    <input
      v-model="modelValue"
      :type="type"
      class="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1"
      :required="required"
    />
  </label>
</template>
