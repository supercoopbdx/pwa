type ReceptionProduct = {
  name: string
  barcode: string
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

type MappedReceptionCommande = {
  po: string
  provider: string
  date: Date
  n_products: number
  is_already_processed: boolean
}

type ReceptionCommandeLines = {
  po : string,
  products: Map<string, ReceptionProduct>
}


type ReceptionCommandeResponse = {
  po: string
  provider: string
  date: Date
  n_products: number
  received : boolean

}
