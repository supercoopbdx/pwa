<script setup lang="ts">
import PageTitle from '@/components/titles/PageTitle.vue'
import HamburgerMenu from '@/components/menu/HamburgerMenu.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth.ts'
import CancelButton from '@/components/buttons/CancelButton.vue'

const props = defineProps({
  title: { type: String, required: true },
})

const { isAuthenticated, login, logout } = useAuthStore()

</script>

<template>
  <main class="fixed top-0 left-0 h-full w-full flex flex-col gap-6 p-6">
    <div class="items-center">
      <PageTitle class="text-center">{{ props.title }}</PageTitle>
      <div class="fixed right-6 top-6">
        <PrimaryButton v-if="!isAuthenticated" @click="login()">{{ $t('auth.login') }}</PrimaryButton>
        <CancelButton v-else @click="logout()">{{ $t('auth.logout') }}</CancelButton>
      </div>
    </div>

    <div class="text-left my-10">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-between items-center shadow-md"
    >
      <slot name="footer" />
    </div>
  </main>
  <HamburgerMenu />
</template>
