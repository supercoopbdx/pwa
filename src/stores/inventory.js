import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const zone = ref(JSON.parse(localStorage.getItem('zone')))
  const products = ref(JSON.parse(localStorage.getItem('items')) ?? {})

  async function fetchProductInfo(barcode) {
    if (products.value[barcode]?.name) {
      return products.value[barcode]
    }

    try {
      const response = await fetch('http://localhost:5000/product-info-from-barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })
      if (!response.ok) {
        throw new Error('Erreur serveur')
      }
      const data = await response.json()
      return {
        name: data.product.name,
        image: data.image_base64
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations du produit:', error)
      return {
        name: 'Produit inconnu',
        image: '/image-not-found-icon.svg'
      }
    }
  }

  function saveZone() {
    localStorage.setItem('zone', JSON.stringify(zone.value))
  }

  function setItem(barcode, quantity, oldBarcode, name = 'Produit inconnu', image = '/image-not-found-icon.svg') {
    console.log('store item', barcode, quantity, name, image)
    products.value[barcode] = {
      barcode,
      quantity,
      name,
      image
    }

    if (oldBarcode !== barcode) {
      removeItem(oldBarcode)
    }

    localStorage.setItem('items', JSON.stringify(products.value))
  }

  function removeItem(barcode) {
    delete products.value[barcode]

    localStorage.setItem('items', JSON.stringify(products.value))
  }

  function reset() {
    products.value = {}

    localStorage.setItem('items', JSON.stringify(products.value))
  }

  return { 
    zone, 
    products, 
    saveZone, 
    setItem, 
    removeItem, 
    fetchProductInfo, 
    reset 
  }
})
