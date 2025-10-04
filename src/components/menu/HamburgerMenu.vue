<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Bars3Icon,
  ClipboardDocumentCheckIcon,
  InboxArrowDownIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import CancelButton from '@/components/buttons/CancelButton.vue'
import { useAuth } from '@/composables/useAuth.ts'

const { user, isAuthenticated, login, logout } = useAuth()
const { t } = useI18n()

interface MenuItem {
  label: string
  path: string
  icon: any
}

const isOpen = ref(true)

// Define your menu items here
const menuItems: MenuItem[] = [
  { label: t('menu.stock'), path: '/stock', icon: ClipboardDocumentCheckIcon },
  { label: t('menu.inbound'), path: '/inbound', icon: InboxArrowDownIcon },
]

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <button @click="toggleMenu" class="z-50 p-2 cursor-pointer" aria-label="Toggle menu">
    <Bars3Icon v-if="!isOpen" class="h-6 w-6 text-gray-700" />
    <XMarkIcon v-else class="h-6 w-6 text-gray-700" />
  </button>

  <!-- Overlay -->
  <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />

  <!-- Side Menu -->
  <nav
    v-if="isOpen"
    class="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 overflow-y-auto"
  >
    <div class="p-6">
      <!-- Menu Header -->
      <div class="ml-10">
        <h2 class="text-2xl font-bold text-gray-800">{{ $t('app.title') }}</h2>
      </div>

      <!-- Menu Items -->
      <ul class="flex flex-col gap-1 my-2">
        <li v-for="item in menuItems" :key="item.path">
          <RouterLink
            :to="item.path"
            @click="closeMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <component
              :is="item.icon"
              class="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors"
            />
            <span class="text-gray-700 group-hover:text-gray-900 font-medium">
              {{ item.label }}
            </span>
          </RouterLink>
        </li>
      </ul>

      <div class="mb-2 fixed bottom-0">
        <div>
          <PrimaryButton v-if="!isAuthenticated" @click="login()">{{
            $t('auth.login')
          }}</PrimaryButton>
          <div v-else>
            {{ user?.profile.name }}
            <CancelButton @click="logout()">{{ $t('auth.logout') }}</CancelButton>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
