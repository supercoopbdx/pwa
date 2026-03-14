<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications.ts'
import { storeToRefs } from 'pinia'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const { notifications } = storeToRefs(useNotificationStore())
const { dismiss } = useNotificationStore()

const colorClass = (type: string) => ({
  error: 'bg-red-600',
  warning: 'bg-yellow-500',
  info: 'bg-blue-600',
}[type] ?? 'bg-red-600')
</script>

<template>
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-sm px-4">
    <div
      v-for="n in notifications"
      :key="n.id"
      class="flex items-start gap-2 text-white text-sm rounded-lg px-4 py-3 shadow-lg"
      :class="colorClass(n.type)"
    >
      <span class="flex-1">{{ n.message }}</span>
      <button @click="dismiss(n.id)" class="shrink-0 mt-0.5">
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
