type ReceptionProduct = {
  name: string
  barcode: string
  image_url: string
  parcels: number
  packSize: number
  reception?: {
    ok: boolean,
    received?: number,
    comment?: string
  }
}

type MappedReceptionOrder = {
  po: string
  provider: string
  date: Date
  n_products: number
  is_already_processed: boolean
}

type ReceptionOrderLines = {
  po : string,
  products: Map<string, ReceptionProduct>
}


type ReceptionOrderResponse = {
  po: string
  provider: string
  date: Date
  n_products: number
  received : boolean

}
