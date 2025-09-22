<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import TableHead from '@/components/tables/TableHead.vue'
import TableRow from '@/components/tables/TableRow.vue'
import TableCell from '@/components/tables/TableCell.vue'
import TableLayout from '@/layout/TableLayout.vue'
import ButtonBase from '@/components/buttons/ButtonBase.vue'
import CancelButton from '@/components/buttons/CancelButton.vue'
import { useInventoryStore } from '@/stores/inventory.js'
import { TrashIcon } from '@heroicons/vue/24/outline/index.js'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const store = useInventoryStore()

const items = computed(() => Object.values(store.products))

if (!store.zone) {
  router.push({ path: '/' })
}

// Get product info directly from products objects
const productInfo = computed(() => {
  return items.value.reduce((acc, item) => {
    acc[item.barcode] = {
      name: item.name,
      image: item.image
    }
    return acc
  }, {})
})

function removeItem(barcode) {
  store.removeItem(barcode)
}

function back() {
  router.push({ path: '/' })
}

function reset() {
  if (confirm(t('list.reset'))) {
    store.reset()
  }
}

function send() {
  router.push({ path: '/send' })
}
import { ref } from 'vue'
const showPopup = ref(false)
const popupTop = ref(0)
const popupLeft = ref(0)
const popupContent = ref('')

function openPopup(event, content) {
  const cell = event.currentTarget
  const rect = cell.getBoundingClientRect()

  // Position du popup
  popupTop.value = rect.top + window.scrollY
  popupLeft.value = Math.min(rect.left, window.innerWidth - 300) // 300 = max-width

  // Contenu du popup
  popupContent.value = content

  // Toujours fermer le popup précédent avant d’ouvrir
  showPopup.value = false
  // et le réouvrir dans le prochain tick
  setTimeout(() => {
    showPopup.value = true
  }, 0)
}
</script>

<template>
  <PageLayout :title="$t('nav.list', { zone: store.zone })">
    <div class="flex flex-col min-h-screen pb-24">
      <!-- Bouton scanner centré avec marge -->
      <div class="flex justify-center mt-6 mb-6">
        <RouterLink to="/scan">
          <PrimaryButton class="text-2xl px-10 py-5">
            {{ $t('button.scan_barcode') }}
          </PrimaryButton>
        </RouterLink>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8">
        <TableLayout v-if="items.length">
          <template v-slot:thead>
            <tr>
              <TableHead>{{ $t('list.image') }}</TableHead>
              <TableHead>{{ $t('list.quantity') }}</TableHead>
              <TableHead class="truncate max-w-[150px]">{{ $t('list.name') }}</TableHead>
              <TableHead class="truncate max-w-[150px]">{{ $t('list.barcode') }}</TableHead>
              <TableHead class="w-10"></TableHead>
            </tr>
          </template>
          <template v-slot:tbody>
            <TableRow v-for="item in items" :key="item.barcode">
              <!-- image -->
              <TableCell>
                <img v-if="productInfo[item.barcode]?.image" 
                    :src="`data:image/png;base64,${productInfo[item.barcode].image}`" 
                    :alt="productInfo[item.barcode]?.name || 'Produit inconnu'"
                    class="w-10 h-10 object-contain" />
              </TableCell>

              <!-- quantité (pas tronqué) -->
              <TableCell>{{ item.quantity }}</TableCell>

              <TableCell class="truncate max-w-[150px]">
                <div 
                  @click="openPopup($event, productInfo[item.barcode]?.name || 'Produit inconnu')" 
                  class="cursor-pointer"
                >
                  {{ productInfo[item.barcode]?.name || 'Produit inconnu' }}
                </div>

                <div
                  v-if="showPopup"
                  class="fixed z-50 bg-white border shadow-lg p-2 rounded max-w-xs break-words"
                  :style="{ top: `${popupTop}px`, left: `${popupLeft}px` }"
                  @click.outside="showPopup = false"
                >
                  {{ popupContent }}
                </div>
              </TableCell>

              <!-- barcode tronqué -->
              <TableCell class="truncate max-w-[150px]">
                {{ item.barcode }}
              </TableCell>

              <!-- bouton poubelle -->
              <TableCell>
                <ButtonBase @click="removeItem(item.barcode)">
                  <TrashIcon class="w-5 h-5"></TrashIcon>
                </ButtonBase>
              </TableCell>
            </TableRow>
          </template>
        </TableLayout>

        <div v-else class="text-center text-gray-500">
          {{ $t('list.empty') }}
        </div>
      </div>
    </div>

    <!-- Boutons fixes en bas -->
    <template #footer>
      <SecondaryButton @click="back()">{{ $t('button.back') }}</SecondaryButton>
      <div class="flex gap-4">
        <CancelButton @click="reset()">{{ $t('button.reset') }}</CancelButton>
        <PrimaryButton @click="send()" :disabled="!items.length">
          {{ $t('button.send_list') }}
        </PrimaryButton>
      </div>
    </template>

  </PageLayout>
</template>

