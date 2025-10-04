import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'

export const useStockStore = defineStore('stock', () => {
  const zone = ref(localStorage.getItem('stock-zone') ?? '')
  const products: Ref<object> = ref(JSON.parse(localStorage.getItem('stock-products') ?? '{}'))
  const productsInfo: Ref<object> = ref({})
  const loading = ref(false)

  function saveZone() {
    localStorage.setItem('stock-zone', zone.value)
  }

  function getProduct(barcode: string) {
    return products.value[barcode]
  }

  async function getProductInfo(barcode: string): Promise<StockProductInfo> {
    console.log('getProductInfo', barcode, productsInfo.value[barcode])

    const infos = productsInfo.value[barcode]
    if (infos) return infos

    loading.value = true

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          status: 200,
          json: function () {
            return {
              product: { name: `Product #${barcode}` },
              image_base64: 'my fake base 64 image',
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

        productsInfo.value[barcode] = {
          name: result.product.name,
          image: result.image_base64,
          found: true,
        }

        return productsInfo.value[barcode]
      })
      .finally(() => {
        loading.value = false
      })
  }

  function saveProduct(barcode: string, quantity: number, oldBarcode?: string) {
    products.value[barcode] = { barcode, quantity, ...productsInfo.value[barcode] }

    if (oldBarcode && oldBarcode !== barcode) {
      removeProduct(oldBarcode)
    }

    localStorage.setItem('stock-products', JSON.stringify(products.value))
  }

  function removeProduct(barcode: string) {
    delete products.value[barcode]

    localStorage.setItem('stock-products', JSON.stringify(products.value))
  }

  function reset() {
    products.value = []

    localStorage.setItem('stock-products', JSON.stringify(products.value))
  }

  return {
    loading,
    zone,
    products,
    productsInfo,
    getProduct,
    getProductInfo,
    saveZone,
    saveProduct,
    removeProduct,
    reset,
  }
})
