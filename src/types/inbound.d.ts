type InboundProduct = {
  name: string
  barcode: string
  image_url: string
  parcels: number
  packSize: number
  inbound?: {
    ok: boolean,
    received?: number,
    comment?: string
  }
}

type MappedInboundOrder = {
  po: string
  provider: string
  date: Date
  n_products: number
  is_already_processed: boolean
}

type InboundOrderLines = {
  po : string,
  products: Map<string, InboundProduct>
}


type InboundOrderResponse = {
  po: string
  provider: string
  date: Date
  n_products: number
  received : boolean

}
