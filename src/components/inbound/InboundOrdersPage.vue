<script setup lang="ts">
import { useInboundStore } from '@/stores/inbound.ts'
import PageLayout from '@/layout/PageLayout.vue'
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  HashtagIcon,
  TruckIcon,
} from '@heroicons/vue/24/outline'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'

const { getOrders } = useInboundStore()
const orders = getOrders()
</script>

<template>
  <PageLayout :title="$t('inbound.order-list.title')" :icon="TruckIcon">
    <ul class="divide-y divide-gray-200 mx-auto max-h-full flex flex-col gap-2 my-5">
      <li v-for="[po, order] in orders" :key="po" class="sm:pb-4">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="flex-1 min-w-0 grow">
            <p class="text-sm font-medium text-gray-900 text-clip">
              {{ order.provider }}
            </p>
            <p class="text-sm text-gray-500">
              <CalendarDaysIcon class="h-5 inline align-text-bottom" />
              {{ order.date.toLocaleDateString() }}<br />
              <HashtagIcon class="h-5 inline align-text-bottom" />
              {{ order.po }}
            </p>
          </div>
          <div class="inline-flex items-center text-base font-semibold text-gray-900">
            {{ order.products.size }}
          </div>

          <PrimaryButton @click="$router.push({ name: 'inbound-products', params: { po } })">
            <ChevronRightIcon class="w-7 h-7" />
          </PrimaryButton>
        </div>
      </li>
    </ul>
  </PageLayout>
</template>
