<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PageLayout from '@/layout/PageLayout.vue'
import { BugAntIcon } from '@heroicons/vue/24/outline'
import { useInventaireStore } from '@/stores/inventaire'
import { storeToRefs } from 'pinia'
import BarcodeScanner, { type ScannerInfo } from '@/components/barcode/BarcodeScanner.vue'

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

// --- Comparatif ancienne / nouvelle méthode de scan ---
interface ScanTest {
  info: ScannerInfo | null
  code: string
  ms: number
}
const testLegacy = ref(false)
const testForceZxing = ref(false)
const testRunning = ref(false)
const testKey = ref(0)
const testInfo = ref<ScannerInfo | null>(null)
const testError = ref<string | null>(null)
const testResults = ref<ScanTest[]>([])
let testLoadedAt = 0

function startTest() {
  testInfo.value = null
  testError.value = null
  testKey.value++
  testRunning.value = true
}

function onTestLoaded() {
  testLoadedAt = performance.now()
}

function onTestScan(code: string) {
  testResults.value.unshift({
    info: testInfo.value,
    code,
    ms: Math.round(performance.now() - testLoadedAt),
  })
  testRunning.value = false
}

function onTestError(e: Error) {
  testError.value = e?.message || String(e)
}

function fmtInfo(i: ScannerInfo | null) {
  if (!i) return '—'
  const res = i.width && i.height ? `${i.width}×${i.height}` : '?'
  const z = i.zoom !== undefined ? ` · zoom ${i.zoom}` : ''
  return `${i.camera} · ${res}${z} · ${i.streams} flux`
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
        <h2 class="font-semibold text-base mb-2 font-sans">Test du scanner : ancienne / nouvelle méthode</h2>
        <div class="bg-gray-50 rounded-lg p-3 space-y-3">
          <div class="flex flex-wrap gap-4 font-sans">
            <label class="flex items-center gap-1">
              <input type="radio" :value="false" v-model="testLegacy" :disabled="testRunning" />
              Nouvelle
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" :value="true" v-model="testLegacy" :disabled="testRunning" />
              Ancienne (≤ 0.7.3)
            </label>
            <label v-if="nativeSupported" class="flex items-center gap-1">
              <input type="checkbox" v-model="testForceZxing" :disabled="testRunning" />
              Forcer ZXing
            </label>
          </div>
          <button
            v-if="!testRunning"
            @click="startTest"
            class="px-3 py-1 rounded bg-blue-600 text-white font-sans"
          >Scanner</button>
          <button
            v-else
            @click="testRunning = false"
            class="px-3 py-1 rounded bg-gray-300 font-sans"
          >Arrêter</button>

          <div v-if="testRunning" class="h-72">
            <BarcodeScanner
              :key="testKey"
              :legacy="testLegacy"
              :force-zxing="testForceZxing"
              @loaded="onTestLoaded"
              @info="testInfo = $event"
              @scan="onTestScan"
              @error="onTestError"
            />
          </div>

          <div v-if="testInfo" class="space-y-1">
            <div><span class="text-gray-500">Méthode :</span> {{ testInfo.method }} ({{ testInfo.decoder }})</div>
            <div><span class="text-gray-500">Caméra :</span> {{ fmtInfo(testInfo) }}</div>
            <div v-if="testInfo.focusMode"><span class="text-gray-500">Mise au point :</span> {{ testInfo.focusMode }}</div>
            <div><span class="text-gray-500">Caméras arrière :</span></div>
            <ul class="list-disc pl-5">
              <li v-for="c in testInfo.cameras" :key="c">{{ c }}</li>
            </ul>
          </div>
          <div v-if="testError" class="text-red-500">{{ testError }}</div>

          <table v-if="testResults.length" class="w-full text-xs">
            <thead>
              <tr class="text-left text-gray-500">
                <th>Méthode</th><th>Délai</th><th>Code</th><th>Caméra</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in testResults" :key="i" class="align-top border-t border-gray-200">
                <td>{{ r.info ? `${r.info.method} (${r.info.decoder})` : '?' }}</td>
                <td>{{ (r.ms / 1000).toFixed(1) }} s</td>
                <td>{{ r.code }}</td>
                <td>{{ fmtInfo(r.info) }}</td>
              </tr>
            </tbody>
          </table>
          <button
            v-if="testResults.length"
            @click="testResults = []"
            class="text-xs text-red-500 underline"
          >Vider les résultats</button>
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
