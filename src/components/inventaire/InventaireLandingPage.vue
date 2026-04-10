<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageLayout from '@/layout/PageLayout.vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { useInventaireStore } from '@/stores/inventaire'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'

const stockStore = useInventaireStore()
const router = useRouter()
const { zone, zones, products } = storeToRefs(stockStore)

onMounted(() => stockStore.fetchZones())

function submitZone() {
  stockStore.saveZone()
  router.push({ name: 'inventaire-liste' })
}
</script>

<template>
  <PageLayout :title="$t('inventaire.home.title')" :icon="ClipboardDocumentCheckIcon">
    <div class="mb-10 mx-auto">
      <h3 class="font-semibold mb-2">{{ $t('inventaire.home.instructions.title') }}</h3>
      <ul class="flex flex-col gap-2">
        <li>{{ $t('inventaire.home.instructions.zone_number') }}</li>
        <li>{{ $t('inventaire.home.instructions.scan') }}</li>
        <li>{{ $t('inventaire.home.instructions.count') }}</li>
        <li>{{ $t('inventaire.home.instructions.restart') }}</li>
        <li>{{ $t('inventaire.home.instructions.send') }}</li>
      </ul>
      <p class="mt-6">{{ $t('inventaire.home.good_luck') }}</p>
    </div>

    <div class="mx-auto max-w-xs">
      <div v-if="zones.length === 0" class="text-center text-gray-400 text-sm py-4">
        {{ $t('inventaire.home.zones_loading') }}
      </div>
      <div v-else class="flex flex-col gap-2">
        <p class="text-sm font-medium text-gray-700">{{ $t('inventaire.home.zone_number') }}</p>
        <div class="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          <button
            v-for="z in zones"
            :key="z.id"
            @click="zone = String(z.id).padStart(3, '0')"
            class="flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-left transition-colors"
            :class="zone === String(z.id).padStart(3, '0')
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
      </div>
    </div>

    <div class="text-center mt-6">
      <PrimaryButton @click="submitZone()" :disabled="!zone">
        {{ !products.size ? $t('inventaire.home.start') : $t('inventaire.home.continue') }}
      </PrimaryButton>
    </div>
  </PageLayout>
</template>
