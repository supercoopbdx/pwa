<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Bars3Icon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  InboxArrowDownIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth.ts'

const { user, isAuthenticated, login } = useAuthStore()
const { t } = useI18n()

interface MenuItem {
  label: string
  path: string
  icon: any
}

const isOpen = ref(false)

// Define your menu items here
const menuItems: MenuItem[] = [
  { label: t('menu.home'), path: '/', icon: HomeIcon },
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
  <button
    @click="toggleMenu"
    aria-label="Open menu"
    class="absolute top-0 left-0 h-20 w-20 z-50 p-5 cursor-pointer text-gray-700"
  >
    <Bars3Icon v-if="!isOpen" />
    <XMarkIcon v-else></XMarkIcon>
  </button>

  <!-- Overlay -->
  <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />

  <!-- Side Menu -->
  <nav
    v-if="isOpen"
    class="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 overflow-y-auto p-6"
  >
    <div class="text-2xl font-semibold text-center">Menu</div>
    <!-- Menu Items -->
    <ul class="flex flex-col gap-1 my-2">
      <li v-for="item in menuItems" :key="item.path">
        <RouterLink :to="item.path" @click="closeMenu" class="flex items-center gap-3 py-3 group">
          <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
          <span class="group-hover:text-gray-900 font-medium">
            {{ item.label }}
          </span>
        </RouterLink>
      </li>
    </ul>

    <div class="fixed bottom-5">
      <div>
        <PrimaryButton v-if="!isAuthenticated" @click="login()">
          {{ $t('auth.login') }}
        </PrimaryButton>
        <div v-else>
          <UserCircleIcon class="h-6 text-gray-600 inline align-text-bottom" />
          {{ user?.profile.name }}<br />
        </div>
      </div>
    </div>
  </nav>
</template>
