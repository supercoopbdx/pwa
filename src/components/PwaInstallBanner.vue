<script setup lang="ts">
// L'événement d'installation de Chrome est capté au démarrage (voir @/pwaInstall.ts) :
// le bandeau ne le rate plus s'il est monté après coup (même code que l'app Étiquettes).
import { computed, ref } from 'vue'
import { XMarkIcon, ArrowDownTrayIcon, ArrowUpOnSquareIcon } from '@heroicons/vue/24/outline'
import { installPrompt } from '@/pwaInstall.ts'

const DISMISSED_KEY = 'pwa-install-dismissed'

function readDismissed(): boolean {
  try {
    return !!localStorage.getItem(DISMISSED_KEY)
  } catch {
    return false
  }
}

function writeDismissed() {
  try {
    localStorage.setItem(DISMISSED_KEY, '1')
  } catch {
    /* stockage indisponible */
  }
}

const ua = navigator.userAgent
const standalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as { standalone?: boolean }).standalone === true
const isIos = /iphone|ipad|ipod/i.test(ua)
const isFirefox = /android/i.test(ua) && /firefox\/\d+/i.test(ua)

const dismissed = ref(readDismissed())

const show = computed(() => {
  if (standalone || dismissed.value) return false
  return isIos || isFirefox || installPrompt.value !== null
})

async function install() {
  const prompt = installPrompt.value
  if (!prompt) return
  await prompt.prompt()
  const { outcome } = await prompt.userChoice
  installPrompt.value = null
  if (outcome === 'accepted') {
    dismissed.value = true
    writeDismissed()
  }
}

function dismiss() {
  dismissed.value = true
  writeDismissed()
}
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
        <button @click="dismiss" class="text-gray-400 hover:text-gray-600" aria-label="Fermer">
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
