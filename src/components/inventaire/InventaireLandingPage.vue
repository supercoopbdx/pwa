<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useInventaireStore } from '@/stores/inventaire'
import { storeToRefs } from 'pinia'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import type { Zone } from '@/stores/inventaire'
import axios from 'axios'

const stockStore = useInventaireStore()
const router = useRouter()
const { zone, zones, products, sessionCourante, zonesComptees } = storeToRefs(stockStore)

const conflictMessage = ref<string | null>(null)

onMounted(async () => {
  await stockStore.fetchSessionCourante()
})

// Liste ordonnée des zones disponibles : 1er deuxième comptage, 1er premier comptage, puis le reste
const zonesSession = computed(() => {
  const s = sessionCourante.value
  if (!s) return null

  const premier  = (s.zones_premier_comptage  ?? []).filter(z => !zonesComptees.value.has(z.id))
  const deuxieme = (s.zones_deuxieme_comptage ?? []).filter(z => !zonesComptees.value.has(z.id))

  type ZoneEntry = { zone: Zone; label: 'deuxieme' | 'premier'; suggestion: boolean }
  const list: ZoneEntry[] = []

  if (deuxieme.length > 0) list.push({ zone: deuxieme[0], label: 'deuxieme', suggestion: true })
  if (premier.length  > 0) list.push({ zone: premier[0],  label: 'premier',  suggestion: true })
  for (const z of deuxieme.slice(1)) list.push({ zone: z, label: 'deuxieme', suggestion: false })
  for (const z of premier.slice(1))  list.push({ zone: z, label: 'premier',  suggestion: false })

  return list
})

async function choisirZone(z: Zone) {
  conflictMessage.value = null
  zone.value = String(z.id).padStart(3, '0')
  stockStore.saveZone()

  if (sessionCourante.value) {
    try {
      await stockStore.debutComptage(z.id)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const par = err.response.data?.comptage_par
        conflictMessage.value = par
          ? `Cette zone a déjà été prise par ${par}.`
          : `Cette zone n'est plus disponible.`
        await stockStore.fetchSessionCourante()
        return
      }
      throw err
    }
  }

  router.push({ name: 'inventaire-liste' })
}

// Mode sans session : sélection puis bouton démarrer
function selectZone(z: Zone) {
  zone.value = String(z.id).padStart(3, '0')
}

function isSelected(z: Zone) {
  return zone.value === String(z.id).padStart(3, '0')
}

async function submitZone() {
  stockStore.saveZone()
  router.push({ name: 'inventaire-liste' })
}
</script>

<template>
  <PageLayout :title="$t('inventaire.home.title')" :icon="ClipboardDocumentCheckIcon">

    <!-- ── Instructions ────────────────────────────────────────────── -->
    <div class="mb-8 mx-auto">
      <h3 class="font-semibold mb-2">{{ $t('inventaire.home.instructions.title') }}</h3>
      <ul class="flex flex-col gap-1 text-sm text-gray-600">
        <li>{{ $t('inventaire.home.instructions.zone_number') }}</li>
        <li>{{ $t('inventaire.home.instructions.scan') }}</li>
        <li>{{ $t('inventaire.home.instructions.count') }}</li>
        <li>{{ $t('inventaire.home.instructions.restart') }}</li>
        <li>{{ $t('inventaire.home.instructions.send') }}</li>
      </ul>
      <p class="mt-4 text-sm">{{ $t('inventaire.home.good_luck') }}</p>
    </div>

    <!-- ── Sélection de zone ───────────────────────────────────────── -->
    <div class="mx-auto max-w-sm">

      <!-- Chargement -->
      <div v-if="!sessionCourante && zones.length === 0"
           class="text-center text-gray-400 text-sm py-4">
        {{ $t('inventaire.home.zones_loading') }}
      </div>

      <!-- Mode session active -->
      <template v-else-if="zonesSession">
        <p class="text-sm font-medium text-gray-700 mb-3">{{ $t('inventaire.home.zone_number') }}</p>

        <!-- Message de conflit -->
        <div v-if="conflictMessage"
             class="mb-3 px-4 py-3 rounded-lg bg-orange-50 border border-orange-300 text-orange-800 text-sm">
          {{ conflictMessage }}
        </div>

        <!-- Aucune zone disponible -->
        <p v-if="zonesSession.length === 0"
           class="text-sm text-gray-400 text-center py-4">
          {{ $t('inventaire.home.session_no_zones') }}
        </p>

        <div class="flex flex-col gap-2">
          <button
            v-for="entry in zonesSession"
            :key="entry.zone.id"
            @click="choisirZone(entry.zone)"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-colors"
            :class="isSelected(entry.zone)
              ? (entry.label === 'deuxieme' ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-blue-600 bg-blue-50 text-blue-800')
              : 'border-gray-200 bg-white hover:border-gray-300'"
          >
            <span class="font-mono font-bold text-lg w-10 shrink-0">
              {{ String(entry.zone.id).padStart(3, '0') }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="font-medium truncate">{{ entry.zone.name }}</div>
              <div v-if="entry.suggestion"
                   class="text-xs"
                   :class="entry.label === 'deuxieme' ? 'text-indigo-500' : 'text-blue-500'">
                {{ entry.label === 'deuxieme' ? $t('inventaire.home.session_deuxieme') : $t('inventaire.home.session_premier') }}
                · {{ $t('inventaire.home.session_suggestion') }}
              </div>
              <div v-else
                   class="text-xs text-gray-400">
                {{ entry.label === 'deuxieme' ? $t('inventaire.home.session_deuxieme') : $t('inventaire.home.session_premier') }}
              </div>
            </div>
          </button>
        </div>
      </template>

      <!-- Mode sans session : liste de toutes les zones actives -->
      <template v-else>
        <p class="text-sm font-medium text-gray-700 mb-3">{{ $t('inventaire.home.zone_number') }}</p>
        <div class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          <button
            v-for="z in zones"
            :key="z.id"
            @click="selectZone(z)"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-colors"
            :class="isSelected(z)
              ? 'border-blue-600 bg-blue-50 text-blue-800'
              : 'border-gray-200 bg-white hover:border-gray-300'"
          >
            <span class="font-mono font-bold text-lg w-10 shrink-0">
              {{ String(z.id).padStart(3, '0') }}
            </span>
            <div class="min-w-0">
              <div class="font-medium truncate">{{ z.name }}</div>
              <div v-if="z.description" class="text-xs text-gray-500 truncate">{{ z.description }}</div>
            </div>
          </button>
        </div>
      </template>
    </div>

    <!-- ── Bouton démarrer ─────────────────────────────────────────── -->
    <div class="text-center mt-6">
      <PrimaryButton @click="submitZone()" :disabled="!zone">
        {{ !products.size ? $t('inventaire.home.start') : $t('inventaire.home.continue') }}
      </PrimaryButton>
    </div>

  </PageLayout>
</template>
