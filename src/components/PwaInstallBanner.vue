<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { XMarkIcon, ArrowDownTrayIcon, ArrowUpOnSquareIcon } from '@heroicons/vue/24/outline'

const DISMISSED_KEY = 'pwa-install-dismissed'

const show = ref(false)
const isIos = ref(false)
const isFirefox = ref(false)
let deferredPrompt: any = null

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  )
}

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isAndroidChrome() {
  const ua = navigator.userAgent
  return /android/i.test(ua) && /chrome\/\d+/i.test(ua) && !/samsung|edg[ea]/i.test(ua)
}

function isAndroidFirefox() {
  const ua = navigator.userAgent
  return /android/i.test(ua) && /firefox\/\d+/i.test(ua)
}

function handleBeforeInstallPrompt(e: Event) {
  e.preventDefault()
  deferredPrompt = e
  if (!localStorage.getItem(DISMISSED_KEY)) show.value = true
}

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  show.value = false
  if (outcome === 'accepted') localStorage.setItem(DISMISSED_KEY, '1')
}

function dismiss() {
  show.value = false
  localStorage.setItem(DISMISSED_KEY, '1')
}

onMounted(() => {
  if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) return
  if (isIosDevice()) {
    isIos.value = true
    show.value = true
    return
  }
  if (isAndroidFirefox()) {
    isFirefox.value = true
    show.value = true
    return
  }
  if (!isAndroidChrome()) return
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
})
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="show"
      class="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex items-start gap-3 max-w-lg mx-auto"
    >
      <div class="shrink-0 mt-0.5" :class="isFirefox ? 'text-orange-500' : 'text-green-700'">
        <ArrowUpOnSquareIcon v-if="isIos" class="w-6 h-6" />
        <ArrowDownTrayIcon v-else class="w-6 h-6" />
      </div>

      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900">
          {{ isFirefox ? 'Ouvrez avec Chrome' : 'Ajouter à l\'écran d\'accueil' }}
        </p>
        <p v-if="isIos" class="text-xs text-gray-500 mt-0.5">
          Appuyez sur
          <ArrowUpOnSquareIcon class="w-3.5 h-3.5 inline align-text-top" />
          puis <strong>« Sur l'écran d'accueil »</strong>
        </p>
        <p v-else-if="isFirefox" class="text-xs text-gray-500 mt-0.5">
          Firefox ne permet pas d'installer l'app ni de scanner les codes-barres. Ouvrez ce lien dans Chrome.
        </p>
        <p v-else class="text-xs text-gray-500 mt-0.5">
          Installez l'app pour un accès rapide depuis votre téléphone
        </p>
      </div>

      <div class="flex items-center gap-2 shrink-0 self-center">
        <button
          v-if="!isIos && !isFirefox"
          @click="install"
          class="text-xs font-medium text-white bg-green-700 rounded-full px-3 py-1.5"
        >
          Installer
        </button>
        <button @click="dismiss" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
