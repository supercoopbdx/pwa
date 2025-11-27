import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import config from '@/config.ts'
import axios from 'axios'

export const useInboundStore = defineStore('orders', () => {
  const orders: Ref<Map<string, MappedInboundOrder> | null> = ref(null)
  const orders_lines: Ref<Map<string, InboundOrderLines>> = ref(new Map())

  async function getOrders() {

    orders.value = await axios
      .get(`${config.backend.baseURL}/orders/inbound`)
      .then((response: { data: InboundOrderResponse[] }) => {
        // TODO : handle errors
        return new Map(
          response.data.map((order) => [
            order.po,
            {
              po: order.po,
              provider: order.provider,
              date: new Date(order.date),
              n_products: order.n_products,
            },
          ]),
        )
      })
      .catch((error) => {
        console.error(error)
        alert(error.message)
        return null
      })

    return orders.value
  }


  async function getOrder(po: string): Promise<InboundOrderLines | undefined> {
    try {
      // Si déjà en cache, retourne directement
      if (orders_lines.value?.has(po)) {
        return orders_lines.value.get(po)
      }

      const response = await axios.get<InboundProduct[]>(`${config.backend.baseURL}/order/info`, {
        params: { po },
      })

      if (!response.data) return undefined

      // Transformer le tableau en Map
      const productsMap = new Map(response.data.map((p) => [p.barcode, p]))

      const orderLines: InboundOrderLines = { po, products: productsMap }

      orders_lines.value.set(po, orderLines)
      return orderLines
    } catch (error: any) {
      console.error(error)
      alert(error.message)
      return undefined
    }
  }

  async function getProduct(po: string, barcode: string): Promise<InboundProduct | undefined> {
    // Si les lignes sont déjà en cache
    if (orders_lines.value?.has(po)) {
      return orders_lines.value.get(po)?.products.get(barcode)
    }

    // Sinon, récupérer depuis le backend et mettre en cache
    const orderLines = await getOrder(po)
    return orderLines?.products.get(barcode)
  }

  async function productCountValid(po: string, barcode: string) {
    const product = await getProduct(po, barcode)
    if (!product) throw new Error('product not found')
    product.inbound = { ok: true }
  }

  async function productCountError(po: string, barcode: string, received: number, comment: string) {
    const product = await getProduct(po, barcode)
    if (!product) throw new Error('product not found')
    product.inbound = { ok: false, received, comment }
  }

  async function sendOrder(po: string) {
    const order = orders_lines.value?.get(po)
    if (!order) throw new Error('Order not found')

    // TODO : make this work in the backend
    return axios
      .post(`${config.backend.baseURL}/orders/inbound/process/${po}`, {
        products: Array.from(order.products.values() ?? []).map(
          ({ barcode, inbound }) => {
            return {
              barcode,
              ok: inbound?.ok,
              received: inbound?.received,
              comment: inbound?.comment,
            }
          },
        ),
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error(error)
        alert(error.message)
      })
  }

  return {
    orders,
    getOrders,
    getOrder,
    getProduct,
    productCountValid,
    productCountError,
    sendOrder,
  }
})
