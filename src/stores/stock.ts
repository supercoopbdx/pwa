import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'

export const useStockStore = defineStore('stock', () => {
  const zone = ref(localStorage.getItem('stock-zone') ?? '')
  const products: Ref<Map<string, StockProduct>> = ref(loadStorageProducts())
  const productsInfo: Ref<Map<string, StockProductInfo>> = ref(new Map())
  const loading = ref(false)

  function saveZone() {
    localStorage.setItem('stock-zone', zone.value)
  }

  function loadStorageProducts() {
    const stored = localStorage.getItem('stock-products')
    return stored ? new Map<string, StockProduct>(JSON.parse(stored)) : new Map<string, StockProduct>()
  }

  function persistProducts() {
    localStorage.setItem('stock-products', JSON.stringify(Array.from(products.value)))
  }

  async function getProductInfo(barcode: string): Promise<StockProductInfo> {
    console.log('getProductInfo', barcode, products.value.get(barcode))

    const infos = productsInfo.value.get(barcode)
    if (infos) return infos

    loading.value = true

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: function () {
            return {
              product: {
                name: `Assiette Quinotto Végétal Potimarrons Champignons Chèvre +12m 230g VBB`,
              },
              image_base64:
                'data:image/png;base64,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',
            }
          },
        })
      }, 1000)
      // }))
      // return fetch(config.backend.baseURL + '/product-info-from-barcode', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ barcode }),
    })
      .then((response) => {
        if (!response.ok) {
          switch (response.status) {
            case 401:
              useAuthStore().login()
              break
            case 403:
              // TODO : check what to do if not authorized
              break
            default:
          }

          return { found: true }
        }

        const result = response.json()
        const formatted = {
          name: result.product.name,
          image: result.image_base64,
          found: true,
        }

        productsInfo.value.set(barcode, formatted)

        return formatted
      })
      .finally(() => {
        loading.value = false
      })
  }

  function addProduct(barcode: string, quantity: number, oldBarcode?: string) {
    products.value.set(barcode, {
      barcode,
      quantity,
      ...(productsInfo.value.get(barcode) ?? { found: false }),
    })

    if (oldBarcode && oldBarcode !== barcode) products.value.delete(barcode)

    persistProducts()
  }

  function removeProduct(barcode: string) {
    products.value.delete(barcode)
    persistProducts()
  }

  function reset() {
    products.value.clear()
    persistProducts()
  }

  return {
    loading,
    zone,
    products,
    productsInfo,
    getProductInfo,
    saveZone,
    addProduct,
    removeProduct,
    reset,
  }
})
