import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import config from '@/config'

export const useStockStore = defineStore('stock', () => {
  const zone = ref('')
  const products = ref([])

  // TODO : clean this
  async function fetchProductInfo(barcode: string) {
    const response = await fetch(config.backend.baseURL + '/product-info-from-barcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode }),
    })

    const result = await response.json()

    if (!response.ok) {
      if (result.error === 'unauthenticated') {
        // router.push({ name: 'home', query: { authMessage: errorData.authMessage } })
      } else {
        console.error('Erreur lors de la récupération des informations du produit:', result)
        return {
          name: 'Produit inconnu',
          image: '/image-not-found-icon.svg',
        }
      }
    }

    return {
      name: result.product.name,
      image: result.image_base64,
    }
  }

  function saveZone() {
    localStorage.setItem('zone', JSON.stringify(zone.value))
  }

  function setItem(
    barcode: string,
    quantity: number,
    oldBarcode: string,
    name = 'Produit inconnu',
    image = '/image-not-found-icon.svg',
  ) {
    console.log('store item', barcode, quantity, name, image)
    products.value[barcode] = {
      barcode,
      quantity,
      name,
      image,
    }

    if (oldBarcode !== barcode) {
      removeItem(oldBarcode)
    }

    localStorage.setItem('items', JSON.stringify(products.value))
  }

  function removeItem(barcode: string) {
    delete products.value[barcode]

    localStorage.setItem('items', JSON.stringify(products.value))
  }

  function reset() {
    products.value = {}

    localStorage.setItem('items', JSON.stringify(products.value))
  }

  onMounted(() => {
    zone.value = localStorage.getItem('zone') ?? ''
    products.value = JSON.parse(localStorage.getItem('items') ?? '{}')

    console.log('stock mounted', zone.value, products.value)
  })

  return {
    zone,
    products,
    saveZone,
    setItem,
    removeItem,
    fetchProductInfo,
    reset,
  }
})
