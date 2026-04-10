<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Bars3Icon,
  BugAntIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  QrCodeIcon,
  TruckIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth.ts'
import { storeToRefs } from 'pinia'

const { logout } = useAuthStore()
const { user } = storeToRefs(useAuthStore())
const { t } = useI18n()

interface MenuItem {
  label: string
  path: string
  icon: any
}

const isOpen = ref(false)

// Define your menu items here
const menuItems: MenuItem[] = [
  { label: t('menu.home'), path: '/accueil', icon: HomeIcon },
  { label: t('menu.inventaire'), path: '/inventaire', icon: ClipboardDocumentCheckIcon },
  { label: t('menu.reception'), path: '/reception', icon: TruckIcon },
  { label: t('menu.scan'), path: '/scan', icon: QrCodeIcon },
  { label: t('menu.debug'), path: '/debug', icon: BugAntIcon },
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
    class="absolute top-0 left-0 h-12 w-12 z-50 p-1 m-4 rounded-lg cursor-pointer text-gray-700 bg-white hover:bg-gray-200"
  >
    <Bars3Icon v-if="!isOpen" />
    <XMarkIcon v-else></XMarkIcon>
  </button>

  <!-- Overlay -->
  <div v-if="isOpen" @click="closeMenu" class="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />

  <!-- Side Menu -->
  <nav
    v-if="isOpen"
    class="fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 overflow-y-auto p-4"
  >
    <div class="text-4xl text-center">Menu</div>
    <!-- Menu Items -->
    <ul class="flex flex-col gap-1 mt-5">
      <li v-for="item in menuItems" :key="item.path">
        <RouterLink
          :to="item.path"
          @click="closeMenu"
          class="flex items-center gap-3 px-3 py-3 group hover:bg-gray-100 rounded-lg"
        >
          <component :is="item.icon" class="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
          <span class="group-hover:text-gray-900 font-medium">
            {{ item.label }}
          </span>
        </RouterLink>
      </li>
    </ul>

    <div class="fixed bottom-5">
      <div v-if="user" class="flex flex-col gap-3">
        <div class="flex items-center gap-2 text-gray-700">
          <UserCircleIcon class="h-6 text-gray-600 shrink-0" />
          <span class="text-sm font-medium">{{ user.profile.name }}</span>
        </div>
        <PrimaryButton @click="logout(); closeMenu()">
          {{ $t('auth.logout') }}
        </PrimaryButton>
      </div>
    </div>
  </nav>
</template>
