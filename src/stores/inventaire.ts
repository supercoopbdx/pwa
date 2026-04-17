import { defineStore } from 'pinia'
import { Ref, ref } from 'vue'
import axios from 'axios'
import config from '@/config.ts'
import { useNotificationStore } from '@/stores/notifications.ts'

export type Zone = { id: number; name: string; description: string | null; is_active: boolean }

export type SessionCourante = {
  session_type: 'complet' | 'tournant'
  suggestion_premier: Zone | null
  suggestion_deuxieme: Zone | null
  zones_premier_comptage: Zone[]
  zones_deuxieme_comptage: Zone[]
}

export const useInventaireStore = defineStore('inventaire', () => {
  const { notify } = useNotificationStore()
  const zone = ref(localStorage.getItem('inventaire-zone') ?? '')
  const zones = ref<Zone[]>([])
  const sessionCourante = ref<SessionCourante | null>(null)
  const zonesComptees = ref<Set<number>>(
    new Set(JSON.parse(localStorage.getItem('inventaire-zones-comptees') ?? '[]'))
  )
  const products: Ref<Map<string, StockProduct>> = ref(loadStorageProducts())
  const productsInfo: Ref<Map<string, StockProductInfo>> = ref(new Map())

  async function fetchZones() {
    const response = await axios.get(`${config.backend.baseURL}/zones`)
    zones.value = response.data
  }

  async function fetchSessionCourante() {
    const response = await axios.get(`${config.backend.baseURL}/session-inventaire/courante`)
    sessionCourante.value = response.data  // null si aucune session active
    // Fallback : si pas de session, charger toutes les zones actives
    if (!sessionCourante.value) {
      await fetchZones()
    }
  }

  function saveZone() {
    localStorage.setItem('inventaire-zone', zone.value)
  }

  function loadStorageProducts() {
    const stored = localStorage.getItem('inventaire-products')
    return stored
      ? new Map<string, StockProduct>(JSON.parse(stored))
      : new Map<string, StockProduct>()
  }

  function persistProducts() {
    localStorage.setItem('inventaire-products', JSON.stringify(Array.from(products.value)))
  }

  async function getProductInfo(barcode: string): Promise<StockProductInfo> {
    const infos = productsInfo.value.get(barcode)
    if (infos) return infos

    return axios
      .get(`${config.backend.baseURL}/product/info?barcode=${barcode}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(error)
        notify(error.message)
      })
  }

  function addProduct(barcode: string, quantity: number, found: boolean, name: string, image_url: string, uom_id?: number, uom_label?: string, uom_is_decimal?: boolean) {
    products.value.set(barcode, {
      barcode,
      quantity,
      found,
      name,
      image_url,
      uom_id,
      uom_label,
      uom_is_decimal,
    })
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

  async function debutComptage(zoneId: number): Promise<void> {
    await axios.post(`${config.backend.baseURL}/session-inventaire/zones/${zoneId}/debut-comptage`)
  }

  async function annulerComptage(zoneId: number): Promise<void> {
    await axios.post(`${config.backend.baseURL}/session-inventaire/zones/${zoneId}/annuler-comptage`)
  }

  async function send(): Promise<{
    success: boolean
    inventory_id?: number
    submission_count?: number
    can_compare?: boolean
    error?: string
  }> {
    try {
      const response = await axios.post(
        `${config.backend.baseURL}/zone/process/${zone.value}`,
        {
          products: Array.from(products.value.values()).map(({ barcode, quantity, name, uom_id }) => ({
            barcode,
            quantity,
            name,
            uom_id,
          })),
        }
      )
      const zoneId = parseInt(zone.value, 10)
      zonesComptees.value.add(zoneId)
      localStorage.setItem('inventaire-zones-comptees', JSON.stringify([...zonesComptees.value]))
      return response.data
    } catch (error: any) {
      console.error(error)
      notify(error.message)
      return { success: false, error: error.message }
    }
  }

  return {
    zone,
    zones,
    zonesComptees,
    sessionCourante,
    products,
    fetchZones,
    fetchSessionCourante,
    debutComptage,
    annulerComptage,
    productsInfo,
    getProductInfo,
    saveZone,
    addProduct,
    removeProduct,
    reset,
    send,
  }
})
