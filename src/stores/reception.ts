import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'
import config from '@/config.ts'
import axios from 'axios'

export const useReceptionStore = defineStore('commandes', () => {
  const commandes: Ref<Map<string, MappedReceptionCommande> | null> = ref(null)
  const commandes_lines: Ref<Map<string, ReceptionCommandeLines>> = ref(new Map())

  async function getCommandes() {
    const response = await axios.get<ReceptionCommandeResponse[]>(`${config.backend.baseURL}/commandes/reception`)
    commandes.value = new Map(
      response.data.map((commande) => [
        commande.po,
        {
          po: commande.po,
          provider: commande.provider,
          date: new Date(commande.date),
          n_products: commande.n_products,
          statut: commande.statut ?? (commande.received ? 'soumise' : 'a_recevoir'),
        },
      ]),
    )
    return commandes.value
  }

  async function getCommande(po: string): Promise<ReceptionCommandeLines> {
    if (commandes_lines.value?.has(po)) {
      return commandes_lines.value.get(po)!
    }

    const response = await axios.get<ReceptionProduct[]>(`${config.backend.baseURL}/commande/info`, {
      params: { po },
    })

    const productsMap = new Map<string, ReceptionProduct>()
    for (const p of response.data) {
      if (p.barcode) productsMap.set(p.barcode, p)
      for (const alt of p.additional_barcodes ?? []) {
        if (alt) productsMap.set(alt, p)
      }
    }
    const commandeLines: ReceptionCommandeLines = { po, products: productsMap, allProducts: response.data }
    commandes_lines.value.set(po, commandeLines)
    return commandeLines
  }

  async function getProduct(po: string, barcode: string): Promise<ReceptionProduct | undefined> {
    if (commandes_lines.value?.has(po)) {
      return commandes_lines.value.get(po)?.products.get(barcode)
    }
    const commandeLines = await getCommande(po)
    return commandeLines.products.get(barcode)
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

    const response = await axios.post(`${config.backend.baseURL}/commandes/reception/process/${po}`, {
      products: commande.allProducts.map(
        ({ parcels, packSize, barcode, reception, name }) => {
          // received_quantity est toujours en UOM (pas en colis)
          const received_quantity =
            reception?.ok && reception?.received === undefined
              ? parcels * packSize         // OK sans saisie → total attendu en UOM
              : reception?.received        // anomalie → quantité saisie en UOM
          return {
            barcode,
            name,
            parcels,
            packSize,
            received_quantity: received_quantity?.toString(),
            ok: reception?.ok,
            comment: reception?.comment,
          }
        },
      ),
    })
    return response.data
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
