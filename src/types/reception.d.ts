type ReceptionProduct = {
  name: string
  barcode: string
  additional_barcodes: string[]
  image_url: string
  parcels: number
  packSize: number
  unit: string
  reception?: {
    ok: boolean,
    received?: number,
    comment?: string
  }
}

type ReceptionStatut = 'a_recevoir' | 'soumise'

type MappedReceptionCommande = {
  po: string
  provider: string
  date: Date
  n_products: number
  statut: ReceptionStatut
}

type ReceptionCommandeLines = {
  po: string
  products: Map<string, ReceptionProduct>  // barcode → product, pour lookup pendant le scan
  allProducts: ReceptionProduct[]          // liste complète pour l'affichage et l'envoi
}

type ReceptionCommandeResponse = {
  po: string
  provider: string
  date: Date
  n_products: number
  received: boolean
  statut: ReceptionStatut
}
