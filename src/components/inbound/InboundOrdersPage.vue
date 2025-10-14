<script setup lang="ts">
import { useInboundStore } from '@/stores/inbound.ts'
import PageLayout from '@/layout/PageLayout.vue'
import { CalendarIcon, ChevronRightIcon, QueueListIcon, TruckIcon } from '@heroicons/vue/24/outline'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const { fetchInboundOrders } = useInboundStore()
const orders = fetchInboundOrders()
</script>

<template>
  <PageLayout :title="$t('inbound.order-list.title')" :icon="TruckIcon">
    <ul class="divide-y divide-gray-200 mx-auto">
      <li v-for="order in orders.values()" :key="order.po" class="pb-3 sm:pb-4">
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <div class="flex-col min-w-0">
            <p class="text-sm font-medium text-gray-900 text-clip">
              {{ order.provider }}
            </p>
            <p class="text-sm text-gray-500">
              <CalendarIcon class="h-6 inline align-middle" />
              {{ order.date.toLocaleDateString() }}<br />
              <QueueListIcon class="h-6 inline align-middle" />
              {{ order.po }}
            </p>
          </div>
          <div class="inline-flex items-center text-base font-semibold text-gray-900">
            {{ order.products.size }}
          </div>

          <PrimaryButton>
            <ChevronRightIcon class="w-7 h-7" />
          </PrimaryButton>
        </div>
        <hr class="mt-3 text-gray-400" />
      </li>
    </ul>
  </PageLayout>
</template>
