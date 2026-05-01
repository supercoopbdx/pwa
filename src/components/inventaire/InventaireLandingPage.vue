<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import { useInventaireStore } from '@/stores/inventaire'
import { storeToRefs } from 'pinia'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'
import type { Zone } from '@/stores/inventaire'
import axios from 'axios'

const stockStore = useInventaireStore()
const router = useRouter()
const { zone, sessionCourante, zonesComptees, products } = storeToRefs(stockStore)

const comptageEnCours = computed(() => zone.value !== '' && products.value.size > 0)

const conflictMessage = ref<string | null>(null)
const loaded = ref(false)

onMounted(async () => {
  await stockStore.fetchSessionCourante()
  loaded.value = true
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

  if (sessionCourante.value) {
    try {
      await stockStore.debutComptage(z.id)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const par = err.response.data?.comptage_par
        conflictMessage.value = par
          ? `Cette zone a déjà été prise par ${par}.`
          : `Cette zone n'est plus disponible.`
      } else {
        conflictMessage.value = `Impossible de prendre la zone (problème réseau ou serveur). Veuillez réessayer.`
      }
      await stockStore.fetchSessionCourante()
      return
    }
  }

  zone.value = String(z.id).padStart(3, '0')
  stockStore.saveZone()
  stockStore.reset()
  router.push({ name: 'inventaire-liste' })
}

function isSelected(z: Zone) {
  return zone.value === String(z.id).padStart(3, '0')
}

function reprendreComptage() {
  router.push({ name: 'inventaire-liste' })
}

async function annulerComptageEnCours() {
  if (zone.value && sessionCourante.value) {
    const zoneId = parseInt(zone.value, 10)
    try {
      await stockStore.annulerComptage(zoneId)
    } catch {
      // ignore errors on cancel
    }
    await stockStore.fetchSessionCourante()
  }
  stockStore.reset()
  zone.value = ''
  stockStore.saveZone()
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
      <div v-if="!loaded"
           class="text-center text-gray-400 text-sm py-4">
        {{ $t('inventaire.home.zones_loading') }}
      </div>

      <!-- Aucune session active -->
      <div v-else-if="!sessionCourante"
           class="text-center text-gray-500 text-sm py-6 px-4 rounded-lg bg-gray-50 border border-gray-200">
        {{ $t('inventaire.home.no_session') }}
      </div>

      <!-- Session active -->
      <template v-else>

        <!-- Comptage en cours (app quittée puis reprise) -->
        <div v-if="comptageEnCours"
             class="px-4 py-3 rounded-lg bg-blue-50 border border-blue-200">
          <p class="text-sm font-medium text-blue-800 mb-2">
            {{ $t('inventaire.home.resume_title', { zone }) }}
          </p>
          <div class="flex gap-2">
            <button @click="reprendreComptage"
                    class="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              {{ $t('inventaire.home.resume_continue') }}
            </button>
            <button @click="annulerComptageEnCours"
                    class="flex-1 px-3 py-2 rounded-lg border border-blue-300 text-blue-700 text-sm hover:bg-blue-100 transition-colors">
              {{ $t('inventaire.home.resume_cancel') }}
            </button>
          </div>
        </div>

        <!-- Sélection d'une nouvelle zone -->
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

      </template>
    </div>

  </PageLayout>
</template>
