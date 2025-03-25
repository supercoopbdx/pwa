<script setup>
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import TableHead from '@/components/tables/TableHead.vue'
import TableRow from '@/components/tables/TableRow.vue'
import TableCell from '@/components/tables/TableCell.vue'
import TableLayout from '@/layout/TableLayout.vue'
import { TrashIcon } from '@heroicons/vue/24/outline/index.js'
import { useInventoryStore } from '@/stores/inventory.js'
import ButtonBase from '@/components/buttons/ButtonBase.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const store = useInventoryStore()

const items = computed(() => Object.values(store.itemList))

if (!store.zone) {
  router.push({ path: '/' })
}

function removeItem(barcode) {
  store.removeItem(barcode)
}
</script>

<template>
  <PageLayout :title="$t('nav.list', { zone: store.zone })">
    <div class="flex flex-col gap-2">
      <RouterLink to="/scan">
        <PrimaryButton class="text-2xl px-10 py-5">{{ $t('button.scan_barcode') }}</PrimaryButton>
      </RouterLink>
      <RouterLink to="/form">
        <SecondaryButton class="text-sm">{{ $t('button.manual_input') }}</SecondaryButton>
      </RouterLink>
    </div>

    <TableLayout v-if="items.length">
      <template v-slot:thead>
        <tr>
          <TableHead>{{ $t('list.barcode') }}</TableHead>
          <TableHead>{{ $t('list.amount') }}</TableHead>
          <TableHead class="w-10"></TableHead>
        </tr>
      </template>
      <template v-slot:tbody>
        <TableRow v-for="item in items" :key="item.barcode">
          <TableCell>
            <RouterLink
              :to="{ path: '/form', query: { barcode: item.barcode } }"
              class="font-medium text-blue-600 hover:underline"
            >
              {{ item.barcode }}
            </RouterLink>
          </TableCell>
          <TableCell>{{ item.amount }}</TableCell>
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
      <RouterLink to="/">
        <SecondaryButton>{{ $t('button.back') }}</SecondaryButton>
      </RouterLink>
      <RouterLink to="/send">
        <PrimaryButton>{{ $t('button.send_list') }}</PrimaryButton>
      </RouterLink>
    </div>
  </PageLayout>
</template>
