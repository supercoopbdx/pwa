import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const zone = ref(JSON.parse(localStorage.getItem('zone')))
  const products = ref(JSON.parse(localStorage.getItem('items')) ?? {})

  function saveZone() {
    localStorage.setItem('zone', JSON.stringify(zone.value))
  }

  function setItem(barcode, quantity, oldBarcode) {
    console.log('store item', barcode, quantity)
    products.value[barcode] = {
      barcode,
      quantity,
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

  return { zone, products, saveZone, setItem, removeItem, reset }
})
