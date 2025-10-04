import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.ts'


export const useStockStore = defineStore('stock', () => {
  const zone = ref(localStorage.getItem('stock-zone') ?? '')
  const products: Ref<Array<StockProduct>> = ref(
    JSON.parse(localStorage.getItem('stock-products') ?? '[]'),
  )
  const productsInfo: Ref<Array<StockProductInfo>> = ref([])
  const loading = ref(false)

  function saveZone() {
    localStorage.setItem('stock-zone', zone.value)
  }

  function getProduct(barcode: string) {
    return products.value[parseInt(barcode)]
  }

  async function getProductInfo(barcode: string): Promise<StockProductInfo> {
    console.log('getProductInfo', barcode, productsInfo.value[parseInt(barcode)])

    const infos = productsInfo.value[parseInt(barcode)]
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

        productsInfo.value[parseInt(barcode)] = {
          name: result.product.name,
          image: result.image_base64,
          found: true,
        }

        return productsInfo.value[parseInt(barcode)]
      })
      .finally(() => {
        loading.value = false
      })
  }

  function saveProduct(barcode: string, quantity: number, oldBarcode?: string) {
    products.value[parseInt(barcode)] = { barcode, quantity }

    if (oldBarcode && oldBarcode !== barcode) {
      removeProduct(oldBarcode)
    }

    const productsWithInfos = products.value.map((product) => {
      return {...product, ...productsInfo.value[parseInt(product.barcode)]}
    })

    localStorage.setItem(
      'stock-products',
      JSON.stringify(productsWithInfos),
    )
  }

  function removeProduct(barcode: string) {
    delete products.value[parseInt(barcode)]

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
