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
    return new Map<string, StockProduct>(JSON.parse(localStorage.getItem('stock-products') ?? ''))
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
                name: `Vestibulum molestie est in consectetur volutpat. Vestibulum dui magna, gravida et faucibus dignissim, aliquam non libero. Mauris tempus porta tortor, sed consequat odio mattis et. Mauris`,
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
