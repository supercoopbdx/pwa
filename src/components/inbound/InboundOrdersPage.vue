<script setup lang="ts">
import { useInboundStore } from '@/stores/inbound.ts'
import PageLayout from '@/layout/PageLayout.vue'
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  HashtagIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
import { onBeforeMount, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

const { getOrders } = useInboundStore()
const { orders } = storeToRefs(useInboundStore())
const loading = ref(true)
const searchQuery = ref('')

/**
 * Filtre les commandes selon :
 * - Numéro de PO
 * - Nom du fournisseur
 */
const filteredOrders = computed(() => {
  if (!orders.value || !searchQuery.value) {
    return orders.value ?? new Map()
  }


  const query = searchQuery.value.toLowerCase().trim()

  return new Map(
    Array.from(orders.value.entries()).filter(([po, order]) => {
      return (
        po.toLowerCase().includes(query) ||
        order.provider.toLowerCase().includes(query)
      )
    })
  )
})


onBeforeMount(async () => {
  await getOrders()
  loading.value = false
})
</script>

<template>
  <PageLayout :title="$t('inbound.order-list.title')" :icon="TruckIcon">
    <!-- Barre de recherche (affichée uniquement quand les données sont chargées) -->
    <div v-if="!loading" class="relative mb-4">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="$t('inbound.order-list.search_placeholder')"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      />
    </div>

    <!-- Chargement -->
    <div v-if="loading">
      <h3 class="text-center text-xl">
        {{ $t('inbound.order-list.loading') }}
      </h3>
    </div>

    <!-- Aucun résultat -->
    <div v-else-if="!filteredOrders.size">
      <p class="text-center text-gray-500">
        {{ $t('inbound.order-list.no_results') }}
      </p>
    </div>

     <ul v-else class="divide-y divide-gray-200 mx-auto flex flex-col gap-2">
      <li
        v-for="[po, order] in filteredOrders"
        :key="po"
        class="sm:pb-4"
        :class="{ 'opacity-60': order.is_already_processed }"
      >
        <div class="flex items-center space-x-4 rtl:space-x-reverse">

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 flex items-center gap-2">
              {{ order.provider }}

              <!-- Icône commande réceptionnée -->
              <CheckCircleIcon
                v-if="order.is_already_processed"
                class="h-5 w-5 text-green-600"
                title="Commande déjà réceptionnée"
              />
            </p>
            <p class="text-sm text-gray-500">
              <CalendarDaysIcon class="h-5 inline align-text-bottom" />
              {{ new Date(order.date).toLocaleDateString() }}
              <br />
              <HashtagIcon class="h-5 inline align-text-bottom" />
              {{ order.po }}
            </p>
          </div>

          <div class="inline-flex items-center text-base font-semibold text-gray-900">
            {{ order.n_products }}
          </div>

          <PrimaryButton
            @click="$router.push({ name: 'inbound-products', params: { po } })"
          >
            <ChevronRightIcon class="w-7 h-7" />
          </PrimaryButton>
        </div>
      </li>
    </ul>
  </PageLayout>
</template>