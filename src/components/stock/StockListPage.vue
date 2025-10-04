<script setup lang="ts">
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import TableHead from '@/components/tables/TableHead.vue'
import TableRow from '@/components/tables/TableRow.vue'
import TableCell from '@/components/tables/TableCell.vue'
import TableLayout from '@/layout/TableLayout.vue'
import ButtonBase from '@/components/buttons/ButtonBase.vue'
import CancelButton from '@/components/buttons/CancelButton.vue'
import { useStockStore } from '@/stores/stock'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'

const router = useRouter()
const stockStore = useStockStore()
const { t } = useI18n()

const { products } = storeToRefs(stockStore)

if (!stockStore.zone) {
  router.push({ name: 'stock-landing' })
}

function removeItem(barcode: string) {
  stockStore.removeProduct(barcode)
}

function back() {
  router.push({ name: 'stock-landing' })
}

function reset() {
  if (confirm(t('stock.list.reset'))) {
    stockStore.reset()
  }
}

function send() {
  router.push({ path: '/send' })
}
</script>

<template>
  <PageLayout :title="$t('stock.list.title', { zone: stockStore.zone })">
    <div class="flex flex-col min-h-screen pb-24">
      <div class="flex justify-center mt-6 mb-6">
        <RouterLink :to="{ name: 'stock-scan' }">
          <PrimaryButton class="text-2xl px-10 py-5">
            {{ $t('stock.button.scan_barcode') }}
          </PrimaryButton>
        </RouterLink>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8">
        <TableLayout v-if="products.size">
          <template v-slot:thead>
            <tr>
              <TableHead>{{ $t('stock.list.image') }}</TableHead>
              <TableHead>{{ $t('stock.list.quantity') }}</TableHead>
              <TableHead>{{ $t('stock.list.name') }}</TableHead>
              <TableHead>{{ $t('stock.list.barcode') }}</TableHead>
              <TableHead class="w-10"></TableHead>
            </tr>
          </template>
          <template v-slot:tbody>
            <TableRow v-for="product in products.values()" :key="product.barcode">
              <!-- image -->
              <TableCell>
                <img
                  :src="
                    product.found
                      ? `data:image/png;base64,${product.image}`
                      : '/image-not-found-icon.svg'
                  "
                  class="w-15 h-15 object-contain"
                />
              </TableCell>

              <!-- quantité (pas tronqué) -->
              <TableCell>{{ product.quantity }}</TableCell>

              <TableCell>
                <div class="cursor-pointer">
                  {{ product.name ?? 'Produit inconnu' }}
                </div>
              </TableCell>

              <!-- barcode tronqué -->
              <TableCell>
                {{ product.barcode }}
              </TableCell>

              <!-- bouton poubelle -->
              <TableCell>
                <ButtonBase @click="removeItem(product.barcode)">
                  <TrashIcon class="w-7 h-7"></TrashIcon>
                </ButtonBase>
              </TableCell>
            </TableRow>
          </template>
        </TableLayout>

        <div v-else class="text-center text-gray-500">
          {{ $t('stock.list.empty') }}
        </div>
      </div>
    </div>

    <!-- Boutons fixes en bas -->
    <template #footer>
      <SecondaryButton @click="back()">{{ $t('stock.button.back') }}</SecondaryButton>
      <div class="flex gap-4">
        <CancelButton @click="reset()">{{ $t('stock.button.reset') }}</CancelButton>
        <PrimaryButton @click="send()" :disabled="!products.size">
          {{ $t('stock.button.send_list') }}
        </PrimaryButton>
      </div>
    </template>
  </PageLayout>
</template>
