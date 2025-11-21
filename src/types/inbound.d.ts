type InboundProduct = {
  name: string
  barcode: string
  image: string
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
}
