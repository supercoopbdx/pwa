import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import config from '@/config.ts'
import axios from 'axios'
import { useNotificationStore } from '@/stores/notifications.ts'

export const useReceptionStore = defineStore('commandes', () => {
  const { notify } = useNotificationStore()
  const commandes: Ref<Map<string, MappedReceptionCommande> | null> = ref(null)
  const commandes_lines: Ref<Map<string, ReceptionCommandeLines>> = ref(new Map())

  async function getCommandes() {

    commandes.value = await axios
      .get(`${config.backend.baseURL}/commandes/reception`)
      .then((response: { data: ReceptionCommandeResponse[] }) => {
        // TODO : handle errors
        return new Map(
          response.data.map((commande) => [
            commande.po,
            {
              po: commande.po,
              provider: commande.provider,
              date: new Date(commande.date),
              n_products: commande.n_products,
              is_already_processed: commande.received
            },
          ]),
        )
      })
      .catch((error) => {
        console.error(error)
        notify(error.message)
        return null
      })

    return commandes.value
  }


  async function getCommande(po: string): Promise<ReceptionCommandeLines | undefined> {
    try {
      // Si déjà en cache, retourne directement
      if (commandes_lines.value?.has(po)) {
        return commandes_lines.value.get(po)
      }

      const response = await axios.get<ReceptionProduct[]>(`${config.backend.baseURL}/commande/info`, {
        params: { po },
      })

      if (!response.data) return undefined

      // Transformer le tableau en Map
      const productsMap = new Map(response.data.map((p) => [p.barcode, p]))

      const commandeLines: ReceptionCommandeLines = { po, products: productsMap }

      commandes_lines.value.set(po, commandeLines)
      return commandeLines
    } catch (error: any) {
      console.error(error)
      notify(error.message)
      return undefined
    }
  }

  async function getProduct(po: string, barcode: string): Promise<ReceptionProduct | undefined> {
    // Si les lignes sont déjà en cache
    if (commandes_lines.value?.has(po)) {
      return commandes_lines.value.get(po)?.products.get(barcode)
    }

    // Sinon, récupérer depuis le backend et mettre en cache
    const commandeLines = await getCommande(po)
    return commandeLines?.products.get(barcode)
  }

  async function productCountValid(po: string, barcode: string) {
    const product = await getProduct(po, barcode)
    if (!product) throw new Error('product not found')
    product.reception = { ok: true }
  }

  async function productCountError(po: string, barcode: string, received: number, comment: string) {
    const product = await getProduct(po, barcode)
    if (!product) throw new Error('product not found')
    product.reception = { ok: false, received, comment }
  }

  async function sendCommande(po: string) {
    const commande = commandes_lines.value?.get(po)
    if (!commande) throw new Error('Commande non trouvée')
    // TODO : make this work in the backend
    return axios
      .post(`${config.backend.baseURL}/commandes/reception/process/${po}`, {
        products: Array.from(commande.products.values() ?? []).map(
          ({ parcels, packSize, barcode, reception, name }) => {
            const received_quantity = reception?.ok && reception?.received === undefined
            ? parcels
            : reception?.received;

            return {
              barcode,
              name: name,
              packsize: packSize,
              received_quantity: received_quantity?.toString(),
              ordered_quantity: parcels.toString(),
              ok: reception?.ok,
              comment: reception?.comment
            }
          },
        ),
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        console.error(error)
        notify(error.message)
      })
  }

  return {
    commandes,
    getCommandes,
    getCommande,
    getProduct,
    productCountValid,
    productCountError,
    sendCommande,
  }
})
