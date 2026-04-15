<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageLayout from '@/layout/PageLayout.vue'
import { BugAntIcon } from '@heroicons/vue/24/outline'
import { useInventaireStore } from '@/stores/inventaire'
import { storeToRefs } from 'pinia'

declare const __APP_VERSION__: string
const appVersion = __APP_VERSION__

const nativeSupported = typeof (window as any).BarcodeDetector !== 'undefined'
const nativeFormats = ref<string[] | null>(null)
const userAgent = navigator.userAgent

const inventaireStore = useInventaireStore()
const { zonesComptees } = storeToRefs(inventaireStore)

function viderZonesComptees() {
  zonesComptees.value.clear()
  localStorage.setItem('inventaire-zones-comptees', '[]')
}

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
        <h2 class="font-semibold text-base mb-2 font-sans">Zones comptées</h2>
        <div class="bg-gray-50 rounded-lg p-3 space-y-2">
          <div v-if="zonesComptees.size === 0" class="text-gray-400">Aucune zone comptée sur cet appareil.</div>
          <div v-else class="flex flex-wrap gap-2">
            <span
              v-for="id in [...zonesComptees].sort((a, b) => a - b)"
              :key="id"
              class="px-2 py-0.5 bg-blue-100 text-blue-800 rounded"
            >{{ String(id).padStart(3, '0') }}</span>
          </div>
          <button
            v-if="zonesComptees.size > 0"
            @click="viderZonesComptees"
            class="mt-1 text-xs text-red-500 underline"
          >Vider la liste</button>
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
