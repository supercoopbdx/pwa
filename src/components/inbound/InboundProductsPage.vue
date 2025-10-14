<script setup lang="ts">
import { useInboundStore } from '@/stores/inbound.ts'
import PageLayout from '@/layout/PageLayout.vue'
import { TruckIcon } from '@heroicons/vue/24/outline'
import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
import { useRoute } from 'vue-router'
import { onBeforeMount, ref, Ref } from 'vue'

const { getOrder } = useInboundStore()

const po = useRoute().params.po.toString()
const order: Ref<InboundOrder | undefined> = ref()

onBeforeMount(async () => {
  order.value = await getOrder(po)
})
</script>

<template>
  <PageLayout :title="po" :icon="TruckIcon">
    <ul v-if="order" class="divide-y divide-gray-200 mx-auto max-h-full flex flex-col gap-2 my-5">
      <li v-for="[barcode, product] in order.products" :key="barcode" class="sm:pb-4">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="flex-1 min-w-0 grow">
            <p class="text-sm font-medium text-gray-900 text-clip">
              {{ product.name }}
            </p>
            <p class="text-sm text-gray-500">
              <!--              <CalendarDaysIcon class="h-5 inline align-text-bottom" />-->
              <!--              {{ order.date.toLocaleDateString() }}<br />-->
              <!--              <HashtagIcon class="h-5 inline align-text-bottom" />-->
              <!--              {{ order.po }}-->
            </p>
          </div>
          <div class="inline-flex items-center text-base font-semibold text-gray-900">
            {{ product.parcels * product.packSize }} {{ $t('') }}
          </div>

          <!--          <PrimaryButton>-->
          <!--            <ChevronRightIcon class="w-7 h-7" />-->
          <!--          </PrimaryButton>-->
        </div>
      </li>
    </ul>
    <template #footer>
      <RouterLink :to="{ name: 'inbound-orders' }">
        <SecondaryButton>{{ $t('inbound.button.back') }}</SecondaryButton>
      </RouterLink>
    </template>
  </PageLayout>
</template>
