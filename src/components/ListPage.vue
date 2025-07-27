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
</script>

<template>
  <PageLayout :title="$t('nav.list', { zone: store.zone })">
    <div class="flex flex-col gap-2">
      <RouterLink to="/scan" class="m-auto">
        <PrimaryButton class="text-2xl px-10 py-5">{{ $t('button.scan_barcode') }}</PrimaryButton>
      </RouterLink>
    </div>

    <TableLayout v-if="items.length">
      <template v-slot:thead>
        <tr>
          <TableHead>{{ $t('list.barcode') }}</TableHead>
          <TableHead>{{ $t('list.quantity') }}</TableHead>
          <TableHead>{{ $t('list.name') }}</TableHead>
          <TableHead>{{ $t('list.image') }}</TableHead>
          <TableHead class="w-10"></TableHead>
        </tr>
      </template>
      <template v-slot:tbody>
        <TableRow v-for="item in items" :key="item.barcode">
          <TableCell>{{ item.barcode }}</TableCell>
          <TableCell>{{ item.quantity }}</TableCell>
          <TableCell>{{ productInfo[item.barcode]?.name || 'Produit inconnu' }}</TableCell>
          <TableCell>
            <img v-if="productInfo[item.barcode]?.image" 
                 :src="`data:image/png;base64,${productInfo[item.barcode].image}`" 
                 :alt="productInfo[item.barcode]?.name || 'Produit inconnu'"
                 class="w-10 h-10 object-contain" />
          </TableCell>
          <TableCell>
            <ButtonBase @click="removeItem(item.barcode)">
              <TrashIcon class="w-5 h-5"></TrashIcon>
            </ButtonBase>
          </TableCell>
        </TableRow>
      </template>
    </TableLayout>
    <div v-else>
      {{ $t('list.empty') }}
    </div>

    <div class="flex flex-row gap-2 justify-between">
      <SecondaryButton @click="back()">{{ $t('button.back') }}</SecondaryButton>
      <div class="flex flex-row gap-4">
        <CancelButton @click="reset()">{{ $t('button.reset') }}</CancelButton>
        <PrimaryButton @click="send()" :disabled="!items.length">
          {{ $t('button.send_list') }}
        </PrimaryButton>
      </div>
    </div>
  </PageLayout>
</template>
