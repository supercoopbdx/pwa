<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageLayout from '@/layout/PageLayout.vue'
import { BugAntIcon } from '@heroicons/vue/24/outline'

declare const __APP_VERSION__: string
const appVersion = __APP_VERSION__

const nativeSupported = typeof (window as any).BarcodeDetector !== 'undefined'
const nativeFormats = ref<string[] | null>(null)
const userAgent = navigator.userAgent

onMounted(async () => {
  if (nativeSupported) {
    try {
      nativeFormats.value = await (window as any).BarcodeDetector.getSupportedFormats()
    } catch {
      nativeFormats.value = []
    }
  }
})
</script>

<template>
  <PageLayout :title="$t('debug.title')" :icon="BugAntIcon">
    <div class="space-y-6 font-mono text-sm">

      <section>
        <h2 class="font-semibold text-base mb-2 font-sans">{{ $t('debug.app') }}</h2>
        <div class="bg-gray-50 rounded-lg p-3 space-y-1">
          <div><span class="text-gray-500">Version :</span> {{ appVersion }}</div>
        </div>
      </section>

      <section>
        <h2 class="font-semibold text-base mb-2 font-sans">{{ $t('debug.scanner') }}</h2>
        <div class="bg-gray-50 rounded-lg p-3 space-y-1">
          <div>
            <span class="text-gray-500">BarcodeDetector natif :</span>
            <span :class="nativeSupported ? 'text-green-600' : 'text-red-500'">
              {{ nativeSupported ? 'supporté' : 'non supporté' }}
            </span>
          </div>
          <div>
            <span class="text-gray-500">Décodeur utilisé :</span>
            {{ nativeSupported ? 'native (BarcodeDetector)' : 'zxing (JS)' }}
          </div>
          <div v-if="nativeFormats !== null">
            <span class="text-gray-500">Formats natifs :</span>
            <span v-if="nativeFormats.length">{{ nativeFormats.join(', ') }}</span>
            <span v-else class="text-red-500">aucun</span>
          </div>
        </div>
      </section>

      <section>
        <h2 class="font-semibold text-base mb-2 font-sans">{{ $t('debug.browser') }}</h2>
        <div class="bg-gray-50 rounded-lg p-3 break-all">
          {{ userAgent }}
        </div>
      </section>

    </div>
  </PageLayout>
</template>
