import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInventoryStore = defineStore('inventory', () => {
  const zone = ref(JSON.parse(localStorage.getItem('zone')))
  const itemList = ref(JSON.parse(localStorage.getItem('items')) ?? {})

  function saveZone() {
    localStorage.setItem('zone', JSON.stringify(zone.value))
  }

  function addItem(barcode, amount) {
    itemList.value[barcode] = {
      barcode,
      amount,
    }

    localStorage.setItem('items', JSON.stringify(itemList.value))
  }

  function removeItem(barcode) {
    delete itemList.value[barcode]

    localStorage.setItem('items', JSON.stringify(itemList.value))
  }

  function reset() {
    itemList.value = {}

    localStorage.setItem('items', JSON.stringify(itemList.value))
  }

  return { zone, itemList, saveZone, addItem, removeItem, reset }
})
