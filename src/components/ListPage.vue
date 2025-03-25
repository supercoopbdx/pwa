<script setup>
import { ref } from 'vue'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import PageLayout from '@/layout/PageLayout.vue'
import TableHead from '@/components/tables/TableHead.vue'
import TableRow from '@/components/tables/TableRow.vue'
import TableCell from '@/components/tables/TableCell.vue'
import TableLayout from '@/layout/TableLayout.vue'

const list = ref([
  { barcode: 1234567890, amount: 123 },
  { barcode: 1234567890, amount: 123 },
  { barcode: 1234567890, amount: 123 },
  { barcode: 1234567890, amount: 123 },
])
</script>

<template>
  <PageLayout :title="$t('nav.list', {zone: 123})">
    <RouterLink to="/scan">
      <PrimaryButton class="text-2xl px-10 py-5">{{ $t('button.scan_barcode') }}</PrimaryButton>
    </RouterLink>
    <RouterLink to="/form">
      <SecondaryButton class="text-sm">{{ $t('button.manual_input') }}</SecondaryButton>
    </RouterLink>

    <TableLayout>
      <template v-slot:thead>
        <tr>
          <TableHead>{{ $t('list.barcode') }}</TableHead>
          <TableHead>{{ $t('list.amount') }}</TableHead>
        </tr>
      </template>
      <template v-slot:tbody>
        <TableRow v-for="item in list" :key="item.barcode">
          <TableCell>
            <RouterLink
              :to="{ path: '/inputs', query: { barcode: item.barcode } }"
              class="font-medium text-blue-600 hover:underline"
            >
              {{ item.barcode }}
            </RouterLink>
          </TableCell>
          <TableCell>{{ item.amount }}</TableCell>
        </TableRow>
      </template>
    </TableLayout>

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
