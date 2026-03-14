import { defineStore } from 'pinia'
import { ref } from 'vue'

type NotificationType = 'error' | 'warning' | 'info'

type Notification = {
  id: number
  message: string
  type: NotificationType
}

let nextId = 0

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function notify(message: string, type: NotificationType = 'error') {
    const id = nextId++
    notifications.value.push({ id, message, type })
    setTimeout(() => dismiss(id), 5000)
  }

  function dismiss(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, notify, dismiss }
})
