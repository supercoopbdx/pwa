<script setup lang="ts">
import HamburgerMenu from '@/components/menu/HamburgerMenu.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useAuthStore } from '@/stores/auth.ts'
import CancelButton from '@/components/buttons/CancelButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

const props = defineProps({
  title: { type: String, required: true },
  icon: { type: Function, required: false },
})

const { isAuthenticated, login, logout } = useAuthStore()
</script>

<template>
  <main class="fixed top-0 left-0 h-full w-full flex flex-col p-5">
    <div class="fixed left-0 top-0 right-0 pb-5 items-center">
      <h1 class="text-3xl font-bold text-center mt-20 md:mt-7">
        <component v-if="icon" :is="icon" class="h-9 inline align-top"></component>
        {{ props.title }}
      </h1>
      <div class="fixed right-5 top-5">
        <PrimaryButton v-if="!isAuthenticated" @click="login()">{{
          $t('auth.login')
        }}</PrimaryButton>
        <SecondaryButton v-else @click="logout()">{{ $t('auth.logout') }}</SecondaryButton>
      </div>
    </div>

    <div
      class="text-left  mt-30 md:mt-20 max-w-lg mx-auto overflow-y-auto"
      :class="{
        'h-[calc(100%-175px)] md:h-[calc(100%-135px)]': $slots.footer,
      }"
    >
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
